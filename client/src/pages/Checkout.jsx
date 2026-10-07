import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import ProductImage from '../components/ProductImage.jsx';
import useBag from '../useBag.js';
import { changeQuantity, stockFor } from '../../../shared/inventory.js';
import { money } from '../format.js';
import { useNavigate, Link } from 'react-router-dom';
import CheckoutForm from '../components/checkout/CheckoutForm.jsx';
import OrderSummary from '../components/checkout/OrderSummary.jsx';
import Confirmation from '../components/checkout/Confirmation.jsx';

function loadRazorpayScript() {
  if(window.Razorpay)return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('The secure payment window could not be loaded. Please try again.'));
    document.body.appendChild(script);
  });
}


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
  
  const [authenticated, setAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);
  const [initializing, setInitializing] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [discountResult, setDiscountResult] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [loadError,setLoadError]=useState(false);
  const [retry,setRetry]=useState(0);
  const [checkoutEnabled,setCheckoutEnabled]=useState(false);
  const [pendingOrder,setPendingOrder]=useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setInitializing(true);setLoadError(false);setError('');
    Promise.all([
      fetch('/api/customer/me').then(r => r.ok ? r.json() : { authenticated: false }).catch(() => ({ authenticated: false })),
      fetch('/api/products').then(async r => { if (!r.ok) throw new Error('Catalogue unavailable'); return r.json(); })
    ])
    .then(async ([authData, prodData]) => {
      setAuthenticated(Boolean(authData.authenticated));
      setCheckoutEnabled(Boolean(prodData.checkoutEnabled));
      setProducts(prodData.products || []);
      restore(prodData.products || []);
      if (authData.savedAddresses && authData.savedAddresses.length > 0) {
        setSavedAddresses(authData.savedAddresses);
      }
      try {
        const saved=JSON.parse(sessionStorage.getItem('kitverse:pending-order') || 'null');
        if(saved?.orderRef && authData.authenticated){
          const response=await fetch('/api/orders/'+encodeURIComponent(saved.orderRef));
          if(response.ok){
            const order=await response.json();
            if(['paid','review_required','partially_refunded','refunded'].includes(order.paymentStatus)){
              setConfirmation({...order,confirmedAt:new Date().toISOString()});setCart([]);
              sessionStorage.removeItem('kitverse:pending-order');
            } else if(order.paymentStatus==='pending')setPendingOrder(order);
            else sessionStorage.removeItem('kitverse:pending-order');
          }
        }
      }catch{}
      setInitializing(false);
    })
    .catch(() => {setError('Failed to load checkout data');setLoadError(true);setInitializing(false);});
  }, [retry]);

  const subtotal = cart.reduce((n, x) => n + x.price * x.qty, 0);
  const shipping = subtotal >= 150000 ? 0 : 15000;
  const total = subtotal; // For backward compatibility in this file where 'total' was used as subtotal

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setApplyingDiscount(true);
    setDiscountError('');
    setDiscountResult(null);
    try {
      const res = await fetch('/api/checkout/validate-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountCode, subtotal: total })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid code');
      setDiscountResult(data);
    } catch (err) {
      setDiscountError(err.message);
    } finally {
      setApplyingDiscount(false);
    }
  };

  const discountAmount = discountResult ? discountResult.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount) + shipping;


  async function confirmPayment(orderRef, paymentDetails, orderTotal) {
    const response = await fetch('/api/orders/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderRef, ...paymentDetails })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Payment verification is still processing.');
    setCart([]);
    setPendingOrder(null);
    try { sessionStorage.removeItem('kitverse:checkout-draft');sessionStorage.removeItem('kitverse:pending-order');sessionStorage.removeItem('kitverse:checkout-key'); } catch {}
    setConfirmation({
      orderRef: data.orderRef,
      paymentId: paymentDetails.razorpay_payment_id,
      total: data.total ?? orderTotal,
      paymentStatus: data.paymentStatus,
      fulfilmentStatus: data.fulfilmentStatus,
      confirmedAt: new Date().toISOString()
    });
  }

  async function retryPaymentVerification() {
    if (!confirmation?.paymentDetails) return;
    const pending = confirmation;
    setConfirmation({ ...pending, status: 'verifying', error: '' });
    setSubmitting(true);
    try {
      await confirmPayment(pending.orderRef, pending.paymentDetails, pending.total);
    } catch (verificationError) {
      setConfirmation({ ...pending, status: 'verification_pending', error: verificationError.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function launchPayment(data) {
    await loadRazorpayScript();
    const razorpay=new window.Razorpay({
      key:data.razorpayKeyId,order_id:data.paymentIntentId,name:'KITVERSE',description:'Order '+data.orderRef,
      handler:async paymentDetails=>{
        const pending={orderRef:data.orderRef,paymentId:paymentDetails.razorpay_payment_id,paymentDetails,total:data.total,status:'verifying'};
        setConfirmation(pending);
        try{await confirmPayment(data.orderRef,paymentDetails,data.total);}
        catch(error){setConfirmation({...pending,status:'verification_pending',error:error.message});}
        finally{setSubmitting(false);}
      },
      modal:{ondismiss:()=>setSubmitting(false)},
      prefill:{name:formData.firstName+' '+formData.lastName,email:formData.email,contact:formData.phone},theme:{color:'#181a16'}
    });
    razorpay.on('payment.failed',event=>{setError(event.error?.description || 'Payment failed. You can retry the same order.');setSubmitting(false);});
    razorpay.open();
  }
  async function resumePayment(){setSubmitting(true);setError('');try{await launchPayment(pendingOrder);}catch(error){setError(error.message);setSubmitting(false);}}
  async function cancelPending(){
    setSubmitting(true);setError('');
    try{
      const response=await fetch('/api/orders/'+encodeURIComponent(pendingOrder.orderRef)+'/cancel',{method:'POST'});
      const data=await response.json();if(!response.ok)throw new Error(data.error || 'Could not cancel.');
      try{sessionStorage.removeItem('kitverse:pending-order');sessionStorage.removeItem('kitverse:checkout-key');}catch{}
      setPendingOrder(null);setRetry(n=>n+1);
    }catch(error){setError(error.message);}finally{setSubmitting(false);}
  }
  async function submit(event){
    event.preventDefault();if(submitting || !cart.length)return;
    if(!checkoutEnabled){setError('Payments are unavailable. Please try again later.');return;}
    if(!authenticated){requireLogin();return;}
    setSubmitting(true);setError('');
    try{
      await loadRazorpayScript();
      const fingerprint=JSON.stringify({customer:formData,items:cart.map(({slug,size,qty})=>({slug,size,qty}))});
      let retryKey;
      try{const saved=JSON.parse(sessionStorage.getItem('kitverse:checkout-key') || 'null');if(saved?.fingerprint===fingerprint)retryKey=saved.key;}catch{}
      retryKey ||= (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + '-' + Math.random().toString(36).substring(2));
      try{sessionStorage.setItem('kitverse:checkout-key',JSON.stringify({fingerprint,key:retryKey}));}catch{}
      const response=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':retryKey},body:JSON.stringify({customer:formData,items:cart,discountCode:discountResult ? discountResult.code : undefined})});
      const data=await response.json();
      if(response.status===401){requireLogin();return;}
      if(!response.ok)throw new Error(data.error || 'Could not prepare checkout.');
      setPendingOrder(data);
      try{sessionStorage.setItem('kitverse:pending-order',JSON.stringify({orderRef:data.orderRef}));}catch{}
      await launchPayment(data);
    }catch(error){setError(error.message);setSubmitting(false);}
  }

  function requireLogin() {
    try { sessionStorage.setItem('kitverse:checkout-draft', JSON.stringify(formData)); } catch {}
    navigate('/login?redirect=/checkout');
  }

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem('kitverse:checkout-draft') || 'null');
      if (saved && typeof saved === 'object') setFormData(current => Object.fromEntries(Object.entries(current).map(([key, value]) => [key, typeof saved[key] === 'string' ? saved[key] : value])));
    } catch {}
  }, []);

  function updateQuantity(key, delta) {
    try { setCart(changeQuantity(cart, key, delta, products)); setError(''); }
    catch (error) { setError(error.message); }
  }

  const handleUpdate = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  if (initializing) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-space-sm">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <span className="font-label-technical text-label-technical tracking-widest uppercase text-foreground">INITIALIZING SECURE GATEWAY...</span>
        </div>
      </div>
    );
  }

  if (confirmation) {
    return <Confirmation confirmation={confirmation} submitting={submitting} retryPaymentVerification={retryPaymentVerification} />;
  }

  if(loadError)return <><Navbar/><main className="p-8"><p role="alert">{error}</p><button onClick={()=>setRetry(n=>n+1)}>Retry checkout</button></main></>;
  if(pendingOrder)return <><Navbar/><main className="p-8 max-w-xl mx-auto"><h1>Resume your order</h1><p>{pendingOrder.orderRef} · {money(pendingOrder.total)}</p><p>Your existing payment can be retried without reserving more stock.</p>{error&&<p role="alert">{error}</p>}<button disabled={submitting} onClick={resumePayment} className="bg-black text-white p-3 my-4">Resume payment</button><button disabled={submitting} onClick={cancelPending} className="border p-3 m-4">Cancel unpaid order</button><Link to="/profile">View order history</Link></main></>;
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex flex-col font-sans">
        <Navbar />
        <main className="pt-28 flex-1 flex flex-col items-center justify-center p-space-xl text-center">
          <span className="material-symbols-outlined text-[64px] text-foreground/70 mb-space-md">shopping_cart_off</span>
          <h2 className="font-display-md text-display-md uppercase text-foreground mb-space-sm">CART IS EMPTY</h2>
          <p className="font-label-technical text-label-technical tracking-widest uppercase text-foreground/70 mb-space-xl">YOUR ARCHIVE SELECTION HAS NO ITEMS.</p>
          <Link to="/" className="bg-black text-white px-space-xl py-3 font-label-mono-bold text-[14px] tracking-widest uppercase hover:bg-black/80 transition-colors">
            RETURN TO ARCHIVE
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      <Navbar />

      <main className="pt-28 flex-1 w-full px-margin md:px-margin-desktop py-space-xl flex flex-col lg:flex-row gap-gutter-desktop">
        
        {/* Billing Details / Login Prompt */}
        <CheckoutForm 
          authenticated={authenticated}
          requireLogin={requireLogin}
          error={error}
          savedAddresses={savedAddresses}
          formData={formData}
          setFormData={setFormData}
          handleUpdate={handleUpdate}
          submit={submit}
        />

        {/* Order Summary Sidebar */}
        <OrderSummary 
          cart={cart}
          setCart={setCart}
          products={products}
          submitting={submitting}
          updateQuantity={updateQuantity}
          total={total}
          authenticated={authenticated}
          requireLogin={requireLogin}
        />
      </main>
    </div>
  );
}
