import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  const capture = async (width, height, name) => {
    const page = await context.newPage();
    await page.setViewportSize({ width, height });
    
    // Capture Home Sections
    await page.goto('http://localhost:4173/');
    await page.waitForTimeout(3000); // let animations settle
    
    // Categories
    const cat = await page.$('#filter-index');
    if (cat) await cat.screenshot({ path: `artifacts/${name}-categories.png` });
    
    // Season Kits
    const kits = await page.evaluate(() => {
      const h2s = document.querySelectorAll('h2');
      for(let h of h2s) if (h.textContent.includes('Season Kits')) return h.closest('section');
      return null;
    });
    // Fallback if full page screenshot is needed
    await page.screenshot({ path: `artifacts/${name}-home-full.png`, fullPage: true });

    // Shop
    await page.goto('http://localhost:4173/shop');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `artifacts/${name}-shop.png` });
    
    await page.close();
  };

  if (!fs.existsSync('artifacts')) fs.mkdirSync('artifacts');
  console.log('Capturing 390px...');
  await capture(390, 844, '390px');
  console.log('Capturing 768px...');
  await capture(768, 1024, '768px');
  console.log('Capturing 1440px...');
  await capture(1440, 900, '1440px');

  await browser.close();
  console.log('Screenshots saved to artifacts/');
})();
