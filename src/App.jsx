import React, { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCollection from './components/ProductCollection';
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
import AccountPage from './components/AccountPage';
import ShopPage from './components/ShopPage';
import { PRODUCTS } from './data/products';

export default function App() {
  const [cart, setCart] = useState([
    {
      id: "cardamom-elaichi-8mm",
      name: "Green Cardamom (Elaichi) 8mm+",
      subname: "Premium Bold Grade Pods",
      category: "spices",
      price: 474,
      weight: "100g",
      quantity: 1,
      image: "/images/products/cardamom_sahydri.jpg"
    }
  ]);
  const [wishlist, setWishlist] = useState(["pepper-whole-black"]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [activeProduct, setActiveProduct] = useState(null);
  const [showAccount, setShowAccount] = useState(false);
  const [showShop, setShowShop] = useState(false);

  // Sync state with URL hash for deep linking and native back/forward button support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      if (hash === '#account') {
        setActiveProduct(null);
        setShowShop(false);
        setShowAccount(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      } else if (hash === '#shop' || hash === '#spices') {
        setActiveProduct(null);
        setShowAccount(false);
        setShowShop(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      } else {
        setShowAccount(false);
        setShowShop(false);
      }

      if (hash.startsWith('#product-')) {
        const productId = hash.replace('#product-', '');
        const matched = PRODUCTS.find((p) => p.id === productId);
        if (matched) {
          setActiveProduct(matched);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      if (hash === '' || hash === '#' || hash === '#story' || hash === '#contact') {
        setActiveProduct(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleViewProduct = (product) => {
    setActiveProduct(product);
    window.location.hash = `product-${product.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setActiveProduct(null);
    setShowAccount(false);
    setShowShop(false);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.weight === (product.weight || item.weight));
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.weight === (product.weight || item.weight)
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          subname: product.subname,
          category: product.category,
          price: product.price,
          weight: product.weight || '100g',
          quantity: product.quantity || 1,
          image: product.image
        }
      ];
    });
    showToast(`Added ${product.name} to your cart`);
  };

  const handleBuyNow = (product) => {
    handleAddToCart(product);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
      showToast('Removed from wishlist');
    } else {
      setWishlist([...wishlist, productId]);
      showToast('Saved to your wishlist');
    }
  };

  const handleCheckout = (orderData) => {
    setCompletedOrder(orderData);
    setCart([]);
    setIsCartOpen(false);
  };

  const scrollToSection = (id) => {
    if (activeProduct || showAccount || showShop) {
      setActiveProduct(null);
      setShowAccount(false);
      setShowShop(false);
      window.location.hash = '';
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#0c261e',
            border: '1px solid #d4af37',
            color: '#f5e4c3',
            padding: '10px 22px',
            borderRadius: '30px',
            fontSize: '0.85rem',
            fontWeight: '600',
            zIndex: 150,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <Leaf size={14} color="#dfbe84" strokeWidth={1.8} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Brand Navbar */}
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onGoHome={handleBackToHome}
        solidBackground={!!activeProduct || showAccount || showShop}
      />

      {/* Conditional Rendering: Individual Product Page or Main Storefront */}
      {showAccount ? (
        <AccountPage onGoHome={handleBackToHome} />
      ) : showShop ? (
        <ShopPage
          onAddToCart={handleAddToCart}
          onQuickView={(p) => setQuickViewProduct(p)}
          onViewProduct={handleViewProduct}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
        />
      ) : activeProduct ? (
        <ProductDetailPage
          product={activeProduct}
          onBack={handleBackToHome}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onSelectProduct={handleViewProduct}
        />
      ) : (
        <>
          {/* Hero Section */}
          <Hero
            onExploreClick={() => scrollToSection('shop')}
            onStoryClick={() => scrollToSection('story')}
            onAddToCart={handleAddToCart}
            onQuickView={(p) => handleViewProduct(p)}
          />

          {/* Product Collection Grid */}
          <div id="spices">
            <ProductCollection
              onAddToCart={handleAddToCart}
              onQuickView={(p) => setQuickViewProduct(p)}
              onViewProduct={handleViewProduct}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
            />
          </div>

          {/* Cultural Heritage: Kathakali Divine Storytelling */}
          <CulturalHeritage />

          {/* Why Sahyadri Organics (4 Pillars) */}
          <WhySahyadri />

          {/* Culinary Gallery (Savour the Tradition) */}
          <CulinaryGallery />

          {/* Testimonials */}
          <Testimonials />

          {/* Connoisseurs Club Invitation */}
          <ConnoisseursClub />

          {/* Comprehensive Brand Footer */}
          <Footer />
        </>
      )}

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
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
    </div>
  );
}
