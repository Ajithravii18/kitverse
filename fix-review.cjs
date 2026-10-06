const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client', 'src', 'pages', 'Storefront.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// The review card image has alt="Track pants specimen unboxed"
content = content.replace(
  /className="relative w-full aspect-\[4\/5\] sm:aspect-\[3\/4\] bg-surface-container overflow-hidden"(.*?)alt="Track pants specimen unboxed"/gs,
  'className="relative w-full h-44 bg-surface-container overflow-hidden"$1alt="Track pants specimen unboxed"'
);

fs.writeFileSync(filePath, content);
console.log("Fixed review card image height.");
