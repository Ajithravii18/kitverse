const fs = require('fs');
let code = fs.readFileSync('scripts/browser-check.mjs', 'utf8');
code = code.replace("await page.screenshot({path: 'debug2.png'}); ", "");
code = code.replace("await blocked.screenshot({path: 'debug3.png'}); ", "");
fs.writeFileSync('scripts/browser-check.mjs', code);
