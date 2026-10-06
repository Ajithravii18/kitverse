import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {createOrderService,validateCheckout} from './order-service.js';
import {consumeOtp} from './otp.js';
import {createApp} from './app.js';

const customer={firstName:'Test',lastName:'Buyer',country:'India',streetAddress:'1 Test Street',city:'Chennai',state:'Tamil Nadu',postcode:'600001',phone:'9000000000',email:'buyer@example.invalid'};
const item={slug:'test-shirt',size:'M',qty:1};
function matches(row,query){return Object.entries(query).every(([k,v])=>{
 const value=row[k];if(v && typeof v==='object' && !(v instanceof Date))return Object.entries(v).every(([op,n])=>op==='$lt'?value<n:op==='$lte'?value<=n:op==='$gt'?value>n:op==='$gte'?value>=n:false);
 return v instanceof Date?+value===+v:String(value)===String(v);
});}
function fixture({providerFails=false,saveFails=false}={}){
 let state={stock:3,orders:[]},tail=Promise.resolve(),providerCalls=0;
 const repository={transaction(work){
  const run=tail.then(async()=>{
   const draft=structuredClone(state);
   const tx={find:async q=>draft.orders.find(o=>matches(o,q)),save:async()=>{},notify:async ()=>{},create:async o=>{if(saveFails)throw Error('database save failure');draft.orders.push({...o,_id:'order-db-id'});return draft.orders.at(-1);},
    reserve:async i=>{if(i.slug!=='test-shirt'||draft.stock<i.qty)throw Error('insufficient stock');draft.stock-=i.qty;return {...i,name:'Test shirt',price:79900};},
    release:async i=>{draft.stock+=i.qty;}};
   const result=await work(tx);state=draft;return structuredClone(result);
  });tail=run.catch(()=>{});return run;
 },expired:async()=>state.orders.filter(o=>o.paymentStatus==='pending')};
 const gateway={orders:{create:async()=>{providerCalls++;if(providerFails)throw Error('gateway offline');return {id:'provider-order'};},fetchPayments:async()=>({items:[]})}};
 const service=createOrderService({repository,gateway});
 return {service,gateway,get state(){return state;},get providerCalls(){return providerCalls;}};
}
const input={userId:'customer-id',customer,items:[item],checkoutKey:'checkout-test-123456'};
const payment={id:'payment-1',order_id:'provider-order',status:'captured',amount:79900,currency:'INR'};

test('validates every item and delivery detail before any inventory mutation',()=>{
 for(const items of [[item,{...item,qty:-1}],[{...item,size:'bad.path'}],[{...item,qty:1.5}],[],null])assert.throws(()=>validateCheckout(customer,items));
 assert.throws(()=>validateCheckout({...customer,postcode:'bad'},[item]));
 assert.equal(validateCheckout(customer,[item,item]).items[0].qty,2);
});
test('failed later stock reservation rolls back earlier items',async()=>{
 const f=fixture();await assert.rejects(f.service.create({...input,items:[item,{...item,slug:'unavailable-shirt'}]}));assert.equal(f.state.stock,3);assert.equal(f.state.orders.length,0);
});
test('failed database order save rolls back inventory',async()=>{
 const f=fixture({saveFails:true});await assert.rejects(f.service.create(input));assert.equal(f.state.stock,3);assert.equal(f.providerCalls,0);
});
test('provider failure releases the durable reservation exactly once',async()=>{
 const f=fixture({providerFails:true});await assert.rejects(f.service.create(input));assert.equal(f.state.stock,3);assert.equal(f.state.orders[0].paymentStatus,'cancelled');
 await f.service.cancel({orderRef:f.state.orders[0].orderRef});assert.equal(f.state.stock,3);
});
test('same checkout retry reuses its provider order and reservation',async()=>{
 const f=fixture();const first=await f.service.create(input);const retry=await f.service.create(input);assert.equal(first.orderRef,retry.orderRef);assert.equal(f.state.stock,2);assert.equal(f.providerCalls,1);
 await assert.rejects(f.service.create({...input,items:[{...item,qty:2}]}),/different cart/);
});
test('concurrent cancellations release only once',async()=>{
 const f=fixture();const o=await f.service.create(input);await Promise.all([f.service.cancel({orderRef:o.orderRef}),f.service.cancel({orderRef:o.orderRef})]);assert.equal(f.state.stock,3);
});
test('duplicate captures record payment once without changing stock',async()=>{
 const f=fixture();await f.service.create(input);await Promise.all([f.service.captured(payment),f.service.captured(payment)]);assert.equal(f.state.stock,2);assert.equal(f.state.orders[0].paymentStatus,'paid');
 await assert.rejects(f.service.captured({...payment,amount:1}),/amount/);
 await assert.rejects(f.service.captured({...payment,id:'other-payment'}),/different payment/);
});
test('late capture becomes payment review instead of silently remaining cancelled',async()=>{
 const f=fixture();const o=await f.service.create(input);await f.service.cancel({orderRef:o.orderRef});const paid=await f.service.captured(payment);assert.equal(paid.paymentStatus,'review_required');assert.equal(f.state.stock,3);
});
test('capture racing cancellation cannot release paid stock',async()=>{
 const f=fixture();const o=await f.service.create(input);await Promise.allSettled([f.service.captured(payment),f.service.cancel({orderRef:o.orderRef})]);assert.equal(f.state.orders[0].paymentStatus,'paid');assert.equal(f.state.stock,2);
});
test('admin cannot mark an unpaid order paid or fulfilled',async()=>{
 const f=fixture();await f.service.create(input);await assert.rejects(f.service.adminUpdate('order-db-id',{paymentStatus:'paid'}));await assert.rejects(f.service.adminUpdate('order-db-id',{fulfilmentStatus:'shipped'}));
 await f.service.captured(payment);await f.service.ship('order-db-id',{courier: 'FedEx', trackingNumber:'TRACK-1'});assert.equal(f.state.orders[0].fulfilmentStatus,'shipped');
});
test('expiry reconciles a captured provider payment before releasing inventory',async()=>{
 const f=fixture();await f.service.create(input);f.gateway.orders.fetchPayments=async()=>({items:[payment]});await f.service.reconcileExpired();assert.equal(f.state.orders[0].paymentStatus,'paid');assert.equal(f.state.stock,2);
});

