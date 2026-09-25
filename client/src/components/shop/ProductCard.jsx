import React from 'react';
import { money } from '../../format.js';
import ProductImage from '../ProductImage.jsx';
import { sizes } from '../../../../shared/catalog.js';
import { stockFor } from '../../../../shared/inventory.js';

export function ProductCard({ p, onOpen, pIdx }) {
  const availableSizes = sizes.filter(s => stockFor(p, s) > 0);
  const badgeText = p.category === 'national' ? 'NATIONAL TEAM' : 'CLUB TEAM';
  const badgeBg = p.category === 'national' ? '#0077b6' : '#181a16';

  return (
    <article className="bestseller-card product-card reveal" style={{ '--i': pIdx % 8 }}>
      <div className="bestseller-top-tags">
        <span 
          className="bestseller-badge" 
          style={{ backgroundColor: badgeBg, color: '#ffffff' }}
        >
          {badgeText}
        </span>
      </div>

      <button 
        type="button"
        className="bestseller-img-stage"
        onClick={() => onOpen(p)}
        aria-label={`View ${p.name} details and sizes`}
      >
        <ProductImage src={p.image} alt={p.name} loading="lazy" />
        <span className="bestseller-hover-inspect">Choose Size +</span>
      </button>

      <div className="bestseller-info">
        <div className="bestseller-meta-row">
          <span className="bestseller-tier">{p.quality}</span>
          <span className="bestseller-sales">{p.team}</span>
        </div>
        <h3 className="bestseller-name">{p.name}</h3>
        <div className="bestseller-sizes-row">
          <span className="sizes-label">Sizes:</span>
          <span className="sizes-list">
            {availableSizes.length ? availableSizes.join(' · ') : 'Restocking soon'}
          </span>
        </div>
        <div className="bestseller-footer">
          <div className="bestseller-price">{money(p.price)}</div>
          <button 
            type="button" 
            className="bestseller-add-btn"
            onClick={() => onOpen(p)}
            aria-label={`Select size and add ${p.name} to bag`}
          >
            Quick Bag <span>+</span>
          </button>
        </div>
      </div>
    </article>
  );
}
