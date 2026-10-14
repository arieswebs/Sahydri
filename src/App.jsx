import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { ShopProvider, useShop } from './context/ShopContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ShopTeaser from './components/ShopTeaser';
import CulturalHeritage from './components/CulturalHeritage';
import WhySahyadri from './components/WhySahyadri';
import ArtisanCollections from './components/ArtisanCollections';
import Testimonials from './components/Testimonials';
import ConnoisseursClub from './components/ConnoisseursClub';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductQuickView from './components/ProductQuickView';
import SearchModal from './components/SearchModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import ShipwayTrackingModal from './components/ShipwayTrackingModal';
import ProductDetailPage from './components/ProductDetailPage';
import ShopPage from './components/ShopPage';
import AdminDashboard from './components/AdminDashboard';
import AdminPortalAuth from './components/AdminPortalAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AccountPage from './pages/AccountPage';
import CheckoutPage from './pages/CheckoutPage';
import { PRODUCTS } from './data/products';
import { pushOrderToShipway } from './services/shipwayService';

/* ── Product Detail Route Wrapper ─────────────────────────────────────────── */
function ProductDetailRoute({
  onAddToCart,
  onBuyNow,
  wishlist,
  onToggleWishlist,
  onSelectProduct
}) {
  const { id } = useParams();
  const { products } = useShop();
  const navigate = useNavigate();

  const matched = (products || []).find(p => p.id === id) || PRODUCTS.find(p => p.id === id);

  if (!matched) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <ProductDetailPage
      product={matched}
      onBack={() => navigate('/shop')}
      onAddToCart={onAddToCart}
      onBuyNow={onBuyNow}
      wishlist={wishlist}
      onToggleWishlist={onToggleWishlist}
      onSelectProduct={onSelectProduct}
    />
  );
}

