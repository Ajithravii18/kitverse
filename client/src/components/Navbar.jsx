import UiIcon from './UiIcon.jsx';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useBag from '../useBag.js';
import { money } from '../format.js';
import CartDrawer from './CartDrawer.jsx';

export default function Navbar() {
  const { cart, setCart, restore } = useBag();
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  useEffect(() => {
    fetch('/api/products')
      .then(res => {if(!res.ok)throw new Error('Catalogue unavailable');return res.json();})
      .then(data => {
        const catalog = data.products || data;
        restore(catalog);
      })
      .catch(err => console.error("Failed to fetch products for Navbar cart:", err));
    // eslint-disable-next-line
  }, []);

  const cartState = cart;

  const cartItemCount = cartState.reduce((total, item) => total + item.qty, 0);
  const cartTotal = cartState.reduce((total, item) => total + item.price * item.qty, 0);

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-b border-black/10">
        <div className="h-24 w-full px-4 md:px-margin-desktop flex flex-col justify-between py-space-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-md">
              <Link to="/" className="font-headline-sm text-headline-sm uppercase text-on-surface hover:text-on-surface-variant transition-colors">+ KITVERSE</Link>
              <span className="font-label-technical text-label-technical tracking-widest text-on-surface-variant uppercase px-space-xs py-0.5 bg-surface-container hidden sm:inline-block">ISSUE 04 // MATCHDAY EDITORIAL</span>
            </div>
            <div className="flex items-center gap-space-lg">
              <div className="hidden md:flex items-center gap-space-xs font-label-technical text-label-technical text-on-surface-variant">
                <svg className="w-12 h-4 text-on-surface fill-current" viewBox="0 0 100 24">
                  <rect height="24" width="3" x="0" y="0"/><rect height="24" width="2" x="6" y="0"/><rect height="24" width="6" x="11" y="0"/><rect height="24" width="2" x="20" y="0"/><rect height="24" width="4" x="25" y="0"/><rect height="24" width="1" x="32" y="0"/><rect height="24" width="5" x="36" y="0"/><rect height="24" width="2" x="44" y="0"/><rect height="24" width="7" x="49" y="0"/><rect height="24" width="3" x="59" y="0"/><rect height="24" width="1" x="65" y="0"/><rect height="24" width="4" x="69" y="0"/><rect height="24" width="5" x="76" y="0"/><rect height="24" width="2" x="84" y="0"/><rect height="24" width="3" x="89" y="0"/><rect height="24" width="5" x="95" y="0"/>
                </svg>
                <span className="font-label-mono-bold text-label-mono-bold">KV-2025-04</span>
              </div>
              <Link to="/profile" aria-label="Account" className="flex items-center gap-1 font-label-mono-bold text-[14px] text-on-surface hover:text-on-surface-variant transition-colors">
                <UiIcon name="person" className="text-[20px]" />
                <span className="inline">ACCOUNT</span>
              </Link>
              <button onClick={() => setIsCartOpen(true)} aria-label={`Cart with ${cartItemCount} items`} className="flex items-center font-label-mono-bold text-[12px] uppercase bg-black text-white px-3 py-1.5 hover:bg-primary-container hover:text-black transition-colors group border border-black cursor-pointer">
                <UiIcon name="shopping_bag" className="text-[15px] mr-2" />
                <span className="tracking-widest">CART</span>
                <span className="mx-2 text-white/40 group-hover:text-black/40">|</span>
                <span className="tracking-widest">{String(cartItemCount).padStart(2, '0')}</span>
              </button>
            </div>
          </div>
          <div className="relative w-full min-w-0 pt-space-xs pb-1 -mb-1">
            <div className="flex items-center justify-between overflow-x-auto custom-scrollbar w-full pr-6 md:pr-0">
              <nav className="flex items-center gap-space-lg whitespace-nowrap">
                <Link className="font-label-mono-bold text-label-mono-bold uppercase text-on-surface-variant hover:text-on-surface transition-colors py-1 px-space-xs" to="/shop">SHOP ALL</Link>
                <Link className="font-label-mono-bold text-label-mono-bold uppercase text-on-surface-variant hover:text-on-surface transition-colors py-1 px-space-xs bg-primary-container text-on-primary-fixed" to="/#selection" onClick={(e) => { const el = document.getElementById('selection'); if(el) { e.preventDefault(); el.scrollIntoView({behavior: 'smooth'}); window.history.pushState(null, '', '/#selection'); } }}>26/27 KITS</Link>
                <Link className="font-label-mono-bold text-label-mono-bold uppercase text-on-surface-variant hover:text-on-surface transition-colors py-1 px-space-xs" to="/#filter-index" onClick={(e) => { const el = document.getElementById('filter-index'); if(el) { e.preventDefault(); el.scrollIntoView({behavior: 'smooth'}); window.history.pushState(null, '', '/#filter-index'); } }}>CATEGORIES</Link>
                <Link className="font-label-mono-bold text-label-mono-bold uppercase text-on-surface-variant hover:text-on-surface transition-colors py-1 px-space-xs" to="/#clubs-directory" onClick={(e) => { const el = document.getElementById('clubs-directory'); if(el) { e.preventDefault(); el.scrollIntoView({behavior: 'smooth'}); window.history.pushState(null, '', '/#clubs-directory'); } }}>TEAMS</Link>
                <Link className="font-label-mono-bold text-label-mono-bold uppercase text-on-surface-variant hover:text-on-surface transition-colors py-1 px-space-xs" to="/#shorts" onClick={(e) => { const el = document.getElementById('shorts'); if(el) { e.preventDefault(); el.scrollIntoView({behavior: 'smooth'}); window.history.pushState(null, '', '/#shorts'); } }}>SHORTS</Link>
                <Link className="font-label-mono-bold text-label-mono-bold uppercase text-on-surface-variant hover:text-on-surface transition-colors py-1 px-space-xs" to="/#track-pants" onClick={(e) => { const el = document.getElementById('track-pants'); if(el) { e.preventDefault(); el.scrollIntoView({behavior: 'smooth'}); window.history.pushState(null, '', '/#track-pants'); } }}>TRACK PANTS</Link>
                <Link className="font-label-mono-bold text-label-mono-bold uppercase text-on-surface-variant hover:text-on-surface transition-colors py-1 px-space-xs" to="/#community-reviews" onClick={(e) => { const el = document.getElementById('community-reviews'); if(el) { e.preventDefault(); el.scrollIntoView({behavior: 'smooth'}); window.history.pushState(null, '', '/#community-reviews'); } }}>REVIEWS</Link>
              </nav>
              <div className="hidden lg:flex items-center gap-space-md shrink-0 ml-4">
                <span className="font-label-technical text-label-technical uppercase text-on-surface-variant">COORDINATES: 53.4808A N, 2.2426A W // ATELIER RUN 500</span>
              </div>
            </div>
            
            {/* Mobile Scroll Indicator Overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-surface via-surface/90 to-transparent pointer-events-none md:hidden flex items-center justify-end pr-2">
              <UiIcon name="arrow_forward" className="text-[16px] text-on-surface/50 animate-pulse mt-1" />
            </div>
          </div>
        </div>
      </header>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cartState} setCart={setCart} />
    </>
  );
}
