const fs = require('fs');

let code = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');

const anchor = `</div></div></div></section>`;

const newSection = `</div></div></div></section>

  {cms['featured-products']?.isActive !== false && cms['featured-products']?.heading && (
    <section className="w-full bg-surface-container py-space-xl px-margin-desktop border-t">
      <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md uppercase text-black font-extrabold tracking-tight">{cms['featured-products'].heading}</h2>
          <Link to="/shop" className="font-label-technical tracking-widest text-[11px] uppercase text-black hover:text-primary transition-colors flex items-center gap-1 font-bold">VIEW ALL <span className="material-symbols-outlined text-[14px]">arrow_forward</span></Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter-desktop">
          {catalogue?.filter(p => !cms['featured-products'].category || p.category === cms['featured-products'].category)
            .slice(0, Number(cms['featured-products'].limit) || 4)
            .map((product) => (
            <article key={product.slug} className="flex flex-col group cursor-pointer" onClick={() => setSelectedProduct(product)}>
              <div className="w-full aspect-[3/4] bg-surface-container-low overflow-hidden relative mb-3">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                {product.retro && <div className="absolute top-2 left-2 bg-black text-white text-[9px] font-label-technical px-2 py-0.5 tracking-wider uppercase">RETRO</div>}
              </div>
              <h3 className="font-label-mono-bold text-[12px] uppercase text-black truncate">{product.name}</h3>
              <div className="flex justify-between items-center mt-1">
                <span className="font-label-technical text-[10px] text-on-surface-variant uppercase">{product.team}</span>
                <span className="font-price-currency text-[12px] font-bold">₹{product.price}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )}`;

code = code.replace(anchor, newSection);

fs.writeFileSync('client/src/pages/Storefront.jsx', code);
