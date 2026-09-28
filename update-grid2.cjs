const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');

let oldContainer = '<div className="lg:col-span-8 grid grid-rows-3 grid-flow-col auto-cols-[85vw] sm:auto-cols-[320px] md:auto-cols-[360px] lg:auto-cols-[300px] overflow-x-auto gap-space-md pb-4 snap-x snap-mandatory scrollbar-hide"';
let newContainer = '<div className="lg:col-span-8 grid grid-rows-2 grid-flow-col auto-cols-[85vw] sm:auto-cols-[280px] md:auto-cols-[320px] lg:auto-cols-[340px] overflow-x-auto gap-space-md pb-4 snap-x snap-mandatory scrollbar-hide"';

c = c.replace(oldContainer, newContainer);
fs.writeFileSync('client/src/pages/Storefront.jsx', c);
console.log("Updated to grid-rows-2");
