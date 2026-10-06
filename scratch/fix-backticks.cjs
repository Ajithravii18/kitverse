const fs = require('fs');
const glob = require('fs').readdirSync;
const path = require('path');

function fixFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  if (content.includes('\\${')) {
    content = content.replace(/\\\$\{/g, '${');
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Fixed', filepath);
  }
}

fixFile('client/src/components/admin/AdminLayout.jsx');
fixFile('client/src/pages/AdminContent.jsx');
fixFile('client/src/pages/AdminDiscounts.jsx');
fixFile('client/src/pages/AdminReviews.jsx');
