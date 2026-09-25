import {useState} from 'react';
import {sizes} from '../../../shared/catalog.js';
import {stockFor} from '../../../shared/inventory.js';
import {money} from '../format.js';
import Modal from './Modal.jsx';
import ProductImage from './ProductImage.jsx';

export default function ProductDetailModal({product, products = [], onSelectRelated, onClose, onAdd, demo, cart}) {
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');
  const [error, setError] = useState('');
  const images = product.images?.length ? product.images : [{url: product.image, label: 'Product photo'}];
  const remaining = size => Math.max(0, stockFor(product, size) - (cart.find(item => item.slug === product.slug && item.size === size)?.qty || 0));

  const updateZoomOrigin = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
    if (clientX == null || clientY == null) return;
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    setZoomOrigin(`${x}% ${y}%`);
  };

  return <Modal label={product.name} className="product-modal-dialog" onClose={onClose}>
    <div className="detail-layout">
      <div className="detail-gallery-col">
        <button type="button" className="detail-zoom-stage" aria-label={zoomed ? 'Zoom out' : 'Zoom product photo'}
          aria-pressed={zoomed} 
          style={{ touchAction: zoomed ? 'none' : 'auto' }}
          onClick={(e) => { if (!zoomed) updateZoomOrigin(e); setZoomed(!zoomed); }}
          onMouseMove={(e) => { if (zoomed) updateZoomOrigin(e); }}
          onTouchMove={(e) => { if (zoomed) updateZoomOrigin(e); }}
        >
          <ProductImage src={images[activeIdx].url} alt={`${product.name} — ${images[activeIdx].label}`}
            className="detail-zoom-img" style={{ transform: zoomed ? 'scale(2.2)' : 'scale(1)', transformOrigin: zoomOrigin }} />
          <span className="detail-zoom-hint">{zoomed ? 'Click or tap to zoom out' : 'Click or tap to zoom'}</span>
        </button>
        {images.length > 1 && <div className="detail-thumbs-rail" role="group" aria-label="Product photographs">
          {images.map((image, index) => <button type="button" key={image.url + index} className={`detail-thumb-btn ${activeIdx === index ? 'active' : ''}`}
            aria-label={`View ${image.label}`} aria-pressed={activeIdx === index} onClick={() => {setActiveIdx(index); setZoomed(false);}}>
            <ProductImage src={image.url} alt="" className="thumb-img-frame" />
          </button>)}
        </div>}
      </div>
      <div className="detail-info-col">
        <div className="detail-header-tags"><span className="detail-cat-pill">{product.category === 'national' ? 'NATIONAL TEAM' : 'CLUB TEAM'}</span><span className="detail-team-pill">{product.team}</span></div>
        <h2 className="detail-product-title">{product.name}</h2>
        <div className="detail-price-box"><span className="detail-price">{money(product.price)}</span><span className="detail-tax-note">{demo ? 'Sample price' : 'Listed price'} · Checkout unavailable</span></div>
        <p>Quality: <strong>{product.quality}</strong></p>
        <p className="detail-note">{product.quality === 'First copy + shorts' ? 'Listed as a jersey and shorts set.' : 'Listed as a jersey only.'} Product specifications and measurements must be confirmed before orders open.</p>
        <form className="detail-form" onSubmit={event => {
          event.preventDefault();
          if (!selectedSize || remaining(selectedSize) < 1) {setError('Choose an available size.'); return;}
          try {onAdd(product, selectedSize);} catch (error) {setError(error.message);}
        }}>
          <fieldset className="size-fieldset"><legend>Choose your size</legend>
            <div className="detail-size-chips">{sizes.map(size => <button key={size} type="button"
              className={`size-chip ${selectedSize === size ? 'active' : ''}`} disabled={remaining(size) < 1}
              aria-pressed={selectedSize === size} onClick={() => {setSelectedSize(size); setError('');}}>
              <span className="chip-name" style={{ textDecoration: remaining(size) === 0 ? 'line-through' : 'none' }}>{size} {remaining(size) === 0 && <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>&times;</span>}</span>
                {remaining(size) > 0 && remaining(size) < 5 && <span className="chip-status" style={{ color: '#d97706' }}>Low stock</span>}
            </button>)}</div>
          </fieldset>
          <button type="button" className="detail-size-chart-btn" onClick={() => setShowSizeGuide(true)}>Sizing guide</button>
          {demo && <p className="detail-note">Sample inventory. Bag quantities do not reserve stock.</p>}
          {error && <p role="alert">{error}</p>}
          <button className="detail-submit-btn" type="submit" disabled={!selectedSize || remaining(selectedSize) < 1}>Add to cart <span>+</span></button>
        </form>
      </div>
    </div>
    
    {products && products.length > 0 && (
      <div className="related-products-section" style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #eaeaea' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '20px' }}>You Might Also Like</h3>
        <div className="related-products-rail" style={{ display: 'flex', overflowX: 'auto', gap: '15px', paddingBottom: '10px' }}>
          {[...products.filter(p => p.team === product.team && p.slug !== product.slug), ...products.filter(p => p.category === product.category && p.team !== product.team && p.slug !== product.slug)].slice(0, 10).map(p => (
            <button 
              key={p.slug} 
              type="button"
              onClick={() => onSelectRelated && onSelectRelated(p)}
              style={{ flex: '0 0 auto', width: '150px', background: 'none', border: '1px solid #eaeaea', padding: '10px', cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px', transition: 'border-color 0.2s ease', boxSizing: 'border-box' }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = '#000'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = '#eaeaea'}
            >
              <div style={{ width: '100%', aspectRatio: '1/1', background: '#f4f6ef', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <ProductImage src={p.image} alt={p.name} style={{ width: '90%', height: '90%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
              </div>
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.team}</div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', lineHeight: '1.2', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '6px' }}>{money(p.price)}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )}
    {showSizeGuide && <Modal label="Sizing guide" className="size-guide-dialog" onClose={() => setShowSizeGuide(false)}>
      <h2>Find your fit.</h2>
      <p>Verified measurements for this jersey are not available yet. Size labels can vary between manufacturers and quality options.</p>
      <ol><li>Lay a well-fitting shirt flat and measure across the chest, from armpit to armpit.</li><li>Measure its length from the highest shoulder point to the hem.</li><li>Compare those measurements with the product’s confirmed measurements before ordering.</li></ol>
      <p>We will publish product measurements and exchange terms before checkout opens.</p>
    </Modal>}
  </Modal>;
}
