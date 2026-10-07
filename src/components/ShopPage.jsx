import React, { useState } from 'react';
import { Star, Heart, Eye, ShoppingBag, Check, ArrowRight, Filter, ChevronDown } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function ShopPage({ onAddToCart, onQuickView, wishlist, onToggleWishlist, onViewProduct }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSort, setActiveSort] = useState('featured');
  const [addedAnimationId, setAddedAnimationId] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Spices & Honey' },
    { id: 'spices', label: 'Whole Spices' },
    { id: 'powders', label: 'Stone Ground' },
    { id: 'honey', label: 'Wild Forest Honey' },
    { id: 'oils', label: 'Traditional Oils' }
  ];

  let filteredProducts = activeCategory === 'all'
    ? [...PRODUCTS]
    : PRODUCTS.filter((p) => p.category === activeCategory);

  if (activeSort === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (activeSort === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (activeSort === 'rating') {
    filteredProducts.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
  }

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedAnimationId(product.id);
    setTimeout(() => setAddedAnimationId(null), 1500);
  };

  const handleCardClick = (product) => {
    if (onViewProduct) {
      onViewProduct(product);
    } else if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div className="shop-page-wrapper">
      <style>{`
        .shop-page-wrapper {
          padding-top: 100px;
          padding-bottom: 80px;
          background-color: #fcfaf6;
          min-height: 100vh;
        }
        .shop-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .shop-header {
          margin-bottom: 40px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(14, 43, 33, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .shop-title h1 {
          font-family: var(--font-serif);
          font-size: 2.6rem;
          color: #0a221a;
          margin: 0 0 8px;
        }
        .shop-title p {
          color: #706859;
          margin: 0;
          font-size: 1rem;
        }
        .shop-layout {
          display: flex;
          gap: 40px;
          align-items: flex-start;
        }
        .shop-sidebar {
          width: 260px;
          flex-shrink: 0;
          position: sticky;
          top: 100px;
        }
        .filter-section {
          margin-bottom: 32px;
        }
        .filter-title {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0a221a;
          margin-bottom: 16px;
        }
        .filter-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .filter-item {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          color: #505a55;
          font-size: 0.95rem;
          font-weight: 500;
          transition: color 0.2s;
        }
        .filter-item:hover {
          color: #8c733b;
        }
        .filter-item.active {
          color: #0a221a;
          font-weight: 600;
        }
        .filter-checkbox {
          width: 18px;
          height: 18px;
          border: 1px solid rgba(14,43,33,0.3);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .filter-item.active .filter-checkbox {
          background-color: #0a221a;
          border-color: #0a221a;
        }
        
        .shop-main {
          flex: 1;
          min-width: 0;
        }
        
        .shop-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          background: #fff;
          padding: 12px 20px;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(10,34,26,0.02);
          border: 1px solid rgba(14, 43, 33, 0.04);
        }
        .results-count {
          color: #505a55;
          font-size: 0.95rem;
          font-weight: 500;
        }
        .sort-dropdown {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #0a221a;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          background: transparent;
          border: none;
        }
        
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        
        .luxury-card {
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(11, 37, 29, 0.06);
          position: relative;
          box-shadow: 0 8px 24px rgba(10,34,26,0.02);
        }
        .luxury-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(11, 37, 29, 0.08);
          border-color: rgba(140, 115, 59, 0.3);
        }
        .luxury-card:hover .card-media {
          transform: scale(1.05);
        }
        .hover-action-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(250, 248, 244, 0.85);
          backdrop-filter: blur(4px);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .luxury-card:hover .hover-action-overlay {
          opacity: 1;
        }
        .mobile-filter-btn {
          display: none;
          align-items: center;
          gap: 8px;
          background: #0a221a;
          color: #dfbe84;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        @media (max-width: 960px) {
          .shop-layout {
            flex-direction: column;
          }
          .shop-sidebar {
            display: none;
          }
          .shop-sidebar.open {
            display: block;
            width: 100%;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: #fcfaf6;
            z-index: 200;
            padding: 80px 24px 24px;
            overflow-y: auto;
          }
          .mobile-filter-btn {
            display: flex;
          }
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }
        
        @media (max-width: 480px) {
           .shop-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 16px;
           }
           .shop-toolbar {
             flex-direction: column;
             align-items: flex-start;
             gap: 16px;
           }
        }
      `}</style>

      {isMobileFilterOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 190 }} onClick={() => setIsMobileFilterOpen(false)}></div>
      )}

      <div className="shop-container">
        <div className="shop-header">
          <div className="shop-title">
            <h1>The Collection</h1>
            <p>Unadulterated single-estate selections from the Western Ghats.</p>
          </div>
        </div>

        <div className="shop-layout">
          <aside className={`shop-sidebar ${isMobileFilterOpen ? 'open' : ''}`}>
            {isMobileFilterOpen && (
              <button onClick={() => setIsMobileFilterOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', fontSize: '1rem', fontWeight: 'bold' }}>Close ✕</button>
            )}
            <div className="filter-section">
              <h3 className="filter-title">Categories</h3>
              <ul className="filter-list">
                {categories.map(cat => (
                  <li key={cat.id} className={`filter-item ${activeCategory === cat.id ? 'active' : ''}`} onClick={() => { setActiveCategory(cat.id); setIsMobileFilterOpen(false); }}>
                    <div className="filter-checkbox">{activeCategory === cat.id && <Check size={12} color="#fff" />}</div>
                    {cat.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-section">
              <h3 className="filter-title">Sort By</h3>
              <ul className="filter-list">
                <li className={`filter-item ${activeSort === 'featured' ? 'active' : ''}`} onClick={() => setActiveSort('featured')}>
                  <div className="filter-checkbox">{activeSort === 'featured' && <Check size={12} color="#fff" />}</div>
                  Featured Highlights
                </li>
                <li className={`filter-item ${activeSort === 'price-low' ? 'active' : ''}`} onClick={() => setActiveSort('price-low')}>
                  <div className="filter-checkbox">{activeSort === 'price-low' && <Check size={12} color="#fff" />}</div>
                  Price: Low to High
                </li>
                <li className={`filter-item ${activeSort === 'price-high' ? 'active' : ''}`} onClick={() => setActiveSort('price-high')}>
                  <div className="filter-checkbox">{activeSort === 'price-high' && <Check size={12} color="#fff" />}</div>
                  Price: High to Low
                </li>
                <li className={`filter-item ${activeSort === 'rating' ? 'active' : ''}`} onClick={() => setActiveSort('rating')}>
                  <div className="filter-checkbox">{activeSort === 'rating' && <Check size={12} color="#fff" />}</div>
                  Highest Rated
                </li>
              </ul>
            </div>

            <div className="filter-section">
              <h3 className="filter-title">Origins</h3>
              <ul className="filter-list">
                <li className="filter-item">
                  <div className="filter-checkbox"></div>
                  Idukki Hills
                </li>
                <li className="filter-item">
                  <div className="filter-checkbox"></div>
                  Wayanad Forests
                </li>
              </ul>
            </div>
          </aside>

          <main className="shop-main">
            <div className="shop-toolbar">
              <div className="results-count">
                Showing {filteredProducts.length} results
              </div>
              <button className="mobile-filter-btn" onClick={() => setIsMobileFilterOpen(true)}>
                <Filter size={16} /> Filters
              </button>
              <select
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(14,43,33,0.1)', background: '#f5f0e6', outline: 'none', color: '#0a221a', fontWeight: '600', cursor: 'pointer' }}
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="desktop-sort"
              >
                <option value="featured">Featured Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => {
                const isWishlisted = wishlist.includes(product.id);
                const isAdded = addedAnimationId === product.id;

                return (
                  <div
                    key={product.id}
                    onClick={() => handleCardClick(product)}
                    className="luxury-card"
                  >
                    <div style={{ position: 'relative', aspectRatio: '1 / 1', backgroundColor: '#f3efe8', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }} className="card-media" />
                      <span style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '0.65rem', fontFamily: 'var(--font-sans)', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4a4439', backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '4px 10px', borderRadius: '4px', fontWeight: '700', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        {product.weight}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
                        style={{ position: 'absolute', top: '16px', right: '16px', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', zIndex: 5, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                        aria-label="Wishlist"
                      >
                        <Heart size={16} color={isWishlisted ? '#b91c1c' : '#575146'} fill={isWishlisted ? '#b91c1c' : 'none'} />
                      </button>
                      <div className="hover-action-overlay">
                        <span style={{ backgroundColor: 'rgba(11, 37, 29, 0.92)', color: '#f5e7c8', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '12px 24px', borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <Eye size={16} /> View Profile
                        </span>
                      </div>
                    </div>

                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9e8550', fontWeight: '700' }}>{product.originBadge}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={12} fill="#dfbe84" color="#dfbe84" />
                          <span style={{ fontSize: '0.75rem', color: '#7a7266', fontWeight: '600' }}>{product.rating}</span>
                        </div>
                      </div>

                      <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: '600', lineHeight: '1.4', color: '#0e2b21', marginBottom: '16px', minHeight: '3rem' }}>
                        {product.name}
                      </h3>

                      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(14, 43, 33, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0d2820' }}>₹{product.price}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span style={{ fontSize: '0.85rem', color: '#a39b8e', textDecoration: 'line-through' }}>₹{product.originalPrice}</span>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          style={{
                            backgroundColor: isAdded ? '#0b251d' : 'transparent',
                            color: isAdded ? '#74db93' : '#0b251d',
                            border: isAdded ? '2px solid #0b251d' : '2px solid rgba(11, 37, 29, 0.2)',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.25s ease'
                          }}
                        >
                          {isAdded ? (
                            <>
                              <Check size={14} color="#74db93" strokeWidth={2.5} />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={14} strokeWidth={2} />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
