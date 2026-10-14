import React from 'react';
import { Quote } from 'lucide-react';

export default function CulturalHeritage() {
  return (
    <section id="heritage" className="heritage-section">
      <div className="container">
        <div className="heritage-card">


          <div className="heritage-grid">
            {/* Left: Kathakali Portrait */}
            <div className="heritage-img-col">
              <div className="heritage-img-frame">
                <img
                  src="/images/kathakali.jpg"
                  alt="Kerala Kathakali Classical Art"
                  className="heritage-img"
                />
              </div>
            </div>

            {/* Right: Heritage Narrative */}
            <div className="heritage-content-col">
              <span className="section-subtitle">— OUR HERITAGE & TRADITIONS —</span>
              <h2 className="heritage-heading">
                A Portrait of Kerala's Soul: The Art of Divine Storytelling
              </h2>

              <p className="heritage-body-p">
                In the temple courtyards of Malabar, Kathakali artists spend hours applying sacred
                mineral pigments—green pacha for nobility, fiery reds for primal force—before evoking
                gods and cosmic myths. In the high valleys of Sahydri, spice cultivation is treated
                with identical sacred devotion.
              </p>

              <p className="heritage-body-p">
                Our elders never rush the drying of pepper under the golden winter sun, nor do our
                gatherers harvest honey without the blessing of the forest deity. Each spice you
                receive is an unbroken line of Kerala’s living culture.
              </p>

              {/* Quote Block */}
              <div className="heritage-quote-box">
                <Quote size={20} color="#d4af37" style={{ opacity: 0.7, marginBottom: '6px' }} />
                <p className="heritage-quote-text">
                  "Every pinch of spice carries the rhythm of chenda drums, the aroma of red soil,
                  and the eternal blessings of the rain forest."
                </p>
                <div className="heritage-quote-author">
                  — Saju Narayanan, 4th Generation Planter, Wayanad
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .heritage-section {
          padding: clamp(60px, 6vw, 90px) 0;
          background-color: var(--surface-ground);
          overflow: hidden;
        }

        .heritage-card {
          background-color: var(--surface-card);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-lg);
          padding: clamp(24px, 4vw, 56px);
          position: relative;
          box-shadow: var(--shadow-sm);
          width: 100%;
          box-sizing: border-box;
          transition: box-shadow var(--transition-normal);
        }
        .heritage-card:hover {
          box-shadow: var(--shadow-md);
        }

        .heritage-grid {
          display: grid;
          grid-template-columns: minmax(280px, 42%) 1fr;
          gap: clamp(24px, 4vw, 52px);
          align-items: center;
          width: 100%;
        }

        .heritage-img-frame {
          border: 1px solid rgba(201, 164, 86, 0.4);
          padding: 8px;
          background-color: var(--surface-elevated);
          border-radius: var(--radius-sm);
          width: 100%;
          box-sizing: border-box;
          box-shadow: var(--shadow-xs);
        }

        .heritage-img {
          width: 100%;
          height: auto;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          border-radius: var(--radius-xs);
          display: block;
        }

        .heritage-heading {
          font-family: var(--font-serif);
          font-size: clamp(1.5rem, 2.8vw, 2.4rem);
          font-weight: 500;
          line-height: 1.22;
          color: var(--color-forest-900);
          margin-bottom: 16px;
          letter-spacing: -0.015em;
          word-break: break-word;
        }

        .heritage-body-p {
          font-size: clamp(0.88rem, 1.1vw, 0.96rem);
          line-height: 1.7;
          color: var(--color-earth-600);
          margin-bottom: 14px;
        }

        .heritage-quote-box {
          background-color: var(--surface-elevated);
          border-left: 3px solid var(--color-gold-500);
          padding: clamp(14px, 2.5vw, 22px) clamp(16px, 3vw, 26px);
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          position: relative;
          margin-top: 20px;
          box-sizing: border-box;
        }

        .heritage-quote-text {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: clamp(0.95rem, 1.4vw, 1.1rem);
          line-height: 1.55;
          color: var(--color-forest-900);
          margin-bottom: 8px;
        }

        .heritage-quote-author {
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--color-gold-text);
        }

        @media (max-width: 768px) {
          .heritage-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .heritage-heading {
            font-size: clamp(1.35rem, 5.5vw, 1.75rem);
            margin-bottom: 12px;
          }
          .heritage-card {
            padding: 18px 14px;
          }
        }
      `}</style>
    </section>
  );
}
