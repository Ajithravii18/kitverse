import fs from 'fs';

const path = 'server/order-service.js';
let content = fs.readFileSync(path, 'utf8');

const deliverReplacement = `
  async function deliver(id, { adminUser }) {
    return repository.transaction(async tx => {
      const order = await tx.find({ _id: id });
      if (!order) throw problem(404, 'Order not found.');
      if (order.fulfilmentStatus !== 'shipped' && order.fulfilmentStatus !== 'legacy_fulfilled') {
        throw problem(409, 'Only shipped orders can be marked delivered.');
      }
      
      order.fulfilmentStatus = 'delivered';
      if (order.shipping) order.shipping.deliveredAt = now();
      order.activityHistory.push({ action: 'delivered', adminUser, timestamp: now() });
      await tx.save(order);
      return order;
    });
  }

  async function refund(id, { amount, reason, idempotencyKey, adminUser }) {
`;

content = content.replace(/async function refund\(id, \{ amount, reason, idempotencyKey, adminUser \}\) \{/, deliverReplacement);
content = content.replace(/return \{create,captured,cancel,adminUpdate,ship,refund/, 'return {create,captured,cancel,adminUpdate,ship,deliver,refund');

fs.writeFileSync(path, content, 'utf8');
