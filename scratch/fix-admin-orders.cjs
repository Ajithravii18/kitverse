const fs = require('fs');
const file = 'C:/Users/AJITH/OneDrive/Documents/New project/client/src/pages/AdminOrders.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\\`\(by Admin\)\\`/g, "'(by Admin)'");
fs.writeFileSync(file, content);
