import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {createApp} from '../server/app.js';

// Use a local Playwright install, or point PLAYWRIGHT_MODULE at an existing runtime.
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const server = createApp().listen(0, '127.0.0.1');
await new Promise(resolve => server.once('listening', resolve));
const url = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true});
  const page = await browser.newPage({viewport: {width: 1440, height: 1000}, reducedMotion: 'reduce'});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  // Tests stay deterministic and exercise broken-image fallback without contacting retailers.
  await page.route('**/*', route => route.request().url().startsWith(url) ? route.continue() : route.abort());
  await page.goto(url);
  await page.locator('.product-card').first().waitFor();
  
  // Data-derived expectations
  const { products } = await (await fetch(url + '/api/products')).json();
  const visible = products;
  const totalPages = Math.ceil(visible.length / 8);
  const liverpoolProducts = visible.filter(p => p.team === 'Liverpool');

  assert.equal(await page.locator('.product-card').count(), 8);
  await page.getByRole('button', {name: 'Next', exact: true}).click();
  await page.getByText(`Page 2 of ${totalPages}`, {exact: true}).waitFor();
  await page.getByRole('button', {name: 'Shop Liverpool jerseys', exact: true}).click();
  await page.waitForFunction((count) => document.querySelectorAll('.product-card').length === count, liverpoolProducts.length);
  assert.match(await page.locator('.product-card').first().innerText(), /Liverpool/);
  await page.getByRole('button', {name: 'Player version', exact: true}).click();
  await page.getByRole('button', {name: 'View all jerseys'}).click();
  await page.waitForFunction(() => document.querySelectorAll('.product-card').length === 8);
  assert.equal(await page.locator('.teams-active-filter').count(), 0);
  await page.getByRole('button', {name: 'Select size and add Liverpool Home 23/24 to bag'}).click();
  const product = page.getByRole('dialog', {name: 'Liverpool Home 23/24', exact: true});
  await product.waitFor();
  assert.equal(await product.getByRole('button', {name: 'S Unavailable', exact: true}).isDisabled(), true);
  await product.getByRole('button', {name: 'Sizing guide', exact: true}).click();
  const sizeGuide = page.getByRole('dialog', {name: 'Sizing guide', exact: true});
  await sizeGuide.waitFor();
  for (let i = 0; i < 6; i++) await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.closest('dialog')?.getAttribute('aria-label')), 'Sizing guide');
  await page.keyboard.press('Escape');
  await sizeGuide.waitFor({state: 'detached'});
  assert.equal(await product.isVisible(), true);
  assert.equal(await product.getByRole('button', {name: 'Sizing guide', exact: true}).evaluate(element => element === document.activeElement), true);
  await product.getByRole('button', {name: 'M 3 available', exact: true}).click();
  await product.getByRole('button', {name: 'Add to matchday bag'}).click();
  await page.reload();
  await page.getByRole('button', {name: 'Shopping bag, 1 items'}).click();
  const bag = page.getByRole('dialog', {name: 'Shopping bag', exact: true});
  const increase = bag.getByRole('button', {name: 'Increase Liverpool Home 23/24 quantity'});
  await increase.click(); await increase.click();
  assert.equal(await increase.isDisabled(), true);
  await bag.getByRole('button', {name: 'Decrease Liverpool Home 23/24 quantity'}).click();
  assert.equal(await increase.isDisabled(), false);
  await page.keyboard.press('Escape');
  await page.getByRole('button', {name: 'Contact Us', exact: true}).click();
  await page.getByRole('dialog', {name: 'Contact Us', exact: true}).waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.getByText('Verified Fan', {exact:true}).count(), 0);
  await mkdir('artifacts', {recursive: true});
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({path:'artifacts/desktop.png', fullPage:true});

  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button', {name:'Open navigation'}).click();
  await page.getByRole('dialog', {name:'Main navigation'}).getByRole('button', {name:'National teams'}).click();
  assert.equal(await page.getByRole('dialog').count(),0);
  await page.waitForFunction(() => [...document.querySelectorAll('.product-card')].every(card => card.textContent.includes('NATIONAL TEAM')));
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true);
  await page.evaluate(() => window.scrollTo(0,0));
  await page.screenshot({path:'artifacts/mobile.png', fullPage:true});
  await page.getByRole('button', {name: 'Select size and add Argentina Home 2024 to bag'}).click();
  await page.getByRole('dialog', {name:'Argentina Home 2024'}).waitFor();
  await page.screenshot({path:'artifacts/mobile-product.png'});
  await page.getByRole('button',{name:'Sizing guide',exact:true}).click();
  await page.screenshot({path:'artifacts/mobile-sizing.png'});
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  for (const width of [320,768]) {
    await page.setViewportSize({width,height:900});
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) {
      console.log(await page.evaluate(() => [...document.querySelectorAll('body *')].filter(element => element.getBoundingClientRect().right > innerWidth && getComputedStyle(element).position !== 'absolute').slice(0,12).map(element => ({tag:element.tagName,class:element.className,right:element.getBoundingClientRect().right}))));
      await page.screenshot({path:`artifacts/overflow-${width}.png`});
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true,`Overflow at ${width}px`);
  }
  await page.setViewportSize({width:390,height:844});

  // Corrupt saved data must not crash the app or inject prices and quantities.
  await page.evaluate(() => localStorage.setItem('terrace:bag:v1', JSON.stringify([{slug:'liverpool-home-23-24',size:'M',qty:999,price:1}])));
  await page.reload();
  await page.getByRole('button',{name:'Shopping bag, 3 items'}).click();
  assert.match(await page.getByRole('dialog',{name:'Shopping bag'}).innerText(), /2,397/);
  await page.keyboard.press('Escape');
  await page.evaluate(() => localStorage.setItem('terrace:bag:v1', '{broken'));
  await page.reload();
  await page.getByRole('button',{name:'Shopping bag, 0 items'}).click();
  await page.getByText(/saved bag could not be read/).waitFor();
  await page.keyboard.press('Escape');

  await page.route('**/api/products', route => route.fulfill({status:503,contentType:'application/json',body:'{}'}));
  await page.reload();
  await page.getByRole('button',{name:'Try again'}).waitFor();
  await page.unroute('**/api/products');
  await page.getByRole('button',{name:'Try again'}).click();
  await page.locator('.product-card').first().waitFor();
  assert.equal(await page.locator('.product-card img').first().evaluate(image => image.src.endsWith('/images/jersey-placeholder.svg') && image.naturalWidth > 0), true);

  await page.route('**/api/products', route => route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({products:[],demo:false,checkoutEnabled:false})}));
  await page.reload();
  await page.getByText('No jerseys match just yet.').waitFor();
  assert.equal(await page.locator('.product-card').count(),0);
  const storagePage = await browser.newPage();
  await storagePage.addInitScript(() => {Storage.prototype.setItem = () => {throw new Error('Storage blocked');};});
  await storagePage.route('**/*', route => route.request().url().startsWith(url) ? route.continue() : route.abort());
  await storagePage.goto(url);
  await storagePage.locator('.product-card').first().waitFor();
  await storagePage.getByRole('button',{name:'Shopping bag, 0 items'}).click();
  await storagePage.getByText(/browser could not save the bag/).waitFor();
  await storagePage.close();
  assert.deepEqual(errors,[]);
  console.log('Browser checks passed: team pagination, reset, stock, saved bag, nested modal focus, mobile navigation, image fallback and API retry.');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
