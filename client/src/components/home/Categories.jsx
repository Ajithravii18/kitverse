import React from 'react';
import { Link } from 'react-router-dom';

export default function Categories() {
  const specs = [
    { label: 'Embroidery', url: '/shop?quality=Embroidery', desc: 'Stitched Durability' },
    { label: 'First Copy + Shorts', url: '/shop?quality=First%20copy%20%2B%20shorts', desc: 'Complete Kit' },
    { label: 'Master Copy', url: '/shop?quality=Master%20copy', desc: 'Premium Replica' },
    { label: 'Player Version', url: '/shop?quality=Player%20version', desc: 'Matchday Spec' },
    { label: 'Retro', url: '/shop?retro=true', desc: 'Heritage Archives' },
    { label: 'National Teams', url: '/shop?category=national', desc: 'Global Stage' },
  ];

  return (
    <section id="filter-index" className="w-full px-6 md:px-12 bg-background py-24 md:py-32 border-b border-border">
      <div className="flex flex-col max-w-[1400px] mx-auto gap-12 md:gap-20">
        
        {/* Strong Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col max-w-2xl">
            <span className="font-sans text-xs uppercase tracking-widest text-secondary mb-4 block">Chapter 01 // The Index</span>
            <h2 data-home-reveal className="font-display text-display-md uppercase text-foreground m-0 leading-none">
              Explore By Collection
            </h2>
          </div>
          <Link to="/shop" className="font-sans text-sm uppercase tracking-widest text-foreground hover:text-accent transition-colors border-b border-foreground pb-1 w-fit">
            View Complete Archive
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Main Large Tile (Jerseys) */}
          <Link to="/shop?type=jersey" data-home-reveal className="md:col-span-8 group relative bg-bg-dark-1 aspect-[4/3] md:aspect-auto md:h-[600px] overflow-hidden flex flex-col justify-end p-8 md:p-12">
            <img src="/images/categories/jerseys.jpg" alt="Matchday Jerseys" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-start gap-4">
              <span className="font-sans text-xs bg-foreground text-background px-3 py-1 uppercase tracking-widest">Apparel</span>
              <h3 className="font-display text-5xl md:text-7xl uppercase text-foreground m-0 leading-none">Matchday<br/>Jerseys</h3>
            </div>
          </Link>

          {/* Secondary Stack (Shorts & Track Pants) */}
          <div className="md:col-span-4 flex flex-col gap-4 md:gap-6">
            <Link to="/shop?type=shorts" data-home-reveal className="group relative bg-bg-dark-2 flex-1 min-h-[280px] overflow-hidden flex flex-col justify-end p-8">
              <img src="/images/categories/shorts.jpg" alt="Performance Shorts" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col items-start gap-2">
                <span className="font-sans text-[10px] bg-foreground text-background px-2 py-1 uppercase tracking-widest">Performance</span>
                <h3 className="font-display text-3xl uppercase text-foreground m-0">Shorts</h3>
              </div>
            </Link>

            <Link to="/shop?type=track-pants" data-home-reveal className="group relative bg-border flex-1 min-h-[280px] overflow-hidden flex flex-col justify-end p-8">
              <img src="/images/categories/track-pants.jpg" alt="Track Pants" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col items-start gap-2">
                <span className="font-sans text-[10px] bg-foreground text-background px-2 py-1 uppercase tracking-widest">Warmup</span>
                <h3 className="font-display text-3xl uppercase text-foreground m-0">Track Pants</h3>
              </div>
            </Link>
          </div>
        </div>

        {/* Quality & Spec Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" data-home-reveal>
          {specs.map(spec => (
            <Link key={spec.label} to={spec.url} className="group flex flex-col gap-2 p-6 bg-card border border-border hover:border-foreground hover:bg-foreground hover:text-background transition-colors">
              <h4 className="font-display text-xl uppercase leading-none m-0">{spec.label}</h4>
              <span className="font-sans text-[10px] uppercase tracking-widest text-secondary group-hover:text-background/70">{spec.desc}</span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
