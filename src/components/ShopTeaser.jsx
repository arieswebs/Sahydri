import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Sparkles, Leaf, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../data/products';

const FEATURED = PRODUCTS.slice(0, 4);

export default function ShopTeaser({ onGoShop, onAddToCart }) {
  const [hovered, setHovered] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    const el = document.getElementById('shop-teaser');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="shop-teaser"
      style={{
        padding: '110px 0 120px',
        background: 'linear-gradient(180deg, #faf8f4 0%, #f2ede4 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 10% 20%, rgba(212,175,55,0.07) 0%, transparent 50%),
          radial-gradient(circle at 90% 80%, rgba(11,37,29,0.05) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* Section Header */}
        <div style={{
          textAlign: 'center', marginBottom: '64px',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)',
            borderRadius: '40px', padding: '6px 18px', marginBottom: '20px',
          }}>
            <Leaf size={13} color="#9e8550" strokeWidth={1.8} />
            <span style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.68rem',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: '#9e8550', fontWeight: '600',
            }}>
              Single Estate · Tribal Foraged
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
            fontWeight: '400', color: '#0a221a',
            letterSpacing: '-0.02em', lineHeight: '1.1',
            marginBottom: '18px',
          }}>
            The Sahydri Collection
          </h2>

          <p style={{
            fontSize: '1rem', color: '#6b6356', maxWidth: '480px',
            margin: '0 auto', lineHeight: '1.7', fontWeight: '400',
          }}>
            Hand-sorted, sun-dried spices and wild-harvested forest goods — 
            from the mist-draped slopes of the Western Ghats to your kitchen.
          </p>
        </div>

        {/* Product Preview Cards */}
        <div
          className="shop-teaser-grid"
          style={{
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s',
          }}
        >
          {FEATURED.map((product, i) => (
            <div
              key={product.id}
              onClick={() => onGoShop()}
              onMouseEnter={() => setHovered(product.id)}
              onMouseLeave={() => setHovered(null)}
              className="teaser-card"
              style={{
                cursor: 'pointer',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.6s ease ${0.1 + i * 0.08}s, transform 0.6s ease ${0.1 + i * 0.08}s`,
              }}
            >
              {/* Image */}
              <div style={{
                position: 'relative', aspectRatio: '1 / 1',
                backgroundColor: '#ede8df', overflow: 'hidden',
                borderRadius: '4px 4px 0 0',
              }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
                    transform: hovered === product.id ? 'scale(1.07)' : 'scale(1)',
                  }}
                />
                {/* Origin badge */}
                <div style={{
                  position: 'absolute', bottom: '12px', left: '12px',
                  background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
                  borderRadius: '3px', padding: '3px 9px',
                  fontSize: '0.6rem', letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: '#5a4e3c', fontWeight: '700',
                }}>
                  {product.originBadge}
                </div>
                {/* Rating */}
                <div style={{
                  position: 'absolute', top: '12px', right: '12px',
                  background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
                  borderRadius: '20px', padding: '3px 9px',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  <Star size={10} fill="#d4af37" color="#d4af37" />
                  <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#3a3326' }}>
                    {product.rating}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '16px 18px 18px' }}>
                <div style={{
                  fontSize: '0.62rem', letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: '#9e8550', fontWeight: '700',
                  marginBottom: '5px',
                }}>
                  {product.weight}
                </div>
                <div style={{
                  fontFamily: 'var(--font-sans)', fontSize: '0.95rem',
                  fontWeight: '600', color: '#0d2820', lineHeight: '1.3',
                  marginBottom: '12px',
                }}>
                  {product.name}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingTop: '10px', borderTop: '1px solid rgba(11,37,29,0.07)',
                }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0d2820' }}>
                    ₹{product.price}
                  </span>
                  <span style={{
                    fontSize: '0.7rem', color: '#9e8550', fontWeight: '600',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>
                    View →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Block */}
        <div style={{
          textAlign: 'center', marginTop: '72px',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s ease 0.5s, transform 0.7s ease 0.5s',
        }}>
          {/* Stats row */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '48px',
            flexWrap: 'wrap', marginBottom: '48px',
          }}>
            {[
              { value: '40+', label: 'Unique Products' },
              { value: '4', label: 'Categories' },
              { value: '100%', label: 'Natural & Pure' },
              { value: '4.9★', label: 'Avg. Rating' },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.9rem', fontWeight: '400',
                  color: '#0a221a', letterSpacing: '-0.02em', lineHeight: '1',
                  marginBottom: '5px',
                }}>
                  {value}
                </div>
                <div style={{
                  fontSize: '0.72rem', color: '#9e8550',
                  letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '600',
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Main CTA */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={onGoShop}
              className="shop-cta-btn"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: 'linear-gradient(135deg, #0b251d, #153d2d)',
                color: '#f5e7c8', border: 'none', borderRadius: '3px',
                padding: '16px 36px', fontSize: '0.88rem', fontWeight: '700',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
                boxShadow: '0 8px 28px rgba(11,37,29,0.25)',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <ShoppingBag size={16} strokeWidth={1.8} />
              Explore Full Collection
              <ArrowRight size={15} strokeWidth={2} />
            </button>

            <button
              onClick={onGoShop}
              className="shop-cta-ghost"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'transparent', color: '#0b251d',
                border: '1px solid rgba(11,37,29,0.3)',
                borderRadius: '3px', padding: '15px 28px',
                fontSize: '0.82rem', fontWeight: '600',
                letterSpacing: '0.06em', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
                transition: 'all 0.25s ease',
              }}
            >
              <span>Explore Categories</span>
              <ArrowRight size={14} strokeWidth={1.8} />
            </button>
          </div>

          <p style={{
            marginTop: '22px', fontSize: '0.8rem', color: 'var(--color-earth-500)',
            letterSpacing: '0.04em',
          }}>
            Free express delivery on orders above ₹999 · Sourced directly from Kerala estates
          </p>
        </div>
      </div>

      <style>{`
        .shop-teaser-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1100px) {
          .shop-teaser-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }
        @media (max-width: 520px) {
          .shop-teaser-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
        .teaser-card {
          background: var(--surface-card);
          border: 1px solid var(--surface-border-subtle);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: all var(--transition-normal);
          box-shadow: var(--shadow-xs);
        }
        .teaser-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: rgba(201, 164, 86, 0.35);
        }
        .shop-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md) !important;
          background: linear-gradient(135deg, var(--color-forest-850), var(--color-forest-700)) !important;
        }
        .shop-cta-btn:active, .shop-cta-ghost:active {
          transform: translateY(0) scale(0.98);
        }
        .shop-cta-ghost:hover {
          background: rgba(10, 34, 26, 0.06) !important;
          border-color: var(--color-forest-800) !important;
        }
      `}</style>
    </section>
  );
}
