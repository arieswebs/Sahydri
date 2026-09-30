import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero({ onExploreClick, onStoryClick }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const SLIDE_DURATION = 5000; // 5s per slide

  // 4 background slides: pristine landscape, branded honey, branded cardamom, and estate canopy
  const slides = [
    {
      id: "estate",
      badge: "CERTIFIED ORGANIC HERITAGE ESTATE",
      titlePrefix: "From the ",
      titleHighlight: "Sahyadri Hills",
      titleSuffix: " to Your Kitchen",
      specs: ["4,200 FT ELEVATION", "100% BIO-DYNAMIC", "DIRECT TRIBAL ETHICS"],
      subtitle: "Experience authentic single-origin heritage spices and raw wild forest honey, hand-foraged by indigenous tribal honey hunters from the ancient mist-shrouded rain-forests of Kerala's Western Ghats.",
      mobileSubtitle: "Single-origin spices & raw wild forest honey from Kerala's misted Western Ghats.",
      ctaPrimary: "EXPLORE SPICES",
      ctaSecondary: "DISCOVER OUR STORY",
      image: "/images/hero.jpg"
    },
    {
      id: "honey",
      badge: "100% RAW FOREST NECTAR",
      titlePrefix: "Raw Forest Honey from ",
      titleHighlight: "Untamed Groves",
      titleSuffix: "",
      specs: ["NMR LAB CERTIFIED", "100% RAW & UNHEATED", "WILD FORAGED NECTAR"],
      subtitle: "100% unheated, unfiltered multi-flora nectar gathered under starlight by Kadar tribal honey hunters from 150-ft ancient rainforest trees. Packed with living enzymes, bee pollen, and wild medicinal flora.",
      mobileSubtitle: "100% unheated, raw multi-flora nectar from wild forest canopies.",
      ctaPrimary: "TASTE WILD HONEY",
      ctaSecondary: "PURITY LAB NMR",
      image: "/images/hero_honey.jpg"
    },
    {
      id: "cardamom",
      badge: "SINGLE-ORIGIN SPICES",
      titlePrefix: "Single-Origin ",
      titleHighlight: "Heritage Spices",
      titleSuffix: " of Sahyadri",
      specs: ["CARDAMOM 8MM+", "TELLICHERRY PEPPER", "GOLDEN TURMERIC", "MALABAR CHILLI"],
      subtitle: "Sun-cured 8mm+ green cardamom, Tellicherry black pepper, high-curcumin golden turmeric, and sun-dried red chillies—all handpicked by native farmers from 4,200 ft high ranges.",
      mobileSubtitle: "Sun-cured green cardamom, Tellicherry pepper, golden turmeric & red chilli.",
      ctaPrimary: "SHOP SPICE LINEUP",
      ctaSecondary: "VIEW PURITY LABS",
      image: "/images/hero_cardamom.jpg"
    },
    {
      id: "tribal",
      badge: "DIRECT INDIGENOUS STEWARDSHIP",
      titlePrefix: "Stewarded by ",
      titleHighlight: "3,200+ Families",
      titleSuffix: "",
      specs: ["FAIR TRADE COVENANT", "ZERO MIDDLEMEN", "70% DIRECT VALUE RETURN"],
      subtitle: "Preserving centuries of sacred forest stewardship across Wayanad and Idukki. Fair trade value returned directly to indigenous tribal communities, ensuring regenerative biodiversity.",
      mobileSubtitle: "Ethically gathered by 3,200+ native forest custodians with zero middlemen.",
      ctaPrimary: "EXPLORE SPICES",
      ctaSecondary: "READ CHRONICLES",
      image: "/images/estate.jpg"
    }
  ];

  // Continuous auto-advancing slideshow without pause
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((curr) => (curr + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section id="hero-section" className="hero-responsive-section">
      {/* 4 Automatically Moving Background Pictures with Silky Crossfade and Subtle Zoom */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`hero-bg-layer hero-bg-${slide.id}`}
          style={{
            backgroundImage: `url("${slide.image}")`,
            opacity: activeSlide === idx ? 1 : 0,
            transform: activeSlide === idx ? 'scale(1.015)' : 'scale(1.05)'
          }}
        />
      ))}

      {/* Atmospheric Darkening Gradient Overlay */}
      <div className="hero-gradient-overlay" />

      {/* Ambient Mist & Golden Dawn Glow Overlay */}
      <div className="hero-mist-overlay" />

      {/* Main Editorial Content Container - Centered */}
      <div className="container hero-content-container">
        <div className="hero-text-wrapper">
          {/* Animated Slide Content */}
          <div key={activeSlide} className="hero-slide-anim">
            {/* Tag Pill */}
            <div className="hero-tag-pill pulse-badge">
              <Sparkles size={12} color="#d4af37" />
              <span>{slides[activeSlide].badge}</span>
            </div>

            {/* Main Headline - Bold & Filled */}
            <h1 className="hero-title">
              {slides[activeSlide].titlePrefix}
              <em className="hero-title-highlight">
                {slides[activeSlide].titleHighlight}
              </em>
              {slides[activeSlide].titleSuffix}
            </h1>

            {/* Estate Specs Highlight Strip (Desktop only) */}
            <div className="hero-specs-row desktop-only">
              {slides[activeSlide].specs.map((spec, sIdx) => (
                <span key={sIdx} className="hero-spec-chip">
                  <span className="spec-dot" />
                  {spec}
                </span>
              ))}
            </div>

            {/* Rich Subtitle for Desktop */}
            <p className="hero-subtitle desktop-only">
              {slides[activeSlide].subtitle}
            </p>

            {/* Concise Subtitle for Mobile */}
            <p className="hero-subtitle mobile-only">
              {slides[activeSlide].mobileSubtitle}
            </p>

            {/* Action Buttons */}
            <div className="hero-actions-row">
              <button
                onClick={onExploreClick}
                className="btn-gold hero-cta-btn hero-cta-primary"
              >
                <span>{slides[activeSlide].ctaPrimary}</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={onStoryClick}
                className="btn-outline-gold hero-cta-btn hero-cta-secondary desktop-only"
              >
                <span>{slides[activeSlide].ctaSecondary}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ================= HERO BASE - FILLED EDITORIAL ================= */
        .hero-responsive-section {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #ffffff;
          padding: 80px 20px 40px 20px;
          overflow: hidden;
          background-color: #05120e;
        }

        .hero-bg-layer {
          position: absolute;
          inset: 0;
          background-size: cover;
          transition: opacity 1s cubic-bezier(0.25, 1, 0.5, 1), transform 6.5s ease-out;
          z-index: 1;
          pointer-events: none;
        }

        /* Desktop focal positions - centered */
        .hero-bg-estate { background-position: center 40%; }
        .hero-bg-honey { background-position: center 60%; }
        .hero-bg-cardamom { background-position: center 55%; }
        .hero-bg-tribal { background-position: center 40%; }

        .hero-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(5, 18, 14, 0.72) 0%,
            rgba(6, 22, 17, 0.42) 40%,
            rgba(6, 22, 17, 0.88) 100%
          );
          pointer-events: none;
          z-index: 2;
        }

        .hero-mist-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 25% 40%, rgba(212, 175, 55, 0.08) 0%, transparent 60%);
          pointer-events: none;
          z-index: 3;
        }

        .hero-content-container {
          position: relative;
          z-index: 10;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
          padding: 0;
          text-align: center;
        }

        .hero-text-wrapper {
          max-width: 960px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .hero-slide-anim {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          text-align: center;
        }

        .hero-tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: rgba(7, 24, 19, 0.85);
          border: 1px solid rgba(212, 175, 55, 0.5);
          padding: 6px 16px;
          border-radius: 30px;
          font-size: 0.74rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #f5dfb2;
          margin: 0 auto 12px auto;
          backdrop-filter: blur(8px);
        }

        .hero-title {
          font-family: var(--font-serif);
          font-size: clamp(2.4rem, 4.8vw, 4.4rem);
          line-height: 1.1;
          font-weight: 400;
          margin: 0 auto 14px auto;
          color: #ffffff;
          letter-spacing: -0.02em;
          text-shadow: 0 4px 24px rgba(0, 0, 0, 0.75);
          text-align: center;
          width: 100%;
          max-width: 920px;
        }

        .hero-title-highlight {
          font-style: italic;
          color: #dfbe84;
          padding: 0 4px;
        }

        .hero-specs-row {
          display: flex;
          gap: 10px;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          margin: 0 auto 14px auto;
        }

        .hero-spec-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(7, 24, 19, 0.75);
          border: 1px solid rgba(212, 175, 55, 0.35);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          color: #dfbe84;
          font-weight: 600;
        }

        .spec-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #d4af37;
        }

        .hero-subtitle {
          font-size: clamp(0.94rem, 1.2vw, 1.12rem);
          line-height: 1.6;
          color: #d6e2dc;
          max-width: 720px;
          margin: 0 auto 18px auto;
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.75);
          text-align: center;
        }

        .hero-actions-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .hero-cta-btn {
          padding: 13px 30px;
          font-size: 0.84rem;
          min-height: 44px;
        }

        .desktop-only {
          display: flex;
        }
        p.desktop-only {
          display: block;
        }
        .mobile-only {
          display: none;
        }

        /* ================= MOBILE & TABLET MEDIA QUERIES ================= */
        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }

          .mobile-only {
            display: block !important;
          }

          .hero-responsive-section {
            min-height: 100dvh !important;
            height: 100dvh !important;
            max-height: 100dvh !important;
            padding: 72px 16px 24px 16px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
          }

          /* Mobile positions focusing on centered product & mountain */
          .hero-bg-estate { background-position: center 30% !important; }
          .hero-bg-honey { background-position: center 65% !important; }
          .hero-bg-cardamom { background-position: center 55% !important; }
          .hero-bg-tribal { background-position: center 30% !important; }

          /* Light gradient so honey jar and spice lineup shine through clearly */
          .hero-gradient-overlay {
            background: linear-gradient(
              to bottom,
              rgba(5, 18, 14, 0.82) 0%,
              rgba(5, 18, 14, 0.38) 32%,
              rgba(5, 18, 14, 0.05) 55%,
              rgba(5, 18, 14, 0.75) 100%
            ) !important;
          }

          .hero-content-container {
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            text-align: center !important;
            flex: 1 !important;
            margin: auto 0 !important;
            padding: 0 !important;
          }

          .hero-text-wrapper {
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
            margin: 0 auto !important;
          }

          .hero-slide-anim {
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
          }

          .hero-tag-pill {
            padding: 4px 11px !important;
            font-size: 0.63rem !important;
            margin: 0 auto 6px auto !important;
          }

          .hero-title {
            font-size: clamp(1.9rem, 7.5vw, 2.45rem) !important;
            line-height: 1.14 !important;
            margin-bottom: 8px !important;
            text-align: center !important;
            text-shadow: 0 4px 16px rgba(0, 0, 0, 0.6) !important;
            width: 100% !important;
          }

          .hero-subtitle.mobile-only {
            font-size: 0.86rem !important;
            line-height: 1.4 !important;
            color: #d6e2dc !important;
            margin: 0 auto 12px auto !important;
            max-width: 320px !important;
            text-align: center !important;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6) !important;
          }

          .hero-actions-row {
            margin: clamp(18px, 4vh, 32px) auto 0 auto !important;
            justify-content: center !important;
          }

          .hero-cta-primary {
            padding: 9px 20px !important;
            font-size: 0.76rem !important;
            min-height: 38px !important;
            width: auto !important;
          }
        }

        @media (max-width: 480px) {
          .hero-responsive-section {
            padding: 68px 14px 18px 14px !important;
          }
          .hero-title {
            font-size: 1.95rem !important;
          }
        }
      `}</style>
    </section>
  );
}
