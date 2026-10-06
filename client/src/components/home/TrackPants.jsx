import React from 'react';
import { Link } from 'react-router-dom';

export default function TrackPants({ openHomeProduct }) {
  return (
    <section id="track-pants"className="w-full px-margin-desktop relative bg-white py-8 md:py-10"><div className="flex flex-col gap-space-2xl relative z-10"><div className="flex flex-col gap-space-md pb-space-lg"><div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm"><div className="flex items-center gap-space-sm flex-wrap"><span className="font-label-technical text-label-technical tracking-widest uppercase bg-black text-white px-2.5 py-1 font-bold">CHAPTER // 05 — LOWER SILHOUETTES &amp; RUNNERS</span><span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-container text-on-primary-fixed font-label-mono-bold text-label-mono-bold tracking-wider uppercase"><span className="w-2 h-2 rounded-full bg-secondary inline-block "></span>NEW ARRIVALS</span><span className="font-label-technical text-label-technical uppercase text-on-surface-variant tracking-wider hidden sm:inline-block">[SYSTEM: HIGH-TENACITY NYLON &amp; TAILORED FLEECE]</span></div><div className="flex items-center gap-2 font-label-technical text-label-technical uppercase text-on-surface"><span className="px-2 py-0.5 hidden lg:inline-block">[SIZES: S · M · L · XL · XXL]</span><span className="px-2 py-0.5 bg-black text-white font-bold">[INR PRICING FROM ₹999]</span></div></div><div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pt-2"><div className="flex flex-col"><h2 data-home-reveal="" className="font-headline-lg text-4xl sm:text-5xl lg:text-6xl uppercase text-black font-extrabold tracking-tighter leading-none">TRACK PANTS //&nbsp;</h2></div><div className="flex items-center gap-space-xs font-label-mono-bold text-label-mono-bold uppercase tracking-wider text-black px-3 py-2 bg-surface-container"><span className="material-symbols-outlined text-[18px] text-primary">straighten</span><span className="">ERGONOMIC // TAPER &amp; FLARE FIT</span></div></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 bg-[#0a0a0a] p-4 md:p-8">
  {/* Card 1: Top Left Style */}
  <div data-home-reveal="" className="flex flex-col sm:flex-row bg-white h-auto sm:h-[500px] overflow-hidden group relative">
    <div className="w-full sm:w-[70%] h-[300px] sm:h-full">
      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVj37i2iGMqimQ-2TzAseRMQX1DvwMKNNoYzI_-FOgJz-Bzuo4cwV0i4dzyXpkx1cpAlotsapSLchdKCze2QoIzRi_zUrRKG-qtvtJQU6VcJePydJHa5qgXIKytuvbU-XOZ4tpcg8tW8A09HteRn2paQqMufJysE21DdgYRk1SILjEQXX7XGx0DCmlLHgwzetj_xg83OVaN9_MVaCBQesTwxRJl6KFObBef8yyAwnq2hqdIRphje0yrkcYr7JKw6E_QAs" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Burgundy Track Trousers" />
    </div>
    <div className="w-full sm:w-[30%] p-6 flex flex-col justify-between items-start border-l border-black/10">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between w-full">
          <span className="font-label-technical text-[9px] uppercase tracking-widest text-gray-500">Runner // 01</span>
        </div>
        <h3 data-home-reveal="" className="font-serif text-3xl uppercase leading-none tracking-tight">Burgundy<br/>Pop-Stud</h3>
        <span className="font-price-currency text-sm font-bold">₹1,299</span>
      </div>
      <div className="flex flex-col gap-6 w-full mt-8 sm:mt-0">
        <p data-home-reveal="" className="text-[10px] uppercase text-gray-500 leading-relaxed font-label-technical tracking-wide">
          Chalk White Contrast<br/>Relaxed Loose Hem<br/>Heavyweight Shell
        </p>
        <button type="button" onClick={() => openHomeProduct('burgundy', 'track-pants')} className="w-full py-3 bg-black text-white font-label-mono-bold text-[10px] uppercase hover:bg-gray-800 transition-colors">Cart +</button>
      </div>
    </div>
  </div>

  {/* Card 2: Collage Style (Bottom Left) */}
  <div data-home-reveal="" className="bg-white h-[500px] p-6 relative group overflow-hidden flex flex-col justify-between">
    <div className="flex justify-between w-full h-[45%]">
      <div className="w-[55%] flex gap-2 h-full">
         <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuWsZOv5lHiDErY97I-MbR2ZUf1NhP8uqi8vMUxr9nMCc7JiuGTKmICSiJRYsCFv9kkuXZObPzR1vPHYyyhfCkngl7aJGN7k9bkRTnjo5Me5vaXZO2l7HgV824ppP7uK517RObE930Mi4iy932xJRa94OTc3Z00V8d39B-eYRTm0iX-69KNiA3MA9sLKBOLbUZKbPaIZRDIqiypbLW3KfPN10y5toOhA55XUEN3Z7CJYEpzbnhbYVwTi4cdbCEJ5yihvE" className="w-1/2 h-full object-cover grayscale hover:grayscale-0 transition-colors" style={{objectPosition: 'top'}} alt="Slate Grey Track Pants 1" />
         <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuWsZOv5lHiDErY97I-MbR2ZUf1NhP8uqi8vMUxr9nMCc7JiuGTKmICSiJRYsCFv9kkuXZObPzR1vPHYyyhfCkngl7aJGN7k9bkRTnjo5Me5vaXZO2l7HgV824ppP7uK517RObE930Mi4iy932xJRa94OTc3Z00V8d39B-eYRTm0iX-69KNiA3MA9sLKBOLbUZKbPaIZRDIqiypbLW3KfPN10y5toOhA55XUEN3Z7CJYEpzbnhbYVwTi4cdbCEJ5yihvE" className="w-1/2 h-full object-cover grayscale hover:grayscale-0 transition-colors" style={{objectPosition: 'center'}} alt="Slate Grey Track Pants 2" />
      </div>
      <div className="w-[40%] flex flex-col items-end text-right justify-start gap-2">
         <span className="font-label-technical text-[9px] uppercase tracking-widest text-gray-500">Runner // 02</span>
         <h3 data-home-reveal="" className="font-serif text-2xl uppercase leading-none tracking-tight">Slate Grey<br/>Tapered</h3>
         <span className="font-price-currency text-sm font-bold mt-1">₹999</span>
         <button type="button" onClick={() => openHomeProduct('slate grey', 'track-pants')} className="mt-4 border-b border-black pb-0.5 text-[10px] font-label-mono-bold uppercase hover:text-gray-500 transition-colors">Add to Cart</button>
      </div>
    </div>
    <div className="w-full h-[50%] flex justify-end">
      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuWsZOv5lHiDErY97I-MbR2ZUf1NhP8uqi8vMUxr9nMCc7JiuGTKmICSiJRYsCFv9kkuXZObPzR1vPHYyyhfCkngl7aJGN7k9bkRTnjo5Me5vaXZO2l7HgV824ppP7uK517RObE930Mi4iy932xJRa94OTc3Z00V8d39B-eYRTm0iX-69KNiA3MA9sLKBOLbUZKbPaIZRDIqiypbLW3KfPN10y5toOhA55XUEN3Z7CJYEpzbnhbYVwTi4cdbCEJ5yihvE" className="w-[65%] h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" style={{objectPosition: 'bottom'}} alt="Slate Grey Track Pants 3" />
    </div>
  </div>
</div><div className="w-full pt-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md bg-white"><div className="flex flex-col gap-1"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary inline-block"></span><span className="font-label-technical text-label-technical tracking-widest text-black uppercase font-bold">[ ARCHIVE RUN: 330 UNITS AVAILABLE ]</span></div><p data-home-reveal="" className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wide">Dispatch within 24h · All-India Express · Engineered pitchside silhouettes</p></div><div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md w-full md:w-auto"><button onClick={() => alert("Admin portal is currently locked for maintenance.")} className="font-label-mono-bold text-label-mono-bold text-black uppercase tracking-wider hover:text-tertiary flex items-center justify-center gap-1.5 transition-colors py-2 px-1 text-left"><span className="material-symbols-outlined text-[16px]">straighten</span><span className="">INSEAM &amp; SIZING ARCHIVE ↗</span></button><Link to="/shop?type=track-pants" className="px-space-lg py-3 bg-black hover:bg-primary-container text-white hover:text-black font-label-mono-bold text-label-mono-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-200"><span className="">EXPLORE ALL TRACK PANTS</span><span className="material-symbols-outlined text-[16px]">arrow_forward</span></Link></div></div></div></section>
  );
}