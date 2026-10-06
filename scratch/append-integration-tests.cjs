const fs = require('fs');
const file = 'C:/Users/AJITH/OneDrive/Documents/New project/server/order-integration.test.js';
let content = fs.readFileSync(file, 'utf8');

const newTests = `
  await t.test('concurrent refunds do not exceed order total', async () => {
    const { service } = await setup();
    const o = await service.create(input);
    await service.captured(payment(o));
    
    // Attempt two concurrent refunds of 60000 paise (total is 79900)
    const results = await Promise.allSettled([
      service.refund(o._id, { amount: 60000, reason: 'r1', idempotencyKey: 'idem-1', adminUser: 'a' }),
      service.refund(o._id, { amount: 60000, reason: 'r2', idempotencyKey: 'idem-2', adminUser: 'a' })
    ]);
    
    assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
    const updated = await Order.findById(o._id);
    assert.equal(updated.refunds.length, 1);
    assert.equal(updated.refunds[0].amount, 60000);
  });

  await t.test('concurrent return restocking restores inventory accurately', async () => {
    const { service } = await setup();
    const o = await service.create(input);
    await service.captured(payment(o));
    await service.ship(o._id, { courier: 'Test', trackingNumber: '123' });
    
    await service.requestReturn(o._id, { slug: 'test-shirt', size: 'M', qty: 1, reason: 'fit' });
    const orderWithReturn = await Order.findById(o._id);
    const retId = orderWithReturn.returns[0]._id;
    
    await service.processReturn(o._id, retId, { status: 'approved' });
    await service.processReturn(o._id, retId, { status: 'inspected' });
    
    // Concurrently try to mark restocked
    await Promise.allSettled([
      service.processReturn(o._id, retId, { status: 'restocked' }),
      service.processReturn(o._id, retId, { status: 'restocked' })
    ]);
    
    const finalOrder = await Order.findById(o._id);
    assert.equal(finalOrder.returns[0].status, 'restocked');
    
    // Stock should be 1 (started at 1, checkout brought to 0, restock brings to 1)
    const p = await Product.findOne({ slug: 'test-shirt' });
    assert.equal(p.stock.M, 1);
  });
`;

content = content.replace(/\}finally\{await mongoose\.disconnect\(\);\}/, newTests.trim() + '\n }finally{await mongoose.disconnect();}');
fs.writeFileSync(file, content);
