const fs = require('fs');
let code = fs.readFileSync('client/src/pages/AdminReports.jsx', 'utf8');

if (!code.includes('const [searchTerm, setSearchTerm]')) {
  code = code.replace(
    /const \[loading, setLoading\] = useState\(true\);/,
    `const [loading, setLoading] = useState(true);\n  const [searchTerm, setSearchTerm] = useState('');\n  const [sortBy, setSortBy] = useState('revenue-desc');`
  );
}

const ui = `
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Product Performance</h2>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Search product slug..." 
            className="border p-2 rounded text-sm w-64"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select className="border p-2 rounded text-sm" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="revenue-desc">Revenue (High to Low)</option>
            <option value="revenue-asc">Revenue (Low to High)</option>
            <option value="qty-desc">Units Sold (High to Low)</option>
            <option value="qty-asc">Units Sold (Low to High)</option>
          </select>
        </div>
      </div>
`;

if (code.includes('<h2 className="text-xl font-bold mb-4">Product Performance</h2>') && !code.includes('placeholder="Search product slug')) {
  code = code.replace('<h2 className="text-xl font-bold mb-4">Product Performance</h2>', ui);
  
  code = code.replace(
    /\{report\.sales\?\.map\(\(s, i\) => \(/g,
    `{report.sales
              ?.filter(s => (s._id?.slug || '').toLowerCase().includes(searchTerm.toLowerCase()))
              .sort((a, b) => {
                if (sortBy === 'revenue-desc') return b.grossLineRevenue - a.grossLineRevenue;
                if (sortBy === 'revenue-asc') return a.grossLineRevenue - b.grossLineRevenue;
                if (sortBy === 'qty-desc') return b.qty - a.qty;
                if (sortBy === 'qty-asc') return a.qty - b.qty;
                return 0;
              })
              .map((s, i) => (`
  );
}

fs.writeFileSync('client/src/pages/AdminReports.jsx', code);
