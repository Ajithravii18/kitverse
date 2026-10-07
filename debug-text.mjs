import { chromium } from 'playwright';
import { createApp } from './server/app.js';
(async () => {
  const server = createApp().listen(0, '127.0.0.1');
  await new Promise(r => server.once('listening', r));
  const url = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await page.route('**/*', r => r.request().url().startsWith(url) ? r.continue() : r.abort());
  await page.goto(url+'/shop?search=Liverpool&sort=price-low');
  await page.waitForTimeout(3000);
  const text = await page.evaluate(() => document.body.innerText);
  console.log('PAGE TEXT:', text.substring(0, 1000));
  await browser.close();
  process.exit(0);
})();
