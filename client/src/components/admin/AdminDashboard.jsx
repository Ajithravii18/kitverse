import React, { useEffect, useState } from 'react';
import { money } from '../../format.js';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(resData => {
        if (resData.error) throw new Error(resData.error);
        setData(resData);
      })
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div style={{ color: 'red', padding: '20px' }}>Error loading dashboard: {error}</div>;
  if (!data) return <div style={{ padding: '20px' }}>Loading metrics...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 uppercase tracking-wider">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 border border-gray-200 rounded shadow-sm">
          <div className="text-gray-500 text-sm uppercase tracking-wide mb-2">Paid Sales (Today)</div>
          <div className="text-3xl font-bold">{money(data.salesToday)}</div>
        </div>
        <div className="bg-white p-6 border border-gray-200 rounded shadow-sm">
          <div className="text-gray-500 text-sm uppercase tracking-wide mb-2">Pending Orders</div>
          <div className="text-3xl font-bold">{data.pendingOrders}</div>
          <Link to="/admin/orders?status=paid" className="text-blue-600 text-sm mt-2 inline-block">View Orders &rarr;</Link>
        </div>
        <div className="bg-white p-6 border border-gray-200 rounded shadow-sm">
          <div className="text-gray-500 text-sm uppercase tracking-wide mb-2">Low Stock Items</div>
          <div className="text-3xl font-bold text-orange-600">{data.lowStockCount}</div>
          <Link to="/admin/products" className="text-blue-600 text-sm mt-2 inline-block">Manage Inventory &rarr;</Link>
        </div>
        <div className="bg-white p-6 border border-gray-200 rounded shadow-sm">
          <div className="text-gray-500 text-sm uppercase tracking-wide mb-2">Payments to Review</div>
          <div className="text-3xl font-bold text-red-600">{data.paymentsToReview}</div>
          <Link to="/admin/orders?status=payment_review" className="text-blue-600 text-sm mt-2 inline-block">Review Payments &rarr;</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded shadow-sm">
          <div className="p-4 border-b border-gray-200 font-bold uppercase tracking-wide">Low Stock Alert</div>
          <ul className="divide-y divide-gray-200">
            {data.lowStockItems.length === 0 ? <li className="p-4 text-gray-500">No low stock items.</li> : null}
            {data.lowStockItems.map(item => (
              <li key={item.slug} className="p-4 flex justify-between items-center">
                <span className="font-medium">{item.name}</span>
                <Link to={`/admin/products?search=${item.slug}`} className="text-sm border border-gray-300 px-3 py-1 rounded hover:bg-gray-50">Restock</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
