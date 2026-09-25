import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import '../style.css';
import '../animations.css';
import { ProductCard } from '../components/shop/ProductCard.jsx';
import ProductDetailModal from '../components/ProductDetailModal.jsx';
import Modal from '../components/Modal.jsx';
import useBag from '../useBag.js';
import useScrollReveal from '../useScrollReveal.js';
import { money } from '../format.js';
import { qualities, sizes } from '../../../shared/catalog.js';
import { selectProducts, paginate } from '../../../shared/storefront.js';
import { addItem, stockFor } from '../../../shared/inventory.js';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [bag, setBag] = useState(false);
  const [toast, setToast] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { cart, setCart } = useBag();

  const type = params.get('type') || 'all';
  const category = params.get('category') || 'all';
  const quality = params.get('quality') || 'All qualities';
  const retro = params.get('retro') === 'true' ? true : false;
  const sort = params.get('sort') || 'featured';
  const page = parseInt(params.get('page')) || 1;

  useScrollReveal([products.length, page, type, category, quality, retro, sort]);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filters = { type, category, quality, retro, sort };
  const filteredProducts = selectProducts(products, filters);
  const { items, totalPages, page: currentPage } = paginate(filteredProducts, page, 12);

  const updateFilter = (key, value) => {
    const p = new URLSearchParams(params);
    if (value === 'all' || value === 'All qualities' || value === false) {
      p.delete(key);
    } else {
      p.set(key, value);
    }
    p.set('page', '1');
    setParams(p);
  };

  const clearFilters = () => setParams(new URLSearchParams());

  return (
    <>
      <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 10, background: '#000', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="logo" style={{ color: '#fff', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>KITVERSE</Link>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/shop" style={{ color: 'var(--lime)', textDecoration: 'none', fontWeight: 'bold' }}>Shop All</Link>
          <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => setBag(true)}>Bag ({cart.reduce((a,c)=>a+c.qty,0)})</button>
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: '100vh', background: '#fff', color: '#000' }}>
        {/* Desktop Sidebar */}
        <aside className="shop-sidebar" style={{ width: '250px', padding: '30px 20px', borderRight: '1px solid #eaeaea', display: 'none' }}>
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', marginBottom: '15px' }}>Product Type</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'All', val: 'all' },
                { label: 'Jerseys', val: 'jersey' },
                { label: 'Shorts', val: 'shorts' },
                { label: 'Track Pants', val: 'track-pants' },
                { label: 'Collar T-Shirts', val: 'collar-tshirt' }
              ].map(t => (
                <label key={t.val} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="radio" checked={type === t.val} onChange={() => updateFilter('type', t.val)} /> {t.label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', marginBottom: '15px' }}>Team Category</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[{ label: 'All', val: 'all' }, { label: 'Club', val: 'club' }, { label: 'National', val: 'national' }].map(t => (
                <label key={t.val} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="radio" checked={category === t.val} onChange={() => updateFilter('category', t.val)} /> {t.label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', marginBottom: '15px' }}>Quality Tier</h3>
            <select value={quality} onChange={e => updateFilter('quality', e.target.value)} style={{ width: '100%', padding: '8px' }}>
              <option value="All qualities">All Qualities</option>
              {qualities.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
              <input type="checkbox" checked={retro} onChange={e => updateFilter('retro', e.target.checked)} /> Retro Styles
            </label>
          </div>

          <button onClick={clearFilters} style={{ width: '100%', padding: '10px', background: '#f5f5f5', border: '1px solid #ddd', cursor: 'pointer' }}>Clear Filters</button>
        </aside>

        <main style={{ flex: 1, padding: '30px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '32px', margin: 0 }}>All Products</h1>
            <button className="mobile-filter-btn" onClick={() => setMobileFilterOpen(true)} style={{ padding: '8px 15px', background: '#000', color: '#fff', border: 'none' }}>Filters</button>
            <div className="desktop-sort">
              <select value={sort} onChange={e => updateFilter('sort', e.target.value)} style={{ padding: '8px', border: '1px solid #ddd' }}>
                <option value="featured">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <p style={{ marginBottom: '30px', color: '#666' }}>Showing {filteredProducts.length} results</p>

          {loading ? (
            <p>Loading catalogue...</p>
          ) : items.length > 0 ? (
            <div className="bestsellers-grid" style={{ gap: '20px' }}>
              {items.map((p, i) => <ProductCard key={p.slug} p={p} pIdx={i} onOpen={setSelected} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9f9f9', border: '1px dashed #ccc' }}>
              <h3>No products found</h3>
              <p>Try clearing some filters.</p>
              <button onClick={clearFilters} style={{ marginTop: '20px', padding: '10px 20px', background: 'var(--lime)', border: 'none', fontWeight: 'bold' }}>Clear all filters</button>
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '40px', alignItems: 'center' }}>
              <button disabled={currentPage === 1} onClick={() => updateFilter('page', currentPage - 1)} style={{ padding: '10px 20px' }}>Prev</button>
              <span>Page {currentPage} of {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => updateFilter('page', currentPage + 1)} style={{ padding: '10px 20px' }}>Next</button>
            </div>
          )}
        </main>
      </div>

      {mobileFilterOpen && (
        <Modal label="Filters" onClose={() => setMobileFilterOpen(false)}>
          <div style={{ padding: '10px' }}>
            <h2>Filters & Sort</h2>
            
            <h3 style={{ marginTop: '20px' }}>Sort By</h3>
            <select value={sort} onChange={e => updateFilter('sort', e.target.value)} style={{ width: '100%', padding: '10px' }}>
              <option value="featured">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>

            <h3 style={{ marginTop: '20px' }}>Product Type</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'All', val: 'all' },
                { label: 'Jerseys', val: 'jersey' },
                { label: 'Shorts', val: 'shorts' },
                { label: 'Track Pants', val: 'track-pants' },
                { label: 'Collar T-Shirts', val: 'collar-tshirt' }
              ].map(t => (
                <label key={t.val} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="radio" checked={type === t.val} onChange={() => updateFilter('type', t.val)} /> {t.label}
                </label>
              ))}
            </div>

            <h3 style={{ marginTop: '20px' }}>Category</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[{ label: 'All', val: 'all' }, { label: 'Club', val: 'club' }, { label: 'National', val: 'national' }].map(t => (
                <label key={t.val} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="radio" checked={category === t.val} onChange={() => updateFilter('category', t.val)} /> {t.label}
                </label>
              ))}
            </div>

            <h3 style={{ marginTop: '20px' }}>Quality</h3>
            <select value={quality} onChange={e => updateFilter('quality', e.target.value)} style={{ width: '100%', padding: '10px' }}>
              <option value="All qualities">All Qualities</option>
              {qualities.map(q => <option key={q} value={q}>{q}</option>)}
            </select>

            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                <input type="checkbox" checked={retro} onChange={e => updateFilter('retro', e.target.checked)} /> Retro Styles
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
              <button onClick={() => setMobileFilterOpen(false)} style={{ flex: 1, padding: '15px', background: 'var(--lime)', border: 'none', fontWeight: 'bold' }}>Apply</button>
              <button onClick={clearFilters} style={{ flex: 1, padding: '15px', background: '#ddd', border: 'none' }}>Clear</button>
            </div>
          </div>
        </Modal>
      )}

      {selected && (
        <ProductDetailModal
          key={selected.slug}
          product={selected}
          products={products}
          onSelectRelated={setSelected}
          onClose={() => setSelected(null)}
          onAdd={(prod, chosenSize) => {
            setCart(addItem(cart, prod, chosenSize));
            setSelected(null);
            setToast('Added to your matchday bag');
          }}
          cart={cart}
          demo={false}
        />
      )}

      {bag && (
        <Modal label="Shopping bag" onClose={() => setBag(false)}>
          <h2>Your matchday bag.</h2>
          {cart.length ? cart.map(x => (
            <div className="cart-row" key={x.key}>
              <div>
                <p>{x.name}</p>
                <small>{x.quality || x.productType} · {x.size}</small>
                <p>{money(x.price * x.qty)}</p>
              </div>
            </div>
          )) : <p>Your bag is waiting for its first item.</p>}
          {cart.length > 0 && <div className="total"><span>Subtotal</span><span>{money(cart.reduce((n,x)=>n+x.price*x.qty,0))}</span></div>}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <Link to="/checkout" className="primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '15px' }}>Checkout</Link>
            <button className="secondary" style={{ flex: 1 }} onClick={() => setBag(false)}>Keep exploring</button>
          </div>
        </Modal>
      )}

      {toast && <div id="toast" style={{ display: 'block' }} role="status">{toast}</div>}
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) {
          .shop-sidebar { display: block !important; }
          .mobile-filter-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-sort { display: none !important; }
        }
      `}} />
    </>
  );
}
