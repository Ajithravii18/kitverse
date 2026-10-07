const fs = require('fs');

let code = fs.readFileSync('client/src/pages/ShopPage.jsx', 'utf8');

// Replace layout structure with Tailwind
// Replace <div className="shop-shell">
code = code.replace(/<div className="shop-shell">/, '<div className="flex flex-col h-screen overflow-hidden bg-background">');
// Replace <div className="shop-page pt-24" id="top">
code = code.replace(/<div className="shop-page pt-24" id="top">/, '<div className="flex flex-1 overflow-hidden pt-24 px-6 md:px-12 max-w-[1600px] w-full mx-auto gap-8" id="top">');

// Sidebar
code = code.replace(/<aside className="shop-sidebar"[^>]*>/, '<aside className="hidden md:flex flex-col w-[240px] shrink-0 overflow-y-auto pb-12 gap-8" aria-label="Collection filters">');

// Main panel
code = code.replace(/<div className="shop-main-panel"/, '<div className="flex-1 overflow-y-auto pb-12 custom-scrollbar"');

// Catalogue section
code = code.replace(/<section className="shop-catalogue"[^>]*>/, '<section className="flex flex-col gap-6 w-full" id="catalogue" aria-label="Product catalogue">');

// Intro
code = code.replace(/<div className="shop-intro">[\s\S]*?<\/div>/, `<div className="flex flex-col gap-4 border-b border-border pb-6">
          <span className="font-sans text-xs uppercase tracking-widest text-secondary">The Football Archive // Issue 04</span>
          <h1 className="font-display text-display-md uppercase text-foreground m-0 leading-none">Complete Collection</h1>
          <p className="font-sans text-base text-secondary max-w-xl">
            Explore authentic matchday apparel, training gear, and retro classics. Filter by team, season, or specification.
          </p>
        </div>`);

// Mobile filter dialog
code = code.replace(/<dialog ref={filterDialog} className="shop-filter-dialog"[^>]*>/, '<dialog ref={filterDialog} className="fixed inset-0 m-0 w-full h-full max-w-none max-h-none bg-background text-foreground z-50 p-6 overflow-y-auto" aria-label="Collection filters" onCancel={event=>{event.preventDefault();setMobilePanel(null);}} onClick={event=>{if(event.target===filterDialog.current && event.clientX>event.target.getBoundingClientRect().right)setMobilePanel(null);}}>');
code = code.replace(/<button type="button" className="shop-filter-close"[^>]*>CLOSE ×<\/button>/, '<button type="button" className="font-sans text-xs uppercase tracking-widest text-foreground hover:text-accent transition-colors pb-8" aria-label="Close filters" onClick={()=>setMobilePanel(null)}>← Back to Archive</button>');

// Filter controls wrapper mapping (the var filterControls)
// We need to style the filter controls themselves.
const filterControlsRegex = /const filterControls = <>\s*<div className="shop-sidebar-title">[\s\S]*?<\/div>\s*<div className="shop-controls">[\s\S]*?<\/div>\s*<button className="shop-clear-filters"[\s\S]*?<\/button>\s*\{isMobile[\s\S]*?<\/button>\}\s*<\/>;/;

