const fs = require('fs');

function cleanFile(filePath, title, subtitle) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // Replace cluttered headings
  const headerRegex = /<div className="flex flex-col md:flex-row[^]*?<\/h2><p[^>]*>.*?<\/p><\/div><\/div><\/div>/;
  
  if (title) {
    const replacement = `
      <div className="flex flex-col gap-4 mb-8">
        <div className="overflow-hidden pb-1">
          <h2 data-home-reveal className="font-headline-md text-headline-md uppercase text-foreground font-extrabold tracking-tight">
            ${title}
          </h2>
        </div>
        ${subtitle ? `<p data-home-reveal className="font-body-md text-foreground/70 max-w-2xl leading-relaxed uppercase font-medium">${subtitle}</p>` : ''}
      </div>`;
    
    // For SeasonKits which has a specific pattern
    code = code.replace(/<div className="flex flex-col gap-space-2xl relative z-10"><div className="flex flex-col gap-space-md[^]*?<\/p><\/div><\/div><\/div>/, replacement);
  }

  // Find all components that need stagger group
  code = code.replace(/className="grid grid-cols-2 md:grid-cols-4 gap-gutter-desktop"/g, 'className="grid grid-cols-2 md:grid-cols-4 gap-gutter-desktop stagger-group"');

  // Make sure links and articles have data-home-reveal
  code = code.replace(/<article[^>]+className="[^"]*flex flex-col group[^"]*"[^>]*>/g, (match) => {
    if (!match.includes('data-home-reveal')) {
      return match.replace('className="', 'data-home-reveal="" className="');
    }
    return match;
  });

  fs.writeFileSync(filePath, code);
  console.log('Cleaned', filePath);
}

cleanFile('client/src/components/home/SeasonKits.jsx', '26/27 Season Kits', 'The latest drops for the upcoming matchday.');
cleanFile('client/src/components/home/ClubsDirectory.jsx', 'Clubs Directory', 'Find your team in the archive.');
