const fs = require('fs');
let css = fs.readFileSync('client/src/style.css', 'utf8');

// Remove .hero h1 overrides
css = css.replace('.hero h1 { font-size: clamp(44px, 12vw, 65px); }', '');
css = css.replace('.hero-copy h1 { font-size: clamp(40px, 11vw, 60px); margin: 10px 0 8px; }', '');

// Remove global h1 overrides
css = css.replace(/h1\{font-size:clamp\([^)]+\);/g, 'h1{');

fs.writeFileSync('client/src/style.css', css);
console.log('Removed h1 overrides properly');
