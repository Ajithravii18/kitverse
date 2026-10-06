import React, { useState, useEffect } from 'react';


export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustData, setAdjustData] = useState({ size: 'M', quantityChange: 0, reason: '' });
  const [adjusting, setAdjusting] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load inventory.');
      if (!Array.isArray(data.products)) throw new Error('Invalid inventory response.');
      setProducts(data.products);
    } catch (err) {
      setProducts([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdjust = async (e) => {
    e.preventDefault();
    setAdjusting(true);
    setError(null);
    try {
      const idempotencyKey = Date.now().toString() + Math.random().toString();
      const res = await fetch('/api/admin/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSlug: selectedProduct.slug,
          size: adjustData.size,
          quantityChange: parseInt(adjustData.quantityChange, 10),
          reason: adjustData.reason,
          idempotencyKey
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Adjustment failed');
      
      setSelectedProduct(null);
      setAdjustData({ size: 'M', quantityChange: 0, reason: '' });
      fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setAdjusting(false);
    }
  };

  if (loading) return <div className="p-6">Loading inventory...</div>;

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
      {error && !selectedProduct && <div role="alert" className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error} <button type="button" onClick={fetchProducts} className="underline ml-2">Retry</button></div>}
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3">Product</th>
              <th className="p-3">S</th>
              <th className="p-3">M</th>
              <th className="p-3">L</th>
              <th className="p-3">XL</th>
              <th className="p-3">XXL</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.slug} className="border-b">
                <td className="p-3">{p.name}</td>
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <td key={size} className="p-3 font-mono">{p.stock?.[size] || 0}</td>
                ))}
                <td className="p-3">
                  <button onClick={() => setSelectedProduct(p)} className="text-blue-600 hover:underline">Adjust</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Adjust Stock: {selectedProduct.name}</h2>
            {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
            
            <form onSubmit={handleAdjust}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Size</label>
                <select className="w-full border p-2 rounded" value={adjustData.size} onChange={e => setAdjustData({...adjustData, size: e.target.value})}>
                  {['S', 'M', 'L', 'XL', 'XXL'].map(s => <option key={s} value={s}>{s} (Current: {selectedProduct.stock?.[s] || 0})</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Quantity Change (use negative to reduce)</label>
                <input type="number" required className="w-full border p-2 rounded" value={adjustData.quantityChange} onChange={e => setAdjustData({...adjustData, quantityChange: e.target.value})} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Reason</label>
                <input type="text" required className="w-full border p-2 rounded" placeholder="e.g. Restock, damaged, correction" value={adjustData.reason} onChange={e => setAdjustData({...adjustData, reason: e.target.value})} />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setSelectedProduct(null)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" disabled={adjusting} className="px-4 py-2 bg-black text-white rounded disabled:opacity-50">
                  {adjusting ? 'Saving...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
