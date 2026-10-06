const fs = require('fs');
let content = fs.readFileSync('C:/Users/AJITH/OneDrive/Documents/New project/server/stage3-routes.js', 'utf8');

// The backtick was accidentally written as \\`
content = content.replace(/\\\\`/g, '`').replace(/\\`/g, '`');

fs.writeFileSync('C:/Users/AJITH/OneDrive/Documents/New project/server/stage3-routes.js', content);
