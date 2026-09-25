import React, { useState, useEffect } from 'react';
import useBag from '../useBag.js';
import { money } from '../format.js';
import { useNavigate, Link } from 'react-router-dom';

const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", 
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function Checkout() {
  const { cart, setCart, restore } = useBag();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: 'India',
    streetAddress: '',
    apartment: '',
    city: '',
    state: '',
    postcode: '',
    phone: '',
    altPhone: '',
    email: '',
    notes: ''
  });
  
  const [initializing, setInitializing] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Parallel fetch: check auth and load products
    Promise.all([
      fetch('/api/customer/me').then(r => r.json()),
      fetch('/api/products').then(r => r.json())
    ])
    .then(([authData, prodData]) => {
      if (!authData.authenticated) {
        navigate('/auth?redirect=/checkout');
        return;
      }
      restore(prodData.products || []);
      if (authData.savedAddresses && authData.savedAddresses.length > 0) {
        setSavedAddresses(authData.savedAddresses);
      }
      setInitializing(false);
    })
    .catch(err => {
      setError('Failed to load checkout data');
      setInitializing(false);
    });
  }, []);

  const total = cart.reduce((n, x) => n + x.price * x.qty, 0);

  async function submit(e) {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: formData, items: cart })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to place order');
      
      if (data.razorpayKeyId && data.paymentIntentId) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const rzp = new window.Razorpay({
            key: data.razorpayKeyId,
            order_id: data.paymentIntentId,
            name: 'KITVERSE',
            description: 'Order ' + data.orderRef,
            handler: function (response) {
              setCart([]);
              navigate('/?success=1');
            },
            prefill: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              contact: formData.phone
            },
            theme: { color: '#000000' }
          });
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        setCart([]);
        navigate('/?success=1');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const handleUpdate = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  if (initializing) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ padding: '20px', background: '#000', color: '#c1ff38', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Initializing Secure Checkout...
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '40px', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#c1ff38', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '15px' }}>Order Confirmed</h1>
        <p style={{ fontSize: '16px', color: '#666', maxWidth: '400px', marginBottom: '40px', lineHeight: '1.6' }}>
          Thank you for choosing KITVERSE. Your payment has been processed and your matchday kit is being prepared for dispatch.
        </p>
        <Link to="/profile" style={{ display: 'inline-block', background: '#000', color: '#fff', padding: '16px 32px', textDecoration: 'none', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Track Order in Profile</Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ padding: '80px 40px', fontFamily: 'Inter, sans-serif', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '20px' }}>Your bag is empty.</h2>
        <Link to="/" style={{ display: 'inline-block', background: '#c1ff38', color: '#000', padding: '12px 24px', textDecoration: 'none', fontWeight: 'bold', textTransform: 'uppercase' }}>Back to the kit room</Link>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#fff', color: '#000', minHeight: '100vh', paddingBottom: '60px' }}>
      <style>{`
        .checkout-input {
          width: 100%; padding: 14px; border: 1px solid #ddd; border-radius: 0; box-sizing: border-box; 
          font-family: inherit; font-size: 14px; background: #fafafa; margin-bottom: 20px;
          transition: all 0.2s ease;
        }
        .checkout-input:focus {
          outline: none; border-color: #000; background: #fff; box-shadow: 0 0 0 1px #000;
        }
        .checkout-label {
          display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; 
          letter-spacing: 0.5px; margin-bottom: 8px; color: #555;
        }
      `}</style>
      
      <header style={{ padding: '20px 40px', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.05em', textDecoration: 'none', color: '#000', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          KITVERSE
        </Link>
        <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: '#888' }}>Secure Checkout</span>
      </header>

      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', display: 'flex', gap: '60px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Billing Details Form */}
        <div style={{ flex: '1 1 600px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '30px', borderBottom: '4px solid #c1ff38', display: 'inline-block', paddingBottom: '5px' }}>Billing Details</h1>
          {error && <div style={{ background: '#000', color: '#ff4444', padding: '15px', marginBottom: '25px', fontWeight: 'bold', fontSize: '14px' }}>{error}</div>}
          
          {savedAddresses && savedAddresses.length > 0 && (
            <div style={{ marginBottom: '30px', padding: '20px', background: '#f9faf7', border: '1px solid #eaeaea' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '15px' }}>Use a saved address</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {savedAddresses.map((addr, i) => (
                  <button 
                    key={i} type="button" 
                    style={{ textAlign: 'left', padding: '15px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, ...addr }));
                    }}
                  >
                    <strong>{addr.firstName} {addr.lastName}</strong><br/>
                    {addr.streetAddress}{addr.apartment ? ", ${addr.apartment}" : ''}, {addr.city}, {addr.state} {addr.postcode}
                  </button>
                ))}
                <button 
                  type="button" 
                  style={{ textAlign: 'left', padding: '15px', border: '1px dashed #bbb', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold' }}
                  onClick={() => setFormData(prev => ({ ...prev, firstName: '', lastName: '', streetAddress: '', apartment: '', city: '', state: '', postcode: '', phone: '', altPhone: '' }))}
                >
                  + Enter a new address
                </button>
              </div>
            </div>
          )}
          
          <form id="checkout-form" onSubmit={submit}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label className="checkout-label">First name *</label>
                <input required type="text" className="checkout-input" value={formData.firstName} onChange={e => handleUpdate('firstName', e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="checkout-label">Last name *</label>
                <input required type="text" className="checkout-input" value={formData.lastName} onChange={e => handleUpdate('lastName', e.target.value)} />
              </div>
            </div>

            <label className="checkout-label">Country / Region *</label>
            <input readOnly type="text" className="checkout-input" value={formData.country} style={{ backgroundColor: '#f5f5f5', color: '#888', cursor: 'not-allowed', outline: 'none' }} />

            <label className="checkout-label">Street address *</label>
            <input required type="text" placeholder="House number and street name" className="checkout-input" value={formData.streetAddress} onChange={e => handleUpdate('streetAddress', e.target.value)} />
            <input type="text" placeholder="Apartment, suite, unit, etc. (optional)" className="checkout-input" value={formData.apartment} onChange={e => handleUpdate('apartment', e.target.value)} />

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label className="checkout-label">Town / City *</label>
                <input required type="text" className="checkout-input" value={formData.city} onChange={e => handleUpdate('city', e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="checkout-label">State *</label>
                <select required className="checkout-input" style={{ cursor: 'pointer', appearance: 'auto' }} value={formData.state} onChange={e => handleUpdate('state', e.target.value)}>
                  <option value="" disabled>Select a state</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            <label className="checkout-label">Postcode / ZIP *</label>
            <input required type="text" className="checkout-input" value={formData.postcode} onChange={e => handleUpdate('postcode', e.target.value)} />

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label className="checkout-label">Phone *</label>
                <input required type="tel" className="checkout-input" value={formData.phone} onChange={e => handleUpdate('phone', e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="checkout-label">Additional Phone Number (optional)</label>
                <input type="tel" className="checkout-input" value={formData.altPhone} onChange={e => handleUpdate('altPhone', e.target.value)} />
              </div>
            </div>

            <label className="checkout-label">Email address *</label>
            <input required type="email" className="checkout-input" value={formData.email} onChange={e => handleUpdate('email', e.target.value)} />

            <label className="checkout-label">Order notes (optional)</label>
            <textarea placeholder="Notes about your order, e.g. special notes for delivery." rows="4" className="checkout-input" style={{ resize: 'vertical' }} value={formData.notes} onChange={e => handleUpdate('notes', e.target.value)} />
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div style={{ flex: '1 1 350px', background: '#fafafa', border: '1px solid #eaeaea', padding: '30px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '25px', letterSpacing: '0.5px' }}>Your Order</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
            {cart.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '15px' }}>
                <div style={{ width: '60px', height: '80px', background: '#fff', border: '1px solid #eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>{item.name}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>{item.quality || item.productType}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Size: <strong>{item.size}</strong> &times; {item.qty}</div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  {money(item.price * item.qty)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '2px solid #000', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px' }}>
              <span>Subtotal</span>
              <span>{money(total)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px' }}>
              <span>Shipping</span>
              <span>Calculated at next step</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '900', marginTop: '20px' }}>
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </div>
          
          <div style={{ marginTop: '30px', fontSize: '11px', color: '#888', lineHeight: '1.5' }}>
            Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
          </div>

          <button type="submit" form="checkout-form" disabled={submitting} style={{ 
            width: '100%', padding: '20px', background: '#000', color: '#c1ff38', border: 'none', 
            marginTop: '25px', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '16px', 
            fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', transition: 'background 0.2s'
          }}>
            {submitting ? 'Processing...' : 'Place Order'}
          </button>
        </div>

      </div>
    </div>
  );
}






