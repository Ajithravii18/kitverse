const fs = require('fs');

let code = fs.readFileSync('client/src/pages/AdminContent.jsx', 'utf8');

const toggleFunction = `
  const handleToggleVisibility = async (currentIsActive) => {
    setIsSaving(true);
    try {
      let parsedValue = JSON.parse(draftValue);
      parsedValue.isActive = !currentIsActive;
      const newDraftValue = JSON.stringify(parsedValue, null, 2);
      setDraftValue(newDraftValue);

      const draftRes = await fetch(\`/api/admin/content/\${selectedKey}/draft\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: parsedValue })
      });
      if (!draftRes.ok) throw new Error(await draftRes.text());

      const res = await fetch(\`/api/admin/content/\${selectedKey}/publish\`, {
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
`;

code = code.replace(
  /if \(loading && !contentList\.length\) return <div className="p-6">Loading content editor\.\.\.<\/div>;/,
  toggleFunction.trim()
);

const oldButton = `                          <button 
                            onClick={() => {
                              const newParsed = { ...parsed, isActive: !isActive };
                              setDraftValue(JSON.stringify(newParsed, null, 2));
                            }}
                            className={\`px-4 py-2 rounded font-bold text-sm transition-colors \${isActive ? 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200' : 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'}\`}
                          >`;

const newButton = `                          <button 
                            disabled={isSaving}
                            onClick={() => handleToggleVisibility(isActive)}
                            className={\`px-4 py-2 rounded font-bold text-sm transition-colors \${isActive ? 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200' : 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'} \${isSaving ? 'opacity-50 cursor-not-allowed' : ''}\`}
                          >`;

code = code.replace(oldButton, newButton);

fs.writeFileSync('client/src/pages/AdminContent.jsx', code);
