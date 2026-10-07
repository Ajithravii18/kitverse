import React from 'react';
import { money } from '../../format.js';
import ProductImage from '../ProductImage.jsx';
import { sizes } from '../../../../shared/catalog.js';
import { stockFor } from '../../../../shared/inventory.js';

export function ProductCard({ p, onOpen, pIdx, forceDarkTheme }) {
  const availableSizes = sizes.filter(s => stockFor(p, s) > 0);
  const isSoldOut = availableSizes.length === 0;

  const hasAltImage = p.images && p.images.length > 1;

  return (
    <article 
      className="group relative flex flex-col bg-card hover:shadow-xl hover:shadow-black/5 transition-all duration-500 overflow-hidden rounded-none ring-1 ring-border hover:ring-foreground/10" 
      data-home-reveal=""
      style={{ '--i': pIdx % 8 }}
    >
      <button 
        type="button"
        className="relative w-full aspect-[4/5] bg-bg-dark-1 overflow-hidden block"
        onClick={() => onOpen(p)}
        aria-label={`View ${p.name}`}
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
          <div className="flex flex-col gap-2">
            {p.featured && (
              <span className="bg-foreground text-background font-sans text-[10px] uppercase px-2 py-1 tracking-widest shadow-sm w-fit">
                Featured
              </span>
            )}
            {p.tag && (
              <span className="bg-background text-foreground font-sans text-[10px] uppercase px-2 py-1 tracking-widest shadow-sm border border-border w-fit">
                {p.tag}
              </span>
            )}
          </div>
          {isSoldOut && (
            <span className="bg-background/90 text-foreground font-sans text-[10px] uppercase px-2 py-1 shadow-sm backdrop-blur-sm border border-border">
              Sold Out
            </span>
          )}
        </div>
      </button>

      <div className="p-4 flex flex-col gap-4 flex-1 justify-between bg-card">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-start gap-4">
            <h3 className="font-display text-xl uppercase text-foreground leading-tight m-0">{p.name}</h3>
            <span className="font-sans font-bold text-[13px] text-foreground shrink-0">{money(p.price)}</span>
          </div>
          <span className="font-sans text-[10px] uppercase tracking-widest text-secondary mt-1">{p.team} // {p.season || 'ARCHIVE'}</span>
        </div>

        <div className="flex flex-col gap-4 mt-auto pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5 flex-wrap">
            {sizes.map(s => {
              const available = stockFor(p, s) > 0;
              return (
                <span 
                  key={s} 
                  className={`font-sans text-[10px] px-1.5 py-0.5 border uppercase tracking-widest ${available ? 'border-border text-foreground/80' : 'border-transparent text-secondary/40 line-through'}`}
                >
                  {s}
                </span>
              );
            })}
          </div>

          <button 
            type="button" 
            className={`w-full py-3 font-sans text-xs uppercase tracking-widest transition-all duration-300 ${isSoldOut ? 'bg-border/30 text-secondary/40 cursor-not-allowed' : 'bg-transparent text-foreground border border-border hover:bg-foreground hover:text-background hover:border-transparent active:scale-[0.98]'}`}
            onClick={() => onOpen(p)}
            disabled={isSoldOut}
          >
            {isSoldOut ? 'Sold Out' : 'Quick View'}
          </button>
        </div>
      </div>
    </article>
  );
}
