import React from 'react';
import { money } from '../../format.js';
import ProductImage from '../ProductImage.jsx';
import { sizes } from '../../../../shared/catalog.js';
import { stockFor } from '../../../../shared/inventory.js';

export function ProductCard({ p, onOpen, pIdx }) {
  const availableSizes = sizes.filter(s => stockFor(p, s) > 0);
  const isSoldOut = availableSizes.length === 0;

  const hasAltImage = p.images && p.images.length > 1;

  return (
    <article 
      className="group relative flex flex-col bg-card hover:shadow-xl hover:shadow-black/5 transition-all duration-500 overflow-hidden reveal-init rounded-sm ring-1 ring-border/30 hover:ring-border/80" 
      data-home-reveal=""
      style={{ '--i': pIdx % 8 }}
    >
      <button 
        type="button"
        className="relative w-full aspect-[4/5] bg-surface-container overflow-hidden block"
        onClick={() => onOpen(p)}
        aria-label={`View ${p.name} details`}
      >
        <ProductImage 
          src={p.image || (p.images && p.images[0]?.url)} 
          alt={p.name} 
          loading="lazy" 
          className={`w-full h-full object-cover object-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${hasAltImage ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'}`}
        />
        {hasAltImage && (
          <img 
            src={p.images[1].url} 
            alt={`Alternate view of ${p.name}`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          />
        )}
        
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-10 pointer-events-none">
          {p.category === 'national' && (
            <div className="px-2.5 py-1 bg-primary text-on-primary font-label-mono-bold text-[10px] uppercase tracking-[0.2em] shadow-sm">
              NATIONAL
            </div>
          )}
          
          {isSoldOut && (
            <div className="px-2.5 py-1 bg-foreground text-background font-label-technical text-[10px] uppercase tracking-[0.2em] shadow-sm ml-auto">
              SOLD OUT
            </div>
          )}
        </div>
      </button>

      <div className="flex flex-col flex-1 p-5 gap-3 bg-card border-t border-border/20 z-10 relative">
        <div className="flex flex-col gap-1 flex-1">
          <span className="font-label-technical text-foreground/60 uppercase text-[10px] tracking-[0.15em]">
            {p.quality} // {p.team}
          </span>
          <h3 className="font-headline-sm text-[18px] sm:text-[20px] uppercase text-foreground leading-tight line-clamp-2 mt-1">
            {p.name}
          </h3>
        </div>

        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-end justify-between">
            <span className="font-price-currency text-[16px] font-bold text-foreground tracking-tight">
              {money(p.price)}
            </span>
            <span className="font-label-technical text-[10px] text-foreground/50 uppercase tracking-widest">
              {isSoldOut ? 'RESTOCKING' : `${availableSizes.length} SIZES`}
            </span>
          </div>

          <button 
            type="button" 
            className={`w-full py-3.5 font-label-mono-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-300 rounded-sm ${isSoldOut ? 'bg-border/30 text-foreground/40 cursor-not-allowed' : 'bg-transparent text-foreground border border-border/80 hover:bg-foreground hover:text-background hover:border-transparent active:scale-[0.98]'}`}
            onClick={() => onOpen(p)}
            disabled={isSoldOut}
          >
            {isSoldOut ? 'SOLD OUT' : 'QUICK VIEW'}
          </button>
        </div>
      </div>
    </article>
  );
}
