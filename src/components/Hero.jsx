import React, { useState, useEffect } from 'react';
import { ArrowRight, Compass } from 'lucide-react';

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
      titleHighlight: "Sahyadri Hills",
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
      titleSuffix: " of Sahyadri",
      specs: ["8MM+ GREEN CARDAMOM", "TELLICHERRY TGSEB PEPPER", "HIGH-CURCUMIN TURMERIC"],
      subtitle: "Sun-cured 8mm+ green cardamom, Tellicherry black pepper, high-curcumin golden turmeric, and sun-dried chillies—handpicked by native planters from 4,200-ft high ranges.",
      mobileSubtitle: "Sun-cured green cardamom, Tellicherry pepper, golden turmeric & red chilli.",
      ctaPrimary: "Shop Spices",
      ctaSecondary: "Our Story",
      image: "/images/hero_cardamom.jpg",
      coordinates: "09°50' N · 77°09' E"
    },
    {
      id: "tribal",
      label: "Our Farmers",
      badge: "DIRECT TRIBAL CUSTODIANSHIP",
      titlePrefix: "Stewarded by ",
      titleHighlight: "3,200+ Families",
      titleSuffix: "",
      specs: ["FAIR TRADE COVENANT", "ZERO INTERMEDIARIES", "70% DIRECT VALUE RETURN"],
      subtitle: "Preserving sacred rainforest stewardship across Wayanad and Idukki. Fair trade value returned directly to native forest custodians, sustaining ancestral biodiversity.",
      mobileSubtitle: "Ethically gathered by 3,200+ native forest custodians with zero middlemen.",
      ctaPrimary: "Shop All",
      ctaSecondary: "Our Story",
      image: "/images/estate.jpg",
      coordinates: "11°38' N · 76°02' E"
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

          {/* Hallmark Provenance Pill */}
          <div className="hero-hallmark-pill">
            <span className="hero-hallmark-dot" />
            <span className="hero-hallmark-text">{slides[activeSlide].badge}</span>
            <span className="hero-hallmark-coord">{slides[activeSlide].coordinates}</span>
          </div>

          {/* Editorial Headline */}
          <h1 className="hero-editorial-heading">
            {slides[activeSlide].titlePrefix}
            <em className="hero-serif-highlight">
              {slides[activeSlide].titleHighlight}
            </em>
            {slides[activeSlide].titleSuffix}
          </h1>

          {/* Refined Specs Strips (Desktop) */}
          <div className="hero-specs-strip desktop-only">
            {slides[activeSlide].specs.map((spec, sIdx) => (
              <span key={sIdx} className="hero-spec-tag">
                {spec}
              </span>
            ))}
          </div>

          {/* Editorial Subtitle */}
          <p className="hero-editorial-desc desktop-only">
            {slides[activeSlide].subtitle}
          </p>
          <p className="hero-editorial-desc mobile-only">
            {slides[activeSlide].mobileSubtitle}
          </p>

          {/* Primary & Secondary Actions */}
          <div className="hero-actions-group">
            <button
              onClick={onExploreClick}
              className="hero-btn-primary"
            >
              <span>{slides[activeSlide].ctaPrimary}</span>
              <ArrowRight size={15} />
            </button>

            <button
              onClick={onStoryClick}
              className="hero-btn-secondary desktop-only"
            >
              <span>{slides[activeSlide].ctaSecondary}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom Provenance Ribbon (Editorial 2027 standard) ── */}
      <div className="hero-provenance-ribbon">
        <div className="container hero-ribbon-content">
          <div className="hero-ribbon-item">
            <Compass size={13} className="hero-ribbon-icon" />
            <span>4,200 FT ELEVATION · WAYANAD & IDUKKI BIOSPHERE</span>
          </div>
          <div className="hero-ribbon-sep desktop-only">·</div>
          <div className="hero-ribbon-item desktop-only">
            <span>100% NMR PURITY CERTIFIED WILD FOREST COMB</span>
          </div>
          <div className="hero-ribbon-sep desktop-only">·</div>
          <div className="hero-ribbon-item">
            <span>DIRECT FAIR-VALUE TRIBAL COVENANT</span>
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
            rgba(5, 18, 14, 0.76) 0%,
            rgba(6, 22, 17, 0.46) 42%,
            rgba(6, 22, 17, 0.88) 100%
          );
          pointer-events: none;
          z-index: 2;
        }

        .hero-warmth-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 40%, rgba(223, 190, 132, 0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 3;
        }

        .hero-layout-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          margin: auto;
        }

        .hero-editorial-card {
          max-width: 900px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 34px;
        }

        /* Hallmark Badge */
        .hero-hallmark-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(6, 20, 15, 0.85);
          border: 1px solid rgba(223, 190, 132, 0.4);
          padding: 5px 16px;
          border-radius: 30px;
          margin-bottom: 20px;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        }

        .hero-hallmark-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: #dfbe84;
        }

        .hero-hallmark-text {
          font-family: var(--font-sans);
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #f7eedf;
          font-weight: 700;
        }

        .hero-hallmark-coord {
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          color: rgba(223, 190, 132, 0.65);
          border-left: 1px solid rgba(223, 190, 132, 0.3);
          padding-left: 10px;
        }

        /* Editorial Title */
        .hero-editorial-heading {
          font-family: var(--font-serif);
          font-size: clamp(2.4rem, 4.6vw, 4.5rem);
          line-height: 1.08;
          font-weight: 400;
          color: #ffffff;
          letter-spacing: -0.02em;
          margin: 0 0 18px 0;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
        }

        .hero-serif-highlight {
          font-style: italic;
          color: #dfbe84;
          padding: 0 4px;
        }

        /* Specs Strip */
        .hero-specs-strip {
          display: flex;
          gap: 8px;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .hero-spec-tag {
          font-family: var(--font-sans);
          font-size: 0.66rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          color: #dfbe84;
          background: rgba(6, 20, 15, 0.65);
          border: 1px solid rgba(223, 190, 132, 0.25);
          padding: 3px 12px;
          border-radius: 14px;
        }

        /* Editorial Description */
        .hero-editorial-desc {
          font-family: var(--font-sans);
          font-size: clamp(0.92rem, 1.15vw, 1.08rem);
          line-height: 1.65;
          color: rgba(245, 235, 220, 0.88);
          max-width: 720px;
          margin: 0 auto 26px auto;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        /* Actions */
        .hero-actions-group {
          display: flex;
          gap: 14px;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }

        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #dfbe84 0%, #c49f57 100%);
          border: 1px solid #dfbe84;
          color: #071912;
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 13px 30px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25);
        }

        .hero-btn-primary:hover {
          background: linear-gradient(135deg, #ebd4a8 0%, #d1ae67 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(223, 190, 132, 0.32);
        }

        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(6, 20, 15, 0.65);
          border: 1px solid rgba(223, 190, 132, 0.4);
          backdrop-filter: blur(10px);
          color: #f7eedf;
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 13px 28px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-btn-secondary:hover {
          background: rgba(223, 190, 132, 0.15);
          border-color: #dfbe84;
          color: #ffffff;
          transform: translateY(-2px);
        }

        /* ── Slide Controller Bar ── */
        .hero-controls-bar {
          display: flex;
          align-items: center;
          gap: 22px;
          background: rgba(5, 18, 14, 0.78);
          border: 1px solid rgba(223, 190, 132, 0.22);
          border-radius: 36px;
          padding: 7px 18px;
          backdrop-filter: blur(12px);
        }

        .hero-counter-display {
          display: flex;
          align-items: baseline;
          gap: 3px;
          font-family: 'SFMono-Regular', Consolas, monospace;
          font-size: 0.72rem;
        }

        .hero-current-num {
          color: #dfbe84;
          font-weight: 700;
        }

        .hero-num-sep {
          color: rgba(223, 190, 132, 0.4);
        }

        .hero-total-num {
          color: rgba(245, 235, 220, 0.5);
        }

        .hero-slide-tabs-list {
          display: flex;
          gap: 16px;
        }

        .hero-slide-tab {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          padding: 4px 0;
          transition: opacity 0.2s ease;
          opacity: 0.65;
        }

        .hero-slide-tab:hover {
          opacity: 1;
        }

        .hero-slide-tab-active {
          opacity: 1;
        }

        .hero-tab-bar {
          width: 50px;
          height: 2px;
          background: rgba(255, 255, 255, 0.18);
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }

        .hero-tab-progress {
          display: block;
          height: 100%;
          width: 0%;
          background: #dfbe84;
        }

        @keyframes progressFill {
          from { width: 0%; }
          to   { width: 100%; }
        }

        .hero-slide-tab-active .hero-tab-progress {
          animation-name: progressFill;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }

        .hero-tab-title {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #ffffff;
          font-weight: 600;
        }

        .hero-slide-tab-active .hero-tab-title {
          color: #dfbe84;
        }

        .hero-arrow-btns {
          display: flex;
          gap: 4px;
          border-left: 1px solid rgba(223, 190, 132, 0.2);
          padding-left: 10px;
        }

        .hero-nav-arrow {
          background: none;
          border: none;
          color: rgba(223, 190, 132, 0.7);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.15s ease;
        }

        .hero-nav-arrow:hover {
          color: #dfbe84;
        }

        /* ── Bottom Provenance Ribbon ── */
        .hero-provenance-ribbon {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 10;
          background: rgba(5, 18, 14, 0.88);
          border-top: 1px solid rgba(223, 190, 132, 0.16);
          backdrop-filter: blur(8px);
          padding: 10px 0;
        }

        .hero-ribbon-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          font-size: 0.66rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(223, 190, 132, 0.75);
          font-weight: 600;
        }

        .hero-ribbon-item {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .hero-ribbon-icon {
          color: #dfbe84;
        }

        .hero-ribbon-sep {
          color: rgba(223, 190, 132, 0.3);
        }

        /* ── Desktop vs Mobile utility classes ── */
        .desktop-only { display: flex; }
        p.desktop-only { display: block; }
        .mobile-only { display: none; }

        /* ── Responsive Queries ── */
        @media (max-width: 860px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: block !important; }

          .hero-editorial-section {
            padding: 85px 16px 54px 16px;
          }

          .hero-controls-bar {
            padding: 6px 14px;
            gap: 12px;
          }

          .hero-tab-title {
            display: none;
          }

          .hero-tab-bar {
            width: 32px;
          }

          .hero-hallmark-coord {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .hero-editorial-heading {
            font-size: 2.1rem;
          }
          .hero-editorial-desc {
            font-size: 0.86rem;
            line-height: 1.45;
          }
          .hero-btn-primary {
            padding: 11px 22px;
            font-size: 0.78rem;
          }
          .hero-ribbon-content {
            font-size: 0.58rem;
            letter-spacing: 0.08em;
          }
        }
      `}</style>
    </section>
  );
}
