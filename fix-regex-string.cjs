const fs = require('fs');
let code = fs.readFileSync('scripts/browser-check.mjs', 'utf8');
code = code.replace("hasText: /^\\\\s*M/", "hasText: 'M'");
code = code.replace("hasText: /^\\\\s*M/", "hasText: 'M'");
fs.writeFileSync('scripts/browser-check.mjs', code);
console.log('Fixed regex to string');
