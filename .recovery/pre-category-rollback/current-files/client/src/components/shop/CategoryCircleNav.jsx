import React from 'react';
import { Link } from 'react-router-dom';
import { collectionsConfig } from '../../../../shared/collections.js';

function matchesCollection(product, filter) {
  if (filter.quality && product.quality !== filter.quality) return false;
  if (filter.category && product.category !== filter.category) return false;
  if (filter.productType && product.productType !== filter.productType) return false;
  if (filter.styleTags && !filter.styleTags.every(tag => product.styleTags?.includes(tag))) return false;
  return true;
}

export default function CategoryCircleNav({ products = [] }) {
  return (
    <section className="category-circle-nav" aria-label="Shop by category">
      <div className="category-circle-scroll">
        {collectionsConfig.map(col => {
          const representative = products.find(product => matchesCollection(product, col.filter));
          const image = representative?.image || '/images/jersey-placeholder.svg';
          return (
          <Link key={col.slug} to={`/collections/${col.slug}`} className="circle-nav-item" aria-label={`Shop ${col.label}`}>
            <div className="circle-nav-img-wrap">
              <img src={image} alt="" className="circle-nav-img" loading="lazy" />
              <div className="circle-nav-band">
                <span>{col.label}</span>
              </div>
            </div>
          </Link>
        )})}
      </div>
    </section>
  );
}
