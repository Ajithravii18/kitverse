import React from 'react';
import { Link } from 'react-router-dom';
import useHeroMotion from '../../useHeroMotion.js';

export default function Hero({ cms, catalogue }) {
  const heroRef = React.useRef(null);
  const ready = catalogue && catalogue.length > 0;
  useHeroMotion(heroRef, ready);
  
  const heroData = cms['homepage-hero'] || {};
  const headline = heroData.headline || 'KITVERSE';
  const description = heroData.title || 'Premium Football Apparel';
  const cta = heroData.cta || 'Shop Collection';

  // Use first 3 products for the 3D fan
  const cards = catalogue?.slice(0, 3) || [];

  return (
    <section ref={heroRef} className="w-full bg-accent relative overflow-hidden flex flex-col items-center min-h-[90vh] pt-20 pb-24 md:pb-0">
      
      {/* Giant Background Typography */}
      <div className="absolute inset-0 flex items-start md:items-center justify-center overflow-hidden pointer-events-none z-0 mt-16 md:mt-0">
        <h1 className="font-display text-[clamp(60px,18vw,350px)] text-text-light uppercase m-0 p-0 tracking-tighter leading-[0.8] text-center whitespace-normal md:whitespace-nowrap opacity-100 mix-blend-overlay max-w-[90vw] md:max-w-none break-words">
          {headline}
        </h1>
      </div>

      {/* Mobile/Desktop composition: 3D Fan of Cards */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex-1 flex flex-col items-center justify-center perspective-[1200px] mt-[15vh] md:mt-[5vh]">
        {cards.map((product, idx) => {
          const rotateY = (idx - 1) * 15; 
          const rotateZ = (idx - 1) * -8;
          const translateZ = Math.abs(idx - 1) * -100;
          const translateX = (idx - 1) * 30;
          const translateY = Math.abs(idx - 1) * 20;

          return (
            <div 
              key={product.slug}
              data-hero-card
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ zIndex: 10 - Math.abs(idx - 1) }}
            >
              <div 
                className="relative w-[60vw] max-w-[220px] sm:w-[280px] md:w-[320px] aspect-[3/4] bg-foreground text-text-light flex flex-col rounded-none shadow-2xl border border-white/10 pointer-events-auto"
                style={{
                  transform: `translateX(${translateX}%) translateY(${translateY}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div className="w-full h-3/5 bg-black relative overflow-hidden">
                  <img 
                    src={product.image || (product.images && product.images[0]?.url)} 
                    alt={product.name}
                    className="w-full h-full object-cover object-top opacity-90"
                  />
                </div>
                <div className="p-4 md:p-5 flex flex-col justify-between flex-1">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-body-md text-base font-medium leading-tight">{product.name}</h3>
                    <span className="font-label-technical text-xs text-text-light/50 uppercase">{product.team}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-label-technical text-xs bg-accent text-text-light px-2 py-0.5">
                      {product.season || 'NEW'}
                    </span>
                    <Link 
                      to={`/shop?search=${encodeURIComponent(product.name)}`}
                      className="bg-text-light text-foreground font-label-mono-bold text-xs px-3 py-1.5 hover:bg-gray-200 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Information Row */}
      <div className="w-full px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-6 z-20 pointer-events-none mt-[40vh] md:mt-0 md:absolute md:bottom-8">
        
        <div className="flex flex-col text-text-light text-center sm:text-left max-w-sm" data-hero-text>
          <span className="font-body-md text-lg leading-snug font-bold">
            {description}
          </span>
          <span className="font-body-sm text-sm leading-snug opacity-90 flex items-center justify-center sm:justify-start gap-2 mt-2">
            Wear it. Share it. Be supported. 
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
          </span>
        </div>

        <Link 
          to="/shop" 
          data-hero-cta 
          className="pointer-events-auto bg-foreground text-text-light px-8 py-4 flex items-center gap-4 hover:bg-text-light hover:text-foreground transition-colors duration-300 w-full sm:w-auto justify-center"
        >
          <span className="font-label-mono-bold text-sm uppercase tracking-widest">{cta}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        </Link>
        
      </div>
      
    </section>
  );
}
