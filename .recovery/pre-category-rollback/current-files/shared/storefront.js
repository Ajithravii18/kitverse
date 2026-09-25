export const DEFAULT_FILTERS = {category: 'all', quality: 'All qualities', query: '', team: null, sort: 'featured', productType: 'all', styleTag: 'all'};

export function selectProducts(products, filters = DEFAULT_FILTERS) {
  const {category, quality, query, team, sort, productType, styleTag} = {...DEFAULT_FILTERS, ...filters};
  const search = query.trim().toLowerCase();
  const result = products.filter(product =>
    (category === 'all' || product.category === category) &&
    (quality === 'All qualities' || product.quality === quality) &&
    (!team || product.team === team) &&
    (productType === 'all' || product.productType === productType) &&
    (styleTag === 'all' || (product.styleTags && product.styleTags.includes(styleTag))) &&
    (!search || `${product.name} ${product.team || ''}`.toLowerCase().includes(search))
  );
  if (sort === 'low' || sort === 'high') result.sort((a, b) => (a.price - b.price) * (sort === 'low' ? 1 : -1));
  return result;
}

export function paginate(products, requestedPage, pageSize = 8) {
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const page = Math.min(totalPages, Math.max(1, Number.isInteger(requestedPage) ? requestedPage : 1));
  return {page, totalPages, items: products.slice((page - 1) * pageSize, page * pageSize)};
}
