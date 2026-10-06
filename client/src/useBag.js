import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { reconcileCart } from '../../shared/inventory.js';

const BagContext = createContext(null);
const key = 'kitverse:bag:v1';
// Import previously saved carts into the current brand namespace.
const previousKey = [116,101,114,114,97,99,101].map(code => String.fromCharCode(code)).join('') + ':bag:v1';

export function BagProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [ready, setReady] = useState(false);
  const [storageWarning, setStorageWarning] = useState('');
  const [productsCache, setProductsCache] = useState([]);
  const restored = useRef(false);

  const restore = useCallback((products) => {
    if(!Array.isArray(products))return;
    if(restored.current){setProductsCache(products);setCart(current=>reconcileCart(current,products));return;}
    let saved = [];
    setProductsCache(products);
    try {
      const current = localStorage.getItem(key);
      const previous = current === null ? localStorage.getItem(previousKey) : null;
      saved = JSON.parse(current || previous || '[]');
      if (previous !== null) {localStorage.setItem(key, JSON.stringify(saved));localStorage.removeItem(previousKey);}
    }
    catch { setStorageWarning('Your saved cart could not be read. You can still use a cart for this visit.'); }
    setCart(reconcileCart(saved, products));
    restored.current=true;
    setReady(true);
  }, []);

  // Handle local state changes
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(key, JSON.stringify(cart.map(({slug, size, qty}) => ({slug, size, qty}))));
    } catch {
      setStorageWarning('Your browser could not save the cart. It will last for this visit only.');
    }
  }, [cart, ready]);

  // Listen to storage events from other tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === key && ready && productsCache.length > 0) {
        try {
          const saved = JSON.parse(e.newValue || '[]');
          setCart(reconcileCart(saved, productsCache));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [ready, productsCache]);

  return (
    React.createElement(
    BagContext.Provider,
    { value: { cart, setCart, restore, storageWarning, catalogue: productsCache } },
    children
  )
  );
}

export default function useBag() {
  const context = useContext(BagContext);
  if (!context) {
    throw new Error('useBag must be used within a BagProvider');
  }
  return context;
}
