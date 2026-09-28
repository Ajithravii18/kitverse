const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');

// Apply to 26/27 grid
c = c.replace(/className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 bg-\[#0a0a0a\] p-4 md:p-8"/g, 'className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 bg-[#0a0a0a] p-4 md:p-8 pamidor-list"');
// Apply to those cards
c = c.replace(/className="flex flex-col sm:flex-row bg-white h-auto sm:h-\[500px\] overflow-hidden group relative"/g, 'className="flex flex-col sm:flex-row bg-white h-auto sm:h-[500px] overflow-hidden group relative pamidor-item"');
c = c.replace(/className="bg-white h-\[500px\] p-6 relative group overflow-hidden flex flex-col justify-between"/g, 'className="bg-white h-[500px] p-6 relative group overflow-hidden flex flex-col justify-between pamidor-item"');

// Apply to Know Your Kit grid
c = c.replace(/className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop"/g, 'className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop pamidor-list"');
c = c.replace(/className="bg-surface p-space-lg flex flex-col justify-between h-full gap-space-lg"/g, 'className="bg-surface p-space-lg flex flex-col justify-between h-full gap-space-lg pamidor-item"');

// Filter Index
c = c.replace(/className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop"/g, 'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop pamidor-list"');
c = c.replace(/className="w-full text-left p-space-lg border border-black\/10 hover:border-black\/30 transition-colors flex flex-col gap-space-sm group"/g, 'className="w-full text-left p-space-lg border border-black/10 hover:border-black/30 transition-colors flex flex-col gap-space-sm group pamidor-item"');

fs.writeFileSync('client/src/pages/Storefront.jsx', c);
