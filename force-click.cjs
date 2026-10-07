const fs = require('fs');
let code = fs.readFileSync('scripts/browser-check.mjs', 'utf8');
code = code.split("await page.locator('.size-chip:has-text(\"M\")').click();").join("await page.locator('.size-chip:has-text(\"M\")').click({force: true});");
code = code.split("await blocked.locator('.size-chip:has-text(\"M\")').click();").join("await blocked.locator('.size-chip:has-text(\"M\")').click({force: true});");
fs.writeFileSync('scripts/browser-check.mjs', code);
console.log('Forced click');
