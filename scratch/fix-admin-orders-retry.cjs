const fs = require('fs');
const file = 'C:/Users/AJITH/OneDrive/Documents/New project/client/src/pages/AdminOrders.jsx';
let content = fs.readFileSync(file, 'utf8');

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
      try {
        await fetchOrders();
      } catch (err) {
        // fetchOrders sets its own error state
      }
      setBusy(false);
    }
  };
`;

content = content.replace(/const handleAction = async \([\s\S]*?^\s*\};\n/m, handleActionFix.trim() + '\n\n');

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
      try {
        await fetchOrders();
      } catch (err) {}
      setBusy(false);
    }
  };
`;
content = content.replace(/const processReturn = async \([\s\S]*?^\s*\};\n/m, processReturnFix.trim() + '\n\n');

// Add a retry button to the left pane if it errored
content = content.replace(/\{error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">\{error\}<\/div>\}/, `{error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded flex flex-col gap-2">{error} <button onClick={fetchOrders} className="bg-red-600 text-white px-2 py-1 rounded text-sm self-start">Retry Data Sync</button></div>}`);

fs.writeFileSync(file, content);
