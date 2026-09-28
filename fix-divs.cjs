const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');
c = c.replace('</section><section id="selection"', '</div></div></section><section id="selection"');
fs.writeFileSync('client/src/pages/Storefront.jsx', c);
