import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { Order, Product, User, Review, Discount, Notification } from './models.js';
import { createApp } from './app.js';
import { processNotifications, sendNotification, notificationTransport } from './notification-service.js';

const PWD_HASH = await bcrypt.hash('testpass', 4);

test('Stage 4 Behavioral Integration Tests (Live Routes & Workers)', { skip: !process.env.TEST_MONGODB_URI, timeout: 45000 }, async t => {
  await mongoose.connect(process.env.TEST_MONGODB_URI);
  assert.equal(mongoose.connection.name, 'kitverse_audit');
  
  await Promise.all([Order.init(), Product.init(), User.init(), Review.init(), Discount.init(), Notification.init()]);

  const app = await createApp({ paymentClient: {
    orders: { create: async () => ({ id: 'pay_123' }), fetchPayments: async () => ({ items: [] }) },
    payments: { refund: async () => ({ id: 'ref_123', status: 'processed' }) }
  } });
  
  let server;
  let baseUrl;
  
  await new Promise(resolve => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      resolve();
    });
  });

  t.after(async()=>{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));await mongoose.disconnect();});
  const setup = async () => {
    await Promise.all([
      Order.deleteMany({}), Product.deleteMany({}), User.deleteMany({}),
      Review.deleteMany({}), Discount.deleteMany({}), Notification.deleteMany({})
    ]);
  };
  
  const login = async (role, permissions = []) => {
    const email = `${role}-${Math.random()}@test.com`;
    await User.create({ email, passwordHash: PWD_HASH, role, permissions });
    const res = await fetch(`${baseUrl}/api/admin/login`, {
      signal:AbortSignal.timeout(5000),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'testpass' })
    });
    assert.equal(res.status,200,'Test account login must succeed');
    const cookie = res.headers.get('set-cookie')?.split(';')[0];
    return cookie;
  };

  await t.test('Review rewards exactly-once via actual route', async () => {
    await setup();
    const adminCookie = await login('admin');
    
    const product = await Product.create({ slug: 'test-item', name: 'Test', price: 100, quality: 'Embroidery', category: 'club' });
    const user = await User.create({ email: 'rev@test.com', passwordHash: PWD_HASH, role: 'customer' });
    
    const review = await Review.create({
      productId: product._id, userId: user._id, rating: 5, text: 'Great!', status: 'pending'
    });

    // 1. Approve
    let res = await fetch(`${baseUrl}/api/admin/reviews/${review._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie },
      body: JSON.stringify({ status: 'approved' })
    });
    assert.equal(res.status, 200);
    assert.equal(await Discount.countDocuments(), 1, 'First approval creates a discount');

    // 2. Reject
    await fetch(`${baseUrl}/api/admin/reviews/${review._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie },
      body: JSON.stringify({ status: 'rejected' })
    });
    
    // 3. Approve again concurrently (simulate race condition)
    await Promise.all([
      fetch(`${baseUrl}/api/admin/reviews/${review._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie },
        body: JSON.stringify({ status: 'approved' })
      }),
      fetch(`${baseUrl}/api/admin/reviews/${review._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie },
        body: JSON.stringify({ status: 'approved' })
      })
    ]);
    
    assert.equal(await Discount.countDocuments(), 1, 'Subsequent approvals do NOT create extra discounts');
  });

  await t.test('Profit report explicitly marks profit unavailable if costs are missing', async () => {
    await setup();
    const adminCookie = await login('admin');
    
    // Order 1: With cost
    await Order.create({
      orderRef: 'ORD-1', userId: new mongoose.Types.ObjectId(), checkoutKey: 'k1', fingerprint: 'f1', customer: { firstName: 'A', lastName: 'B', email: 'a@b.c', phone: '123', country: 'IN', streetAddress: '1', city: 'C', state: 'S', postcode: '1' },
      lines: [{ slug: 'a', name: 'A', size: 'M', qty: 1, price: 1000, costPrice: 600 }], subtotal: 1000, discountAmount: 0, total: 1000, paymentStatus: 'paid', fulfilmentStatus: 'unfulfilled', expiresAt: new Date()
    });

    let res = await fetch(`${baseUrl}/api/admin/reports/sales`, { headers: { 'Cookie': adminCookie } });
    let data = await res.json();
    assert.equal(data.profit, 400, 'Calculates correct profit when costs are complete');

    // Order 2: Missing cost
    await Order.create({
      orderRef: 'ORD-2', userId: new mongoose.Types.ObjectId(), checkoutKey: 'k2', fingerprint: 'f2', customer: { firstName: 'A', lastName: 'B', email: 'a@b.c', phone: '123', country: 'IN', streetAddress: '1', city: 'C', state: 'S', postcode: '1' },
      lines: [{ slug: 'b', name: 'B', size: 'M', qty: 1, price: 1000 }], subtotal: 1000, discountAmount: 0, total: 1000, paymentStatus: 'paid', fulfilmentStatus: 'unfulfilled', expiresAt: new Date()
    });

    res = await fetch(`${baseUrl}/api/admin/reports/sales`, { headers: { 'Cookie': adminCookie } });
    data = await res.json();
    assert.equal(data.profit, null, 'Profit is null (unavailable) when any costs are missing');
    assert.equal(data.totals.totalMissingCostItems, 1);
  });

  await t.test('Granular permissions enforce authorization accurately', async () => {
    await setup();
    
    // Need a product and order to test
    await Product.create({ slug: 'test-product', name: 'Test', price: 100, quality: 'Embroidery', category: 'club' });
    const order = await Order.create({
      orderRef: 'ORD-1', userId: new mongoose.Types.ObjectId(), checkoutKey: 'k1', fingerprint: 'f1', customer: { firstName: 'A', lastName: 'B', email: 'a@b.c', phone: '123', country: 'IN', streetAddress: '1', city: 'C', state: 'S', postcode: '1' },
      lines: [], subtotal: 1000, discountAmount: 0, total: 1000, paymentStatus: 'paid', paymentIntentId: 'pay_123', fulfilmentStatus: 'unfulfilled', expiresAt: new Date()
    });
    
    const noPermCookie = await login('staff', []);
    const financeCookie = await login('staff', ['finance']);
    const inventoryCookie = await login('staff', ['inventory']);
    const adminCookie = await login('admin');

    // Test Finance Route (Reconcile)
    const urlFinance = `${baseUrl}/api/admin/orders/${order._id}/reconcile`;
    assert.equal((await fetch(urlFinance, { method: 'POST', headers: { 'Cookie': noPermCookie } })).status, 403);
    assert.equal((await fetch(urlFinance, { method: 'POST', headers: { 'Cookie': inventoryCookie } })).status, 403);
    assert.equal((await fetch(urlFinance, { method: 'POST', headers: { 'Cookie': financeCookie } })).status, 200);
    
    // Test Inventory Route (Products)
    const urlInventory = `${baseUrl}/api/admin/products`;
    assert.equal((await fetch(urlInventory, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Cookie': noPermCookie }, body: JSON.stringify({ slug: 'new-1', name: 'New 1', price: 100, quality: 'Embroidery', category: 'club' }) })).status, 403);
    assert.equal((await fetch(urlInventory, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Cookie': financeCookie }, body: JSON.stringify({ slug: 'new-2', name: 'New 2', price: 100, quality: 'Embroidery', category: 'club' }) })).status, 403);
    assert.equal((await fetch(urlInventory, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Cookie': inventoryCookie }, body: JSON.stringify({ slug: 'new-3', name: 'New 3', price: 100, quality: 'Embroidery', category: 'club' }) })).status, 200);
  });

  await t.test('Concurrent notification workers process atomically without duplicate sends', async () => {
    await setup();
    await Notification.create([
      { type: 'test1', email: 'test1@example.com', subject: 'Test1', body: 'Test1', status: 'pending' },
      { type: 'test2', email: 'test2@example.com', subject: 'Test2', body: 'Test2', status: 'pending' }
    ]);
    
    // Spawn 5 concurrent workers
    const workers = Array(5).fill(0).map(() => processNotifications({transport:{sendMail:async()=>({accepted:['test@example.com']})},from:'test@example.com'}));
    await Promise.all(workers);
    
    const sent = await Notification.find({ status: 'sent' });
    assert.equal(sent.length, 2, 'Both notifications are sent');
    
    // Total attempts across all should be exactly 2, proving no duplicate processing
    const totalAttempts = sent.reduce((sum, n) => sum + n.attempts, 0);
    assert.equal(totalAttempts, 2, 'No concurrent duplicate attempts occurred');
  });


  await t.test('Notification insert rolls back with aborted commerce transaction',async()=>{
    await setup();
    await assert.rejects(mongoose.connection.transaction(async session=>{
      await sendNotification('shipment',{_id:new mongoose.Types.ObjectId(),orderRef:'ROLLBACK',customer:{email:'test@example.com'}},{courier:'Test',trackingNumber:'Test'},session);
      throw new Error('Abort commerce');
    }),/Abort commerce/);
    assert.equal(await Notification.countDocuments(),0);
  });
  await t.test('Worker recovers expired claim and ignores stale ownership on completion',async()=>{
    await setup();
    const n=await Notification.create({type:'shipment',email:'test@example.com',subject:'test',body:'test',status:'processing',attempts:1,leaseToken:'old',leaseUntil:new Date(0)});
    await processNotifications({from:'test@example.com',transport:{sendMail:async()=>{
      await Notification.updateOne({_id:n._id},{$set:{leaseToken:'new-owner',leaseUntil:new Date(Date.now()+300000)}});
    }}});
    const current=await Notification.findById(n._id);
    assert.equal(current.attempts,2);
    assert.equal(current.leaseToken,'new-owner');
    assert.equal(current.status,'processing');
  });
  await t.test('Failed delivery waits before retry and missing SMTP never pretends to send',async()=>{
    await setup();
    assert.throws(()=>notificationTransport({}),/Configure SMTP/);
    const n=await Notification.create({type:'shipment',email:'test@example.com',subject:'test',body:'test'});
    let calls=0;const opts={from:'test@example.com',transport:{sendMail:async()=>{calls++;throw new Error('test outage');}}};
    await processNotifications(opts);await processNotifications(opts);
    assert.equal(calls,1);
    const current=await Notification.findById(n._id);
    assert.equal(current.status,'failed');assert.equal(current.attempts,1);
  });

});
