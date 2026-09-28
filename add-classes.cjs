const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');

c = c.replace(
  'className="lg:col-span-3 sm:col-span-2 group relative w-full h-[320px] lg:h-full bg-black overflow-hidden flex flex-col text-left"',
  'className="lg:col-span-3 sm:col-span-2 group relative w-full h-[320px] lg:h-full bg-black overflow-hidden flex flex-col text-left pamidor-item reveal"'
);

fs.writeFileSync('client/src/pages/Storefront.jsx', c);
