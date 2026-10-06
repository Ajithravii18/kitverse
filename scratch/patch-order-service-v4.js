import fs from 'fs';

const path = 'server/order-service.js';
let content = fs.readFileSync(path, 'utf8');

const refundReplacement = `
  async function refund(id, { amount, reason, idempotencyKey, adminUser }) {
    if (!amount || typeof amount !== 'number' || amount <= 0) throw problem(400, 'Invalid refund amount.');
    if (!reason) throw problem(400, 'Refund reason is required.');
    
    let preflight = await repository.transaction(async tx => {
      const order = await tx.find({ _id: id });
      if (!order) throw problem(404, 'Order not found.');
      if (!['paid', 'review_required', 'partially_refunded'].includes(order.paymentStatus)) {
        throw problem(409, 'Cannot refund this order state.');
      }
      
      let existingRefund = order.refunds.find(r => r.idempotencyKey === idempotencyKey);
      if (existingRefund) {
        if (existingRefund.amount !== amount) throw problem(400, 'Idempotency key reused with different amount.');
        if (existingRefund.status === 'processed') return { order, idempotent: true };
        if (existingRefund.status === 'pending') {
          throw problem(409, 'Refund is currently pending provider confirmation. Please reconcile the payment.');
        }
        if (existingRefund.status === 'failed') {
          const allocated = order.refunds.filter(r => r.status === 'processed' || r.status === 'pending').reduce((s, r) => s + r.amount, 0);
          if (allocated + amount > order.total) throw problem(400, 'Refund amount exceeds order total.');
          existingRefund.status = 'pending';
          existingRefund.createdAt = now();
        }
      } else {
        const allocated = order.refunds.filter(r => r.status === 'processed' || r.status === 'pending').reduce((s, r) => s + r.amount, 0);
        if (allocated + amount > order.total) throw problem(400, 'Refund amount exceeds order total.');

        order.refunds.push({
          amount, reason, status: 'pending', idempotencyKey, adminUser, createdAt: now()
        });
      }
      
      await tx.save(order);
      return { order, idempotent: false };
    });

    if (preflight.idempotent) return preflight.order;

    let providerRefundId;
    let refundStatus = 'failed';
    try {
      const refundResponse = await gateway.payments.refund(preflight.order.paymentId, { 
        amount, 
        notes: { reason, orderId: preflight.order._id.toString(), idempotencyKey } 
      });
      providerRefundId = refundResponse.id;
      refundStatus = refundResponse.status === 'processed' ? 'processed' : (refundResponse.status || 'pending');
    } catch (err) {
      throw problem(503, 'Gateway refund failed or timed out: ' + (err.description || err.message || 'Unknown error'));
    }

    return repository.transaction(async tx => {
      const order = await tx.find({ _id: id });
      const refundRecord = order.refunds.find(r => r.idempotencyKey === idempotencyKey);
      if (refundRecord && (refundRecord.status === 'pending' || refundStatus === 'processed')) {
        refundRecord.providerRefundId = providerRefundId;
        refundRecord.status = refundStatus;

        if (refundStatus === 'processed') {
          const totalRefunded = order.refunds.filter(r => r.status === 'processed').reduce((s, r) => s + r.amount, 0);
          if (totalRefunded >= order.total) order.paymentStatus = 'refunded';
          else order.paymentStatus = 'partially_refunded';
          order.activityHistory.push({ action: \`refunded_\${amount}\`, adminUser, timestamp: now() });
        }
        await tx.save(order);
      }
      return order;
    });
  }
`;

const reconcileReplacement = `
      if (order.paymentId && order.refunds.some(r => r.status === 'pending')) {
        try {
          const refundRes = await gateway.payments.fetchRefunds(order.paymentId);
          const providerRefunds = Array.isArray(refundRes.items) ? refundRes.items : (Array.isArray(refundRes) ? refundRes : []);
          
          for (const r of order.refunds) {
            if (r.status === 'pending') {
              const match = providerRefunds.find(pr => pr.notes && pr.notes.idempotencyKey === r.idempotencyKey);
              if (match) {
                r.providerRefundId = match.id;
                r.status = match.status === 'processed' ? 'processed' : (match.status || 'pending');
                changed = true;
              } else {
                const age = (+now()) - new Date(r.createdAt).getTime();
                if (age > 15 * 60000) {
                  r.status = 'failed';
                  changed = true;
                }
              }
            }
          }
        } catch (err) {
          // ignore provider fetch errors
        }
      }
`;

content = content.replace(/async function refund[\s\S]*?async function reconcilePayment/, refundReplacement + '\n  async function reconcilePayment');
content = content.replace(/if \(order\.paymentId && order\.refunds\.some\(r => r\.status === 'pending'\)\) \{[\s\S]*?\} catch \(err\) \{\s*\/\/ ignore provider fetch errors\s*\}\s*\}/, reconcileReplacement.trim());

fs.writeFileSync(path, content, 'utf8');
