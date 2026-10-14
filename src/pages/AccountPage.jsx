import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import CustomerDashboard from '../components/CustomerDashboard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AccountPage({ onOpenCart, onOpenSearch, onViewProduct }) {
  const { currentUser, cart, wishlist } = useShop();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Route protection: if guest, redirect to /login?redirect=/account
  useEffect(() => {
    if (!currentUser) {
      const redirectPath = encodeURIComponent(window.location.pathname + window.location.search);
      navigate(`/login?redirect=${redirectPath}`, { replace: true });
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null; // Prevents flashing private info while redirecting
  }

  // Map search query ?tab= to section
  const tabParam = searchParams.get('tab') || 'overview';
  const tabMap = {
    overview: 'Overview',
    orders: 'Orders',
    addresses: 'Addresses',
    settings: 'Profile',
    profile: 'Profile',
    wishlist: 'Wishlist'
  };
  const activeSection = tabMap[tabParam.toLowerCase()] || 'Overview';

  const handleTabChange = (section) => {
    const reverseMap = {
      Overview: 'overview',
      Orders: 'orders',
      Addresses: 'addresses',
      Profile: 'settings',
      Wishlist: 'wishlist'
    };
    setSearchParams({ tab: reverseMap[section] || 'overview' });
  };

  return (
    <div className="account-page-root">
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={onOpenCart}
        onOpenSearch={onOpenSearch}
        onGoHome={() => navigate('/')}
        onGoShop={() => navigate('/shop')}
        solidBackground={true}
        activePage="account"
        currentUser={currentUser}
        onOpenAuth={() => navigate('/login')}
        onOpenDashboard={() => navigate('/account')}
      />

      <main className="account-page-main">
        <div className="account-page-wrapper-inner">
          <CustomerDashboard
            isPageMode={true}
            initialSection={activeSection}
            onTabChange={handleTabChange}
            onClose={() => navigate('/shop')}
            onGoShop={() => navigate('/shop')}
            onViewProduct={onViewProduct}
          />
        </div>
      </main>

      <Footer />

      <style>{`
        .account-page-root {
          min-height: 100vh;
          min-height: 100dvh;
          background: var(--surface-ground);
          display: flex;
          flex-direction: column;
        }

        .account-page-main {
          flex: 1;
          padding-top: 100px;
          padding-bottom: 60px;
        }

        .account-page-wrapper-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 20px;
        }
      `}</style>
    </div>
  );
}
