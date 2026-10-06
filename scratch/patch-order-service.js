import fs from 'fs';

const path = 'server/order-service.js';
let content = fs.readFileSync(path, 'utf8');

const replacement = `
  async function adminUpdate(id,{paymentStatus,fulfilmentStatus,trackingDetails,adminUser}) {
    if(paymentStatus==='cancelled')return cancel({_id:id}, {adminUser});
    return repository.transaction(async tx=>{
      const order=await tx.find({_id:id});if(!order)throw problem(404,'Order not found.');
      if (paymentStatus && paymentStatus !== order.paymentStatus) {
        order.paymentStatus = paymentStatus;
        order.activityHistory.push({ action: \`payment_status_updated_\${paymentStatus}\`, adminUser, timestamp: now() });
      }
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

      // In real life we would call gateway here, e.g. gateway.orders.refund(order.paymentId, amount)
      let providerRefundId = \`ref_\${randomUUID()}\`; // Simulated

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
        if (['paid','review_required'].includes(order.paymentStatus)) {
          return order; // Already recorded
        }
        order.paymentId = payment.id;
        order.paidAt = now();
        order.paymentStatus = order.stockReleased || order.paymentStatus === 'cancelled' ? 'review_required' : 'paid';
        order.activityHistory.push({ action: 'reconciled_captured', adminUser, timestamp: now() });
      } else {
        order.activityHistory.push({ action: 'reconciled_no_capture', adminUser, timestamp: now() });
      }
      
      await tx.save(order);
      return order;
    });
  }
`;

content = content.replace(/async function adminUpdate\(id,\{paymentStatus,fulfilmentStatus,trackingDetails,adminUser\}\) \{[\s\S]*?return order;\n    \}\);\n  \}/, replacement);
content = content.replace(/return \{create,captured,cancel,adminUpdate,reconcileExpired\};/, 'return {create,captured,cancel,adminUpdate,ship,refund,reconcilePayment,reconcileExpired};');

fs.writeFileSync(path, content, 'utf8');
