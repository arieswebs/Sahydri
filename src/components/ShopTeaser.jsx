import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowRight, Star, Sparkles, Leaf, ShoppingBag, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';

export default function ShopTeaser({ onGoShop, onAddToCart, onViewProduct }) {
  const { products } = useShop();
  const catalog = useMemo(() => {
    return (products && products.length > 0) ? products : PRODUCTS;
  }, [products]);

  const [hovered, setHovered] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState('left'); // 'left' or 'right'

  const trackRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);

  // Intersection observer to trigger subtle entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    const el = document.getElementById('shop-teaser');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Continuous smooth gliding animation
  useEffect(() => {
    const track = trackRef.current;
    if (!track || catalog.length === 0) return;

    let animId;
    const speed = 0.85; // smooth gentle motion

    const glide = () => {
      if (!isPaused && !isDraggingRef.current && track) {
        if (direction === 'left') {
          track.scrollLeft += speed;
          if (track.scrollLeft >= track.scrollWidth / 2) {
            track.scrollLeft = 0;
          }
        } else {
          track.scrollLeft -= speed;
          if (track.scrollLeft <= 0) {
            track.scrollLeft = track.scrollWidth / 2;
          }
        }
      }
      animId = requestAnimationFrame(glide);
    };

    animId = requestAnimationFrame(glide);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, direction, catalog.length]);

  const scrollByAmount = (offset) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    if (offset < 0) setDirection('right');
    else setDirection('left');
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e) => {
    if (!trackRef.current) return;
    isDraggingRef.current = true;
    setIsPaused(true);
    startXRef.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeftStartRef.current = trackRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    trackRef.current.scrollLeft = scrollLeftStartRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleCardClick = (product) => {
    if (onViewProduct) {
      onViewProduct(product);
    } else if (onGoShop) {
      onGoShop();
    }
  };

  // Duplicate items for infinite seamless moving ribbon
  const displayItems = useMemo(() => {
    return [...catalog, ...catalog];
  }, [catalog]);

  if (catalog.length === 0) return null;

  return (
    <section
      id="shop-teaser"
      style={{
        padding: '100px 0 110px',
        background: 'linear-gradient(180deg, #faf8f4 0%, #f4ede2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative ambient gradients */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 10% 20%, rgba(223,190,132,0.12) 0%, transparent 45%),
          radial-gradient(circle at 90% 80%, rgba(11,37,29,0.06) 0%, transparent 45%)
        `,
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* Section Header */}
        <div style={{
          textAlign: 'center', marginBottom: '42px',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(212,175,55,0.14)', border: '1px solid rgba(212,175,55,0.28)',
            borderRadius: '40px', padding: '6px 18px', marginBottom: '16px',
          }}>
            <Leaf size={13} color="#9e8550" strokeWidth={2} />
            <span style={{
              fontFamily: 'var(--font-sans), "Plus Jakarta Sans", sans-serif', fontSize: '0.7rem',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: '#8a6d2b', fontWeight: '700',
            }}>
              Single Estate · Tribal Foraged
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-serif), Georgia, serif',
            fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
            fontWeight: '400', color: '#0a221a',
            letterSpacing: '-0.02em', lineHeight: '1.15',
            marginBottom: '14px',
          }}>
            The Sahydri Collection
          </h2>

          <p style={{
            fontSize: '0.96rem', color: '#6b6356', maxWidth: '520px',
            margin: '0 auto', lineHeight: '1.65',
            fontFamily: 'var(--font-sans), "Plus Jakarta Sans", sans-serif'
          }}>
            Hand-sorted, sun-dried spices and wild-harvested forest goods — 
            from the mist-draped slopes of the Western Ghats to your kitchen.
          </p>
        </div>

        {/* Controls Bar: All Products counter & Slider Nav Controls */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '22px', flexWrap: 'wrap', gap: '12px'
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '0.78rem', fontWeight: 600, color: '#4a5d4e',
            background: 'rgba(11,37,29,0.05)', padding: '6px 14px', borderRadius: '20px',
            fontFamily: 'var(--font-sans), "Plus Jakarta Sans", sans-serif'
          }}>
            <Sparkles size={13} color="#9e8550" />
            <span>All {catalog.length} Hand-Harvested Products</span>
            <span style={{ color: '#9e8550' }}>•</span>
            <span style={{ color: '#7a8e80', fontSize: '0.72rem' }}>Hover to pause</span>
          </div>

          {/* Movement & Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsPaused(p => !p)}
              className="teaser-control-btn"
              title={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '6px 12px', borderRadius: '20px',
                background: '#ffffff', border: '1px solid #d9d2c5',
                fontSize: '0.72rem', fontWeight: 600, color: '#0a221a',
                cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}
            >
              {isPaused ? <Play size={12} fill="#0a221a" /> : <Pause size={12} fill="#0a221a" />}
              <span>{isPaused ? 'Auto Play' : 'Pause'}</span>
            </button>

            <button
              onClick={() => scrollByAmount(-320)}
              className="teaser-arrow-btn"
              aria-label="Scroll Left"
              title="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => scrollByAmount(320)}
              className="teaser-arrow-btn"
              aria-label="Scroll Right"
              title="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Moving Horizontal Track: Left to Right Ribbon */}
        <div
          ref={trackRef}
          className="shop-teaser-track"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => { setIsPaused(false); handleMouseUpOrLeave(); }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s',
          }}
        >
          {displayItems.map((product, i) => (
            <div
              key={`${product.id}-${i}`}
              onClick={() => handleCardClick(product)}
              onMouseEnter={() => setHovered(`${product.id}-${i}`)}
              onMouseLeave={() => setHovered(null)}
              className="teaser-card"
            >
              {/* Image Container */}
              <div style={{
                position: 'relative', aspectRatio: '1 / 1',
                backgroundColor: '#ede8df', overflow: 'hidden',
                borderRadius: '6px 6px 0 0',
              }}>
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  draggable={false}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                    transform: hovered === `${product.id}-${i}` ? 'scale(1.08)' : 'scale(1)',
                    userSelect: 'none'
                  }}
                />

                {/* Origin badge */}
                <div style={{
                  position: 'absolute', bottom: '10px', left: '10px',
                  background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
                  borderRadius: '3px', padding: '3px 8px',
                  fontSize: '0.6rem', letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: '#5a4e3c', fontWeight: '700',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}>
                  {product.originBadge || product.tag || 'SINGLE ESTATE'}
                </div>

                {/* Rating */}
                <div style={{
                  position: 'absolute', top: '10px', right: '10px',
                  background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
                  borderRadius: '20px', padding: '3px 9px',
                  display: 'flex', alignItems: 'center', gap: '4px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}>
                  <Star size={10} fill="#d4af37" color="#d4af37" />
                  <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#3a3326' }}>
                    {product.rating}
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div style={{ padding: '15px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{
                  fontSize: '0.62rem', letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: '#9e8550', fontWeight: '700',
                  marginBottom: '5px', fontFamily: 'var(--font-sans), "Plus Jakarta Sans", sans-serif'
                }}>
                  {product.weight || 'Standard Pack'}
                </div>

                <div style={{
                  fontFamily: 'var(--font-sans), "Plus Jakarta Sans", sans-serif',
                  fontSize: '0.92rem',
                  fontWeight: '600', color: '#0d2820', lineHeight: '1.35',
                  marginBottom: '12px', minHeight: '2.7em',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                  {product.name}
                </div>

                <div style={{
                  marginTop: 'auto',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingTop: '10px', borderTop: '1px solid rgba(11,37,29,0.07)',
                }}>
                  <span style={{
                    fontSize: '1.05rem', fontWeight: '800', color: '#0d2820',
                    fontFamily: 'var(--font-sans), "Plus Jakarta Sans", sans-serif'
                  }}>
                    ₹{product.price}
                  </span>
                  <span style={{
                    fontSize: '0.72rem', color: '#9e8550', fontWeight: '700',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    display: 'inline-flex', alignItems: 'center', gap: '3px',
                    fontFamily: 'var(--font-sans), "Plus Jakarta Sans", sans-serif'
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
          textAlign: 'center', marginTop: '64px',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s',
        }}>
          {/* Stats row */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '48px',
            flexWrap: 'wrap', marginBottom: '40px',
          }}>
            {[
              { value: `${catalog.length}+`, label: 'Authentic Harvests' },
              { value: '4', label: 'Terroir Categories' },
              { value: '100%', label: 'Natural & Pure' },
              { value: '4.9★', label: 'Average Rating' },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-sans), "Plus Jakarta Sans", sans-serif',
                  fontSize: '1.85rem', fontWeight: '700',
                  color: '#0a221a', letterSpacing: '-0.02em', lineHeight: '1',
                  marginBottom: '5px',
                }}>
                  {value}
                </div>
                <div style={{
                  fontSize: '0.7rem', color: '#9e8550',
                  letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '600',
                  fontFamily: 'var(--font-sans), "Plus Jakarta Sans", sans-serif'
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Main CTA Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={onGoShop}
              className="shop-cta-btn"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: 'linear-gradient(135deg, #0b251d, #153d2d)',
                color: '#f5e7c8', border: 'none', borderRadius: '4px',
                padding: '16px 36px', fontSize: '0.88rem', fontWeight: '700',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: 'var(--font-sans), "Plus Jakarta Sans", sans-serif',
                boxShadow: '0 8px 28px rgba(11,37,29,0.25)',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <ShoppingBag size={16} strokeWidth={1.8} />
              Explore All {catalog.length} Products
              <ArrowRight size={15} strokeWidth={2} />
            </button>
          </div>

          <p style={{
            marginTop: '20px', fontSize: '0.78rem', color: '#7a8e80',
            letterSpacing: '0.04em', fontFamily: 'var(--font-sans), "Plus Jakarta Sans", sans-serif'
          }}>
            Free express delivery on orders above ₹499 · Freshly packaged directly from Kerala estates
          </p>
        </div>
      </div>

      <style>{`
        .shop-teaser-track {
          display: flex;
          gap: 22px;
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 8px 4px 18px;
          cursor: grab;
          user-select: none;
        }
        .shop-teaser-track:active {
          cursor: grabbing;
        }
        .shop-teaser-track::-webkit-scrollbar {
          display: none;
        }
        .teaser-card {
          flex: 0 0 270px;
          max-width: 270px;
          background: #ffffff;
          border: 1px solid rgba(11, 37, 29, 0.08);
          border-radius: 6px;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
          box-shadow: 0 4px 14px rgba(11, 37, 29, 0.04);
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }
        .teaser-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 32px rgba(11, 37, 29, 0.12);
          border-color: rgba(223, 190, 132, 0.6);
        }
        .teaser-arrow-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid #d9d2c5;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #0a221a;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
          transition: all 0.2s ease;
        }
        .teaser-arrow-btn:hover {
          background: #0a221a;
          color: #dfbe84;
          border-color: #0a221a;
          transform: scale(1.05);
        }
        .teaser-control-btn:hover {
          background: #faf8f4 !important;
          border-color: #0a221a !important;
        }
        .shop-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(11, 37, 29, 0.35) !important;
          background: linear-gradient(135deg, #0e2b21, #1b4b3c) !important;
        }
        .shop-cta-btn:active {
          transform: translateY(0) scale(0.98);
        }
        @media (max-width: 640px) {
          .teaser-card {
            flex: 0 0 220px;
            max-width: 220px;
          }
        }
      `}</style>
    </section>
  );
}
