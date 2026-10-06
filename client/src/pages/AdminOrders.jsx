import React, { useState, useEffect } from 'react';
import { money } from '../format.js';

const date = d => new Date(d).toLocaleDateString();
const datetime = d => new Date(d).toLocaleString();
const generateIdempotency = () => 'ref-' + Date.now() + Math.random().toString(36).slice(2);

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [busy, setBusy] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Forms
  const [shipData, setShipData] = useState({ courier: '', trackingNumber: '', trackingUrl: '' });
  const [refundData, setRefundData] = useState({ amount: '', reason: '' });
  const [refundKey, setRefundKey] = useState(generateIdempotency());
  
  const [returnData, setReturnData] = useState({ slug: '', size: '', qty: 1, reason: '', exchangeForSize: '' });

  const fetchOrders = () => {
    setLoading(true);
    return fetch('/api/admin/orders')
      .then(r => {
        if (!r.ok) throw new Error('Data refresh failed');
        return r.json();
      })
      .then(data => {
        if (!Array.isArray(data.orders)) throw new Error('Invalid orders response');
        setOrders(data.orders);
        setSelectedOrder(current => {
          if (!current) return null;
          return data.orders.find(o => o._id === current._id) || null;
        });
        setLoading(false);
        setError(null);
      })
      .catch(err => {
        setError('Lost connection to server. Controls locked to prevent stale actions.');
        setOrders([]);
        setSelectedOrder(null);
        setLoading(false);
        throw err;
      });
  };



  useEffect(() => { fetchOrders().catch(() => {}); }, []);

  // Reset forms when switching orders
  const getSavedKey = (orderId) => {
    if (!orderId) return generateIdempotency();
    let key = sessionStorage.getItem(`refundKey_${orderId}`);
    if (!key) {
      key = generateIdempotency();
      sessionStorage.setItem(`refundKey_${orderId}`, key);
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

  const handleAction = async (endpoint, payload, onSuccess) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder._id}/${endpoint}`, {
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



  const handleShip = (e) => {
    e.preventDefault();
    handleAction('ship', shipData, () => setShipData({ courier: '', trackingNumber: '', trackingUrl: '' }));
  };

  const handleDeliver = () => {
    if (confirm('Mark this order as delivered?')) {
      handleAction('deliver', {});
    }
  };

  const handleRefund = (e) => {
    e.preventDefault();
    const amountInPaise = Math.round(parseFloat(refundData.amount) * 100);
    if (confirm(`Are you sure you want to refund ${money(amountInPaise)}?`)) {
      handleAction('refund', {
        amount: amountInPaise,
        reason: refundData.reason,
        idempotencyKey: refundKey
      }, () => {
        setRefundData({ amount: '', reason: '' });
        const newKey = generateIdempotency();
        setRefundKey(newKey);
        sessionStorage.setItem(`refundKey_${selectedOrder._id}`, newKey);
      });
    }
  };


  const handleRetryRefund = (r) => {
    if (confirm(`Retry refund of ${money(r.amount)}?`)) {
      handleAction('refund', {
        amount: r.amount,
        reason: r.reason,
        idempotencyKey: r.idempotencyKey
      });
    }
  };

  const handleReconcile = () => {
    handleAction('reconcile', {});
  };

  const handleRequestReturn = (e) => {
    e.preventDefault();
    const payload = {
      slug: returnData.slug,
      size: returnData.size,
      qty: parseInt(returnData.qty, 10),
      reason: returnData.reason,
    };
    if (returnData.exchangeForSize) payload.exchangeForSize = returnData.exchangeForSize;
    handleAction('return', payload, () => {
      setReturnData({ slug: '', size: '', qty: 1, reason: '', exchangeForSize: '' });
    });
  };

  const processReturn = async (returnId, status, adminNotes = '') => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder._id}/return/${returnId}`, {
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



  if (loading && !orders.length) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3 border-r pr-6 h-[calc(100vh-100px)] overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded flex flex-col gap-2">{error} <button onClick={fetchOrders} className="bg-red-600 text-white px-2 py-1 rounded text-sm self-start">Retry Data Sync</button></div>}
        
        
        <div className="flex gap-2 mb-4">
          <input 
            type="text" 
            placeholder="Search by ID or email..." 
            className="border p-2 rounded flex-1 text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select 
            className="border p-2 rounded text-sm"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
{orders
          .filter(o => {
            const matchesSearch = (o.orderRef || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  ((o.customer && o.customer.email) || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || o.fulfilmentStatus === statusFilter || o.paymentStatus === statusFilter;
            return matchesSearch && matchesStatus;
          })
          .map(o => (
          <div 
            key={o._id} 
            onClick={() => { if (!busy) setSelectedOrder(o); }}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedOrder?._id === o._id ? 'bg-gray-100 border-l-4 border-black' : ''}`}
          >
            <div className="font-bold">{o.orderRef}</div>
            <div className="text-sm text-gray-600">{date(o.createdAt)} - {money(o.total)}</div>
            <div className="mt-2 flex gap-2 text-xs">
              <span className={`px-2 py-1 rounded ${o.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {o.paymentStatus || 'Unknown'}
              </span>
              <span className={`px-2 py-1 rounded ${o.fulfilmentStatus === 'shipped' ? 'bg-blue-100 text-blue-800' : o.fulfilmentStatus === 'delivered' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100'}`}>
                {o.fulfilmentStatus || 'Unknown'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full md:w-2/3 h-[calc(100vh-100px)] overflow-y-auto pr-4">
        {selectedOrder ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Order {selectedOrder.orderRef}</h2>
              <button onClick={handleReconcile} disabled={busy} className="border px-4 py-2 rounded text-sm hover:bg-gray-50">
                Reconcile Sync
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="border p-4 rounded">
                <h3 className="font-bold border-b pb-2 mb-2">Customer Details</h3>
                <p>{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                <p>{selectedOrder.customer.email}</p>
                <p>{selectedOrder.customer.phone}</p>
                <p className="mt-2 text-sm text-gray-600">{selectedOrder.customer.streetAddress}, {selectedOrder.customer.city}</p>
              </div>
              <div className="border p-4 rounded">
                <h3 className="font-bold border-b pb-2 mb-2">Financials</h3>
                <p>Total: {money(selectedOrder.total)}</p>
                <p>Status: <span className="font-bold capitalize">{(typeof selectedOrder.paymentStatus === 'string' ? selectedOrder.paymentStatus : 'unknown').replaceAll('_', ' ')}</span></p>
                <p className="text-xs text-gray-500 mt-2">Provider ID: {selectedOrder.paymentId || 'N/A'}</p>
              </div>
            </div>

            {/* Items */}
            <div className="border rounded mb-8">
              <h3 className="font-bold p-4 border-b bg-gray-50">Items</h3>
              <table className="w-full text-left">
                <tbody>
                  {selectedOrder.lines.map((l, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="p-4">{l.name}</td>
                      <td className="p-4">Size: {l.size}</td>
                      <td className="p-4">Qty: {l.qty}</td>
                      <td className="p-4">{money(l.price * l.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Shipping Section */}
            {selectedOrder.paymentStatus === 'paid' && selectedOrder.fulfilmentStatus !== 'shipped' && selectedOrder.fulfilmentStatus !== 'delivered' && (
              <form onSubmit={handleShip} className="border rounded p-4 mb-8 bg-blue-50">
                <h3 className="font-bold mb-4">Ship Order</h3>
                <div className="flex gap-4 mb-4">
                  <input type="text" placeholder="Courier Name (e.g., FedEx)" required value={shipData.courier} onChange={e => setShipData({...shipData, courier: e.target.value})} className="border p-2 rounded flex-1" />
                  <input type="text" placeholder="Tracking Number" required value={shipData.trackingNumber} onChange={e => setShipData({...shipData, trackingNumber: e.target.value})} className="border p-2 rounded flex-1" />
                </div>
                <input type="url" placeholder="Tracking URL (optional)" value={shipData.trackingUrl} onChange={e => setShipData({...shipData, trackingUrl: e.target.value})} className="border p-2 rounded w-full mb-4" />
                <button disabled={busy} type="submit" className="bg-black text-white px-6 py-2 rounded">Mark as Shipped</button>
              </form>
            )}
            
            {selectedOrder.shipping && selectedOrder.shipping.trackingNumber && (
              <div className="border rounded p-4 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-green-700">Shipping Details</h3>
                  {selectedOrder.fulfilmentStatus === 'shipped' && (
                    <button disabled={busy} onClick={handleDeliver} className="bg-purple-600 text-white px-3 py-1 text-sm rounded">Mark Delivered</button>
                  )}
                </div>
                <p>Courier: {selectedOrder.shipping.courier}</p>
                <p>Tracking: <a href={selectedOrder.shipping.trackingUrl} target="_blank" className="text-blue-600 underline">{selectedOrder.shipping.trackingNumber}</a></p>
                <p className="text-xs text-gray-500 mt-1">Dispatched: {datetime(selectedOrder.shipping.dispatchedAt)}</p>
                {selectedOrder.shipping.deliveredAt && <p className="text-xs font-bold text-purple-600 mt-1">Delivered: {datetime(selectedOrder.shipping.deliveredAt)}</p>}
              </div>
            )}

            {/* Refunds Section */}
            <div className="border rounded p-4 mb-8 border-red-200">
              <h3 className="font-bold mb-4 text-red-700">Refunds</h3>
              
              {selectedOrder.refunds && selectedOrder.refunds.length > 0 && (
                <div className="mb-4">
                  {selectedOrder.refunds.map((r, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded mb-2 text-sm border">
                      <div>
                        <span className="font-bold">{money(r.amount)}</span> - {r.reason}
                        <div className="text-xs text-gray-500">Ref: {r.providerRefundId || 'Pending...'}</div>
                      </div>
                      <div className="flex gap-2 items-center">
                        {r.status === 'failed' && (
                          <button disabled={busy} onClick={() => handleRetryRefund(r)} className="px-2 py-1 bg-red-600 text-white rounded text-xs">Retry</button>
                        )}
                        <span className={`px-2 py-1 rounded capitalize ${r.status === 'processed' ? 'bg-green-100' : r.status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                          {r.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {['paid', 'review_required', 'partially_refunded'].includes(selectedOrder.paymentStatus) && (
                <>
                  {selectedOrder.refunds?.some(r => r.status === 'pending') ? (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded">
                      A refund is currently pending. Please click "Reconcile Sync" above to verify its status before issuing new refunds.
                    </div>
                  ) : (
                    <form onSubmit={handleRefund} className="flex gap-4 items-end mt-4 pt-4 border-t border-red-100">
                      <div className="flex-1">
                        <label className="block text-xs mb-1">Amount (₹)</label>
                        <input type="number" step="0.01" max={selectedOrder.total / 100} required placeholder="0.00" value={refundData.amount} onChange={e => setRefundData({...refundData, amount: e.target.value})} className="border p-2 rounded w-full" />
                      </div>
                      <div className="flex-2 w-1/2">
                        <label className="block text-xs mb-1">Reason</label>
                        <input type="text" required placeholder="Reason for refund" value={refundData.reason} onChange={e => setRefundData({...refundData, reason: e.target.value})} className="border p-2 rounded w-full" />
                      </div>
                      <button disabled={busy} type="submit" className="bg-red-600 text-white px-6 py-2 rounded h-[42px]">Issue Refund</button>
                    </form>
                  )}
                </>
              )}
            </div>

            {/* Returns Section */}
            {(selectedOrder.fulfilmentStatus === 'shipped' || selectedOrder.fulfilmentStatus === 'delivered' || selectedOrder.fulfilmentStatus === 'legacy_fulfilled') && (
              <div className="border rounded p-4 mb-8">
                <h3 className="font-bold mb-4 text-purple-700">Returns / Exchanges</h3>
                
                {selectedOrder.returns && selectedOrder.returns.map(ret => (
                  <div key={ret._id} className="border p-4 rounded mb-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold">{ret.slug} (Size: {ret.size}) x {ret.qty}</p>
                        <p className="text-sm">Reason: {ret.reason}</p>
                        {ret.exchangeForSize && <p className="text-sm font-bold text-purple-600">Exchange for: {ret.exchangeForSize}</p>}
                      </div>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs uppercase">{ret.status}</span>
                    </div>
                    
                    {ret.status === 'requested' && (
                      <div className="flex gap-2 mt-4 pt-4 border-t">
                        <button disabled={busy} onClick={() => processReturn(ret._id, 'approved')} className="px-3 py-1 bg-black text-white text-sm rounded">Approve</button>
                        <button disabled={busy} onClick={() => processReturn(ret._id, 'rejected')} className="px-3 py-1 border text-sm rounded">Reject</button>
                      </div>
                    )}
                    {ret.status === 'approved' && (
                      <div className="flex gap-2 mt-4 pt-4 border-t">
                        <button disabled={busy} onClick={() => processReturn(ret._id, 'inspected')} className="px-3 py-1 bg-blue-600 text-white text-sm rounded">Mark Inspected</button>
                      </div>
                    )}
                    {ret.status === 'inspected' && (
                      <div className="flex gap-2 mt-4 pt-4 border-t">
                        <button disabled={busy} onClick={() => processReturn(ret._id, 'restocked')} className="px-3 py-1 bg-green-600 text-white text-sm rounded">Restock Item</button>
                        <button disabled={busy} onClick={() => processReturn(ret._id, 'rejected')} className="px-3 py-1 border text-red-600 text-sm rounded">Reject</button>
                      </div>
                    )}
                  </div>
                ))}

                <form onSubmit={handleRequestReturn} className="mt-4 pt-4 border-t border-purple-100">
                  <h4 className="font-bold text-sm mb-3">Log a Return Request</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs mb-1">Item to Return</label>
                      <select required className="border p-2 rounded w-full" value={returnData.slug + '|' + returnData.size} onChange={e => {
                        const [slug, size] = e.target.value.split('|');
                        setReturnData({...returnData, slug, size});
                      }}>
                        <option value="|">-- Select Item --</option>
                        {selectedOrder.lines.map((l, i) => (
                          <option key={i} value={`${l.slug}|${l.size}`}>{l.name} - Size {l.size} (Max: {l.qty})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Quantity</label>
                      <input type="number" min="1" required className="border p-2 rounded w-full" value={returnData.qty} onChange={e => setReturnData({...returnData, qty: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs mb-1">Reason</label>
                      <input type="text" required placeholder="Damaged, wrong size, etc." className="border p-2 rounded w-full" value={returnData.reason} onChange={e => setReturnData({...returnData, reason: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Exchange For Size (Optional)</label>
                      <select className="border p-2 rounded w-full" value={returnData.exchangeForSize} onChange={e => setReturnData({...returnData, exchangeForSize: e.target.value})}>
                        <option value="">-- No Exchange --</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                      </select>
                    </div>
                  </div>
                  <button disabled={busy} type="submit" className="bg-purple-600 text-white px-4 py-2 rounded text-sm">Submit Request</button>
                </form>
              </div>
            )}

            {/* Activity History */}
            <div className="border rounded">
              <h3 className="font-bold p-4 border-b bg-gray-50">System Activity</h3>
              <div className="p-4 text-sm font-mono text-gray-600">
                {selectedOrder.activityHistory?.map((h, i) => (
                  <div key={i} className="mb-1">
                    [{datetime(h.timestamp)}] {h.action.toUpperCase()} {h.adminUser ? '(by Admin)' : ''}
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            Select an order to view Stage 2 details
          </div>
        )}
      </div>
    </div>
  );
}
