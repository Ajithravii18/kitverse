const fs = require('fs');
let code = fs.readFileSync('client/src/components/ProductDetailModal.jsx', 'utf8');
code = code.replace("className={`border border-border", "className={`size-chip border border-border");
fs.writeFileSync('client/src/components/ProductDetailModal.jsx', code);
console.log('Fixed size chip');
