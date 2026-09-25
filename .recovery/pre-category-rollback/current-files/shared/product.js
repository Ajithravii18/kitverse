import {qualities, sizes} from './catalog.js';
import {inStock, stockFor} from './inventory.js';

export const productTypes = ['jersey', 'shorts', 'track-pants'];
export const styleTagsList = ['retro', 'collar'];

export function isListedProduct(product) {
  const isValidType = productTypes.includes(product?.productType || 'jersey');
  const hasValidQuality = (product?.productType === 'shorts' || product?.productType === 'track-pants') 
    ? (!product.quality || qualities.includes(product.quality))
    : qualities.includes(product.quality);

  return Boolean(product && product.published !== false && typeof product.slug === 'string' && product.slug.trim() &&
    typeof product.name === 'string' && product.name.trim() &&
    hasValidQuality && isValidType &&
    ['club', 'national'].includes(product.category) &&
    Number.isFinite(product.price) && product.price >= 0 && inStock(product));
}

function imageUrl(value) {
  if (typeof value !== 'string') return '/images/jersey-placeholder.svg';
  if (/^\/images\/[a-zA-Z0-9._/-]+$/.test(value) && !value.includes('..')) return value;
  try {if (new URL(value).protocol === 'https:') return value;} catch {}
  return '/images/jersey-placeholder.svg';
}

export function publicProduct(product) {
  const isApparel = product.productType === 'shorts' || product.productType === 'track-pants';
  return {
    slug: product.slug, name: product.name, team: typeof product.team === 'string' ? product.team : '',
    category: product.category, 
    quality: isApparel && !product.quality ? undefined : product.quality, 
    price: product.price,
    productType: product.productType || 'jersey',
    styleTags: Array.isArray(product.styleTags) ? product.styleTags.filter(t => styleTagsList.includes(t)) : [],
    image: imageUrl(product.image),
    images: Array.isArray(product.images) ? product.images.filter(image => image && typeof image.url === 'string')
      .slice(0, 8).map((image, index) => ({url: imageUrl(image.url), label: typeof image.label === 'string' ? image.label : `Photo ${index + 1}`})) : [],
    stock: Object.fromEntries(sizes.map(size => [size, stockFor(product, size)])),
    featured: Boolean(product.featured),
    season: typeof product.season === 'string' ? product.season : undefined
  };
}
