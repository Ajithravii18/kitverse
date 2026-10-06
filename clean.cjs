const fs = require('fs');
let content = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');

// Remove Marquees
content = content.replace(/import Marquee from '\.\.\/components\/Marquee\.jsx';\n?/g, '');
content = content.replace(/<Marquee[^>]*\/>/g, '');

// Remove Reviews
content = content.replace(/import Reviews from '\.\.\/components\/home\/Reviews\.jsx';\n?/g, '');
content = content.replace(/<Reviews \/>/g, '');

// Clean up the fake 'Atelier' section in Storefront
content = content.replace(/<section className="w-full bg-primary-container[\s\S]*?<\/section>/, '');

fs.writeFileSync('client/src/pages/Storefront.jsx', content);
console.log('Cleaned up Storefront.jsx');
