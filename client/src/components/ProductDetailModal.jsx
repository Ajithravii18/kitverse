import {useState, useEffect} from 'react';
import {sizes} from '../../../shared/catalog.js';
import {stockFor} from '../../../shared/inventory.js';
import {money} from '../format.js';
import Modal from './Modal.jsx';
import ProductImage from './ProductImage.jsx';
import './ProductDetailModal.css';

const productTypeLabels = {
  jersey: 'JERSEY',
  shorts: 'SHORTS',
  'track-pants': 'TRACK PANTS',
  'collar-tshirt': 'COLLAR TEE',
};

export default function ProductDetailModal({product, products = [], onSelectRelated, onClose, onAdd, demo, cart}) {
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');
  const [error, setError] = useState('');
  const [cms, setCms] = useState(null);

  useEffect(() => {
    fetch('/api/content?keys=shipping-info,returns-info,size-guide')
      .then(r => r.json())
      .then(data => setCms(data.content || {}))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setActiveIdx(0);
    setSelectedSize('');
    setZoomed(false);
    setError('');
  }, [product?.slug]);

  const images = product.images?.length ? product.images : [{url: product.image, label: 'Product photo'}];
  const productType = product.productType || 'jersey';
  const availableStock = Object.values(product.stock || {}).reduce((total, quantity) => total + quantity, 0);
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
    <div className="w-full max-w-[1200px] bg-background text-foreground flex flex-col md:flex-row overflow-hidden relative">
      <div className="detail-modal-utility"><span>KITVERSE / PRODUCT DOSSIER</span><span>{demo ? 'PREVIEW EDITION' : 'LIVE ARCHIVE'}</span></div>
      <div className="detail-layout">
        <div className="w-full md:w-1/2 relative bg-card flex flex-col border-r border-border min-h-[400px]">
          <div className="detail-gallery-index"><span>SPECIMEN / {productTypeLabels[productType] || 'APPAREL'}</span><span>{String(activeIdx + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span></div>
          <button type="button" className="detail-zoom-stage" aria-label={zoomed ? 'Zoom out' : 'Zoom product photo'}
            aria-pressed={zoomed}
            style={{ touchAction: zoomed ? 'none' : 'auto' }}
            onClick={(e) => { if (!zoomed) updateZoomOrigin(e); setZoomed(!zoomed); }}
            onMouseMove={(e) => { if (zoomed) updateZoomOrigin(e); }}
            onTouchMove={(e) => { if (zoomed) updateZoomOrigin(e); }}
          >
            <ProductImage src={images[Math.min(activeIdx, Math.max(0, images.length - 1))]?.url} alt={`${product.name} — ${images[Math.min(activeIdx, Math.max(0, images.length - 1))].label}`}
              className="detail-zoom-img" style={{ transform: zoomed ? 'scale(2.2)' : 'scale(1)', transformOrigin: zoomOrigin }} />
            <span className="detail-zoom-hint">{zoomed ? 'TAP TO RESET ZOOM' : 'TAP IMAGE TO INSPECT'}</span>
          </button>
          {images.length > 1 && <div className="detail-thumbs-rail" role="group" aria-label="Product photographs">
            {images.map((image, index) => <button type="button" key={image.url + index} className={`detail-thumb-btn ${activeIdx === index ? 'active' : ''}`}
              aria-label={`View ${image.label}`} aria-pressed={activeIdx === index} onClick={() => {setActiveIdx(index); setZoomed(false);}}>
              <ProductImage src={image.url} alt="" className="thumb-img-frame" />
            </button>)}
          </div>}
        </div>
        <div className="w-full md:w-1/2 flex flex-col p-6 md:p-12">
          <div className="flex gap-2 font-label-technical text-[10px] uppercase mb-2"><span className="detail-cat-pill">{product.category === 'national' ? 'NATIONAL TEAM' : product.category === 'club' ? 'CLUB TEAM' : productTypeLabels[productType] || 'APPAREL'}</span><span className="detail-team-pill">{product.team || 'KITVERSE ARCHIVE'}</span></div>
          <h2 className="font-headline-md text-[clamp(44px,6vw,72px)] uppercase leading-[0.9] tracking-tight mb-2 mt-4">{product.name}</h2>
          <div className="detail-price-box"><span className="font-price-currency text-xl font-bold block mb-4 border-b border-border pb-4">{money(product.price)}</span><span className="detail-tax-note">{demo ? 'Sample price / preview inventory' : 'Current listed price / checkout available'}</span></div>
          <div className="grid grid-cols-3 gap-4 border-b border-border pb-6 mb-6 font-label-technical text-[11px] uppercase tracking-wider text-foreground/60">
            <div><span>EDITION</span><strong>{product.season || 'ARCHIVE'}</strong></div>
            <div><span>QUALITY</span><strong>{product.quality || productTypeLabels[productType] || 'STANDARD'}</strong></div>
            <div><span>IN STOCK</span><strong>{availableStock} UNITS</strong></div>
          </div>
          <p className="detail-note">{product.quality === 'First copy + shorts' ? 'A coordinated jersey and shorts set.' : productType === 'jersey' ? 'A football shirt selected from the KITVERSE archive.' : `An archive ${productTypeLabels[productType]?.toLowerCase() || 'apparel'} piece.`} Choose an available size to add it to your cart.</p>
          <form className="detail-form" onSubmit={event => {
            event.preventDefault();
            if (!selectedSize || remaining(selectedSize) < 1) {setError('Choose an available size.'); return;}
            try {onAdd(product, selectedSize);} catch (error) {setError(error.message);}
          }}>
            <fieldset className="mt-6 mb-4"><legend className="font-label-technical text-[11px] mb-3">CHOOSE YOUR SIZE</legend>
              <div className="grid grid-cols-3 gap-2">{sizes.map(size => <button key={size} type="button"
                className={`size-chip border border-border py-3 px-2 flex flex-col items-center justify-center font-label-mono-bold hover:border-foreground transition-colors ${selectedSize === size ? 'bg-foreground text-background' : 'bg-transparent text-foreground'}`} disabled={remaining(size) < 1}
                aria-pressed={selectedSize === size} onClick={() => {setSelectedSize(size); setError('');}}>
                <span className="chip-name">{size}</span>
                {remaining(size) === 0 ? <span className="chip-status">SOLD OUT</span> : remaining(size) < 5 && <span className="chip-status">{remaining(size)} LEFT</span>}
              </button>)}</div>
            </fieldset>
            <div className="detail-form-tools">
              <span>SIZE RUN / S—XXL</span>
              <button type="button" className="detail-size-chart-btn" onClick={() => setShowSizeGuide(true)}>SIZING GUIDE ↗</button>
            </div>
            {demo && <p className="detail-demo-note">Preview stock only. Orders are not enabled in preview mode.</p>}
            {error && <p className="detail-form-error" role="alert">{error}</p>}
            <button className="w-full bg-foreground text-background py-5 font-label-mono-bold text-[14px] uppercase mt-8 hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent hover:border-foreground" type="submit" disabled={!selectedSize || remaining(selectedSize) < 1}>ADD TO CART <span>+</span></button>
            
            {cms && (cms['shipping-info']?.isActive !== false || cms['returns-info']?.isActive !== false) && (
              <div className="mt-8 flex flex-col gap-2 border-t pt-6">
                {cms['shipping-info']?.isActive !== false && cms['shipping-info']?.title && (
                  <details className="group border-b pb-4 cursor-pointer">
                    <summary className="font-label-technical tracking-widest text-[11px] uppercase text-black font-bold flex justify-between items-center list-none outline-none">
                      {cms['shipping-info'].title}
                      <span className="material-symbols-outlined text-[16px] group-open:rotate-180 transition-transform">keyboard_arrow_down</span>
                    </summary>
                    <p className="mt-3 font-body-sm text-[13px] leading-relaxed text-black/80">{cms['shipping-info'].content}</p>
                  </details>
                )}
                
                {cms['returns-info']?.isActive !== false && cms['returns-info']?.title && (
                  <details className="group border-b pb-4 cursor-pointer">
                    <summary className="font-label-technical tracking-widest text-[11px] uppercase text-black font-bold flex justify-between items-center list-none outline-none">
                      {cms['returns-info'].title}
                      <span className="material-symbols-outlined text-[16px] group-open:rotate-180 transition-transform">keyboard_arrow_down</span>
                    </summary>
                    <p className="mt-3 font-body-sm text-[13px] leading-relaxed text-black/80">{cms['returns-info'].content}</p>
                  </details>
                )}
              </div>
            )}

          </form>
        </div>
      </div>
    </div>

    {products && products.length > 0 && (
      <div className="related-products-section">
        <h3>MORE FROM THE ARCHIVE</h3>
        <div className="related-products-rail">
          {[...products.filter(p => p.team === product.team && p.slug !== product.slug), ...products.filter(p => p.category === product.category && p.team !== product.team && p.slug !== product.slug)].slice(0, 10).map(p => (
            <button
              key={p.slug}
              className="detail-related-card"
              type="button"
              onClick={() => onSelectRelated && onSelectRelated(p)}
            >
              <div className="detail-related-image">
                <ProductImage src={p.image} alt={p.name} />
              </div>
              <div className="detail-related-copy">
                <span>{p.team}</span>
                <strong>{p.name}</strong>
                <b>{money(p.price)}</b>
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
