const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');
c = c.replace('<div className="lg:col-span-8 flex', '<style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style><div className="lg:col-span-8 flex');
fs.writeFileSync('client/src/pages/Storefront.jsx', c);
