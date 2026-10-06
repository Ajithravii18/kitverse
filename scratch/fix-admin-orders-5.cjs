const fs = require('fs');
const file = 'C:/Users/AJITH/OneDrive/Documents/New project/client/src/pages/AdminOrders.jsx';
let content = fs.readFileSync(file, 'utf8');

const sessionFix = `
  const getSavedKey = (orderId) => {
    if (!orderId) return generateIdempotency();
    let key = sessionStorage.getItem(\`refundKey_\${orderId}\`);
    if (!key) {
      key = generateIdempotency();
      sessionStorage.setItem(\`refundKey_\${orderId}\`, key);
    }
    return key;
  };

  useEffect(() => {
    setShipData({ courier: '', trackingNumber: '', trackingUrl: '' });
    setRefundData({ amount: '', reason: '' });
    if (selectedOrder?._id) {
      setRefundKey(getSavedKey(selectedOrder._id));
    }
    setReturnData({ slug: '', size: '', qty: 1, reason: '', exchangeForSize: '' });
    setError(null);
  }, [selectedOrder?._id]);
`;

// Replace the previous useEffect block with the new one
content = content.replace(/useEffect\(\(\) => \{\s*setShipData\(\{ courier: '', trackingNumber: '', trackingUrl: '' \}\);\s*setRefundData\(\{ amount: '', reason: '' \}\);\s*setRefundKey\(generateIdempotency\(\)\);\s*setReturnData\(\{ slug: '', size: '', qty: 1, reason: '', exchangeForSize: '' \}\);\s*setError\(null\);\s*\}, \[selectedOrder\?\._id\]\);/, sessionFix.trim());

// We also need to update handleRefund to replace the sessionStorage key on success
const handleRefundFix = `
  const handleRefund = (e) => {
    e.preventDefault();
    const amountInPaise = Math.round(parseFloat(refundData.amount) * 100);
    if (confirm(\`Are you sure you want to refund \${money(amountInPaise)}?\`)) {
      handleAction('refund', {
        amount: amountInPaise,
        reason: refundData.reason,
        idempotencyKey: refundKey
      }, () => {
        setRefundData({ amount: '', reason: '' });
        const newKey = generateIdempotency();
        setRefundKey(newKey);
        sessionStorage.setItem(\`refundKey_\${selectedOrder._id}\`, newKey);
      });
    }
  };
`;

content = content.replace(/const handleRefund = \(e\) => \{[\s\S]*?^\s*\};\n/m, handleRefundFix.trim() + '\n\n');

fs.writeFileSync(file, content);
