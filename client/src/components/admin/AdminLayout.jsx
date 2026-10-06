import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';

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

  if (auth === 'loading') return <div className="p-8 text-gray-500">Loading...</div>;

  if (auth === 'no') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ background: 'var(--lime)' }}></div>
            Kitverse Admin
          </h2>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm font-medium">{error}</div>}
          <form onSubmit={login} className="flex flex-col gap-4">
            <input aria-label="Email Address" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-black transition-all" />
            <input aria-label="Password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-black transition-all" />
            <button type="submit" className="p-3 font-bold rounded mt-2 transition-transform hover:scale-[1.02]" style={{ backgroundColor: 'var(--lime)', color: '#000' }}>Log In</button>
          </form>
        </div>
      </div>
    );
  }

  const linkClass = ({isActive}) => 
    `px-4 py-2 rounded font-medium transition-colors ${isActive ? 'bg-white shadow-sm border border-gray-200 text-black font-bold' : 'text-gray-700 hover:bg-gray-200 hover:text-black'}`;

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans bg-gray-50">
      <aside className="w-full md:w-[260px] shrink-0 bg-gray-100 p-6 flex flex-col gap-2 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <div className="w-4 h-4 rounded-full shadow-sm" style={{ background: 'var(--lime)' }}></div>
          Kitverse Admin
        </h2>
        <NavLink end className={linkClass} to="/admin">Dashboard</NavLink>
        <NavLink end className={linkClass} to="/admin/products">Products</NavLink>
        <NavLink end className={linkClass} to="/admin/inventory">Inventory</NavLink>
        <NavLink end className={linkClass} to="/admin/orders">Orders</NavLink>
        <NavLink end className={linkClass} to="/admin/customers">Customers</NavLink>
        <NavLink end className={linkClass} to="/admin/content">Content</NavLink>
        <NavLink end className={linkClass} to="/admin/discounts">Discounts</NavLink>
        <NavLink end className={linkClass} to="/admin/reviews">Reviews</NavLink>
        <NavLink end className={linkClass} to="/admin/reports">Reports</NavLink>
        
        <div style={{ flex: 1 }} />
        
        <div className="mt-8 pt-4 border-t border-gray-200 flex flex-col gap-2">
          <a href="/" target="_blank" className="px-4 py-2 rounded font-medium text-gray-500 hover:text-black hover:bg-gray-200 transition-colors">View Storefront ↗</a>
          <button onClick={logout} className="text-left px-4 py-2 rounded font-medium text-red-600 hover:bg-red-50 transition-colors">Logout</button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
