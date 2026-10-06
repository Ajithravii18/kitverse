const fs = require('fs');
let content = fs.readFileSync('C:/Users/AJITH/OneDrive/Documents/New project/client/src/pages/Checkout.jsx', 'utf8');

// Add discount state
content = content.replace("const [error, setError] = useState('');", "const [error, setError] = useState('');\n  const [discountCode, setDiscountCode] = useState('');\n  const [discountResult, setDiscountResult] = useState(null);\n  const [discountError, setDiscountError] = useState('');\n  const [applyingDiscount, setApplyingDiscount] = useState(false);");

const applyDiscountHtml = `
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setApplyingDiscount(true);
    setDiscountError('');
    setDiscountResult(null);
    try {
      const res = await fetch('/api/checkout/validate-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountCode, subtotal: total })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid code');
      setDiscountResult(data);
    } catch (err) {
      setDiscountError(err.message);
    } finally {
      setApplyingDiscount(false);
    }
  };

  const finalTotal = total - (discountResult ? discountResult.discountAmount : 0);
`;

content = content.replace("const total = cart.reduce((n, x) => n + x.price * x.qty, 0);", "const total = cart.reduce((n, x) => n + x.price * x.qty, 0);\n" + applyDiscountHtml);

// Pass discountCode to checkout request
content = content.replace("body:JSON.stringify({customer:formData,items:cart})", "body:JSON.stringify({customer:formData,items:cart,discountCode:discountResult ? discountResult.code : undefined})");

// Add discount UI in summary section
const summaryHtml = `
  {discountResult && (
    <div className="flex justify-between py-2 border-b text-green-700">
      <span>Discount ({discountResult.code})</span>
      <span>-{money(discountResult.discountAmount)}</span>
    </div>
  )}
  <div className="flex justify-between py-4 font-bold text-lg">
    <span>Total</span>
    <span>{money(finalTotal)}</span>
  </div>
  {!pendingOrder && (
    <div className="mt-4 pb-4 border-b">
      <label className="block text-sm font-bold mb-2 uppercase">Discount Code / Voucher</label>
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Enter code" 
          className="border p-2 flex-1 rounded uppercase" 
          value={discountCode} 
          onChange={e => setDiscountCode(e.target.value.toUpperCase())}
          disabled={applyingDiscount || discountResult}
        />
        {discountResult ? (
          <button type="button" onClick={() => {setDiscountResult(null); setDiscountCode('');}} className="bg-red-600 text-white px-4 py-2 rounded text-sm uppercase">Remove</button>
        ) : (
          <button type="button" onClick={handleApplyDiscount} disabled={applyingDiscount || !discountCode} className="bg-black text-white px-4 py-2 rounded text-sm uppercase">Apply</button>
        )}
      </div>
      {discountError && <p className="text-red-600 text-xs mt-2">{discountError}</p>}
    </div>
  )}
`;

content = content.replace(/<div className="flex justify-between py-4 font-bold text-lg">[\s\S]*?<\/span>[\s\S]*?<\/div>/, summaryHtml);

fs.writeFileSync('C:/Users/AJITH/OneDrive/Documents/New project/client/src/pages/Checkout.jsx', content);
