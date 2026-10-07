const fs = require('fs');
let css = fs.readFileSync('client/src/shop-page.css', 'utf8');

css = css.replace(/:root\s*\{[^}]+\}/m, `:root {
  --shop-ink: #000000;
  --shop-paper: #FFFFFF;
  --shop-lime: #F4793A;
  --shop-muted: #808080;
  --shop-line: #D6D3D1;
  --brand-yellow: #F4793A;
  --brand-yellow-dim: #d4ac0d;
}`);

css = css.replace(/font-family:[^;]+;/g, '');
fs.writeFileSync('client/src/shop-page.css', css);
console.log('Fixed shop page CSS');
