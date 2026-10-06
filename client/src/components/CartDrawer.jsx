import UiIcon from './UiIcon.jsx';
import ProductImage from './ProductImage.jsx';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { money } from '../format.js';
import useBag from '../useBag.js';
import { changeQuantity, stockFor } from '../../../shared/inventory.js';

export default function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const dialogRef=useRef(null);
  const [error,setError]=useState('');
  const { cart, setCart, catalogue } = useBag();

  const cartItemCount = cart.reduce((total, item) => total + item.qty, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const orderTotal = cartSubtotal; // Free shipping

  const updateQuantity = (key, delta) => {
    try {
      setCart(changeQuantity(cart,key,delta,catalogue));
      setError('');
    } catch (e) {
      setError(e.message);
    }
  };

  const removeItem = (key) => {
    setCart(current => current.filter(item => item.key !== key));
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  useEffect(()=>{
    if(!isOpen)return;
    const previous=document.activeElement;
    const overflow=document.body.style.overflow;
    dialogRef.current.showModal();
    document.body.style.overflow='hidden';
    return ()=>{dialogRef.current?.close();document.body.style.overflow=overflow;if(previous?.isConnected)previous.focus();};
  },[isOpen]);
  if(!isOpen)return null;
  return <dialog ref={dialogRef} className="cart-drawer" aria-label="Shopping Cart"
    onCancel={event=>{event.preventDefault();onClose();}}
    onClick={event=>{if(event.target===dialogRef.current){const r=event.target.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right)onClose();}}}>
        {error && <p role="alert" className="p-3 text-red-700">{error}</p>}
        <div className="flex items-center justify-between p-space-md border-b border-black/10 bg-surface-container-low shrink-0">
          <div className="flex flex-col">
            <h2 className="font-headline-sm uppercase text-black leading-tight tracking-tight">DISPATCH MANIFEST</h2>
            <span className="font-label-technical text-[9px] uppercase tracking-widest text-on-surface-variant">
              {cartItemCount} {cartItemCount === 1 ? 'ITEM' : 'ITEMS'} IN CART
            </span>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-black hover:bg-error-container text-white hover:text-error transition-colors shrink-0 border border-transparent hover:border-error"
            aria-label="Close cart"
          >
            <UiIcon name="close" className="" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-space-md flex flex-col gap-space-md bg-white">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-space-md opacity-70">
              <UiIcon name="shopping_bag" className="text-[40px] text-on-surface-variant" />
              <div className="flex flex-col gap-1">
                <span className="font-headline-sm text-black uppercase">YOUR CART IS EMPTY</span>
                <span className="font-body-sm text-[12px] uppercase text-on-surface-variant max-w-[250px]">Return to the storefront to add items to your manifest.</span>
              </div>
              <button type="button" onClick={onClose} className="mt-4 border-b border-black font-label-mono-bold text-[10px] uppercase pb-0.5 hover:text-primary transition-colors">
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div key={item.key} className="flex gap-4 items-start pb-4 border-b border-black/5 relative group">
                  <Link to={`/shop?search=${encodeURIComponent(item.name)}`} onClick={onClose} className="w-20 h-24 bg-surface-container shrink-0 p-1.5 flex items-center justify-center border border-black/5 hover:border-black/30 transition-colors">
                    <ProductImage src={item.image} alt={item.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                  </Link>
                  <div className="flex flex-col pt-0.5 flex-1 w-full">
                    <span className="font-label-technical text-[8px] uppercase tracking-widest text-on-surface-variant mb-1">
                      {item.quality || item.productType}
                    </span>
                    <Link to={`/shop?search=${encodeURIComponent(item.name)}`} onClick={onClose} className="font-headline-sm text-[14px] uppercase text-black hover:text-primary transition-colors leading-tight pr-6">
                      {item.name}
                    </Link>
                    <span className="font-label-technical text-[10px] text-on-surface uppercase tracking-widest mt-1">
                      SIZE: <strong className="font-bold">{item.size}</strong>
                    </span>
                    <div className="flex items-end justify-between mt-3">
                      <div className="flex items-center gap-2 border border-black px-1.5 py-1 bg-surface-container">
                        <button type="button" aria-label={`Decrease ${item.name} quantity`} onClick={() => updateQuantity(item.key, -1)} className="text-on-surface-variant hover:text-black font-label-mono-bold w-4 h-4 flex items-center justify-center">-</button>
                        <span className="font-label-mono-bold text-[11px] min-w-[2ch] text-center">{item.qty}</span>
                        <button type="button" aria-label={`Increase ${item.name} quantity`} disabled={item.qty >= stockFor(catalogue.find(p=>p.slug===item.slug),item.size)} onClick={() => updateQuantity(item.key, 1)} className="text-on-surface-variant hover:text-black font-label-mono-bold w-4 h-4 flex items-center justify-center">+</button>
                      </div>
                      <span className="font-price-currency text-[13px] font-bold text-black">{money(item.price * item.qty)}</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeItem(item.key)} className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center text-on-surface-variant hover:text-error transition-colors" title="Remove Item">
                    <UiIcon name="close" className="text-[16px]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-space-md border-t border-black bg-surface shrink-0 flex flex-col gap-4">
            <div className="flex flex-col gap-2 font-label-mono-bold text-[11px] uppercase">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>SUBTOTAL</span>
                <span className="font-price-currency text-on-surface">{money(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>DISPATCH</span>
                <span className="font-price-currency text-on-surface">FREE</span>
              </div>
            </div>
            <div className="flex justify-between items-end pt-3 border-t border-black/10">
              <span className="font-headline-sm text-[14px] uppercase tracking-widest">TOTAL</span>
              <span className="font-price-currency text-[20px] font-bold tracking-tight text-black">{money(orderTotal)}</span>
            </div>
            <button 
              type="button" 
              onClick={handleCheckout}
              className="w-full mt-2 py-4 bg-black hover:bg-primary-container text-white hover:text-black font-label-mono-bold text-[13px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors duration-200 group"
            >
              <span>PROCEED TO CHECKOUT</span>
              <UiIcon name="arrow_forward" className="text-[18px] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
    </dialog>;
}
