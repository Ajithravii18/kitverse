import React from 'react';
import { money } from '../../format.js';
import ProductImage from '../ProductImage.jsx';

export default function ProductCard({ product, openProduct, index = 0 }) {
  if (!product) return null;

  const typeLabel = product.productType ? product.productType.replace(/-/g, ' ') : 'Jersey';

  return (
    <article className="product reveal" style={{ '--i': index }}>
      <button
        type="button"
        className="product-image"
        onClick={() => openProduct(product)}
        aria-label={`View ${product.name}`}
      >
        {product.season && <span className="tag">{product.season}</span>}
        <ProductImage src={product.image} alt={product.name} loading="lazy" />
        <span className="add">+</span>
      </button>

      <div className="type">{typeLabel}</div>
      <h3>{product.name}</h3>

      <div className="price">
        {money(product.price)}
        {product.quality && <small>{product.quality}</small>}
      </div>
    </article>
  );
}
