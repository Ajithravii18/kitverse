import {qualities, sizes} from './catalog.js';
import {inStock, stockFor} from './inventory.js';

export function isListedProduct(product) {
  return Boolean(product && product.published !== false && typeof product.slug === 'string' && product.slug.trim() &&
    typeof product.name === 'string' && product.name.trim() &&
    qualities.includes(product.quality) && ['club', 'national'].includes(product.category) &&
    Number.isFinite(product.price) && product.price >= 0 && inStock(product));
}
function imageUrl(value) {
  if (typeof value !== 'string') return '/images/jersey-placeholder.svg';
  if (/^\/images\/[a-zA-Z0-9._/-]+$/.test(value) && !value.includes('..')) return value;
  try {if (new URL(value).protocol === 'https:') return value;} catch {}
  return '/images/jersey-placeholder.svg';
}
export function publicProduct(product) {
  return {
    slug: product.slug, name: product.name, team: typeof product.team === 'string' ? product.team : '',
    category: product.category, quality: product.quality, price: product.price,
    image: imageUrl(product.image),
    images: Array.isArray(product.images) ? product.images.filter(image => image && typeof image.url === 'string')
      .slice(0, 8).map((image, index) => ({url: imageUrl(image.url), label: typeof image.label === 'string' ? image.label : `Photo ${index + 1}`})) : [],
    stock: Object.fromEntries(sizes.map(size => [size, stockFor(product, size)])),
    featured: Boolean(product.featured),
    season: typeof product.season === 'string' ? product.season : undefined
  };
}
