const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client', 'src', 'pages', 'Storefront.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// The category cards and review card have 'w-full h-44'
// We replace 'w-full h-44' with 'w-full aspect-[3/4] sm:aspect-[4/5]' to make them portrait.
content = content.replace(/className="relative w-full h-44 bg-surface-container overflow-hidden"/g, 'className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-surface-container overflow-hidden"');

fs.writeFileSync(filePath, content);
console.log("Updated Storefront.jsx to use portrait aspect ratio for cards.");
