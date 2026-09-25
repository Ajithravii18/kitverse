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

const collections = [['all','All products'], ['club','Club teams'], ['national','National teams']];

function Icon({name}) {
  return <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name==='bag'?<><path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 7V6a4 4 0 0 1 8 0v1"/></>:
     name==='menu'?<><path d="M4 7h16M4 12h16M4 17h16"/></>:
     name==='chevron-left'?<><path d="m15 18-6-6 6-6"/></>:
     name==='chevron-right'?<><path d="m9 18 6-6-6-6"/></>:
     <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>}
  </svg>;
}

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [bag, setBag] = useState(false);
  const [menu, setMenu] = useState(false);
  const [info, setInfo] = useState(null);
  const [toast, setToast] = useState('');
  const [authCustomer, setAuthCustomer] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { cart, setCart, storageWarning } = useBag();

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
      
    fetch('/api/customer/me')
      .then(r => r.json())
      .then(d => setAuthCustomer(d.authenticated))
      .catch(() => setAuthCustomer(false));
  }, []);

  const filters = { type, category, quality, retro, sort };
  const filteredProducts = selectProducts(products, filters);
  const { items, totalPages, page: currentPage } = paginate(filteredProducts, page, 16);

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

  const browse = (val) => updateFilter('category', val);
  const clearFilters = () => setParams(new URLSearchParams());

  return (
    <>
      <header className="site-header">
        <div className="nav-main">
          <button className="icon-button mobile-menu" aria-label="Open navigation" aria-expanded={menu} onClick={()=>setMenu(true)}><Icon name="menu"/></button>
          <Link to="/" className="logo" aria-label="KITVERSE home" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            KITVERSE
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            <Link to="/">Home</Link>
            {collections.map(([value,label])=><button key={value} className={category===value?'current':''} onClick={()=>browse(value)} aria-current={category===value?'page':undefined}>{label}</button>)}
            <Link to="/shop" className="current">Shop All</Link>
          </nav>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: 'auto' }}>
            {authCustomer ? (
              <Link to="/profile" style={{ textDecoration: 'none', color: '#000', fontSize: '13px', fontWeight: 'bold' }}>Profile</Link>
            ) : (
              <Link to="/auth" style={{ textDecoration: 'none', color: '#000', fontSize: '13px', fontWeight: 'bold' }}>Sign In</Link>
            )}
            <button className="bag" onClick={()=>setBag(true)} aria-label={`Shopping bag, ${cart.reduce((n,x)=>n+x.qty,0)} items`}>
              <Icon name="bag"/><span className="bag-label">Bag</span><span className="bag-count">{cart.reduce((n,x)=>n+x.qty,0)}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="shop-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', margin: '0 auto', maxWidth: '1440px' }}>
        {/* Desktop Sidebar */}
        <aside className="shop-sidebar" style={{ width: '280px', padding: '60px 40px', borderRight: '1px solid var(--border)' }}>
          <div style={{ position: 'sticky', top: '100px' }}>
            
            <div style={{ marginBottom: '50px' }}>
              <div className="eyebrow" style={{ marginBottom: '20px', color: '#888' }}>Product Type</div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-start' }}>
                {[
                  { label: 'All Products', val: 'all' },
                  { label: 'Jerseys', val: 'jersey' },
                  { label: 'Shorts', val: 'shorts' },
                  { label: 'Track Pants', val: 'track-pants' },
                  { label: 'Collar T-Shirts', val: 'collar-tshirt' }
                ].map(t => (
                  <button key={t.val} onClick={() => updateFilter('type', t.val)} style={{ background: 'none', border: 'none', color: type === t.val ? 'var(--lime)' : 'var(--text)', fontWeight: type === t.val ? '700' : '400', cursor: 'pointer', padding: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t.label}
                  </button>
                ))}
              </nav>
            </div>

            <div style={{ marginBottom: '50px' }}>
              <div className="eyebrow" style={{ marginBottom: '20px', color: '#888' }}>Team Category</div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-start' }}>
                {[{ label: 'All', val: 'all' }, { label: 'Club', val: 'club' }, { label: 'National', val: 'national' }].map(t => (
                  <button key={t.val} onClick={() => updateFilter('category', t.val)} style={{ background: 'none', border: 'none', color: category === t.val ? 'var(--lime)' : 'var(--text)', fontWeight: category === t.val ? '700' : '400', cursor: 'pointer', padding: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t.label}
                  </button>
                ))}
              </nav>
            </div>

            <div style={{ marginBottom: '50px' }}>
              <div className="eyebrow" style={{ marginBottom: '20px', color: '#888' }}>Quality Tier</div>
              <select className="select-dark" value={quality} onChange={e => updateFilter('quality', e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', color: '#fff', border: '1px solid #333', borderRadius: '4px' }}>
                <option value="All qualities">All Qualities</option>
                {qualities.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
            
            <div style={{ marginBottom: '50px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: retro ? 'var(--lime)' : 'var(--text)', fontWeight: retro ? '700' : '400' }}>
                <input type="checkbox" checked={retro} onChange={e => updateFilter('retro', e.target.checked)} style={{ accentColor: 'var(--lime)', width: '16px', height: '16px' }} /> 
                Retro Styles
              </label>
            </div>

            <button onClick={clearFilters} style={{ background: 'transparent', border: '1px solid #333', color: '#888', padding: '10px 20px', width: '100%', cursor: 'pointer', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>Clear Filters</button>
          </div>
        </aside>

        <main style={{ flex: 1, padding: '40px 5%' }}>
          <div className="shop-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div className="eyebrow">THE CATALOGUE</div>
              <h1 style={{ fontSize: '42px', margin: 0, lineHeight: 1 }}>{type === 'all' ? 'All Products' : type.replace('-', ' ').toUpperCase()}</h1>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888' }}>{filteredProducts.length} results</span>
              <button className="mobile-filter-btn" onClick={() => setMobileFilterOpen(true)} style={{ padding: '8px 15px', background: 'var(--lime)', color: '#000', border: 'none', fontWeight: 'bold' }}>Filters</button>
              <div className="desktop-sort">
                <select value={sort} onChange={e => updateFilter('sort', e.target.value)} style={{ padding: '8px 12px', background: 'transparent', color: 'var(--text)', border: '1px solid #333', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>
                  <option value="featured">Featured</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <p className="eyebrow">Loading catalogue...</p>
          ) : items.length > 0 ? (
            <div className="bestsellers-grid">
              {items.map((p, i) => <ProductCard key={p.slug} p={p} pIdx={i} onOpen={setSelected} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '100px 20px', border: '1px dashed #333' }}>
              <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>No products found</h3>
              <p style={{ color: '#888' }}>Try clearing some filters to see more results.</p>
              <button onClick={clearFilters} className="primary" style={{ marginTop: '30px', padding: '15px 30px' }}>Clear all filters</button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination" style={{display:'flex',justifyContent:'center',gap:'20px',marginTop:'80px',alignItems:'center'}}>
              <button className="primary" style={{minHeight:'44px',padding:'0 20px',background:currentPage===1?'#333':'var(--lime)',color:currentPage===1?'#888':'#000'}} disabled={currentPage === 1} onClick={() => {updateFilter('page', currentPage - 1); window.scrollTo({top:0,behavior:'smooth'})}}>Previous</button>
              <span style={{fontSize:'14px',fontWeight:'600',letterSpacing:'0.05em',textTransform:'uppercase'}}>Page {currentPage} of {totalPages}</span>
              <button className="primary" style={{minHeight:'44px',padding:'0 20px',background:currentPage===totalPages?'#333':'var(--lime)',color:currentPage===totalPages?'#888':'#000'}} disabled={currentPage === totalPages} onClick={() => {updateFilter('page', currentPage + 1); window.scrollTo({top:0,behavior:'smooth'})}}>Next</button>
            </div>
          )}
        </main>
      </div>

      <footer className="site-footer reveal">
        <div className="footer-top">
          <div className="footer-brand">
            <Link className="logo" to="/">KITVERSE</Link>
            <p>Explore club and national team jerseys. Club loyalty. National pride. One love for the game.</p>
            <div className="footer-socials">
              <a href="#" className="social-pill" aria-label="Instagram">IG</a>
              <a href="#" className="social-pill" aria-label="Twitter">X</a>
              <a href="#" className="social-pill" aria-label="Facebook">FB</a>
            </div>
          </div>
          <div className="footer-links-group">
            <h4>Shop</h4>
            <nav>
              <Link to="/shop">All Products</Link>
              <Link to="/shop?category=club">Club Teams</Link>
              <Link to="/shop?category=national">National Teams</Link>
              <Link to="/#qualities">Quality Guide</Link>
            </nav>
          </div>
          <div className="footer-links-group">
            <h4>Quality Tiers</h4>
            <nav>
              {qualities.map(q=><Link key={q} to={`/shop?quality=${encodeURIComponent(q)}`}>{q}</Link>)}
            </nav>
          </div>
          <div className="footer-links-group">
            <h4>Info</h4>
            <nav>
              <button type="button" onClick={() => setInfo('Sizing Guide')}>Sizing Guide</button>
              <button type="button" onClick={() => setInfo('Shipping & Returns')}>Shipping & Returns</button>
              <button type="button" onClick={() => setInfo('Contact Us')}>Contact Us</button>
              <button type="button" onClick={() => setInfo('About KITVERSE')}>About KITVERSE</button>
            </nav>
          </div>
        </div>
        <div className="footer-slogan">
          <h2>FIND YOUR COLOURS.</h2>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span>© 2026 KITVERSE. All rights reserved.</span>
            <span className="footer-disclaimer">Concept storefront • Images illustrative • No official club affiliation claimed.</span>
          </div>
          <div className="footer-bottom-badges">
            <span className="payment-badge">VISA</span>
            <span className="payment-badge">MASTERCARD</span>
            <span className="payment-badge">UPI</span>
          </div>
        </div>
      </footer>

      {mobileFilterOpen && (
        <Modal label="Filters" onClose={() => setMobileFilterOpen(false)} className="menu-dialog">
          <div style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '30px' }}>Filters & Sort</h2>
            
            <div className="eyebrow" style={{ marginTop: '20px', marginBottom: '10px' }}>Sort By</div>
            <select value={sort} onChange={e => updateFilter('sort', e.target.value)} style={{ width: '100%', padding: '15px', background: '#111', color: '#fff', border: '1px solid #333' }}>
              <option value="featured">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>

            <div className="eyebrow" style={{ marginTop: '40px', marginBottom: '15px' }}>Product Type</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {[
                { label: 'All', val: 'all' },
                { label: 'Jerseys', val: 'jersey' },
                { label: 'Shorts', val: 'shorts' },
                { label: 'Track Pants', val: 'track-pants' },
                { label: 'Collar T-Shirts', val: 'collar-tshirt' }
              ].map(t => (
                <label key={t.val} style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <input type="radio" checked={type === t.val} onChange={() => updateFilter('type', t.val)} style={{ width: '20px', height: '20px', accentColor: 'var(--lime)' }} /> {t.label}
                </label>
              ))}
            </div>

            <div className="eyebrow" style={{ marginTop: '40px', marginBottom: '15px' }}>Category</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {[{ label: 'All', val: 'all' }, { label: 'Club', val: 'club' }, { label: 'National', val: 'national' }].map(t => (
                <label key={t.val} style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <input type="radio" checked={category === t.val} onChange={() => updateFilter('category', t.val)} style={{ width: '20px', height: '20px', accentColor: 'var(--lime)' }} /> {t.label}
                </label>
              ))}
            </div>

            <div className="eyebrow" style={{ marginTop: '40px', marginBottom: '10px' }}>Quality</div>
            <select value={quality} onChange={e => updateFilter('quality', e.target.value)} style={{ width: '100%', padding: '15px', background: '#111', color: '#fff', border: '1px solid #333' }}>
              <option value="All qualities">All Qualities</option>
              {qualities.map(q => <option key={q} value={q}>{q}</option>)}
            </select>

            <div style={{ marginTop: '40px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '15px', fontWeight: 'bold', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', color: retro ? 'var(--lime)' : '#fff' }}>
                <input type="checkbox" checked={retro} onChange={e => updateFilter('retro', e.target.checked)} style={{ width: '20px', height: '20px', accentColor: 'var(--lime)' }} /> Retro Styles
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '50px' }}>
              <button onClick={() => setMobileFilterOpen(false)} style={{ flex: 1, padding: '15px', background: 'var(--lime)', color: '#000', border: 'none', fontWeight: 'bold', textTransform: 'uppercase' }}>Apply</button>
              <button onClick={clearFilters} style={{ flex: 1, padding: '15px', background: 'transparent', color: '#fff', border: '1px solid #333', textTransform: 'uppercase' }}>Clear</button>
            </div>
          </div>
        </Modal>
      )}

      {menu && (
        <Modal label="Main navigation" className="menu-dialog" onClose={()=>setMenu(false)}>
          <Link to="/" className="logo" onClick={()=>setMenu(false)}>KITVERSE</Link>
          <p className="eyebrow">FIND YOUR COLOURS</p>
          <nav className="menu-links" aria-label="Mobile navigation">
            <Link to="/" onClick={()=>setMenu(false)}>Home<span>↗</span></Link>
            <Link to="/shop" onClick={()=>setMenu(false)}>Shop All<span>↗</span></Link>
            {collections.map(([value,label])=><button key={value} onClick={()=>{browse(value);setMenu(false);}}>{label}<span>↗</span></button>)}
            <a href="/#qualities" onClick={()=>setMenu(false)}>Quality guide<span>↗</span></a>
          </nav>
          <p className="detail-note">Club loyalty. National pride.<br/>One love for the game.</p>
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

      {info && (
        <Modal label={info} onClose={() => setInfo(null)}>
          <h2>{info}</h2>
          <p>{
            info === 'Sizing Guide' ? 'Measure a well-fitting shirt across the chest and from shoulder to hem. Product-specific measurements will be published before ordering opens.' :
            info === 'Shipping & Returns' ? 'Orders are not open yet. Delivery areas, shipping charges and return terms will be published before checkout is enabled.' :
            info === 'Contact Us' ? 'Customer support contact details have not been published yet. This preview does not accept orders or payments.' :
            'KITVERSE is a football jersey storefront in development. Browse the collection and build a bag while the store is being prepared. No official club affiliation is claimed.'
          }</p>
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
          .shop-sidebar { display: none !important; }
        }
        select option {
          background: #111;
          color: #fff;
        }
        .select-dark:focus {
          outline: 1px solid var(--lime);
        }
      `}} />
    </>
  );
}
