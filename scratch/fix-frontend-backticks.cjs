const fs = require('fs');

function fixBackticks(path) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/\\\\`/g, '`').replace(/\\`/g, '`');
  fs.writeFileSync(path, content);
}

fixBackticks('C:/Users/AJITH/OneDrive/Documents/New project/client/src/pages/AdminDiscounts.jsx');
fixBackticks('C:/Users/AJITH/OneDrive/Documents/New project/client/src/pages/AdminReviews.jsx');
