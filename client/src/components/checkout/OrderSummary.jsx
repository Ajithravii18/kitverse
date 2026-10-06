import React from 'react';
import ProductImage from '../ProductImage.jsx';
import { stockFor } from '../../../../shared/inventory.js';
import { money } from '../../format.js';

export default function OrderSummary({
  cart,
  setCart,
  products,
  submitting,
  updateQuantity,
  total,
  authenticated,
  requireLogin
}) {
  return (
    <div className="w-full lg:w-[420px] shrink-0">
      <div className="bg-surface-container-low border border-black/10 p-space-lg flex flex-col sticky top-32">
        <div className="flex items-center justify-between border-b border-black/10 pb-space-sm mb-space-md">
          <h3 className="font-headline-sm text-headline-sm uppercase text-on-surface">ORDER MANIFEST</h3>
          <span className="font-label-technical text-label-technical tracking-widest text-on-surface-variant uppercase">KV / {cart.length.toString().padStart(2, '0')}</span>
        </div>
        
        <div className="flex flex-col gap-space-md mb-space-lg overflow-y-auto max-h-[40vh] pr-2 custom-scrollbar">
          {cart.map((item) => (
            <div key={item.key} className="flex gap-space-sm bg-surface p-space-xs border border-black/5">
              <div className="w-20 h-24 bg-surface-container flex items-center justify-center shrink-0 p-1">
                <ProductImage src={item.image} alt={item.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col justify-between flex-1 py-1">
                <div className="flex flex-col gap-0.5">
                  <span className="font-label-mono-bold text-[11px] uppercase text-on-surface leading-tight">{item.name}</span>
                  <span className="font-label-technical text-[9px] text-on-surface-variant uppercase tracking-widest">{item.quality || item.productType}</span>
                  <span className="font-label-technical text-[9px] text-on-surface uppercase tracking-widest mt-1">SIZE: {item.size}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 bg-surface-container px-2 py-1">
                    <button type="button" disabled={submitting} onClick={() => updateQuantity(item.key, -1)} className="text-on-surface-variant hover:text-on-surface font-label-mono-bold">-</button>
                    <span className="font-label-mono-bold text-[12px]">{item.qty}</span>
                    <button type="button" disabled={submitting || item.qty >= stockFor(products.find(p => p.slug === item.slug), item.size)} onClick={() => updateQuantity(item.key, 1)} className="text-on-surface-variant hover:text-on-surface font-label-mono-bold">+</button>
                  </div>
                  <span className="font-price-currency text-[12px] font-bold text-on-surface">{money(item.price * item.qty)}</span>
                </div>
              </div>
              <button type="button" disabled={submitting} onClick={() => setCart(current => current.filter(row => row.key !== item.key))} className="w-8 flex items-start justify-center pt-1 text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-space-sm border-t border-black/10 pt-space-md mb-space-lg">
          <div className="flex justify-between items-center font-label-mono-bold text-[12px] text-on-surface-variant uppercase">
            <span>SUBTOTAL</span>
            <span>{money(total)}</span>
          </div>
          <div className="flex justify-between items-center font-label-mono-bold text-[12px] text-on-surface-variant uppercase">
            <span>SHIPPING</span>
            <span>CALCULATED AT PAYMENT</span>
          </div>
          <div className="flex justify-between items-end border-t border-black pt-space-sm mt-1">
            <span className="font-headline-sm text-[16px] text-on-surface uppercase">TOTAL</span>
            <span className="font-price-currency text-[20px] font-bold text-on-surface">{money(total)}</span>
          </div>
        </div>
        
        <p className="font-label-technical text-[9px] text-on-surface-variant uppercase tracking-widest mb-space-md leading-relaxed">
          TRANSACTION SECURED VIA RAZORPAY. YOUR DATA IS ENCRYPTED AND PROCESSED ACCORDING TO OUR ARCHIVE PRIVACY DIRECTIVES.
        </p>

        <button type="submit" form="checkout-form" onClick={(e) => { if (!authenticated) { requireLogin(); return; } const form = document.getElementById('checkout-form'); if (form) { if (form.requestSubmit) form.requestSubmit(); else form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); } }} disabled={submitting} className={`w-full py-4 px-space-md font-label-mono-bold text-[14px] tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${submitting ? 'bg-surface-container text-on-surface-variant cursor-not-allowed' : 'bg-black text-white hover:bg-black/80'}`}>
          {submitting ? 'PROCESSING...' : authenticated ? (
            <>CONFIRM & PAY <span className="material-symbols-outlined text-[18px]">lock</span></>
          ) : 'LOGIN TO CHECKOUT'}
        </button>
      </div>
    </div>
  );
}
