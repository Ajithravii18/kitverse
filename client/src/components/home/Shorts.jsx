import React from 'react';
import { Link } from 'react-router-dom';

export default function Shorts({ openHomeProduct }) {
  return (
    <section id="shorts"className="w-full px-margin-desktop relative bg-white py-8 md:py-10"><div className="flex flex-col gap-space-2xl relative z-10"><div className="flex flex-col gap-space-md pb-space-lg"><div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm"><div className="flex items-center gap-2 font-label-technical text-label-technical uppercase text-on-surface"><span className="px-2 py-0.5 hidden lg:inline-block">[SIZES: S · M · L · XL · XXL]</span><span className="px-2 py-0.5 bg-black text-white font-bold">[INR PRICING FROM ₹250]</span></div></div><div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pt-2"><div className="flex flex-col"><h2 data-home-reveal="" className="font-headline-lg text-4xl sm:text-5xl lg:text-6xl uppercase text-black font-extrabold tracking-tighter leading-none">SHORTS //&nbsp;</h2><p data-home-reveal="" className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed mt-2 uppercase">Engineered kitverse shorts, authentic club crest embroidery, elasticated drawstrings, and quick-dry breathable jacquards for training and street wear.</p></div><div className="flex items-center gap-space-xs font-label-mono-bold text-label-mono-bold uppercase tracking-wider text-black px-3 py-2 bg-surface-container"><span className="material-symbols-outlined text-[18px] text-primary">straighten</span><span className="">ATHLETIC TAILORED FIT</span></div></div></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">
<div data-home-reveal="" className="group relative flex flex-col bg-[#F2EFE9] transition-all duration-300">
 
 <div className="relative w-full h-[360px] bg-[#f2f0f0] overflow-hidden">
 <img alt="FC Barcelona Home Shorts"className="w-full h-full object-contain object-center p-space-sm grayscale hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWUe6Csp4VGmUW7XwrTjggch9VLIyOxDNWoNx1bXB5-Z_SDKDWncJwGYIl786kRZB2fJVWSRqUXFH7mLRYN-QGKxP9mERzCKAFydMo1gNprx7AiecZXyqj83sZfpfYaw5vEhRZZ4IRC4pRUz8mXsCfPeoXR9Yo4uOsPi2h4JOICAteQ5E4tJlsy654f7VKwlN61BtgIpVfHS4eBSZABYDJvU2St9pHE2QutJWXclltRE9JW4qVhegJeoXygpssrASwb2A"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 bg-black/80 backdrop-blur-md text-white font-label-technical uppercase tracking-widest text-[9px]">
 <span className="w-1.5 h-1.5 rounded-full bg-[#004D98] inline-block"></span>
 <span className="">SH-01 // MATCH</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-white/95 backdrop-blur-md font-price-currency text-on-surface text-[12px] font-bold">
 ₹250
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end text-white">
 <span className="font-label-technical tracking-wider text-white/80 text-[9px] uppercase">180GSM DIAMOND MESH</span>
 <span className="font-label-technical text-white/70 text-[9px] uppercase">NAVY</span>
 </div>
 </div>
 
 <div className="p-5 flex flex-col justify-between flex-1 bg-white">
   <div className="flex flex-col gap-1">
     <div className="flex justify-between items-start">
       <h4 className="font-headline-sm text-[16px] uppercase text-black leading-tight">BARCELONA 26/27 HOME</h4>
     </div>
     <p data-home-reveal="" className="font-label-technical text-on-surface-variant uppercase text-[10px] tracking-wider leading-relaxed">
       Heavyweight poly-mesh · Dual zip pockets
     </p>
   </div>
   <div className="flex flex-col gap-3 pt-4 mt-auto">
     <button type="button" onClick={() => openHomeProduct('barcelona', 'shorts')} className="w-full py-2.5 bg-black hover:bg-primary-container text-white hover:text-black font-label-mono-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors duration-200">
       <span>ADD TO CART</span>
     </button>
   </div>
 </div>
</div>


<div data-home-reveal="" className="group relative flex flex-col bg-[#E9EDF2] transition-all duration-300">
 
 <div className="relative w-full h-[360px] bg-[#f2f0f0] overflow-hidden">
 <img alt="AC Milan Shorts"className="w-full h-full object-contain object-center p-space-sm grayscale hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJcF8NkgOP_zecpXsLx-WTozDG1IC1wH9xANMriLFole4sX-Qdd3BVJtTQeNvIZaCCDwLEPTApLOXWURfNN2MHmuhmQuxWQz6PHGG2oyIAYllDs4lfxdYnqSrCj-kyXidwOeGxjh2pCbye709npHZZ4ypBhIQHoV5tO5vr82FBMliyUJiT-X1ePmHLuLT8YiP2NeLEc_EobDpDE_4nsqoypTqZOlZJ6v-HBqliLhxtmEi0cEQ2_kAPrHK03dPbdNP1sxE"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 bg-black/80 backdrop-blur-md text-white font-label-technical uppercase tracking-widest text-[9px]">
 <span className="w-1.5 h-1.5 rounded-full bg-[#DC052D] inline-block"></span>
 <span className="">SH-02 // EMBROIDERY</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-white/95 backdrop-blur-md font-price-currency text-on-surface text-[12px] font-bold">
 ₹250
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end text-white">
 <span className="font-label-technical tracking-wider text-white/80 text-[9px] uppercase">TONAL DRAWCORD MESH</span>
 <span className="font-label-technical text-white/70 text-[9px] uppercase">BLACK / CRIMSON</span>
 </div>
 </div>
 
 <div className="p-5 flex flex-col justify-between flex-1 bg-white">
   <div className="flex flex-col gap-1">
     <div className="flex justify-between items-start">
       <h4 className="font-headline-sm text-[16px] uppercase text-black leading-tight">AC MILAN ROSSONERI</h4>
     </div>
     <p data-home-reveal="" className="font-label-technical text-on-surface-variant uppercase text-[10px] tracking-wider leading-relaxed">
       Side ventilation panels · Milan insignia
     </p>
   </div>
   <div className="flex flex-col gap-3 pt-4 mt-auto">
     <button type="button" onClick={() => openHomeProduct('ac milan', 'shorts')} className="w-full py-2.5 bg-black hover:bg-primary-container text-white hover:text-black font-label-mono-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors duration-200">
       <span>ADD TO CART</span>
     </button>
   </div>
 </div>
</div>


<div data-home-reveal="" className="group relative flex flex-col bg-[#F2E9E9] transition-all duration-300">
 
 <div className="relative w-full h-[360px] bg-[#f2f0f0] overflow-hidden">
 <img alt="Real Madrid Kit Shorts"className="w-full h-full object-contain object-center p-space-sm grayscale hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfATCAn-U1jF8T4xQ6HZiAG4euhOqD2RGthfDO00uOLw9QxHu3PnxxRw25eOU5NcC7D2hwj9SFbo8XArTsXlXHCLDS59z-2lVw1c2hiJjhjvk_zsj2VGsncb2alf4mo11v8PUFiv2dJyblWCt20EcrCf-Vb1RB1d4WVJrWLxr0bz7U57o4EHNakjSdC3Fnt4QznkMvDp4mAEDGPS3N2CkeyfQOWgEnlX2RjJmP3eaX4bp5yCI4y9XeWlhW16VgfD6okZo"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 bg-black/80 backdrop-blur-md text-white font-label-technical uppercase tracking-widest text-[9px]">
 <span className="w-1.5 h-1.5 rounded-full bg-[#FEBE10] inline-block"></span>
 <span className="">SH-03 // ATELIER</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-white/95 backdrop-blur-md font-price-currency text-on-surface text-[12px] font-bold">
 ₹350
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end text-white">
 <span className="font-label-technical tracking-wider text-white/80 text-[9px] uppercase">MICRO-VENTED JACQUARD</span>
 <span className="font-label-technical text-white/70 text-[9px] uppercase">CHALK WHITE</span>
 </div>
 </div>
 
 <div className="p-5 flex flex-col justify-between flex-1 bg-white">
   <div className="flex flex-col gap-1">
     <div className="flex justify-between items-start">
       <h4 className="font-headline-sm text-[16px] uppercase text-black leading-tight">REAL MADRID 24/25</h4>
     </div>
     <p data-home-reveal="" className="font-label-technical text-on-surface-variant uppercase text-[10px] tracking-wider leading-relaxed">
       Tailored athletic cut · Gold piping trim
     </p>
   </div>
   <div className="flex flex-col gap-3 pt-4 mt-auto">
     <button type="button" onClick={() => openHomeProduct('real madrid', 'shorts')} className="w-full py-2.5 bg-black hover:bg-primary-container text-white hover:text-black font-label-mono-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors duration-200">
       <span>ADD TO CART</span>
     </button>
   </div>
 </div>
</div>


<div data-home-reveal="" className="group relative flex flex-col bg-[#E9F2EC] transition-all duration-300">
 
 <div className="relative w-full h-[360px] bg-[#f2f0f0] overflow-hidden">
 <img alt="Arsenal Training Shorts"className="w-full h-full object-contain object-center p-space-sm grayscale hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"src="https://lh3.googleusercontent.com/aida-public/AB6AXuAA0rzA3I4XV4IxBm5yblGo70dr5UcpARxd9b5z5n_zsE7V90EgTY0RRVQt7sqCE13ntY_VM-mba6AgYrgJpSf6KUZIL-ttxzQhtjijUeqKcFDEyZLKmDbr6eRPR4QZH85Tinz_ZDi_uVlzVTICpD1UgWElQ6egU7leyLNMArb2INk2iwklQa94jpg2bEGsoD0MsDYy6mzI_MEnq7yYdmLt4Sr1GMxEpU0wg4ShIBXkBEZ3aAGsszOjC-8PDX6qkd0rzxk"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 bg-black/80 backdrop-blur-md text-white font-label-technical uppercase tracking-widest text-[9px]">
 <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block"></span>
 <span className="">SH-04 // LAB</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-white/95 backdrop-blur-md font-price-currency text-on-surface text-[12px] font-bold">
 ₹299
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end text-white">
 <span className="font-label-technical tracking-wider text-white/80 text-[9px] uppercase">HIGH-FLEX ELASTANE BLEND</span>
 <span className="font-label-technical text-white/70 text-[9px] uppercase">OBSIDIAN</span>
 </div>
 </div>
 
 <div className="p-5 flex flex-col justify-between flex-1 bg-white">
   <div className="flex flex-col gap-1">
     <div className="flex justify-between items-start">
       <h4 className="font-headline-sm text-[16px] uppercase text-black leading-tight">ARSENAL TRAINING SHORTS</h4>
     </div>
     <p data-home-reveal="" className="font-label-technical text-on-surface-variant uppercase text-[10px] tracking-wider leading-relaxed">
       Acid cannon badge · Aerodynamic weave
     </p>
   </div>
   <div className="flex flex-col gap-3 pt-4 mt-auto">
     <button type="button" onClick={() => openHomeProduct('arsenal', 'shorts')} className="w-full py-2.5 bg-black hover:bg-primary-container text-white hover:text-black font-label-mono-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors duration-200">
       <span>ADD TO CART</span>
     </button>
   </div>
 </div>
</div></div><div className="w-full pt-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md bg-white"><div className="flex flex-col gap-1"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary inline-block"></span><span className="font-label-technical text-label-technical tracking-widest text-black uppercase font-bold">[ 4 MATCHDAY SPECIMENS · IMMEDIATE DISPATCH ]</span></div><p data-home-reveal="" className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wide">Diamond mesh &amp; micro-vented jacquards · All India 24H shipping ready</p></div><div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md w-full md:w-auto"><button onClick={() => alert("Admin portal is currently locked for maintenance.")} className="font-label-mono-bold text-label-mono-bold text-black uppercase tracking-wider hover:text-tertiary flex items-center justify-center gap-1.5 transition-colors py-2 px-1 text-left"><span className="material-symbols-outlined text-[16px]">straighten</span><span className="">SIZING GUIDE ↗</span></button><Link to="/shop?type=shorts" className="px-space-lg py-3 bg-black hover:bg-primary-container text-white hover:text-black font-label-mono-bold text-label-mono-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-200"><span className="">EXPLORE COMPLETE SHORTS ARCHIVE</span><span className="material-symbols-outlined text-[16px]">arrow_forward</span></Link></div></div></div></section>
  );
}