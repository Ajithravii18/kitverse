import React from 'react';
import { money } from '../../format.js';
import { Link } from 'react-router-dom';

export default function SeasonKits({ catalogue, openHomeProduct }) {
  // Use deliberate collection selection (e.g. latest 24/25 kits)
  const seasonProducts = catalogue?.filter(p => p.name.includes('24/25')) || [];
  if (!seasonProducts.length) return null;

  const dominantProduct = seasonProducts[0];
  const supportingProducts = seasonProducts.slice(1, 4);

  return (
    <section className="w-full px-6 md:px-12 bg-background py-24 md:py-32 border-b border-border">
      <div className="flex flex-col gap-16 max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col max-w-2xl">
            <span className="font-sans text-xs uppercase tracking-widest text-secondary mb-4 block">Chapter 02 // 24/25 Season</span>
            <h2 data-home-reveal className="font-display text-display-md uppercase text-foreground m-0 leading-none">
              Season Kits
            </h2>
            <p data-home-reveal className="font-sans text-base text-secondary mt-6">
              The latest matchday identities and technical innovations. Engineered for peak athletic performance and cultural resonance.
            </p>
          </div>
          <Link to="/shop?search=24/25" className="font-sans text-sm uppercase tracking-widest text-foreground hover:text-accent transition-colors border-b border-foreground pb-1">
            Shop 24/25 Arrivals
          </Link>
        </div>

        {/* Editorial Story Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mt-4">
          
          {/* Dominant Story */}
          <div data-home-reveal className="lg:col-span-8 group relative bg-bg-dark-1 aspect-[4/5] md:aspect-square lg:aspect-auto lg:h-[700px] overflow-hidden flex flex-col justify-end p-8 cursor-pointer" onClick={() => openHomeProduct(dominantProduct.slug, 'jersey')}>
            <img 
              src={dominantProduct.image || (dominantProduct.images && dominantProduct.images[0]?.url)} 
              alt={dominantProduct.name} 
              className="absolute inset-0 w-full h-full object-contain p-12 group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
            {/* Dark gradient overlay for text readability only at the bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col gap-3">
                <span className="font-sans text-[10px] uppercase tracking-widest text-secondary bg-background px-3 py-1 w-fit">Featured Issue</span>
                <h3 className="font-display text-4xl md:text-5xl uppercase leading-none tracking-tight text-foreground m-0">{dominantProduct.name}</h3>
                <span className="font-sans text-sm font-bold text-foreground mt-2">{money(dominantProduct.price)}</span>
              </div>
              <button 
                type="button" 
                className="w-full md:w-auto px-8 py-4 bg-foreground text-background font-sans text-xs uppercase tracking-widest hover:bg-accent hover:text-foreground transition-colors border border-transparent hover:border-foreground"
              >
                View Details +
              </button>
            </div>
          </div>

          {/* Supporting Grid */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {supportingProducts.map((product) => (
              <div key={product.slug} data-home-reveal className="group flex items-center bg-card border border-border overflow-hidden h-[220px] cursor-pointer hover:shadow-xl transition-all" onClick={() => openHomeProduct(product.slug, 'jersey')}>
                <div className="w-[45%] h-full bg-bg-dark-1 relative overflow-hidden flex items-center justify-center p-4">
                  <img 
                    src={product.image || (product.images && product.images[0]?.url)} 
                    alt={product.name} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <div className="w-[55%] p-6 flex flex-col justify-center">
                  <span className="font-sans text-[9px] uppercase tracking-widest text-secondary mb-2 line-clamp-1">{product.team}</span>
                  <h4 className="font-display text-xl uppercase leading-tight tracking-tight text-foreground m-0 line-clamp-2">{product.name}</h4>
                  <span className="font-sans text-xs font-bold text-foreground mt-4">{money(product.price)}</span>
                </div>
              </div>
            ))}
            
            {/* View All Card */}
            <Link to="/shop?search=24/25" data-home-reveal className="group flex-1 min-h-[140px] flex flex-col items-center justify-center bg-foreground text-background border border-foreground hover:bg-accent hover:text-foreground transition-colors p-6">
              <span className="font-display text-2xl uppercase text-center leading-tight m-0">Explore Full<br/>Season Collection</span>
              <span className="font-sans text-xs uppercase tracking-widest mt-4 group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
