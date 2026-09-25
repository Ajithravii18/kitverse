import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductImage from '../ProductImage.jsx';
import { money } from '../../format.js';

export default function Hero({ products, openProduct }) {
  const featured = products.slice(0, 4);
  const [heroIdx, setHeroIdx] = useState(0);

  if (featured.length === 0) {
    return (
      <section className="hero-clean">
        <div className="hero-copy">
          <div className="eyebrow">MADE FOR MATCHDAY</div>
          <h1>WEAR YOUR<br/>HEART.<br/><em>REP YOUR TEAM.</em></h1>
          <p>Club loyalty. National pride.<br/>Find the jersey that feels like you.</p>
          <div className="hero-actions">
            <Link to="/shop" className="primary">Shop jerseys <span>↗</span></Link>
            <Link to="/collections/national-teams" className="hero-secondary-btn">National teams</Link>
          </div>
        </div>
      </section>
    );
  }

  const slide = featured[heroIdx];

  return (
    <section className="hero-clean split-hero">
      <div className="hero-copy">
        <div className="hero-kicker">
          <span className="hero-kicker-dot" />
          <span>MADE FOR MATCHDAY</span>
        </div>
        <h1>
          WEAR YOUR<br />
          <span>HEART.</span><br />
          <em>REP YOUR TEAM.</em>
        </h1>
        <p>Club loyalty. National pride. Premium matchday essentials built to stand out under the lights.</p>

        <div className="hero-actions">
          <Link to="/shop" className="primary">Shop jerseys <span>↗</span></Link>
          <Link to="/collections/national-teams" className="hero-secondary-btn">National teams</Link>
        </div>

        <div className="hero-trust-row" aria-label="Brand highlights">
          <div>
            <strong>3.2k+</strong>
            <span>supporters</span>
          </div>
          <div>
            <strong>4.9/5</strong>
            <span>fit rating</span>
          </div>
          <div>
            <strong>48h</strong>
            <span>dispatch</span>
          </div>
        </div>
      </div>

      <div className="hero-media">
        <div className="hero-media-wrapper">
          <div className="hero-mini-badge">NEW SEASON</div>
          <ProductImage src={slide.image} alt={slide.name} fetchPriority="high" loading="eager" className="hero-img-main" />

          <div className="hero-product-summary">
            <div className="hps-meta">
              <h3>{slide.name}</h3>
              {slide.quality && <span className="hps-quality">{slide.quality}</span>}
              <span className="hps-price">{money(slide.price)}</span>
            </div>
            <button className="hps-view-btn" onClick={() => openProduct(slide)}>View product</button>
          </div>
        </div>

        {featured.length > 1 && (
          <div className="hero-carousel-controls">
            <button onClick={() => setHeroIdx(i => (i - 1 + featured.length) % featured.length)} aria-label="Previous">←</button>
            <div className="hero-dots">
              {featured.map((_, i) => (
                <button key={i} className={i === heroIdx ? 'active' : ''} aria-label={`Slide ${i + 1}`} onClick={() => setHeroIdx(i)} />
              ))}
            </div>
            <button onClick={() => setHeroIdx(i => (i + 1) % featured.length)} aria-label="Next">→</button>
          </div>
        )}
      </div>
    </section>
  );
}
