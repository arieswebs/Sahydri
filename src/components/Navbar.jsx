import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, Menu, X, User, Shield, LogOut, Settings, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Navbar({ cartCount, onOpenCart, onOpenSearch, onGoHome, onGoShop, activePage, onScrollToSection, currentUser, onOpenAuth, onOpenDashboard }) {
  const { logout } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 25);
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
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          backgroundColor: 'rgba(253, 251, 247, 0.94)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(14, 43, 33, 0.08)',
          boxShadow: scrolled ? '0 6px 20px rgba(11, 37, 29, 0.06)' : '0 2px 10px rgba(11, 37, 29, 0.02)',
          transition: 'all 0.3s ease',
          padding: scrolled ? '11px 0' : '14px 0'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Brand Logo */}
          <a href="#" onClick={handleBrandClick} className="navbar-brand-link"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div className="navbar-logo-wrapper" style={{
              width: scrolled ? '42px' : '48px', height: scrolled ? '42px' : '48px',
              borderRadius: '50%', overflow: 'hidden', border: '2px solid #dfbe84',
              boxShadow: '0 3px 12px rgba(11, 37, 29, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: '#ffffff', transition: 'all 0.3s ease', flexShrink: 0
            }}>
              <img src="/images/sahyadri-logo.png" alt="Sahydri Organics Logo"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.15' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.98rem', letterSpacing: '0.12em', fontWeight: '700', color: '#0a221a', textTransform: 'uppercase' }}>
                SAHYDRI <span style={{ color: '#8c733b', fontWeight: '500' }}>ORGANICS</span>
              </span>
              <span style={{ fontSize: '0.6rem', letterSpacing: '0.16em', color: '#706859', fontWeight: '600', textTransform: 'uppercase', marginTop: '1px' }}>
                Kerala Western Ghats
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <button onClick={onGoShop} className={`simple-nav-link${activePage === 'shop' ? ' nav-link-active' : ''}`}>Shop</button>
            <button onClick={() => onScrollToSection?.('spices')} className="simple-nav-link">Single Estate</button>
            <button onClick={() => onScrollToSection?.('honey')} className="simple-nav-link">Wild Honey</button>
            <button onClick={() => onScrollToSection?.('story')} className="simple-nav-link">Our Story</button>
            <button onClick={() => onScrollToSection?.('contact')} className="simple-nav-link">Contact</button>
          </nav>

          {/* Right Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={onOpenSearch} className="nav-icon-btn" title="Search" aria-label="Search">
              <Search size={18} strokeWidth={1.9} />
            </button>

            <button onClick={onOpenCart} className="nav-icon-btn" style={{ position: 'relative' }} title="View Cart" aria-label="Cart">
              <ShoppingBag size={18} strokeWidth={1.9} />
              {cartCount > 0 && <span className="cart-badge-pill">{cartCount}</span>}
            </button>

            {/* ── Auth / User Area ── */}
            {currentUser ? (
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                {/* Avatar pill button */}
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    background: isAdmin
                      ? 'linear-gradient(135deg, #0a221a, #1b4030)'
                      : 'rgba(14,43,33,0.07)',
                    border: `1px solid ${isAdmin ? 'rgba(212,175,55,0.4)' : 'rgba(14,43,33,0.12)'}`,
                    borderRadius: '24px', padding: '5px 11px 5px 6px',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                  }}
                >
                  {/* Avatar circle */}
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '50%',
                    background: isAdmin ? 'linear-gradient(135deg,#d4af37,#9a7d25)' : 'linear-gradient(135deg,#1b4030,#0a221a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {isAdmin
                      ? <Shield size={13} color="#0c1f14" />
                      : <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#dfbe84' }}>{initials}</span>
                    }
                  </div>
                  <span style={{
                    fontSize: '0.74rem', fontWeight: 700,
                    color: isAdmin ? '#d4af37' : '#0a221a',
                    letterSpacing: '0.02em', maxWidth: '80px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {isAdmin ? 'Admin' : currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown
                    size={12}
                    color={isAdmin ? '#d4af37' : '#0a221a'}
                    style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
                  />
                </button>

                {/* Dropdown menu */}
                {userMenuOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    background: '#fff', border: '1px solid rgba(14,43,33,0.1)',
                    borderRadius: '14px', padding: '8px', minWidth: '200px',
                    boxShadow: '0 16px 40px rgba(11,37,29,0.14)',
                    animation: 'dropdownIn 0.18s ease', zIndex: 200,
                  }}>
                    {/* User info header */}
                    <div style={{ padding: '10px 12px 10px', borderBottom: '1px solid rgba(14,43,33,0.07)', marginBottom: '6px' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0a221a' }}>{currentUser.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#9e8550', marginTop: '2px' }}>
                        {currentUser.email}
                      </div>
                      {isAdmin && (
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px',
                          background: 'linear-gradient(135deg,#d4af37,#b8972f)', borderRadius: '20px',
                          padding: '2px 10px',
                        }}>
                          <Shield size={10} color="#0c1f14" />
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#0c1f14', letterSpacing: '0.1em' }}>ADMIN</span>
                        </div>
                      )}
                    </div>

                    {/* Dashboard link */}
                    <button
                      onClick={() => { setUserMenuOpen(false); onOpenDashboard?.(); }}
                      className="user-menu-item"
                    >
                      <LayoutDashboard size={14} />
                      <span>{isAdmin ? 'Admin Dashboard' : 'My Account'}</span>
                    </button>

                    {/* Settings (customer only) */}
                    {!isAdmin && (
                      <button
                        onClick={() => { setUserMenuOpen(false); onOpenDashboard?.(); }}
                        className="user-menu-item"
                      >
                        <Settings size={14} />
                        <span>Account Settings</span>
                      </button>
                    )}

                    {/* Logout */}
                    <div style={{ borderTop: '1px solid rgba(14,43,33,0.07)', marginTop: '6px', paddingTop: '6px' }}>
                      <button onClick={handleLogout} className="user-menu-item user-menu-logout">
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                style={{
                  background: 'linear-gradient(135deg, #0a221a, #163a2a)',
                  border: 'none', borderRadius: '20px', color: '#dfbe84',
                  fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em',
                  padding: '7px 16px', cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg,#163a2a,#1f5040)'}
                onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg,#0a221a,#163a2a)'}
              >
                Sign In
              </button>
            )}

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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown-menu">
          <button className={`mobile-link${activePage === 'shop' ? ' mobile-link-active' : ''}`} onClick={() => { setMobileMenuOpen(false); onGoShop?.(); }}>
            Shop the Collection
          </button>
          <button className="mobile-link" onClick={() => { setMobileMenuOpen(false); onScrollToSection?.('spices'); }}>Single Estate Spices</button>
          <button className="mobile-link" onClick={() => { setMobileMenuOpen(false); onScrollToSection?.('honey'); }}>Wild Forest Honey</button>
          <button className="mobile-link" onClick={() => { setMobileMenuOpen(false); onScrollToSection?.('story'); }}>Our Story & Origin</button>
          <button className="mobile-link" onClick={() => { setMobileMenuOpen(false); onScrollToSection?.('contact'); }}>Contact</button>

          <div style={{ borderTop: '1px solid rgba(14,43,33,0.08)', marginTop: '4px', paddingTop: '12px' }}>
            {currentUser ? (
              <>
                <div style={{ fontSize: '0.78rem', color: '#706859', marginBottom: '8px', fontWeight: 600 }}>
                  {isAdmin ? '🛡️ ' : '👤 '}{currentUser.name}
                </div>
                <button className="mobile-link" onClick={() => { setMobileMenuOpen(false); onOpenDashboard?.(); }}>
                  {isAdmin ? 'Admin Dashboard' : 'My Account'}
                </button>
                <button className="mobile-link" onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  style={{ color: '#b91c1c' }}>
                  Sign Out
                </button>
              </>
            ) : (
              <button className="mobile-link" onClick={() => { setMobileMenuOpen(false); onOpenAuth?.(); }}
                style={{ color: '#8c733b', fontWeight: 700 }}>
                Sign In / Create Account
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .simple-nav-link {
          font-family: var(--font-sans); font-size: 0.78rem; color: #384b42;
          background: none; border: none; cursor: pointer; font-weight: 600;
          letter-spacing: 0.07em; text-transform: uppercase; transition: color 0.2s ease;
          position: relative; padding: 4px 0;
        }
        .simple-nav-link:hover { color: #0a221a; }
        .simple-nav-link::after {
          content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 0; height: 2px; background-color: #8c733b; border-radius: 2px; transition: width 0.25s ease;
        }
        .simple-nav-link:hover::after, .nav-link-active::after { width: 100%; }
        .nav-link-active { color: #0a221a; }

        .nav-icon-btn {
          background: none; border: 1px solid transparent; color: #1b3d31;
          width: 36px; height: 36px; border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;
        }
        .nav-icon-btn:hover { background-color: rgba(14,43,33,0.05); color: #0a221a; border-color: rgba(14,43,33,0.08); }

        .cart-badge-pill {
          position: absolute; top: -2px; right: -2px;
          background-color: #0a221a; color: #dfbe84;
          font-size: 0.65rem; font-weight: 700; min-width: 17px; height: 17px;
          border-radius: 10px; padding: 0 4px; display: flex; align-items: center; justify-content: center;
          line-height: 1; box-shadow: 0 2px 6px rgba(10,34,26,0.25); border: 1.5px solid #faf8f4;
        }

        .user-menu-item {
          display: flex; align-items: center; gap: '9px'; gap: 9px; width: 100%;
          padding: 9px 12px; background: none; border: none; border-radius: 8px;
          color: #1a3328; font-size: 0.82rem; font-weight: 600; cursor: pointer;
          font-family: inherit; text-align: left; transition: background 0.15s ease;
        }
        .user-menu-item:hover { background: rgba(14,43,33,0.05); }
        .user-menu-logout { color: #b91c1c; }
        .user-menu-logout:hover { background: rgba(185,28,28,0.06); }

        .mobile-dropdown-menu {
          position: fixed; top: 56px; left: 0; right: 0; background-color: #faf8f4;
          border-bottom: 1px solid rgba(14,43,33,0.1); padding: 20px 24px; z-index: 95;
          display: flex; flex-direction: column; gap: 12px; box-shadow: 0 12px 32px rgba(11,37,29,0.08);
        }
        .mobile-link {
          font-size: 0.88rem; color: #1a3328; background: none; border: none;
          border-bottom: 1px solid rgba(14,43,33,0.06); padding: 8px 0; font-weight: 600;
          font-family: inherit; cursor: pointer; text-align: left; width: 100%; transition: color 0.2s ease;
        }
        .mobile-link:hover { color: #8c733b; }
        .mobile-link-active { color: #8c733b; }

        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-trigger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
