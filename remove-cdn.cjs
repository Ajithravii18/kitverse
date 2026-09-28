const fs = require('fs');
let html = fs.readFileSync('client/index.html', 'utf8');
html = html.replace('<script src="https://cdn.tailwindcss.com"></script>', '');
html = html.replace(/<script id="tailwind-config">[\s\S]*?<\/script>/, '');
fs.writeFileSync('client/index.html', html);
