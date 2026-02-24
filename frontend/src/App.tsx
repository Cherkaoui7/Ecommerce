import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminRoute from './components/layout/AdminRoute';
import { WishlistProvider } from './context/WishlistContext';
import { ComparisonProvider } from './context/ComparisonContext';
import ToastContainer from './components/ui/ToastContainer';
import GoogleAnalytics from './components/GoogleAnalytics';
import { ADMIN_ROUTE_PREFIX } from './constants/routes';

// Eager load critical pages (above-the-fold, frequently visited)
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';

// Lazy load non-critical client pages
const CartPage = lazy(() => import('./pages/CartPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const ComparisonPage = lazy(() => import('./pages/ComparisonPage'));
const PromosPage = lazy(() => import('./pages/PromosPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ShippingPage = lazy(() => import('./pages/ShippingPage'));
const ReturnsPage = lazy(() => import('./pages/ReturnsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));

// Spinner shown during lazy chunk download
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
  </div>
);

function App() {
  return (
    <WishlistProvider>
      <ComparisonProvider>
        <ToastContainer />
        <Router>
          <GoogleAnalytics />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Routes Client */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="products/:id" element={<ProductPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="account" element={<AccountPage />} />
                <Route path="promos" element={<PromosPage />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="shipping" element={<ShippingPage />} />
                <Route path="returns" element={<ReturnsPage />} />
                <Route path="privacy" element={<PrivacyPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="comparison" element={<ComparisonPage />} />
              </Route>

              {/* Routes Admin */}
              <Route path={ADMIN_ROUTE_PREFIX} element={<AdminRoute />}>
                <Route index element={<AdminLayout />} />
                <Route path="*" element={<Navigate to={ADMIN_ROUTE_PREFIX} replace />} />
              </Route>

              {ADMIN_ROUTE_PREFIX !== '/admin' && (
                <Route path="/admin/*" element={<Navigate to="/" replace />} />
              )}
            </Routes>
          </Suspense>
        </Router>
      </ComparisonProvider>
    </WishlistProvider>
  );
}

export default App;


