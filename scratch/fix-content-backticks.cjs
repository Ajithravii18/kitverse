const fs = require('fs');
let content = fs.readFileSync('C:/Users/AJITH/OneDrive/Documents/New project/client/src/pages/AdminContent.jsx', 'utf8');
content = content.replace(/\\`/g, '`');
fs.writeFileSync('C:/Users/AJITH/OneDrive/Documents/New project/client/src/pages/AdminContent.jsx', content);
