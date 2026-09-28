const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');

// Replace flex container with grid container
let oldContainer = '<div className="lg:col-span-8 flex overflow-x-auto gap-space-md pb-4 snap-x snap-mandatory scrollbar-hide"';
let newContainer = '<div className="lg:col-span-8 grid grid-rows-3 grid-flow-col auto-cols-[85vw] sm:auto-cols-[320px] md:auto-cols-[360px] lg:auto-cols-[300px] overflow-x-auto gap-space-md pb-4 snap-x snap-mandatory scrollbar-hide"';
c = c.replace(oldContainer, newContainer);

// The child links currently have widths like w-[85vw] ... we need to remove these so auto-cols works properly.
const oldLinkClass = 'w-[85vw] sm:w-[320px] md:w-[360px] flex-shrink-0 snap-start"';
const newLinkClass = 'w-full h-full snap-start"';
c = c.split(oldLinkClass).join(newLinkClass);

fs.writeFileSync('client/src/pages/Storefront.jsx', c);
console.log("Updated to 3x3 layout");
