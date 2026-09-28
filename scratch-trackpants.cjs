const fs = require('fs');

const file = 'client/src/pages/Storefront.jsx';
let content = fs.readFileSync(file, 'utf8');

const newGridHtml = `<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 bg-[#0a0a0a] p-4 md:p-8">
  {/* Card 1: Top Left Style */}
  <div className="flex flex-col sm:flex-row bg-white h-auto sm:h-[500px] overflow-hidden group relative">
    <div className="w-full sm:w-[70%] h-[300px] sm:h-full">
      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVj37i2iGMqimQ-2TzAseRMQX1DvwMKNNoYzI_-FOgJz-Bzuo4cwV0i4dzyXpkx1cpAlotsapSLchdKCze2QoIzRi_zUrRKG-qtvtJQU6VcJePydJHa5qgXIKytuvbU-XOZ4tpcg8tW8A09HteRn2paQqMufJysE21DdgYRk1SILjEQXX7XGx0DCmlLHgwzetj_xg83OVaN9_MVaCBQesTwxRJl6KFObBef8yyAwnq2hqdIRphje0yrkcYr7JKw6E_QAs" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Burgundy Track Trousers" />
    </div>
    <div className="w-full sm:w-[30%] p-6 flex flex-col justify-between items-start border-l border-black/10">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between w-full">
          <span className="font-label-technical text-[9px] uppercase tracking-widest text-gray-500">Runner // 01</span>
        </div>
        <h3 className="font-serif text-3xl uppercase leading-none tracking-tight">Burgundy<br/>Pop-Stud</h3>
        <span className="font-price-currency text-sm font-bold">₹1,299</span>
      </div>
      <div className="flex flex-col gap-6 w-full mt-8 sm:mt-0">
        <p className="text-[10px] uppercase text-gray-500 leading-relaxed font-label-technical tracking-wide">
          Chalk White Contrast<br/>Relaxed Loose Hem<br/>Heavyweight Shell
        </p>
        <button className="w-full py-3 bg-black text-white font-label-mono-bold text-[10px] uppercase hover:bg-gray-800 transition-colors">Bag +</button>
      </div>
    </div>
  </div>

  {/* Card 2: Collage Style (Bottom Left) */}
  <div className="bg-white h-[500px] p-6 relative group overflow-hidden flex flex-col justify-between">
    <div className="flex justify-between w-full h-[45%]">
      <div className="w-[55%] flex gap-2 h-full">
         <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuWsZOv5lHiDErY97I-MbR2ZUf1NhP8uqi8vMUxr9nMCc7JiuGTKmICSiJRYsCFv9kkuXZObPzR1vPHYyyhfCkngl7aJGN7k9bkRTnjo5Me5vaXZO2l7HgV824ppP7uK517RObE930Mi4iy932xJRa94OTc3Z00V8d39B-eYRTm0iX-69KNiA3MA9sLKBOLbUZKbPaIZRDIqiypbLW3KfPN10y5toOhA55XUEN3Z7CJYEpzbnhbYVwTi4cdbCEJ5yihvE" className="w-1/2 h-full object-cover grayscale hover:grayscale-0 transition-colors" style={{objectPosition: 'top'}} alt="Slate Grey Track Pants 1" />
         <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuWsZOv5lHiDErY97I-MbR2ZUf1NhP8uqi8vMUxr9nMCc7JiuGTKmICSiJRYsCFv9kkuXZObPzR1vPHYyyhfCkngl7aJGN7k9bkRTnjo5Me5vaXZO2l7HgV824ppP7uK517RObE930Mi4iy932xJRa94OTc3Z00V8d39B-eYRTm0iX-69KNiA3MA9sLKBOLbUZKbPaIZRDIqiypbLW3KfPN10y5toOhA55XUEN3Z7CJYEpzbnhbYVwTi4cdbCEJ5yihvE" className="w-1/2 h-full object-cover grayscale hover:grayscale-0 transition-colors" style={{objectPosition: 'center'}} alt="Slate Grey Track Pants 2" />
      </div>
      <div className="w-[40%] flex flex-col items-end text-right justify-start gap-2">
         <span className="font-label-technical text-[9px] uppercase tracking-widest text-gray-500">Runner // 02</span>
         <h3 className="font-serif text-2xl uppercase leading-none tracking-tight">Slate Grey<br/>Tapered</h3>
         <span className="font-price-currency text-sm font-bold mt-1">₹999</span>
         <button className="mt-4 border-b border-black pb-0.5 text-[10px] font-label-mono-bold uppercase hover:text-gray-500 transition-colors">Add to Bag</button>
      </div>
    </div>
    <div className="w-full h-[50%] flex justify-end">
      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuWsZOv5lHiDErY97I-MbR2ZUf1NhP8uqi8vMUxr9nMCc7JiuGTKmICSiJRYsCFv9kkuXZObPzR1vPHYyyhfCkngl7aJGN7k9bkRTnjo5Me5vaXZO2l7HgV824ppP7uK517RObE930Mi4iy932xJRa94OTc3Z00V8d39B-eYRTm0iX-69KNiA3MA9sLKBOLbUZKbPaIZRDIqiypbLW3KfPN10y5toOhA55XUEN3Z7CJYEpzbnhbYVwTi4cdbCEJ5yihvE" className="w-[65%] h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" style={{objectPosition: 'bottom'}} alt="Slate Grey Track Pants 3" />
    </div>
  </div>
</div>`;

// Find the grid specifically within the track-pants section.
// A safe way is to split the content by '<section id="track-pants"' and then replace the first occurrence of the grid in the second part.
let parts = content.split('<section id="track-pants"');
if (parts.length > 1) {
    let trackPantsSection = parts[1];
    
    // The grid starts with <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-y border-black">
    // and we replace up to </div></div><div className="w-full pt-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md bg-white">
    // Let's match up to </div></div><div className="w-full pt-space-lg flex...
    const regex = /<div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-y border-black">[\s\S]*?(?=<\/div><div className="w-full pt-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md bg-white">)/;
    
    if (regex.test(trackPantsSection)) {
        trackPantsSection = trackPantsSection.replace(regex, newGridHtml);
        content = parts[0] + '<section id="track-pants"' + trackPantsSection;
        fs.writeFileSync(file, content);
        console.log("Successfully replaced track-pants section with editorial layout!");
    } else {
        console.log("Regex didn't match inside track-pants section.");
        // Let's try matching without the closing tags just in case
        const regexAlt = /<div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-y border-black">[\s\S]*?(?=<div className="w-full pt-space-lg)/;
        if (regexAlt.test(trackPantsSection)) {
             trackPantsSection = trackPantsSection.replace(regexAlt, newGridHtml);
             content = parts[0] + '<section id="track-pants"' + trackPantsSection;
             fs.writeFileSync(file, content);
             console.log("Successfully replaced track-pants section with alt regex!");
        } else {
            console.log("Alt regex failed too.");
        }
    }
} else {
    console.log("Could not find section id track-pants.");
}
