const fs = require('fs');

let adminCode = fs.readFileSync('client/src/pages/AdminContent.jsx', 'utf8');

// We want to add a toggle button for `isActive`.
// We need to parse draftValue to see if it's active.
const toggleButtonCode = `
            <div className="mb-4">
              <label className="block font-bold mb-2">Edit Draft Content (JSON or Text)</label>
              
              {/* Quick Actions for non-programmers */}
              {(() => {
                try {
                  const parsed = JSON.parse(draftValue);
                  if (typeof parsed === 'object' && parsed !== null) {
                    const isActive = parsed.isActive !== false;
                    return (
                      <div className="mb-4 p-4 bg-gray-100 rounded border flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm">Storefront Visibility</h4>
                          <p className="text-xs text-gray-500">Toggle whether this section is visible on the live storefront.</p>
                        </div>
                        <button 
                          onClick={() => {
                            const newParsed = { ...parsed, isActive: !isActive };
                            setDraftValue(JSON.stringify(newParsed, null, 2));
                          }}
                          className={\`px-4 py-2 rounded font-bold text-sm transition-colors \${isActive ? 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200' : 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'}\`}
                        >
                          {isActive ? 'Hide Section' : 'Reveal Section'}
                        </button>
                      </div>
                    );
                  }
                } catch(e) {
                  // Not valid JSON yet, don't show toggle
                }
                return null;
              })()}

              <textarea 
`;

adminCode = adminCode.replace(
  /<div className="mb-4">\s*<label className="block font-bold mb-2">Edit Draft Content \(JSON or Text\)<\/label>\s*<textarea/m,
  toggleButtonCode
);

fs.writeFileSync('client/src/pages/AdminContent.jsx', adminCode);
