import React, { useState, useEffect } from 'react';
import { money } from '../format.js';

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const [code, setCode] = useState('');
  const [type, setType] = useState('fixed');
  const [value, setValue] = useState('');
  const [usageLimit, setUsageLimit] = useState('');

  const fetchDiscounts = () => {
    setLoading(true);
    fetch('/api/admin/discounts')
      .then(r => r.json())
      .then(data => {
        setDiscounts(data.discounts || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.toUpperCase(),
          type,
          value: type === 'fixed' ? Number(value) * 100 : Number(value),
          usageLimit: usageLimit ? Number(usageLimit) : undefined,
          active: true
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCode('');
      setValue('');
      setUsageLimit('');
      fetchDiscounts();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Discounts</h1>
      
      <form onSubmit={handleCreate} className="mb-8 p-4 border rounded max-w-lg bg-gray-50">
        <h2 className="font-bold mb-4">Create Discount</h2>
        <div className="flex gap-4 mb-4">
          <input required type="text" placeholder="CODE (e.g. EXTRA10)" className="border p-2 uppercase flex-1" value={code} onChange={e => setCode(e.target.value)} />
          <select className="border p-2" value={type} onChange={e => setType(e.target.value)}>
            <option value="fixed">Fixed (₹)</option>
            <option value="percentage">Percentage (%)</option>
          </select>
          <input required type="number" placeholder="Value" className="border p-2 w-24" value={value} onChange={e => setValue(e.target.value)} />
        </div>
        <div className="mb-4">
          <input type="number" placeholder="Usage Limit (Optional)" className="border p-2 w-full" value={usageLimit} onChange={e => setUsageLimit(e.target.value)} />
        </div>
        <button type="submit" className="bg-black text-white px-4 py-2">Create Discount</button>
      </form>

      
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search by code..." 
          className="border p-2 w-full max-w-lg rounded"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
{loading ? <p>Loading...</p> : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Code</th>
              <th className="p-2">Type</th>
              <th className="p-2">Value</th>
              <th className="p-2">Usage</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {discounts
              .filter(d => (d.code || '').toLowerCase().includes(searchTerm.toLowerCase()))
              .map(d => (
              <tr key={d._id} className="border-b">
                <td className="p-2 font-bold">{d.code}</td>
                <td className="p-2 capitalize">{d.type}</td>
                <td className="p-2">{d.type === 'fixed' ? money(d.value) : `${d.value}%`}</td>
                <td className="p-2">{d.usedCount} {d.usageLimit ? `/ ${d.usageLimit}` : ''}</td>
                <td className="p-2">{d.active ? 'Active' : 'Disabled'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
