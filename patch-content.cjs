const fs = require('fs');
let code = fs.readFileSync('client/src/pages/AdminContent.jsx', 'utf8');

if (!code.includes('const [searchTerm, setSearchTerm]')) {
  code = code.replace(
    /const \[error, setError\] = useState\(null\);/,
    `const [error, setError] = useState(null);\n  const [searchTerm, setSearchTerm] = useState('');`
  );
}

const ui = `
        <div className="mb-4">
          <input 
            type="text" 
            placeholder="Search content keys..." 
            className="border p-2 w-full rounded"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
`;

if (code.includes('{allowlist.map(key => {') && !code.includes('placeholder="Search content keys')) {
  const insertIndex = code.indexOf('{allowlist.map(key => {');
  code = code.slice(0, insertIndex) + ui + code.slice(insertIndex);
  
  code = code.replace(
    /\{allowlist\.map\(key => \{/g,
    `{allowlist.filter(key => key.toLowerCase().includes(searchTerm.toLowerCase())).map(key => {`
  );
}

fs.writeFileSync('client/src/pages/AdminContent.jsx', code);
