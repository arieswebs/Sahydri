import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, Menu, X, Shield, LogOut, ChevronDown, LayoutDashboard, UserCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Navbar({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onGoHome,
  onGoShop,
  activePage,
  onScrollToSection,
  currentUser,
  onOpenAuth,
  onOpenDashboard
}) {
  const { logout } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleBrandClick = (e) => {
    e.preventDefault();
    onGoHome?.();
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
  };

  const isAdmin = currentUser?.role === 'admin';
  const initials = currentUser
    ? currentUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '';

  return (
    <>
      <header
        className={`sahyadri-navbar ${scrolled ? 'sahyadri-navbar-scrolled' : ''}`}
      >
        <div className="container nav-content-container">

          {/* ── Brand Logo ── */}
          <a
            href="#"
            onClick={handleBrandClick}
            className="nav-brand-lockup"
            aria-label="Sahyadri Organics Home"
          >
            <div className="nav-logo-badge">
              <img
                src="/images/sahyadri-logo.png"
                alt="Sahyadri Organics"
                className="nav-logo-img"
              />
            </div>
            <div className="nav-brand-text-col">
              <span className="nav-brand-title">
                SAHYADRI <span className="nav-brand-subtitle">ORGANICS</span>
              </span>
              <span className="nav-brand-origin">
                KERALA · WESTERN GHATS
              </span>
            </div>
          </a>

          {/* ── Simple & Direct Navigation Links ── */}
          <nav className="nav-links-desktop" aria-label="Primary Navigation">
            <button
              onClick={onGoShop}
              className={`nav-dest-btn ${activePage === 'shop' ? 'nav-dest-active' : ''}`}
            >
              Shop
            </button>
            <button
              onClick={() => onScrollToSection?.('story')}
              className="nav-dest-btn"
            >
              Story
            </button>
            <button
              onClick={() => onScrollToSection?.('heritage')}
              className="nav-dest-btn"
            >
              Culture
            </button>
            <button
              onClick={() => onScrollToSection?.('contact')}
              className="nav-dest-btn"
            >
              Contact
            </button>
          </nav>

          {/* ── Right Utility Cluster ── */}
          <div className="nav-utilities-cluster">

            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="nav-util-btn"
              title="Search"
              aria-label="Search"
            >
              <Search size={17} strokeWidth={1.8} />
            </button>

            {/* Shopping Bag / Cart */}
            <button
              onClick={onOpenCart}
              className="nav-util-btn nav-bag-btn"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={17} strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="nav-bag-count" aria-label={`${cartCount} items in cart`}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Simple User Account / Log In / Sign Up */}
            {currentUser ? (
              <div ref={userMenuRef} className="nav-user-container">
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className={`nav-member-badge ${isAdmin ? 'nav-admin-badge' : ''}`}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="nav-member-avatar">
                    {isAdmin ? (
                      <Shield size={12} color="#0c1f14" />
                    ) : (
                      <span className="nav-member-initials">{initials}</span>
                    )}
                  </div>
                  <span className="nav-member-name">
                    {isAdmin ? 'Admin' : currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown
                    size={11}
                    className={`nav-chevron-icon ${userMenuOpen ? 'nav-chevron-flipped' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="nav-user-dropdown" role="menu">
                    <div className="nav-user-header">
                      <div className="nav-user-name-text">{currentUser.name}</div>
                      <div className="nav-user-email-text">{currentUser.email}</div>
                      <div className="nav-user-status-pill">
                        {isAdmin ? (
                          <>
                            <Shield size={10} />
                            <span>ADMIN</span>
                          </>
                        ) : (
                          <>
                            <UserCheck size={10} />
                            <span>MEMBER</span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => { setUserMenuOpen(false); onOpenDashboard?.(); }}
                      className="nav-dropdown-item"
                      role="menuitem"
                    >
                      <LayoutDashboard size={14} />
                      <span>{isAdmin ? 'Admin Dashboard' : 'My Account'}</span>
                    </button>

                    <div className="nav-dropdown-divider" />

                    <button
                      onClick={handleLogout}
                      className="nav-dropdown-item nav-dropdown-logout"
                      role="menuitem"
                    >
                      <LogOut size={14} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth?.('login')}
                className="nav-signup-btn"
                aria-label="Log In"
              >
                Log In
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="nav-util-btn nav-mobile-toggle"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Navigation Drawer ── */}
      {mobileMenuOpen && (
        <div className="mobile-nav-curtain" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-nav-sheet" onClick={e => e.stopPropagation()}>
            <div className="mobile-nav-top">
              <span className="mobile-nav-kicker">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-close"
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mobile-nav-links-stack">
              <button
                className={`mobile-nav-btn ${activePage === 'shop' ? 'mobile-nav-btn-active' : ''}`}
                onClick={() => { setMobileMenuOpen(false); onGoShop?.(); }}
              >
                Shop
              </button>
              <button
                className="mobile-nav-btn"
                onClick={() => { setMobileMenuOpen(false); onScrollToSection?.('story'); }}
              >
                Story
              </button>
              <button
                className="mobile-nav-btn"
                onClick={() => { setMobileMenuOpen(false); onScrollToSection?.('heritage'); }}
              >
                Culture
              </button>
              <button
                className="mobile-nav-btn"
                onClick={() => { setMobileMenuOpen(false); onScrollToSection?.('contact'); }}
              >
                Contact
              </button>
            </div>

            <div className="mobile-nav-footer-area">
              {currentUser ? (
                <>
                  <div className="mobile-member-card">
                    <span className="mobile-member-name">{currentUser.name}</span>
                    <span className="mobile-member-role">{isAdmin ? 'Admin' : 'Member'}</span>
                  </div>
                  <button
                    className="mobile-nav-btn"
                    onClick={() => { setMobileMenuOpen(false); onOpenDashboard?.(); }}
                  >
                    {isAdmin ? 'Admin Dashboard' : 'My Account'}
                  </button>
                  <button
                    className="mobile-nav-btn mobile-logout-btn"
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <button
                  className="mobile-signup-btn"
                  style={{ width: '100%', padding: '12px', fontSize: '0.85rem' }}
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth?.('login'); }}
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* ── Sticky Luxury Navbar ── */
        .sahyadri-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background-color: rgba(253, 251, 247, 0.94);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(14, 43, 33, 0.08);
          box-shadow: 0 2px 12px rgba(11, 37, 29, 0.03);
          transition: padding 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, background-color 0.3s ease;
          padding: 13px 0;
        }

        .sahyadri-navbar-scrolled {
          padding: 9px 0;
          background-color: rgba(253, 251, 247, 0.97);
          box-shadow: 0 6px 24px rgba(11, 37, 29, 0.06);
          border-bottom-color: rgba(14, 43, 33, 0.1);
        }

        .nav-content-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* ── Brand Lockup ── */
        .nav-brand-lockup {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .nav-logo-badge {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          border: 1.5px solid #dfbe84;
          box-shadow: 0 2px 10px rgba(11, 37, 29, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          transition: transform 0.25s ease;
          flex-shrink: 0;
        }

        .nav-brand-lockup:hover .nav-logo-badge {
          transform: scale(1.04);
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
          line-height: 1.15;
        }

        .nav-brand-title {
          font-family: var(--font-sans);
          font-size: 0.94rem;
          letter-spacing: 0.1em;
          font-weight: 700;
          color: #0a221a;
          text-transform: uppercase;
        }

        .nav-brand-subtitle {
          color: #8c733b;
          font-weight: 500;
        }

        .nav-brand-origin {
          font-size: 0.58rem;
          letter-spacing: 0.15em;
          color: #706859;
          font-weight: 600;
          text-transform: uppercase;
          margin-top: 1px;
        }

        /* ── Simple Desktop Links ── */
        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-dest-btn {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          color: #2e4339;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
          letter-spacing: 0.04em;
          position: relative;
          padding: 6px 0;
          transition: color 0.2s ease;
        }

        .nav-dest-btn:hover {
          color: #0a221a;
        }

        .nav-dest-btn::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background-color: #8c733b;
          border-radius: 2px;
          transition: width 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-dest-btn:hover::after,
        .nav-dest-active::after {
          width: 100%;
        }

        .nav-dest-active {
          color: #0a221a;
        }

        /* ── Right Utilities ── */
        .nav-utilities-cluster {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-util-btn {
          background: none;
          border: 1px solid transparent;
          color: #1b3d31;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .nav-util-btn:hover {
          background-color: rgba(14, 43, 33, 0.05);
          color: #0a221a;
          border-color: rgba(14, 43, 33, 0.08);
        }

        .nav-bag-btn {
          position: relative;
        }

        .nav-bag-count {
          position: absolute;
          top: -2px;
          right: -2px;
          background-color: #0a221a;
          color: #dfbe84;
          font-size: 0.62rem;
          font-weight: 700;
          min-width: 17px;
          height: 17px;
          border-radius: 10px;
          padding: 0 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          box-shadow: 0 2px 6px rgba(10, 34, 26, 0.25);
          border: 1.5px solid #fdfbf7;
        }

        /* ── Simple Log In & Sign Up Buttons ── */
        .nav-auth-buttons-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-login-btn {
          background: transparent;
          border: none;
          color: #0a221a;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          padding: 6px 12px;
          cursor: pointer;
          font-family: inherit;
          border-radius: 6px;
          transition: all 0.18s ease;
        }
        .nav-login-btn:hover {
          background: rgba(14, 43, 33, 0.06);
          color: #8c733b;
        }

        .nav-signup-btn {
          background: #0a221a;
          border: 1px solid #0a221a;
          border-radius: 20px;
          color: #dfbe84;
          font-weight: 700;
          font-size: 0.76rem;
          letter-spacing: 0.04em;
          padding: 6px 16px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(10, 34, 26, 0.12);
        }

        .nav-signup-btn:hover {
          background: #173f2f;
          border-color: #173f2f;
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(10, 34, 26, 0.18);
        }

        /* ── User Logged In Pill ── */
        .nav-user-container {
          position: relative;
        }

        .nav-member-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(14, 43, 33, 0.06);
          border: 1px solid rgba(14, 43, 33, 0.12);
          border-radius: 24px;
          padding: 4px 10px 4px 5px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-admin-badge {
          background: linear-gradient(135deg, #0a221a, #1b4030);
          border-color: rgba(223, 190, 132, 0.4);
        }

        .nav-member-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1b4030, #0a221a);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .nav-admin-badge .nav-member-avatar {
          background: linear-gradient(135deg, #dfbe84, #9a7d25);
        }

        .nav-member-initials {
          font-size: 0.62rem;
          font-weight: 800;
          color: #dfbe84;
        }

        .nav-member-name {
          font-size: 0.74rem;
          font-weight: 700;
          color: #0a221a;
          letter-spacing: 0.02em;
          max-width: 80px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .nav-admin-badge .nav-member-name {
          color: #dfbe84;
        }

        .nav-chevron-icon {
          color: #0a221a;
          transition: transform 0.2s ease;
        }
        .nav-admin-badge .nav-chevron-icon {
          color: #dfbe84;
        }
        .nav-chevron-flipped {
          transform: rotate(180deg);
        }

        .nav-user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #ffffff;
          border: 1px solid rgba(14, 43, 33, 0.12);
          border-radius: 12px;
          padding: 8px;
          min-width: 200px;
          box-shadow: 0 16px 40px rgba(11, 37, 29, 0.12);
          animation: dropdownIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1050;
        }

        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .nav-user-header {
          padding: 8px 10px 10px;
          border-bottom: 1px solid rgba(14, 43, 33, 0.07);
          margin-bottom: 6px;
        }

        .nav-user-name-text {
          font-size: 0.82rem;
          font-weight: 700;
          color: #0a221a;
        }

        .nav-user-email-text {
          font-size: 0.7rem;
          color: #706859;
          margin-top: 2px;
        }

        .nav-user-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 6px;
          background: rgba(223, 190, 132, 0.18);
          border: 1px solid rgba(223, 190, 132, 0.4);
          border-radius: 14px;
          padding: 2px 8px;
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #8c733b;
        }

        .nav-dropdown-item {
          display: flex;
          align-items: center;
          gap: 9px;
          width: 100%;
          padding: 8px 10px;
          background: none;
          border: none;
          border-radius: 6px;
          color: #1a3328;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          transition: background 0.15s ease;
        }

        .nav-dropdown-item:hover {
          background: rgba(14, 43, 33, 0.05);
        }

        .nav-dropdown-divider {
          height: 1px;
          background: rgba(14, 43, 33, 0.07);
          margin: 4px 0;
        }

        .nav-dropdown-logout {
          color: #b91c1c;
        }
        .nav-dropdown-logout:hover {
          background: rgba(185, 28, 28, 0.06);
        }

        /* ── Mobile Drawer ── */
        .nav-mobile-toggle {
          display: none;
        }

        .mobile-nav-curtain {
          position: fixed;
          inset: 0;
          background: rgba(6, 18, 14, 0.5);
          backdrop-filter: blur(4px);
          z-index: 990;
        }

        .mobile-nav-sheet {
          position: fixed;
          top: 60px;
          left: 0;
          right: 0;
          background-color: #ffffff;
          border-bottom: 1px solid rgba(14, 43, 33, 0.12);
          padding: 22px 24px;
          box-shadow: 0 16px 36px rgba(11, 37, 29, 0.12);
          display: flex;
          flex-direction: column;
          gap: 14px;
          animation: sheetSlideDown 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes sheetSlideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .mobile-nav-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(14, 43, 33, 0.08);
        }

        .mobile-nav-kicker {
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #8c733b;
          font-weight: 700;
        }

        .mobile-nav-close {
          background: none;
          border: none;
          color: #384b42;
          cursor: pointer;
        }

        .mobile-nav-links-stack {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mobile-nav-btn {
          font-size: 0.92rem;
          color: #1a3328;
          background: none;
          border: none;
          border-bottom: 1px solid rgba(14, 43, 33, 0.05);
          padding: 10px 0;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: color 0.15s ease;
        }

        .mobile-nav-btn:hover,
        .mobile-nav-btn-active {
          color: #8c733b;
        }

        .mobile-nav-footer-area {
          margin-top: 6px;
          padding-top: 12px;
          border-top: 1px solid rgba(14, 43, 33, 0.08);
        }

        .mobile-member-card {
          margin-bottom: 8px;
        }
        .mobile-member-name {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: #0a221a;
        }
        .mobile-member-role {
          display: block;
          font-size: 0.68rem;
          color: #8c733b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .mobile-logout-btn {
          color: #b91c1c;
        }

        .mobile-auth-btn-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .mobile-login-btn {
          padding: 11px;
          background: #f7f5f0;
          color: #0a221a;
          border: 1px solid rgba(14, 43, 33, 0.12);
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          font-family: inherit;
        }

        .mobile-signup-btn {
          padding: 11px;
          background: #0a221a;
          color: #dfbe84;
          border: 1px solid #0a221a;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          font-family: inherit;
        }

        /* ── Media Queries ── */
        @media (max-width: 880px) {
          .nav-links-desktop {
            display: none;
          }
          .nav-auth-buttons-group {
            display: none;
          }
          .nav-mobile-toggle {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}
