import React from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../shop/ProductCard.jsx';

export default function FeaturedProducts({ cms, catalogue, setSelectedProduct }) {
  const featuredData = cms['featured-products'] || {};
  const heading = featuredData.heading || "Featured Kits";
  const category = featuredData.category;
  const limit = Number(featuredData.limit) || 4;

  const products = catalogue?.filter(p => !category || p.category === category).slice(0, limit) || [];

  if (!products.length) return null;

  return (
    <section className="w-full px-6 md:px-12 bg-foreground text-background py-24 md:py-32">
      <div className="flex flex-col gap-12 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2 data-home-reveal className="font-display text-display-md uppercase text-background m-0 leading-none">
            {heading}
          </h2>
          <Link data-home-reveal to="/shop" className="font-sans text-sm uppercase tracking-widest text-background hover:text-accent transition-colors border-b border-background pb-1 w-fit">
            View Complete Archive
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
          {products.map((product, idx) => (
            <div data-home-reveal key={product.slug} className="h-full">
              <ProductCard p={product} pIdx={idx} onOpen={setSelectedProduct} forceDarkTheme={true} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
