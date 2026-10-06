import fs from 'fs';

const path = 'server/order-service.js';
let content = fs.readFileSync(path, 'utf8');

const replacement = `
  async function requestReturn(id, { slug, size, qty, reason, exchangeForSize, adminUser }) {
    return repository.transaction(async tx => {
      const order = await tx.find({ _id: id });
      if (!order) throw problem(404, 'Order not found.');
      if (order.fulfilmentStatus !== 'shipped' && order.fulfilmentStatus !== 'delivered' && order.fulfilmentStatus !== 'legacy_fulfilled') {
        throw problem(409, 'Only shipped or delivered orders can be returned.');
      }
      
      const line = order.lines.find(l => l.slug === slug && l.size === size);
      if (!line) throw problem(404, 'Item not found in order.');
      if (qty > line.qty) throw problem(400, 'Return quantity exceeds purchased quantity.');
      
      // If exchange, check stock and reserve
      if (exchangeForSize) {
        if (!sizes.includes(exchangeForSize)) throw problem(400, 'Invalid exchange size.');
        // Reserve the new size
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

      ret.status = status;
      if (adminNotes) ret.adminNotes = adminNotes;
      
      if (status === 'restocked') {
        // Restock logic
        await tx.release({ slug: ret.slug, size: ret.size, qty: ret.qty });
      } else if (status === 'rejected' && ret.exchangeForSize) {
        // Release the reserved exchange stock since it's rejected
        await tx.release({ slug: ret.slug, size: ret.exchangeForSize, qty: ret.qty });
      }

      order.activityHistory.push({ action: \`return_\${status}\`, adminUser, timestamp: now() });
      await tx.save(order);
      return order;
    });
  }
`;

content = content.replace(/async function reconcilePayment\(id, adminUser\) \{/, replacement + '\n  async function reconcilePayment(id, adminUser) {');
content = content.replace(/return \{create,captured,cancel,adminUpdate,ship,refund,reconcilePayment,reconcileExpired\};/, 'return {create,captured,cancel,adminUpdate,ship,refund,reconcilePayment,requestReturn,processReturn,reconcileExpired};');

fs.writeFileSync(path, content, 'utf8');
