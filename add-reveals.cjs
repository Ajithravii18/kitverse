const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');

// Add reveal to pamidor-item
c = c.replace(/pamidor-item/g, 'pamidor-item reveal');

// Let's also check if there are other cards that need reveal, like product images inside the grids.
// Maybe add a subtle scale-out animation to images inside reveal elements?
// In GSAP, we can do this in useScrollReveal!

fs.writeFileSync('client/src/pages/Storefront.jsx', c);
