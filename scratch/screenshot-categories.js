import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 2000 } });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    window.scrollTo(0, document.querySelector('#filter-index').offsetTop);
    document.querySelectorAll('[data-home-reveal]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.classList.add('home-reveal-active');
    });
  });
  await page.waitForTimeout(1000);
  const element = await page.locator('#filter-index');
  await element.screenshot({ path: 'category-cards-preview.png' });
  console.log('Saved screenshot with all reveals active');
  await browser.close();
})();
