import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  const capture = async (width, height, name) => {
    const page = await context.newPage();
    await page.setViewportSize({ width, height });
    await page.goto('http://localhost:5173');
    
    // Wait for animations (hero takes about 2-3s)
    await page.waitForTimeout(4000);
    await page.screenshot({ path: `artifacts/${name}-hero.png` });
    
    // Scroll down a bit
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `artifacts/${name}-categories.png` });
    
    await page.close();
  };

  console.log('Capturing 390px...');
  await capture(390, 844, '390px');
  
  console.log('Capturing 768px...');
  await capture(768, 1024, '768px');
  
  console.log('Capturing 1440px...');
  await capture(1440, 900, '1440px');

  await browser.close();
  console.log('Screenshots saved to artifacts/');
})();
