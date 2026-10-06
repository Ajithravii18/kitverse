import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {createApp} from '../server/app.js';

process.env.NODE_ENV='test';
const server=createApp().listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
const url=`http://127.0.0.1:${server.address().port}`;
let browser;
try{
 browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL || 'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 page.setDefaultTimeout(10000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());
 await page.goto(url+'/shop?search=Liverpool&sort=price-low');
 await page.getByRole('button',{name:'View Liverpool Home 23/24',exact:true}).waitFor();
 assert.equal(await page.getByRole('searchbox').inputValue(),'Liverpool');
 assert.equal(await page.getByRole('combobox',{name:'Sort products'}).inputValue(),'price-low');
 async function addLiverpool(){await page.getByRole('button',{name:'View Liverpool Home 23/24',exact:true}).click();await page.locator('.size-chip').filter({hasText:/^M/}).click();await page.getByRole('button',{name:/ADD TO CART/}).click();}
 await addLiverpool();await page.getByRole('button',{name:'Cart with 1 items'}).click();
 const drawer=page.getByRole('dialog',{name:'Shopping Cart'});
 const plus=drawer.getByRole('button',{name:'Increase Liverpool Home 23/24 quantity'});
 await plus.click();await plus.click();assert.equal(await plus.isDisabled(),true);
 for(let i=0;i<15;i++)await page.keyboard.press('Tab');
 assert.equal(await page.evaluate(()=>document.activeElement.closest('dialog')?.getAttribute('aria-label')),'Shopping Cart');
 await drawer.getByRole('button',{name:'Decrease Liverpool Home 23/24 quantity'}).click();
 await page.keyboard.press('Escape');await drawer.waitFor({state:'detached'});
 assert.equal(await page.getByRole('button',{name:'Cart with 2 items'}).evaluate(e=>e===document.activeElement),true);
 await addLiverpool();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('kitverse:bag:v1'))[0].qty),3);
 await page.reload();await page.getByRole('button',{name:'Cart with 3 items'}).click();
 await drawer.getByRole('link',{name:'Liverpool Home 23/24',exact:true}).last().click();
 await page.getByRole('button',{name:'View Liverpool Home 23/24',exact:true}).waitFor();
 console.log('PASS: cart stock, shared state, persistence, product link, keyboard focus.');

 await page.route('**/api/products',r=>r.fulfill({status:503,contentType:'application/json',body:'{"error":"offline"}'}));
 await page.goto(url+'/checkout');await page.getByRole('button',{name:'Retry checkout'}).waitFor();
 assert.equal(await page.getByText('CART IS EMPTY',{exact:true}).count(),0);
 await page.unroute('**/api/products');await page.getByRole('button',{name:'Retry checkout'}).click();await page.getByText('LOGIN REQUIRED',{exact:true}).waitFor();
 console.log('PASS: checkout outage retains cart and supports retry.');

 const catalogue=await (await fetch(url+'/api/products')).json();
 await page.route('**/api/products',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({...catalogue,checkoutEnabled:true,demo:false})}));
 await page.route('**/api/customer/me',r=>r.fulfill({contentType:'application/json',body:'{"authenticated":true,"email":"test@example.invalid","username":"Test","savedAddresses":[]}'}));
 const pending={orderRef:'ORD-BROWSER-TEST',paymentIntentId:'order_test',razorpayKeyId:'test_key',paymentStatus:'pending',fulfilmentStatus:'unfulfilled',total:79900};
 let creates=0;
 await page.route('**/api/orders',r=>{creates++;assert.ok(r.request().headers()['idempotency-key']);return r.fulfill({contentType:'application/json',body:JSON.stringify(pending)});});
 await page.route('**/api/orders/ORD-BROWSER-TEST',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(pending)}));
 await page.route('**/api/orders/verify-payment',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({...pending,paymentStatus:'paid'})}));
 await page.route('https://checkout.razorpay.com/v1/checkout.js',r=>r.fulfill({contentType:'application/javascript',body:'window.Razorpay=class{constructor(options){window.auditPayment=options;}on(){}open(){window.auditOpened=true;}}'}));
 await page.evaluate(()=>localStorage.setItem('kitverse:bag:v1',JSON.stringify([{slug:'liverpool-home-23-24',size:'M',qty:1}])));
 await page.goto(url+'/checkout');
 for(const [name,value]of Object.entries({firstName:'Test',lastName:'Buyer',streetAddress:'1 Test Street',city:'Chennai',postcode:'600001',phone:'9000000000',email:'test@example.invalid'}))await page.locator('#checkout-'+name).fill(value);
 await page.locator('#checkout-state').selectOption('Tamil Nadu'); await page.screenshot({path:'debug-checkout.png'});
 await page.getByText('CONFIRM & PAY').click();await page.waitForFunction(()=>window.auditOpened);
 await page.evaluate(()=>window.auditPayment.modal.ondismiss());await page.getByRole('button',{name:'Resume payment'}).click();assert.equal(creates,1);
 await page.reload();await page.getByRole('button',{name:'Resume payment'}).click();await page.waitForFunction(()=>window.auditOpened);
 await page.evaluate(()=>window.auditPayment.handler({razorpay_order_id:'order_test',razorpay_payment_id:'pay_test',razorpay_signature:'test'}));
 await page.getByRole('heading',{name:'PAYMENT VERIFIED',exact:true}).waitFor();assert.equal(creates,1);
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('kitverse:bag:v1'))),[]);
 console.log('PASS: checkout form, payment dismissal, resume after reload, confirmed cart clearing (provider/API fixtures).');
 await page.unroute('**/api/products');
 const a={...catalogue.products[0],images:[{url:'/images/jersey-placeholder.svg',label:'Front'},{url:'/images/jersey-placeholder.svg',label:'Back'}]};
 const b={...catalogue.products[1],team:a.team,images:[{url:'/images/jersey-placeholder.svg',label:'Front'}]};
 await page.route('**/api/products',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({products:[a,b],demo:true})}));
 await page.goto(url+'/shop');await page.getByRole('button',{name:`View ${a.name}`,exact:true}).click();await page.getByRole('button',{name:'View Back',exact:true}).click();await page.locator('.detail-related-card').first().click();await page.getByRole('dialog',{name:b.name,exact:true}).waitFor();await page.keyboard.press('Escape');await page.unroute('**/api/products');
 console.log('PASS: related product with fewer photos stays usable.');

 await page.route('**/api/admin/me',r=>r.fulfill({contentType:'application/json',body:'{"authenticated":true}'}));
 await page.route('**/api/admin/orders',r=>r.fulfill({contentType:'application/json',body:'{"orders":[]}'}));
 await page.route('**/api/admin/products',r=>r.fulfill({contentType:'application/json',body:'{"products":[]}'}));
 await mkdir('artifacts/e2e',{recursive:true});
 for(const width of [390,768])for(const path of ['/shop','/signup','/checkout','/admin/products','/admin/orders']){
  await page.setViewportSize({width,height:844});await page.goto(url+path);await page.waitForTimeout(250);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`Overflow ${width} ${path}`);
 }
 await page.screenshot({path:'artifacts/e2e/admin-orders-mobile.png'});
 await page.setViewportSize({width:390,height:844});await page.goto(url+'/shop');await page.screenshot({path:'artifacts/e2e/shop-mobile.png'});
 assert.deepEqual(errors,[]);
 const blocked=await browser.newPage();await blocked.addInitScript(()=>{Storage.prototype.setItem=()=>{throw Error('blocked');};});
 await blocked.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());await blocked.goto(url+'/shop?search=Liverpool');await blocked.getByRole('button',{name:'View Liverpool Home 23/24',exact:true}).click();await blocked.locator('.size-chip').filter({hasText:/^M/}).click();await blocked.getByRole('button',{name:/ADD TO CART/}).click();
 await blocked.getByRole('button',{name:'Cart with 1 items'}).click();await blocked.getByRole('button',{name:'PROCEED TO CHECKOUT'}).click();await blocked.getByText('LOGIN REQUIRED',{exact:true}).waitFor();await blocked.close();
 console.log('PASS: mobile layouts, admin fixtures, blocked-storage navigation; no uncaught browser errors.');
}finally{await browser?.close();await new Promise(r=>server.close(r));}
