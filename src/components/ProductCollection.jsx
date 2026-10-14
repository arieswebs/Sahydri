import React, { useState } from 'react';
import { Star, Heart, Eye, ShoppingBag, Check } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function ProductCollection({ onAddToCart, onQuickView, wishlist, onToggleWishlist, onViewProduct }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [addedAnimationId, setAddedAnimationId] = useState(null);

  const categories = [
    { id: 'all', label: 'All Collection' },
    { id: 'spices', label: 'Whole Spices' },
    { id: 'powders', label: 'Stone Ground' },
    { id: 'honey', label: 'Wild Forest Honey' },
    { id: 'oils', label: 'Traditional Oils' }
  ];

  const filteredProducts = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

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
    <section id="shop" style={{ padding: '80px 0', backgroundColor: 'var(--surface-ground)' }}>
      <div className="container">
        {/* Minimalist Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '46px' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.7rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#9e8550',
              display: 'block',
              marginBottom: '10px',
              fontWeight: '500'
            }}
          >
            SINGLE ESTATE & TRIBAL FORAGED
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
              fontWeight: '400',
              color: '#0a221a',
              letterSpacing: '-0.01em',
              marginBottom: '12px'
            }}
          >
            The Collection
          </h2>
          <p
            style={{
              fontSize: '0.92rem',
              color: '#70685b',
              maxWidth: '520px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}
          >
            Hand-sorted, sun-dried, and packaged at source to lock in volatile essential oils and unadulterated forest flavours.
          </p>
        </div>

        {/* Minimalist Understated Filter Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '52px'
          }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.78rem',
                  fontWeight: isActive ? '600' : '400',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '8px 18px',
                  borderRadius: '24px',
                  border: isActive ? '1px solid #0b251d' : '1px solid rgba(14, 43, 33, 0.12)',
                  backgroundColor: isActive ? '#0b251d' : 'transparent',
                  color: isActive ? '#f5e7c8' : '#575146',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
                className="filter-pill"
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Luxury Minimalist Grid - 2 Products in a row on mobile */}
        <div className="product-collection-grid">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            const isAdded = addedAnimationId === product.id;

            return (
              <div
                key={product.id}
                onClick={() => handleCardClick(product)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  border: '1px solid rgba(11, 37, 29, 0.08)',
                  position: 'relative'
                }}
                className="luxury-card"
              >
                {/* Image Showcase */}
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '1 / 1',
                    backgroundColor: '#f3efe8',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    className="card-media"
                  />

                  {/* Subtle Origin Tag (Minimalist) */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      fontSize: '0.62rem',
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: '#4a4439',
                      backgroundColor: 'rgba(255, 255, 255, 0.88)',
                      backdropFilter: 'blur(6px)',
                      padding: '3px 8px',
                      borderRadius: '2px',
                      fontWeight: '600'
                    }}
                    className="card-weight-tag"
                  >
                    {product.weight}
                  </span>

                  {/* Wishlist Button (Sleek) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(6px)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      zIndex: 5
                    }}
                    className="card-wishlist-btn"
                    aria-label="Wishlist"
                  >
                    <Heart
                      size={15}
                      color={isWishlisted ? '#b91c1c' : '#575146'}
                      fill={isWishlisted ? '#b91c1c' : 'none'}
                    />
                  </button>

                  {/* Quick View Button on Hover */}
                  <div className="hover-action-overlay">
                    <span
                      style={{
                        backgroundColor: 'rgba(11, 37, 29, 0.92)',
                        color: '#f5e7c8',
                        fontSize: '0.72rem',
                        fontWeight: '600',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        padding: '8px 18px',
                        borderRadius: '20px',
                        backdropFilter: 'blur(8px)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Eye size={13} />
                      View Details
                    </span>
                  </div>
                </div>

                {/* Card Content (Clean & Editorial) */}
                <div
                  style={{
                    padding: '18px 20px 20px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1
                  }}
                  className="card-content"
                >
                  {/* Origin & Rating row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '6px'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.64rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#9e8550',
                        fontWeight: '600'
                      }}
                      className="card-origin"
                    >
                      {product.originBadge}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Star size={11} fill="#dfbe84" color="#dfbe84" />
                      <span style={{ fontSize: '0.7rem', color: '#7a7266', fontWeight: '500' }}>
                        {product.rating}
                      </span>
                    </div>
                  </div>

                  {/* Product Title (Clean Modern Sans) */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '1rem',
                      fontWeight: '600',
                      lineHeight: '1.35',
                      color: '#0e2b21',
                      letterSpacing: '-0.01em',
                      marginBottom: '12px',
                      minHeight: '2.5rem'
                    }}
                    className="card-title"
                  >
                    {product.name}
                  </h3>

                  {/* Bottom Row: Price & Minimal Add Action */}
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(14, 43, 33, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                      <span
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: '600',
                          color: '#0d2820',
                          letterSpacing: '-0.02em'
                        }}
                        className="card-price"
                      >
                        ₹{product.price}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span
                          style={{
                            fontSize: '0.78rem',
                            color: '#a39b8e',
                            textDecoration: 'line-through'
                          }}
                          className="card-original-price"
                        >
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Sleek Minimal Add Button */}
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      style={{
                        backgroundColor: isAdded ? '#0b251d' : 'transparent',
                        color: isAdded ? '#74db93' : '#0b251d',
                        border: isAdded ? '1px solid #0b251d' : '1px solid rgba(11, 37, 29, 0.35)',
                        borderRadius: '3px',
                        padding: '6px 12px',
                        fontSize: '0.72rem',
                        fontWeight: '600',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.25s ease'
                      }}
                      className="add-btn"
                    >
                      {isAdded ? (
                        <>
                          <Check size={12} color="#74db93" strokeWidth={2.5} />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={12} strokeWidth={1.75} />
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
      </div>

      <style>{`
        .product-collection-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px 24px;
        }

        @media (max-width: 1100px) {
          .product-collection-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px 18px;
          }
        }

        @media (max-width: 768px) {
          .product-collection-grid {
            grid-template-columns: repeat(2, 1fr) !important; /* Exactly 2 products in a row */
            gap: 14px 10px !important;
          }
          .card-content {
            padding: 10px 10px 12px 10px !important;
          }
          .card-title {
            font-size: 0.82rem !important;
            min-height: 2.2rem !important;
            margin-bottom: 8px !important;
            line-height: 1.25 !important;
          }
          .card-origin {
            font-size: 0.58rem !important;
          }
          .card-price {
            font-size: 0.95rem !important;
          }
          .card-original-price {
            font-size: 0.7rem !important;
          }
          .add-btn {
            padding: 5px 8px !important;
            font-size: 0.66rem !important;
            gap: 4px !important;
          }
          .card-weight-tag {
            top: 8px !important;
            left: 8px !important;
            font-size: 0.54rem !important;
            padding: 2px 6px !important;
          }
          .card-wishlist-btn {
            top: 8px !important;
            right: 8px !important;
            width: 26px !important;
            height: 26px !important;
          }
        }

        @media (max-width: 480px) {
          .product-collection-grid {
            grid-template-columns: repeat(2, 1fr) !important; /* Always 2 products in a row on small phones */
            gap: 12px 8px !important;
          }
          .filter-pill {
            padding: 6px 12px !important;
            font-size: 0.70rem !important;
            letter-spacing: 0.05em !important;
          }
        }
        @media (max-width: 360px) {
          .filter-pill {
            padding: 5px 9px !important;
            font-size: 0.66rem !important;
          }
        }

        .luxury-card {
          border-radius: var(--radius-md) !important;
          background: var(--surface-card) !important;
          border: 1px solid var(--surface-border-subtle) !important;
          transition: all var(--transition-normal) !important;
          box-shadow: var(--shadow-xs);
        }
        .luxury-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: rgba(201, 164, 86, 0.4) !important;
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
          background: rgba(10, 34, 26, 0.12);
          opacity: 0;
          transition: opacity var(--transition-fast);
          pointer-events: none;
        }
        .luxury-card:hover .hover-action-overlay {
          opacity: 1;
        }
        .add-btn {
          border-radius: var(--radius-sm) !important;
          transition: all var(--transition-fast) !important;
        }
        .add-btn:hover {
          background-color: var(--color-forest-900) !important;
          color: var(--color-gold-300) !important;
          border-color: var(--color-forest-900) !important;
        }
        .add-btn:active {
          transform: scale(0.96);
        }
        .filter-pill {
          transition: all var(--transition-fast) !important;
        }
        .filter-pill:hover {
          border-color: var(--color-forest-900);
          color: var(--color-forest-900);
        }
      `}</style>
    </section>
  );
}
