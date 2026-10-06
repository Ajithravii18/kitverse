const fs = require('fs');

let adminCode = fs.readFileSync('client/src/pages/AdminContent.jsx', 'utf8');

const schemaGuide = `
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">{selectedKey}</h2>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 text-blue-900 p-4 rounded mb-6 text-sm">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">info</span>
                JSON Format Reference
              </h3>
              <p className="mb-2">This section expects a JSON object. Ensure you use valid JSON syntax (double quotes for keys and string values). To hide this section from the storefront, set <code>"isActive": false</code>.</p>
              
              {selectedKey === 'homepage-hero' && (
                <pre className="bg-white p-3 rounded border border-blue-100 overflow-x-auto">
{JSON.stringify({
  "aboutLabel": "Text above the about paragraph",
  "aboutText": "Main about paragraph text",
  "title": "Main column title",
  "subtitle": "Subtitle text below title",
  "registry": "Registry text label",
  "headline": "Secondary headline",
  "cta": "Call to action button text",
  "isActive": true
}, null, 2)}
                </pre>
              )}
              
              {selectedKey === 'announcement-bar' && (
                <pre className="bg-white p-3 rounded border border-blue-100 overflow-x-auto">
{JSON.stringify({
  "text": "FREE SHIPPING ON ORDERS OVER ₹1500 / USE CODE EXTRA10 FOR 10% OFF",
  "isActive": true
}, null, 2)}
                </pre>
              )}
              
              {selectedKey !== 'homepage-hero' && selectedKey !== 'announcement-bar' && (
                <p className="text-gray-500 italic mt-2">No specific format guide available for this key. Typically expects a JSON object.</p>
              )}
            </div>
            
            <div className="mb-4">
`;

adminCode = adminCode.replace(
  /<div className="flex justify-between items-center mb-6">\s*<h2 className="text-3xl font-bold">\{selectedKey\}<\/h2>\s*<\/div>\s*<div className="mb-4">/,
  schemaGuide
);

fs.writeFileSync('client/src/pages/AdminContent.jsx', adminCode);
