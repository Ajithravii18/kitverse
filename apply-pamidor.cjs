const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');
c = c.replace(/className="lg:col-span-8 grid grid-rows-2/g, 'className="lg:col-span-8 grid grid-rows-2 pamidor-list');
c = c.replace(/className="relative p-space-lg rounded-none transition-all duration-300 flex/g, 'className="relative p-space-lg rounded-none transition-all duration-300 flex pamidor-item');
fs.writeFileSync('client/src/pages/Storefront.jsx', c);
