const fs = require('fs');
const file = 'C:/Users/AJITH/OneDrive/Documents/New project/client/src/pages/AdminOrders.jsx';
let content = fs.readFileSync(file, 'utf8');

const processReturnFix = `
  const processReturn = async (returnId, status, adminNotes = '') => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(\`/api/admin/orders/\${selectedOrder._id}/return/\${returnId}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process return');
    } catch (err) {
      setError(err.message);
    } finally {
      await fetchOrders();
      setBusy(false);
    }
  };
`;

content = content.replace(/const processReturn = async \([\s\S]*?^\s*\};\n/m, processReturnFix.trim() + '\n\n');
fs.writeFileSync(file, content);
