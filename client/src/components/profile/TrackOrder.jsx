import React from 'react';
import { money } from '../../format.js';

export default function TrackOrder({
  trackingRef, setTrackingRef,
  trackingData, trackingError,
  fetchTracking
}) {
  return (
    <div className="profile-track-panel">
      <div className="profile-section-heading">
        <span>MEMBER SERVICES / 02</span>
        <h1>TRACK AN ORDER</h1>
        <p>Look up the latest payment and dispatch status using your order reference.</p>
      </div>
      
      <form onSubmit={fetchTracking} className="track-form">
        <input required type="text" placeholder="e.g. ORD-123456" value={trackingRef} onChange={e => setTrackingRef(e.target.value)} className="track-input" />
        <button type="submit" className="track-btn">Track</button>
      </form>
      
      {trackingError && <div className="profile-message is-error" style={{ color: 'red', padding: '15px', background: '#fff0f0', border: '1px solid #ffd0d0', marginBottom: '20px' }}>{trackingError}</div>}
      
      {trackingData && (
        <div className="profile-tracking-result" style={{ background: '#fafafa', padding: '30px', border: '1px solid #eaeaea', maxWidth: '500px' }}>
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
  );
}
