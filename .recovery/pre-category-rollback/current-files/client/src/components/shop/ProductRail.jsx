import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard.jsx';

export default function ProductRail({ title, subtitle, products, linkTo, openProduct }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="product-rail-section">
      <div className="rail-header">
        <div>
          <h2>{title}</h2>
          {subtitle && <p className="rail-subtitle">{subtitle}</p>}
        </div>
        {linkTo && (
          <Link to={linkTo} className="rail-view-all">View all ↗</Link>
        )}
      </div>

      <div className="rail-grid">
        {products.map((p, index) => (
          <ProductCard key={p.slug} product={p} index={index} openProduct={openProduct} />
        ))}
      </div>
    </section>
  );
}
