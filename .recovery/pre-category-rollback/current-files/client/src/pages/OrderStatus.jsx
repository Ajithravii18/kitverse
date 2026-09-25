import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BagContext } from '../main.jsx';

export default function OrderStatus() {
  const { ref } = useParams();
  const { setCart } = useContext(BagContext);
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeoutId;
    async function checkStatus() {
      try {
        const res = await fetch(`/api/tracking/${ref}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch status');
        setStatusData(data);
        
        // Only clear the cart and show success if the server verifies it is paid or fulfilled
        if (data.status === 'paid' || data.status === 'fulfilled') {
          setCart([]);
          setLoading(false);
        } else if (data.status === 'pending_payment') {
          // Poll again in 2 seconds in case the webhook is slightly delayed
          timeoutId = setTimeout(checkStatus, 2000);
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    checkStatus();
    return () => clearTimeout(timeoutId);
  }, [ref, setCart]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ padding: '20px', background: '#000', color: '#c1ff38', fontWeight: 'bold', textTransform: 'uppercase' }}>
          Verifying Payment...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '100px 40px', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '20px' }}>Error</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <Link to="/profile" style={{ display: 'inline-block', background: '#000', color: '#fff', padding: '12px 24px', textDecoration: 'none', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '20px' }}>Go to Profile</Link>
      </div>
    );
  }

  const isSuccess = statusData.status === 'paid' || statusData.status === 'fulfilled';
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '40px', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: isSuccess ? '#c1ff38' : '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
        {isSuccess ? (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        ) : (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        )}
      </div>
      
      <h1 style={{ fontSize: '36px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '15px' }}>
        {isSuccess ? 'Order Confirmed' : 'Payment Review'}
      </h1>
      <p style={{ fontSize: '16px', color: '#666', maxWidth: '400px', marginBottom: '40px', lineHeight: '1.6' }}>
        {isSuccess 
          ? `Thank you for choosing KITVERSE. Your payment for order ${statusData.orderRef} has been processed successfully.` 
          : `Your order ${statusData.orderRef} is currently in status: ${statusData.status.replace('_', ' ')}. Please check your profile for updates.`}
      </p>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/profile" style={{ display: 'inline-block', background: '#000', color: '#fff', padding: '16px 32px', textDecoration: 'none', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>View Profile</Link>
        {!isSuccess && <Link to="/checkout" style={{ display: 'inline-block', background: '#eee', color: '#000', padding: '16px 32px', textDecoration: 'none', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Return to Cart</Link>}
      </div>
    </div>
  );
}
