import {useEffect, useState} from 'react';
import {reconcileCart} from '../../shared/inventory.js';

const key = 'terrace:bag:v1';
export default function useBag() {
  const [cart, setCart] = useState([]);
  const [ready, setReady] = useState(false);
  const [storageWarning, setStorageWarning] = useState('');
  function restore(products) {
    let saved = [];
    try {saved = JSON.parse(localStorage.getItem(key) || '[]');}
    catch {setStorageWarning('Your saved bag could not be read. You can still use a bag for this visit.');}
    setCart(reconcileCart(saved, products));
    setReady(true);
  }
  useEffect(() => {
    if (!ready) return;
    try {localStorage.setItem(key, JSON.stringify(cart.map(({slug, size, qty}) => ({slug, size, qty}))));}
    catch {setStorageWarning('Your browser could not save the bag. It will last for this visit only.');}
  }, [cart, ready]);
  return {cart, setCart, restore, storageWarning};
}
