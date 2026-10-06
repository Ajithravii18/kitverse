import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {createApp} from '../server/app.js';
process.env.NODE_ENV='test';
const server=createApp().listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
const url=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());
 await page.goto(url+'/shop');await page.locator('.shop-product').first().waitFor();
 await mkdir('artifacts/collection',{recursive:true});
 assert.equal(await page.locator('.shop-sidebar').isVisible(),true);
 const layout=await page.evaluate(()=>{const a=document.querySelector('.shop-sidebar').getBoundingClientRect(),b=document.querySelector('.shop-results').getBoundingClientRect();return a.right<b.left;});assert.ok(layout);
 await page.screenshot({path:'artifacts/collection/desktop.png',fullPage:true});
 await page.getByRole('button',{name:'Next page',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Go to page 2'}).getAttribute('aria-current'),'page');
 await page.getByRole('combobox',{name:'Filter by team',exact:true}).selectOption('Liverpool');
 assert.equal(await page.getByRole('button',{name:'Previous page',exact:true}).isDisabled(),true);
 await page.getByRole('combobox',{name:'Filter by quality'}).selectOption('Embroidery');
 await page.getByRole('combobox',{name:'Filter by available size'}).selectOption('M');
 assert.ok(page.url().includes('team=Liverpool')&&page.url().includes('size=M'));
 assert.equal(await page.locator('.shop-product').count(),1);
 await page.goBack();assert.equal(await page.getByRole('combobox',{name:'Filter by available size'}).inputValue(),'all');
 await page.reload();assert.equal(await page.getByRole('combobox',{name:'Filter by quality'}).inputValue(),'Embroidery');
 await page.getByRole('button',{name:'CLEAR ALL FILTERS',exact:false}).click();
 for(const width of [320,360,375,390,414,768,1024,1440]) {
   await page.setViewportSize({width,height:844});await page.waitForTimeout(200);
   const overflow=await page.evaluate(()=>[...document.querySelectorAll('.shop-page *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left<-1)&&getComputedStyle(e).position!=='fixed';}).map(e=>e.className));
   assert.deepEqual(overflow,[],`Overflow at ${width}`);
   const clipped=await page.locator('.shop-catalogue-heading h1, .shop-product-info h3, .shop-footer-column a, .shop-footer-masthead > a').evaluateAll(elements=>elements.filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>e.textContent));
   assert.deepEqual(clipped,[],`Clipped text at ${width}`);
   assert.equal(await page.locator('.shop-footer').evaluate(e=>getComputedStyle(e).display),'block');
   if(width>700) {
     const fit=await page.locator('.shop-sidebar').evaluate(e=>({horizontal:e.scrollWidth>e.clientWidth+1,vertical:e.scrollHeight>e.clientHeight+1,titleClipped:e.querySelector('h2').scrollWidth>e.querySelector('h2').clientWidth+1}));
     assert.equal(fit.horizontal,false,`Sidebar horizontal overflow at ${width}`);
     assert.equal(fit.titleClipped,false,`Sidebar heading clipped at ${width}`);
     assert.equal(fit.vertical,false,`Unnecessary sidebar scrolling at ${width} x 844`);
   }
   if(width===320 || width===1440)await page.screenshot({path:`artifacts/collection/fit-${width}.png`,fullPage:true});
 }
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:/FILTERS/}).click();
 const drawer=page.getByRole('dialog',{name:'Collection filters'});assert.ok(await drawer.isVisible());
 await drawer.getByRole('combobox',{name:'Filter by team',exact:true}).selectOption('Liverpool');
 for(let n=0;n<15;n++)await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>!!document.activeElement.closest('dialog')));
 await page.keyboard.press('Escape');assert.equal(await drawer.isVisible(),false);
 assert.ok(await page.getByRole('button',{name:/FILTERS/}).evaluate(e=>e===document.activeElement));
 await page.getByRole('button',{name:'CLEAR ALL ×',exact:true}).click();
 await page.screenshot({path:'artifacts/collection/mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);
 console.log('PASS: sidebar, pagination, combined filters, URL history/reload, responsive widths, mobile dialog focus and Escape; screenshots saved.');
} finally {await browser.close();await new Promise(r=>server.close(r));}
