const fs = require('fs');

const replacement = `<button className="lg:col-span-3 sm:col-span-2 group relative w-full h-[320px] lg:h-full bg-black overflow-hidden flex flex-col text-left">
 <img className="absolute inset-0 w-full h-full object-cover object-center grayscale opacity-60 group-hover:opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src="https://lh3.googleusercontent.com/aida/AEtjO1XnfMuUO14GewY2L994ZYlsaLEWXP16mrV56VRXy8a-iVDo6k6HqEKZvfv3Cd89lQxd7PAnY65Jx8cbNYBjndYyLtm9LJAFHl3GtmEfP5tniqPXmwEYSswBOxQxoxpef_VW3_lpg0hFa6mVu1KmoS_mVOMXyAxy08A0l0QjDJbFTjI4qlASzZCFO8wxMTKVg07co0UsscFvlUNx7Lr415XKr8_VC3MMIxwM9yWgzmGR7MTePAeWOFvi0wbP" alt="All Products Archive - Heritage and Modern Jerseys"/>
 
 <div className="absolute top-4 left-4 flex items-center gap-2">
  <div className="px-3 py-1 bg-primary text-black font-label-mono-bold text-[10px] uppercase tracking-wider">ALL+</div>
  <div className="px-3 py-1 bg-white/20 backdrop-blur-md text-white font-price-currency text-[11px] font-bold">500+ ITEMS</div>
 </div>
 
 <div className="relative z-10 p-6 flex flex-col justify-end h-full w-full bg-gradient-to-t from-black/90 via-black/40 to-transparent">
  <div className="flex flex-col gap-1 w-full max-w-lg">
   <span className="font-label-technical text-white/80 uppercase tracking-widest text-[10px] mb-1">COMPLETE ARCHIVE // INDEX 01</span>
   <h3 className="font-headline-lg text-4xl sm:text-5xl uppercase text-white font-extrabold tracking-tighter leading-none mb-2 group-hover:text-primary transition-colors">ALL PRODUCTS</h3>
   <p className="font-label-technical text-white/70 uppercase tracking-wider text-[11px]">FULL CAPSULES, MATCHDAY KITS &amp; HERITAGE ARCHIVES</p>
  </div>
  
  <div className="flex items-center justify-between w-full pt-4 mt-4 border-t border-white/20">
   <span className="font-label-technical text-[10px] text-primary uppercase tracking-wider font-bold">EXPLORE COLLECTION</span>
   <span className="material-symbols-outlined text-[24px] text-white group-hover:translate-x-1 group-hover:text-primary transition-all">arrow_forward</span>
  </div>
 </div>
</button>`;

const c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');
const startIdx = c.indexOf('<button className="lg:col-span-3');
const endIdx = c.indexOf('</button>', startIdx) + 9;

if (startIdx !== -1) {
  const newC = c.substring(0, startIdx) + replacement + c.substring(endIdx);
  fs.writeFileSync('client/src/pages/Storefront.jsx', newC);
  console.log("Successfully restyled the SHOP ALL card!");
} else {
  console.log("Could not find the target button.");
}
