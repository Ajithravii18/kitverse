const fs = require('fs');
let code = fs.readFileSync('client/src/pages/AdminDiscounts.jsx', 'utf8');

if (!code.includes('const [searchTerm, setSearchTerm]')) {
  code = code.replace(
    /const \[loading, setLoading\] = useState\(true\);/,
    `const [loading, setLoading] = useState(true);\n  const [searchTerm, setSearchTerm] = useState('');`
  );
}

const ui = `
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search by code..." 
          className="border p-2 w-full max-w-lg rounded"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
`;

if (code.includes('{loading ? <p>Loading...</p> : (') && !code.includes('placeholder="Search by code')) {
  const insertIndex = code.indexOf('{loading ? <p>Loading...</p> : (');
  code = code.slice(0, insertIndex) + ui + code.slice(insertIndex);
  
  code = code.replace(
    /\{discounts\.map\(d => \(/g,
    `{discounts
              .filter(d => (d.code || '').toLowerCase().includes(searchTerm.toLowerCase()))
              .map(d => (`
  );
}

fs.writeFileSync('client/src/pages/AdminDiscounts.jsx', code);
