const fs = require('fs');
let code = fs.readFileSync('client/src/pages/AdminContent.jsx', 'utf8');

const oldHandlePublish = `
  const handlePublish = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(\`/api/admin/content/\${selectedKey}/publish\`, {
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
`;

const newHandlePublish = `
  const handlePublish = async () => {
    setIsSaving(true);
    try {
      let parsedValue = draftValue;
      try { parsedValue = JSON.parse(draftValue); } catch(e) {} // auto convert if valid json
      
      // Save draft first just in case they didn't
      const draftRes = await fetch(\`/api/admin/content/\${selectedKey}/draft\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: parsedValue })
      });
      if (!draftRes.ok) throw new Error(await draftRes.text());

      // Then publish
      const res = await fetch(\`/api/admin/content/\${selectedKey}/publish\`, {
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
`;

if (code.includes(oldHandlePublish.trim().split('\\n')[0])) {
  code = code.replace(
    /const handlePublish = async \(\) => \{[\s\S]*?\n  \};\n/,
    newHandlePublish.trim() + '\\n'
  );
  
  // also fix the button disabled condition so they can publish a new unsaved draft
  code = code.replace(
    /<button disabled=\{isSaving \|\| !currentItem\?\.draftValue\} onClick=\{handlePublish\}/g,
    '<button disabled={isSaving || !draftValue} onClick={handlePublish}'
  );

  fs.writeFileSync('client/src/pages/AdminContent.jsx', code);
  console.log('Fixed handlePublish');
} else {
  console.log('Could not find handlePublish');
}
