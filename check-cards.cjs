const fs = require('fs');
const c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');
const start = c.indexOf('EXPLORE BY CATEGORY');
const end = c.indexOf('</section>', start);
const sectionHtml = c.substring(start, end);
console.log("Cards in section:", (sectionHtml.match(/<button/g) || []).length);
// Print the titles of these cards
const titles = sectionHtml.match(/<span className="font-headline-sm[^>]*>([^<]+)<\/span>/g);
console.log("Titles:", titles);
