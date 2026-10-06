import React from 'react';
import { money } from '../../format.js';

export default function OrderHistory({
  searchQuery, setSearchQuery,
  filterStatus, setFilterStatus,
  filterTime, setFilterTime,
  filteredOrders, paginatedOrders,
  page, setPage, totalPages,
  setSelectedOrder
}) {
  return (
    <div>
      <div className="profile-section-heading">
        <span>MEMBER SERVICES / 01</span>
        <h1>ORDER HISTORY</h1>
        <p>Review purchases, payment status, and dispatch details from your archive.</p>
      </div>
      
      <div className="profile-order-tools" style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
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
          <option value="payment_review">Payment received — review required</option>
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
      
      <div className="profile-order-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {filteredOrders.length === 0 ? (
          <div className="profile-empty-state" style={{ padding: '40px', textAlign: 'center', color: '#888', fontStyle: 'italic', border: '1px dashed #ccc' }}>
            No orders match your current filters.
          </div>
        ) : paginatedOrders.map(order => (
          <div key={order._id} className="order-list-row" role="button" tabIndex={0} aria-label={`View order ${order.orderRef}`}
            onClick={() => setSelectedOrder(order)}
            onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedOrder(order); } }}>
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
                  background: order.paymentStatus === 'paid' ? 'var(--brand-yellow)' : order.fulfilmentStatus !== 'unfulfilled' ? '#000' : '#ddd',
                  color: order.fulfilmentStatus !== 'unfulfilled' ? '#fff' : '#000'
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

      {totalPages > 1 && (
        <div className="profile-pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eaeaea' }}>
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
  );
}
