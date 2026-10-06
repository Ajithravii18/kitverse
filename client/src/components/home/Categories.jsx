import React from 'react';
import { Link } from 'react-router-dom';

export default function Categories() {
  return (
    <section id="filter-index" className="w-full px-4 md:px-margin-desktop bg-background py-16">
  <div className="flex flex-col gap-12 max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden pb-2">
      <div>
        <div className="overflow-hidden pb-1">
          <h2 data-home-reveal className="font-headline-md text-headline-md uppercase text-foreground font-extrabold tracking-tight translate-y-0 opacity-100">
            Explore By Category
          </h2>
        </div>
        <p data-home-reveal className="font-body-md text-foreground/70 max-w-2xl leading-relaxed mt-2 uppercase font-medium">
          Direct access to our complete archive. Filter by club, national team, or apparel type.
        </p>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop stagger-group">



<Link to="/shop?category=club" data-home-reveal="" className="category-card group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300 text-left overflow-hidden cursor-pointer" style={{ textDecoration: 'none' }}>
  <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-surface-container overflow-hidden">
    <img className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700" src="/images/categories/jerseys.jpg" alt="Authentic Football Matchday Jersey"/>
    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-black text-white font-label-mono-bold text-[10px] uppercase tracking-wider">
      <span className="">J</span>
    </div>
    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm font-price-currency text-[11px] font-bold text-black">
      86 UNITS
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex justify-between text-white font-label-technical text-[9px] uppercase tracking-widest">
      <span className="text-white/90 font-bold">MATCHDAY TOPS</span>
      <span className="text-primary-container font-bold">PRE-SEASON</span>
    </div>
  </div>
  <div className="p-space-md flex flex-col justify-between flex-1 gap-2">
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between items-baseline">
        <span className="font-headline-sm text-[18px] uppercase text-black group-hover:text-primary transition-colors">JERSEYS</span>
        <span className="font-label-technical text-on-surface-variant uppercase text-[9px]">TIER 01-04</span>
      </div>
      <span className="font-label-technical text-on-surface-variant uppercase tracking-wider text-[10px]">MATCHDAY &amp; PRE-SEASON TOPS</span>
    </div>
    <div className="flex items-center justify-between pt-2 mt-1">
      <span className="font-label-technical text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">FROM ₹1799</span>
      <span className="material-symbols-outlined text-[18px] text-black group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
    </div>
  </div>
</Link>


<Link to="/shop?quality=Embroidery" data-home-reveal="" className="category-card group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300  text-left overflow-hidden">
 <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-surface-container overflow-hidden">
 <img className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700" src="/images/categories/embroidery.jpg" alt="Direct Needle Embroidery Detail"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-black text-white font-label-mono-bold text-[10px] uppercase tracking-wider">
 <span className="">E</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm font-price-currency text-[11px] font-bold text-black">
 24 UNITS
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex justify-between text-white font-label-technical text-[9px] uppercase tracking-widest">
 <span className="text-white/90 font-bold">NEEDLE DENSITY</span>
 <span className="text-primary-container font-bold">160GSM</span>
 </div>
 </div>
 <div className="p-space-md flex flex-col justify-between flex-1 gap-2">
 <div className="flex flex-col gap-0.5">
 <div className="flex justify-between items-baseline">
 <span className="font-headline-sm text-[18px] uppercase text-black group-hover:text-primary transition-colors">EMBROIDERY</span>
 <span className="font-label-technical text-on-surface-variant uppercase text-[9px]">NEEDLE SPEC</span>
 </div>
 <span className="font-label-technical text-on-surface-variant uppercase tracking-wider text-[10px]">HIGH-TENSILE DIRECT NEEDLE CREST</span>
 </div>
 <div className="flex items-center justify-between pt-2 mt-1">
 <span className="font-label-technical text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">TIER 01 STANDARD</span>
 <span className="material-symbols-outlined text-[18px] text-black group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
 </div>
 </div>
</Link>


<Link to="/shop?quality=First%20copy%20%2B%20shorts" data-home-reveal="" className="category-card group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300  text-left overflow-hidden">
 <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-surface-container overflow-hidden">
 <img className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700" src="/images/categories/combo.png" alt="1st Copy Kit and Shorts Ensemble"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-black text-white font-label-mono-bold text-[10px] uppercase tracking-wider">
 <span className="">F</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm font-price-currency text-[11px] font-bold text-black">
 19 SETS
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex justify-between text-white font-label-technical text-[9px] uppercase tracking-widest">
 <span className="text-white/90 font-bold">COMPLETE SUITE</span>
 <span className="text-primary-container font-bold">MATCH BOX</span>
 </div>
 </div>
 <div className="p-space-md flex flex-col justify-between flex-1 gap-2">
 <div className="flex flex-col gap-0.5">
 <div className="flex justify-between items-baseline">
 <span className="font-headline-sm text-[18px] uppercase text-black group-hover:text-primary transition-colors">1ST COPY + SHORTS</span>
 <span className="font-label-technical text-on-surface-variant uppercase text-[9px]">KIT COMBO</span>
 </div>
 <span className="font-label-technical text-on-surface-variant uppercase tracking-wider text-[10px]">COMPLETE MATCHDAY UNIFORM SUITE</span>
 </div>
 <div className="flex items-center justify-between pt-2 mt-1">
 <span className="font-label-technical text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">TIER 02 SETS // ₹1,099</span>
 <span className="material-symbols-outlined text-[18px] text-black group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
 </div>
 </div>
</Link>


<Link to="/shop?quality=Master%20copy" data-home-reveal="" className="category-card group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300  text-left overflow-hidden">
 <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-surface-container overflow-hidden">
 <img className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700" src="/images/categories/master-copy.jpeg" alt="Master Copy 1:1 Heat-Sealed Chassis"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-black text-white font-label-mono-bold text-[10px] uppercase tracking-wider">
 <span className="">M</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm font-price-currency text-[11px] font-bold text-black">
 22 UNITS
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex justify-between text-white font-label-technical text-[9px] uppercase tracking-widest">
 <span className="text-white/90 font-bold">1:1 HEAT SEAL</span>
 <span className="text-primary-container font-bold">THERMO-TRANSFER</span>
 </div>
 </div>
 <div className="p-space-md flex flex-col justify-between flex-1 gap-2">
 <div className="flex flex-col gap-0.5">
 <div className="flex justify-between items-baseline">
 <span className="font-headline-sm text-[18px] uppercase text-black group-hover:text-primary transition-colors">MASTER COPY</span>
 <span className="font-label-technical text-on-surface-variant uppercase text-[9px]">CALIBRATED</span>
 </div>
 <span className="font-label-technical text-on-surface-variant uppercase tracking-wider text-[10px]">1:1 THERMO-TRANSFER ATELIER SPEC</span>
 </div>
 <div className="flex items-center justify-between pt-2 mt-1">
 <span className="font-label-technical text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">TIER 03 ATELIER // ₹1,249</span>
 <span className="material-symbols-outlined text-[18px] text-black group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
 </div>
 </div>
</Link>


<Link to="/shop?quality=Player%20version" data-home-reveal="" className="category-card group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300  text-left overflow-hidden">
 <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-surface-container overflow-hidden">
 <img className="w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-700" src="/images/categories/player-version.jpg" alt="Player Version Aerodynamic Spec"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-primary-container text-black font-label-mono-bold text-[10px] uppercase tracking-wider font-bold">
 <span className="">P</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm font-price-currency text-[11px] font-bold text-black">
 16 UNITS
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex justify-between text-white font-label-technical text-[9px] uppercase tracking-widest">
 <span className="text-white/90 font-bold">110GSM SLIM</span>
 <span className="text-primary-container font-bold">AEROREADY</span>
 </div>
 </div>
 <div className="p-space-md flex flex-col justify-between flex-1 gap-2">
 <div className="flex flex-col gap-0.5">
 <div className="flex justify-between items-baseline">
 <span className="font-headline-sm text-[18px] uppercase text-black group-hover:text-primary transition-colors">PLAYER VERSION</span>
 <span className="font-label-technical text-on-surface-variant uppercase text-[9px]">ELITE ON-PITCH</span>
 </div>
 <span className="font-label-technical text-on-surface-variant uppercase tracking-wider text-[10px]">110GSM AERODYNAMIC MICRO-PERF</span>
 </div>
 <div className="flex items-center justify-between pt-2 mt-1">
 <span className="font-label-technical text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">ELITE SPEC // ₹1,499</span>
 <span className="material-symbols-outlined text-[18px] text-black group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
 </div>
 </div>
</Link>


<Link to="/shop?retro=true" data-home-reveal="" className="category-card group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300  text-left overflow-hidden">
 <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-surface-container overflow-hidden">
 <img className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700" src="/images/categories/retro.jpg" alt="Historic Vintage Football Kits Archive"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-black text-white font-label-mono-bold text-[10px] uppercase tracking-wider">
 <span className="">R</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm font-price-currency text-[11px] font-bold text-black">
 31 UNITS
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex justify-between text-white font-label-technical text-[9px] uppercase tracking-widest">
 <span className="text-white/90 font-bold">80S &amp; 90S ERA</span>
 <span className="text-primary-container font-bold">HISTORIC RUN</span>
 </div>
 </div>
 <div className="p-space-md flex flex-col justify-between flex-1 gap-2">
 <div className="flex flex-col gap-0.5">
 <div className="flex justify-between items-baseline">
 <span className="font-headline-sm text-[18px] uppercase text-black group-hover:text-primary transition-colors">RETRO ARCHIVE</span>
 <span className="font-label-technical text-on-surface-variant uppercase text-[9px]">VINTAGE</span>
 </div>
 <span className="font-label-technical text-on-surface-variant uppercase tracking-wider text-[10px]">80S &amp; 90S HISTORIC CLASSICS</span>
 </div>
 <div className="flex items-center justify-between pt-2 mt-1">
 <span className="font-label-technical text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">KITVERSE LEGACY EDITIONS</span>
 <span className="material-symbols-outlined text-[18px] text-black group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
 </div>
 </div>
</Link>


<Link to="/shop?type=collar-tshirt" data-home-reveal="" className="category-card group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300  text-left overflow-hidden">
 <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-surface-container overflow-hidden">
 <img className="w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-700" src="/images/categories/collar.jpg" alt="Collar T-Shirts &amp; Tailored Football Polos"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-black text-white font-label-mono-bold text-[10px] uppercase tracking-wider">
 <span className="">C</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm font-price-currency text-[11px] font-bold text-black">
 12 UNITS
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex justify-between text-white font-label-technical text-[9px] uppercase tracking-widest">
 <span className="text-white/90 font-bold">RIBBED POLO</span>
 <span className="text-primary-container font-bold">CASUAL CUT</span>
 </div>
 </div>
 <div className="p-space-md flex flex-col justify-between flex-1 gap-2">
 <div className="flex flex-col gap-0.5">
 <div className="flex justify-between items-baseline">
 <span className="font-headline-sm text-[18px] uppercase text-black group-hover:text-primary transition-colors">COLLAR T-SHIRTS</span>
 <span className="font-label-technical text-on-surface-variant uppercase text-[9px]">TAILORED</span>
 </div>
 <span className="font-label-technical text-on-surface-variant uppercase tracking-wider text-[10px]">RIBBED POLO &amp; CASUAL CUTS</span>
 </div>
 <div className="flex items-center justify-between pt-2 mt-1">
 <span className="font-label-technical text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">TAILORED STREETWEAR</span>
 <span className="material-symbols-outlined text-[18px] text-black group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
 </div>
 </div>
</Link>


<Link to="/shop?type=shorts" data-home-reveal="" className="category-card group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300  text-left overflow-hidden">
 <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-surface-container overflow-hidden">
 <img className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700" src="/images/categories/shorts.jpg" alt="Authentic Club Performance Shorts"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-black text-white font-label-mono-bold text-[10px] uppercase tracking-wider">
 <span className="">S</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm font-price-currency text-[11px] font-bold text-black">
 28 UNITS
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex justify-between text-white font-label-technical text-[9px] uppercase tracking-widest">
 <span className="text-white/90 font-bold">POLY-MESH</span>
 <span className="text-primary-container font-bold">DRAWCORD</span>
 </div>
 </div>
 <div className="p-space-md flex flex-col justify-between flex-1 gap-2">
 <div className="flex flex-col gap-0.5">
 <div className="flex justify-between items-baseline">
 <span className="font-headline-sm text-[18px] uppercase text-black group-hover:text-primary transition-colors">SHORTS</span>
 <span className="font-label-technical text-on-surface-variant uppercase text-[9px]">REPERTOIRE</span>
 </div>
 <span className="font-label-technical text-on-surface-variant uppercase tracking-wider text-[10px]">POLY-MESH PERFORMANCE REPERTOIRE</span>
 </div>
 <div className="flex items-center justify-between pt-2 mt-1">
 <span className="font-label-technical text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">FROM ₹250</span>
 <span className="material-symbols-outlined text-[18px] text-black group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
 </div>
 </div>
</Link>


<Link to="/shop?type=track-pants" data-home-reveal="" className="category-card group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300  text-left overflow-hidden">
 <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-surface-container overflow-hidden">
 <img className="w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-700" src="/images/categories/track-pants.jpg" alt="Track Pants &amp; Technical Runners"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-black text-white font-label-mono-bold text-[10px] uppercase tracking-wider">
 <span className="">T</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm font-price-currency text-[11px] font-bold text-black">
 18 UNITS
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex justify-between text-white font-label-technical text-[9px] uppercase tracking-widest">
 <span className="text-white/90 font-bold">CRINKLE NYLON</span>
 <span className="text-primary-container font-bold">TEARAWAY</span>
 </div>
 </div>
 <div className="p-space-md flex flex-col justify-between flex-1 gap-2">
 <div className="flex flex-col gap-0.5">
 <div className="flex justify-between items-baseline">
 <span className="font-headline-sm text-[18px] uppercase text-black group-hover:text-primary transition-colors">TRACK PANTS</span>
 <span className="font-label-technical text-on-surface-variant uppercase text-[9px]">RUNNERS</span>
 </div>
 <span className="font-label-technical text-on-surface-variant uppercase tracking-wider text-[10px]">240GSM CRINKLE NYLON &amp; RUNNERS</span>
 </div>
 <div className="flex items-center justify-between pt-2 mt-1">
 <span className="font-label-technical text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">FROM ₹999</span>
 <span className="material-symbols-outlined text-[18px] text-black group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
 </div>
 </div>
</Link>


<Link to="/shop?sort=price-low" data-home-reveal="" className="category-card group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300 text-left overflow-hidden cursor-pointer" style={{ textDecoration: 'none' }}>
  <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-surface-container overflow-hidden">
    <img className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700" src="/images/categories/clearance.jpg" alt="Clearance Sale"/>
    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-error text-white font-label-mono-bold text-[10px] uppercase tracking-wider">
      <span className="">%</span>
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex justify-between text-white font-label-technical text-[9px] uppercase tracking-widest">
      <span className="text-white/90 font-bold">ARCHIVE</span>
      <span className="text-error-container font-bold">MARKDOWN</span>
    </div>
  </div>
  <div className="p-space-md flex flex-col justify-between flex-1 gap-2">
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between items-baseline">
        <span className="font-headline-sm text-[18px] uppercase text-error group-hover:text-error transition-colors">CLEARANCE</span>
        <span className="font-label-technical text-on-surface-variant uppercase text-[9px]">SALE</span>
      </div>
      <span className="font-label-technical text-on-surface-variant uppercase tracking-wider text-[10px]">FINAL MATCHDAY MARKDOWNS</span>
    </div>
    <div className="flex items-center justify-between pt-2 mt-1">
      <span className="font-label-technical text-[10px] text-error uppercase tracking-wider font-bold">UP TO 50% OFF</span>
      <span className="material-symbols-outlined text-[18px] text-error group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
    </div>
  </div>
</Link>



<Link to="/shop" data-home-reveal="" className="category-card category-shop-all group" aria-label="Shop all kits and apparel">
 <span className="category-shop-kicker">KITVERSE / THE COMPLETE ARCHIVE</span>
 <div className="category-shop-center"><h3>SHOP<br/>ALL<span aria-hidden="true">↗</span></h3><p>Every kit. Every colour.<br/>Find your matchday.</p></div>
 <span className="category-shop-bottom">EXPLORE THE COLLECTION <span aria-hidden="true">→</span></span>
</Link>
</div></div></section>
  );
}