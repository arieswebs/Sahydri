import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/products';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Auto-scroll reviews continuously every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  // Touch swipe handling for mobile
  const minSwipeDistance = 45;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  return (
    <section className="testimonials-section">
      <div className="container">
        {/* Header */}
        <div className="testimonials-header">
          <span className="section-subtitle">— VERIFIED REVIEWS —</span>
          <h2 className="section-title">Loved by Chefs & Connoisseurs</h2>
        </div>

        {/* Carousel Container: Shows 1 at a time on mobile, moving left to right */}
        <div
          className="testimonials-carousel-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="testimonials-slider-track"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`
            }}
          >
            {TESTIMONIALS.map((item, idx) => (
              <div key={item.id} className="testimonial-slide-item">
                <div className="testimonial-card">
                  {/* Decorative background quote mark */}
                  <div className="card-quote-bg">
                    <Quote size={48} color="#d4af37" />
                  </div>

                  {/* 5 Gold Stars */}
                  <div className="stars-row">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="#d4af37" color="#d4af37" />
                    ))}
                  </div>

                  {/* Quote Body */}
                  <p className="testimonial-quote">
                    "{item.quote}"
                  </p>

                  {/* Author Footer */}
                  <div className="testimonial-footer">
                    <div>
                      <div className="author-name">{item.author}</div>
                      <div className="author-meta">{item.role} • {item.location}</div>
                    </div>

                    {item.verified && (
                      <div className="verified-badge">
                        <CheckCircle size={14} />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls: Arrows and Dots */}
          <div className="testimonials-controls">
            <button
              onClick={handlePrev}
              className="carousel-arrow-btn"
              title="Previous Review"
              aria-label="Previous Review"
            >
              <ArrowLeft size={16} />
            </button>

            {/* Pagination Dots */}
            <div className="carousel-dots-row">
              {TESTIMONIALS.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setActiveIndex(dotIdx)}
                  className={`carousel-dot ${activeIndex === dotIdx ? 'dot-active' : ''}`}
                  title={`Go to review ${dotIdx + 1}`}
                  aria-label={`Go to review ${dotIdx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="carousel-arrow-btn"
              title="Next Review"
              aria-label="Next Review"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .testimonials-section {
          padding: clamp(60px, 6vw, 90px) 0;
          background-color: var(--surface-ground);
          overflow: hidden;
          width: 100%;
        }

        .testimonials-header {
          text-align: center;
          margin-bottom: clamp(28px, 4vw, 48px);
        }

        .testimonials-carousel-wrapper {
          position: relative;
          max-width: 820px;
          margin: 0 auto;
          overflow: hidden;
          width: 100%;
        }

        .testimonials-slider-track {
          display: flex;
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
          width: 100%;
          will-change: transform;
        }

        .testimonial-slide-item {
          min-width: 100%;
          width: 100%;
          flex-shrink: 0;
          box-sizing: border-box;
          padding: 6px 8px;
        }

        .testimonial-card {
          background-color: var(--surface-card);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-lg);
          padding: clamp(26px, 4vw, 42px) clamp(20px, 3.5vw, 36px);
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-sm);
          position: relative;
          overflow: hidden;
          min-height: 220px;
          box-sizing: border-box;
          transition: box-shadow var(--transition-normal);
        }
        .testimonial-card:hover {
          box-shadow: var(--shadow-md);
        }

        .card-quote-bg {
          position: absolute;
          top: 14px;
          right: 18px;
          opacity: 0.12;
          pointer-events: none;
        }

        .stars-row {
          display: flex;
          gap: 3px;
          color: var(--color-gold-500);
          margin-bottom: 16px;
        }

        .testimonial-quote {
          font-family: var(--font-serif);
          font-size: clamp(1.05rem, 1.4vw, 1.25rem);
          line-height: 1.65;
          color: var(--color-forest-900);
          margin-bottom: 22px;
          flex-grow: 1;
        }

        .testimonial-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid var(--surface-border-subtle);
          gap: 12px;
          flex-wrap: wrap;
        }

        .author-name {
          font-weight: 700;
          font-size: clamp(0.9rem, 1.1vw, 0.98rem);
          color: var(--color-forest-900);
        }

        .author-meta {
          font-size: 0.74rem;
          color: var(--color-earth-500);
          margin-top: 2px;
        }

        .verified-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          color: #21744b;
          font-weight: 600;
        }

        /* Bottom Controls Row: Prev/Next & Dots */
        .testimonials-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-top: 20px;
        }

        .carousel-arrow-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid #dfbe84;
          background-color: #ffffff;
          color: #0c261e;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(11, 34, 26, 0.06);
        }

        .carousel-arrow-btn:hover {
          background-color: #0c261e;
          color: #dfbe84;
          border-color: #0c261e;
          transform: scale(1.05);
        }

        .carousel-dots-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .carousel-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #d8cebd;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .carousel-dot.dot-active {
          width: 24px;
          border-radius: 10px;
          background-color: #0c261e;
        }

        @media (max-width: 640px) {
          .testimonial-card {
            padding: 20px 16px;
            min-height: 200px;
          }
          .testimonial-quote {
            font-size: 0.96rem;
            line-height: 1.55;
            margin-bottom: 16px;
          }
          .carousel-arrow-btn {
            width: 34px;
            height: 34px;
          }
        }
      `}</style>
    </section>
  );
}
