const fs = require('fs');

let content = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf-8');

// Insert CategoryCircleNav after the ticker
const tickerEndString = `<div className="ticker" aria-hidden="true">\n      <div className="ticker-track">\n        {[...Array(2)].map((_, i) => <div key={i} className="ticker-content"><span>CHOOSE YOUR COLOURS.</span><Icon name="star" /><span>OWN THE PITCH.</span><Icon name="star" /><span>NEW SEASON ARRIVALS.</span><Icon name="star" /><span>PREMIUM FABRIC.</span><Icon name="star" /></div>)}\n      </div>\n    </div>`;
if (!content.includes('<CategoryCircleNav />')) {
  // Try to find ticker by searching for closing div of ticker-track
  content = content.replace(
    /<div className="ticker" aria-hidden="true">[\s\S]*?<\/div>\s*<\/div>/,
    match => match + '\n    <CategoryCircleNav />\n'
  );
}

// Generate the section HTML
const createSection = (title, type, id) => `
      <section id="${id}" className="bestsellers-section reveal" style={{ borderTop: '1px solid #eaeaea', marginTop: '20px', paddingTop: '40px' }}>
        <div className="bestsellers-header">
          <div>
            <span className="bestsellers-eyebrow">SHOP APPAREL</span>
            <h2>${title}</h2>
          </div>
          <div className="bestsellers-sub-wrap">
            <p className="bestsellers-sub">Complete your kit.</p>
            <Link to={\`/shop?type=\${type}\`} className="primary" style={{ padding: '10px 20px', textDecoration: 'none' }}>Shop ${title}</Link>
          </div>
        </div>
        {products.filter(p => p.productType === '${type}').length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px', color: '#666', border: '1px dashed #ccc' }}>
            <p>New arrivals coming soon.</p>
          </div>
        ) : (
          <div className="bestsellers-grid">
            {products.filter(p => p.productType === '${type}').slice(0, 4).map((p, index) => (
              <ProductCard key={p.slug} p={p} pIdx={index} onOpen={() => setSelected(p)} />
            ))}
          </div>
        )}
      </section>
`;

const sectionsHtml = 
  createSection('Track Pants', 'track-pants', 'shop-track-pants') +
  createSection('Shorts', 'shorts', 'shop-shorts') +
  createSection('Collar T-Shirts', 'collar-tshirt', 'shop-collar-tshirts');

// Insert sections after #shop
content = content.replace(
  /<\/section>\s*<section id="qualities"/,
  '</section>\n' + sectionsHtml + '\n      <section id="qualities"'
);

fs.writeFileSync('client/src/pages/Storefront.jsx', content);
console.log('Storefront updated.');
