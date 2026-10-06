const fs = require('fs');
let content = fs.readFileSync('client/src/pages/ShopPage.jsx', 'utf8');

content = content.replace(
  "import '../shop-page.css';",
  "import { ProductCard } from '../components/shop/ProductCard.jsx';\nimport '../shop-page.css';"
);

// Replace the manual mapping with ProductCard
content = content.replace(
  /\{pageProducts\.map\(product => <article className="shop-product shop-product-compact"[^]*?<\/article>\)\}/g,
  "{pageProducts.map((product, idx) => <ProductCard key={product.slug} p={product} pIdx={idx} onOpen={setSelectedProduct} />)}"
);

// Add tailwind grid classes
content = content.replace(
  /<div className="shop-product-grid">/g,
  '<div className="shop-product-grid grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-6 pt-4">'
);

fs.writeFileSync('client/src/pages/ShopPage.jsx', content);
console.log('ShopPage updated!');
