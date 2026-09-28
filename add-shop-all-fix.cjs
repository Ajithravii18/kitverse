const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');

// 1. Add pamidor-item reveal to small cards
c = c.replace(/className="group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300 hover:scale-\[1.01\] text-left overflow-hidden"/g, 'className="group relative flex flex-col justify-between bg-surface-container-low text-black hover:bg-white transition-all duration-300 hover:scale-[1.01] text-left overflow-hidden pamidor-item reveal"');

const shopAllCard = `
<button className="lg:col-span-2 sm:col-span-2 group relative flex flex-col justify-between bg-black text-white hover:bg-[#111] transition-all duration-300 hover:scale-[1.01] text-left overflow-hidden pamidor-item reveal">
 <div className="relative w-full h-44 bg-[#111] overflow-hidden flex items-center justify-center p-2">
 <img className="absolute inset-0 w-full h-full object-cover object-center grayscale opacity-60 group-hover:opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" src="https://lh3.googleusercontent.com/aida/AEtjO1XnfMuUO14GewY2L994ZYlsaLEWXP16mrV56VRXy8a-iVDo6k6HqEKZvfv3Cd89lQxd7PAnY65Jx8cbNYBjndYyLtm9LJAFHl3GtmEfP5tniqPXmwEYSswBOxQxoxpef_VW3_lpg0hFa6mVu1KmoS_mVOMXyAxy08A0l0QjDJbFTjI4qlASzZCFO8wxMTKVg07co0UsscFvlUNx7Lr415XKr8_VC3MMIxwM9yWgzmGR7MTePAeWOFvi0wbP" alt="Shop All"/>
 <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-white text-black font-label-mono-bold text-[10px] uppercase tracking-wider">
 <span className="">ALL+</span>
 </div>
 <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-black/80 backdrop-blur-sm font-price-currency text-[11px] font-bold text-white border border-white/20">
 ALL COLLECTIONS
 </div>
 </div>
 <div className="p-space-md flex flex-col justify-between flex-1 gap-2 bg-black z-10 relative border-t border-white/10">
 <div className="flex flex-col gap-0.5">
 <div className="flex justify-between items-baseline">
 <span className="font-headline-sm text-[24px] uppercase text-white group-hover:text-primary transition-colors font-bold tracking-tight">SHOP ALL</span>
 <span className="font-label-technical text-white/60 uppercase text-[9px]">ENTIRE CATALOG</span>
 </div>
 <span className="font-label-technical text-white/60 uppercase tracking-wider text-[10px]">EXPLORE EVERY PIECE ACROSS ALL TIERS</span>
 </div>
 <div className="flex items-center justify-between pt-2 mt-1">
 <span className="font-label-technical text-[10px] text-primary uppercase tracking-wider font-bold">VIEW ALL PRODUCTS</span>
 <span className="material-symbols-outlined text-[18px] text-white group-hover:translate-x-1 group-hover:text-primary transition-transform">arrow_forward</span>
 </div>
 </div>
</button>
`;

// To perfectly insert it at the end of the first grid:
// Find the "TRACK PANTS" card which is the last card in the grid.
const lastCardIdentifier = 'TRACK PANTS &amp; CASUAL RUNNERS</span>';
const lastCardIndex = c.indexOf(lastCardIdentifier);
if (lastCardIndex !== -1) {
    // Find the end of this button
    const endOfLastCard = c.indexOf('</button>', lastCardIndex) + 9;
    
    // Check if we already inserted it
    if (!c.substring(endOfLastCard, endOfLastCard + 50).includes('SHOP ALL')) {
        const newC = c.substring(0, endOfLastCard) + '\n\n' + shopAllCard + c.substring(endOfLastCard);
        fs.writeFileSync('client/src/pages/Storefront.jsx', newC);
        console.log('Successfully updated Storefront.jsx');
    } else {
        console.log('SHOP ALL already exists.');
    }
} else {
    // Maybe TRACK PANTS was removed? Let's find "EXPLORE BY CATEGORY", then find the </section>
    const exploreIndex = c.indexOf('EXPLORE BY CATEGORY');
    const firstGridEnd = c.indexOf('</section>', exploreIndex);
    const gridEndDivs = c.lastIndexOf('</div></div>', firstGridEnd);
    
    if (gridEndDivs !== -1) {
       const newC = c.substring(0, gridEndDivs) + '\n\n' + shopAllCard + c.substring(gridEndDivs);
       fs.writeFileSync('client/src/pages/Storefront.jsx', newC);
       console.log('Successfully appended SHOP ALL using fallback.');
    }
}
