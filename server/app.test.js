import test from 'node:test';
import assert from 'node:assert/strict';
import {createApp, isValidRazorpaySignature, REMEMBERED_SESSION_TTL_MS} from './app.js';
import {createHmac} from 'node:crypto';
import {addItem, changeQuantity, reconcileCart, inStock} from '../shared/inventory.js';
import {selectProducts, paginate} from '../shared/storefront.js';
async function request(options,path){const server=createApp(options).listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));try{const response=await fetch(`http://127.0.0.1:${server.address().port}${path}`);return {status:response.status,data:await response.json()};}finally{await new Promise(resolve=>server.close(resolve))}}
const club={slug:'club-shirt',name:'Club shirt',category:'club',quality:'Embroidery',price:799,stock:{S:0,M:2}};
const national={slug:'national-shirt',name:'National shirt',category:'national',quality:'Player version',price:1499,stock:{L:1}};
const database={hasDatabase:true,databaseReady:()=>true,readProducts:async()=>[club,national,{...club,slug:'sold-out',stock:{M:0}},{slug:'legacy',variants:[{quality:'Embroidery'}]}]};
test('Razorpay payment signatures must match the order and payment ids', () => {
 const orderId = 'order_123';
 const paymentId = 'pay_456';
 const secret = 'test-secret';
 const signature = createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
 assert.equal(isValidRazorpaySignature(orderId, paymentId, signature, secret), true);
 assert.equal(isValidRazorpaySignature(orderId, 'pay_other', signature, secret), false);
 assert.equal(isValidRazorpaySignature(orderId, paymentId, `${signature}00`, secret), false);
 assert.equal(isValidRazorpaySignature(orderId, paymentId, signature, ''), false);
});
test('remembered customer sessions expire after seven days', () => {
 assert.equal(REMEMBERED_SESSION_TTL_MS, 7 * 24 * 60 * 60 * 1000);
});
test('catalogue lists actual qualities and national teams',async()=>{const {status,data}=await request({},'/api/products');assert.equal(status,200);assert.equal(data.demo,true);assert.ok(data.products.some(p=>p.category==='national'));assert.ok(data.products.every(p=>p.quality&&p.stock&&!p.variants));});
test('database outage does not substitute demo inventory',async()=>{assert.equal((await request({hasDatabase:true},'/api/products')).status,503)});
test('reject invalid quality and category',async()=>{assert.equal((await request({},'/api/products?quality=invalid')).status,400);assert.equal((await request({},'/api/products?category=invalid')).status,400)});
test('filters by stocked quality and category',async()=>{const result=await request(database,'/api/products?category=national&quality=Player%20version');assert.deepEqual(result.data.products.map(p=>p.slug),['national-shirt']);assert.equal(result.data.demo,false)});
test('sold-out and unverified legacy stock is not offered',async()=>{const result=await request(database,'/api/products');assert.deepEqual(result.data.products.map(p=>p.slug),['club-shirt','national-shirt'])});
test('bag cannot add sold-out sizes or exceed stock with repeated additions',()=>{assert.throws(()=>addItem([],club,'S'),/stock/);let cart=addItem([],club,'M');cart=addItem(cart,club,'M');assert.equal(cart[0].qty,2);assert.throws(()=>addItem(cart,club,'M'),/stock/);assert.equal(cart[0].qty,2)});
test('bag increment respects stock and decrement removes the last item',()=>{let cart=addItem([],national,'L');assert.throws(()=>changeQuantity(cart,cart[0].key,1,[national]),/stock/);assert.deepEqual(changeQuantity(cart,cart[0].key,-1,[national]),[])});

test('restoring a bag refreshes price, merges duplicates, caps stock and drops invalid rows', () => {
 const saved = [{slug:club.slug,size:'M',qty:1,price:1}, {slug:club.slug,size:'M',qty:100},
  {slug:club.slug,size:'S',qty:1}, {slug:'deleted',size:'L',qty:1}, null,
  {slug:national.slug,size:'L',qty:-2}, {slug:national.slug,size:'L',qty:1.5}];
 const restored = reconcileCart(saved, [club,national]);
 assert.equal(restored.length,1);assert.equal(restored[0].qty,2);assert.equal(restored[0].price,799);
 assert.deepEqual(reconcileCart({bad:true},[club]),[]);
});
test('unknown stock sizes never make a listing purchasable', () => {
 assert.equal(inStock({...club,stock:{INVALID:4}}),false);
 assert.throws(()=>addItem([],{...club,stock:{INVALID:4}},'INVALID'),/stock/);
});
test('removed inventory can still be removed from the bag', () => {
 const cart=addItem([],national,'L');
 assert.deepEqual(changeQuantity(cart,cart[0].key,-1,[]),[]);
 assert.throws(()=>changeQuantity(cart,cart[0].key,0.5,[national]),/one/);
});
test('team selection on a later page still returns its matching product', () => {
 const products=Array.from({length:20},(_,i)=>({...club,slug:`shirt-${i}`,team:`Team ${i}`}));
 const filtered=selectProducts(products,{team:'Team 0'});
 const result=paginate(filtered,3);
 assert.equal(result.page,1);assert.equal(result.items[0].slug,'shirt-0');
 assert.equal(selectProducts(products).length,20);
});
test('filters combine category, quality and trimmed search; sorting leaves source unchanged', () => {
 const products=[national,club];
 assert.deepEqual(selectProducts(products,{query:' CLUB ',category:'club',quality:'Embroidery'}),[club]);
 assert.deepEqual(selectProducts(products,{sort:'low'}),[club,national]);
 assert.deepEqual(products,[national,club]);
});
test('API hides invalid prices and returns only public product fields',async()=>{
 const dataSource={...database,readProducts:async()=>[
  {...club,internalCost:15,image:'javascript:alert(1)'}, {...national,price:undefined},
  {...national,price:-1}, {...national,price:Infinity}, {...national,stock:{UNKNOWN:4}}
 ]};
 const result=await request(dataSource,'/api/products');
 assert.equal(result.data.products.length,1);
 assert.equal(result.data.products[0].internalCost,undefined);
 assert.equal(result.data.products[0].image,'/images/jersey-placeholder.svg');
});
test('health reports demo and database availability; unknown API route is 404',async()=>{
 assert.equal((await request({},'/api/health')).data.mode,'demo');
 assert.equal((await request({hasDatabase:true},'/api/health')).status,503);
 assert.equal((await request({},'/api/not-found')).status,404);
});
test('database read failure returns a generic error',async()=>{
 const result=await request({...database,readProducts:async()=>{throw new Error('test failure')}},'/api/products');
 assert.equal(result.status,500);assert.equal(result.data.error,'Unable to complete the request.');
});
