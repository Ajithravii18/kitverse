import React from 'react';
import { money } from '../../format.js';
import { Link } from 'react-router-dom';
import useHeroMotion from '../../useHeroMotion.js';

export default function Hero({ cms, catalogue }) {
  const heroRef = React.useRef(null);
  useHeroMotion(heroRef);

  return (
    <section ref={heroRef} className="w-full px-4 md:px-margin-desktop py-space-xl flex flex-col md:flex-row gap-8 relative overflow-hidden bg-background">
      {/* Decorative Background Blur */}
      <div className="absolute -top-[30%] -right-[10%] w-[50%] h-[70%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Hero Header */}
      <div className="relative z-10 flex flex-col items-start justify-center md:w-1/2 space-y-6 pt-12 pb-8">
        
        {/* Mask wrapper for headline reveal */}
        <div className="overflow-hidden pb-2 w-full">
          <h1 data-hero-headline className="font-headline-lg text-[clamp(42px,6vw,96px)] leading-[0.9] tracking-tighter text-foreground uppercase drop-shadow-sm max-w-xl font-bold">
            {cms['homepage-hero']?.headline || "THE MATCHDAY ARCHIVE"}
          </h1>
        </div>
        
        <p data-hero-text className="font-body-lg text-[clamp(14px,2vw,18px)] text-foreground/80 max-w-md leading-relaxed font-medium pb-2">
          {cms['homepage-hero']?.aboutText || "Authentic club and national team kits. Precision-crafted for the pitch and the streets."}
        </p>

        <div data-hero-cta className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link to="/shop" className="w-full sm:w-auto text-center bg-foreground text-background hover:text-foreground hover:bg-background border-2 border-foreground font-label-mono-bold uppercase tracking-wider px-10 py-4 shadow-lg hover:shadow-black/10 transition-all active:scale-95 rounded-sm">
            Shop Jerseys
          </Link>
        </div>
      </div>

      {/* Hero Visuals */}
      <div data-hero-image-wrap className="relative z-10 md:w-1/2 flex flex-col group h-[500px] md:h-[640px] bg-card shadow-xl shadow-black/5 overflow-hidden rounded-sm ring-1 ring-border/50">
        <img className="w-full h-full object-cover object-[center_10%] group-hover:scale-105 transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]" 
             alt="Featured Kit" 
             src="https://store.fcbarcelona.com/cdn/shop/files/img-2column-kounde.jpg?v=1782848777&width=2560" />
        
        <div data-hero-badge className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <span className="font-label-technical text-[11px] text-white/80 uppercase tracking-widest block mb-2">LOOK 01 / HIGHLIGHT</span>
          <div className="flex justify-between items-end">
            <span className="font-headline-sm text-3xl text-white uppercase tracking-tight font-bold">PLAYER EDITION</span>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 ring-1 ring-white/20 rounded-sm">
              <span className="font-price-currency text-price-currency text-white font-bold">
                {(() => { const p = catalogue?.find(x => x.slug === "barcelona-away-26-27" || x.team === "Barcelona"); return p ? money(p.price) : "£11,499.00"; })()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
