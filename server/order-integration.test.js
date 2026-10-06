import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import {Order,Product,User} from './models.js';
import {createOrderService} from './order-service.js';
import {consumeOtp} from './otp.js';

test('MongoDB replica-set integration', {skip:!process.env.TEST_MONGODB_URI},async t=>{
 await mongoose.connect(process.env.TEST_MONGODB_URI);
 // This suite must never operate on the store database.
 assert.equal(mongoose.connection.name,'kitverse_audit');
 try{
  await Promise.all([Order.init(),Product.init(),User.init()]);
  let seq=0;
  const customer={firstName:'Test',lastName:'Buyer',country:'India',streetAddress:'1 Test Street',city:'Chennai',state:'Tamil Nadu',postcode:'600001',phone:'9000000000',email:'test@example.invalid'};
  const input={userId:new mongoose.Types.ObjectId(),checkoutKey:'audit-key-123456789',customer,items:[{slug:'test-shirt',size:'M',qty:1}]};
  const setup=async()=>{
   await Promise.all([Order.deleteMany({}),Product.deleteMany({})]);
   await Product.create({slug:'test-shirt',name:'Test shirt',price:79900,quality:'Embroidery',category:'club',stock:{M:1}});
   const gateway={orders:{create:async()=>({id:`provider-${++seq}`}),fetchPayments:async()=>({items:[]})},payments:{refund:async()=>({id:'ref-1',status:'processed'})}};
   return {service:createOrderService({gateway}),gateway};
  };
  const stock=async()=>(await Product.findOne({slug:'test-shirt'})).stock.M;
  const payment=o=>({id:'pay-'+o.paymentIntentId,order_id:o.paymentIntentId,amount:o.total,currency:'INR',status:'captured'});
  await t.test('two customers competing for the last size cannot oversell',async()=>{
   const {service}=await setup();const results=await Promise.allSettled([service.create(input),service.create({...input,userId:new mongoose.Types.ObjectId(),checkoutKey:'different-key-123456'})]);
   assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal(await stock(),0);assert.equal(await Order.countDocuments(),1);
  });
  await t.test('later item failure aborts previous stock deduction',async()=>{
   const {service}=await setup();await assert.rejects(service.create({...input,items:[...input.items,{slug:'z-missing',size:'M',qty:1}]}));assert.equal(await stock(),1);assert.equal(await Order.countDocuments(),0);
  });
  await t.test('provider failure restores inventory through a transaction',async()=>{
   const {service,gateway}=await setup();gateway.orders.create=async()=>{throw Error('test outage');};await assert.rejects(service.create(input));assert.equal(await stock(),1);assert.equal((await Order.findOne()).paymentStatus,'cancelled');
  });
  await t.test('concurrent cancellation releases once in the real database',async()=>{
   const {service}=await setup();const o=await service.create(input);await Promise.all([service.cancel({orderRef:o.orderRef}),service.cancel({orderRef:o.orderRef})]);assert.equal(await stock(),1);
  });
  await t.test('capture racing cancellation preserves a recorded paid state',async()=>{
   const {service}=await setup();const o=await service.create(input);await Promise.allSettled([service.cancel({orderRef:o.orderRef}),service.captured(payment(o))]);
   const actual=await Order.findOne();assert.ok(['paid','review_required'].includes(actual.paymentStatus));assert.equal(await stock(),actual.paymentStatus==='paid'?0:1);
  });
  await t.test('duplicate captures and checkout retries are idempotent',async()=>{
   const {service}=await setup();const o=await service.create(input);const retry=await service.create(input);assert.equal(retry.orderRef,o.orderRef);
   await Promise.all([service.captured(payment(o)),service.captured(payment(o))]);assert.equal(await stock(),0);assert.equal((await Order.findOne()).paymentStatus,'paid');
  });
  await t.test('concurrent wrong OTP attempts are capped in MongoDB',async()=>{
   await User.deleteMany({});const user=await User.create({email:'otp@example.invalid',passwordHash:'test-hash',otp:'123456',otpPurpose:'verification',otpExpires:new Date(Date.now()+60000)});
   await Promise.allSettled(Array.from({length:12},()=>consumeOtp({email:user.email,otp:'000000',purpose:'verification',changes:{}})));
   const after=await User.findById(user._id);assert.equal(after.otpAttempts,5);assert.equal(after.otp,undefined);
  });
 await t.test('concurrent refunds do not exceed order total', async () => {
    const { service } = await setup();
    const o = await service.create(input);
    await service.captured(payment(o));
    
    // Attempt two concurrent refunds of 60000 paise (total is 79900)
    const results = await Promise.allSettled([
      service.refund(o._id, { amount: 60000, reason: 'r1', idempotencyKey: 'idem-1', adminUser: new mongoose.Types.ObjectId() }),
      service.refund(o._id, { amount: 60000, reason: 'r2', idempotencyKey: 'idem-2', adminUser: new mongoose.Types.ObjectId() })
    ]);
    
    console.log(results.filter(r => r.status === 'rejected').map(r => r.reason)); assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
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
    
    await service.processReturn(o._id, { returnId: retId, status: 'approved' });
    await service.processReturn(o._id, { returnId: retId, status: 'inspected' });
    
    // Concurrently try to mark restocked
    await Promise.allSettled([
      service.processReturn(o._id, { returnId: retId, status: 'restocked' }),
      service.processReturn(o._id, { returnId: retId, status: 'restocked' })
    ]);
    
    const finalOrder = await Order.findById(o._id);
    assert.equal(finalOrder.returns[0].status, 'restocked');
    
    // Stock should be 1 (started at 1, checkout brought to 0, restock brings to 1)
    const p = await Product.findOne({ slug: 'test-shirt' });
    assert.equal(p.stock.M, 1);
  });
 }finally{await mongoose.disconnect();}
});
