import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag, Search, Menu, X, Shield, LogOut, ChevronDown, LayoutDashboard,
  UserCheck, User, Package, MapPin, Settings, ChevronRight, ArrowRight,
  Sparkles, Compass, Leaf
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Navbar({
  cartCount = 0,
  onOpenCart,
  onOpenSearch,
  onGoHome,
  onGoShop,
  activePage = 'home',
  onScrollToSection,
  currentUser,
  onOpenAuth,
  onOpenDashboard,
  onOpenAccountSection
}) {
  const { logout } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const mobileDrawerRef = useRef(null);

  // Monitor scroll state for refined sticky transition
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open to prevent background scrolling
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Close menus on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleBrandClick = (e) => {
    e.preventDefault();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    onGoHome?.();
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    logout();
  };

  const handleNavigateSection = (section) => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    if (onOpenAccountSection) onOpenAccountSection(section);
    else onOpenDashboard?.();
  };

  const isAdmin = currentUser?.role === 'admin';
  const customerName = currentUser?.name || 'Customer';
  const firstName = customerName.split(' ')[0] || 'Account';
  const initials = customerName
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'S';

  return (
    <>
      <header
        className={`sahyadri-navbar ${scrolled ? 'sahyadri-navbar-scrolled' : ''}`}
        role="banner"
      >
        <div className="container nav-content-container">

          {/* ── Mobile Hamburger Menu Trigger ── */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="nav-mobile-toggle-btn"
            aria-label="Open primary navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
          >
            <Menu size={23} strokeWidth={2.2} />
          </button>

          {/* ── Brand Logo Lockup ── */}
          <a
            href="/"
            onClick={handleBrandClick}
            className="nav-brand-lockup"
            aria-label="Sahydri Organics Homepage"
          >
            <div className="nav-logo-badge">
              <img
                src="/images/sahyadri-logo.png"
                alt="Sahydri Organics"
                className="nav-logo-img"
                width="42"
                height="42"
              />
            </div>
            <div className="nav-brand-text-col">
              <span className="nav-brand-title">SAHYDRI</span>
              <span className="nav-brand-sub">ORGANICS</span>
            </div>
          </a>

          {/* ── Desktop Primary Navigation Links ── */}
          <nav className="nav-links-desktop" aria-label="Main Navigation">
            <button
              onClick={() => { onGoShop?.(); }}
              className={`nav-dest-btn ${activePage === 'shop' ? 'nav-dest-active' : ''}`}
            >
              <span>Shop All</span>
            </button>
            <button
              onClick={() => onScrollToSection?.('story')}
              className="nav-dest-btn"
            >
              <span>Story</span>
            </button>
            <button
              onClick={() => onScrollToSection?.('heritage')}
              className="nav-dest-btn"
            >
              <span>Culture</span>
            </button>
            <button
              onClick={() => onScrollToSection?.('why')}
              className="nav-dest-btn"
            >
              <span>Purity</span>
            </button>
            <button
              onClick={() => onScrollToSection?.('contact')}
              className="nav-dest-btn"
            >
              <span>Contact</span>
            </button>
          </nav>

          {/* ── Right Utility Cluster ── */}
          <div className="nav-utilities-cluster">

            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="nav-util-btn"
              title="Search products"
              aria-label="Search spices and honey"
            >
              <Search size={21} strokeWidth={2} />
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="nav-util-btn nav-bag-btn"
              title="Shopping Bag"
              aria-label={`Shopping bag containing ${cartCount} items`}
            >
              <ShoppingBag size={21} strokeWidth={2} />
              {cartCount > 0 && (
                <span className="nav-bag-count" aria-hidden="true">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Customer Authentication Control (Desktop & Mobile) */}
            {currentUser ? (
              <div ref={userMenuRef} className="nav-user-container">
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className={`nav-member-badge ${isAdmin ? 'nav-admin-badge' : ''}`}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  aria-label={`Account menu for ${customerName}`}
                >
                  <div className="nav-member-avatar" aria-hidden="true">
                    {isAdmin ? (
                      <Shield size={14} color="#0c1f14" />
                    ) : (
                      <span className="nav-member-initials">{initials}</span>
                    )}
                  </div>
                  <span className="nav-member-name desktop-only">
                    {isAdmin ? 'Admin' : firstName}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`nav-chevron-icon ${userMenuOpen ? 'nav-chevron-flipped' : ''}`}
                  />
                </button>

                {/* Polished Desktop Dropdown Menu */}
                {userMenuOpen && (
                  <div className="nav-user-dropdown" role="menu" aria-label="Customer account menu">
                    <div className="nav-user-header">
                      <div className="nav-user-name-text">{customerName}</div>
                      <div className="nav-user-email-text">{currentUser.email}</div>
                      <div className="nav-user-status-pill">
                        {isAdmin ? (
                          <>
                            <Shield size={10} />
                            <span>ADMINISTRATOR</span>
                          </>
                        ) : (
                          <>
                            <UserCheck size={10} />
                            <span>CONNOISSEUR MEMBER</span>
                          </>
                        )}
                      </div>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => { setUserMenuOpen(false); onOpenDashboard?.(); }}
                        className="nav-dropdown-item"
                        role="menuitem"
                      >
                        <Shield size={15} />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleNavigateSection('overview')}
                      className="nav-dropdown-item"
                      role="menuitem"
                    >
                      <User size={15} />
                      <span>My Account</span>
                    </button>

                    <button
                      onClick={() => handleNavigateSection('orders')}
                      className="nav-dropdown-item"
                      role="menuitem"
                    >
                      <Package size={15} />
                      <span>My Orders</span>
                    </button>

                    <button
                      onClick={() => handleNavigateSection('addresses')}
                      className="nav-dropdown-item"
                      role="menuitem"
                    >
                      <MapPin size={15} />
                      <span>Saved Addresses</span>
                    </button>

                    <button
                      onClick={() => handleNavigateSection('settings')}
                      className="nav-dropdown-item"
                      role="menuitem"
                    >
                      <Settings size={15} />
                      <span>Account Settings</span>
                    </button>

                    <div className="nav-dropdown-divider" role="separator" />

                    <button
                      onClick={handleLogout}
                      className="nav-dropdown-item nav-dropdown-logout"
                      role="menuitem"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth?.('login')}
                className="nav-login-btn"
                aria-label="Sign in to your customer account"
              >
                <span>Log In</span>
              </button>
            )}

          </div>
        </div>
      </header>

      {/* ── Premium Mobile Drawer (Slide-Over Navigation) ── */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            ref={mobileDrawerRef}
            className="mobile-nav-drawer"
            onClick={e => e.stopPropagation()}
            id="mobile-nav-drawer"
          >
            {/* Drawer Header */}
            <div className="mobile-drawer-header">
              <a
                href="/"
                onClick={handleBrandClick}
                className="mobile-drawer-brand"
              >
                <div className="nav-logo-badge" style={{ width: '34px', height: '34px' }}>
                  <img
                    src="/images/sahyadri-logo.png"
                    alt="Sahyadri Organics"
                    className="nav-logo-img"
                  />
                </div>
                <div className="nav-brand-text-col">
                  <span className="nav-brand-title" style={{ fontSize: '0.88rem' }}>SAHYDRI</span>
                  <span className="nav-brand-sub" style={{ fontSize: '0.58rem' }}>ORGANICS</span>
                </div>
              </a>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-drawer-close-btn"
                aria-label="Close navigation menu"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            {/* Quick Search Field in Mobile Drawer */}
            <div className="mobile-drawer-search-wrap">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenSearch?.(); }}
                className="mobile-drawer-search-btn"
              >
                <Search size={15} color="#8c733b" />
                <span>Search products…</span>
              </button>
            </div>

            {/* Scrollable Navigation Groups */}
            <div className="mobile-drawer-scrollable">

              {/* Group 1: Product Categories */}
              <div className="mobile-nav-group">
                <span className="mobile-group-title">SHOP</span>
                <button
                  className="mobile-nav-link-btn"
                  onClick={() => { setMobileMenuOpen(false); onGoShop?.(); }}
                >
                  <div className="mobile-link-left">
                    <Sparkles size={16} className="mobile-link-icon" />
                    <span>All Products</span>
                  </div>
                  <ChevronRight size={15} className="mobile-link-arrow" />
                </button>
                <button
                  className="mobile-nav-link-btn"
                  onClick={() => { setMobileMenuOpen(false); onGoShop?.(); }}
                >
                  <div className="mobile-link-left">
                    <Leaf size={16} className="mobile-link-icon" />
                    <span>Spices</span>
                  </div>
                  <ChevronRight size={15} className="mobile-link-arrow" />
                </button>
                <button
                  className="mobile-nav-link-btn"
                  onClick={() => { setMobileMenuOpen(false); onGoShop?.(); }}
                >
                  <div className="mobile-link-left">
                    <Sparkles size={16} className="mobile-link-icon" />
                    <span>Honey</span>
                  </div>
                  <ChevronRight size={15} className="mobile-link-arrow" />
                </button>
                <button
                  className="mobile-nav-link-btn"
                  onClick={() => { setMobileMenuOpen(false); onGoShop?.(); }}
                >
                  <div className="mobile-link-left">
                    <Leaf size={16} className="mobile-link-icon" />
                    <span>Oils</span>
                  </div>
                  <ChevronRight size={15} className="mobile-link-arrow" />
                </button>
              </div>

              {/* Group 2: Heritage & Provenance */}
              <div className="mobile-nav-group">
                <span className="mobile-group-title">ABOUT</span>
                <button
                  className="mobile-nav-link-btn"
                  onClick={() => { setMobileMenuOpen(false); onScrollToSection?.('story'); }}
                >
                  <div className="mobile-link-left">
                    <Compass size={16} className="mobile-link-icon" />
                    <span>Our Story</span>
                  </div>
                  <ChevronRight size={15} className="mobile-link-arrow" />
                </button>
                <button
                  className="mobile-nav-link-btn"
                  onClick={() => { setMobileMenuOpen(false); onScrollToSection?.('heritage'); }}
                >
                  <div className="mobile-link-left">
                    <Compass size={16} className="mobile-link-icon" />
                    <span>Heritage</span>
                  </div>
                  <ChevronRight size={15} className="mobile-link-arrow" />
                </button>
                <button
                  className="mobile-nav-link-btn"
                  onClick={() => { setMobileMenuOpen(false); onScrollToSection?.('why'); }}
                >
                  <div className="mobile-link-left">
                    <Shield size={16} className="mobile-link-icon" />
                    <span>Purity & Testing</span>
                  </div>
                  <ChevronRight size={15} className="mobile-link-arrow" />
                </button>
                <button
                  className="mobile-nav-link-btn"
                  onClick={() => { setMobileMenuOpen(false); onScrollToSection?.('contact'); }}
                >
                  <div className="mobile-link-left">
                    <MapPin size={16} className="mobile-link-icon" />
                    <span>Contact Us</span>
                  </div>
                  <ChevronRight size={15} className="mobile-link-arrow" />
                </button>
              </div>

              {/* Group 3: Account Status & Actions */}
              <div className="mobile-nav-group mobile-account-group">
                <span className="mobile-group-title">ACCOUNT</span>
                {currentUser ? (
                  <div className="mobile-logged-in-box">
                    <div className="mobile-customer-info-row">
                      <div className="nav-member-avatar" style={{ width: '32px', height: '32px' }}>
                        <span className="nav-member-initials" style={{ fontSize: '0.74rem' }}>{initials}</span>
                      </div>
                      <div className="mobile-customer-text-col">
                        <span className="mobile-customer-name">{customerName}</span>
                        <span className="mobile-customer-email">{currentUser.email}</span>
                      </div>
                    </div>

                    <div className="mobile-account-links-stack">
                      {isAdmin && (
                        <button
                          className="mobile-account-sublink"
                          onClick={() => { setMobileMenuOpen(false); onOpenDashboard?.(); }}
                        >
                          <Shield size={15} />
                          <span>Admin Dashboard</span>
                        </button>
                      )}
                      <button
                        className="mobile-account-sublink"
                        onClick={() => handleNavigateSection('overview')}
                      >
                        <User size={15} />
                        <span>My Account</span>
                      </button>
                      <button
                        className="mobile-account-sublink"
                        onClick={() => handleNavigateSection('orders')}
                      >
                        <Package size={15} />
                        <span>My Orders</span>
                      </button>
                      <button
                        className="mobile-account-sublink"
                        onClick={() => handleNavigateSection('addresses')}
                      >
                        <MapPin size={15} />
                        <span>Saved Addresses</span>
                      </button>
                      <button
                        className="mobile-account-sublink"
                        onClick={() => handleNavigateSection('settings')}
                      >
                        <Settings size={15} />
                        <span>Account Settings</span>
                      </button>
                      <button
                        className="mobile-account-sublink mobile-logout-action"
                        onClick={handleLogout}
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mobile-auth-guest-box">
                    <p className="mobile-guest-desc">
                      Sign in to track orders, manage addresses, and access member discounts.
                    </p>
                    <div className="mobile-guest-actions-row">
                      <button
                        onClick={() => { setMobileMenuOpen(false); onOpenAuth?.('login'); }}
                        className="mobile-guest-login-btn"
                      >
                        <span>Sign In</span>
                        <ArrowRight size={14} />
                      </button>
                      <button
                        onClick={() => { setMobileMenuOpen(false); onOpenAuth?.('register'); }}
                        className="mobile-guest-reg-btn"
                      >
                        Create Account
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      <style>{`
        /* ── Sticky Luxury Header ── */
        .sahyadri-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background-color: rgba(250, 248, 244, 0.94);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--surface-border-subtle);
          box-shadow: var(--shadow-xs);
          transition: padding var(--transition-normal), background-color var(--transition-normal), box-shadow var(--transition-normal);
          padding: 16px 0;
        }

        .sahyadri-navbar-scrolled {
          padding: 12px 0;
          background-color: rgba(250, 248, 244, 0.98);
          box-shadow: var(--shadow-sm);
          border-bottom-color: rgba(14, 43, 33, 0.12);
        }

        .nav-content-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        /* ── Mobile Hamburger Toggle ── */
        .nav-mobile-toggle-btn {
          display: none;
          background: none;
          border: 1px solid transparent;
          color: var(--color-forest-900);
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }

        .nav-mobile-toggle-btn:hover {
          background-color: rgba(14, 43, 33, 0.06);
        }

        /* ── Brand Lockup ── */
        .nav-brand-lockup {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .nav-logo-badge {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          overflow: hidden;
          border: 1.5px solid var(--color-gold-400);
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          transition: transform var(--transition-normal);
          flex-shrink: 0;
        }

        .nav-brand-lockup:hover .nav-logo-badge {
          transform: scale(1.05);
        }

        .nav-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .nav-brand-text-col {
          display: flex;
          flex-direction: column;
          line-height: 1;
          justify-content: center;
        }

        .nav-brand-title {
          font-family: var(--font-sans);
          font-size: 1.02rem;
          letter-spacing: 0.14em;
          font-weight: 800;
          color: var(--color-forest-900);
          text-transform: uppercase;
          line-height: 1.1;
        }

        .nav-brand-sub {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          letter-spacing: 0.24em;
          font-weight: 700;
          color: var(--color-gold-text);
          text-transform: uppercase;
          line-height: 1;
          margin-top: 1px;
        }

        /* ── Desktop Primary Links ── */
        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-dest-btn {
          font-family: var(--font-sans);
          font-size: 0.88rem;
          color: var(--color-earth-700);
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
          letter-spacing: 0.03em;
          position: relative;
          padding: 10px 0;
          transition: color var(--transition-fast);
        }

        .nav-dest-btn:hover {
          color: var(--color-forest-900);
        }

        .nav-dest-btn::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background-color: var(--color-gold-500);
          border-radius: var(--radius-full);
          transition: width var(--transition-fast);
        }

        .nav-dest-btn:hover::after,
        .nav-dest-active::after {
          width: 100%;
        }

        .nav-dest-active {
          color: var(--color-forest-900);
          font-weight: 700;
        }

        /* ── Right Utilities Cluster ── */
        .nav-utilities-cluster {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .nav-util-btn {
          background: none;
          border: 1px solid transparent;
          color: var(--color-forest-800);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
          position: relative;
        }

        .nav-util-btn:hover {
          background-color: rgba(14, 43, 33, 0.06);
          color: var(--color-forest-950);
          transform: translateY(-1px);
        }
        .nav-util-btn:active {
          transform: translateY(0) scale(0.95);
        }

        .nav-bag-count {
          position: absolute;
          top: 2px;
          right: 2px;
          background-color: var(--color-forest-900);
          color: var(--color-gold-300);
          font-size: 0.68rem;
          font-weight: 700;
          min-width: 19px;
          height: 19px;
          border-radius: 10px;
          padding: 0 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          box-shadow: 0 2px 6px rgba(10, 34, 26, 0.25);
          border: 1.5px solid var(--surface-card);
        }

        /* ── Log In Button ── */
        .nav-login-btn {
          background: var(--color-forest-900);
          border: 1px solid var(--color-forest-900);
          border-radius: var(--radius-full);
          color: var(--color-gold-300);
          font-weight: 700;
          font-size: 0.84rem;
          letter-spacing: 0.04em;
          padding: 9px 20px;
          cursor: pointer;
          font-family: inherit;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-xs);
          white-space: nowrap;
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .nav-login-btn:hover {
          background: var(--color-forest-800);
          border-color: var(--color-forest-800);
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }
        .nav-login-btn:active {
          transform: translateY(0) scale(0.98);
        }

        /* ── Member Pill Badge ── */
        .nav-user-container {
          position: relative;
        }

        .nav-member-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(14, 43, 33, 0.06);
          border: 1px solid rgba(14, 43, 33, 0.12);
          border-radius: var(--radius-full);
          padding: 5px 12px 5px 6px;
          cursor: pointer;
          transition: all var(--transition-fast);
          min-height: 40px;
        }

        .nav-member-badge:hover {
          background: rgba(14, 43, 33, 0.1);
          border-color: rgba(14, 43, 33, 0.2);
        }

        .nav-admin-badge {
          background: linear-gradient(135deg, var(--color-forest-950), var(--color-forest-800));
          border-color: rgba(223, 190, 132, 0.4);
        }

        .nav-member-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-forest-800), var(--color-forest-950));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .nav-admin-badge .nav-member-avatar {
          background: linear-gradient(135deg, var(--color-gold-400), var(--color-gold-600));
        }

        .nav-member-initials {
          font-size: 0.70rem;
          font-weight: 800;
          color: var(--color-gold-300);
        }

        .nav-member-name {
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--color-forest-900);
          letter-spacing: 0.02em;
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .nav-admin-badge .nav-member-name {
          color: var(--color-gold-300);
        }

        .nav-chevron-icon {
          color: var(--color-forest-900);
          transition: transform var(--transition-fast);
        }
        .nav-admin-badge .nav-chevron-icon {
          color: var(--color-gold-300);
        }
        .nav-chevron-flipped {
          transform: rotate(180deg);
        }

        /* ── Desktop User Dropdown Menu ── */
        .nav-user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: var(--surface-card);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          padding: 8px;
          min-width: 220px;
          box-shadow: var(--shadow-dropdown);
          animation: dropdownIn 0.18s var(--ease-spring);
          z-index: 1050;
        }

        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .nav-user-header {
          padding: 10px 12px 10px;
          border-bottom: 1px solid var(--surface-border-subtle);
          margin-bottom: 6px;
        }

        .nav-user-name-text {
          font-weight: 700;
          font-size: 0.88rem;
          color: var(--color-forest-900);
        }

        .nav-user-email-text {
          font-size: 0.72rem;
          color: var(--color-earth-500);
          margin-top: 2px;
          word-break: break-all;
        }

        .nav-user-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          background: rgba(201, 164, 86, 0.15);
          color: var(--color-gold-text);
          border-radius: var(--radius-full);
          padding: 2px 8px;
          margin-top: 6px;
        }

        .nav-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 12px;
          border-radius: var(--radius-sm);
          border: none;
          background: none;
          color: var(--color-earth-700);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          transition: background var(--transition-fast), color var(--transition-fast);
        }

        .nav-dropdown-item:hover {
          background: rgba(14, 43, 33, 0.05);
          color: #0a221a;
        }

        .nav-dropdown-divider {
          height: 1px;
          background: rgba(14, 43, 33, 0.08);
          margin: 6px 0;
        }

        .nav-dropdown-logout {
          color: #b91c1c;
        }
        .nav-dropdown-logout:hover {
          background: rgba(185, 28, 28, 0.07);
          color: #991b1b;
        }

        /* ── Mobile Navigation Drawer ── */
        .mobile-nav-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(6, 18, 14, 0.55);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 2000;
          display: flex;
          animation: navBackdropFade 0.2s ease-out;
        }

        @keyframes navBackdropFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .mobile-nav-drawer {
          width: 86%;
          max-width: 360px;
          background: #ffffff;
          height: 100%;
          height: 100dvh;
          display: flex;
          flex-direction: column;
          box-shadow: 8px 0 36px rgba(11, 37, 29, 0.2);
          animation: drawerSlideIn 0.24s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes drawerSlideIn {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }

        .mobile-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          border-bottom: 1px solid rgba(14, 43, 33, 0.08);
          background: #fdfbf7;
        }

        .mobile-drawer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .mobile-drawer-close-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid rgba(14, 43, 33, 0.1);
          background: #ffffff;
          color: #2e4339;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.18s ease;
        }

        .mobile-drawer-close-btn:hover {
          background: #f0ebe1;
          color: #0a221a;
        }

        .mobile-drawer-search-wrap {
          padding: 12px 18px;
          border-bottom: 1px solid rgba(14, 43, 33, 0.06);
          background: #faf8f5;
        }

        .mobile-drawer-search-btn {
          width: 100%;
          padding: 10px 14px;
          background: #ffffff;
          border: 1px solid #d9d4c7;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.8rem;
          color: #79827d;
          font-family: inherit;
          cursor: pointer;
          text-align: left;
        }

        .mobile-drawer-scrollable {
          flex: 1;
          overflow-y: auto;
          padding: 16px 18px 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .mobile-nav-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mobile-group-title {
          font-size: 0.66rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #8c733b;
          text-transform: uppercase;
          margin-bottom: 8px;
          padding-left: 4px;
        }

        .mobile-nav-link-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 12px;
          border-radius: 8px;
          background: none;
          border: none;
          color: #173226;
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
        }

        .mobile-nav-link-btn:hover,
        .mobile-nav-link-btn:active {
          background: rgba(14, 43, 33, 0.05);
          color: #0a221a;
        }

        .mobile-link-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mobile-link-icon {
          color: #8c733b;
        }

        .mobile-link-arrow {
          color: #929d96;
        }

        .mobile-account-group {
          margin-top: auto;
          border-top: 1px solid rgba(14, 43, 33, 0.08);
          padding-top: 18px;
        }

        .mobile-customer-info-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px 14px;
        }

        .mobile-customer-text-col {
          display: flex;
          flex-direction: column;
        }

        .mobile-customer-name {
          font-weight: 700;
          font-size: 0.9rem;
          color: #0a221a;
        }

        .mobile-customer-email {
          font-size: 0.72rem;
          color: #68726c;
        }

        .mobile-account-links-stack {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mobile-account-sublink {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          background: none;
          border: none;
          color: #243a30;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          transition: background 0.15s ease;
        }

        .mobile-account-sublink:hover {
          background: rgba(14, 43, 33, 0.05);
          color: #0a221a;
        }

        .mobile-logout-action {
          color: #b91c1c;
          margin-top: 6px;
        }

        .mobile-guest-desc {
          font-size: 0.8rem;
          color: #68726c;
          line-height: 1.5;
          margin: 0 0 12px 4px;
        }

        .mobile-guest-actions-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mobile-guest-login-btn {
          width: 100%;
          padding: 12px;
          background: #0a221a;
          color: #dfbe84;
          border: 1px solid #0a221a;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.84rem;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          font-family: inherit;
        }

        .mobile-guest-reg-btn {
          width: 100%;
          padding: 11px;
          background: #f7f5f0;
          color: #0a221a;
          border: 1px solid rgba(14, 43, 33, 0.12);
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.82rem;
          cursor: pointer;
          font-family: inherit;
          text-align: center;
        }

        /* ── Responsive Viewport Adjustments ── */
        @media (max-width: 992px) {
          .nav-links-desktop {
            display: none;
          }
          .nav-mobile-toggle-btn {
            display: flex;
          }
        }

        @media (max-width: 768px) {
          .sahyadri-navbar {
            padding: 14px 0;
          }
          .sahyadri-navbar-scrolled {
            padding: 11px 0;
          }
        }

        @media (max-width: 480px) {
          .desktop-only {
            display: none !important;
          }
          .sahyadri-navbar {
            padding: 13px 0;
          }
          .sahyadri-navbar-scrolled {
            padding: 10px 0;
          }
          .nav-content-container {
            gap: 8px;
          }
          .nav-brand-lockup {
            min-width: 0;
            flex: 1 1 auto;
            gap: 8px;
          }
          .nav-logo-badge {
            width: 38px;
            height: 38px;
            flex-shrink: 0;
          }
          .nav-brand-text-col {
            min-width: 0;
            overflow: hidden;
          }
          .nav-brand-title {
            font-size: 0.82rem;
            letter-spacing: 0.10em;
            line-height: 1.1;
            white-space: nowrap;
          }
          .nav-brand-sub {
            font-size: 0.54rem;
            letter-spacing: 0.20em;
            line-height: 1;
            white-space: nowrap;
          }
          .nav-utilities-cluster {
            gap: 6px;
            flex-shrink: 0;
          }
          .nav-mobile-toggle-btn {
            width: 42px;
            height: 42px;
            flex-shrink: 0;
            padding: 0;
          }
          .nav-util-btn {
            width: 42px;
            height: 42px;
            flex-shrink: 0;
            padding: 0;
          }
          .nav-login-btn {
            padding: 7px 15px;
            font-size: 0.80rem;
            min-height: 38px;
            border-radius: 19px;
          }
          .nav-member-badge {
            padding: 4px 8px 4px 4px;
            min-height: 38px;
            gap: 5px;
          }
          .nav-member-avatar {
            width: 28px;
            height: 28px;
          }
          .nav-member-initials {
            font-size: 0.68rem;
          }
        }

        /* ── Specific Optimizations for iPhone SE (375px) ── */
        @media (max-width: 380px) {
          .sahyadri-navbar {
            padding: 11px 0;
          }
          .nav-content-container {
            gap: 6px;
          }
          .nav-brand-title {
            font-size: 0.82rem;
            letter-spacing: 0.03em;
          }
          .nav-logo-badge {
            width: 35px;
            height: 35px;
          }
          .nav-mobile-toggle-btn {
            width: 40px;
            height: 40px;
          }
          .nav-util-btn {
            width: 40px;
            height: 40px;
          }
          .nav-login-btn {
            padding: 6px 12px;
            font-size: 0.76rem;
            min-height: 36px;
          }
        }

        /* ── iPhone SE 1st Gen & Ultra-compact (320px) ── */
        @media (max-width: 340px) {
          .sahyadri-navbar {
            padding: 8px 0;
          }
          .nav-content-container {
            gap: 4px;
          }
          .nav-brand-lockup {
            gap: 5px;
          }
          .nav-logo-badge {
            width: 30px;
            height: 30px;
          }
          .nav-brand-title {
            font-size: 0.74rem;
            letter-spacing: 0.02em;
          }
          .nav-mobile-toggle-btn {
            width: 36px;
            height: 36px;
          }
          .nav-util-btn {
            width: 36px;
            height: 36px;
          }
          .nav-utilities-cluster {
            gap: 4px;
          }
          .nav-login-btn {
            padding: 5px 10px;
            font-size: 0.72rem;
            min-height: 32px;
            border-radius: 16px;
          }
          .nav-member-badge {
            padding: 3px 6px 3px 3px;
            min-height: 32px;
            gap: 4px;
          }
        }
      `}</style>
    </>
  );
}
