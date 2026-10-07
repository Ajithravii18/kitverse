const fs = require('fs');
let code = fs.readFileSync('client/src/components/home/Hero.jsx', 'utf8');

code = code.replace(/export default function Hero\(\{ cms, catalogue \}\) \{/, 'export default function Hero({ cms, catalogue }) {\n  const ready = catalogue && catalogue.length > 0;');
code = code.replace(/useHeroMotion\(heroRef\);/, 'useHeroMotion(heroRef, ready);');

// Wrap the card
code = code.replace(
  /key=\{product.slug\}\n\s*data-hero-card\n\s*className=\"absolute w-\[60vw\] max-w-\[220px\] sm:w-\[280px\] md:w-\[320px\] aspect-\[3\/4\] bg-foreground text-text-light flex flex-col rounded-none shadow-2xl border border-white\/10\"\n\s*style=\{\{([\s\S]*?)\}\}/g,
  `key={product.slug}
              data-hero-card
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ zIndex: 10 - Math.abs(idx - 1) }}
            >
              <div 
                className="relative w-[60vw] max-w-[220px] sm:w-[280px] md:w-[320px] aspect-[3/4] bg-foreground text-text-light flex flex-col rounded-none shadow-2xl border border-white/10 pointer-events-auto"
                style={{$1}}`
);

// We need to add a closing div for the new wrapper!
// This is tricky with regex. Let's write the whole file to be safe.
