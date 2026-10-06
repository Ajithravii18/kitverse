import fs from 'fs';
let content = fs.readFileSync('client/src/components/admin/AdminLayout.jsx', 'utf8');

const oldReturn = `  return (
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
  );`;

const newReturn = `  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans">
      <aside className="w-full md:w-[250px] bg-neutral-50 p-5 flex flex-col gap-3 flex-shrink-0">
        <h2 className="m-0 mb-5 text-xl font-bold">Kitverse Admin</h2>
        <Link to="/admin/products" className="no-underline text-black hover:underline">Products</Link>
        <Link to="/admin/orders" className="no-underline text-black hover:underline">Orders</Link>
        <div className="flex-1 min-h-[50px]" />
        <button onClick={logout} className="p-3 bg-neutral-200 border-none cursor-pointer hover:bg-neutral-300 transition-colors">Logout</button>
      </aside>
      <main className="flex-1 p-5 md:p-8 min-w-0">
        <Outlet />
      </main>
    </div>
  );`;

content = content.replace(oldReturn, newReturn);
fs.writeFileSync('client/src/components/admin/AdminLayout.jsx', content);
console.log('Fixed AdminLayout');
