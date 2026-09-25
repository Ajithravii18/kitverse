import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Link} from 'react-router-dom';
import {qualities, sizes} from '../../../shared/catalog.js';
import {addItem, changeQuantity, stockFor} from '../../../shared/inventory.js';
import '../style.css';
import '../animations.css';
import Modal from '../components/Modal.jsx';
import ProductDetailModal from '../components/ProductDetailModal.jsx';
import ProductImage from '../components/ProductImage.jsx';
import useBag from '../useBag.js';
import {money} from '../format.js';
import CategoryCircleNav from '../components/shop/CategoryCircleNav.jsx';
import { ProductCard } from '../components/shop/ProductCard.jsx';
import {selectProducts, paginate} from '../../../shared/storefront.js';
import useScrollReveal from '../useScrollReveal.js';
const collections = [['all','All jerseys'], ['club','Club teams'], ['national','National teams']];
function Icon({name}) {
  return <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name==='bag'?<><path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 7V6a4 4 0 0 1 8 0v1"/></>:
     name==='menu'?<><path d="M4 7h16M4 12h16M4 17h16"/></>:
     name==='chevron-left'?<><path d="m15 18-6-6 6-6"/></>:
     name==='chevron-right'?<><path d="m9 18 6-6-6-6"/></>:
     <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>}
  </svg>;
}
function App() {
  const [products,setProducts]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[demo,setDemo]=useState(true);
  const [filter,setFilter]=useState('All qualities'),[category,setCategory]=useState('all'),[query,setQuery]=useState(''),[sort,setSort]=useState('featured'),[page,setPage]=useState(1);
  const [selected,setSelected]=useState(null),[bag,setBag]=useState(false),[menu,setMenu]=useState(false),[toast,setToast]=useState('');
  const {cart, setCart, restore, storageWarning} = useBag();
  const [info, setInfo] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [expanded2627, setExpanded2627] = useState(false);
  const [loading2627, setLoading2627] = useState(false);
  const teamTrackRef = useRef(null);
  // Re-observe scroll targets whenever products load or page/filter changes
  useScrollReveal([products.length, page, filter, category, selectedTeam, expanded2627]);

  useEffect(() => { setPage(1); }, [category, filter, query, sort, selectedTeam]);
  const SHOP_TEAMS = [...new Map(products.filter(p => p.team).map(p => [p.team, {id: p.team, name: p.team, label: p.team.toUpperCase(), category: p.category}])).values()];

  function scrollTeams(dir) {
    if (!teamTrackRef.current) return;
    const scrollAmount = teamTrackRef.current.clientWidth * 0.75;
    teamTrackRef.current.scrollBy({
      left: dir === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }

  function handleTeamClick(team) {
    if (selectedTeam === team.name) {
      setSelectedTeam(null);
      setQuery('');
    } else {
      setSelectedTeam(team.name);
      setQuery('');
      if (team.category && category !== team.category && category !== 'all') {
        setCategory(team.category);
      }
      const shopEl = document.getElementById('shop');
      if (shopEl) {
        shopEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  const HERO_SLIDES = products.filter(p => p.featured).slice(0, 4).map(product => ({
    product, team: product.team || product.name, short: (product.team || product.name).slice(0, 3).toUpperCase(),
    label: product.name, tier: product.quality, price: money(product.price),
    accent: '#c1ff38', bgGlow: 'rgba(193, 255, 56, 0.16)', tagline: demo ? 'SAMPLE COLLECTION' : 'EXPLORE THE COLLECTION', img: product.image,
  }));
  const [heroIdx, setHeroIdx] = useState(0);
  const [authCustomer, setAuthCustomer] = useState(false);
  async function load() {setLoading(true);setError('');try{const [prodRes, authRes]=await Promise.all([fetch('/api/products').then(r=>r.ok?r.json():Promise.reject(new Error('The kit room is temporarily unavailable. Please try again.'))), fetch('/api/customer/me').then(r=>r.json()).catch(()=>({authenticated:false}))]);setProducts(prodRes.products);setDemo(prodRes.demo);setAuthCustomer(authRes.authenticated);restore(prodRes.products);setHeroIdx(0)}catch(e){setError(e.message)}finally{setLoading(false)}}
  useEffect(()=>{
    load();
    if (new URLSearchParams(window.location.search).get('success') === '1') {
      setToast('Order placed successfully!');
      window.history.replaceState({}, '', '/');
    }
  },[]);
  useEffect(()=>{if(!toast)return;const id=setTimeout(()=>setToast(''),2500);return()=>clearTimeout(id)},[toast]);
  function browse(value) {
    setPage(1);
    setCategory(value);
    setFilter('All qualities');
    setQuery('');
    setSelectedTeam(null);
    setMenu(false);
    document.getElementById('shop')?.scrollIntoView({behavior:'smooth'});
  }
  const visible = selectProducts(products, {category, quality: filter, query, team: selectedTeam, sort});
  const bestsellers = products.filter(p => p.featured);
  const {page: currentPage, totalPages, items: paginated} = paginate(visible, page);
  function openProduct(product) {setSelected(product)}
  function quantity(key,delta) {try{setCart(changeQuantity(cart,key,delta,products))}catch(e){setToast(e.message)}}
  const title=category==='national'?'For country. For the colours.':category==='club'?'Your club. Your colours.':'Your next matchday shirt.';
  return <>
    {loading && (
      <div className="page-loading-overlay" role="status" aria-label="Loading jerseys">
        <div className="loading-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="loading-pulse">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          KITVERSE
        </div>
        <div className="loading-bar-wrap">
          <div className="loading-bar" />
        </div>
      </div>
    )}
    <div className="announcement">CLUB OR COUNTRY. WEAR YOUR COLOURS.</div>
    <header className="site-header">
      <div className="nav-main">
        <button className="icon-button mobile-menu" aria-label="Open navigation" aria-expanded={menu} onClick={()=>setMenu(true)}><Icon name="menu"/></button>
        <a href="#" className="logo" aria-label="KITVERSE home" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          KITVERSE
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">{collections.map(([value,label])=><button key={value} className={category===value?'current':''} onClick={()=>browse(value)} aria-current={category===value?'page':undefined}>{label}</button>)}<a href="#bestsellers">Featured jerseys</a><a href="#qualities">Quality guide</a><Link to="/shop">Shop All</Link></nav>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: 'auto' }}>
          {authCustomer ? (
            <Link to="/profile" style={{ textDecoration: 'none', color: '#000', fontSize: '13px', fontWeight: 'bold' }}>Profile</Link>
          ) : (
            <Link to="/auth" style={{ textDecoration: 'none', color: '#000', fontSize: '13px', fontWeight: 'bold' }}>Sign In</Link>
          )}
          <button className="bag" onClick={()=>setBag(true)} aria-label={`Shopping bag, ${cart.reduce((n,x)=>n+x.qty,0)} items`}><Icon name="bag"/><span className="bag-label">Bag</span><span className="bag-count">{cart.reduce((n,x)=>n+x.qty,0)}</span></button>
        </div>
      </div>
      <nav className="mobile-collections" aria-label="Collections">{collections.map(([value,label])=><button key={value} className={category===value?'current':''} aria-pressed={category===value} onClick={()=>browse(value)}>{label}</button>)}</nav>
    </header>
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span/> MADE FOR MATCHDAY</div>
          <h1>WEAR YOUR<br/>HEART.<br/><em>REP YOUR TEAM.</em></h1>
          <p>Club loyalty. National pride.<br/>Find the jersey that feels like you.</p>
          <div className="hero-actions">
            <a className="primary" href="#shop">Shop jerseys <span>↗</span></a>
            <a className="hero-secondary-btn" href="#qualities">Quality guide ↓</a>
          </div>
          <div className="hero-trust">
            <div className="trust-item"><span className="trust-num">{products.length}</span><span className="trust-label">Listed jerseys</span></div>
            <div className="trust-sep"/>
            <div className="trust-item"><span className="trust-num">{qualities.length}</span><span className="trust-label">Quality options</span></div>
            <div className="trust-sep"/>
            <div className="trust-item"><span className="trust-num">{SHOP_TEAMS.length}</span><span className="trust-label">Clubs & nations</span></div>
          </div>
        </div>
        {HERO_SLIDES.length > 0 ? <div 
          className="hero-stage"
          tabIndex="0"
          aria-label="Matchday kit showcase carousel"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setHeroIdx(i => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
            if (e.key === 'ArrowRight') setHeroIdx(i => (i + 1) % HERO_SLIDES.length);
          }}
        >
          {/* Dynamic Ambient Team Glow */}
          <div 
            className="hero-ambient-glow"
            style={{ background: `radial-gradient(circle at 50% 48%, ${HERO_SLIDES[heroIdx].bgGlow} 0%, transparent 68%)` }}
          />

          {/* Background Monogram Watermark */}
          <div className="hero-watermark-text" aria-hidden="true">
            {HERO_SLIDES[heroIdx].short}
          </div>

          {/* Top Bar: Live Status & Progress Counter */}
          <div className="hero-stage-top">
            <div className="hero-status-pill">
              <span className="live-dot" />
              <span>{demo ? 'Sample catalogue' : 'Catalogue selection'}</span>
            </div>
            <div className="hero-counter-wrap">
              <span className="hero-counter-num">0{heroIdx + 1}</span>
              <span className="hero-counter-sep">/</span>
              <span className="hero-counter-total">0{HERO_SLIDES.length}</span>
            </div>
          </div>

          {/* Central Jersey Display Area */}
          <div className="hero-showcase-stage">
            {HERO_SLIDES.map((slide, i) => (
              <div 
                key={i} 
                className={`hero-kit-slide ${i === heroIdx ? 'active' : ''}`} aria-hidden={i !== heroIdx}
                style={{
                  opacity: i === heroIdx ? 1 : 0,
                  transform: i === heroIdx ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(10px)',
                  pointerEvents: i === heroIdx ? 'auto' : 'none'
                }}
              >
                <ProductImage 
                  src={slide.img} 
                  alt={`${slide.team} ${slide.label}`} 
                  fetchPriority={i === 0 ? "high" : "auto"}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="hero-kit-img"
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            type="button" 
            className="hero-stage-arrow hero-stage-prev" 
            aria-label="Previous kit" 
            onClick={() => setHeroIdx(i => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          >
            ←
          </button>
          <button 
            type="button" 
            className="hero-stage-arrow hero-stage-next" 
            aria-label="Next kit" 
            onClick={() => setHeroIdx(i => (i + 1) % HERO_SLIDES.length)}
          >
            →
          </button>

          {/* Bottom Floating Glass Card with Spec Details */}
          <div className="hero-spec-card">
            <div className="hero-spec-header">
              <span className="hero-spec-pill" style={{ borderColor: HERO_SLIDES[heroIdx].accent }}>
                <span className="hero-spec-dot" style={{ background: HERO_SLIDES[heroIdx].accent }} />
                {HERO_SLIDES[heroIdx].label}
              </span>
              <span className="hero-spec-tier">{HERO_SLIDES[heroIdx].tier}</span>
            </div>
            <h3 className="hero-spec-title">{HERO_SLIDES[heroIdx].team.toUpperCase()}</h3>
            <p className="hero-spec-tagline">{HERO_SLIDES[heroIdx].tagline}</p>
            <div className="hero-spec-footer">
              <div className="hero-spec-price">
                <span className="price-label">Price</span>
                <strong>{HERO_SLIDES[heroIdx].price}</strong>
              </div>
              <button 
                type="button" 
                className="hero-spec-btn" 
                onClick={() => {
                  openProduct(HERO_SLIDES[heroIdx].product);
                }}
              >
                Shop kit <span>↗</span>
              </button>
            </div>
          </div>

          {/* Interactive Thumbnails Rail */}
          <div className="hero-thumb-rail" role="group" aria-label="Choose kit">
            {HERO_SLIDES.map((slide, i) => (
              <button
                key={i}
                type="button"
                className={`hero-thumb-item ${i === heroIdx ? 'active' : ''}`}
                aria-label={`Select ${slide.team} kit`} aria-pressed={heroIdx === i}
                onClick={() => setHeroIdx(i)}
              >
                <div className="thumb-img-box">
                  <ProductImage src={slide.img} alt={slide.short} />
                </div>
                <div className="thumb-meta">
                  <span className="thumb-short">{slide.short}</span>
                  <span className="thumb-dot" style={{ background: slide.accent }} />
                </div>
              </button>
            ))}
          </div>

          {/* Vertical Brand Ribbon */}
          <span className="hero-stage-ribbon">KITVERSE MATCHDAY / 0{heroIdx + 1}</span>
        </div> : <div className="hero-stage showcase-empty"><p>{loading ? 'Loading the collection…' : 'The collection will appear here when available.'}</p></div>}
      </section>
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          <span>FOOTBALL IS PERSONAL</span><b>✳</b><span>CLUB LOYALTY. NATIONAL PRIDE.</span><b>✳</b><span>FIND YOUR COLOURS</span><b>✳</b><span>FOOTBALL IS PERSONAL</span><b>✳</b><span>CLUB LOYALTY. NATIONAL PRIDE.</span><b>✳</b><span>FIND YOUR COLOURS</span><b>✳</b><span>FOOTBALL IS PERSONAL</span><b>✳</b><span>CLUB LOYALTY. NATIONAL PRIDE.</span><b>✳</b><span>FIND YOUR COLOURS</span><b>✳</b>
        </div>
      </div>
    <CategoryCircleNav />


      {/* ── BESTSELLERS / MOST POPULAR SECTION ── */}
      <section id="bestsellers" className="bestsellers-section reveal">
        <div className="bestsellers-header">
          <div>
            <span className="bestsellers-eyebrow">
              <span className="flame-icon">🔥</span> EXPLORE THE COLLECTION
            </span>
            <h2>FEATURED<br/><em>JERSEYS</em></h2>
          </div>
          <div className="bestsellers-sub-wrap">
            <p className="bestsellers-sub">
              Explore a selection from the catalogue. Choose a jersey to see its listed quality, price and available sizes.
            </p>
            <div className="bestsellers-demand-badge">
              <span className="live-dot" />
              <span>Catalogue picks · Select a size</span>
            </div>
          </div>
        </div>

        <div className="bestsellers-grid">
          {bestsellers.map((item, index) => {
            const rank = `0${index + 1}`;
            const metrics = {badge: 'FEATURED', highlight: '#181a16'};

            return (
              <div className="bestseller-card reveal" key={item.slug} style={{ '--i': index }}>
                {/* Ranking Watermark & Badges */}
                <div className="bestseller-rank">{rank}</div>
                <div className="bestseller-top-tags">
                  <span className="bestseller-badge" style={{ backgroundColor: metrics.highlight, color: '#fff' }}>
                    {metrics.badge}
                  </span>
                </div>

                {/* Product Image Stage */}
                <button 
                  type="button"
                  className="bestseller-img-stage"
                  onClick={() => openProduct(item)}
                  aria-label={`View ${item.name} details and sizes`}
                >
                  <ProductImage src={item.image} alt={item.name} loading="lazy" />
                  <span className="bestseller-hover-inspect">Choose Size +</span>
                </button>

                {/* Card Content */}
                <div className="bestseller-info">
                  <div className="bestseller-meta-row">
                    <span className="bestseller-tier">{item.quality}</span>
                    <span className="bestseller-sales">{item.team}</span>
                  </div>
                  <h3 className="bestseller-name">{item.name}</h3>
                  <div className="bestseller-sizes-row">
                    <span className="sizes-label">Sizes:</span>
                    <span className="sizes-list">{sizes.filter(s => stockFor(item, s) > 0).join(' · ') || 'In Stock'}</span>
                  </div>
                  <div className="bestseller-footer">
                    <div className="bestseller-price">{money(item.price)}</div>
                    <button 
                      type="button" 
                      className="bestseller-add-btn"
                      onClick={() => openProduct(item)}
                    >
                      Quick Bag <span>+</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 26/27 SEASON KITS SECTION ── */}
      <section id="season-26-27" className="bestsellers-section reveal" style={{ background: '#f5f5f5', borderTop: '1px solid #eaeaea', borderBottom: '1px solid #eaeaea' }}>
        <div className="bestsellers-header">
          <div>
            <span className="bestsellers-eyebrow">
              <span className="flame-icon">🔥</span> NEXT GENERATION
            </span>
            <h2>26/27 SEASON<br/><em>KITS</em></h2>
          </div>
          <div className="bestsellers-sub-wrap">
            <p className="bestsellers-sub">
              Get ahead of the game. Discover the upcoming season's colours before anyone else.
            </p>
          </div>
        </div>

        <div className="bestsellers-grid">
          {products.filter(p => p.season === '26/27' || p.name.includes('26/27')).slice(0, expanded2627 ? undefined : 8).map((p, index) => {
                const availableSizes = sizes.filter(s => stockFor(p, s) > 0);
                return (
                  <div 
                    className="bestseller-card reveal" 
                    key={p.slug}
                    style={{ '--i': index % 8, background: '#ffffff' }}
                  >
                    {/* Product Image Stage */}
                    <button 
                      type="button"
                      className="bestseller-img-stage"
                      onClick={() => openProduct(p)}
                    >
                      <ProductImage src={p.image} alt={p.name} loading="lazy" />
                      <span className="bestseller-hover-inspect">Choose Size +</span>
                    </button>

                    {/* Card Content */}
                    <div className="bestseller-info">
                      <div className="bestseller-meta-row">
                        <span className="bestseller-tier">{p.quality}</span>
                        <span className="bestseller-sales">{p.team}</span>
                      </div>
                      <h3 className="bestseller-name">{p.name}</h3>
                      <div className="bestseller-sizes-row">
                        <span className="sizes-label">Sizes:</span>
                        <span className="sizes-list">
                          {availableSizes.length ? availableSizes.join(' · ') : 'Restocking soon'}
                        </span>
                      </div>
                      <div className="bestseller-footer">
                        <div className="bestseller-price">{money(p.price)}</div>
                        <button 
                          type="button" 
                          className="bestseller-add-btn"
                          onClick={() => openProduct(p)}
                        >
                          Quick Bag <span>+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
          }
        </div>
        
        {products.filter(p => p.season === '26/27' || p.name.includes('26/27')).length > 8 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <button 
              className="primary" 
              onClick={() => {
                setExpanded2627(!expanded2627);
              }}
              style={{ minHeight: '50px', padding: '0 30px', fontSize: '15px' }}
            >
              {expanded2627 ? 'Show less' : 'View all 26/27 kits ↗'}
            </button>
          </div>
        )}
      </section>

      {/* ── SHOP BY TEAM CAROUSEL SECTION ── */}
      <section id="shop-by-team" className="shop-by-team-section reveal">
        <div className="teams-header">
          <div className="teams-title-wrap">
            <span className="teams-slant-badge" aria-hidden="true" />
            <h2 className="teams-title">Shop By Team</h2>
          </div>
          {selectedTeam && (
            <div className="teams-active-filter">
              <span>Showing: <strong>{selectedTeam}</strong></span>
              <button 
                type="button" 
                className="teams-clear-btn" 
                onClick={() => { setSelectedTeam(null); setQuery(''); }}
                aria-label="Clear team filter"
              >
                Clear ×
              </button>
            </div>
          )}
        </div>

        <div className="teams-carousel-container">
          <button
            type="button"
            className="teams-nav-arrow teams-nav-prev"
            onClick={() => scrollTeams('left')}
            aria-label="Scroll teams left"
          >
            <Icon name="chevron-left" />
          </button>

          <div className="teams-track" ref={teamTrackRef}>
            {SHOP_TEAMS.map((team) => {
              const isSelected = selectedTeam === team.name;
              return (
                <button
                  key={team.id}
                  type="button"
                  className={`team-item ${isSelected ? 'active' : ''}`}
                  onClick={() => handleTeamClick(team)}
                  aria-pressed={isSelected}
                  aria-label={`Shop ${team.name} jerseys`}
                >
                  <div className="team-circle-stage">
                    <img 
                      className="team-crest-img" 
                      src={`/images/crests/${team.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`} 
                      alt={`${team.name} crest`} 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'inline-block';
                      }}
                    />
                    <span className="team-initials" aria-hidden="true" style={{ display: 'none' }}>
                      {team.name.split(' ').map(word => word[0]).join('').slice(0, 3)}
                    </span>
                  </div>
                  <span className="team-item-label">{team.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="teams-nav-arrow teams-nav-next"
            onClick={() => scrollTeams('right')}
            aria-label="Scroll teams right"
          >
            <Icon name="chevron-right" />
          </button>
        </div>
      </section>

      <section id="shop" className="shop reveal"><div className="section-heading"><div><div className="eyebrow">THE KIT ROOM / {category==='all'?'ALL JERSEYS':category==='club'?'CLUB TEAMS':'NATIONAL TEAMS'}</div><h2>{title}</h2></div><span aria-live="polite">{visible.length} {visible.length===1?'jersey':'jerseys'}</span></div>
        <div className="shop-tools"><label className="search-field"><Icon name="search"/><input aria-label="Search by team or jersey" placeholder="Search a team or jersey" value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button aria-label="Clear search" onClick={()=>setQuery('')}>×</button>}</label><label className="sort">Sort by <select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div>
        <div className="filters"><div className="chips" aria-label="Filter by quality">{['All qualities',...qualities].map(q=><button key={q} className={filter===q?'active':''} aria-pressed={filter===q} onClick={()=>setFilter(q)}>{q}</button>)}</div></div>
        {demo&&<div className="sample-note">Preview collection · Sample prices and stock</div>}
        {loading ? (
          <div className="products">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="product skeleton-product" key={i}>
                <div className="skeleton-product-img" />
                <div className="skeleton-product-text">
                  <div className="skeleton-product-line" style={{ width: '45%' }} />
                  <div className="skeleton-product-line" style={{ width: '75%' }} />
                  <div className="skeleton-product-line" style={{ width: '35%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div role="alert"><p>{error}</p><button className="primary" onClick={load}>Try again</button></div>
        ) : visible.length === 0 ? (
          <div className="empty-state"><h3>No jerseys match just yet.</h3><p>Try another quality or explore the rest of the kit room.</p><button className="primary" onClick={()=>browse('all')}>View all jerseys ↗</button></div>
        ) : (
          <>
            <div className="products">
              {paginated.map((p, pIdx) => {
                const availableSizes = sizes.filter(s => stockFor(p, s) > 0);
                const badgeText = p.category === 'national' ? 'NATIONAL TEAM' : 'CLUB TEAM';
                const badgeBg = p.category === 'national' ? '#0077b6' : '#181a16';

                return (
                  <article className="bestseller-card product-card reveal" key={p.slug} style={{ '--i': pIdx % 8 }}>
                    {/* Top Badges Row */}
                    <div className="bestseller-top-tags">
                      <span 
                        className="bestseller-badge" 
                        style={{ backgroundColor: badgeBg, color: '#ffffff' }}
                      >
                        {badgeText}
                      </span>
                    </div>

                    {/* Product Image Stage */}
                    <button 
                      type="button"
                      className="bestseller-img-stage"
                      onClick={() => openProduct(p)}
                      aria-label={`View ${p.name} details and sizes`}
                    >
                      <ProductImage src={p.image} alt={p.name} loading="lazy" />
                      <span className="bestseller-hover-inspect">Choose Size +</span>
                    </button>

                    {/* Card Content */}
                    <div className="bestseller-info">
                      <div className="bestseller-meta-row">
                        <span className="bestseller-tier">{p.quality}</span>
                        <span className="bestseller-sales">{p.team}</span>
                      </div>
                      <h3 className="bestseller-name">{p.name}</h3>
                      <div className="bestseller-sizes-row">
                        <span className="sizes-label">Sizes:</span>
                        <span className="sizes-list">
                          {availableSizes.length ? availableSizes.join(' · ') : 'Restocking soon'}
                        </span>
                      </div>
                      <div className="bestseller-footer">
                        <div className="bestseller-price">{money(p.price)}</div>
                        <button 
                          type="button" 
                          className="bestseller-add-btn"
                          onClick={() => openProduct(p)}
                          aria-label={`Select size and add ${p.name} to bag`}
                        >
                          Quick Bag <span>+</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          {totalPages > 1 && (
            <div className="pagination" style={{display:'flex',justifyContent:'center',gap:'15px',marginTop:'40px',alignItems:'center'}}>
              <button className="primary" style={{minHeight:'44px',padding:'0 20px',background:currentPage===1?'#ddd':'var(--lime)',color:currentPage===1?'#888':'inherit'}} disabled={currentPage === 1} onClick={() => {setPage(currentPage - 1); document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})}}>Previous</button>
              <span style={{fontSize:'14px',fontWeight:'600'}}>Page {currentPage} of {totalPages}</span>
              <button className="primary" style={{minHeight:'44px',padding:'0 20px',background:currentPage===totalPages?'#ddd':'var(--lime)',color:currentPage===totalPages?'#888':'inherit'}} disabled={currentPage === totalPages} onClick={() => {setPage(currentPage + 1); document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})}}>Next</button>
            </div>
          )}
        </>)}
      </section>

      <section id="shop-track-pants" className="bestsellers-section reveal" style={{ borderTop: '1px solid #eaeaea', marginTop: '20px', paddingTop: '40px' }}>
        <div className="bestsellers-header">
          <div>
            <span className="bestsellers-eyebrow">SHOP APPAREL</span>
            <h2>Track Pants</h2>
          </div>
          <div className="bestsellers-sub-wrap">
            <p className="bestsellers-sub">Complete your kit.</p>
            <Link to={`/shop?type=${type}`} className="primary" style={{ padding: '10px 20px', textDecoration: 'none' }}>Shop Track Pants</Link>
          </div>
        </div>
        {products.filter(p => p.productType === 'track-pants').length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px', color: '#666', border: '1px dashed #ccc' }}>
            <p>New arrivals coming soon.</p>
          </div>
        ) : (
          <div className="bestsellers-grid">
            {products.filter(p => p.productType === 'track-pants').slice(0, 4).map((p, index) => (
              <ProductCard key={p.slug} p={p} pIdx={index} onOpen={() => setSelected(p)} />
            ))}
          </div>
        )}
      </section>

      <section id="shop-shorts" className="bestsellers-section reveal" style={{ borderTop: '1px solid #eaeaea', marginTop: '20px', paddingTop: '40px' }}>
        <div className="bestsellers-header">
          <div>
            <span className="bestsellers-eyebrow">SHOP APPAREL</span>
            <h2>Shorts</h2>
          </div>
          <div className="bestsellers-sub-wrap">
            <p className="bestsellers-sub">Complete your kit.</p>
            <Link to={`/shop?type=${type}`} className="primary" style={{ padding: '10px 20px', textDecoration: 'none' }}>Shop Shorts</Link>
          </div>
        </div>
        {products.filter(p => p.productType === 'shorts').length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px', color: '#666', border: '1px dashed #ccc' }}>
            <p>New arrivals coming soon.</p>
          </div>
        ) : (
          <div className="bestsellers-grid">
            {products.filter(p => p.productType === 'shorts').slice(0, 4).map((p, index) => (
              <ProductCard key={p.slug} p={p} pIdx={index} onOpen={() => setSelected(p)} />
            ))}
          </div>
        )}
      </section>

      <section id="shop-collar-tshirts" className="bestsellers-section reveal" style={{ borderTop: '1px solid #eaeaea', marginTop: '20px', paddingTop: '40px' }}>
        <div className="bestsellers-header">
          <div>
            <span className="bestsellers-eyebrow">SHOP APPAREL</span>
            <h2>Collar T-Shirts</h2>
          </div>
          <div className="bestsellers-sub-wrap">
            <p className="bestsellers-sub">Complete your kit.</p>
            <Link to={`/shop?type=${type}`} className="primary" style={{ padding: '10px 20px', textDecoration: 'none' }}>Shop Collar T-Shirts</Link>
          </div>
        </div>
        {products.filter(p => p.productType === 'collar-tshirt').length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px', color: '#666', border: '1px dashed #ccc' }}>
            <p>New arrivals coming soon.</p>
          </div>
        ) : (
          <div className="bestsellers-grid">
            {products.filter(p => p.productType === 'collar-tshirt').slice(0, 4).map((p, index) => (
              <ProductCard key={p.slug} p={p} pIdx={index} onOpen={() => setSelected(p)} />
            ))}
          </div>
        )}
      </section>

      <section id="qualities" className="quality reveal"><div className="quality-intro"><div className="eyebrow">KNOW YOUR KIT</div><h2>The details<br/>make the difference.</h2><p>Each jersey is listed in the quality we have in stock. Check its available sizes before adding it to your bag.</p></div><div className="quality-grid">{['Stitched details. Check the product listing for the exact embroidered elements.','A coordinated jersey-and-shorts set. Both are included in this category.','Check each listing for fabric, badge construction and finishing.','A closer-fitting style. Check the garment measurements for your selected shirt.'].map((text,i)=><article key={qualities[i]} className="reveal" style={{ '--i': i }}><span>0{i+1} / {['THE DETAIL','THE FULL KIT','THE FINISH','THE FIT'][i]}</span><h3>{qualities[i]}</h3><p>{text}</p></article>)}</div></section>
      
        <section className="closing reveal"><p>DIFFERENT COLOURS. SAME OBSESSION.</p><h2>See you on matchday.</h2><a href="#shop">Back to the kit room ↗</a></section>
    </main>
    <footer className="site-footer reveal">
      <div className="footer-top">
        <div className="footer-brand">
          <a className="logo" href="#">KITVERSE</a>
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
            <a href="#" onClick={e=>{e.preventDefault();browse('all')}}>All Jerseys</a>
            <a href="#" onClick={e=>{e.preventDefault();browse('club')}}>Club Teams</a>
            <a href="#" onClick={e=>{e.preventDefault();browse('national')}}>National Teams</a>
            <a href="#qualities">Quality Guide</a>
          </nav>
        </div>
        <div className="footer-links-group">
          <h4>Quality Tiers</h4>
          <nav>
            {qualities.map(q=><a key={q} href="#" onClick={e=>{e.preventDefault();browse('all');setFilter(q);document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})}}>{q}</a>)}
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
          <span>� 2026 KITVERSE. All rights reserved.</span>
          <span className="footer-disclaimer">Concept storefront � Images illustrative � No official club affiliation claimed.</span>
        </div>
        <div className="footer-bottom-badges">
          <span className="payment-badge">VISA</span>
          <span className="payment-badge">MASTERCARD</span>
          <span className="payment-badge">UPI</span>
        </div>
      </div>
    </footer>
    {menu&&<Modal label="Main navigation" className="menu-dialog" onClose={()=>setMenu(false)}><a href="#" className="logo" onClick={()=>setMenu(false)}>KITVERSE</a><p className="eyebrow">FIND YOUR COLOURS</p><nav className="menu-links" aria-label="Mobile navigation">{collections.map(([value,label])=><button key={value} onClick={()=>browse(value)}>{label}<span>↗</span></button>)}<a href="#qualities" onClick={()=>setMenu(false)}>Quality guide<span>↗</span></a><Link to="/shop" onClick={()=>setMenu(false)}>Shop All<span>↗</span></Link></nav><p className="detail-note">Club loyalty. National pride.<br/>One love for the game.</p></Modal>}
    {selected && (
      <ProductDetailModal key={selected.slug}
        product={selected}
        products={products}
        onSelectRelated={(prod) => setSelected(prod)}
        onClose={() => setSelected(null)}
        onAdd={(prod, chosenSize) => {
          setCart(addItem(cart, prod, chosenSize));
          setSelected(null);
          setToast('Added to your matchday bag');
        }}
        cart={cart}
        demo={demo}
      />
    )}
    {bag&&<Modal label="Shopping bag" onClose={()=>setBag(false)}><h2>Your matchday bag.</h2>{cart.length?cart.map(x=><div className="cart-row" key={x.key}><div><p>{x.name}</p><small>{x.quality} · {x.size}</small><p>{money(x.price*x.qty)}</p></div><div className="quantity"><button aria-label={`Decrease ${x.name} quantity`} onClick={()=>quantity(x.key,-1)}>−</button><span>{x.qty}</span><button disabled={x.qty>=stockFor(products.find(p=>p.slug===x.slug),x.size)} aria-label={`Increase ${x.name} quantity`} onClick={()=>quantity(x.key,1)}>+</button></div></div>):<p>Your bag is waiting for its first jersey.</p>}{cart.length>0&&<div className="total"><span>Subtotal</span><span>{money(cart.reduce((n,x)=>n+x.price*x.qty,0))}</span></div>}{storageWarning && <p role="status">{storageWarning}</p>}<div style={{display:'flex',gap:'10px',marginTop:'20px'}}><Link to="/checkout" className="primary" style={{flex:1,textAlign:'center',textDecoration:'none',padding:'15px'}}>Checkout</Link><button className="secondary" style={{flex:1}} onClick={()=>setBag(false)}>Keep exploring</button></div></Modal>}
    {info && <Modal label={info} onClose={() => setInfo(null)}><h2>{info}</h2><p>{
      info === 'Sizing Guide' ? 'Measure a well-fitting shirt across the chest and from shoulder to hem. Product-specific measurements will be published before ordering opens.' :
      info === 'Shipping & Returns' ? 'Orders are not open yet. Delivery areas, shipping charges and return terms will be published before checkout is enabled.' :
      info === 'Contact Us' ? 'Customer support contact details have not been published yet. This preview does not accept orders or payments.' :
      'KITVERSE is a football jersey storefront in development. Browse the collection and build a bag while the store is being prepared. No official club affiliation is claimed.'
    }</p></Modal>}
    {toast&&<div id="toast" style={{display:'block'}} role="status">{toast}</div>}
  </>;
}
export default App;



