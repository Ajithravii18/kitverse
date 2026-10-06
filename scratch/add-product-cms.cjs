const fs = require('fs');

let code = fs.readFileSync('client/src/components/ProductDetailModal.jsx', 'utf8');

// 1. Add cms state and fetch effect
const stateHooks = `  const [error, setError] = useState('');`;
const newHooks = `  const [error, setError] = useState('');
  const [cms, setCms] = useState(null);

  useEffect(() => {
    fetch('/api/content?keys=shipping-info,returns-info,size-guide')
      .then(r => r.json())
      .then(data => setCms(data.content || {}))
      .catch(() => {});
  }, []);`;

code = code.replace(stateHooks, newHooks);

// 2. Add Shipping & Returns accordion under ADD TO CART
const addBtn = `<button className="detail-submit-btn" type="submit" disabled={!selectedSize || remaining(selectedSize) < 1}>ADD TO CART <span>+</span></button>`;
const newAddBtn = `${addBtn}
            
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
`;

code = code.replace(addBtn, newAddBtn);

// 3. Update size guide modal
const oldSizeGuide = `    {showSizeGuide && <Modal label="Sizing guide" className="size-guide-dialog" onClose={() => setShowSizeGuide(false)}>
        <h2>Find your fit.</h2>
        <p>Verified measurements for this jersey are not available yet. Size labels can vary between manufacturers and quality options.</p>
        <ol><li>Lay a well-fitting shirt flat and measure across the chest, from armpit to armpit.</li><li>Measure its length from the highest shoulder point to the hem.</li><li>Compare those measurements with the product's confirmed measurements before ordering.</li></ol>
        <p>We will publish product measurements and exchange terms before checkout opens.</p>
      </Modal>}`;

const newSizeGuide = `    {showSizeGuide && <Modal label="Sizing guide" className="size-guide-dialog" onClose={() => setShowSizeGuide(false)}>
        <h2>{cms?.['size-guide']?.title || 'Find your fit.'}</h2>
        <p>{cms?.['size-guide']?.description || 'Verified measurements for this jersey are not available yet. Size labels can vary between manufacturers and quality options.'}</p>
        <ol><li>Lay a well-fitting shirt flat and measure across the chest, from armpit to armpit.</li><li>Measure its length from the highest shoulder point to the hem.</li><li>Compare those measurements with the product's confirmed measurements before ordering.</li></ol>
      </Modal>}`;

code = code.replace(oldSizeGuide, newSizeGuide);

fs.writeFileSync('client/src/components/ProductDetailModal.jsx', code);
