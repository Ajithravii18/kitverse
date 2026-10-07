const fs = require('fs');
let code = fs.readFileSync('client/src/components/home/Categories.jsx', 'utf8');

code = code.replace(/grid-cols-1 md:grid-cols-2 lg:grid-cols-4/g, 'grid-cols-2 lg:grid-cols-4');
code = code.replace(/aspect-\[4\/5\] sm:aspect-\[3\/4\]/g, 'aspect-square md:aspect-[3/4]');

// Remove hardcoded unit counts
code = code.replace(/<div className="absolute top-2.5 right-2.5[^>]*>\s*[\d]+\s*UNITS\s*<\/div>/g, '');

// Clean up old classes
code = code.replace(/bg-surface-container-low/g, 'bg-card');
code = code.replace(/text-black/g, 'text-foreground');
code = code.replace(/bg-surface-container/g, 'bg-card');

fs.writeFileSync('client/src/components/home/Categories.jsx', code);
console.log('Categories rewritten');
