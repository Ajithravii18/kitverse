import React, { createContext, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Storefront from './pages/Storefront.jsx';
import CollectionPage from './pages/CollectionPage.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import CustomerLayout from './components/layout/CustomerLayout.jsx';
import AdminProducts from './pages/AdminProducts.jsx';
import AdminOrders from './pages/AdminOrders.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderStatus from './pages/OrderStatus.jsx';
import Auth from './pages/Auth.jsx';
import Profile from './pages/Profile.jsx';
import useBag from './useBag.js';
import { addItem, changeQuantity, stockFor } from '../../shared/inventory.js';
import Modal from './components/Modal.jsx';
import { money } from './format.js';
import { Link } from 'react-router-dom';
import QualityGuide from './components/QualityGuide.jsx';

export const BagContext = createContext(null);

function Root() {
  const { cart, setCart, restore, storageWarning } = useBag();
  const [bagOpen, setBagOpen] = useState(false);
  const [demo, setDemo] = useState(true);
  const [products, setProducts] = useState([]); // Needed for bag stock checks
  const [authCustomer, setAuthCustomer] = useState(false);

  useEffect(() => {
    restore();

    fetch('/api/products')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setProducts(data.products);
        setDemo(data.demo);
      })
      .catch(() => {});
      
    fetch('/api/customer/me')
      .then(r => r.json())
      .then(data => setAuthCustomer(data.authenticated))
      .catch(() => {});
  }, []);

  const cartCount = cart.reduce((n, x) => n + x.qty, 0);

  const contextValue = {
    cart, setCart, addItem, changeQuantity, stockFor, demo, products, bagOpen, setBagOpen, cartCount, authCustomer
  };

return (
    <BagContext.Provider value={contextValue}>
      <BrowserRouter>
        <Routes>
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<Storefront />} />
            <Route path="/shop" element={<CollectionPage />} />
            <Route path="/collections/:slug" element={<CollectionPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:ref" element={<OrderStatus />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
          <Route path="*" element={<div className="not-found"><h2>404 Not Found</h2><Link to="/">Go Home</Link></div>} />
        </Routes>
        
        {bagOpen && (
          <Modal label="Shopping bag" onClose={() => setBagOpen(false)}>
            <h2>Your matchday bag.</h2>
            {cart.length ? cart.map(x => (
              <div className="cart-row" key={x.key}>
                <div>
                  <p>{x.name}</p>
                  <small>{x.quality} · {x.size}</small>
                  <p>{money(x.price * x.qty)}</p>
                </div>
                <div className="quantity">
                  <button aria-label={`Decrease ${x.name} quantity`} onClick={() => setCart(changeQuantity(cart, x.key, -1, products))}>−</button>
                  <span>{x.qty}</span>
                  <button disabled={x.qty >= (x.maxQty !== undefined ? x.maxQty : stockFor(products.find(p => p.slug === x.slug), x.size))} aria-label={`Increase ${x.name} quantity`} onClick={() => setCart(changeQuantity(cart, x.key, 1, products))}>+</button>
                </div>
              </div>
            )) : <p>Your bag is waiting for its first jersey.</p>}
            {cart.length > 0 && (
              <div className="total">
                <span>Subtotal</span>
                <span>{money(cart.reduce((n, x) => n + x.price * x.qty, 0))}</span>
              </div>
            )}
            {storageWarning && <p role="status">{storageWarning}</p>}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <Link to="/checkout" className="primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '15px' }} onClick={() => setBagOpen(false)}>Checkout</Link>
              <button className="secondary" style={{ flex: 1 }} onClick={() => setBagOpen(false)}>Keep exploring</button>
            </div>
            
            <details style={{ marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>View Quality & Sizing Guide</summary>
              <QualityGuide />
            </details>
          </Modal>
        )}
      </BrowserRouter>
    </BagContext.Provider>
  );
}

createRoot(document.getElementById('root')).render(<Root />);