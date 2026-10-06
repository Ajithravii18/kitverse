import React from 'react';
import { money } from '../../format.js';

export default function OrderDetail({ selectedOrder, setSelectedOrder }) {
  return (
    <div>
      <button 
        className="profile-back-button"
        onClick={() => setSelectedOrder(null)}
        style={{ background: 'none', border: 'none', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', marginBottom: '20px', padding: 0, color: '#666' }}
      >
        ← Back to Orders
      </button>
      <div className="detailed-header-top profile-detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eaeaea', flexWrap: 'wrap', gap: '15px' }}>
        <div className="profile-order-title"><span>ORDER FILE / 01</span><h2>ORDER #{selectedOrder.orderRef}</h2></div>
        <div style={{ 
          display: 'inline-block', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase',
          background: selectedOrder.paymentStatus === 'paid' ? 'var(--brand-yellow)' : selectedOrder.fulfilmentStatus !== 'unfulfilled' ? '#000' : '#ddd',
          color: selectedOrder.fulfilmentStatus !== 'unfulfilled' ? '#fff' : '#000'
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
        <div className="profile-detail-block" style={{ marginBottom: '30px', padding: '20px', background: '#fafafa', border: '1px solid #eaeaea' }}>
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
        <div className="profile-detail-block profile-tracking-block" style={{ marginBottom: '30px', padding: '20px', background: '#fafafa', borderLeft: '4px solid var(--brand-yellow)' }}>
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
  );
}
