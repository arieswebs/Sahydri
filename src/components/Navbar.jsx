import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, Leaf, User } from 'lucide-react';

export default function Navbar({ cartCount, onOpenCart, onOpenSearch, onGoHome }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBrandClick = (e) => {
    if (onGoHome) {
      e.preventDefault();
      onGoHome();
    }
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: 'rgba(253, 251, 247, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(14, 43, 33, 0.08)',
          boxShadow: scrolled
            ? '0 6px 20px rgba(11, 37, 29, 0.06)'
            : '0 2px 10px rgba(11, 37, 29, 0.02)',
          transition: 'all 0.3s ease',
          padding: scrolled ? '11px 0' : '14px 0'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Light Theme Brand Logo */}
          <a
            href="#"
            onClick={handleBrandClick}
            className="navbar-brand-link"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer'
            }}
          >
            <div
              className="navbar-logo-wrapper"
              style={{
                width: scrolled ? '42px' : '48px',
                height: scrolled ? '42px' : '48px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #dfbe84',
                boxShadow: '0 3px 12px rgba(11, 37, 29, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                transition: 'all 0.3s ease',
                flexShrink: 0
              }}
            >
              <img
                src="/images/sahyadri-logo.png"
                alt="Sahydri Organics Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.15' }}>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.98rem',
                  letterSpacing: '0.12em',
                  fontWeight: '700',
                  color: '#0a221a',
                  textTransform: 'uppercase'
                }}
              >
                SAHYDRI <span style={{ color: '#8c733b', fontWeight: '500' }}>ORGANICS</span>
              </span>
              <span
                style={{
                  fontSize: '0.6rem',
                  letterSpacing: '0.16em',
                  color: '#706859',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  marginTop: '1px'
                }}
              >
                Kerala Western Ghats
              </span>
            </div>
          </a>

          {/* Simple Clean Navigation Links (Desktop) */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <a href="#shop" className="simple-nav-link">Shop</a>
            <a href="#spices" className="simple-nav-link">Single Estate</a>
            <a href="#honey" className="simple-nav-link">Wild Honey</a>
            <a href="#story" className="simple-nav-link">Our Story</a>
            <a href="#contact" className="simple-nav-link">Contact</a>
          </nav>

          {/* Right Action Icons in matching light theme */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Account Dashboard */}
            <a
              href="#account"
              className="nav-icon-btn"
              title="My Account"
              aria-label="Account"
              style={{ textDecoration: 'none' }}
            >
              <User size={18} strokeWidth={1.9} />
            </a>

            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="nav-icon-btn"
              title="Search spices and honey"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.9} />
            </button>

            {/* Cart Icon with badge */}
            <button
              onClick={onOpenCart}
              className="nav-icon-btn"
              style={{ position: 'relative' }}
              title="View Cart"
              aria-label="Cart"
            >
              <ShoppingBag size={18} strokeWidth={1.9} />
              {cartCount > 0 && (
                <span className="cart-badge-pill">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-nav-trigger nav-icon-btn"
              style={{ display: 'none' }}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown-menu">
          <a
            href="#shop"
            className="mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Shop the Collection
          </a>
          <a
            href="#spices"
            className="mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Single Estate Spices
          </a>
          <a
            href="#honey"
            className="mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Wild Forest Honey
          </a>
          <a
            href="#story"
            className="mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Our Story & Origin
          </a>
          <a
            href="#contact"
            className="mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </a>
        </div>
      )}

      <style>{`
        .simple-nav-link {
          font-family: var(--font-sans);
          font-size: 0.78rem;
          color: #384b42;
          text-decoration: none;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          transition: color 0.2s ease;
          position: relative;
          padding: 4px 0;
        }
        .simple-nav-link:hover {
          color: #0a221a;
        }
        .simple-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background-color: #8c733b;
          border-radius: 2px;
          transition: width 0.25s ease;
        }
        .simple-nav-link:hover::after {
          width: 100%;
        }

        .nav-icon-btn {
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
        .nav-icon-btn:hover {
          background-color: rgba(14, 43, 33, 0.05);
          color: #0a221a;
          border-color: rgba(14, 43, 33, 0.08);
        }

        .cart-badge-pill {
          position: absolute;
          top: -2px;
          right: -2px;
          background-color: #0a221a;
          color: #dfbe84;
          font-size: 0.65rem;
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
          border: 1.5px solid #faf8f4;
        }

        .mobile-dropdown-menu {
          position: fixed;
          top: 56px;
          left: 0;
          right: 0;
          background-color: #faf8f4;
          border-bottom: 1px solid rgba(14, 43, 33, 0.1);
          padding: 20px 24px;
          z-index: 95;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 12px 32px rgba(11, 37, 29, 0.08);
        }

        .mobile-link {
          font-size: 0.88rem;
          color: #1a3328;
          text-decoration: none;
          padding: 8px 0;
          border-bottom: 1px solid rgba(14, 43, 33, 0.06);
          font-weight: 600;
          transition: color 0.2s ease;
        }
        .mobile-link:hover {
          color: #8c733b;
        }

        @media (max-width: 860px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav-trigger {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
