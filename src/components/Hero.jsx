import React, { useState, useEffect } from 'react';
import { ArrowRight, Compass, ShieldCheck, Leaf, Sparkles } from 'lucide-react';

export default function Hero({ onExploreClick, onStoryClick }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const SLIDE_DURATION = 6000; // 6s per slide

  const slides = [
    {
      id: "estate",
      label: "Estates",
      badge: "BIODYNAMIC HERITAGE ESTATE",
      titlePrefix: "From the ",
      titleHighlight: "Sahydri Hills",
      titleSuffix: " to Your Kitchen",
      specs: ["4,200 FT ELEVATION", "100% RAINFOREST TERROIR", "INDIGENOUS ETHICS"],
      subtitle: "Authentic single-origin heritage spices and raw forest honey, foraged by native tribal honey hunters from the mist-shrouded cloud forests of Kerala's Western Ghats.",
      mobileSubtitle: "Single-origin spices & raw wild forest honey from Kerala's misted Western Ghats.",
      ctaPrimary: "Shop Spices",
      ctaSecondary: "Our Story",
      image: "/images/hero.jpg",
      coordinates: "11°40' N · 76°08' E"
    },
    {
      id: "honey",
      label: "Wild Honey",
      badge: "RAW FOREST COMB NECTAR",
      titlePrefix: "Raw Forest Honey from ",
      titleHighlight: "Untamed Groves",
      titleSuffix: "",
      specs: ["NMR LAB CERTIFIED", "100% UNHEATED & RAW", "WILD FORAGED COMB"],
      subtitle: "Unheated, unfiltered multi-flora nectar gathered under starlight by Kadar tribal honey hunters from 150-foot ancient rainforest canopies. Living enzymes, pollen, and wild flora.",
      mobileSubtitle: "100% unheated, raw multi-flora nectar from wild forest canopies.",
      ctaPrimary: "Shop Honey",
      ctaSecondary: "Purity Labs",
      image: "/images/hero_honey.jpg",
      coordinates: "10°18' N · 76°58' E"
    },
    {
      id: "cardamom",
      label: "Spices",
      badge: "SINGLE-ORIGIN MALABAR SPICES",
      titlePrefix: "Single-Origin ",
      titleHighlight: "Heritage Spices",
      titleSuffix: " of Sahydri",
      specs: ["8MM+ GREEN CARDAMOM", "TELLICHERRY TGSEB PEPPER", "HIGH-CURCUMIN TURMERIC"],
      subtitle: "Sun-cured 8mm+ green cardamom, Tellicherry black pepper, high-curcumin golden turmeric, and sun-dried chillies—handpicked by native planters from 4,200-ft high ranges.",
      mobileSubtitle: "Sun-cured green cardamom, Tellicherry pepper, golden turmeric & red chilli.",
      ctaPrimary: "Shop Spices",
      ctaSecondary: "Our Story",
      image: "/images/hero_cardamom.jpg",
      coordinates: "09°50' N · 77°09' E"
    }
  ];

  // Continuous auto-advancing slideshow with smooth progress
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((curr) => (curr + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setActiveSlide((curr) => (curr - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveSlide((curr) => (curr + 1) % slides.length);
  };

  return (
    <section
      id="hero-section"
      className="hero-editorial-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Background Imagery Layers with Silky Crossfade ── */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`hero-bg-layer hero-bg-${slide.id}`}
          style={{
            backgroundImage: `url("${slide.image}")`,
            opacity: activeSlide === idx ? 1 : 0,
            transform: activeSlide === idx ? 'scale(1.02)' : 'scale(1.06)'
          }}
        />
      ))}

      {/* ── Tonal Overlays (Warm Dark Botanical Gradient) ── */}
      <div className="hero-darken-gradient" />
      <div className="hero-warmth-vignette" />

      {/* ── Main Editorial Content ── */}
      <div className="container hero-layout-container">
        <div className="hero-editorial-card">

          {/* Golden Eyebrow / Kicker */}
          <span className="hero-eyebrow">
            {slides[activeSlide].badge}
          </span>

          {/* Editorial Headline */}
          <h1 className="hero-editorial-heading">
            {slides[activeSlide].titlePrefix}
            <em className="hero-serif-highlight">
              {slides[activeSlide].titleHighlight}
            </em>
            {slides[activeSlide].titleSuffix}
          </h1>

          {/* Clear Subtitle */}
          <p className="hero-editorial-desc">
            {slides[activeSlide].mobileSubtitle}
          </p>

          {/* Primary CTA */}
          <div className="hero-actions-group">
            <button
              onClick={onExploreClick}
              className="hero-btn-primary"
            >
              <span>{slides[activeSlide].ctaPrimary}</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Hero Editorial Section ── */
        .hero-editorial-section {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #ffffff;
          padding: 100px 20px 70px 20px;
          overflow: hidden;
          background-color: #061711;
        }

        .hero-bg-layer {
          position: absolute;
          inset: 0;
          background-size: cover;
          transition: opacity 1.1s cubic-bezier(0.25, 1, 0.5, 1), transform 8s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1;
          pointer-events: none;
        }

        .hero-bg-estate { background-position: center 38%; }
        .hero-bg-honey { background-position: center 58%; }
        .hero-bg-cardamom { background-position: center 54%; }
        .hero-bg-tribal { background-position: center 40%; }

        .hero-darken-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(5, 18, 14, 0.72) 0%,
            rgba(6, 22, 17, 0.38) 45%,
            rgba(6, 22, 17, 0.82) 100%
          );
          pointer-events: none;
          z-index: 2;
        }

        .hero-warmth-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 40%, rgba(223, 190, 132, 0.06) 0%, transparent 70%);
          pointer-events: none;
          z-index: 3;
        }

        .hero-layout-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          margin: auto;
        }

        .hero-editorial-card {
          max-width: 820px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 10px;
        }

        /* Golden Eyebrow / Kicker */
        .hero-eyebrow {
          display: inline-block;
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #dfbe84;
          margin-bottom: 14px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
        }

        /* Editorial Title */
        .hero-editorial-heading {
          font-family: var(--font-serif);
          font-size: clamp(2.6rem, 5.2vw, 4.4rem);
          line-height: 1.12;
          font-weight: 400;
          color: #ffffff;
          letter-spacing: -0.015em;
          margin: 0 0 18px 0;
          text-shadow: 0 4px 24px rgba(0, 0, 0, 0.7);
        }

        .hero-serif-highlight {
          font-style: italic;
          color: #dfbe84;
          padding: 0 4px;
        }

        /* Editorial Description */
        .hero-editorial-desc {
          font-family: var(--font-sans);
          font-size: clamp(1.05rem, 1.45vw, 1.22rem);
          line-height: 1.6;
          color: rgba(247, 238, 223, 0.94);
          max-width: 660px;
          margin: 0 auto 30px auto;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.65);
        }

        /* Actions */
        .hero-actions-group {
          display: flex;
          gap: 14px;
          align-items: center;
          justify-content: center;
        }

        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, var(--color-gold-400) 0%, var(--color-gold-500) 100%);
          border: 1px solid var(--color-gold-400);
          color: var(--color-forest-950);
          font-family: var(--font-sans);
          font-size: 0.92rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 15px 36px;
          min-height: 48px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-normal);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
        }

        .hero-btn-primary:hover {
          background: linear-gradient(135deg, var(--color-gold-300) 0%, var(--color-gold-400) 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(223, 190, 132, 0.42);
        }

        .hero-btn-primary:active {
          transform: translateY(0) scale(0.98);
        }

        .hero-btn-primary:focus-visible {
          outline: 2px solid var(--color-gold-300);
          outline-offset: 3px;
        }

        /* ── Responsive Queries for Mobile & Tablet ── */
        @media (max-width: 768px) {
          .hero-editorial-section {
            padding: 95px 20px 50px 20px;
          }

          .hero-eyebrow {
            font-size: 0.76rem;
            letter-spacing: 0.14em;
            margin-bottom: 12px;
          }

          .hero-editorial-heading {
            font-size: clamp(2.35rem, 9.4vw, 3.1rem);
            line-height: 1.15;
            margin-bottom: 16px;
          }

          .hero-editorial-desc {
            font-size: 1.05rem;
            line-height: 1.54;
            max-width: 94%;
            margin-bottom: 26px;
            color: rgba(247, 238, 223, 0.96);
          }

          .hero-btn-primary {
            padding: 14px 34px;
            font-size: 0.88rem;
          }
        }

        @media (max-width: 480px) {
          .hero-editorial-section {
            padding: 90px 18px 45px 18px;
          }

          .hero-eyebrow {
            font-size: 0.74rem;
            letter-spacing: 0.12em;
            margin-bottom: 10px;
          }

          .hero-editorial-heading {
            font-size: clamp(2.25rem, 10vw, 2.85rem);
            line-height: 1.16;
            margin-bottom: 14px;
          }

          .hero-editorial-desc {
            font-size: 1.02rem;
            line-height: 1.5;
            margin-bottom: 24px;
            max-width: 96%;
          }

          .hero-btn-primary {
            padding: 14px 32px;
            font-size: 0.86rem;
            letter-spacing: 0.08em;
          }
        }
      `}</style>
    </section>
  );
}
