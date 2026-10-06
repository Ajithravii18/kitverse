const fs = require('fs');
let code = fs.readFileSync('client/src/pages/AdminProducts.jsx', 'utf8');

if (!code.includes('const [searchTerm, setSearchTerm]')) {
  code = code.replace(
    /const \[error, setError\] = useState\(''\);/,
    `const [error, setError] = useState('');\n  const [searchTerm, setSearchTerm] = useState('');\n  const [sortBy, setSortBy] = useState('name-asc');`
  );
}

const targetReturn = `      {error && <p role="alert">{error} <button onClick={loadProducts}>Retry</button></p>}`;

if (code.includes(targetReturn) && !code.includes('placeholder="Search products by name')) {
  const insertIndex = code.indexOf(targetReturn);
  
  const ui = `      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search products by name or SKU..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>\n`;
      
  code = code.slice(0, insertIndex) + ui + code.slice(insertIndex);
}

if (code.includes('{products.map(p => (') && !code.includes('.filter(p =>')) {
  code = code.replace(
    /\{products\.map\(p => \(/g,
    `{products
              .filter(p => (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (p.slug || '').toLowerCase().includes(searchTerm.toLowerCase()))
              .sort((a, b) => {
                if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
                if (sortBy === 'name-desc') return (b.name || '').localeCompare(a.name || '');
                if (sortBy === 'price-asc') return a.price - b.price;
                if (sortBy === 'price-desc') return b.price - a.price;
                return 0;
              })
              .map(p => (`
  );
}

fs.writeFileSync('client/src/pages/AdminProducts.jsx', code);
