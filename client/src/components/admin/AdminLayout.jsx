import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';

export default function AdminLayout() {
  const [auth, setAuth] = useState('loading');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/admin/me')
      .then(r => r.json())
      .then(data => setAuth(data.authenticated ? 'yes' : 'no'))
      .catch(() => setAuth('no'));
  }, []);

  async function login(e) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setAuth('yes');
    } else {
      setError(data.error || 'Login failed');
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuth('no');
    navigate('/admin');
  }

  if (auth === 'loading') return <div>Loading...</div>;

  if (auth === 'no') {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', fontFamily: 'sans-serif' }}>
        <h2>Admin Login</h2>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '10px' }} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '10px' }} />
          <button type="submit" style={{ padding: '10px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>Log In</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '250px', background: '#f5f5f5', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2 style={{ margin: '0 0 20px 0' }}>Kitverse Admin</h2>
        <Link to="/admin/products" style={{ textDecoration: 'none', color: '#000' }}>Products</Link>
        <Link to="/admin/orders" style={{ textDecoration: 'none', color: '#000' }}>Orders</Link>
        <div style={{ flex: 1 }} />
        <button onClick={logout} style={{ padding: '10px', background: '#ddd', border: 'none', cursor: 'pointer' }}>Logout</button>
      </aside>
      <main style={{ flex: 1, padding: '30px' }}>
        <Outlet />
      </main>
    </div>
  );
}
