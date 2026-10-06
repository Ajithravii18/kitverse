import fs from 'fs';

const path = 'server/order-service.js';
let content = fs.readFileSync(path, 'utf8');

const replacement = `
  async function adminUpdate(id,{fulfilmentStatus,trackingDetails,adminUser}) {
    return repository.transaction(async tx=>{
      const order=await tx.find({_id:id});if(!order)throw problem(404,'Order not found.');
      if(fulfilmentStatus && fulfilmentStatus!==order.fulfilmentStatus){
        if(fulfilmentStatus!=='unfulfilled' && order.paymentStatus!=='paid')throw problem(409,'Only paid orders can be fulfilled.');
        order.fulfilmentStatus=fulfilmentStatus;
        order.activityHistory.push({ action: \`fulfilment_updated_\${fulfilmentStatus}\`, adminUser, timestamp: now() });
      }
      if(trackingDetails!==undefined){if(typeof trackingDetails!=='string'||trackingDetails.length>2000)throw problem(400,'Invalid tracking details.');order.trackingDetails=trackingDetails;}
      await tx.save(order);return order;
    });
  }

  async function ship(id, { courier, trackingNumber, trackingUrl, adminUser }) {
    if (!courier || !trackingNumber) throw problem(400, 'Courier and tracking number are required to ship.');
    return repository.transaction(async tx => {
      const order = await tx.find({ _id: id });
      if (!order) throw problem(404, 'Order not found.');
      if (order.paymentStatus !== 'paid') throw problem(409, 'Only paid orders can be shipped.');
      if (order.fulfilmentStatus === 'shipped' || order.fulfilmentStatus === 'delivered') throw problem(409, 'Order is already shipped or delivered.');
      
      order.shipping = {
        courier,
        trackingNumber,
        trackingUrl,
        packedAt: now(),
        dispatchedAt: now()
      };
      order.fulfilmentStatus = 'shipped';
      order.activityHistory.push({ action: 'shipped', adminUser, timestamp: now() });
      await tx.save(order);
      return order;
    });
  }

  async function refund(id, { amount, reason, idempotencyKey, adminUser }) {
    if (!amount || typeof amount !== 'number' || amount <= 0) throw problem(400, 'Invalid refund amount.');
    if (!reason) throw problem(400, 'Refund reason is required.');
    
    return repository.transaction(async tx => {
      const order = await tx.find({ _id: id });
      if (!order) throw problem(404, 'Order not found.');
      if (order.paymentStatus !== 'paid' && order.paymentStatus !== 'review_required' && order.paymentStatus !== 'partially_refunded') {
        throw problem(409, 'Cannot refund this order state.');
      }
      
      const existingRefund = order.refunds.find(r => r.idempotencyKey === idempotencyKey);
      if (existingRefund) return order; // Idempotent success
      
      const totalRefunded = order.refunds.filter(r => r.status === 'processed').reduce((s, r) => s + r.amount, 0);
      if (totalRefunded + amount > order.total) throw problem(400, 'Refund amount exceeds order total.');

      let providerRefundId;
      try {
        const refundResponse = await gateway.payments.refund(order.paymentId, { amount, notes: { reason, orderId: order._id.toString() } });
        providerRefundId = refundResponse.id;
      } catch (err) {
        throw problem(503, 'Gateway refund failed: ' + (err.description || err.message || 'Unknown error'));
      }

      order.refunds.push({
        amount,
        reason,
        providerRefundId,
        status: 'processed',
        idempotencyKey,
        adminUser,
        createdAt: now()
      });

      if (totalRefunded + amount >= order.total) {
        order.paymentStatus = 'refunded';
      } else {
        order.paymentStatus = 'partially_refunded';
      }

      order.activityHistory.push({ action: \`refunded_\${amount}\`, adminUser, timestamp: now() });
      await tx.save(order);
      return order;
    });
  }

  async function reconcilePayment(id, adminUser) {
    return repository.transaction(async tx => {
      const order = await tx.find({ _id: id });
      if (!order) throw problem(404, 'Order not found.');
      if (!order.paymentIntentId) throw problem(400, 'No payment intent to reconcile.');
      
      const response = await gateway.orders.fetchPayments(order.paymentIntentId);
      const payment = response.items?.find(p => p.status === 'captured');
      
      if (payment) {
        if (order.paymentStatus === 'paid') return order; // Already reconciled correctly
        order.paymentId = payment.id;
        order.paidAt = now();
        order.paymentStatus = 'paid';
        order.activityHistory.push({ action: 'reconciled_captured', adminUser, timestamp: now() });
      } else {
        order.activityHistory.push({ action: 'reconciled_no_capture', adminUser, timestamp: now() });
      }
      
      await tx.save(order);
      return order;
    });
  }

  async function requestReturn(id, { slug, size, qty, reason, exchangeForSize, adminUser }) {
    return repository.transaction(async tx => {
      const order = await tx.find({ _id: id });
      if (!order) throw problem(404, 'Order not found.');
      if (order.fulfilmentStatus !== 'shipped' && order.fulfilmentStatus !== 'delivered' && order.fulfilmentStatus !== 'legacy_fulfilled') {
        throw problem(409, 'Only shipped or delivered orders can be returned.');
      }
      
      const line = order.lines.find(l => l.slug === slug && l.size === size);
      if (!line) throw problem(404, 'Item not found in order.');
      
      const existingReturnedQty = order.returns
        .filter(r => r.slug === slug && r.size === size && r.status !== 'rejected')
        .reduce((sum, r) => sum + r.qty, 0);

      if (existingReturnedQty + qty > line.qty) throw problem(400, 'Return quantity exceeds purchased quantity.');
      
      if (exchangeForSize) {
        if (!sizes.includes(exchangeForSize)) throw problem(400, 'Invalid exchange size.');
        await tx.reserve({ slug, size: exchangeForSize, qty });
      }

      order.returns.push({
        slug,
        size,
        qty,
        reason,
        status: 'requested',
        exchangeForSize,
        createdAt: now()
      });

      order.activityHistory.push({ action: \`return_requested_\${slug}\`, adminUser, timestamp: now() });
      await tx.save(order);
      return order;
    });
  }

  async function processReturn(id, { returnId, status, adminNotes, adminUser }) {
    if (!['approved', 'inspected', 'rejected', 'restocked'].includes(status)) throw problem(400, 'Invalid return status.');
    return repository.transaction(async tx => {
      const order = await tx.find({ _id: id });
      if (!order) throw problem(404, 'Order not found.');
      
      const ret = order.returns.id ? order.returns.id(returnId) : order.returns.find(r => r._id.toString() === returnId);
      if (!ret) throw problem(404, 'Return record not found.');
      if (ret.status === 'restocked' || ret.status === 'rejected') throw problem(409, 'Return is already finalized.');

      // State machine constraints
      if (status === 'approved' && ret.status !== 'requested') throw problem(409, 'Can only approve requested returns.');
      if (status === 'inspected' && ret.status !== 'approved') throw problem(409, 'Can only inspect approved returns.');
      if (status === 'restocked' && ret.status !== 'inspected') throw problem(409, 'Can only restock inspected returns.');

      ret.status = status;
      if (adminNotes) ret.adminNotes = adminNotes;
      
      if (status === 'restocked') {
        await tx.release({ slug: ret.slug, size: ret.size, qty: ret.qty });
      } else if (status === 'rejected' && ret.exchangeForSize) {
        await tx.release({ slug: ret.slug, size: ret.exchangeForSize, qty: ret.qty });
      }

      order.activityHistory.push({ action: \`return_\${status}\`, adminUser, timestamp: now() });
      await tx.save(order);
      return order;
    });
  }
`;

content = content.replace(/async function adminUpdate[\s\S]*?async function processReturn[\s\S]*?return order;\n    \}\);\n  \}/, replacement);

fs.writeFileSync(path, content, 'utf8');
