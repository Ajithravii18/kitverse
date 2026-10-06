import React from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../shop/ProductCard.jsx';

export default function FeaturedProducts({ cms, catalogue, setSelectedProduct }) {
  return (
    <section className="w-full bg-surface-container py-space-3xl px-4 md:px-margin-desktop border-y border-border/10">
      <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
        <div className="flex items-end justify-between overflow-hidden pb-1">
          <h2 data-home-reveal className="font-headline-md text-headline-md uppercase text-foreground font-extrabold tracking-tight translate-y-0 opacity-100">
            {cms['featured-products'].heading || "FEATURED KITS"}
          </h2>
          <Link data-home-reveal to="/shop" className="font-label-technical tracking-widest text-[11px] uppercase text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1 font-bold">
            VIEW ALL <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-6 stagger-group">
          {catalogue?.filter(p => !cms['featured-products']?.category || p.category === cms['featured-products'].category)
            .slice(0, Number(cms['featured-products']?.limit) || 4)
            .map((product, idx) => (
              <div data-home-reveal key={product.slug}>
                <ProductCard p={product} pIdx={idx} onOpen={setSelectedProduct} />
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}