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

  useScrollReveal([pageProducts, loading, activeFilterCount], { scroller: mainPanel.current });

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



  return <div className="flex flex-col h-screen overflow-hidden bg-background">
      <div className="z-50 relative"><Navbar /></div>
      <div className="flex flex-1 overflow-hidden pt-24 px-6 md:px-12 max-w-[1600px] w-full mx-auto gap-8" id="top">

      {!isMobile && <aside className="hidden md:flex flex-col w-[240px] shrink-0 overflow-y-auto pb-12 gap-8" aria-label="Collection filters">{filterControls}</aside>}
      
      <div className="flex-1 overflow-y-auto pb-12 custom-scrollbar" ref={mainPanel} tabIndex={0} role="region" aria-label="Shop products and footer">
        <main>
          <section className="flex flex-col gap-6 w-full" id="catalogue" aria-label="Product catalogue">
            <div className="flex flex-col gap-4 border-b border-border pb-6">
              <span className="font-sans text-xs uppercase tracking-widest text-secondary">The Football Archive // Issue 04</span>
              <h1 className="font-display text-display-md uppercase text-foreground m-0 leading-none">Complete Collection</h1>
              <p className="font-sans text-base text-secondary max-w-xl">
                Explore authentic matchday apparel, training gear, and retro classics. Filter by team, season, or specification.
              </p>
            </div>
            
            {isMobile && <dialog ref={filterDialog} className="fixed inset-0 m-0 w-full h-full max-w-none max-h-none bg-background text-foreground z-50 p-6 overflow-y-auto" aria-label="Collection filters" onCancel={event=>{event.preventDefault();setMobilePanel(null);}} onClick={event=>{if(event.target===filterDialog.current && event.clientX>event.target.getBoundingClientRect().right)setMobilePanel(null);}}><button type="button" className="font-sans text-xs uppercase tracking-widest text-foreground hover:text-accent transition-colors pb-8" aria-label="Close filters" onClick={()=>setMobilePanel(null)}>← Back to Archive</button>{filterControls}</dialog>}
            
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-2">
                  {isMobile ? 
                    <button className="font-sans text-xs uppercase tracking-widest text-foreground border border-border px-4 py-2 hover:border-foreground transition-colors flex items-center gap-2" type="button" aria-haspopup="dialog" aria-expanded={mobilePanel==='filters'} onClick={()=>setMobilePanel('filters')}>
                      FILTERS {activeFilterCount>0 && <b>({activeFilterCount})</b>}
                    </button> : 
                    <span className="font-sans text-xs uppercase tracking-widest text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full inline-block"></span> 
                      {sortedProducts.length} Results
                    </span>
                  }
                </div>
                {sortControl}
              </div>
              
              {activeFilterCount>0 && <div className="flex flex-wrap items-center gap-3 py-4">{season && <span className="font-sans text-[10px] uppercase tracking-widest text-secondary border border-border px-2 py-1">SEASON {season}</span>}<span className="font-sans text-[10px] uppercase tracking-widest text-secondary">{activeFilterCount} FILTER{activeFilterCount===1?'':'S'} ACTIVE</span><button type="button" onClick={clearFilters} className="font-sans text-[10px] uppercase tracking-widest text-foreground border-b border-foreground pb-0.5 ml-2 hover:text-accent transition-colors">CLEAR ALL ×</button></div>}
              {storageWarning && <p className="font-sans text-xs text-accent mt-2" role="status">{storageWarning}</p>}
              {notice && <p className="font-sans text-xs text-secondary mt-2" role="status">{notice}</p>}

              {loading ? <div className="flex flex-col items-center justify-center py-24 gap-4" role="status"><span className="font-display text-4xl text-foreground">KV—</span><p className="font-sans text-xs uppercase tracking-widest text-secondary">SYNCING THE ARCHIVE…</p></div> : error ?
                <div className="flex flex-col items-center justify-center py-24 gap-4" role="alert"><span className="font-display text-4xl text-accent">!</span><p className="font-sans text-xs uppercase tracking-widest text-foreground">{error}</p><button type="button" className="font-sans text-xs uppercase tracking-widest border border-border px-4 py-2 hover:bg-foreground hover:text-background transition-colors" onClick={() => setRetryKey(value => value + 1)}>RETRY CONNECTION ↗</button></div> :
                pageProducts.length ? <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-6 pt-4">
                  {pageProducts.map((product, idx) => <ProductCard key={product.slug} p={product} pIdx={idx} onOpen={setSelectedProduct} />)}
                </div> : <div className="flex flex-col items-center justify-center py-24 gap-4"><span className="font-display text-4xl text-secondary">Ø</span><p className="font-sans text-xs uppercase tracking-widest text-foreground">NO MATCHES IN THIS EDITION.</p><button type="button" className="font-sans text-xs uppercase tracking-widest border border-border px-4 py-2 hover:bg-foreground hover:text-background transition-colors" onClick={clearFilters}>RESET THE FILTERS</button></div>}

              {!loading && !error && sortedProducts.length > 0 && <div className="flex flex-col items-center gap-6 py-12 border-t border-border mt-12">
                <span className="font-sans text-[10px] uppercase tracking-widest text-secondary">SHOWING {firstResult}–{lastResult} OF {sortedProducts.length}</span>
                <div className="flex items-center gap-4 w-full justify-between max-w-sm" role="navigation" aria-label="Product pages">
                  <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1} aria-label="Previous page" className="font-sans text-xs uppercase tracking-widest text-foreground disabled:opacity-30 flex items-center gap-2 hover:text-accent transition-colors">
                    <span aria-hidden="true">←</span><span>PREVIOUS</span>
                  </button>
                  
                  <span className="font-sans text-xs uppercase tracking-widest text-foreground">PAGE {currentPage} / {pageCount}</span>
                  
                  <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= pageCount} aria-label="Next page" className="font-sans text-xs uppercase tracking-widest text-foreground disabled:opacity-30 flex items-center gap-2 hover:text-accent transition-colors">
                    <span>NEXT</span><span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>}
            </div>
          </section>
        </main>

        <footer className="w-full bg-foreground text-background py-16 px-6 border-t border-border mt-24">
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-2 text-center md:text-left">
              <h2 className="font-display text-2xl uppercase m-0 leading-none">KITVERSE</h2>
              <span className="font-sans text-xs uppercase tracking-widest text-background/50">The Football Archive</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#top" onClick={event => { event.preventDefault(); (isMobile ? window : mainPanel.current)?.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }} className="font-sans text-xs uppercase tracking-widest hover:text-accent transition-colors">BACK TO TOP ↑</a>
            </div>
          </div>
        </footer>
      </div>

    {selectedProduct && <ProductDetailModal product={selectedProduct} products={products} onSelectRelated={setSelectedProduct} onClose={() => setSelectedProduct(null)} onAdd={handleAdd} demo={demo} cart={cart} />}
    </div>
  </div>;
}
