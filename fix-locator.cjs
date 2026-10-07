const fs = require('fs');
let code = fs.readFileSync('scripts/browser-check.mjs', 'utf8');
code = code.replace("await page.locator('.size-chip').filter({hasText: 'M'}).click();", "await page.locator('.size-chip:has-text(\"M\")').click();");
code = code.replace("await blocked.locator('.size-chip').filter({hasText: 'M'}).click();", "await blocked.locator('.size-chip:has-text(\"M\")').click();");
fs.writeFileSync('scripts/browser-check.mjs', code);
console.log('Fixed test locator');
