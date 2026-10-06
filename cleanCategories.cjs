const fs = require('fs');
let code = fs.readFileSync('client/src/components/home/Categories.jsx', 'utf8');

const replacement = `<section id="filter-index" className="w-full px-4 md:px-margin-desktop bg-background py-16">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop stagger-group">`;

code = code.replace(/<section id="filter-index"[^]*?<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">/, replacement);

// Make sure category cards have data-home-reveal
code = code.replace(/<Link[^>]+className="category-card[^>]+>/g, (match) => {
  if (!match.includes('data-home-reveal')) {
    return match.replace('className="', 'data-home-reveal="" className="');
  }
  return match;
});

fs.writeFileSync('client/src/components/home/Categories.jsx', code);
console.log('Done cleaning categories');
