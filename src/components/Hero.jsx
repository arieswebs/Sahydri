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

          {/* ── Refined Editorial Provenance Feature Panel ── */}
          <div className="hero-provenance-panel" role="region" aria-label="Terroir and harvest hallmarks">
            <div className="hero-provenance-item">
              <div className="hero-prov-icon-box" aria-hidden="true">
                <Compass size={14} color="#dfbe84" strokeWidth={1.9} />
              </div>
              <div className="hero-prov-text-block">
                <span className="hero-prov-kicker">4,200 FT ELEVATION</span>
                <span className="hero-prov-desc">Wayanad &amp; Idukki Biosphere</span>
              </div>
            </div>

            <div className="hero-provenance-item">
              <div className="hero-prov-icon-box" aria-hidden="true">
                <ShieldCheck size={14} color="#dfbe84" strokeWidth={1.9} />
              </div>
              <div className="hero-prov-text-block">
                <span className="hero-prov-kicker">100% NMR PURITY CERTIFIED</span>
                <span className="hero-prov-desc">Wild Forest Comb Honey</span>
              </div>
            </div>

            <div className="hero-provenance-item">
              <div className="hero-prov-icon-box" aria-hidden="true">
                <Leaf size={14} color="#dfbe84" strokeWidth={1.9} />
              </div>
              <div className="hero-prov-text-block">
                <span className="hero-prov-kicker">DIRECT FAIR-VALUE</span>
                <span className="hero-prov-desc">Harvest &amp; Tribal Covenant</span>
              </div>
            </div>

            <div className="hero-provenance-item">
              <div className="hero-prov-icon-box" aria-hidden="true">
                <Sparkles size={14} color="#dfbe84" strokeWidth={1.9} />
              </div>
              <div className="hero-prov-text-block">
                <span className="hero-prov-kicker">100% RAW &amp; UNHEATED</span>
                <span className="hero-prov-desc">Living Enzymes &amp; Wild Pollen</span>
              </div>
            </div>
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

        /* ── Refined Editorial Provenance Feature Panel ── */
        .hero-provenance-panel {
          margin-top: clamp(26px, 3.8vh, 44px);
          margin-bottom: 8px;
          width: 100%;
          max-width: 980px;
          box-sizing: border-box;
          background: linear-gradient(
            165deg,
            rgba(9, 28, 21, 0.82) 0%,
            rgba(5, 18, 13, 0.90) 100%
          );
          border: 1px solid rgba(223, 190, 132, 0.22);
          border-radius: 8px;
          padding: 13px 22px;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow:
            inset 0 1px 0 rgba(223, 190, 132, 0.14),
            0 12px 36px rgba(0, 0, 0, 0.38);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          align-items: center;
          gap: 16px;
        }

        .hero-provenance-item {
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: left;
          min-width: 0;
          position: relative;
        }

        /* Desktop Column Dividers */
        .hero-provenance-item:not(:last-child)::after {
          content: '';
          position: absolute;
          right: -8px;
          top: 15%;
          height: 70%;
          width: 1px;
          background: rgba(223, 190, 132, 0.16);
        }

        .hero-prov-icon-box {
          width: 28px;
          height: 28px;
          border-radius: 5px;
          background: rgba(223, 190, 132, 0.08);
          border: 1px solid rgba(223, 190, 132, 0.24);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .hero-provenance-item:hover .hero-prov-icon-box {
          background: rgba(223, 190, 132, 0.16);
          border-color: rgba(223, 190, 132, 0.45);
        }

        .hero-prov-text-block {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
          min-width: 0;
        }

        .hero-prov-kicker {
          font-family: var(--font-sans);
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.09em;
          color: #dfbe84;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 2px;
        }

        .hero-prov-desc {
          font-family: var(--font-sans);
          font-size: 0.76rem;
          font-weight: 500;
          color: rgba(247, 238, 223, 0.92);
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Tablet Viewport (768px – 1024px) ── */
        @media (max-width: 1024px) and (min-width: 769px) {
          .hero-provenance-panel {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px 24px;
            max-width: 660px;
            padding: 14px 20px;
          }
          .hero-provenance-item:not(:last-child)::after {
            display: none;
          }
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
            padding: 85px 16px 48px 16px;
          }
        }

        @media (max-width: 768px) {
          .hero-provenance-panel {
            display: flex;
            flex-direction: column;
            gap: 0;
            width: 100%;
            max-width: 360px;
            margin-top: 24px;
            margin-bottom: 8px;
            padding: 10px 16px;
            border-radius: 6px;
            background: linear-gradient(
              170deg,
              rgba(8, 26, 19, 0.88) 0%,
              rgba(5, 18, 14, 0.94) 100%
            );
            border: 1px solid rgba(223, 190, 132, 0.22);
            box-shadow:
              inset 0 1px 0 rgba(223, 190, 132, 0.12),
              0 8px 24px rgba(0, 0, 0, 0.42);
          }

          .hero-provenance-item {
            padding: 9px 0;
            width: 100%;
            gap: 12px;
            border-bottom: 1px solid rgba(223, 190, 132, 0.1);
          }

          .hero-provenance-item:not(:last-child)::after {
            display: none;
          }

          .hero-provenance-item:first-child {
            padding-top: 2px;
          }

          .hero-provenance-item:last-child {
            padding-bottom: 2px;
            border-bottom: none;
          }

          .hero-prov-icon-box {
            width: 26px;
            height: 26px;
            border-radius: 4px;
          }

          .hero-prov-kicker {
            font-size: 0.62rem;
            letter-spacing: 0.08em;
          }

          .hero-prov-desc {
            font-size: 0.76rem;
            white-space: normal; /* Readable wrapping on narrow mobile */
            line-height: 1.25;
          }
        }

        @media (max-width: 480px) {
          .hero-editorial-heading {
            font-size: clamp(1.65rem, 7.5vw, 2.1rem);
            margin-bottom: 12px;
          }
          .hero-editorial-desc {
            font-size: 0.84rem;
            line-height: 1.45;
            margin-bottom: 18px;
          }
          .hero-actions-group {
            gap: 10px;
          }
          .hero-btn-primary {
            padding: 10px 20px;
            font-size: 0.76rem;
          }
          .hero-btn-secondary {
            padding: 10px 18px;
            font-size: 0.76rem;
          }
        }

        /* ── Specific Optimizations for iPhone SE (<= 375px) ── */
        @media (max-width: 375px) {
          .hero-provenance-panel {
            max-width: 335px;
            padding: 9px 12px;
            margin-top: 18px;
          }
          .hero-provenance-item {
            padding: 7px 0;
            gap: 10px;
          }
          .hero-prov-icon-box {
            width: 24px;
            height: 24px;
          }
          .hero-prov-kicker {
            font-size: 0.60rem;
          }
          .hero-prov-desc {
            font-size: 0.72rem;
          }
        }

        /* ── Ultra-compact (<= 330px) ── */
        @media (max-width: 330px) {
          .hero-provenance-panel {
            max-width: 290px;
            padding: 8px 10px;
          }
          .hero-prov-kicker {
            font-size: 0.58rem;
          }
          .hero-prov-desc {
            font-size: 0.68rem;
          }
        }
      `}</style>
    </section>
  );
}
