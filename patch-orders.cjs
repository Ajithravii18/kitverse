const fs = require('fs');
let code = fs.readFileSync('client/src/pages/AdminOrders.jsx', 'utf8');

if (!code.includes('const [searchTerm, setSearchTerm]')) {
  code = code.replace(
    /const \[busy, setBusy\] = useState\(false\);/,
    `const [busy, setBusy] = useState(false);\n  const [searchTerm, setSearchTerm] = useState('');\n  const [statusFilter, setStatusFilter] = useState('all');`
  );
}

// Add the search UI above orders list map
const ui = `
        <div className="flex gap-2 mb-4">
          <input 
            type="text" 
            placeholder="Search by ID or email..." 
            className="border p-2 rounded flex-1 text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select 
            className="border p-2 rounded text-sm"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
`;

if (code.includes('{orders.map(o => (') && !code.includes('placeholder="Search by ID')) {
  const insertIndex = code.indexOf('{orders.map(o => (');
  code = code.slice(0, insertIndex) + ui + code.slice(insertIndex);
  
  code = code.replace(
    /\{orders\.map\(o => \(/g,
    `{orders
          .filter(o => {
            const matchesSearch = (o.orderRef || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  ((o.customer && o.customer.email) || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || o.fulfilmentStatus === statusFilter || o.paymentStatus === statusFilter;
            return matchesSearch && matchesStatus;
          })
          .map(o => (`
  );
}

fs.writeFileSync('client/src/pages/AdminOrders.jsx', code);
