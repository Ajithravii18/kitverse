import React, { useState, useEffect } from 'react';
import { money } from '../format.js';

const date = d => new Date(d).toLocaleDateString();

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchCustomers = () => {
    setLoading(true);
    fetch(`/api/admin/customers?page=${page}&search=${search}&verified=${verifiedFilter}`)
      .then(r => r.json())
      .then(data => {
        setCustomers(data.customers || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, verifiedFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers();
  };

  const handleSelect = (c) => {
    fetch(`/api/admin/customers/${c._id}`)
      .then(r => r.json())
      .then(data => {
        setSelectedCustomer(data.customer);
        setOrders(data.orders || []);
        setNotes(data.customer.supportNotes || '');
      })
      .catch(err => setError(err.message));
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/customers/${selectedCustomer._id}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSelectedCustomer(data.customer);
      fetchCustomers(); // Refresh list just in case
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3 border-r pr-6 h-[calc(100vh-100px)] overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Customers</h1>
        
        <form onSubmit={handleSearch} className="mb-4">
          <input 
            type="text" 
            placeholder="Search email..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="border p-2 w-full rounded mb-2"
          />
          <div className="flex gap-2">
            <select 
              value={verifiedFilter} 
              onChange={e => setVerifiedFilter(e.target.value)}
              className="border p-2 rounded flex-1"
            >
              <option value="">All Verification Status</option>
              <option value="true">Verified Only</option>
              <option value="false">Unverified Only</option>
            </select>
            <button type="submit" className="bg-black text-white px-4 rounded">Search</button>
          </div>
        </form>

        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
        
        {loading ? <p>Loading...</p> : (
          <div>
            <p className="text-xs text-gray-500 mb-2">Total Customers: {total}</p>
            {customers.map(c => (
              <div 
                key={c._id} 
                onClick={() => handleSelect(c)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedCustomer?._id === c._id ? 'bg-gray-100 border-l-4 border-black' : ''}`}
              >
                <div className="font-bold truncate">{c.email}</div>
                <div className="text-sm text-gray-600 flex justify-between mt-1">
                  <span>Spend: {money(c.lifetimeSpend || 0)}</span>
                  <span>Orders: {c.orderCount || 0}</span>
                </div>
                <div className="mt-2 text-xs flex justify-between">
                  <span className={`px-2 py-1 rounded ${c.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                    {c.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                  <span className="text-gray-400">Since {date(c.createdAt)}</span>
                </div>
              </div>
            ))}
            
            {totalPages > 1 && (
              <div className="flex justify-between mt-4">
                <button disabled={page === 1} onClick={() => setPage(p => p-1)} className="border px-3 py-1 rounded text-sm disabled:opacity-50">Prev</button>
                <span className="text-sm py-1">Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p+1)} className="border px-3 py-1 rounded text-sm disabled:opacity-50">Next</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-full md:w-2/3 h-[calc(100vh-100px)] overflow-y-auto pr-4">
        {selectedCustomer ? (
          <div>
            <h2 className="text-3xl font-bold mb-2">Customer Details</h2>
            <p className="text-gray-600 mb-6">{selectedCustomer.email}</p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="border p-4 rounded bg-gray-50">
                <h3 className="font-bold border-b pb-2 mb-2">Account Overview</h3>
                <p>Status: <span className={selectedCustomer.isVerified ? 'text-green-600 font-bold' : 'text-gray-600'}>{selectedCustomer.isVerified ? 'Verified' : 'Unverified'}</span></p>
                <p>Joined: {date(selectedCustomer.createdAt)}</p>
                <p>Total Orders: {orders.length}</p>
                {/* Find most recent shipping address to display */}
                {orders.length > 0 && orders[0].customer && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Latest Shipping Address</p>
                    <p className="text-sm">{orders[0].customer.firstName} {orders[0].customer.lastName}</p>
                    <p className="text-sm">{orders[0].customer.streetAddress}, {orders[0].customer.city}, {orders[0].customer.state}</p>
                    <p className="text-sm">{orders[0].customer.phone}</p>
                  </div>
                )}
              </div>
              
              <div className="border p-4 rounded bg-yellow-50 border-yellow-200">
                <h3 className="font-bold border-b border-yellow-200 pb-2 mb-2 text-yellow-800">Support Notes (Private)</h3>
                <textarea 
                  className="w-full h-32 p-2 border border-yellow-300 rounded bg-white resize-none text-sm"
                  placeholder="Add private notes about this customer..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
                <button 
                  onClick={handleSaveNotes} 
                  disabled={savingNotes}
                  className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700 disabled:opacity-50"
                >
                  {savingNotes ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>

            <div className="border rounded">
              <h3 className="font-bold p-4 border-b bg-gray-50">Order History ({orders.length})</h3>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-3">Reference</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="p-3 font-mono">{o.orderRef}</td>
                      <td className="p-3">{date(o.createdAt)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs mr-2 ${o.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>{o.paymentStatus}</span>
                        <span className={`px-2 py-1 rounded text-xs ${o.fulfilmentStatus === 'shipped' || o.fulfilmentStatus === 'delivered' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>{o.fulfilmentStatus}</span>
                      </td>
                      <td className="p-3">{money(o.total)}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan="4" className="p-4 text-center text-gray-500">No orders found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            Select a customer to view details
          </div>
        )}
      </div>
    </div>
  );
}
