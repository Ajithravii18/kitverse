import React, { useState, useEffect } from 'react';

export default function AdminContent() {
  const [contentList, setContentList] = useState([]);
  const [allowlist, setAllowlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedKey, setSelectedKey] = useState(null);
  const [draftValue, setDraftValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Format based on JSON vs Text
  const isJson = (str) => {
    try {
      if (typeof str === 'object') return true;
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const fetchContent = () => {
    setLoading(true);
    fetch('/api/admin/content')
      .then(r => r.json())
      .then(data => {
        setContentList(data.content || []);
        setAllowlist(data.allowlist || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSelect = (key) => {
    setSelectedKey(key);
    const item = contentList.find(c => c.key === key);
    if (item && item.draftValue) {
      setDraftValue(typeof item.draftValue === 'object' ? JSON.stringify(item.draftValue, null, 2) : item.draftValue);
    } else if (item && item.publishedValue) {
      setDraftValue(typeof item.publishedValue === 'object' ? JSON.stringify(item.publishedValue, null, 2) : item.publishedValue);
    } else {
      // Auto-initialize empty sections with default schemas so the Easy Editor appears
      let defaultTemplate = {};
      if (key === 'shipping-info') {
        defaultTemplate = { title: "Shipping Policy", content: "We ship all orders within 2-3 business days. Tracking details will be provided via email.", isActive: true };
      } else if (key === 'returns-info') {
        defaultTemplate = { title: "Returns & Exchanges", content: "Returns are accepted within 14 days of delivery for unwashed and unworn items with tags attached.", isActive: true };
      } else if (key === 'size-guide') {
        defaultTemplate = { title: "Size Guide", description: "All our jerseys follow a standard athletic fit. We recommend sizing up for a looser streetwear fit.", isActive: true };
      } else if (key === 'featured-products') {
        defaultTemplate = { heading: "Featured Archive", category: "club", limit: "4", isActive: true };
      } else if (key === 'homepage-hero') {
        defaultTemplate = { aboutLabel: "ABOUT US:", aboutText: "Enter text...", title: "MATCHDAY ARCHIVE", subtitle: "2024 / 2025 REVEAL SPECIFICATION", registry: "REGISTRY // FROM 2024", headline: "ENGINEERED FOR THE MODERN ICON", cta: "EXPLORE THE ARCHIVE", isActive: true };
      } else if (key === 'announcement-bar') {
        defaultTemplate = { text: "Enter announcement here...", isActive: true };
      } else {
        defaultTemplate = { text: "Default content", isActive: true };
      }
      setDraftValue(JSON.stringify(defaultTemplate, null, 2));
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      let parsedValue = draftValue;
      try { 
        parsedValue = JSON.parse(draftValue); 
      } catch(e) {
        if (draftValue.trim().startsWith('{') || draftValue.trim().startsWith('[')) {
          throw new Error('Invalid JSON format. Please check your syntax.');
        }
      }
      
      const res = await fetch(`/api/admin/content/${selectedKey}/draft`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: parsedValue })
      });
      if (!res.ok) throw new Error(await res.text());
      fetchContent();
      alert('Draft saved!');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      let parsedValue = draftValue;
      try { 
        parsedValue = JSON.parse(draftValue); 
      } catch(e) {
        if (draftValue.trim().startsWith('{') || draftValue.trim().startsWith('[')) {
          throw new Error('Invalid JSON format. Please check your syntax.');
        }
      }
      
      // Save draft first just in case they didn't
      const draftRes = await fetch(`/api/admin/content/${selectedKey}/draft`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: parsedValue })
      });
      if (!draftRes.ok) throw new Error(await draftRes.text());

      // Then publish
      const res = await fetch(`/api/admin/content/${selectedKey}/publish`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error(await res.text());
      fetchContent();
      alert('Published to Storefront!');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async (currentIsActive) => {
    setIsSaving(true);
    try {
      let parsedValue = JSON.parse(draftValue);
      parsedValue.isActive = !currentIsActive;
      const newDraftValue = JSON.stringify(parsedValue, null, 2);
      setDraftValue(newDraftValue);

      const draftRes = await fetch(`/api/admin/content/${selectedKey}/draft`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: parsedValue })
      });
      if (!draftRes.ok) throw new Error(await draftRes.text());

      const res = await fetch(`/api/admin/content/${selectedKey}/publish`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error(await res.text());
      
      fetchContent();
      // Optional: don't even alert, just let it be snappy. Or a small toast. We'll use alert for now.
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !contentList.length) return <div className="p-6">Loading content editor...</div>;

  const currentItem = contentList.find(c => c.key === selectedKey);

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3 border-r pr-6 h-[calc(100vh-100px)] overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Content Editor</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
        
        
        <div className="mb-4">
          <input 
            type="text" 
            placeholder="Search content keys..." 
            className="border p-2 w-full rounded"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
{allowlist.filter(key => key.toLowerCase().includes(searchTerm.toLowerCase())).map(key => {
          const item = contentList.find(c => c.key === key);
          const hasDraft = item && item.draftValue && JSON.stringify(item.draftValue) !== JSON.stringify(item.publishedValue);
          
          return (
            <div 
              key={key} 
              onClick={() => handleSelect(key)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedKey === key ? 'bg-gray-100 border-l-4 border-black' : ''}`}
            >
              <div className="font-bold">{key}</div>
              <div className="text-sm mt-1 flex gap-2">
                {item?.publishedValue ? <span className="text-green-600">Published</span> : <span className="text-gray-400">Empty</span>}
                {hasDraft && <span className="text-yellow-600 font-bold">*Draft</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full md:w-2/3 h-[calc(100vh-100px)] overflow-y-auto pr-4">
        {selectedKey ? (
          <div>
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">{selectedKey}</h2>
            </div>
            
            <div className="mb-4">
              <label className="block font-bold mb-2">Edit Draft Content (JSON or Text)</label>
              
              
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
                            disabled={isSaving}
                            onClick={() => handleToggleVisibility(isActive)}
                            className={`px-4 py-2 rounded font-bold text-sm transition-colors ${isActive ? 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200' : 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'} ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
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
 
                className="w-full h-96 p-4 border rounded font-mono text-sm bg-gray-50"
                value={draftValue}
                onChange={e => setDraftValue(e.target.value)}
              />
            </details>
            </div>
            
            <div className="flex gap-4 mb-8">
              <button disabled={isSaving} onClick={handleSaveDraft} className="bg-gray-800 text-white px-6 py-2 rounded">
                Save Draft
              </button>
              <button disabled={isSaving || !draftValue} onClick={handlePublish} className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50">
                Publish to Live Storefront
              </button>
            </div>
            
            {currentItem && (
              <div className="border rounded p-4">
                <h3 className="font-bold mb-2">Activity History</h3>
                <div className="text-sm font-mono text-gray-600 max-h-40 overflow-y-auto">
                  {currentItem.history?.slice().reverse().map((h, i) => (
                    <div key={i} className="mb-1">
                      [{new Date(h.timestamp).toLocaleString()}] {h.action.toUpperCase()}
                    </div>
                  ))}
                  {!currentItem.history?.length && 'No activity yet.'}
                </div>
              </div>
            )}
            
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            Select a content key to edit
          </div>
        )}
      </div>
    </div>
  );
}
