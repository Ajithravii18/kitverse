import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import {createApp} from '../server/app.js';

process.env.NODE_ENV='test';
const server=createApp().listen(0,'127.0.0.1');
await new Promise(resolve=>server.once('listening',resolve));
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
const url=`http://127.0.0.1:${server.address().port}`;
try {
 await mkdir('artifacts/review',{recursive:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/assets/Storefront-*.js',async route=>{
   await new Promise(resolve=>setTimeout(resolve,700));await route.continue();
 });
 await page.route('**/api/content?*',async route=>{
   await new Promise(resolve=>setTimeout(resolve,300));
   await route.fulfill({json:{content:{'homepage-hero':{isActive:true,title:'MATCHDAY ARCHIVE',aboutLabel:'ABOUT US',aboutText:'Football is culture.',subtitle:'THE MATCHDAY EDIT',registry:'KITVERSE'}}}});
 });
 const navigation=page.goto(url);
 await page.getByRole('status').filter({hasText:'Loading the archive'}).waitFor();
 await page.screenshot({path:'artifacts/review/archive-loader.png'});
 await navigation;
 const hero=page.locator('[data-home-hero]');
 await hero.waitFor();
 assert.equal(await page.locator('.route-loader').count(),0,'Loader exits after content resolves');
 assert.equal(await page.locator('.home-page main > div > :first-child').getAttribute('data-home-hero'),'','Hero is the first homepage section');
 const image=page.locator('[data-hero-frame] > img').first();
 const frame=page.locator('[data-hero-frame]').first();
 const gray=()=>image.evaluate(element=>Number(getComputedStyle(element).filter.match(/grayscale\(([^)]+)\)/)?.[1]||0));
 for(const width of [390,1440]) {
   await page.setViewportSize({width,height:400});
   await page.evaluate(()=>scrollTo(0,0));
   await page.waitForTimeout(700);
   assert.ok(await gray()>.95,'Hero begins in grayscale before reaching the viewport');
   await frame.evaluate(element=>scrollTo(0,element.getBoundingClientRect().top+scrollY-innerHeight*.8));
   await page.waitForTimeout(900);
   assert.ok(await gray()>.95,'Visible hero stays fully black and white before the color reveal');
   await frame.evaluate(element=>scrollTo(0,element.getBoundingClientRect().top+scrollY-innerHeight*.3));
   await page.waitForTimeout(900);
   assert.ok(await gray()<.05,'Hero reaches full color inside the viewport');
   await image.hover();
   await page.waitForTimeout(300);
   assert.ok(await gray()<.05,'Hover does not reset grayscale');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.setViewportSize({width:1440,height:1000});
 await page.evaluate(()=>scrollTo(0,0));
 assert.ok(await gray()<.05,'Reduced motion shows full color without scrolling');
 await page.screenshot({path:'artifacts/review/hero-reduced-motion.png'});
 await page.unroute('**/api/content?*');
 await page.route('**/api/content?*',route=>route.fulfill({json:{content:{}}}));
 await page.goto(url);
 await hero.waitFor();
 assert.equal(await page.evaluate(()=>scrollY),0,'Reload begins at the hero');
 await page.unroute('**/api/content?*');
 await page.route('**/api/content?*',route=>route.abort());
 await page.goto(url);
 await hero.waitFor();
 assert.equal(await page.locator('.route-loader').count(),0,'Content failure falls back to the default hero');
 assert.deepEqual(errors,[]);
 console.log('PASS: loader-to-hero handoff, default/error fallback hero, scroll reset, viewport grayscale on phone/desktop, hover, reduced motion, and no browser errors.');
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
