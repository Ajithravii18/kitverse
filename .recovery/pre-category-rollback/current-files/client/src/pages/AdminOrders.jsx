import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api.js';

const STATUSES = [
  { value: 'pending_payment', label: 'Pending Payment', disabled: true },
  { value: 'paid', label: 'Paid', disabled: true },
  { value: 'payment_review', label: 'Payment Review' },
  { value: 'fulfilled', label: 'Fulfilled' },
  { value: 'cancelled', label: 'Cancelled' }
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadOrders() {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/orders');
      const data = await r.json();
      setOrders(data.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadOrders(); }, []);

  async function updateStatus(orderId, newStatus) {
    setError('');
    try {
      const data = await apiFetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      
      // Update local state smoothly
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading && !orders.length) return <div>Loading orders...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Order Management</h1>
      </div>
      
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', background: '#fafafa' }}>
              <th style={{ padding: '12px' }}>Order Ref</th>
              <th style={{ padding: '12px' }}>Customer</th>
              <th style={{ padding: '12px' }}>Items</th>
              <th style={{ padding: '12px' }}>Total (INR)</th>
              <th style={{ padding: '12px' }}>Date</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id} style={{ borderBottom: '1px solid #eaeaea' }}>
                <td style={{ padding: '12px' }}><strong>{o.orderRef}</strong><br/><small style={{color: '#888'}}>{o.paymentIntentId || 'No Payment ID'}</small></td>
                <td style={{ padding: '12px' }}>
                  {o.customer?.firstName ? `${o.customer.firstName} ${o.customer.lastName}` : o.customer?.name}<br/>
                  <small style={{ color: '#666' }}>{o.customer?.email}</small><br/>
                  <small style={{ color: '#888' }}>{o.customer?.city}, {o.customer?.postcode}</small>
                </td>
                <td style={{ padding: '12px' }}>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                    {o.lines?.map((line, i) => (
                      <li key={i}>{line.name} ({line.size}) x{line.qty}</li>
                    ))}
                  </ul>
                </td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>₹{o.total / 100}</td>
                <td style={{ padding: '12px', fontSize: '14px' }}>{new Date(o.createdAt).toLocaleString()}</td>
                <td style={{ padding: '12px' }}>
                  <select 
                    value={o.status} 
                    onChange={e => updateStatus(o._id, e.target.value)}
                    style={{ 
                      padding: '6px', 
                      borderRadius: '4px', 
                      border: '1px solid #ddd',
                      background: o.status === 'paid' ? '#e6ffe6' : 
                                 o.status === 'cancelled' ? '#ffeeee' : 
                                 o.status === 'fulfilled' ? '#e6f2ff' : '#fff3cd'
                    }}
                  >
                    {STATUSES.map(s => <option key={s.value} value={s.value} disabled={s.disabled && o.status !== s.value}>{s.label}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
