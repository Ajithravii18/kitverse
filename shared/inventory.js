import {sizes} from './catalog.js';
export function stockFor(product, size) {
  const quantity = product?.stock?.[size];
  return sizes.includes(size) && Number.isSafeInteger(quantity) && quantity > 0 ? quantity : 0;
}
export function inStock(product) {
  return sizes.some(size => stockFor(product, size) > 0);
}
export function addItem(cart, product, size) {
  const key = `${product.slug}:${size}`;
  const current = cart.find(item => item.key === key);
  if ((current?.qty || 0) >= stockFor(product, size)) {
    throw new Error('No more stock is available in this size.');
  }
  return current
    ? cart.map(item => item.key === key ? { ...item, qty: item.qty + 1 } : item)
    : [...cart, { key, slug: product.slug, name: product.name, quality: product.quality, size, price: product.price, qty: 1, image: product.image }];
}
export function changeQuantity(cart, key, delta, products) {
  if (delta !== 1 && delta !== -1) throw new Error('Quantity must change by one.');
  const item = cart.find(item => item.key === key);
  if (!item) return cart;
  const product = products.find(product => product.slug === item.slug);
  if (delta > 0 && item.qty + delta > stockFor(product, item.size)) throw new Error('No more stock is available in this size.');
  return cart.map(item => item.key === key ? { ...item, qty: item.qty + delta } : item).filter(item => item.qty > 0);
}

// Storage supplies identity and quantity only. The API supplies current product data.
export function reconcileCart(saved, products) {
  if (!Array.isArray(saved)) return [];
  const result = [];
  for (const item of saved) {
    if (!item || !Number.isSafeInteger(item.qty) || item.qty < 1) continue;
    const product = products.find(product => product.slug === item.slug);
    const available = stockFor(product, item.size);
    if (!available) continue;
    const key = `${product.slug}:${item.size}`;
    const existing = result.find(row => row.key === key);
    if (existing) existing.qty = Math.min(available, existing.qty + item.qty);
    else result.push({key, slug: product.slug, name: product.name, quality: product.quality, size: item.size, price: product.price, qty: Math.min(available, item.qty), image: product.image});
  }
  return result;
}
