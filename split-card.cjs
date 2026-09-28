const fs = require('fs');

const replacement = `<button className="lg:col-span-3 sm:col-span-2 group relative w-full h-[360px] lg:h-full bg-white border border-black/10 hover:border-black/30 overflow-hidden flex flex-col md:flex-row text-left pamidor-item reveal">
 <div className="w-full md:w-[45%] bg-surface flex flex-col justify-between p-6 md:p-8 z-10 border-b md:border-b-0 md:border-r border-black/10 relative">
  <div>
   <span className="font-label-mono-bold text-[10px] bg-black text-white px-2.5 py-1 uppercase tracking-widest inline-flex items-center gap-2 mb-4">
    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span> ALL+ // 500 ITEMS
   </span>
   <h3 className="font-headline-lg text-4xl lg:text-5xl uppercase text-black font-extrabold tracking-tighter leading-none mb-3">
    THE COMPLETE ARCHIVE
   </h3>
   <p className="font-label-technical text-on-surface-variant uppercase tracking-wider text-[11px] leading-relaxed max-w-[90%]">
    Full capsules, matchday kits, shorts, and heritage pieces mapped out across our 13-tier classification matrix.
   </p>
  </div>
  
  <div className="flex items-center justify-between w-full pt-4 mt-6 border-t border-black/10">
   <span className="font-label-technical text-[10px] text-black uppercase tracking-wider font-bold group-hover:text-primary transition-colors">EXPLORE INDEX 01</span>
   <span className="material-symbols-outlined text-[24px] text-black group-hover:translate-x-1 group-hover:text-primary transition-all">arrow_forward</span>
  </div>
 </div>

 <div className="hidden md:flex w-[55%] h-full relative bg-[#e5e5e5] items-center justify-center overflow-hidden">
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[140px] font-headline-lg font-extrabold text-black/[0.04] whitespace-nowrap tracking-tighter select-none">
   KITVERSE
  </div>
  
  <div className="absolute left-[15%] top-[15%] w-[40%] h-[70%] z-20 shadow-2xl transition-all duration-700 group-hover:-translate-y-4 group-hover:-rotate-3 group-hover:scale-105 border-4 border-white bg-white">
   <img src="https://lh3.googleusercontent.com/aida/AEtjO1XnfMuUO14GewY2L994ZYlsaLEWXP16mrV56VRXy8a-iVDo6k6HqEKZvfv3Cd89lQxd7PAnY65Jx8cbNYBjndYyLtm9LJAFHl3GtmEfP5tniqPXmwEYSswBOxQxoxpef_VW3_lpg0hFa6mVu1KmoS_mVOMXyAxy08A0l0QjDJbFTjI4qlASzZCFO8wxMTKVg07co0UsscFvlUNx7Lr415XKr8_VC3MMIxwM9yWgzmGR7MTePAeWOFvi0wbP" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="White Jersey"/>
  </div>

  <div className="absolute right-[15%] top-[25%] w-[35%] h-[60%] z-10 shadow-xl transition-all duration-700 group-hover:-translate-y-2 group-hover:rotate-6 group-hover:scale-110 opacity-90 group-hover:opacity-100 border-4 border-white bg-white">
   <img src="https://lh3.googleusercontent.com/aida/AEtjO1VZOmIoI71hdM_2LuOBBfY5T8izkALlYBl5dnoc-mCIRKH2IatfWWn3qBEAslPvpfdCfWhK7yEcX5BxPFdRH5I6VxRUa04KB1j0pVrXB6k5QfR3SI-UZY_XcF08FCUv02cF5rUREv_4i1oosEP5nzBDVW7GJxgc12YYSvjBnPENIbbjwZ7OIjyxcgiKazMO-j7-dJz8YmK69hS7S8csMMBNI8acw987sUyADM7mImEAlErzWUi1GEp0B2E" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Black Jersey"/>
  </div>
 </div>
</button>`;

const c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');
const startIdx = c.indexOf('<button className="lg:col-span-3');
const endIdx = c.indexOf('</button>', startIdx) + 9;

if (startIdx !== -1) {
  const newC = c.substring(0, startIdx) + replacement + c.substring(endIdx);
  fs.writeFileSync('client/src/pages/Storefront.jsx', newC);
  console.log("Successfully created the split collage card!");
} else {
  console.log("Could not find the target button.");
}
