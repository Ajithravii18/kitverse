import React, { useState, useEffect } from 'react';

const QUALITIES = ['Embroidery', 'First copy + shorts', 'Master copy', 'Player version'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');


  async function loadProducts() {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/products');
      const data = await r.json();
      if(!r.ok)throw new Error(data.error || 'Could not load products.');
      setProducts(data.products || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProducts(); }, []);

  function handleEdit(product) {
    const images = product?.images?.length === 3 ? product.images : [
      { url: product?.images?.[0]?.url || product?.image || '', label: 'Front view' },
      { url: product?.images?.[1]?.url || '', label: 'Back view' },
      { url: product?.images?.[2]?.url || '', label: 'Detail (Crest/Quality)' }
    ];

    setEditing(product ? { ...product, price: product.price / 100, images } : {
      name: '', slug: '', team: '', category: 'club', quality: 'Embroidery', price: 0,
      image: '', images, season: '', featured: false, published: true,
      stock: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 }
    });
    setError('');
  }

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    
    // Convert price back to minor units and ensure image field acts as main fallback
    const validImages = editing.images.filter(img => img.url && img.url.trim() !== '');
    const payload = { 
      ...editing, 
      price: Math.round(editing.price * 100),
      image: validImages[0]?.url || '',
      images: validImages
    };
    
    if (payload.category === '') delete payload.category;
    if (payload.quality === '') delete payload.quality;
    if (payload.team === '') delete payload.team;
    
    const isNew = !products.find(p => p._id === editing._id);
    const url = isNew ? '/api/admin/products' : `/api/admin/products/${editing.slug}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save product');
      
      setEditing(null);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading && !products.length) return <div>Loading products...</div>;

  if (editing) {
    return (
      <div style={{ maxWidth: '800px', background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eaeaea' }}>
        <h2>{editing._id ? 'Edit Product' : 'Add New Product'}</h2>
        {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
        
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <label style={{ flex: 1 }}>Name <input required type="text" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} style={{ width: '100%', padding: '8px' }}/></label>
            <label style={{ flex: 1 }}>Slug (SKU) <input required type="text" value={editing.slug} disabled={!!editing._id} onChange={e => setEditing({...editing, slug: e.target.value})} style={{ width: '100%', padding: '8px' }}/></label>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <label style={{ flex: 1 }}>Team <input type="text" value={editing.team || ''} onChange={e => setEditing({...editing, team: e.target.value})} style={{ width: '100%', padding: '8px' }}/></label>
            <label style={{ flex: 1 }}>Type 
              <select value={editing.productType || 'jersey'} onChange={e => setEditing({...editing, productType: e.target.value})} style={{ width: '100%', padding: '8px' }}>
                <option value="jersey">Jersey</option>
                <option value="shorts">Shorts</option>
                <option value="track-pants">Track Pants</option>
                <option value="collar-tshirt">Collar T-Shirt</option>
              </select>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <label style={{ flex: 1 }}>Category 
              <select value={editing.category || ''} onChange={e => setEditing({...editing, category: e.target.value})} style={{ width: '100%', padding: '8px' }}>
                <option value="">None</option>
                <option value="club">Club</option>
                <option value="national">National</option>
              </select>
            </label>
            <label style={{ flex: 1 }}>Quality 
              <select value={editing.quality || ''} onChange={e => setEditing({...editing, quality: e.target.value})} style={{ width: '100%', padding: '8px' }}>
                <option value="">None</option>
                {QUALITIES.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <label style={{ flex: 1 }}>Price (INR) <input required type="number" min="0" step="1" value={editing.price} onChange={e => setEditing({...editing, price: e.target.value})} style={{ width: '100%', padding: '8px' }}/></label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '20px' }}>
              <input type="checkbox" checked={editing.retro} onChange={e => setEditing({...editing, retro: e.target.checked})} /> Retro
            </label>
          </div>

          <fieldset style={{ padding: '15px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <legend>Product Photographs</legend>
            <div style={{ display: 'flex', gap: '15px' }}>
              <label style={{ flex: 1 }}>{editing.images[0].label} <input required type="url" value={editing.images[0].url} placeholder="https://... front view" onChange={e => { const newImgs = [...editing.images]; newImgs[0].url = e.target.value; setEditing({...editing, images: newImgs}); }} style={{ width: '100%', padding: '8px', marginTop: '5px' }}/></label>
              <label style={{ flex: 1 }}>{editing.images[1].label} <input type="url" value={editing.images[1].url} placeholder="https://... back view" onChange={e => { const newImgs = [...editing.images]; newImgs[1].url = e.target.value; setEditing({...editing, images: newImgs}); }} style={{ width: '100%', padding: '8px', marginTop: '5px' }}/></label>
              <label style={{ flex: 1 }}>{editing.images[2].label} <input type="url" value={editing.images[2].url} placeholder="https://... crest/fabric details" onChange={e => { const newImgs = [...editing.images]; newImgs[2].url = e.target.value; setEditing({...editing, images: newImgs}); }} style={{ width: '100%', padding: '8px', marginTop: '5px' }}/></label>
            </div>
          </fieldset>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <label style={{ flex: 1 }}>Season <input type="text" placeholder="e.g. 26/27" value={editing.season || ''} onChange={e => setEditing({...editing, season: e.target.value})} style={{ width: '100%', padding: '8px' }}/></label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '20px' }}>
              <input type="checkbox" checked={editing.featured} onChange={e => setEditing({...editing, featured: e.target.checked})} /> Featured
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '20px' }}>
              <input type="checkbox" checked={editing.published} onChange={e => setEditing({...editing, published: e.target.checked})} /> Published
            </label>
          </div>

          <fieldset style={{ padding: '15px', border: '1px solid #ddd' }}>
            <legend>Inventory Stock</legend>
            <div style={{ display: 'flex', gap: '10px' }}>
              {SIZES.map(s => (
                <label key={s} style={{ flex: 1, textAlign: 'center' }}>
                  {s}
                  <input type="number" min="0" value={editing.stock[s] || 0} onChange={e => setEditing({...editing, stock: {...editing.stock, [s]: parseInt(e.target.value, 10) || 0}})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </label>
              ))}
            </div>
          </fieldset>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>Save Product</button>
            <button type="button" onClick={() => setEditing(null)} style={{ padding: '10px 20px', background: '#ddd', border: 'none', cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="text-2xl">Products Catalogue</h1>
        <button onClick={() => handleEdit(null)} style={{ padding: '10px 20px', background: 'var(--lime)', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>+ Add Product</button>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search products by name or SKU..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>
      {error && <p role="alert">{error} <button onClick={loadProducts}>Retry</button></p>}
      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', background: '#fafafa' }}>
              <th style={{ padding: '12px' }}>Image</th>
              <th style={{ padding: '12px' }}>Product</th>
              <th style={{ padding: '12px' }}>SKU</th>
              <th style={{ padding: '12px' }}>Price</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Stock</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter(p => (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (p.slug || '').toLowerCase().includes(searchTerm.toLowerCase()))
              .sort((a, b) => {
                if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
                if (sortBy === 'name-desc') return (b.name || '').localeCompare(a.name || '');
                if (sortBy === 'price-asc') return a.price - b.price;
                if (sortBy === 'price-desc') return b.price - a.price;
                return 0;
              })
              .map(p => (
              <tr key={p._id} style={{ borderBottom: '1px solid #eaeaea' }}>
                <td style={{ padding: '12px' }}>
                  <img src={p.image || '/images/jersey-placeholder.svg'} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'contain', background: '#f5f5f5', borderRadius: '4px' }} />
                </td>
                <td style={{ padding: '12px' }}>
                  <strong>{p.name}</strong><br/>
                  <small style={{ color: '#666' }}>{p.team} &middot; {p.quality}</small>
                </td>
                <td style={{ padding: '12px' }}><code>{p.slug}</code></td>
                <td style={{ padding: '12px' }}>₹{p.price / 100}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', background: p.published ? '#e6ffe6' : '#ffeeee', color: p.published ? '#006600' : '#cc0000', marginRight: '5px' }}>
                    {p.published ? 'Live' : 'Hidden'}
                  </span>
                  {p.featured && <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', background: '#fff3cd', color: '#856404' }}>Featured</span>}
                </td>
                <td style={{ padding: '12px' }}>
                  <small>{Object.values(p.stock || {}).reduce((a,b)=>a+b,0)} total</small>
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <button onClick={() => handleEdit(p)} style={{ padding: '6px 12px', background: '#f0f0f0', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

