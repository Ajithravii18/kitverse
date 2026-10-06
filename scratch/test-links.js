import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.goto('https://unsplash.com/s/photos/polo-shirt', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href*="/photos/"]'))
      .map(e => e.href)
      .filter(h => !h.includes('/download'));
  });
  console.log('Found photo links:', [...new Set(links)].slice(0, 10));
  await browser.close();
})();
