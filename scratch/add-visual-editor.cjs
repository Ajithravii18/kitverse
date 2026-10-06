const fs = require('fs');

let adminCode = fs.readFileSync('client/src/pages/AdminContent.jsx', 'utf8');

const advancedEditorCode = `
              {/* Quick Actions for non-programmers */}
              {(() => {
                try {
                  const parsed = JSON.parse(draftValue);
                  if (typeof parsed === 'object' && parsed !== null) {
                    const isActive = parsed.isActive !== false;
                    return (
                      <div className="mb-6">
                        <div className="p-4 bg-gray-50 rounded-t border-t border-x flex items-center justify-between">
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
                        
                        <div className="p-4 bg-white border rounded-b flex flex-col gap-4 shadow-sm">
                          <h4 className="font-bold text-sm mb-2 border-b pb-2">Easy Content Editor</h4>
                          {Object.entries(parsed).map(([key, val]) => {
                            if (key === 'isActive') return null; // handled by button
                            if (typeof val === 'string') {
                              return (
                                <div key={key} className="flex flex-col gap-1">
                                  <label className="text-xs font-bold uppercase tracking-wider text-gray-600">{key}</label>
                                  {val.length > 50 ? (
                                    <textarea 
                                      className="border p-2 rounded text-sm w-full focus:border-black focus:ring-1 focus:ring-black outline-none"
                                      rows={3}
                                      value={val}
                                      onChange={(e) => {
                                        const newParsed = { ...parsed, [key]: e.target.value };
                                        setDraftValue(JSON.stringify(newParsed, null, 2));
                                      }}
                                    />
                                  ) : (
                                    <input 
                                      type="text" 
                                      className="border p-2 rounded text-sm w-full focus:border-black focus:ring-1 focus:ring-black outline-none"
                                      value={val}
                                      onChange={(e) => {
                                        const newParsed = { ...parsed, [key]: e.target.value };
                                        setDraftValue(JSON.stringify(newParsed, null, 2));
                                      }}
                                    />
                                  )}
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    );
                  }
                } catch(e) {
                  // Not valid JSON yet, don't show dynamic form
                }
                return null;
              })()}

              <details className="mb-4">
                <summary className="cursor-pointer font-bold text-sm text-gray-500 hover:text-black mb-2">Advanced: Edit Raw JSON</summary>
                <textarea 
`;

adminCode = adminCode.replace(
  /\{\/\* Quick Actions for non-programmers \*\/\}.*?<textarea \n/s,
  advancedEditorCode
);

fs.writeFileSync('client/src/pages/AdminContent.jsx', adminCode);
