import UiIcon from './UiIcon.jsx';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useBag from '../useBag.js';
import CartDrawer from './CartDrawer.jsx';

export default function Navbar() {
  const { cart, setCart, restore } = useBag();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  
  // Use a fully transparent navbar on the homepage, but white/black on other pages for readability
  const isHome = location.pathname === '/';
  
  useEffect(() => {
    fetch('/api/products')
      .then(res => {if(!res.ok)throw new Error('Catalogue unavailable');return res.json();})
      .then(data => {
        const catalog = data.products || data;
        restore(catalog);
      })
      .catch(err => console.error("Failed to fetch products for Navbar cart:", err));
  }, []);

  const cartItemCount = cart.reduce((total, item) => total + item.qty, 0);

  return (
    <>
      <header className={`absolute top-0 left-0 right-0 z-50 px-6 py-5 flex items-center justify-between pointer-events-none transition-colors duration-300 ${isHome ? 'text-white' : 'text-primary'}`}>
        
        {/* Left Side: Logo and Tagline */}
        <div className="flex flex-col text-left pointer-events-auto">
          <Link to="/" className="font-body-lg text-sm font-semibold tracking-wide">
            KITVERSE.
          </Link>
          <span className="font-body-sm text-[11px] opacity-80 mt-0.5">
            The Complete Archive
          </span>
        </div>
        
        {/* Right Side: Links */}
        <nav className="flex items-center gap-6 md:gap-8 pointer-events-auto overflow-x-auto custom-scrollbar">
          <Link className="font-body-md text-sm hover:opacity-70 transition-opacity" to="/shop">Shop All</Link>
          <Link className="font-body-md text-sm hover:opacity-70 transition-opacity " to="/shop?category=club">Club Kits</Link>
          <Link className="font-body-md text-sm hover:opacity-70 transition-opacity " to="/shop?category=national">National</Link>
          
          <Link to="/profile" className="font-body-md text-sm hover:opacity-70 transition-opacity">
            Account
          </Link>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            aria-label={`Cart with ${cartItemCount} items`}
            className="font-body-md text-sm hover:opacity-70 transition-opacity"
          >
            Cart [{cartItemCount}]
          </button>
        </nav>
        
      </header>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} setCart={setCart} />
    </>
  );
}