/* ── Main App Content ──────────────────────────────────────────────────────── */
function AppContent() {
  const {
    cart, addToCart, updateQuantity, removeFromCart, clearCart,
    wishlist, toggleWishlist,
    currentUser, logout,
    toast, showToast
  } = useShop();

  const navigate = useNavigate();
  const location = useLocation();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [trackingOrderId, setTrackingOrderId] = useState(null);

  // Ensure cart drawer is closed when on dedicated /checkout page
  useEffect(() => {
    if (location.pathname === '/checkout') {
      setIsCartOpen(false);
    }
  }, [location.pathname]);

  // Handle URL hash backwards compatibility (e.g. #shop, #login, #account, #admin)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (!hash) return;

      if (hash.startsWith('#product-')) {
        const prodId = hash.replace('#product-', '');
        navigate(`/product/${prodId}`, { replace: true });
        window.location.hash = '';
      } else if (hash === '#shop') {
        navigate('/shop', { replace: true });
        window.location.hash = '';
      } else if (hash === '#login' || hash === '#signin') {
        navigate('/login', { replace: true });
        window.location.hash = '';
      } else if (hash === '#signup' || hash === '#register') {
        navigate('/register', { replace: true });
        window.location.hash = '';
      } else if (hash === '#account' || hash === '#dashboard' || hash === '#profile') {
        navigate('/account', { replace: true });
        window.location.hash = '';
      } else if (hash === '#admin') {
        navigate('/admin', { replace: true });
        window.location.hash = '';
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [navigate]);

  const handleAddToCart = (product) => {
    addToCart(product);
    showToast(`Added ${product.name} to your cart`);
  };

  const handleBuyNow = (product) => {
    handleAddToCart(product);
    setIsCartOpen(false);
    navigate('/checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = (orderData) => {
    // Notify Shipway logistics for automated dispatch & tracking
    pushOrderToShipway(orderData);
    setCompletedOrder(orderData);
    clearCart();
    setIsCartOpen(false);
  };

  const handleViewProduct = (product) => {
    navigate(`/product/${product.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAccountSection = (section) => {
    const tabMap = {
      overview: 'overview',
      orders: 'orders',
      addresses: 'addresses',
      settings: 'settings',
      wishlist: 'wishlist'
    };
    const tab = tabMap[section] || 'overview';
    navigate(`/account?tab=${tab}`);
  };

  // Determine active page identifier for navbar styling
  const getActivePageName = () => {
    if (location.pathname === '/') return 'home';
    if (location.pathname === '/shop') return 'shop';
    if (location.pathname.startsWith('/product/')) return 'product';
    if (location.pathname === '/account') return 'account';
    return '';
  };

  const isSolidNavbar = location.pathname !== '/';
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-wrapper">
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#0c261e', border: '1px solid #d4af37', color: '#f5e4c3',
          padding: '10px 22px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: '600',
          zIndex: 9999, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', gap: '8px', animation: 'fadeIn 0.3s ease'
        }}>
          <Leaf size={14} color="#dfbe84" strokeWidth={1.8} />
          <span>{toast}</span>
        </div>
      )}

      {/* Global Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
        onAddToCart={handleAddToCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          navigate('/checkout');
        }}
        onRequireLogin={(redirectDest) => {
          setIsCartOpen(false);
          navigate(`/login?redirect=${encodeURIComponent(redirectDest || '/checkout')}`);
        }}
      />

      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onViewProduct={handleViewProduct}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleViewProduct}
      />

      <OrderSuccessModal
        orderData={completedOrder}
        onClose={() => setCompletedOrder(null)}
        onOpenTracking={(orderId) => setTrackingOrderId(orderId || true)}
      />

      <ShipwayTrackingModal
        isOpen={Boolean(trackingOrderId)}
        initialOrderId={typeof trackingOrderId === 'string' ? trackingOrderId : ''}
        onClose={() => setTrackingOrderId(null)}
      />

      {/* ── Routes ── */}
      <Routes>
        {/* 1. Main Storefront Homepage */}
        <Route
          path="/"
          element={
            <>
              <Navbar
                cartCount={cartItemCount}
                wishlistCount={wishlist.length}
                onOpenCart={() => setIsCartOpen(true)}
                onOpenSearch={() => setIsSearchOpen(true)}
                onGoHome={() => navigate('/')}
                onGoShop={() => navigate('/shop')}
                solidBackground={false}
                activePage="home"
                currentUser={currentUser}
                onOpenAuth={(mode) => navigate(mode === 'register' || mode === 'signup' ? '/register' : '/login')}
                onOpenDashboard={() => currentUser?.role === 'admin' ? navigate('/admin') : navigate('/account')}
                onOpenAccountSection={handleAccountSection}
                onScrollToSection={scrollToSection}
              />
              <Hero
                onExploreClick={() => navigate('/shop')}
                onStoryClick={() => scrollToSection('story')}
                onAddToCart={handleAddToCart}
                onQuickView={(p) => handleViewProduct(p)}
              />
              <ShopTeaser
                onGoShop={() => navigate('/shop')}
                onAddToCart={handleAddToCart}
              />
              <CulturalHeritage />
              <WhySahyadri />
              <ArtisanCollections onAddToCart={handleAddToCart} onGoShop={() => navigate('/shop')} />
              <Testimonials />
              <ConnoisseursClub onJoinClick={() => navigate('/register')} />
              <Footer />
            </>
          }
        />

        {/* 2. Catalogue Shop Page */}
        <Route
          path="/shop"
          element={
            <>
              <Navbar
                cartCount={cartItemCount}
                wishlistCount={wishlist.length}
                onOpenCart={() => setIsCartOpen(true)}
                onOpenSearch={() => setIsSearchOpen(true)}
                onGoHome={() => navigate('/')}
                onGoShop={() => navigate('/shop')}
                solidBackground={true}
                activePage="shop"
                currentUser={currentUser}
                onOpenAuth={(mode) => navigate(mode === 'register' || mode === 'signup' ? '/register' : '/login')}
                onOpenDashboard={() => currentUser?.role === 'admin' ? navigate('/admin') : navigate('/account')}
                onOpenAccountSection={handleAccountSection}
                onScrollToSection={scrollToSection}
              />
              <ShopPage
                onViewProduct={handleViewProduct}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
              <Footer />
            </>
          }
        />

        {/* 3. Product Detail Page */}
        <Route
          path="/product/:id"
          element={
            <>
              <Navbar
                cartCount={cartItemCount}
                wishlistCount={wishlist.length}
                onOpenCart={() => setIsCartOpen(true)}
                onOpenSearch={() => setIsSearchOpen(true)}
                onGoHome={() => navigate('/')}
                onGoShop={() => navigate('/shop')}
                solidBackground={true}
                activePage="product"
                currentUser={currentUser}
                onOpenAuth={(mode) => navigate(mode === 'register' || mode === 'signup' ? '/register' : '/login')}
                onOpenDashboard={() => currentUser?.role === 'admin' ? navigate('/admin') : navigate('/account')}
                onOpenAccountSection={handleAccountSection}
                onScrollToSection={scrollToSection}
              />
              <ProductDetailRoute
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
                onSelectProduct={handleViewProduct}
                onBack={() => navigate('/shop')}
              />
            </>
          }
        />

        {/* 4. Dedicated Authentication Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* 5. Dedicated Customer Account Area */}
        <Route
          path="/account"
          element={
            <AccountPage
              onOpenCart={() => setIsCartOpen(true)}
              onOpenSearch={() => setIsSearchOpen(true)}
              onViewProduct={handleViewProduct}
            />
          }
        />

        {/* 6. Dedicated Full Checkout Page */}
        <Route
          path="/checkout"
          element={
            <CheckoutPage onOrderComplete={handleCheckout} />
          }
        />

        {/* 7. Dedicated Admin Dashboard & Portal Gateway */}
        <Route
          path="/admin"
          element={
            currentUser?.role === 'admin' ? (
              <AdminDashboard onClose={() => navigate('/')} />
            ) : (
              <AdminPortalAuth onLoginSuccess={() => navigate('/admin')} />
            )
          }
        />

        {/* 8. Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ShopProvider>
  );
}
