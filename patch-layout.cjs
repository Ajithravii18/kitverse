const fs = require('fs');
let code = fs.readFileSync('client/src/components/admin/AdminLayout.jsx', 'utf8');

// Update login screen
const loginScreenOld = `
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', fontFamily: 'sans-serif' }}>
        <h2>Admin Login</h2>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '10px' }} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '10px' }} />
          <button type="submit" style={{ padding: '10px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>Log In</button>
        </form>
      </div>`;

const loginScreenNew = `
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-center">Kitverse Admin</h2>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
          <form onSubmit={login} className="flex flex-col gap-4">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="p-3 border rounded focus:outline-none focus:border-black transition-colors" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="p-3 border rounded focus:outline-none focus:border-black transition-colors" />
            <button type="submit" className="p-3 bg-black text-white font-bold rounded mt-2 hover:bg-gray-800 transition-colors" style={{ backgroundColor: 'var(--lime)', color: '#000' }}>Log In</button>
          </form>
        </div>
      </div>`;
code = code.replace(loginScreenOld, loginScreenNew);

// Update layout
const layoutOld = `
  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans">
      <aside className="w-full md:w-[250px] shrink-0 bg-gray-100 p-5 flex flex-col gap-3">
        <h2 style={{ margin: '0 0 20px 0' }}>Kitverse Admin</h2>
        <Link to="/admin" style={{ textDecoration: 'none', color: '#000' }}>Dashboard</Link>
        <Link to="/admin/products" style={{ textDecoration: 'none', color: '#000' }}>Products</Link>
        <Link to="/admin/inventory" style={{ textDecoration: 'none', color: '#000' }}>Inventory</Link>
        <Link to="/admin/orders" style={{ textDecoration: 'none', color: '#000' }}>Orders</Link>
        <Link to="/admin/customers" style={{ textDecoration: 'none', color: '#000' }}>Customers</Link>
        <Link to="/admin/content" style={{ textDecoration: 'none', color: '#000' }}>Content</Link>
        <Link to="/admin/discounts" style={{ textDecoration: 'none', color: '#000' }}>Discounts</Link>
        <Link to="/admin/reviews" style={{ textDecoration: 'none', color: '#000' }}>Reviews</Link>
        <Link to="/admin/reports" style={{ textDecoration: 'none', color: '#000' }}>Reports</Link>
        <div style={{ flex: 1 }} />
        <button onClick={logout} style={{ padding: '10px', background: '#ddd', border: 'none', cursor: 'pointer' }}>Logout</button>
      </aside>
      <main className="flex-1 min-w-0 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
`;

const linkClasses = "px-4 py-2 rounded font-medium text-gray-700 hover:bg-gray-200 hover:text-black transition-colors";
const activeLinkClasses = "px-4 py-2 rounded font-bold text-black bg-white shadow-sm border border-gray-200";

const layoutNew = `
  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans bg-gray-50">
      <aside className="w-full md:w-[260px] shrink-0 bg-gray-100 p-6 flex flex-col gap-2 border-r">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ background: 'var(--lime)' }}></div>
          Kitverse Admin
        </h2>
        <Link to="/admin" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-gray-200 transition-colors">Dashboard</Link>
        <Link to="/admin/products" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-gray-200 transition-colors">Products</Link>
        <Link to="/admin/inventory" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-gray-200 transition-colors">Inventory</Link>
        <Link to="/admin/orders" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-gray-200 transition-colors">Orders</Link>
        <Link to="/admin/customers" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-gray-200 transition-colors">Customers</Link>
        <Link to="/admin/content" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-gray-200 transition-colors">Content</Link>
        <Link to="/admin/discounts" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-gray-200 transition-colors">Discounts</Link>
        <Link to="/admin/reviews" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-gray-200 transition-colors">Reviews</Link>
        <Link to="/admin/reports" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-gray-200 transition-colors">Reports</Link>
        
        <div style={{ flex: 1 }} />
        
        <div className="mt-8 pt-4 border-t border-gray-200">
          <a href="/" target="_blank" className="block px-4 py-2 rounded font-medium text-gray-500 hover:text-black hover:bg-gray-200 mb-2 transition-colors">View Storefront ↗</a>
          <button onClick={logout} className="w-full text-left px-4 py-2 rounded font-medium text-red-600 hover:bg-red-50 transition-colors">Logout</button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 p-4 md:p-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
`;
code = code.replace(layoutOld, layoutNew);

// Add NavLink support to mark active state
code = code.replace(/import \{ Outlet, useNavigate, Link \} from 'react-router-dom';/, "import { Outlet, useNavigate, NavLink } from 'react-router-dom';");
code = code.replace(/<Link to=/g, "<NavLink end className={({isActive}) => `px-4 py-2 rounded font-medium transition-colors ${isActive ? 'bg-white shadow-sm border border-gray-200 text-black font-bold' : 'text-gray-700 hover:bg-gray-200'}`} to=");
code = code.replace(/<\/Link>/g, "</NavLink>");
code = code.replace(/className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-gray-200 transition-colors"/g, "");

fs.writeFileSync('client/src/components/admin/AdminLayout.jsx', code);
