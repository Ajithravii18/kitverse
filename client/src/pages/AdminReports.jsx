import React, { useState, useEffect } from 'react';
import { money } from '../format.js';

export default function AdminReports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('revenue-desc');

  useEffect(() => {
    fetch('/api/admin/reports/sales')
      .then(r => r.json())
      .then(data => {
        setReport(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Loading reports...</div>;
  if (!report) return <div className="p-6 text-red-500">Failed to load reports (Super Admin required)</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Sales & Profitability Report</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 border rounded shadow-sm">
          <div className="text-gray-500 text-sm font-bold uppercase mb-1">Gross Revenue</div>
          <div className="text-3xl font-bold">{money(report.totals?.totalGross || 0)}</div>
        </div>
        <div className="bg-white p-6 border rounded shadow-sm">
          <div className="text-gray-500 text-sm font-bold uppercase mb-1">Total Discounts</div>
          <div className="text-3xl font-bold text-blue-600">-{money(report.totals?.totalDiscounts || 0)}</div>
        </div>
        <div className="bg-white p-6 border rounded shadow-sm">
          <div className="text-gray-500 text-sm font-bold uppercase mb-1">Total Refunds</div>
          <div className="text-3xl font-bold text-red-600">-{money(report.totals?.totalRefunds || 0)}</div>
        </div>
        <div className="bg-black text-white p-6 rounded shadow-sm">
          <div className="text-gray-300 text-sm font-bold uppercase mb-1">Net Profit (after Cost)</div>
          <div className="text-3xl font-bold text-green-400">{money(report.profit || 0)}</div>
          <div className="text-xs text-gray-400 mt-2">Cost of Goods: {money(report.totals?.totalCost || 0)}</div>
        </div>
      </div>

      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Product Performance</h2>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Search product slug..." 
            className="border p-2 rounded text-sm w-64"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select className="border p-2 rounded text-sm" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="revenue-desc">Revenue (High to Low)</option>
            <option value="revenue-asc">Revenue (Low to High)</option>
            <option value="qty-desc">Units Sold (High to Low)</option>
            <option value="qty-asc">Units Sold (Low to High)</option>
          </select>
        </div>
      </div>

      <div className="bg-white border rounded shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 border-b">Product</th>
              <th className="p-4 border-b">Units Sold</th>
              <th className="p-4 border-b">Gross Revenue</th>
              <th className="p-4 border-b">Est. Cost</th>
            </tr>
          </thead>
          <tbody>
            {report.sales
              ?.filter(s => (s._id?.slug || '').toLowerCase().includes(searchTerm.toLowerCase()))
              .sort((a, b) => {
                if (sortBy === 'revenue-desc') return b.grossLineRevenue - a.grossLineRevenue;
                if (sortBy === 'revenue-asc') return a.grossLineRevenue - b.grossLineRevenue;
                if (sortBy === 'qty-desc') return b.qty - a.qty;
                if (sortBy === 'qty-asc') return a.qty - b.qty;
                return 0;
              })
              .map((s, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-bold">{s._id.slug}</div>
                  <div className="text-xs text-gray-500 uppercase">{s._id.productType}</div>
                </td>
                <td className="p-4">{s.qty}</td>
                <td className="p-4">{money(s.grossLineRevenue)}</td>
                <td className="p-4">{money(s.cost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
