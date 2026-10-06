import UiIcon from '../components/UiIcon.jsx';
import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar.jsx';
import { Link, useSearchParams } from 'react-router-dom';
import { addItem } from '../../../shared/inventory.js';
import { sizes } from '../../../shared/catalog.js';
import { money } from '../format.js';
import useBag from '../useBag.js';
import useScrollReveal from '../useScrollReveal.js';
import ProductDetailModal from '../components/ProductDetailModal.jsx';
import ProductImage from '../components/ProductImage.jsx';
import { ProductCard } from '../components/shop/ProductCard.jsx';
import '../shop-page.css';

const productTypes = ['jersey', 'shorts', 'track-pants', 'collar-tshirt'];
const typeLabels = {
  jersey: 'Jerseys',
  shorts: 'Shorts',
  'track-pants': 'Track pants',
  'collar-tshirt': 'Collar tees',
};

function productStock(product) {
  return Object.values(product.stock || {}).reduce((total, quantity) => total + quantity, 0);
}

export default function ShopPage() {
  useScrollReveal([products, category, productType, season, searchParams]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 700px)').matches);
  const category = ['club', 'national'].includes(searchParams.get('category'))
    ? searchParams.get('category')
    : 'all';
  const productType = productTypes.includes(searchParams.get('type'))
    ? searchParams.get('type')
    : 'all';
  const season = searchParams.get('season') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [demo, setDemo] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [query, setQuery] = useState(searchParams.get('search') || '');
  useEffect(()=>{
    setQuery(searchParams.get('search') || '');setSort(searchParams.get('sort') || 'featured');
    setTeam(searchParams.get('team') || 'all');setQuality(searchParams.get('quality') || 'all');
    setSize(searchParams.get('size') || 'all');setRetroOnly(searchParams.get('retro') === 'true');setPage(1);
  },[searchParams]);
  const [team, setTeam] = useState(searchParams.get('team') || 'all');
  const [quality, setQuality] = useState(searchParams.get('quality') || 'all');
  const [size, setSize] = useState(searchParams.get('size') || 'all');
  const [retroOnly, setRetroOnly] = useState(searchParams.get('retro') === 'true');
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');
  const [mobilePanel, setMobilePanel] = useState(null);
  const filterDialog = useRef(null);
  const collectionHeading = useRef(null);
  const mainPanel = useRef(null);
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notice, setNotice] = useState('');
  const { cart, setCart, restore, storageWarning } = useBag();
  const pageSize = isMobile ? 8 : 12;

  useEffect(() => {
    window.scrollTo(0, 0);
    const updateViewport = () => {
      setIsMobile(window.matchMedia('(max-width: 700px)').matches);
      setPage(1);
      setMobilePanel(null);
    };
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    fetch('/api/products', { signal: controller.signal })
      .then(async response => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || 'The archive could not be loaded.');
        if (!Array.isArray(data.products)) throw new Error('The archive returned an invalid catalogue.');
        setProducts(data.products);
        setDemo(Boolean(data.demo));
        restore(data.products);
      })
      .catch(fetchError => {
        if (fetchError.name !== 'AbortError') setError(fetchError.message || 'Could not connect to the archive.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [retryKey]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(''), 3200);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const updateParam = (key, value) => {
    setSearchParams(current => {
      const next = new URLSearchParams(current);
      if (value === 'all' || value === '' || value === 'false') next.delete(key);
      else next.set(key, value);
      return next;
    }, { replace: key === 'search' });
    setPage(1);
  };

  const teamMap = new Map();
  products.forEach(product => {
    const value = product.team?.trim();
    if (!value) return;
    const key = value.toLowerCase();
    if (!teamMap.has(key) || value !== value.toLowerCase()) teamMap.set(key, value);
  });
  if (team !== 'all' && !teamMap.has(team.toLowerCase())) teamMap.set(team.toLowerCase(), team);
  const teams = [...teamMap.values()].sort((a, b) => a.localeCompare(b));
  const qualities = [...new Set(products.map(product => product.quality).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const categoryCounts = {
    all: products.length,
    club: products.filter(product => product.category === 'club').length,
    national: products.filter(product => product.category === 'national').length,
  };
  const typeCounts = Object.fromEntries(productTypes.map(typeName => [
    typeName,
    products.filter(product => (product.productType || 'jersey') === typeName).length,
  ]));

  const filteredProducts = products.filter(product => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery = !normalizedQuery || [product.name, product.team, product.quality, product.season]
      .some(value => value?.toLowerCase().includes(normalizedQuery));
    return matchesQuery &&
      (category === 'all' || product.category === category) &&
      (productType === 'all' || (product.productType || 'jersey') === productType) &&
      (team === 'all' || product.team?.toLowerCase() === team.toLowerCase()) &&
      (quality === 'all' || product.quality === quality) &&
      (size === 'all' || product.stock?.[size] > 0) &&
      (!retroOnly || product.retro) &&
      (!season || (product.season || product.name || '').includes(season));
  });
  const sortedProducts = filteredProducts.slice().sort((a, b) => {
    if (sort === 'price-low') return a.price - b.price;
    if (sort === 'price-high') return b.price - a.price;
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'newest') return (b.season || '').localeCompare(a.season || '');
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.name.localeCompare(b.name);
  });
  const pageCount = Math.ceil(sortedProducts.length / pageSize);
  const currentPage = Math.min(page, pageCount || 1);
  const pageWindowStart = Math.max(1, Math.min(currentPage - 1, pageCount - 2));
  const pageNumbers = [...new Set([1,...Array.from({length:Math.min(pageCount,3)},(_,index)=>pageWindowStart+index),pageCount])].filter(n=>n>0).sort((a,b)=>a-b);
  const pageProducts = sortedProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstResult = sortedProducts.length ? (currentPage - 1) * pageSize + 1 : 0;
  const lastResult = Math.min(currentPage * pageSize, sortedProducts.length);
  const itemCount = cart.reduce((total, item) => total + item.qty, 0);
  const bagTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const activeFilterCount = [category !== 'all', productType !== 'all', team !== 'all', quality !== 'all', size !== 'all', retroOnly, Boolean(season), Boolean(query.trim())].filter(Boolean).length;

  useEffect(() => {
    if (mobilePanel !== 'filters' || !isMobile) return;
    const dialog = filterDialog.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();document.body.style.overflow = 'hidden';
    return () => {dialog.close();document.body.style.overflow = overflow;if(previous?.isConnected)previous.focus();};
  }, [mobilePanel, isMobile]);

  const goToPage = value => {
    setPage(value);
    collectionHeading.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  };
  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setQuery('');
    setTeam('all');
    setQuality('all');
    setSize('all');
    setRetroOnly(false);
    setSort('featured');
    setPage(1);
    setMobilePanel(null);
  };

  const sortControl = <label className="shop-select-wrap shop-sort"><span>SORT BY</span>
    <select value={sort} onChange={event => updateParam('sort',event.target.value)} aria-label="Sort products">
      <option value="featured">Featured</option><option value="newest">Season</option>
      <option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A to Z</option>
    </select>
  </label>;
  const filterControls = <>
    <div className="shop-sidebar-title"><span className="shop-eyebrow">ARCHIVE INDEX /</span><h2>FILTER &amp;<br/>DISCOVER<span>.</span></h2></div>
    <div className="shop-search"><UiIcon name="search"/><input aria-label="Search the archive" type="search" value={query} onChange={event=>updateParam('search',event.target.value)} placeholder="Search the archive"/>{query && <button type="button" aria-label="Clear search" onClick={()=>updateParam('search','')}>×</button>}</div>
    <div className="shop-category-tabs" role="group" aria-label="Filter by team category">
      {['all','club','national'].map(value=><button key={value} type="button" className={category===value?'is-active':''} aria-pressed={category===value} onClick={()=>updateParam('category',value)}><span>{value==='all'?'ALL TEAMS':value==='club'?'CLUBS':'NATIONAL TEAMS'}</span><b>{String(categoryCounts[value]||0).padStart(2,'0')}</b></button>)}
    </div>
    <div className="shop-controls" id="shop-controls">
      <label className="shop-select-wrap"><span>PRODUCT</span><select value={productType} onChange={event=>updateParam('type',event.target.value)} aria-label="Filter by product type"><option value="all">All types</option>{productTypes.map(value=><option key={value} value={value}>{typeLabels[value]} ({typeCounts[value]||0})</option>)}</select></label>
      <label className="shop-select-wrap"><span>TEAM</span><select value={team} onChange={event=>updateParam('team',event.target.value)} aria-label="Filter by team"><option value="all">All teams</option>{teams.map(value=><option key={value} value={value}>{value}</option>)}</select></label>
      <label className="shop-select-wrap"><span>QUALITY</span><select value={quality} onChange={event=>updateParam('quality',event.target.value)} aria-label="Filter by quality"><option value="all">All qualities</option>{qualities.map(value=><option key={value} value={value}>{value}</option>)}</select></label>
      <label className="shop-select-wrap"><span>SIZE</span><select value={size} onChange={event=>updateParam('size',event.target.value)} aria-label="Filter by available size"><option value="all">Any size</option>{sizes.map(value=><option key={value} value={value}>{value}</option>)}</select></label>
      <label className="shop-retro-toggle"><input type="checkbox" checked={retroOnly} onChange={event=>updateParam('retro',String(event.target.checked))}/><span>RETRO ONLY</span><span aria-hidden="true">↗</span></label>
    </div>
    <button className="shop-clear-filters" type="button" onClick={clearFilters} disabled={!activeFilterCount}>CLEAR ALL FILTERS <span aria-hidden="true">×</span></button>
    {isMobile && <button className="shop-show-results" type="button" onClick={()=>setMobilePanel(null)}>SHOW {sortedProducts.length} RESULTS <span aria-hidden="true">→</span></button>}
  </>;

  const handleAdd = (product, chosenSize) => {
    setCart(addItem(cart, product, chosenSize));
    setSelectedProduct(null);
    setNotice(`${product.name} · size ${chosenSize} added to your cart.`);
  };



  return <div className="shop-shell">
      <div className="shop-navigation"><Navbar /></div>
      <div className="shop-page" id="top">

      {!isMobile && <aside className="shop-sidebar" aria-label="Collection filters">{filterControls}</aside>}
      <div className="shop-main-panel" ref={mainPanel} tabIndex={0} role="region" aria-label="Shop products and footer">
      <main>
      <section className="shop-catalogue" id="catalogue" aria-label="Product catalogue">
        <div className="shop-intro"><Link to="/">HOME</Link><span aria-hidden="true">/</span><span>THE FOOTBALL ARCHIVE</span><span className="shop-edition">ISSUE 04 — THE COLLECTION</span></div>
        <div className="shop-layout">
          {isMobile && <dialog ref={filterDialog} className="shop-filter-dialog" aria-label="Collection filters" onCancel={event=>{event.preventDefault();setMobilePanel(null);}} onClick={event=>{if(event.target===filterDialog.current && event.clientX>event.target.getBoundingClientRect().right)setMobilePanel(null);}}><button type="button" className="shop-filter-close" aria-label="Close filters" onClick={()=>setMobilePanel(null)}>CLOSE ×</button>{filterControls}</dialog>}
          <div className="shop-results">
        <div className="shop-catalogue-heading" ref={collectionHeading}>
          <span className="shop-count" role="status">{loading?'SYNCING INVENTORY…':error?'ARCHIVE UNAVAILABLE':String(sortedProducts.length).padStart(2,'0')+' RESULTS'}</span>
        </div>
        <div className="shop-results-toolbar"><div className="shop-toolbar-note">{isMobile?<button className="shop-filter-trigger" type="button" aria-haspopup="dialog" aria-expanded={mobilePanel==='filters'} onClick={()=>setMobilePanel('filters')}><UiIcon name="tune"/> FILTERS {activeFilterCount>0 && <b>{activeFilterCount}</b>}</button>:<><span className="shop-live-dot" aria-hidden="true"/> {demo?'EXPLORE THE ARCHIVE':'LIVE COLLECTION'}</>}</div>{sortControl}</div>
        {activeFilterCount>0 && <div className="shop-active-filters">{season && <span>SEASON {season}</span>}<span>{activeFilterCount} FILTER{activeFilterCount===1?'':'S'} ACTIVE</span><button type="button" onClick={clearFilters}>CLEAR ALL ×</button></div>}
        {storageWarning && <p className="shop-storage-warning" role="status">{storageWarning}</p>}
        {notice && <p className="shop-notice" role="status">{notice}</p>}

        {loading ? <div className="shop-state" role="status"><span className="shop-state-mark">KV—</span><p>SYNCING THE ARCHIVE…</p></div> : error ?
          <div className="shop-state shop-state-error" role="alert"><span className="shop-state-mark">!</span><p>{error}</p><button type="button" onClick={() => setRetryKey(value => value + 1)}>RETRY CONNECTION ↗</button></div> :
          pageProducts.length ? <div className="shop-product-grid grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-6 pt-4">
            {pageProducts.map((product, idx) => <ProductCard key={product.slug} p={product} pIdx={idx} onOpen={setSelectedProduct} />)}
          </div> : <div className="shop-state shop-empty-state"><span className="shop-state-mark">Ø</span><p>NO MATCHES IN THIS EDITION.</p><button type="button" onClick={clearFilters}>RESET THE FILTERS</button></div>}

        {!loading && !error && sortedProducts.length > 0 && <div className="shop-pagination">
          <span>SHOWING {firstResult}–{lastResult} OF {sortedProducts.length}</span>
          <div className="shop-page-nav" role="navigation" aria-label="Product pages">
            <button className="shop-page-step" type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1} aria-label="Previous page">
              <span aria-hidden="true">←</span><span>PREVIOUS</span>
            </button>
            <div className="shop-page-numbers">
              {pageNumbers.map((pageNumber,index) => <React.Fragment key={pageNumber}>{index>0 && pageNumber>pageNumbers[index-1]+1 && <span className="shop-page-ellipsis" aria-hidden="true">…</span>}<button type="button"
                className={pageNumber === currentPage ? 'is-current' : ''}
                aria-label={`Go to page ${pageNumber}`} aria-current={pageNumber === currentPage ? 'page' : undefined}
                onClick={() => goToPage(pageNumber)}>{pageNumber}</button></React.Fragment>)}
            </div>
            <span className="shop-page-status">PAGE {currentPage} / {pageCount}</span>
            <button className="shop-page-step" type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= pageCount} aria-label="Next page">
              <span>NEXT</span><span aria-hidden="true">→</span>
            </button>
          </div>
        </div>}
          </div>
        </div>
      </section>

    </main>

    <footer className="shop-footer">
      <div className="shop-footer-masthead"><span>THE GAME CONNECTS US.</span><Link to="/">+ KITVERSE<span aria-hidden="true">↗</span></Link></div>
      <div className="shop-footer-main">
        <div className="shop-footer-brand"><Link to="/">+ KITVERSE</Link><p>THE FOOTBALL ARCHIVE.<br />BUILT FOR MATCHDAY.</p></div>
        <div className="shop-footer-column"><h2>THE ARCHIVE</h2><Link to="/shop">All products</Link><Link to="/shop?category=club">Club kits</Link><Link to="/shop?category=national">National teams</Link><Link to="/shop?retro=true">Retro collection</Link></div>
        <div className="shop-footer-column"><h2>YOUR KITVERSE</h2><Link to="/profile">Your account</Link><Link to="/checkout">Your cart</Link><a href="mailto:hello@kitverse.in">Get in touch ↗</a></div>
        <div className="shop-footer-dispatch"><span>DISPATCH / INDIA</span><p>Collected with care.<br />Sent out for matchday.</p><b>{demo ? 'SAMPLE MODE' : 'INVENTORY LIVE'} <i aria-hidden="true" /></b></div>
      </div>
      <div className="shop-footer-bottom"><span>© 2026 KITVERSE / EST. 2024</span><span>MADE FOR THE LOVE OF THE GAME</span><a href="#top" onClick={event => { event.preventDefault(); (isMobile ? window : mainPanel.current)?.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }}>BACK TO TOP ↑</a></div>
    </footer>
      </div>

    {selectedProduct && <ProductDetailModal product={selectedProduct} products={products}
      onSelectRelated={setSelectedProduct} onClose={() => setSelectedProduct(null)}
      onAdd={handleAdd} demo={demo} cart={cart} />}
  </div>
  </div>;
}
