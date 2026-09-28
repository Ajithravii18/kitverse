const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');

// Replace the container
c = c.replace(
  '<div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-space-md">',
  '<div className="lg:col-span-8 flex overflow-x-auto gap-space-md pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>'
);

// We need to add styling to hide the scrollbar in webkit as well, but style inline works for firefox/ie. 
// Or we can just let it have a scrollbar, but scrollbar-hide is standard tailwind plugin, though it might not be installed.
// We can just add custom CSS later, or inline styles.

// Add flex-shrink-0, w-width, snap-start to the club links.
// Let's replace the common class of the clubs in that section.
// The common class is: <a className="relative p-space-lg rounded-none transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-sm hover:scale-[1.01]"
const oldLinkClass = '<a className="relative p-space-lg rounded-none transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-sm hover:scale-[1.01]"';
const newLinkClass = '<a className="relative p-space-lg rounded-none transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-sm hover:scale-[1.01] w-[85vw] sm:w-[320px] md:w-[360px] flex-shrink-0 snap-start"';

c = c.split(oldLinkClass).join(newLinkClass);

fs.writeFileSync('client/src/pages/Storefront.jsx', c);
console.log("Updated to scrollable list.");
