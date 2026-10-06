const fs = require('fs');
const file = 'C:/Users/AJITH/OneDrive/Documents/New project/client/src/pages/AdminOrders.jsx';
let content = fs.readFileSync(file, 'utf8');

const fetchOrdersFix = `
  const fetchOrders = () => {
    setLoading(true);
    return fetch('/api/admin/orders')
      .then(r => {
        if (!r.ok) throw new Error('Data refresh failed');
        return r.json();
      })
      .then(data => {
        setOrders(data.orders || []);
        setSelectedOrder(current => {
          if (!current) return null;
          return data.orders.find(o => o._id === current._id) || current;
        });
        setLoading(false);
        setError(null);
      })
      .catch(err => {
        setError('Lost connection to server. Controls locked to prevent stale actions.');
        setOrders([]);
        setSelectedOrder(null);
        setLoading(false);
        throw err;
      });
  };
`;

content = content.replace(/const fetchOrders = \(\) => \{[\s\S]*?^\s*\};\n/m, fetchOrdersFix.trim() + '\n\n');
fs.writeFileSync(file, content);
