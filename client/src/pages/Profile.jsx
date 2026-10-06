import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { money } from '../format.js';
import Modal from '../components/Modal.jsx';
import './Profile.css';

import ProfileHero from '../components/profile/ProfileHero.jsx';
import ProfileSidebar from '../components/profile/ProfileSidebar.jsx';
import OrderHistory from '../components/profile/OrderHistory.jsx';
import OrderDetail from '../components/profile/OrderDetail.jsx';
import TrackOrder from '../components/profile/TrackOrder.jsx';
import AccountSettings from '../components/profile/AccountSettings.jsx';

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
  const totalSpent = orders.reduce((sum, order) => sum + (['paid','partially_refunded'].includes(order.paymentStatus) ? order.total || 0 : 0), 0);
  const paidOrders = orders.filter(order => ['paid', 'partially_refunded'].includes(order.paymentStatus)).length;

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
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

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
      setOrders(orderData.orders.map(o => ({ ...o, status: o.paymentStatus === 'paid' ? o.fulfilmentStatus : o.paymentStatus })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setLoading(false);
    })
    .catch(err => {
      if (err.message === 'Not authenticated') {
        navigate('/login');
      } else {
        setError(err.message);
        setLoading(false);
      }
    });
  }, [navigate]);

  function handleLogout() {
    setLogoutError('');
    setLogoutConfirmOpen(true);
  }

  async function confirmLogout() {
    setLoggingOut(true);
    setLogoutError('');
    try {
      const response = await fetch('/api/customer/logout', { method: 'POST' });
      if (!response.ok) throw new Error('We could not sign you out. Please try again.');
      navigate('/');
    } catch (err) {
      setLogoutError(err.message || 'We could not sign you out. Please try again.');
    } finally {
      setLoggingOut(false);
    }
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
      const res = await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: accountFormData.username,
          email: accountFormData.email,
          currentPassword: accountFormData.currentPassword || undefined,
          newPassword: accountFormData.newPassword || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
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
    return <div className="profile-loading"><span>KV—04</span><p>LOADING YOUR ARCHIVE…</p></div>;
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
          color: var(--brand-yellow);
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
      <Navbar />
      {orders.some(o=>o.paymentStatus==='review_required') && <p role="status" className="p-4 border bg-white">A payment was received after its stock reservation ended. Do not pay again. Contact the store with the order reference for fulfillment or refund review.</p>}

      <ProfileHero 
        user={user}
        orders={orders}
        paidOrders={paidOrders}
        totalSpent={totalSpent}
      />

      <div className="profile-container">
        <ProfileSidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSelectedOrder={setSelectedOrder}
          setPage={setPage}
          handleLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="profile-main">
          
          {activeTab === 'orders' ? (
            <div>
              {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

              {orders.length === 0 ? (
                <div className="profile-empty-state" style={{ padding: '60px 40px', background: '#fafafa', border: '1px solid #eaeaea', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '16px' }}>You haven't placed any orders yet.</p>
                  <Link to="/" style={{ display: 'inline-block', background: '#000', color: 'var(--brand-yellow)', padding: '12px 24px', textDecoration: 'none', fontWeight: 'bold', textTransform: 'uppercase' }}>Start Shopping</Link>
                </div>
              ) : selectedOrder ? (
                <OrderDetail 
                  selectedOrder={selectedOrder}
                  setSelectedOrder={setSelectedOrder}
                />
              ) : (
                <OrderHistory 
                  searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                  filterStatus={filterStatus} setFilterStatus={setFilterStatus}
                  filterTime={filterTime} setFilterTime={setFilterTime}
                  filteredOrders={filteredOrders} paginatedOrders={paginatedOrders}
                  page={page} setPage={setPage} totalPages={totalPages}
                  setSelectedOrder={setSelectedOrder}
                />
              )}
            </div>
          ) : activeTab === 'track' ? (
            <TrackOrder 
              trackingRef={trackingRef} setTrackingRef={setTrackingRef}
              trackingData={trackingData} trackingError={trackingError}
              fetchTracking={fetchTracking}
            />
          ) : (
            <AccountSettings 
              accountFormData={accountFormData} setAccountFormData={setAccountFormData}
              accountMessage={accountMessage} accountError={accountError}
              updatingAccount={updatingAccount} handleUpdateAccount={handleUpdateAccount}
            />
          )}
        </main>
      </div>
      {logoutConfirmOpen && <Modal label="Confirm logout" className="profile-logout-dialog" onClose={() => {
        if (!loggingOut) setLogoutConfirmOpen(false);
      }}>
        <div className="profile-logout-content">
          <span>MEMBER SESSION / EXIT</span>
          <h2>LEAVE YOUR ARCHIVE?</h2>
          <p>You’ll be signed out of your KITVERSE account. Your orders and saved account details will remain available when you return.</p>
          {logoutError && <p className="profile-logout-error" role="alert">{logoutError}</p>}
          <div className="profile-logout-actions">
            <button type="button" className="profile-logout-cancel" disabled={loggingOut} onClick={() => setLogoutConfirmOpen(false)}>STAY SIGNED IN</button>
            <button type="button" className="profile-logout-confirm" disabled={loggingOut} onClick={confirmLogout}>{loggingOut ? 'SIGNING OUT…' : 'LOG OUT'}</button>
          </div>
        </div>
      </Modal>}
    </div>
  );
}
