import React, { useState } from 'react';
import { Utensils, X, Flame, Leaf } from 'lucide-react';
import { CULINARY_DISHES } from '../data/products';

export default function CulinaryGallery() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  return (
    <section style={{ padding: 'clamp(48px, 6vw, 90px) 0', backgroundColor: '#071813', color: '#ffffff' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(28px, 4vw, 52px)' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.74rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#d4af37',
              display: 'block',
              marginBottom: '10px'
            }}
          >
            — A FEAST OF SPICES —
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.7rem, 4vw, 3.4rem)',
              fontWeight: '400',
              color: '#ffffff',
              marginBottom: '12px'
            }}
          >
            Savour the Tradition
          </h2>
          <p
            style={{
              fontSize: '0.8rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#a5b5ae',
              maxWidth: '680px',
              margin: '0 auto'
            }}
          >
            Discover the authentic flavours and traditional recipes of Kerala's rich culinary heritage
          </p>
        </div>

        {/* 6 Grid items */}
        <div className="culinary-grid">
          {CULINARY_DISHES.map((dish) => (
            <div
              key={dish.id}
              onClick={() => setSelectedRecipe(dish)}
              style={{
                position: 'relative',
                borderRadius: '6px',
                overflow: 'hidden',
                cursor: 'pointer',
                aspectRatio: '16 / 10',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                transition: 'all 0.35s ease'
              }}
              className="dish-card"
            >
              <img
                src={dish.image}
                alt={dish.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.5s ease'
                }}
                className="dish-img"
              />

              {/* Gradient Scrim */}
              <div className="dish-scrim">
                <div className="dish-spice-pill">
                  <Flame size={12} color="#d4af37" />
                  <span>Key Spice: {dish.spice}</span>
                </div>

                <h3 className="dish-title">
                  {dish.title}
                </h3>

                <p className="dish-desc">
                  {dish.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipe Popup Modal */}
      {selectedRecipe && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedRecipe(null)}
        >
          <div
            style={{
              backgroundColor: '#0c261e',
              border: '1px solid #d4af37',
              borderRadius: '8px',
              maxWidth: '560px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedRecipe(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              <X size={18} />
            </button>

            <img
              src={selectedRecipe.image}
              alt={selectedRecipe.title}
              style={{ width: '100%', height: '220px', objectFit: 'cover' }}
            />

            <div style={{ padding: '28px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.72rem',
                  color: '#e5c98d',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase'
                }}
              >
                Traditional Malabar Heritage Recipe
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.8rem',
                  color: '#ffffff',
                  margin: '8px 0 12px 0'
                }}
              >
                {selectedRecipe.title}
              </h3>

              <div
                style={{
                  backgroundColor: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '12px 16px',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  color: '#f5e4c3',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Leaf size={14} color="#dfbe84" strokeWidth={1.8} />
                <span><strong>Signature Spice Used:</strong> {selectedRecipe.spice}</span>
              </div>

              <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#b9cbc2' }}>
                Cooked slowly over wood embers in traditional terracotta pots. The essential oils from
                freshly ground Sahyadri hill spices infuse the curry with unmatched warmth, velvety texture,
                and digestive vitality.
              </p>

              <button
                onClick={() => setSelectedRecipe(null)}
                className="btn-gold"
                style={{ marginTop: '24px', width: '100%' }}
              >
                Close Recipe Card
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .dish-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(6, 22, 17, 0.95) 0%, rgba(6, 22, 17, 0.45) 50%, transparent 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 24px;
        }

        .dish-spice-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #e5c98d;
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .dish-title {
          font-family: var(--font-serif);
          font-size: 1.45rem;
          font-weight: 500;
          color: #ffffff;
          margin-bottom: 4px;
        }

        .dish-desc {
          font-size: 0.82rem;
          color: #c0d0c8;
          line-height: 1.4;
        }

        .dish-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.4);
          border-color: #d4af37;
        }

        .dish-card:hover .dish-img {
          transform: scale(1.08);
        }

        .culinary-grid {
          display: grid;
          gap: 20px;
        }

        .culinary-grid > :nth-child(5) {
          grid-column-start: auto;
        }

        /* 4 Columns on desktop: center the 2 items in the second row */
        @media (min-width: 1100px) {
          .culinary-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .culinary-grid > :nth-child(5) {
            grid-column-start: 2 !important;
          }
        }

        /* 3 Columns on tablet: 2 complete rows of 3 items */
        @media (min-width: 769px) and (max-width: 1099px) {
          .culinary-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        /* Two in a row on mobile screens */
        @media (max-width: 768px) {
          .culinary-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }

          .dish-card {
            aspect-ratio: 1 / 1.15 !important;
            border-radius: 6px !important;
          }

          .dish-scrim {
            padding: 10px 8px !important;
            background: linear-gradient(to top, rgba(6, 22, 17, 0.96) 0%, rgba(6, 22, 17, 0.65) 55%, transparent 100%) !important;
          }

          .dish-spice-pill {
            font-size: 0.58rem !important;
            gap: 3px !important;
            margin-bottom: 2px !important;
          }

          .dish-spice-pill svg {
            width: 10px !important;
            height: 10px !important;
          }

          .dish-title {
            font-size: 0.88rem !important;
            line-height: 1.18 !important;
            margin-bottom: 3px !important;
          }

          .dish-desc {
            font-size: 0.68rem !important;
            line-height: 1.25 !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
            color: #b0c2b8 !important;
          }
        }

        @media (max-width: 480px) {
          .culinary-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }

          .dish-card {
            aspect-ratio: 1 / 1.22 !important;
          }

          .dish-scrim {
            padding: 8px 6px !important;
          }

          .dish-title {
            font-size: 0.82rem !important;
          }

          .dish-desc {
            font-size: 0.64rem !important;
            -webkit-line-clamp: 2 !important;
          }
        }
      `}</style>
    </section>
  );
}
