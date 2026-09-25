import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { money } from '../format.js';
import { apiFetch } from '../api.js';

export default function Profile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'track', or 'account'
  
  // Filters
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTime, setFilterTime] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(order => {
    if (filterStatus !== 'all' && order.status !== filterStatus) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchRef = order.orderRef.toLowerCase().includes(q);
      const matchItem = order.lines.some(item => item.name.toLowerCase().includes(q));
      if (!matchRef && !matchItem) return false;
    }

    if (filterTime !== 'all') {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      if (filterTime === '30days') {
        if ((now - orderDate) > 30 * 24 * 60 * 60 * 1000) return false;
      } else if (filterTime === '6months') {
        if ((now - orderDate) > 180 * 24 * 60 * 60 * 1000) return false;
      } else if (filterTime === '2023') {
        if (orderDate.getFullYear() !== 2023) return false;
      } else if (filterTime === '2024') {
        if (orderDate.getFullYear() !== 2024) return false;
      }
    }
    
    return true;
  });

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [filterStatus, filterTime, searchQuery]);

  // Detailed view
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Tracking state
  const [trackingData, setTrackingData] = useState(null);
  const [trackingError, setTrackingError] = useState('');
  const [trackingRef, setTrackingRef] = useState('');

  // Account state
  const [user, setUser] = useState({ username: '', email: '' });
  const [accountFormData, setAccountFormData] = useState({
    username: '', email: '', currentPassword: '', newPassword: '', confirmPassword: ''
  });
  const [accountMessage, setAccountMessage] = useState('');
  const [accountError, setAccountError] = useState('');
  const [updatingAccount, setUpdatingAccount] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch('/api/customer/me').then(r => {
        if (!r.ok) throw new Error('Not authenticated');
        return r.json();
      }),
      fetch('/api/customer/orders').then(r => {
        if (!r.ok) throw new Error('Failed to load order history.');
        return r.json();
      })
    ])
    .then(([userData, orderData]) => {
      setUser({ username: userData.username || '', email: userData.email || '' });
      setAccountFormData(prev => ({
        ...prev,
        username: userData.username || '',
        email: userData.email || ''
      }));
      setOrders(orderData.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setLoading(false);
    })
    .catch(err => {
      if (err.message === 'Not authenticated') {
        navigate('/auth');
      } else {
        setError(err.message);
        setLoading(false);
      }
    });
  }, [navigate]);

  async function handleLogout() {
    await apiFetch('/api/customer/logout', { method: 'POST' });
    navigate('/');
  }

  async function fetchTracking(e) {
    e.preventDefault();
    setTrackingError('');
    setTrackingData(null);
    try {
      const r = await fetch('/api/tracking/' + trackingRef);
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Tracking lookup failed.');
      setTrackingData(data);
    } catch (err) {
      setTrackingError(err.message);
    }
  }

  async function handleUpdateAccount(e) {
    e.preventDefault();
    setAccountMessage('');
    setAccountError('');
    if (accountFormData.newPassword && accountFormData.newPassword !== accountFormData.confirmPassword) {
      return setAccountError("New passwords do not match.");
    }
    setUpdatingAccount(true);
    try {
      const data = await apiFetch('/api/customer/profile', {
        method: 'PUT',
        body: JSON.stringify({
          username: accountFormData.username,
          email: accountFormData.email,
          currentPassword: accountFormData.currentPassword || undefined,
          newPassword: accountFormData.newPassword || undefined
        })
      });
      setAccountMessage('Account settings updated successfully.');
      setUser({ username: data.username, email: data.email });
      setAccountFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      setAccountError(err.message);
    } finally {
      setUpdatingAccount(false);
    }
  }

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>Loading profile...</div>;
  }

  return (
    <div className="profile-wrapper">
      <style>{`
        .profile-wrapper {
          font-family: 'Inter', sans-serif;
          background: #f5f5f5;
          color: #000;
          min-height: 100vh;
        }
        .profile-header {
          background: #fff;
          padding: 20px 40px;
          border-bottom: 1px solid #eaeaea;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .profile-container {
          display: flex;
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
          gap: 40px;
          align-items: flex-start;
        }
        .profile-sidebar {
          width: 250px;
          flex-shrink: 0;
          background: #fff;
          padding: 20px;
          border: 1px solid #eaeaea;
        }
        .profile-main {
          flex: 1;
          background: #fff;
          border: 1px solid #eaeaea;
          padding: 40px;
          min-height: 500px;
        }
        .order-list-row {
          border: 1px solid #eaeaea;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: box-shadow 0.2s;
          cursor: pointer;
        }
        .order-list-row:hover {
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .order-list-details {
          display: flex;
          gap: 40px;
          flex: 1;
        }
        .order-list-stat {
          display: flex;
          flex-direction: column;
        }
        .detailed-header-stats {
          display: flex;
          gap: 40px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }
        .order-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #fafafa;
          margin-bottom: 10px;
          border: 1px solid #eaeaea;
        }
        .track-form {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          max-width: 500px;
        }
        .track-input {
          flex: 1;
          padding: 12px 15px;
          border: 1px solid #ccc;
          border-radius: 0;
          font-size: 14px;
          box-sizing: border-box;
        }
        .track-btn {
          background: #000;
          color: #c1ff38;
          border: none;
          padding: 12px 25px;
          font-weight: bold;
          cursor: pointer;
          text-transform: uppercase;
          box-sizing: border-box;
        }
        
        @media (max-width: 768px) {
          .profile-header {
            padding: 15px 20px;
          }
          .profile-container {
            flex-direction: column;
            gap: 20px;
            margin: 20px auto;
          }
          .profile-sidebar {
            width: 100%;
            box-sizing: border-box;
          }
          .profile-main {
            padding: 20px;
            box-sizing: border-box;
            width: 100%;
          }
          .order-list-row {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
            padding: 15px;
          }
          .order-list-details {
            flex-direction: column;
            gap: 10px;
            width: 100%;
          }
          .order-list-stat {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #f0f0f0;
            padding-bottom: 8px;
          }
          .order-list-stat:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
          .order-list-stat > div:first-child {
            margin-bottom: 0 !important;
          }
          .order-list-row button {
            width: 100%;
            padding: 12px;
          }
          .detailed-header-stats {
            flex-direction: column;
            gap: 10px;
          }
          .detailed-header-stats > div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #f0f0f0;
            padding-bottom: 8px;
            width: 100%;
          }
          .detailed-header-stats > div:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
          .detailed-header-stats > div > div:first-child {
            margin-bottom: 0 !important;
          }
          .order-item-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .order-item-row > div:last-child {
            align-self: flex-end;
          }
          .track-form {
            flex-direction: column;
          }
          .track-btn {
            width: 100%;
          }
          .detailed-header-top {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 10px;
          }
        }
      `}</style>
      <header className="profile-header">
        <Link to="/" style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.05em', textDecoration: 'none', color: '#000', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          KITVERSE
        </Link>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }}>Log Out</button>
      </header>

      <div className="profile-container">
        {/* Sidebar Dashboard Navigation */}
        <aside className="profile-sidebar">
          <h2 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', marginBottom: '20px', fontWeight: 'bold', letterSpacing: '0.05em' }}>Dashboard Menu</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <button 
              onClick={() => { setActiveTab('orders'); setSelectedOrder(null); setPage(1); }}
              style={{ 
                background: activeTab === 'orders' ? '#000' : 'transparent',
                color: activeTab === 'orders' ? '#c1ff38' : '#333',
                border: 'none', padding: '12px 15px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer',
                textAlign: 'left', transition: 'all 0.2s',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
              My Orders {activeTab === 'orders' && <span>→</span>}
            </button>
            <button 
              onClick={() => { setActiveTab('track'); setSelectedOrder(null); }}
              style={{ 
                background: activeTab === 'track' ? '#000' : 'transparent',
                color: activeTab === 'track' ? '#c1ff38' : '#333',
                border: 'none', padding: '12px 15px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer',
                textAlign: 'left', transition: 'all 0.2s',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
              Track Order {activeTab === 'track' && <span>→</span>}
            </button>
            <button 
              onClick={() => { setActiveTab('account'); setSelectedOrder(null); }}
              style={{ 
                background: activeTab === 'account' ? '#000' : 'transparent',
                color: activeTab === 'account' ? '#c1ff38' : '#333',
                border: 'none', padding: '12px 15px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer',
                textAlign: 'left', transition: 'all 0.2s',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
              Account Settings {activeTab === 'account' && <span>→</span>}
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="profile-main">
          
          {activeTab === 'orders' ? (
            <div>
              {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

              {orders.length === 0 ? (
                <div style={{ padding: '60px 40px', background: '#fafafa', border: '1px solid #eaeaea', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '16px' }}>You haven't placed any orders yet.</p>
                  <Link to="/" style={{ display: 'inline-block', background: '#000', color: '#c1ff38', padding: '12px 24px', textDecoration: 'none', fontWeight: 'bold', textTransform: 'uppercase' }}>Start Shopping</Link>
                </div>
              ) : selectedOrder ? (
                /* Detailed Order View */
                <div>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    style={{ background: 'none', border: 'none', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', marginBottom: '20px', padding: 0, color: '#666' }}
                  >
                    ← Back to Orders
                  </button>
                  <div className="detailed-header-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eaeaea', flexWrap: 'wrap', gap: '15px' }}>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '900' }}>Order #{selectedOrder.orderRef}</h2>
                    <div style={{ 
                      display: 'inline-block', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase',
                      background: selectedOrder.status === 'paid' ? '#c1ff38' : selectedOrder.status === 'fulfilled' ? '#000' : '#ddd',
                      color: selectedOrder.status === 'fulfilled' ? '#fff' : '#000'
                    }}>
                      {selectedOrder.status.replace('_', ' ')}
                    </div>
                  </div>

                  <div className="detailed-header-stats">
                    <div>
                      <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Date Placed</div>
                      <div style={{ fontSize: '15px' }}>{new Date(selectedOrder.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Subtotal</div>
                      <div style={{ fontSize: '15px' }}>{money(selectedOrder.total)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Shipping Cost</div>
                      <div style={{ fontSize: '15px' }}>Free</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Total Amount</div>
                      <div style={{ fontSize: '15px', fontWeight: 'bold' }}>{money(selectedOrder.total)}</div>
                    </div>
                  </div>

                  {selectedOrder.customer && (
                    <div style={{ marginBottom: '30px', padding: '20px', background: '#fafafa', border: '1px solid #eaeaea' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px' }}>Shipping Address</div>
                      <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                        <div>{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</div>
                        <div>{selectedOrder.customer.streetAddress}{selectedOrder.customer.apartment ? `, ${selectedOrder.customer.apartment}` : ''}</div>
                        <div>{selectedOrder.customer.city}, {selectedOrder.customer.state} {selectedOrder.customer.postcode}</div>
                        <div>{selectedOrder.customer.country}</div>
                        <div style={{ marginTop: '8px', color: '#555' }}>Phone: {selectedOrder.customer.phone}</div>
                        {selectedOrder.customer.email && <div style={{ color: '#555' }}>Email: {selectedOrder.customer.email}</div>}
                        {selectedOrder.customer.notes && <div style={{ color: '#555', marginTop: '5px', fontStyle: 'italic' }}>Notes: {selectedOrder.customer.notes}</div>}
                      </div>
                    </div>
                  )}

                  {selectedOrder.trackingDetails && (
                    <div style={{ marginBottom: '30px', padding: '20px', background: '#fafafa', borderLeft: '4px solid #c1ff38' }}>
                      <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>Tracking Information</div>
                      <div style={{ fontSize: '15px' }}>{selectedOrder.trackingDetails}</div>
                    </div>
                  )}

                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #eaeaea', paddingBottom: '10px', marginBottom: '20px' }}>Items in Order</h3>
                    {selectedOrder.lines.map((item, idx) => (
                      <div key={idx} className="order-item-row">
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{item.name}</div>
                          <div style={{ fontSize: '13px', color: '#666' }}>Size: {item.size} &nbsp;&bull;&nbsp; Qty: {item.qty}</div>
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{money(item.price * item.qty)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Orders List View */
                <div>
                  <h1 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '900', textTransform: 'uppercase' }}>Order History</h1>
                  
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                    <input 
                      type="text" 
                      placeholder="Search Order Ref or Product..." 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{ padding: '10px 15px', border: '1px solid #eaeaea', flex: 1, minWidth: '200px', fontSize: '14px' }}
                    />
                    
                    <select 
                      value={filterStatus}
                      onChange={e => setFilterStatus(e.target.value)}
                      style={{ padding: '10px 15px', border: '1px solid #eaeaea', fontSize: '14px', background: '#fff' }}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending_payment">Pending Payment</option>
                      <option value="paid">Paid / Processing</option>
                      <option value="fulfilled">Fulfilled / Delivered</option>
                    </select>

                    <select 
                      value={filterTime}
                      onChange={e => setFilterTime(e.target.value)}
                      style={{ padding: '10px 15px', border: '1px solid #eaeaea', fontSize: '14px', background: '#fff' }}
                    >
                      <option value="all">All Time</option>
                      <option value="30days">Last 30 Days</option>
                      <option value="6months">Last 6 Months</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                    </select>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {filteredOrders.length === 0 ? (
                      <div style={{ padding: '40px', textAlign: 'center', color: '#888', fontStyle: 'italic', border: '1px dashed #ccc' }}>
                        No orders match your current filters.
                      </div>
                    ) : paginatedOrders.map(order => (
                      <div key={order._id} className="order-list-row" onClick={() => setSelectedOrder(order)}>
                        <div className="order-list-details">
                          <div className="order-list-stat">
                            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Order Ref</div>
                            <div style={{ fontWeight: '900', fontSize: '15px' }}>{order.orderRef}</div>
                          </div>
                          <div className="order-list-stat">
                            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Date</div>
                            <div style={{ fontSize: '14px' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div className="order-list-stat">
                            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Total</div>
                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{money(order.total)}</div>
                          </div>
                          <div className="order-list-stat">
                            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Status</div>
                            <div style={{ 
                              display: 'inline-block', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase',
                              background: order.status === 'paid' ? '#c1ff38' : order.status === 'fulfilled' ? '#000' : '#ddd',
                              color: order.status === 'fulfilled' ? '#fff' : '#000'
                            }}>
                              {order.status.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          style={{ background: '#f5f5f5', border: '1px solid #eaeaea', padding: '8px 15px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eaeaea' }}>
                      <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{ padding: '8px 16px', background: page === 1 ? '#eee' : '#000', color: page === 1 ? '#aaa' : '#fff', border: 'none', fontWeight: 'bold', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                      >
                        Prev
                      </button>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#666' }}>Page {page} of {totalPages}</span>
                      <button 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        style={{ padding: '8px 16px', background: page === totalPages ? '#eee' : '#000', color: page === totalPages ? '#aaa' : '#fff', border: 'none', fontWeight: 'bold', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : activeTab === 'track' ? (
            <div>
              <h1 style={{ margin: '0 0 30px 0', fontSize: '24px', fontWeight: '900', textTransform: 'uppercase' }}>Track Your Order</h1>
              <p style={{ color: '#666', marginBottom: '20px' }}>Enter your order reference number below to see the latest shipping updates.</p>
              
              <form onSubmit={fetchTracking} className="track-form">
                <input required type="text" placeholder="e.g. ORD-123456" value={trackingRef} onChange={e => setTrackingRef(e.target.value)} className="track-input" />
                <button type="submit" className="track-btn">Track</button>
              </form>
              
              {trackingError && <div style={{ color: 'red', padding: '15px', background: '#fff0f0', border: '1px solid #ffd0d0', marginBottom: '20px' }}>{trackingError}</div>}
              
              {trackingData && (
                <div style={{ background: '#fafafa', padding: '30px', border: '1px solid #eaeaea', maxWidth: '500px' }}>
                  <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '5px' }}>Current Status</div>
                  <div style={{ fontSize: '20px', fontWeight: '900', marginBottom: '20px' }}>{trackingData.status.replace('_', ' ').toUpperCase()}</div>
                  
                  <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '5px' }}>Total Amount</div>
                  <div style={{ fontWeight: 'bold', marginBottom: '20px', fontSize: '16px' }}>{money(trackingData.total)}</div>
                  
                  {trackingData.trackingDetails ? (
                    <>
                      <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '5px' }}>Latest Updates</div>
                      <div style={{ fontSize: '15px', lineHeight: '1.5' }}>{trackingData.trackingDetails}</div>
                    </>
                  ) : (
                    <div style={{ color: '#666', fontStyle: 'italic' }}>No detailed tracking information available yet.</div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h1 style={{ margin: '0 0 30px 0', fontSize: '24px', fontWeight: '900', textTransform: 'uppercase' }}>Account Settings</h1>
              
              <form onSubmit={handleUpdateAccount} style={{ maxWidth: '600px' }}>
                {accountMessage && <div style={{ padding: '15px', background: '#e6ffdb', border: '1px solid #b7f5a4', color: '#2b7811', marginBottom: '20px' }}>{accountMessage}</div>}
                {accountError && <div style={{ padding: '15px', background: '#fff0f0', border: '1px solid #ffd0d0', color: '#d32f2f', marginBottom: '20px' }}>{accountError}</div>}
                
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Display name *</label>
                  <input 
                    type="text" required 
                    value={accountFormData.username} 
                    onChange={e => setAccountFormData(prev => ({ ...prev, username: e.target.value }))}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ccc', background: '#fafafa', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>This will be how your name will be displayed in the account section and in reviews</div>
                </div>

                <div style={{ marginBottom: '40px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Email address *</label>
                  <input 
                    type="email" required 
                    value={accountFormData.email} 
                    onChange={e => setAccountFormData(prev => ({ ...prev, email: e.target.value }))}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ccc', background: '#fafafa', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #eaeaea', paddingBottom: '10px', marginBottom: '20px' }}>Password change</h3>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Current password (leave blank to leave unchanged)</label>
                  <input 
                    type="password" 
                    value={accountFormData.currentPassword} 
                    onChange={e => setAccountFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ccc', background: '#fafafa', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>New password (leave blank to leave unchanged)</label>
                  <input 
                    type="password" 
                    value={accountFormData.newPassword} 
                    onChange={e => setAccountFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ccc', background: '#fafafa', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Confirm new password</label>
                  <input 
                    type="password" 
                    value={accountFormData.confirmPassword} 
                    onChange={e => setAccountFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ccc', background: '#fafafa', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={updatingAccount}
                  style={{ background: '#000', color: '#c1ff38', border: 'none', padding: '15px 30px', fontWeight: 'bold', textTransform: 'uppercase', cursor: updatingAccount ? 'not-allowed' : 'pointer', width: '100%', boxSizing: 'border-box' }}
                >
                  {updatingAccount ? 'Saving...' : 'Save changes'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
