const fs = require('fs');
let code = fs.readFileSync('client/src/pages/ShopPage.jsx', 'utf8');
code = code.replace('<div className="shop-page" id="top">', '<div className="shop-page pt-24" id="top">');
fs.writeFileSync('client/src/pages/ShopPage.jsx', code);
console.log('Fixed padding');
