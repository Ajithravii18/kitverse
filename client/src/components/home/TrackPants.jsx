import React from 'react';
import { Link } from 'react-router-dom';

export default function TrackPants() {
  return (
    <section className="w-full px-6 md:px-12 bg-card py-24 md:py-32 border-b border-border">
      <div className="flex flex-col gap-16 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col max-w-2xl">
            <span className="font-sans text-xs uppercase tracking-widest text-secondary mb-4 block">Apparel // Warmup Spec</span>
            <h2 data-home-reveal className="font-display text-display-md uppercase text-foreground m-0 leading-none">
              Track Pants
            </h2>
            <p data-home-reveal className="font-sans text-base text-secondary mt-6">
              Tapered cuts with high-flex elastane blends. Designed for sideline readiness and off-pitch style.
            </p>
          </div>
          <Link to="/shop?type=track-pants" className="font-sans text-sm uppercase tracking-widest text-foreground hover:text-accent transition-colors border-b border-foreground pb-1 w-fit">
            Explore Track Archive
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
          <Link to="/shop?type=track-pants" data-home-reveal className="md:col-span-8 group relative bg-bg-dark-1 aspect-[16/9] overflow-hidden flex flex-col justify-end p-8 md:p-12">
            <img src="/images/categories/track-pants.jpg" alt="Track Pants Collection" className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col gap-4">
              <span className="font-sans text-xs uppercase tracking-widest bg-foreground text-background px-3 py-1 w-fit">Featured Issue</span>
              <h3 className="font-display text-4xl md:text-5xl uppercase text-foreground m-0">Pre-Match Fits</h3>
            </div>
          </Link>

          <div className="md:col-span-4 flex flex-col gap-6" data-home-reveal>
            <div className="flex-1 bg-background border border-border p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              
              <div className="relative z-10 flex flex-col gap-6 transition-colors duration-500 group-hover:text-background text-foreground">
                <h3 className="font-display text-3xl md:text-4xl uppercase m-0 leading-none">Tapered<br/>Comfort</h3>
                <p className="font-sans text-sm text-secondary group-hover:text-background/70 leading-relaxed">
                  Our track pants feature ankle zips and ergonomic paneling, bridging the gap between athletic utility and streetwear aesthetic.
                </p>
                <Link to="/shop?type=track-pants" className="mt-4 font-sans text-xs uppercase tracking-widest flex items-center gap-2 group-hover:text-background text-foreground">
                  Shop Collection <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
