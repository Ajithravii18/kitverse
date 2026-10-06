import './style.css';
import './animations.css';
import './brand-colors.css';
import './loading.css';
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BagProvider } from './useBag.js';
import PageLoader from './components/PageLoader.jsx';
import PageTransition from './components/PageTransition.jsx';

const Storefront = React.lazy(() => import('./pages/Storefront.jsx'));
const Shop = React.lazy(() => import('./pages/ShopPage.jsx'));
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout.jsx'));
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard.jsx'));
const AdminInventory = React.lazy(() => import('./components/admin/AdminInventory.jsx'));
const AdminProducts = React.lazy(() => import('./pages/AdminProducts.jsx'));
const AdminOrders = React.lazy(() => import('./pages/AdminOrders.jsx'));
const AdminCustomers = React.lazy(() => import('./pages/AdminCustomers.jsx'));
const AdminContent = React.lazy(() => import('./pages/AdminContent.jsx'));
const AdminDiscounts = React.lazy(() => import('./pages/AdminDiscounts.jsx'));
const AdminReviews = React.lazy(() => import('./pages/AdminReviews.jsx'));
const AdminReports = React.lazy(() => import('./pages/AdminReports.jsx'));
const Checkout = React.lazy(() => import('./pages/Checkout.jsx'));
const Login = React.lazy(() => import('./pages/Login.jsx'));
const SignUp = React.lazy(() => import('./pages/SignUp.jsx'));
const Profile = React.lazy(() => import('./pages/Profile.jsx'));

function Root() {
  return (
    <BrowserRouter>
      <BagProvider>
        <Suspense fallback={<PageLoader />}>
          <PageTransition>
          <Routes>
            <Route path="/" element={<Storefront />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="discounts" element={<AdminDiscounts />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="reports" element={<AdminReports />} />
            </Route>
          </Routes>
          </PageTransition>
        </Suspense>
      </BagProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<Root />);
