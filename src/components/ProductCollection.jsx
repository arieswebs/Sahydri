import React, { useState } from 'react';
import { Star, Heart, Eye, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function ProductCollection({ onAddToCart, onQuickView, wishlist, onToggleWishlist, onViewProduct }) {
  const [addedAnimationId, setAddedAnimationId] = useState(null);

  // Take only the first 4 products for the landing page brief
  const featuredProducts = PRODUCTS.slice(0, 4);

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

  const handleExploreShop = () => {
    window.location.hash = '#shop';
  };

  return (
    <section id="spices" style={{ padding: '120px 0', backgroundColor: '#faf8f4' }}>
      <div className="container" style={{ maxWidth: '1400px' }}>
        {/* Minimalist Section Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '64px' }}>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#9e8550',
              display: 'block',
              marginBottom: '16px',
              fontWeight: '700'
            }}
          >
            DISCOVER TRADITION
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
              fontWeight: '400',
              color: '#0a221a',
              letterSpacing: '-0.01em',
              marginBottom: '20px'
            }}
          >
            Curated Highlights
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: '#70685b',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}
          >
            Hand-sorted and sun-dried at source. A glimpse into our unadulterated forest flavours.
          </p>
        </div>

        {/* Luxury Minimalist Grid */}
        <div className="product-collection-grid">
          {featuredProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            const isAdded = addedAnimationId === product.id;

            return (
              <div
                key={product.id}
                onClick={() => handleCardClick(product)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  border: '1px solid rgba(14, 43, 33, 0.04)',
                  position: 'relative',
                  boxShadow: '0 12px 36px rgba(10,34,26,0.02)'
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
                      transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    className="card-media"
                  />

                  {/* Subtle Origin Tag */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      fontSize: '0.65rem',
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: '#4a4439',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontWeight: '700',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                  >
                    {product.weight}
                  </span>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      zIndex: 5,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                    aria-label="Wishlist"
                  >
                    <Heart size={16} color={isWishlisted ? '#b91c1c' : '#575146'} fill={isWishlisted ? '#b91c1c' : 'none'} />
                  </button>

                  <div className="hover-action-overlay">
                    <span style={{ backgroundColor: 'rgba(11, 37, 29, 0.92)', color: '#f5e7c8', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '12px 24px', borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Eye size={16} /> View Details
                    </span>
                  </div>
                </div>

                {/* Card Content */}
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

        {/* Explore All CTA Component */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '64px' }}>
          <button
            onClick={handleExploreShop}
            className="shop-cta-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#0a221a',
              color: '#dfbe84',
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '20px 48px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 12px 32px rgba(10,34,26,0.1)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1a3328'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#0a221a'; e.currentTarget.style.transform = 'none' }}
          >
            Explore Full Shop <ArrowRight size={20} strokeWidth={2} />
          </button>
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
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .product-collection-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px 12px !important;
          }
          .shop-cta-btn {
             width: 100%;
             justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .product-collection-grid {
            grid-template-columns: repeat(1, 1fr) !important; /* Single column on tiny screens if desired, but 2 col keeps the luxury feel. Sticking to 2 col might overflow, let's keep it 1 or tight 2. Let's do a tight 2 */
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px 8px !important;
          }
        }

        .luxury-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 48px rgba(10, 34, 26, 0.06) !important;
          border-color: rgba(140, 115, 59, 0.3) !important;
        }
        .luxury-card:hover .card-media {
          transform: scale(1.08) !important;
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
      `}</style>
    </section>
  );
}