function otpUsers(){
 const user={_id:'user',email:'buyer@example.invalid',role:'customer',otp:'123456',otpExpires:new Date(Date.now()+60000),otpPurpose:'verification',otpAttempts:0};
 const update=(q,u)=>{if(!matches(user,q))return null;for(const[k,n]of Object.entries(u.$inc||{}))user[k]=(user[k]||0)+n;Object.assign(user,u.$set);for(const k of Object.keys(u.$unset||{}))delete user[k];return {...user};};
 return {user,findOneAndUpdate:async(q,u)=>update(q,u),updateOne:async(q,u)=>update(q,u)};
}
test('five concurrent wrong OTP attempts lock out the correct code',async()=>{
 const users=otpUsers();await Promise.allSettled(Array.from({length:12},()=>consumeOtp({email:users.user.email,otp:'000000',purpose:'verification',changes:{}},users)));
 assert.equal(users.user.otpAttempts,5);assert.equal(users.user.otp,undefined);
 await assert.rejects(consumeOtp({email:users.user.email,otp:'123456',purpose:'verification',changes:{}},users));
});
test('OTP is purpose-bound and consumed only once',async()=>{
 const users=otpUsers();await assert.rejects(consumeOtp({email:users.user.email,otp:'123456',purpose:'password-reset',changes:{}},users));
 await consumeOtp({email:users.user.email,otp:'123456',purpose:'verification',changes:{isVerified:true}},users);assert.equal(users.user.isVerified,true);
 await assert.rejects(consumeOtp({email:users.user.email,otp:'123456',purpose:'verification',changes:{}},users));
});
test('webhook validates original bytes; failed attempts do not cancel orders',async()=>{
 process.env.RAZORPAY_WEBHOOK_SECRET='test-webhook-secret';let captures=0;
 const app=createApp({orderService:{captured:async p=>{assert.equal(p.id,payment.id);captures++;}}});
 const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 try{
  const body=JSON.stringify({event:'payment.captured',payload:{payment:{entity:payment}}},null,2);
  const signature=createHmac('sha256',process.env.RAZORPAY_WEBHOOK_SECRET).update(body).digest('hex');
  const post=(raw,sig)=>fetch(`http://127.0.0.1:${server.address().port}/api/orders/webhook`,{method:'POST',headers:{'Content-Type':'application/json','x-razorpay-signature':sig},body:raw});
  assert.equal((await post(body,signature)).status,200);assert.equal(captures,1);
  assert.equal((await post(body+' ',signature)).status,400);
  const failed=JSON.stringify({event:'payment.failed',payload:{payment:{entity:payment}}});
  assert.equal((await post(failed,createHmac('sha256',process.env.RAZORPAY_WEBHOOK_SECRET).update(failed).digest('hex'))).status,200);assert.equal(captures,1);
 }finally{await new Promise(r=>server.close(r));delete process.env.RAZORPAY_WEBHOOK_SECRET;}
});
