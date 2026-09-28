const fs = require('fs');
const c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');
const startIdx = c.indexOf('<button className="lg:col-span-3');
const endIdx = c.indexOf('</button>', startIdx) + 9;
console.log(c.substring(startIdx, endIdx));
