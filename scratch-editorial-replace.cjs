const fs = require('fs');

const file = 'client/src/pages/Storefront.jsx';
let content = fs.readFileSync(file, 'utf8');

const newGridHtml = `<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 bg-[#0a0a0a] p-4 md:p-8">
  {/* Card 1: Barca - Top Left Style (Image left, text right) */}
  <div className="flex flex-col sm:flex-row bg-white h-auto sm:h-[500px] overflow-hidden group relative">
    <div className="w-full sm:w-[70%] h-[300px] sm:h-full">
      <img src="https://luxornix.com/cdn/shop/files/FC_Barcelona_2026-27_away_new_kit.webp?v=1787226653" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="FC Barcelona" />
    </div>
    <div className="w-full sm:w-[30%] p-6 flex flex-col justify-between items-start border-l border-black/10">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between w-full">
          <span className="font-label-technical text-[9px] uppercase tracking-widest text-gray-500">Player Issue // 01</span>
        </div>
        <h3 className="font-serif text-3xl uppercase leading-none tracking-tight">FC Barcelona</h3>
        <span className="font-price-currency text-sm font-bold">₹1,499</span>
      </div>
      <div className="flex flex-col gap-6 w-full mt-8 sm:mt-0">
        <p className="text-[10px] uppercase text-gray-500 leading-relaxed font-label-technical tracking-wide">
          Aerodynamic Taper Fit<br/>Retro Blaugrana Trim<br/>Gold Emblem Spec
        </p>
        <button className="w-full py-3 bg-black text-white font-label-mono-bold text-[10px] uppercase hover:bg-gray-800 transition-colors">Bag +</button>
      </div>
    </div>
  </div>

  {/* Card 2: Real Madrid - Top Right Style (Beige Typography) */}
  <div className="flex flex-col bg-[#EAE8E3] h-[500px] p-8 relative overflow-hidden group justify-between border border-black/5">
    <h3 className="font-serif text-[70px] leading-[0.8] uppercase tracking-tighter text-[#1a1a1a] z-10 w-full text-left">REAL</h3>
    
    <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
       <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScImW5oUQMJmu5eLWKy6GPuUNpPPmVrq-Aw19WjaaN_fWFxU2ntaPxZi2w&s=10" className="h-[280px] w-auto object-cover grayscale mix-blend-multiply" alt="Real Madrid" />
    </div>

    <div className="flex justify-between items-end z-10 w-full">
       <div className="w-1/2 text-[10px] uppercase tracking-widest text-gray-600 font-label-technical leading-relaxed">
         Master Atelier // 02<br/>Bernabéu Nocturne<br/>₹1,249
       </div>
       <button className="py-2.5 px-6 bg-transparent border border-black text-black font-label-mono-bold text-[10px] uppercase hover:bg-black hover:text-white transition-colors">Bag +</button>
    </div>

    <h3 className="font-serif text-[70px] leading-[0.8] uppercase tracking-tighter text-[#1a1a1a] z-10 w-full text-right mt-4">MADRID</h3>
  </div>

  {/* Card 3: Man Utd - Bottom Left Style (Collage / White Space) */}
  <div className="bg-white h-[500px] p-6 relative group overflow-hidden flex flex-col justify-between">
    <div className="flex justify-between w-full h-[45%]">
      <div className="w-[55%] flex gap-2 h-full">
         <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTIj3lPR7KpO1Jdz8v0faQtoTqBQJ2iLzGc0OV8_g-EO1yql1OYf2In2c&s=10" className="w-1/2 h-full object-cover grayscale hover:grayscale-0 transition-colors" style={{objectPosition: 'top'}} alt="Man Utd 1" />
         <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTIj3lPR7KpO1Jdz8v0faQtoTqBQJ2iLzGc0OV8_g-EO1yql1OYf2In2c&s=10" className="w-1/2 h-full object-cover grayscale hover:grayscale-0 transition-colors" style={{objectPosition: 'center'}} alt="Man Utd 2" />
      </div>
      <div className="w-[40%] flex flex-col items-end text-right justify-start gap-2">
         <span className="font-label-technical text-[9px] uppercase tracking-widest text-gray-500">Match Suite // 03</span>
         <h3 className="font-serif text-2xl uppercase leading-none tracking-tight">MANCHESTER<br/>UNITED</h3>
         <span className="font-price-currency text-sm font-bold mt-1">₹1,099</span>
         <button className="mt-4 border-b border-black pb-0.5 text-[10px] font-label-mono-bold uppercase hover:text-gray-500 transition-colors">Add to Bag</button>
      </div>
    </div>
    <div className="w-full h-[50%] flex justify-end">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTIj3lPR7KpO1Jdz8v0faQtoTqBQJ2iLzGc0OV8_g-EO1yql1OYf2In2c&s=10" className="w-[65%] h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" style={{objectPosition: 'bottom'}} alt="Man Utd 3" />
    </div>
  </div>

  {/* Card 4: Arsenal - Bottom Right Style (Vertical Strips) */}
  <div className="h-[500px] relative group overflow-hidden bg-[#111] flex border border-white/10">
    <div className="w-1/4 h-full border-r border-black/40 overflow-hidden relative">
       <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcgIY_d5jPKDVvQA3ygreJG6n5vCghFhix_2PbOjHTeS_Mav1F3AEqHIDNXH33Jffdio80KTlzmRx99kHs6BNGF35WWHAcFmxyc3mmFXoPCgqmXQ0PS7D30QK8zIvP97ZnDFswcnxuZhzHC1ym-oURV9P_bzsmb_Xxxc7U-O7S4QDGn-tLnBL9KRhrgUndoz0UlAO71lwn35L4aNY_Gr0rvMmnxRxyLCLJFInso8SOBViI7x_zNf0BPg" className="absolute top-0 left-0 w-[400%] max-w-none h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100" />
    </div>
    <div className="w-1/4 h-full border-r border-black/40 overflow-hidden relative">
       <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcgIY_d5jPKDVvQA3ygreJG6n5vCghFhix_2PbOjHTeS_Mav1F3AEqHIDNXH33Jffdio80KTlzmRx99kHs6BNGF35WWHAcFmxyc3mmFXoPCgqmXQ0PS7D30QK8zIvP97ZnDFswcnxuZhzHC1ym-oURV9P_bzsmb_Xxxc7U-O7S4QDGn-tLnBL9KRhrgUndoz0UlAO71lwn35L4aNY_Gr0rvMmnxRxyLCLJFInso8SOBViI7x_zNf0BPg" className="absolute top-0 left-[-100%] w-[400%] max-w-none h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-90 group-hover:opacity-100" />
    </div>
    <div className="w-1/4 h-full border-r border-black/40 overflow-hidden relative">
       <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcgIY_d5jPKDVvQA3ygreJG6n5vCghFhix_2PbOjHTeS_Mav1F3AEqHIDNXH33Jffdio80KTlzmRx99kHs6BNGF35WWHAcFmxyc3mmFXoPCgqmXQ0PS7D30QK8zIvP97ZnDFswcnxuZhzHC1ym-oURV9P_bzsmb_Xxxc7U-O7S4QDGn-tLnBL9KRhrgUndoz0UlAO71lwn35L4aNY_Gr0rvMmnxRxyLCLJFInso8SOBViI7x_zNf0BPg" className="absolute top-0 left-[-200%] w-[400%] max-w-none h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-100" />
    </div>
    <div className="w-1/4 h-full overflow-hidden relative">
       <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcgIY_d5jPKDVvQA3ygreJG6n5vCghFhix_2PbOjHTeS_Mav1F3AEqHIDNXH33Jffdio80KTlzmRx99kHs6BNGF35WWHAcFmxyc3mmFXoPCgqmXQ0PS7D30QK8zIvP97ZnDFswcnxuZhzHC1ym-oURV9P_bzsmb_Xxxc7U-O7S4QDGn-tLnBL9KRhrgUndoz0UlAO71lwn35L4aNY_Gr0rvMmnxRxyLCLJFInso8SOBViI7x_zNf0BPg" className="absolute top-0 left-[-300%] w-[400%] max-w-none h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100" />
    </div>
    
    <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
       <div className="flex justify-between w-full">
          <span className="bg-white/90 backdrop-blur-sm text-black px-3 py-1.5 font-label-technical text-[9px] uppercase tracking-widest pointer-events-auto">Prototype // 04</span>
          <span className="bg-white/90 backdrop-blur-sm text-black px-3 py-1.5 font-price-currency text-[10px] font-bold pointer-events-auto">₹1,399</span>
       </div>
       <div className="flex justify-between items-end w-full">
          <h3 className="font-serif text-3xl uppercase text-white drop-shadow-md leading-none tracking-tight">ARSENAL<br/>CANNON</h3>
          <button className="bg-white text-black px-6 py-2.5 font-label-mono-bold text-[10px] uppercase pointer-events-auto hover:bg-gray-200 transition-colors">Bag +</button>
       </div>
    </div>
  </div>
</div>`;

// We need to replace the current grid with this newGridHtml.
// The current grid starts with `<div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-y border-black">`
// And it ends just before `</div><div className="w-full pt-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md bg-white">`
// Let's use a regex that matches everything from the start of the grid to the start of the next section's wrapper div.

const regex = /<div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-y border-black">[\s\S]*?(?=<\/div><div className="w-full pt-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md bg-white">)/;

if (regex.test(content)) {
  content = content.replace(regex, newGridHtml);
  fs.writeFileSync(file, content);
  console.log("Successfully replaced with 4x editorial layouts!");
} else {
  console.log("Regex didn't match. Something changed in the grid layout.");
}
