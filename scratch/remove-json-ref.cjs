const fs = require('fs');

let adminCode = fs.readFileSync('client/src/pages/AdminContent.jsx', 'utf8');

const regex = /<div className="bg-blue-50 border border-blue-200 text-blue-900 p-4 rounded mb-6 text-sm">[\s\S]*?<\/div>\s*<div className="mb-4">/;

if (regex.test(adminCode)) {
  adminCode = adminCode.replace(regex, '<div className="mb-4">');
  fs.writeFileSync('client/src/pages/AdminContent.jsx', adminCode);
  console.log('Removed JSON Format Reference');
} else {
  console.log('Could not find JSON Format Reference to remove');
}
