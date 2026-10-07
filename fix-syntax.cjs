const fs = require('fs');
let code = fs.readFileSync('client/src/pages/ShopPage.jsx', 'utf8');

code = code.replace(/<\/div>\n\s*<\/div>;/, '</div>;');
code = code.replace(/<div className="shop-layout">/, '');
code = code.replace(/<\/div>\n\s*<\/div>\n\s*<\/section>/, '</div>\n        </section>');

fs.writeFileSync('client/src/pages/ShopPage.jsx', code);
console.log('Fixed syntax in ShopPage');
