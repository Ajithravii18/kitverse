import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../api.js';

export default function Auth() {
  const [mode, setMode] = useState('login'); // login, register, verify, forgot, reset
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirect = searchParams.get('redirect') || '/';

  async function submit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      let endpoint = '';
      let body = {};

      if (mode === 'login') {
        endpoint = '/api/customer/login';
        body = { email, password };
      } else if (mode === 'register') {
        endpoint = '/api/customer/register';
        body = { email, username, password };
      } else if (mode === 'verify') {
        endpoint = '/api/customer/verify';
        body = { email, otp };
      } else if (mode === 'forgot') {
        endpoint = '/api/customer/forgot-password';
        body = { email };
      } else if (mode === 'reset') {
        endpoint = '/api/customer/reset-password';
        body = { email, otp, newPassword: password };
      }

      const data = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(body)
      });

      if (mode === 'login' || mode === 'verify') {
        window.location.href = redirect; // Force full reload to update nav state
      } else if (mode === 'register') {
        setMessage(data.message);
        setMode('verify');
      } else if (mode === 'forgot') {
        setMessage(data.message);
        setMode('reset');
      } else if (mode === 'reset') {
        setMessage(data.message);
        setMode('login');
      }
    } catch (err) {
      if (err.status === 403 && err.message.includes('verified')) {
        setMode('verify');
        setError('Please verify your account first. Request a new OTP if needed.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const containerStyle = { maxWidth: '400px', margin: '60px auto', padding: '30px', fontFamily: 'sans-serif', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
  const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
  const btnStyle = { width: '100%', padding: '12px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {mode === 'login' && 'Sign In'}
        {mode === 'register' && 'Create Account'}
        {mode === 'verify' && 'Verify Email'}
        {mode === 'forgot' && 'Reset Password'}
        {mode === 'reset' && 'New Password'}
      </h2>

      {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}
      {message && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>{message}</div>}

      <form onSubmit={submit}>
        {(mode === 'register' || mode === 'login' || mode === 'verify' || mode === 'forgot' || mode === 'reset') && (
          <input required type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} disabled={mode === 'verify' || mode === 'reset'} />
        )}
        
        {mode === 'register' && (
          <input required type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} />
        )}

        {(mode === 'login' || mode === 'register' || mode === 'reset') && (
          <input required type="password" placeholder={mode === 'reset' ? "New Password" : "Password"} value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
        )}

        {(mode === 'verify' || mode === 'reset') && (
          <input required type="text" placeholder="6-Digit OTP" value={otp} onChange={e => setOtp(e.target.value)} style={inputStyle} maxLength="6" />
        )}

        <button type="submit" disabled={loading} style={{...btnStyle, opacity: loading ? 0.7 : 1}}>
          {loading ? 'Processing...' : 'Continue'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        {mode === 'login' && (
          <>
            <a href="#" onClick={(e) => { e.preventDefault(); setMode('forgot'); setError(''); setMessage(''); }} style={{ color: '#666', textDecoration: 'none', display: 'block', marginBottom: '10px' }}>Forgot password?</a>
            <span style={{ color: '#666' }}>Don't have an account? </span>
            <a href="#" onClick={(e) => { e.preventDefault(); setMode('register'); setError(''); setMessage(''); }} style={{ color: '#000', fontWeight: 'bold' }}>Register</a>
          </>
        )}
        {mode === 'register' && (
          <>
            <span style={{ color: '#666' }}>Already have an account? </span>
            <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); setError(''); setMessage(''); }} style={{ color: '#000', fontWeight: 'bold' }}>Sign In</a>
          </>
        )}
        {(mode === 'verify' || mode === 'forgot' || mode === 'reset') && (
          <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); setError(''); setMessage(''); }} style={{ color: '#000', fontWeight: 'bold' }}>Back to Sign In</a>
        )}
      </div>
    </div>
  );
}
