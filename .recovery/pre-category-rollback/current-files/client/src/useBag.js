import {useEffect, useState, useRef} from 'react';
import {apiFetch} from './api.js';

const key = 'kitverse:bag:v1';
export default function useBag() {
  const [cart, setCart] = useState([]);
  const [ready, setReady] = useState(false);
  const [storageWarning, setStorageWarning] = useState('');
  const failedItemsRef = useRef([]);

  async function restore() {
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      setStorageWarning('Your saved bag could not be read. You can still use a bag for this visit.');
      setReady(true);
      return;
    }
    
    if (saved.length === 0) {
      setReady(true);
      return;
    }

    try {
      const res = await apiFetch('/api/bag/reconcile', {
        method: 'POST',
        body: JSON.stringify({ items: saved })
      });
      setCart(res.cart);
    } catch (err) {
      // Transient failure, keep the saved items for later, but cart is empty for now
      failedItemsRef.current = saved;
      setStorageWarning('Could not verify some saved items due to a network error. They are kept safe.');
    }
    
    setReady(true);
  }

  useEffect(() => {
    if (!ready) return;
    try {
      const currentCartSaved = cart.map(({slug, size, qty}) => ({slug, size, qty}));
      const merged = [...currentCartSaved];
      for (const item of failedItemsRef.current) {
        if (!merged.find(m => m.slug === item.slug && m.size === item.size)) {
           merged.push(item);
        }
      }
      localStorage.setItem(key, JSON.stringify(merged));
    } catch {
      setStorageWarning('Your browser could not save the bag. It will last for this visit only.');
    }
  }, [cart, ready]);

  return {cart, setCart, restore, storageWarning};
}
