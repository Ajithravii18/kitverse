const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');
code = code.replace(
  /fetch\('\/api\/content\?keys=homepage-hero,announcement-bar'\)/,
  "fetch('/api/content?keys=homepage-hero,announcement-bar,featured-products')"
);
fs.writeFileSync('client/src/pages/Storefront.jsx', code);