const newFilterControls = `const filterControls = <>
    <div className="flex flex-col gap-2">
      <h2 className="font-display text-2xl uppercase m-0 text-foreground">Filters</h2>
    </div>
    <div className="flex flex-col gap-6 mt-6">
      <label className="flex flex-col gap-2">
        <span className="font-sans text-[10px] uppercase tracking-widest text-secondary">Search</span>
        <input type="search" value={search} onChange={event=>updateParam('search',event.target.value)} placeholder="Player, team, or year..." className="w-full bg-card border border-border p-3 font-sans text-sm text-foreground focus:outline-none focus:border-foreground transition-colors" />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-sans text-[10px] uppercase tracking-widest text-secondary">Category</span>
        <select value={categoryParam} onChange={event=>updateParam('category',event.target.value)} aria-label="Filter by category" className="w-full bg-card border border-border p-3 font-sans text-sm text-foreground focus:outline-none focus:border-foreground transition-colors appearance-none rounded-none">
          <option value="all">All categories</option>
          {categories.map(value=><option key={value} value={value}>{categoryLabels[value]} ({categoryCounts[value]||0})</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-sans text-[10px] uppercase tracking-widest text-secondary">Product Type</span>
        <select value={type} onChange={event=>updateParam('type',event.target.value)} aria-label="Filter by product type" className="w-full bg-card border border-border p-3 font-sans text-sm text-foreground focus:outline-none focus:border-foreground transition-colors appearance-none rounded-none">
          <option value="all">All types</option>
          {productTypes.map(value=><option key={value} value={value}>{typeLabels[value]} ({typeCounts[value]||0})</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-sans text-[10px] uppercase tracking-widest text-secondary">Team</span>
        <select value={team} onChange={event=>updateParam('team',event.target.value)} aria-label="Filter by team" className="w-full bg-card border border-border p-3 font-sans text-sm text-foreground focus:outline-none focus:border-foreground transition-colors appearance-none rounded-none">
          <option value="all">All teams</option>
          {teams.map(value=><option key={value} value={value}>{value}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-sans text-[10px] uppercase tracking-widest text-secondary">Quality</span>
        <select value={quality} onChange={event=>updateParam('quality',event.target.value)} aria-label="Filter by quality" className="w-full bg-card border border-border p-3 font-sans text-sm text-foreground focus:outline-none focus:border-foreground transition-colors appearance-none rounded-none">
          <option value="all">All qualities</option>
          {qualities.map(value=><option key={value} value={value}>{value}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-sans text-[10px] uppercase tracking-widest text-secondary">Size</span>
        <select value={size} onChange={event=>updateParam('size',event.target.value)} aria-label="Filter by available size" className="w-full bg-card border border-border p-3 font-sans text-sm text-foreground focus:outline-none focus:border-foreground transition-colors appearance-none rounded-none">
          <option value="all">Any size</option>
          {sizes.map(value=><option key={value} value={value}>{value}</option>)}
        </select>
      </label>
      <label className="flex items-center gap-3 cursor-pointer group mt-2">
        <input type="checkbox" checked={retroOnly} onChange={event=>updateParam('retro',String(event.target.checked))} className="w-4 h-4 bg-card border border-border checked:bg-foreground checked:border-foreground transition-colors appearance-none flex items-center justify-center after:content-['✓'] after:text-background after:text-[10px] after:opacity-0 checked:after:opacity-100" />
        <span className="font-sans text-xs uppercase tracking-widest text-foreground group-hover:text-accent transition-colors">Retro Only</span>
      </label>
    </div>
    <button className="w-full bg-foreground text-background font-sans text-xs uppercase tracking-widest py-3 mt-6 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed" type="button" onClick={clearFilters} disabled={!activeFilterCount}>CLEAR ALL FILTERS</button>
    {isMobile && <button className="w-full bg-card border border-border text-foreground font-sans text-xs uppercase tracking-widest py-3 mt-4 hover:border-foreground transition-colors" type="button" onClick={()=>setMobilePanel(null)}>SHOW {sortedProducts.length} RESULTS →</button>}
  </>;`;

code = code.replace(filterControlsRegex, newFilterControls);

// Sort controls
code = code.replace(/<div className="shop-sort">[\s\S]*?<\/div>/, `<div className="flex items-center gap-2">
      <span className="font-sans text-[10px] uppercase tracking-widest text-secondary hidden md:inline-block">Sort:</span>
      <select value={sort} onChange={event=>updateParam('sort',event.target.value)} aria-label="Sort products" className="bg-transparent border-none font-sans text-xs uppercase tracking-widest text-foreground focus:outline-none cursor-pointer">
        <option value="featured">Featured</option>
        <option value="newest">Newest Arrivals</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>
    </div>`);

// Catalogue heading
code = code.replace(/<div className="shop-catalogue-heading"[^>]*>[\s\S]*?<\/div>/, ''); // Remove it, we moved it to intro

// Toolbar
code = code.replace(/<div className="shop-results-toolbar">[\s\S]*?<\/div>/, `<div className="flex flex-wrap items-center justify-between gap-4 py-2">
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
        </div>`);

// Footer
const oldFooterRegex = /<footer className="shop-footer">[\s\S]*?<\/footer>/;
code = code.replace(oldFooterRegex, `<footer className="w-full bg-foreground text-background py-16 px-6 border-t border-border mt-24">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <h2 className="font-display text-2xl uppercase m-0 leading-none">KITVERSE</h2>
          <span className="font-sans text-xs uppercase tracking-widest text-background/50">The Football Archive</span>
        </div>
        <div className="flex items-center gap-6">
           <a href="#top" onClick={event => { event.preventDefault(); (isMobile ? window : mainPanel.current)?.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }} className="font-sans text-xs uppercase tracking-widest hover:text-accent transition-colors">BACK TO TOP ↑</a>
        </div>
      </div>
    </footer>`);

fs.writeFileSync('client/src/pages/ShopPage.jsx', code);
console.log('ShopPage rewritten.');
