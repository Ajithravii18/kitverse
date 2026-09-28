const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');
console.log("Count of the new link class: ", c.split('w-[85vw] sm:w-[320px] md:w-[360px] flex-shrink-0 snap-start"').length - 1);
