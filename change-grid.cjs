const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');

c = c.replace(/className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop pamidor-list"/g, 'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-gutter-desktop pamidor-list"');

fs.writeFileSync('client/src/pages/Storefront.jsx', c);
