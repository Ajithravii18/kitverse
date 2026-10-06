const fs = require('fs');
let code = fs.readFileSync('client/src/pages/AdminReviews.jsx', 'utf8');

if (!code.includes('const [searchTerm, setSearchTerm]')) {
  code = code.replace(
    /const \[loading, setLoading\] = useState\(true\);/,
    `const [loading, setLoading] = useState(true);\n  const [searchTerm, setSearchTerm] = useState('');\n  const [statusFilter, setStatusFilter] = useState('all');`
  );
}

const ui = `
      <div className="flex gap-2 mb-6">
        <input 
          type="text" 
          placeholder="Search by product or email..." 
          className="border p-2 rounded flex-1 text-sm max-w-sm"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select 
          className="border p-2 rounded text-sm"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
`;

if (code.includes('{loading ? <p>Loading...</p> : (') && !code.includes('placeholder="Search by product')) {
  const insertIndex = code.indexOf('{loading ? <p>Loading...</p> : (');
  code = code.slice(0, insertIndex) + ui + code.slice(insertIndex);
  
  code = code.replace(
    /\{reviews\.map\(r => \(/g,
    `{reviews
          .filter(r => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = ((r.productId && r.productId.name) || '').toLowerCase().includes(searchLower) || 
                                  ((r.userId && r.userId.email) || '').toLowerCase().includes(searchLower) ||
                                  (r.text || '').toLowerCase().includes(searchLower);
            const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
            return matchesSearch && matchesStatus;
          })
          .map(r => (`
  );
}

fs.writeFileSync('client/src/pages/AdminReviews.jsx', code);
