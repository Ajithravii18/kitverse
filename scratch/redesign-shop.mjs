import {readFileSync,writeFileSync} from 'node:fs';
const path='client/src/pages/ShopPage.jsx';
let s=readFileSync(path,'utf8');
s=s.replace('useEffect, useState','useEffect, useState, useRef');
s=s.replace("const [mobilePanel, setMobilePanel] = useState(null);", "const [mobilePanel, setMobilePanel] = useState(null);\n  const filterDialog = useRef(null);\n  const collectionHeading = useRef(null);");
s=s.replace("useEffect(()=>{setQuery(searchParams.get('search') || '');setSort(searchParams.get('sort') || 'featured');setPage(1);},[searchParams]);", "useEffect(()=>{\n    setQuery(searchParams.get('search') || '');setSort(searchParams.get('sort') || 'featured');\n    setTeam(searchParams.get('team') || 'all');setQuality(searchParams.get('quality') || 'all');\n    setSize(searchParams.get('size') || 'all');setRetroOnly(searchParams.get('retro') === 'true');setPage(1);\n  },[searchParams]);");
s=s.replace('setMobilePanel(null);\n    };','setMobilePanel(null);\n    };');
s=s.replace("if (value === 'all')", "if (value === 'all' || value === '' || value === 'false')");
s=s.replace('}, { replace: true });\n    setPage(1);','});\n    setPage(1);');
s=s.replace("quality !== 'all', size !== 'all', retroOnly]", "quality !== 'all', size !== 'all', retroOnly, Boolean(query.trim())]");
const mark='  const handleAdd = (product, chosenSize) => {';
s=s.replace(mark, `  useEffect(() => {
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

`+mark);
const a=s.indexOf('        <div className="shop-catalogue-heading">');
const b=s.indexOf('        {storageWarning',a);
s=s.slice(0,a)+`        <div className="shop-intro"><Link to="/">HOME</Link><span aria-hidden="true">/</span><span>THE FOOTBALL ARCHIVE</span><span className="shop-edition">ISSUE 04 — THE COLLECTION</span></div>
        <div className="shop-layout">
          {!isMobile && <aside className="shop-sidebar" aria-label="Collection filters">{filterControls}</aside>}
          {isMobile && <dialog ref={filterDialog} className="shop-filter-dialog" aria-label="Collection filters" onCancel={event=>{event.preventDefault();setMobilePanel(null);}} onClick={event=>{if(event.target===filterDialog.current && event.clientX>event.target.getBoundingClientRect().right)setMobilePanel(null);}}><button type="button" className="shop-filter-close" aria-label="Close filters" onClick={()=>setMobilePanel(null)}>CLOSE ×</button>{filterControls}</dialog>}
          <div className="shop-results">
        <div className="shop-catalogue-heading" ref={collectionHeading}>
          <div><span className="shop-eyebrow">COLLECTED FOR THE LOVE OF THE GAME</span><h1>THE<br/><em>COLLECTION.</em></h1><p>Different clubs. Different eras. One beautiful game.</p></div>
          <span className="shop-count" role="status">{loading?'SYNCING INVENTORY…':error?'ARCHIVE UNAVAILABLE':String(sortedProducts.length).padStart(2,'0')+' RESULTS'}</span>
        </div>
        <div className="shop-results-toolbar"><div className="shop-toolbar-note">{isMobile?<button className="shop-filter-trigger" type="button" aria-haspopup="dialog" aria-expanded={mobilePanel==='filters'} onClick={()=>setMobilePanel('filters')}><UiIcon name="tune"/> FILTERS {activeFilterCount>0 && <b>{activeFilterCount}</b>}</button>:<><span className="shop-live-dot" aria-hidden="true"/> {demo?'EXPLORE THE ARCHIVE':'LIVE COLLECTION'}</>}</div>{sortControl}</div>
        {activeFilterCount>0 && <div className="shop-active-filters"><span>{activeFilterCount} FILTER{activeFilterCount===1?'':'S'} ACTIVE</span><button type="button" onClick={clearFilters}>CLEAR ALL ×</button></div>}
`+s.slice(b);
s=s.replace('<div className="shop-product-bottom"><span>{money(product.price)}</span><span>{productStock(product)} IN STOCK</span></div>',`<p className="shop-product-quality">{product.quality || 'Football apparel'}</p>
                <div className="shop-product-sizes" aria-label="Available sizes">{sizes.map(value=><span key={value} className={product.stock?.[value]>0?'is-available':''}>{value}</span>)}<span className="shop-stock-note">{productStock(product)>0?'IN STOCK':'SOLD OUT'}</span></div>
                <div className="shop-product-bottom"><span>{money(product.price)}</span><button className="shop-card-action" type="button" onClick={()=>setSelectedProduct(product)} aria-label={\`Select size for \${product.name}\`}>{productStock(product)>0?'SELECT SIZE':'VIEW DETAILS'} <span aria-hidden="true">↗</span></button></div>`);
s=s.replace('onClick={() => setPage(currentPage - 1)}','onClick={() => goToPage(currentPage - 1)}').replace('onClick={() => setPage(currentPage + 1)}','onClick={() => goToPage(currentPage + 1)}').replace('onClick={() => setPage(pageNumber)}','onClick={() => goToPage(pageNumber)}');
s=s.replace('      </section>\n\n      <section className="shop-editorial-close">','          </div>\n        </div>\n      </section>\n\n      <section className="shop-editorial-close">');
// Preserve first/last page access as the archive grows.
s=s.replace("const pageNumbers = Array.from({ length: Math.min(pageCount, 3) }, (_, index) => pageWindowStart + index);", "const pageNumbers = [...new Set([1,...Array.from({length:Math.min(pageCount,3)},(_,index)=>pageWindowStart+index),pageCount])].filter(n=>n>0).sort((a,b)=>a-b);");
s=s.replace('{pageNumbers.map(pageNumber => <button key={pageNumber}', '{pageNumbers.map((pageNumber,index) => <React.Fragment key={pageNumber}>{index>0 && pageNumber>pageNumbers[index-1]+1 && <span className="shop-page-ellipsis" aria-hidden="true">…</span>}<button');
s=s.replace('onClick={() => goToPage(pageNumber)}>{pageNumber}</button>)}','onClick={() => goToPage(pageNumber)}>{pageNumber}</button></React.Fragment>)}');
writeFileSync(path,s);
