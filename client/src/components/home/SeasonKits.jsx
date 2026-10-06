import React from 'react';
import { money } from '../../format.js';
import { Link } from 'react-router-dom';

export default function SeasonKits({ catalogue, openHomeProduct }) {
  return (
    <section id="selection"className="w-full px-margin-desktop relative bg-white py-8 md:py-10"><div className="flex flex-col gap-space-2xl relative z-10"><div className="flex flex-col gap-space-md pb-space-lg"><div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm"><div className="flex items-center gap-space-sm flex-wrap"><span className="font-label-technical text-label-technical tracking-widest uppercase bg-black text-white px-2.5 py-1 font-bold">CHAPTER // 02 — THE 26/27 ADVANCE CYCLE</span><span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-container text-on-primary-fixed font-label-mono-bold text-label-mono-bold tracking-wider uppercase"><span className="w-2 h-2 rounded-full bg-secondary inline-block "></span>PRE-ORDER OPEN</span><span className="font-label-technical text-label-technical uppercase text-on-surface-variant tracking-wider hidden sm:inline-block">[SYSTEM: MÜLLER-BROCKMANN 2×2 RASTER]</span></div><div className="flex items-center gap-2 font-label-technical text-label-technical uppercase text-on-surface"></div></div><div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pt-2"><div className="flex flex-col"><h2 data-home-reveal="" className="font-headline-lg text-4xl sm:text-5xl lg:text-6xl uppercase text-black font-extrabold tracking-tighter leading-none">26/27 SEASON KITS&nbsp;</h2></div><div className="flex items-center gap-space-xs font-label-mono-bold text-label-mono-bold uppercase tracking-wider text-black px-3 py-2 bg-surface-container"><span className="material-symbols-outlined text-[18px] text-primary">grid_view</span><span className="">2×2 RASTER CATALOG</span></div></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 bg-[#0a0a0a] p-4 md:p-8">
  {/* Card 1: Barca - Top Left Style (Image left, text right) */}
  <div data-home-reveal="" className="flex flex-col sm:flex-row bg-white h-auto sm:h-[500px] overflow-hidden group relative">
    <div className="w-full sm:w-[70%] h-[300px] sm:h-full">
      <img src="https://luxornix.com/cdn/shop/files/FC_Barcelona_2026-27_away_new_kit.webp?v=1787226653" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="FC Barcelona" />
    </div>
    <div className="w-full sm:w-[30%] p-6 flex flex-col justify-between items-start border-l border-black/10">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between w-full">
          <span className="font-label-technical text-[9px] uppercase tracking-widest text-gray-500">Player Issue // 01</span>
        </div>
        <h3 data-home-reveal="" className="font-serif text-3xl uppercase leading-none tracking-tight">FC Barcelona</h3>
        <span className="font-price-currency text-sm font-bold">{(() => { const p = catalogue?.find(x => x.slug === "barcelona-home-26-27"); return p ? money(p.price) : "₹1,499.00"; })()}</span>
      </div>
      <div className="flex flex-col gap-6 w-full mt-8 sm:mt-0">
        <p data-home-reveal="" className="text-[10px] uppercase text-gray-500 leading-relaxed font-label-technical tracking-wide">
          Aerodynamic Taper Fit<br/>Retro Blaugrana Trim<br/>Gold Emblem Spec
        </p>
        <button type="button" onClick={() => openHomeProduct('barcelona-home-26-27', 'jersey')} className="w-full py-3 bg-black text-white font-label-mono-bold text-[10px] uppercase hover:bg-gray-800 transition-colors">Cart +</button>
      </div>
    </div>
  </div>

  {/* Card 2: Real Madrid - Top Right Style (Beige Typography) */}
  <div data-home-reveal="" className="flex flex-col bg-[#EAE8E3] h-[500px] p-8 relative overflow-hidden group justify-between border border-black/5">
    <h3 data-home-reveal="" className="font-serif text-[70px] leading-[0.8] uppercase tracking-tighter text-[#1a1a1a] z-10 w-full text-left">REAL</h3>
    
    <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
       <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScImW5oUQMJmu5eLWKy6GPuUNpPPmVrq-Aw19WjaaN_fWFxU2ntaPxZi2w&s=10" className="h-[280px] w-auto object-cover grayscale mix-blend-multiply" alt="Real Madrid" />
    </div>

    <div className="flex justify-between items-end z-10 w-full">
       <div className="w-1/2 text-[10px] uppercase tracking-widest text-gray-600 font-label-technical leading-relaxed">
         Master Atelier // 02<br/>Bernabéu Nocturne<br/>{(() => { const p = catalogue?.find(x => x.slug === "real-madrid-home-26-27"); return p ? money(p.price) : "₹1,249.00"; })()}
       </div>
       <button type="button" onClick={() => openHomeProduct('real-madrid-home-26-27', 'jersey')} className="py-2.5 px-6 bg-transparent border border-black text-black font-label-mono-bold text-[10px] uppercase hover:bg-black hover:text-white transition-colors">Cart +</button>
    </div>

    <h3 data-home-reveal="" className="font-serif text-[70px] leading-[0.8] uppercase tracking-tighter text-[#1a1a1a] z-10 w-full text-right mt-4">MADRID</h3>
  </div>

  {/* Card 3: Man Utd - Bottom Left Style (Collage / White Space) */}
  <div data-home-reveal="" className="bg-white h-[500px] p-6 relative group overflow-hidden flex flex-col justify-between">
    <div className="flex justify-between w-full h-[45%]">
      <div className="w-[55%] flex gap-2 h-full">
         <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTIj3lPR7KpO1Jdz8v0faQtoTqBQJ2iLzGc0OV8_g-EO1yql1OYf2In2c&s=10" className="w-1/2 h-full object-cover grayscale hover:grayscale-0 transition-colors" style={{objectPosition: 'top'}} alt="Man Utd 1" />
         <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTIj3lPR7KpO1Jdz8v0faQtoTqBQJ2iLzGc0OV8_g-EO1yql1OYf2In2c&s=10" className="w-1/2 h-full object-cover grayscale hover:grayscale-0 transition-colors" style={{objectPosition: 'center'}} alt="Man Utd 2" />
      </div>
      <div className="w-[40%] flex flex-col items-end text-right justify-start gap-2">
         <span className="font-label-technical text-[9px] uppercase tracking-widest text-gray-500">Match Suite // 03</span>
         <h3 data-home-reveal="" className="font-serif text-2xl uppercase leading-none tracking-tight">MANCHESTER<br/>UNITED</h3>
         <span className="font-price-currency text-sm font-bold mt-1">{(() => { const p = catalogue?.find(x => x.slug === "manchester-united-home-26-27" || x.slug === "manchester-united"); return p ? money(p.price) : "₹1,099.00"; })()}</span>
         <button type="button" onClick={() => openHomeProduct('manchester united', 'jersey')} className="mt-4 border-b border-black pb-0.5 text-[10px] font-label-mono-bold uppercase hover:text-gray-500 transition-colors">Add to Cart</button>
      </div>
    </div>
    <div className="w-full h-[50%] flex justify-end">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTIj3lPR7KpO1Jdz8v0faQtoTqBQJ2iLzGc0OV8_g-EO1yql1OYf2In2c&s=10" className="w-[65%] h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" style={{objectPosition: 'bottom'}} alt="Man Utd 3" />
    </div>
  </div>

  {/* Card 4: Juventus - Bottom Right Style (Vertical Strips) */}
  <div data-home-reveal="" className="h-[500px] relative group overflow-hidden bg-[#111] flex border border-white/10">
    <div className="w-1/4 h-full border-r border-black/40 overflow-hidden relative">
       <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe01mvu4CbKOm9xgzQVOkZfLtWLCXfAny8-Th_84mmdcKZ-AxSvkux8h4&s=10" className="absolute top-0 left-0 w-[400%] max-w-none h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100" alt="Juventus 26/27" />
    </div>
    <div className="w-1/4 h-full border-r border-black/40 overflow-hidden relative">
       <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe01mvu4CbKOm9xgzQVOkZfLtWLCXfAny8-Th_84mmdcKZ-AxSvkux8h4&s=10" className="absolute top-0 left-[-100%] w-[400%] max-w-none h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-90 group-hover:opacity-100" alt="Juventus 26/27" />
    </div>
    <div className="w-1/4 h-full border-r border-black/40 overflow-hidden relative">
       <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe01mvu4CbKOm9xgzQVOkZfLtWLCXfAny8-Th_84mmdcKZ-AxSvkux8h4&s=10" className="absolute top-0 left-[-200%] w-[400%] max-w-none h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-100" alt="Juventus 26/27" />
    </div>
    <div className="w-1/4 h-full overflow-hidden relative">
       <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe01mvu4CbKOm9xgzQVOkZfLtWLCXfAny8-Th_84mmdcKZ-AxSvkux8h4&s=10" className="absolute top-0 left-[-300%] w-[400%] max-w-none h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100" alt="Juventus 26/27" />
    </div>
    
    <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
       <div className="flex justify-between w-full">
          <span className="bg-white/90 backdrop-blur-sm text-black px-3 py-1.5 font-label-technical text-[9px] uppercase tracking-widest pointer-events-auto">Prototype // 04</span>
          <span className="bg-white/90 backdrop-blur-sm text-black px-3 py-1.5 font-price-currency text-[10px] font-bold pointer-events-auto">{(() => { const p = catalogue?.find(x => x.slug === "juventus-home-26-27" || x.slug === "juventus-home"); return p ? money(p.price) : "₹1,399.00"; })()}</span>
       </div>
       <div className="flex justify-between items-end w-full">
          <h3 data-home-reveal="" className="font-serif text-3xl uppercase text-white drop-shadow-md leading-none tracking-tight">JUVENTUS<br/>BIANCONERI</h3>
          <button type="button" onClick={() => { const p = catalogue?.find(x => x.slug === "juventus-home-26-27"); if (p) openHomeProduct('juventus-home-26-27', 'jersey'); else openHomeProduct('juventus', 'jersey'); }} className="bg-white text-black px-6 py-2.5 font-label-mono-bold text-[10px] uppercase pointer-events-auto hover:bg-gray-200 transition-colors">Cart +</button>
       </div>
    </div>
  </div>
</div><div className="w-full pt-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md bg-white"><div className="flex flex-col gap-1"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary inline-block"></span><span className="font-label-technical text-label-technical tracking-widest text-black uppercase font-bold">[ ADVANCE ARCHIVE // BATCH ALLOCATION VERIFIED ]</span></div><p data-home-reveal="" className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wide">Complete 26/27 European suite · Club &amp; National Prototype runs · Immediate dispatch</p></div><div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md w-full md:w-auto"><button onClick={() => alert("Admin portal is currently locked for maintenance.")} className="font-label-mono-bold text-label-mono-bold text-black uppercase tracking-wider hover:text-tertiary flex items-center justify-center gap-1.5 transition-colors py-2 px-1 text-left"><span className="material-symbols-outlined text-[16px]">file_download</span><span className="">SPEC LOOKBOOK (PDF) ↗</span></button><Link to="/shop?type=jersey&season=26%2F27" className="px-space-lg py-3 bg-black hover:bg-primary-container text-white hover:text-black font-label-mono-bold text-label-mono-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-200"><span className="">EXPLORE 26/27 SPECIMENS</span><span className="material-symbols-outlined text-[16px]">arrow_forward</span></Link></div></div></div></section>
  );
}