import React from 'react';
import Navbar from '../components/Navbar.jsx';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Modal from '../components/Modal.jsx';

export default function SignUp() {

  const navigate = useNavigate();
  const location = useLocation();
  const returnToCheckout = new URLSearchParams(location.search).get('redirect') === '/checkout';
  const authQuery = returnToCheckout ? '?redirect=/checkout' : '';
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('register'); // 'register' or 'verify'
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [otpVals, setOtpVals] = useState(['', '', '', '', '', '']);

  const handleOtpChange = (index, value) => {
    // Handle paste
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      const newVals = [...otpVals];
      pasted.forEach((char, i) => { if (index + i < 6) newVals[index + i] = char; });
      setOtpVals(newVals);
      setOtp(newVals.join(''));
      const nextId = Math.min(5, index + pasted.length);
      document.getElementById(`otp-${nextId}`)?.focus();
      return;
    }
    // Handle single char
    const newVals = [...otpVals];
    newVals[index] = value.replace(/\D/g, '');
    setOtpVals(newVals);
    setOtp(newVals.join(''));
    if (newVals[index] && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpVals[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setStep('verify');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/customer/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      setShowSuccessPopup(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
<Navbar /><main className="w-full pt-28 bg-surface min-h-[calc(100vh-140px)]"><div className="w-full max-w-6xl mx-auto px-gutter-desktop lg:px-margin-desktop py-space-xl lg:py-space-2xl min-h-[calc(100vh-180px)] flex items-center"><div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl lg:gap-space-2xl items-center w-full">{/*  Editorial Image Column  */}<div className="hidden lg:flex lg:col-span-6 flex-col gap-space-sm"><div className="relative aspect-[4/5] bg-surface-container overflow-hidden rounded"><img className="w-full h-full object-cover contrast-125 grayscale hover:grayscale-0 transition-all duration-700" data-alt="Minimalist editorial sports couture photography with vintage folded football jerseys on raw stone" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7falbyLb7gcXXygcC4SWJMasq1cvG4LphyjopHD8GkkvsyWqd6iD9OKslOHxY7E43qdEfB1rOHkdjR_Tx3IWhRfErS8RTNITsSxx9HVlrotBFXhh7JbeY63WRS1K2RhshPir529c9NIHTaZvLqSwNUP7WTgi1JPcoRPlkS9xDVDHm_EqF0KVkb9JXcv_IgRuuxxi4fyXYZ5LEqsNfzHlUK0cT6IGF3MjzYPEpHlAdG-sz3yR9zqPwOw"/><div className="absolute bottom-space-md left-space-md bg-surface/90 backdrop-blur-sm px-space-md py-space-xs font-label-technical text-label-technical tracking-widest uppercase text-on-surface border border-surface-container-high">Atelier Specimen Series // 1987—2023</div></div><div className="flex items-center justify-between font-label-technical text-label-technical uppercase tracking-widest text-on-surface-variant pt-space-xs border-t border-surface-container-high"><span>Curated Archive Access</span><span>Global Atelier Dispatch</span></div></div>{/*  Minimalist Form Column  */}<div className="lg:col-span-6 max-w-md mx-auto w-full lg:pl-space-lg"><div className="space-y-space-xs mb-space-xl"><p className="font-label-technical text-label-technical uppercase tracking-widest text-on-surface-variant">Collector Onboarding</p><h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg uppercase text-on-surface tracking-tighter leading-none">Create Account</h1><p className="font-body-md text-body-md text-on-surface-variant pt-space-xs">Join KITVERSE for prioritized kit drops, bespoke size curation, and worldwide archive tracking.</p></div>{error && <div className="p-3 bg-red-100 text-red-700 text-sm mb-4">{error}</div>}
  {step === 'register' ? (
    <form className="flex flex-col gap-space-lg" onSubmit={handleRegister}><div className="flex flex-col gap-space-xs"><label className="font-label-mono-bold text-label-mono-bold uppercase tracking-wider text-on-surface text-[12px]" htmlFor="collector-email">Email Address</label><input className="w-full bg-transparent text-on-surface font-body-md text-body-md px-space-md py-space-sm border border-surface-container-highest focus:border-on-surface focus:outline-none placeholder:text-on-surface-variant/40 transition-colors" id="collector-email" placeholder="name@domain.com" required type="email" value={email} onChange={e => setEmail(e.target.value)}/></div><div className="flex flex-col gap-space-xs"><label className="font-label-mono-bold text-label-mono-bold uppercase tracking-wider text-on-surface text-[12px]" htmlFor="collector-handle">Username</label><input className="w-full bg-transparent text-on-surface font-body-md text-body-md px-space-md py-space-sm border border-surface-container-highest focus:border-on-surface focus:outline-none placeholder:text-on-surface-variant/40 transition-colors" id="collector-handle" placeholder="username" required type="text" value={username} onChange={e => setUsername(e.target.value)}/></div><div className="flex flex-col gap-space-xs"><div className="flex items-center justify-between"><label className="font-label-mono-bold text-label-mono-bold uppercase tracking-wider text-on-surface text-[12px]" htmlFor="collector-password">Password</label><span className="font-label-technical text-label-technical uppercase tracking-widest text-on-surface-variant">Min. 8 Characters</span></div><div className="relative flex items-center"><input className="w-full bg-transparent text-on-surface font-body-md text-body-md px-space-md pr-16 py-space-sm border border-surface-container-highest focus:border-on-surface focus:outline-none placeholder:text-on-surface-variant/40 transition-colors" id="collector-password" placeholder="••••••••••••" required type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} /><button className="absolute right-3 font-label-technical text-label-technical uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors" id="toggle-pwd-btn" type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button></div></div><div className="pt-space-sm flex flex-col gap-space-md"><button className="w-full bg-on-surface text-surface hover:bg-inverse-surface font-label-mono-bold text-label-mono-bold uppercase py-space-md px-space-lg flex items-center justify-center gap-space-sm transition-colors tracking-widest text-[12px]" type="submit" disabled={isLoading}><span>{isLoading ? "Processing..." : "Create Account"}</span></button><div className="text-center font-body-md text-body-md text-on-surface-variant"><span className="text-body-sm">Already have an account? </span><Link className="font-label-mono-bold text-label-mono-bold uppercase text-on-surface underline underline-offset-4 hover:text-primary transition-colors text-[12px]" to={'/login' + authQuery}>Sign In</Link></div></div></form>
  ) : (
    <form className="flex flex-col gap-space-lg" onSubmit={handleVerify}>
      <div className="flex flex-col gap-space-xs">
        <label className="font-label-mono-bold text-label-mono-bold uppercase tracking-wider text-on-surface text-[12px] mb-2 text-center">Verification Code (OTP)</label>
        <div className="flex justify-between gap-2 max-w-xs mx-auto w-full">
          {otpVals.map((val, idx) => (
            <input key={idx} id={`otp-${idx}`} className="w-full aspect-square max-w-[3rem] text-center bg-transparent text-on-surface font-headline-sm text-headline-sm border border-surface-container-highest focus:border-on-surface focus:outline-none transition-colors mx-auto" required type="text" inputMode="numeric" maxLength={6} value={val} onChange={e => handleOtpChange(idx, e.target.value)} onKeyDown={e => handleOtpKeyDown(idx, e)} />
          ))}
        </div>
      </div>
      <div className="pt-space-sm flex flex-col gap-space-md">
        <button className="w-full bg-on-surface text-surface hover:bg-inverse-surface font-label-mono-bold text-label-mono-bold uppercase py-space-md px-space-lg flex items-center justify-center gap-space-sm transition-colors tracking-widest text-[12px]" type="submit" disabled={isLoading}>
          <span>{isLoading ? 'Verifying...' : 'Verify & Continue'}</span>
        </button>
        <button type="button" disabled={isLoading} className="text-on-surface-variant hover:text-on-surface font-label-mono-bold text-[10px] uppercase underline underline-offset-4" onClick={async () => {
          setIsLoading(true);
          try {
            const res = await fetch('/api/customer/resend-verification', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to resend');
            alert('Verification code resent to ' + email);
          } catch(err) {
            setError(err.message);
          } finally {
            setIsLoading(false);
          }
        }}>
          Resend Verification Code
        </button>
      </div>
    </form>
  )}
  </div></div></div>
  {showSuccessPopup && (
    <Modal label="Registration Complete" onClose={() => navigate('/login' + authQuery)} className="bg-surface border border-surface-container-high p-8 shadow-xl max-w-sm w-full mx-auto backdrop:bg-surface/80 backdrop:backdrop-blur-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-on-surface"></div>
      <div className="text-center flex flex-col gap-space-sm pt-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-2">
          <span className="material-symbols-outlined text-[24px]">check</span>
        </div>
        <h2 className="font-headline-sm text-headline-sm uppercase text-on-surface tracking-tighter">Registration Complete</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Your archive access has been granted. Please authenticate to continue.</p>
        <button className="w-full bg-on-surface text-surface hover:bg-inverse-surface font-label-mono-bold text-label-mono-bold uppercase py-space-md px-space-lg mt-space-md transition-colors flex items-center justify-center gap-2" onClick={() => navigate('/login' + authQuery)}>
          <span>Authenticate</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </Modal>
  )}
</main>
    </>
  );
}
