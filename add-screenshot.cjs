const fs = require('fs');
let code = fs.readFileSync('scripts/browser-check.mjs', 'utf8');
code = code.replace("await page.locator('.size-chip').filter({hasText: 'M'}).click();", "await page.screenshot({path: 'debug2.png'}); await page.locator('.size-chip').filter({hasText: 'M'}).click();");
code = code.replace("await blocked.locator('.size-chip').filter({hasText: 'M'}).click();", "await blocked.screenshot({path: 'debug3.png'}); await blocked.locator('.size-chip').filter({hasText: 'M'}).click();");
fs.writeFileSync('scripts/browser-check.mjs', code);
console.log('Added screenshots');
