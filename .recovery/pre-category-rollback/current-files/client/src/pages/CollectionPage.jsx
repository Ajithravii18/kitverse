import React, { useEffect, useState, useContext } from 'react';
import useScrollReveal from '../useScrollReveal.js';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { collectionsConfig } from '../../../shared/collections.js';
import CollectionSidebar from '../components/shop/CollectionSidebar.jsx';
import SortControl from '../components/shop/SortControl.jsx';
import ProductCard from '../components/shop/ProductCard.jsx';
import ProductDetailModal from '../components/ProductDetailModal.jsx';
import FilterDrawer from '../components/shop/FilterDrawer.jsx';
import ActiveFilters from '../components/shop/ActiveFilters.jsx';
import { BagContext } from '../main.jsx';

export default function CollectionPage() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const matchedCollection = slug ? collectionsConfig.find(c => c.slug === slug) : null;
  const invalidCollection = Boolean(slug && !matchedCollection);
  const collection = matchedCollection || { label: 'All products', description: 'Explore the complete kit room.', filter: {} };
  
  const searchParams = new URLSearchParams(location.search);
  const page = parseInt(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || 'featured';
  const query = searchParams.get('query') || '';
  const filters = { quality: searchParams.get('quality') || '' };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  useScrollReveal([products.length]);

  const updateParams = (updates) => {
    const p = new URLSearchParams(location.search);
    let pageReset = false;
    for (const [key, val] of Object.entries(updates)) {
      if (val === null || val === '') p.delete(key);
      else p.set(key, val);
      if (key !== 'page') pageReset = true;
    }
    if (pageReset) p.delete('page');
    navigate({ search: p.toString() });
  };

  const applyFilters = () => { setIsFilterOpen(false); };
  const removeFilter = (key) => updateParams({ [key]: null });
  const clearAllFilters = () => navigate({ search: '' });

  const { cart, setCart, addItem, demo } = useContext(BagContext);

  // Empty as state is URL driven

  useEffect(() => {
    if (invalidCollection) return undefined;
    let active = true;
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
if (collection.filter.category) params.set('category', collection.filter.category);
        if (collection.filter.quality) params.set('quality', collection.filter.quality);
        if (collection.filter.productType) params.set('productType', collection.filter.productType);
        if (collection.filter.styleTags) params.set('styleTags', collection.filter.styleTags.join(','));
        
        if (filters.quality) params.set('quality', filters.quality);
        if (sort !== 'featured') params.set('sort', sort);
        if (query) params.set('query', query);
        if (page > 1) params.set('page', page);
        
        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (active) {
          setProducts(data.products);
          setTotal(data.total);
          setTotalPages(data.totalPages);
          setLoading(false);
        }
      } catch (err) {
        if (active) setLoading(false);
      }
    }
    fetchProducts();
    return () => { active = false; };
  }, [slug, sort, query, page, filters.quality, navigate, invalidCollection]);

  if (invalidCollection) {
    return <div className="not-found"><h2>Collection not found</h2><Link to="/shop">View all products</Link></div>;
  }

  return (
    <div className="collection-page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> {slug && <> / <span>{collection.label}</span></>}
      </div>
      
      <header className="collection-header">
        <h1>{collection.label}</h1>
        <p>{collection.description}</p>
        <div className="collection-meta">
          <span>{total} {total === 1 ? 'result' : 'results'}</span>
        </div>
      </header>

      <div className="catalogue-shell">
        <div className="catalogue-sidebar-wrap">
          <CollectionSidebar filters={filters} updateParams={updateParams} />
        </div>
        
        <div className="catalogue-main">
          <div className="catalogue-tools">
            <div className="search-bar">
              <input type="text" placeholder="Search..." value={query} onChange={e => updateParams({ query: e.target.value })} />
            </div>
            <div className="sort-filter-wrap">
              <button className="mobile-filter-btn" onClick={() => setIsFilterOpen(true)}>
                Filter {Object.values(filters).filter(Boolean).length > 0 && `(${Object.values(filters).filter(Boolean).length})`}
              </button>
              <SortControl sort={sort} setSort={s => updateParams({ sort: s })} />
            </div>
          </div>
          
          <ActiveFilters filters={filters} removeFilter={removeFilter} clearAll={clearAllFilters} />

          {loading ? (
             <div className="products">
               {Array.from({ length: 8 }).map((_, i) => (
                 <div className="product skeleton-product" key={i}>
                   <div className="skeleton-product-img" />
                   <div className="skeleton-product-text">
                     <div className="skeleton-product-line" style={{ width: '45%' }} />
                     <div className="skeleton-product-line" style={{ width: '75%' }} />
                     <div className="skeleton-product-line" style={{ width: '35%' }} />
                   </div>
                 </div>
               ))}
             </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>No products found.</h3>
              <button className="primary" onClick={() => updateParams({ query: null })}>Clear search</button>
            </div>
          ) : (
            <>
              <div className="products">
                {products.map((p, index) => (
                  <ProductCard key={p.slug} product={p} index={index} openProduct={setSelected} />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="pagination">
                  <button className="primary" disabled={page === 1} onClick={() => { updateParams({ page: page - 1 }); window.scrollTo({top: 0, behavior: 'smooth'}); }}>Previous</button>
                  <span>Page {page} of {totalPages}</span>
                  <button className="primary" disabled={page === totalPages} onClick={() => { updateParams({ page: page + 1 }); window.scrollTo({top: 0, behavior: 'smooth'}); }}>Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

{selected && (
        <ProductDetailModal key={selected.slug}
          product={selected}
          products={products}
          onSelectRelated={(prod) => setSelected(prod)}
          onClose={() => setSelected(null)}
          onAdd={(prod, chosenSize) => {
            setCart(addItem(cart, prod, chosenSize));
            setSelected(null);
          }}
          cart={cart}
          demo={demo}
        />
      )}

      <FilterDrawer 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        filters={filters} 
        updateParams={updateParams}
        applyFilters={applyFilters} 
      />
    </div>
  );
}
