const fs = require('fs');
let code = fs.readFileSync('scripts/browser-check.mjs', 'utf8');
code = code.replace("hasText:/^\\\\s*M/", "hasText: /^\\s*M/");
code = code.replace("hasText:/^\\\\s*M/", "hasText: /^\\s*M/");
fs.writeFileSync('scripts/browser-check.mjs', code);
console.log('Fixed regex');
