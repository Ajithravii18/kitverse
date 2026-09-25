const fs = require('fs');
const lines = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf-8').split('\n');
lines.forEach((l, i) => {
  if (l.includes('ticker') || l.includes('id="shop"') || l.includes('id="qualities"') || l.includes('bestsellers')) {
    console.log(i + ': ' + l.trim());
  }
});
