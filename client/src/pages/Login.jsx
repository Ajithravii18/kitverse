import React, { useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Modal from '../components/Modal.jsx';

export default function Login() {

  const navigate = useNavigate();
  const location = useLocation();
  const returnToCheckout = new URLSearchParams(location.search).get('redirect') === '/checkout';
  const authQuery = returnToCheckout ? '?redirect=/checkout' : '';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState(1);

  useEffect(() => {
    let active = true;
    fetch('/api/customer/me')
      .then(response => response.ok ? response.json() : { authenticated: false })
      .then(data => {
        if (!active) return;
        if (data.authenticated) navigate(returnToCheckout ? '/checkout' : '/', { replace: true, state: { signedIn: true, username: data.username } });
        else setCheckingSession(false);
      })
      .catch(() => {
        if (active) setCheckingSession(false);
      });
    return () => { active = false; };
  }, [navigate, returnToCheckout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      navigate(returnToCheckout ? '/checkout' : '/', { replace: true, state: { signedIn: true, username: data.username } });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingSession) {
    return <main className="min-h-screen bg-surface text-foreground flex items-center justify-center">
      <div className="flex items-center gap-space-sm font-label-mono-bold text-label-mono-bold uppercase">
        <span className="material-symbols-outlined" aria-hidden="true">person</span>
        Checking account session
      </div>
    </main>;
  }

  return (
    <>
<Navbar /><main className="w-full pt-28 bg-surface min-h-[calc(100vh-140px)]"><div className="w-full max-w-6xl mx-auto px-gutter-desktop lg:px-margin-desktop py-space-xl lg:py-space-2xl min-h-[calc(100vh-180px)] flex items-center"><div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl lg:gap-space-2xl items-center w-full"><div className="hidden lg:block lg:col-span-6"><div className="relative aspect-[4/5] bg-surface-container-high overflow-hidden shadow-sm"><img className="w-full h-full object-cover grayscale contrast-125" data-alt="Editorial minimal black and crimson technical football jersey garment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjzQZGQ7Xj8g3SvAU7_vS56iNM07dGmEbikj-8tryvBkegRn-GJknj1T1ku-jZBUcXUQ_Kd7FxGa_m8JCC7chP_Q7V54q_W1wiY5gQl5Ixil1q8PTk2L-Bue5a-CwWjotKd5l7aXIr-AEKTVQXKE4i8pVSWiXqARzXpd_-ON3ugzOqvso4eEX8jkC0RLPtUlrN27sS0MPYgDag5gp7t8c9LCIKCwi1TOsr4bgM6skej5LeE4dkfB3ZJQ"/><div className="absolute bottom-6 left-6 right-6 text-foreground bg-cardest/90 backdrop-blur-md p-space-md shadow-sm"><p className="font-title-editorial text-title-editorial uppercase text-foreground">Archive Series 01</p><p className="font-body-sm text-body-sm text-foreground/70 mt-1">Archival athletic silhouettes engineered with technical discipline.</p></div></div></div><div className="lg:col-span-6 max-w-md mx-auto w-full lg:pl-space-lg"><div className="mb-space-xl"><p className="font-body-sm text-body-sm uppercase tracking-widest text-foreground/70 mb-space-xs">Client Access</p><h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg tracking-tight text-foreground uppercase">Sign In</h1><p className="font-body-md text-body-md text-foreground/70 mt-space-xs">Enter your credentials to access your archive repository and allocations.</p></div>{error && <div className="p-3 bg-red-100 text-red-700 text-sm">{error}</div>}
<form className="space-y-space-lg" id="authForm" onSubmit={handleSubmit}><div className="space-y-space-xs"><label className="block font-body-sm text-body-sm uppercase tracking-wider text-foreground" htmlFor="collectorEmail">Email Address</label><div className="relative bg-card"><input className="w-full bg-transparent px-space-md py-3.5 font-body-md text-body-md text-foreground placeholder:text-foreground/70/50 focus:outline-none focus:bg-cardest transition-all duration-150" id="collectorEmail" placeholder="name@domain.com" required type="email" value={email} onChange={e => setEmail(e.target.value)}/></div></div><div className="space-y-space-xs"><div className="flex justify-between items-center"><label className="block font-body-sm text-body-sm uppercase tracking-wider text-foreground" htmlFor="collectorPass">Password</label><button type="button" onClick={() => setShowForgotModal(true)} className="font-body-sm text-body-sm text-foreground/70 hover:text-foreground underline underline-offset-4 transition-colors">Forgot password?</button></div><div className="relative bg-card"><input className="w-full bg-transparent px-space-md py-3.5 font-body-md text-body-md text-foreground placeholder:text-foreground/70/50 focus:outline-none focus:bg-cardest transition-all duration-150 pr-20" id="collectorPass" placeholder="••••••••••••" required="" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}/><div className="absolute right-3 inset-y-0 flex items-center"><button className="px-2 py-1 text-foreground/70 hover:text-foreground font-body-sm text-body-sm uppercase tracking-wider transition-colors" id="togglePassBtn" type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button></div></div></div><div className="flex items-center justify-between pt-1"><label className="flex items-center gap-space-sm cursor-pointer"><input checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="w-4 h-4 text-foreground accent-on-surface rounded-none focus:ring-0 cursor-pointer" type="checkbox"/><span className="font-body-sm text-body-sm text-foreground/70 hover:text-foreground transition-colors">Remember this session</span></label></div><div className="pt-space-sm"><button className="w-full py-4 px-space-md bg-foreground text-background hover:bg-primary-container hover:text-on-primary-container font-label-mono-bold text-label-mono-bold tracking-widest uppercase transition-all duration-150 flex items-center justify-center gap-space-sm shadow-sm" id="submitActionBtn" type="submit" disabled={isLoading}><span>{isLoading ? "Loading..." : "Continue"}</span><span className="material-symbols-outlined text-[18px]">arrow_forward</span></button></div><div className="text-center pt-space-sm"><p className="font-body-sm text-body-sm text-foreground/70">Don't have an account?<Link className="font-body-sm text-body-sm text-foreground hover:opacity-75 underline underline-offset-4 uppercase ml-1.5 transition-opacity" to={'/signup' + authQuery}>Create account</Link></p></div></form></div></div></div>  {showSuccessPopup && (
    <Modal label="Authentication Confirmed" onClose={() => navigate('/shop')} className="bg-surface border border-surface-container-high p-8 shadow-xl max-w-sm w-full mx-auto backdrop:bg-surface/80 backdrop:backdrop-blur-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-foreground"></div>
      <div className="text-center flex flex-col gap-space-sm pt-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-2">
          <span className="material-symbols-outlined text-[24px]">lock_open</span>
        </div>
        <h2 className="font-headline-sm text-headline-sm uppercase text-foreground tracking-tighter">Identity Verified</h2>
        <p className="font-body-sm text-body-sm text-foreground/70">Authentication successful. Entering KITVERSE archive.</p>
        <button className="w-full bg-foreground text-surface hover:bg-inverse-surface font-label-mono-bold text-label-mono-bold uppercase py-space-md px-space-lg mt-space-md transition-colors flex items-center justify-center gap-2" onClick={() => navigate('/shop')}>
          <span>Enter Archive</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </Modal>
  )}

  {showForgotModal && (
    <Modal label="Password Reset" onClose={() => setShowForgotModal(false)} className="bg-surface border border-surface-container-high p-8 shadow-xl max-w-sm w-full mx-auto backdrop:bg-surface/80 backdrop:backdrop-blur-sm relative overflow-hidden">
      <div className="text-center flex flex-col gap-space-sm">
        <h2 className="font-headline-sm text-headline-sm uppercase text-foreground tracking-tighter">Reset Password</h2>
        
        {forgotStep === 1 && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            try {
              const res = await fetch('/api/customer/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail })
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error);
              setForgotStep(2);
            } catch(err) {
              alert(err.message);
            } finally {
              setIsLoading(false);
            }
          }} className="flex flex-col gap-4 mt-4">
            <input aria-label={forgotEmail ? "Email" : "Enter your email"} className="w-full bg-card px-4 py-3 text-sm focus:outline-none" placeholder="Enter your email" type="email" required value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} />
            <button type="submit" disabled={isLoading} className="w-full bg-black text-white font-label-mono-bold text-[12px] uppercase py-3 transition-colors">{isLoading ? 'Sending...' : 'Send Reset Code'}</button>
          </form>
        )}

        {forgotStep === 2 && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            try {
              const res = await fetch('/api/customer/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail, otp: forgotOtp, newPassword: forgotNewPassword })
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error);
              alert('Password reset successful. You can now login.');
              setShowForgotModal(false);
              setForgotStep(1);
              setForgotEmail('');
              setForgotOtp('');
              setForgotNewPassword('');
            } catch(err) {
              alert(err.message);
            } finally {
              setIsLoading(false);
            }
          }} className="flex flex-col gap-4 mt-4">
            <input className="w-full bg-card px-4 py-3 text-sm focus:outline-none" placeholder="Enter 6-digit code" required value={forgotOtp} onChange={e => setForgotOtp(e.target.value)} />
            <input className="w-full bg-card px-4 py-3 text-sm focus:outline-none" placeholder="New Password" type="password" required value={forgotNewPassword} onChange={e => setForgotNewPassword(e.target.value)} minLength={8} />
            <button type="submit" disabled={isLoading} className="w-full bg-black text-white font-label-mono-bold text-[12px] uppercase py-3 transition-colors">{isLoading ? 'Resetting...' : 'Confirm New Password'}</button>
          </form>
        )}
      </div>
    </Modal>
  )}
</main>
    </>
  );
}
