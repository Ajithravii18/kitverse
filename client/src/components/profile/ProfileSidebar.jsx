import React from 'react';

export default function ProfileSidebar({ activeTab, setActiveTab, setSelectedOrder, setPage, handleLogout }) {
  return (
    <aside className="profile-sidebar">
      <button className="profile-logout bg-surface-container-high p-4 mb-4 font-label-mono-bold w-full text-left uppercase text-error hover:bg-error hover:text-white transition-colors" onClick={handleLogout}>LOG OUT <span aria-hidden="true">→</span></button>
      <h2 className="profile-nav-heading">MEMBER SERVICES</h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <button 
          className={`profile-nav-tab ${activeTab === 'orders' ? 'is-active' : ''}`}
          onClick={() => { setActiveTab('orders'); setSelectedOrder(null); setPage(1); }}
          style={{ 
            background: activeTab === 'orders' ? '#000' : 'transparent',
            color: activeTab === 'orders' ? 'var(--brand-yellow)' : '#333',
            border: 'none', padding: '12px 15px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer',
            textAlign: 'left', transition: 'all 0.2s',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
          My Orders {activeTab === 'orders' && <span>→</span>}
        </button>
        <button 
          className={`profile-nav-tab ${activeTab === 'track' ? 'is-active' : ''}`}
          onClick={() => { setActiveTab('track'); setSelectedOrder(null); }}
          style={{ 
            background: activeTab === 'track' ? '#000' : 'transparent',
            color: activeTab === 'track' ? 'var(--brand-yellow)' : '#333',
            border: 'none', padding: '12px 15px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer',
            textAlign: 'left', transition: 'all 0.2s',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
          Track Order {activeTab === 'track' && <span>→</span>}
        </button>
        <button 
          className={`profile-nav-tab ${activeTab === 'account' ? 'is-active' : ''}`}
          onClick={() => { setActiveTab('account'); setSelectedOrder(null); }}
          style={{ 
            background: activeTab === 'account' ? '#000' : 'transparent',
            color: activeTab === 'account' ? 'var(--brand-yellow)' : '#333',
            border: 'none', padding: '12px 15px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer',
            textAlign: 'left', transition: 'all 0.2s',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
          Account Settings {activeTab === 'account' && <span>→</span>}
        </button>
      </nav>
    </aside>
  );
}
