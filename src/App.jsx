import React, { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';
import { ShopProvider, useShop } from './context/ShopContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ShopTeaser from './components/ShopTeaser';
import CulturalHeritage from './components/CulturalHeritage';
import WhySahyadri from './components/WhySahyadri';
import CulinaryGallery from './components/CulinaryGallery';
import Testimonials from './components/Testimonials';
import ConnoisseursClub from './components/ConnoisseursClub';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductQuickView from './components/ProductQuickView';
import SearchModal from './components/SearchModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import ProductDetailPage from './components/ProductDetailPage';
import ShopPage from './components/ShopPage';
import AuthModal from './components/AuthModal';
import CustomerDashboard from './components/CustomerDashboard';
import AdminDashboard from './components/AdminDashboard';

function AppInner() {
  const {
    cart, addToCart, updateQuantity, removeFromCart, clearCart,
    wishlist, toggleWishlist,
    currentUser, logout,
    toast, showToast
  } = useShop();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync state with URL hash for deep linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product-')) {
        const productId = hash.replace('#product-', '');
        import('./data/products.js').then(m => {
          const matched = m.PRODUCTS.find((p) => p.id === productId);
          if (matched) {
            setActiveProduct(matched);
            setIsShopOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        });
        return;
      }
      if (hash === '#shop') {
        setIsShopOpen(true);
        setActiveProduct(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash === '#admin' && currentUser?.role === 'admin') {
        setIsAdminOpen(true);
        return;
      }
      setActiveProduct(null);
      setIsShopOpen(false);
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentUser]);

  const handleViewProduct = (product) => {
    setActiveProduct(product);
    setIsShopOpen(false);
    window.location.hash = `product-${product.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setActiveProduct(null);
    setIsShopOpen(false);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoShop = () => {
    setActiveProduct(null);
    setIsShopOpen(true);
    window.location.hash = 'shop';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromShop = () => {
    setIsShopOpen(false);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    showToast(`Added ${product.name} to your cart`);
  };

  const handleBuyNow = (product) => {
    handleAddToCart(product);
    setIsCartOpen(true);
  };

  const handleCheckout = (orderData) => {
    setCompletedOrder(orderData);
    clearCart();
    setIsCartOpen(false);
  };

  const scrollToSection = (id) => {
    if (activeProduct || isShopOpen) {
      setActiveProduct(null);
      setIsShopOpen(false);
      window.location.hash = '';
      setTimeout(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <div className="app-wrapper">
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#0c261e', border: '1px solid #d4af37', color: '#f5e4c3',
          padding: '10px 22px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: '600',
          zIndex: 999, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', gap: '8px', animation: 'fadeIn 0.3s ease'
        }}>
          <Leaf size={14} color="#dfbe84" strokeWidth={1.8} />
          <span>{toast}</span>
        </div>
      )}

      {/* Sticky Brand Navbar */}
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onGoHome={handleBackToHome}
        onGoShop={handleGoShop}
        solidBackground={!!(activeProduct || isShopOpen)}
        activePage={activeProduct ? 'product' : isShopOpen ? 'shop' : 'home'}
        currentUser={currentUser}
        onOpenAuth={() => openAuth('login')}
        onOpenDashboard={() => currentUser?.role === 'admin' ? setIsAdminOpen(true) : setIsDashboardOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* Conditional Rendering: Product Detail | Shop Page | Main Storefront */}
      {activeProduct ? (
        <ProductDetailPage
          product={activeProduct}
          onBack={isShopOpen ? (() => { setActiveProduct(null); setIsShopOpen(true); window.location.hash = 'shop'; }) : handleBackToHome}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
          onSelectProduct={handleViewProduct}
        />
      ) : isShopOpen ? (
        <ShopPage
          onViewProduct={handleViewProduct}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      ) : (
        <>
          <Hero
            onExploreClick={handleGoShop}
            onStoryClick={() => scrollToSection('story')}
            onAddToCart={handleAddToCart}
            onQuickView={(p) => handleViewProduct(p)}
          />
          <ShopTeaser onGoShop={handleGoShop} onAddToCart={handleAddToCart} />
          <CulturalHeritage />
          <WhySahyadri />
          <CulinaryGallery />
          <Testimonials />
          <ConnoisseursClub onJoinClick={() => openAuth('signup')} />
          <Footer />
        </>
      )}

      {/* ── Modals & Drawers ── */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
        onAddToCart={handleAddToCart}
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
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
      {isDashboardOpen && currentUser && (
        <CustomerDashboard
          onClose={() => setIsDashboardOpen(false)}
          onViewProduct={handleViewProduct}
        />
      )}
      {isAdminOpen && currentUser?.role === 'admin' && (
        <AdminDashboard onClose={() => { setIsAdminOpen(false); window.location.hash = ''; }} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <AppInner />
    </ShopProvider>
  );
}
