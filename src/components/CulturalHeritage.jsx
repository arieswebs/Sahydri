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
                gods and cosmic myths. In the high valleys of Sahyadri, spice cultivation is treated
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
          padding: clamp(48px, 6vw, 90px) 0;
          background-color: #faf7f0;
          overflow: hidden;
        }

        .heritage-card {
          background-color: #ffffff;
          border: 1px solid #dfbe84;
          border-radius: 8px;
          padding: clamp(18px, 3.5vw, 52px);
          position: relative;
          box-shadow: 0 12px 36px rgba(11, 34, 26, 0.06);
          width: 100%;
          box-sizing: border-box;
        }



        .heritage-grid {
          display: grid;
          grid-template-columns: minmax(280px, 42%) 1fr;
          gap: clamp(20px, 4vw, 48px);
          align-items: center;
          width: 100%;
        }

        .heritage-img-frame {
          border: 1px solid #d4af37;
          padding: 8px;
          background-color: #fbf9f4;
          border-radius: 4px;
          width: 100%;
          box-sizing: border-box;
        }

        .heritage-img {
          width: 100%;
          height: auto;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          border-radius: 2px;
          display: block;
        }

        .heritage-heading {
          font-family: var(--font-serif);
          font-size: clamp(1.4rem, 2.8vw, 2.5rem);
          font-weight: 500;
          line-height: 1.25;
          color: #0e2b21;
          margin-bottom: 16px;
          word-break: break-word;
        }

        .heritage-body-p {
          font-size: clamp(0.86rem, 1.1vw, 0.94rem);
          line-height: 1.65;
          color: #554f44;
          margin-bottom: 14px;
        }

        .heritage-quote-box {
          background-color: #f6f1e6;
          border-left: 3px solid #d4af37;
          padding: clamp(12px, 2.5vw, 20px) clamp(14px, 3vw, 24px);
          border-radius: 0 6px 6px 0;
          position: relative;
          margin-top: 18px;
          box-sizing: border-box;
        }

        .heritage-quote-text {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: clamp(0.92rem, 1.4vw, 1.08rem);
          line-height: 1.5;
          color: #1a2e25;
          margin-bottom: 8px;
        }

        .heritage-quote-author {
          font-size: 0.74rem;
          font-weight: 600;
          color: #82692e;
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
