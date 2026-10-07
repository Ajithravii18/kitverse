import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { createApp } from '../server/app.js';

process.env.NODE_ENV = 'test';
const server = createApp().listen(0, '127.0.0.1');
await new Promise(resolve => server.once('listening', resolve));
const url = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => route.request().url().startsWith(url) ? route.continue() : route.abort());
  const response = await page.request.get(url + '/api/products');
  const { products } = await response.json();
  await page.goto(url);
  await page.locator('#filter-index .category-card').first().waitFor();
  const links = await page.locator('#filter-index .category-card').evaluateAll(cards => cards.map(card => card.getAttribute('href')));
  assert.ok(links.includes('/shop?type=jersey'));
  for (const href of links) {
    await page.goto(url);
    await page.locator(`#filter-index a[href="${href}"]`).click();
    await page.waitForURL(url + href);
    await page.locator('.shop-catalogue').waitFor();
    await page.waitForFunction(() => document.querySelector('.shop-catalogue article, .shop-empty-state'));
    const params = new URLSearchParams(href.split('?')[1]);
    for (const [param, label] of [['type', 'Filter by product type'], ['quality', 'Filter by quality'], ['sort', 'Sort products']]) {
      if (params.has(param)) assert.equal(await page.getByRole('combobox', { name: label }).inputValue(), params.get(param));
    }
    if (params.has('retro')) assert.equal(await page.locator('.shop-retro-toggle input').isChecked(), true);
    const expected = products.filter(product =>
      (!params.has('type') || product.productType === params.get('type')) &&
      (!params.has('quality') || product.quality === params.get('quality')) &&
      (!params.has('retro') || product.retro));
    if (expected.length) {
      await page.locator('.shop-catalogue article').first().waitFor();
      const names = await page.locator('.shop-catalogue article h3').allTextContents();
      assert.equal(names.length, Math.min(expected.length, 12));
      for (const name of names) assert.ok(expected.some(product => product.name === name.trim()), `Unexpected product on ${href}: ${name}`);
    } else {
      await page.getByText('NO MATCHES IN THIS EDITION.', { exact: true }).waitFor();
    }
    console.log(`PASS: ${href} (${expected.length} matching products)`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url);
  await page.locator('#filter-index a[href="/shop?type=jersey"]').click();
  await page.locator('.shop-catalogue article').first().waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.deepEqual(errors, []);
  console.log('PASS: mobile category navigation; no uncaught browser errors.');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(url);
    const cards = page.locator('#filter-index .category-card');
    await cards.first().waitFor();
    for (let index = 0; index < await cards.count(); index++) {
      const card = cards.nth(index);
      await card.scrollIntoViewIfNeeded();
      // Check after GSAP has removed its temporary reveal styles.
      await page.waitForFunction(index => {
        const element = document.querySelectorAll('#filter-index .category-card')[index];
        return element && !element.style.opacity && Number(getComputedStyle(element).opacity) === 1;
      }, index);
    }
    await page.waitForTimeout(1200);
    assert.ok(await cards.evaluateAll(elements => elements.every(element => Number(getComputedStyle(element).opacity) === 1)), 'Category cards stay visible after animations complete');
    console.log(`PASS: category cards remain visible after normal animations at ${width}px`);
  }
  assert.deepEqual(errors, []);
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
