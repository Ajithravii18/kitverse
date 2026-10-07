const fs = require('fs');

let code = fs.readFileSync('client/src/pages/ShopPage.jsx', 'utf8');

// We will find everything from "return <div className="flex flex-col h-screen" to the end of the file.
// Wait, we need to extract everything BEFORE return, and just append our new return statement.

const beforeReturn = code.substring(0, code.indexOf('return <div className="flex flex-col h-screen overflow-hidden bg-background">'));

const newReturn = `return <div className="flex flex-col h-screen overflow-hidden bg-background">
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

    {selectedProduct && <ProductDetailModal product={selectedProduct} products={products}
      onSelectRelated={setSelectedProduct} onClose={() => setSelectedProduct(null)}
      onAdd={handleAdd} demo={demo} cart={cart} />}
  </div>;
}
`;

fs.writeFileSync('client/src/pages/ShopPage.jsx', beforeReturn + newReturn);
console.log('Fixed completely ShopPage');
