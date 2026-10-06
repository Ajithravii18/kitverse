const fs = require('fs');
const file = 'C:/Users/AJITH/OneDrive/Documents/New project/client/src/pages/AdminOrders.jsx';
let content = fs.readFileSync(file, 'utf8');

const fetchOrdersFix = `
  const fetchOrders = () => {
    setLoading(true);
    return fetch('/api/admin/orders')
      .then(r => r.json())
      .then(data => {
        setOrders(data.orders || []);
        setSelectedOrder(current => {
          if (!current) return null;
          return data.orders.find(o => o._id === current._id) || current;
        });
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };
`;

const handleActionFix = `
  const handleAction = async (endpoint, payload, onSuccess) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(\`/api/admin/orders/\${selectedOrder._id}/\${endpoint}\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      await fetchOrders();
      setBusy(false);
    }
  };
`;

content = content.replace(/const fetchOrders = \(\) => \{[\s\S]*?^\s*\};\n/m, fetchOrdersFix.trim() + '\n\n');
content = content.replace(/const handleAction = async \([\s\S]*?^\s*\};\n/m, handleActionFix.trim() + '\n\n');

fs.writeFileSync(file, content);
