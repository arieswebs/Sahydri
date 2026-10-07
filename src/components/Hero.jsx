import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Compass, ShieldCheck, Sparkles } from 'lucide-react';

export default function Hero({ onExploreClick, onStoryClick }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const SLIDE_DURATION = 8000; // 8 seconds for a calm, serene classic experience

  const slides = [
    {
      id: "estate",
      eyebrow: "ESTABLISHED IN KERALA • 4,200 FT ELEVATION",
      titlePrefix: "From the ",
      titleHighlight: "Sahyadri Hills",
      titleSuffix: " to Your Kitchen",
      subtitle: "Authentic single-origin heritage spices and raw wild forest honey, hand-foraged by indigenous tribal communities from the ancient mist-shrouded rainforests of Kerala's Western Ghats.",
      ctaPrimary: "Explore Collection",
      ctaSecondary: "Discover Our Story",
      image: "/images/hero.jpg",
      chapterName: "Mist Terroir"
    },
    {
      id: "honey",
      eyebrow: "100% UNHEATED FOREST NECTAR • NMR LAB VERIFIED",
      titlePrefix: "Raw Forest Honey from ",
      titleHighlight: "Untamed Groves",
      titleSuffix: "",
      subtitle: "Unheated, unfiltered multi-flora nectar gathered under starlight by Kadar tribal honey hunters from 150-ft ancient rainforest trees. Rich in living enzymes, bee pollen, and wild medicinal flora.",
      ctaPrimary: "Taste Wild Honey",
      ctaSecondary: "View Purity Lab NMR",
      image: "/images/hero_honey.jpg",
      chapterName: "Wild Honey"
    },
    {
      id: "cardamom",
      eyebrow: "SINGLE-ESTATE SPICES • COLD STONE POUNDED",
      titlePrefix: "Single-Origin ",
      titleHighlight: "Heritage Spices",
      titleSuffix: " of Sahyadri",
      subtitle: "Sun-cured 8mm+ green cardamom, Tellicherry black pepper, high-curcumin golden turmeric, and sun-dried red chillies—handpicked by native farmers from 4,200 ft mist-shrouded high ranges.",
      ctaPrimary: "Shop Heritage Spices",
      ctaSecondary: "View Stone Milling",
      image: "/images/hero_cardamom.jpg",
      chapterName: "Sun-Cured Spices"
    },
    {
      id: "tribal",
      eyebrow: "INDIGENOUS STEWARDSHIP • FAIR TRADE COVENANT",
      titlePrefix: "Stewarded by ",
      titleHighlight: "3,200+ Families",
      titleSuffix: " in Wayanad",
      subtitle: "Preserving centuries of sacred forest stewardship across Wayanad and Idukki. Fair trade value returned directly to indigenous tribal communities, ensuring regenerative biodiversity.",
      ctaPrimary: "Explore the Harvest",
      ctaSecondary: "Read Chronicles",
      image: "/images/estate.jpg",
      chapterName: "Tribal Guild"
    }
  ];

  // Serene, gentle auto-advance (pauses on hover)
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
    <>
      <section
        id="hero-section"
        className="classic-hero-section"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Cinematic Layered Backgrounds with Silky 1.6s Crossfade */}
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`classic-hero-bg ${activeSlide === idx ? 'active' : ''}`}
            style={{
              backgroundImage: `url("${slide.image}")`
            }}
          />
        ))}

        {/* Deep Atmospheric Editorial Overlays */}
        <div className="classic-hero-vignette" />
        <div className="classic-hero-mist" />

        {/* Content Container */}
        <div className="container classic-hero-container">
          <div className="classic-hero-text">
            {/* Elegant Classical Eyebrow */}
            <div className="classic-hero-eyebrow">
              <span className="eyebrow-line left" />
              <span className="eyebrow-text">{slides[activeSlide].eyebrow}</span>
              <span className="eyebrow-line right" />
            </div>

            {/* Regal Classic Headline */}
            <h1 className="classic-hero-title">
              {slides[activeSlide].titlePrefix}
              <em className="classic-hero-title-italic">
                {slides[activeSlide].titleHighlight}
              </em>
              {slides[activeSlide].titleSuffix}
            </h1>

            {/* Classic Poetic Subtitle */}
            <p className="classic-hero-subtitle">
              {slides[activeSlide].subtitle}
            </p>

            {/* Refined Luxury Call-to-Actions */}
            <div className="classic-hero-actions">
              <button
                onClick={onExploreClick}
                className="btn-classic-primary"
              >
                <span>{slides[activeSlide].ctaPrimary}</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={onStoryClick}
                className="btn-classic-secondary"
              >
                <span>{slides[activeSlide].ctaSecondary}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Understated Classic Chapter Selector */}
        <div className="classic-hero-nav-bar">
          <button
            onClick={handlePrev}
            className="classic-nav-arrow"
            aria-label="Previous Chapter"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="classic-chapter-tabs">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveSlide(idx)}
                className={`classic-chapter-tab ${activeSlide === idx ? 'active' : ''}`}
              >
                <span className="tab-idx">0{idx + 1}</span>
                <span className="tab-name">{s.chapterName}</span>
                <span className="tab-indicator" />
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="classic-nav-arrow"
            aria-label="Next Chapter"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* Classic Trust & Heritage Pillars Ribbon */}
      <section className="classic-heritage-ribbon">
        <div className="container">
          <div className="heritage-ribbon-grid">
            <div className="ribbon-card">
              <div className="ribbon-icon">✦</div>
              <div className="ribbon-content">
                <h3 className="ribbon-heading">4,200 Ft Terroir</h3>
                <p className="ribbon-text">Single-origin estates in misted Wayanad & Idukki cloud forests.</p>
              </div>
            </div>

            <div className="ribbon-card">
              <div className="ribbon-icon">✦</div>
              <div className="ribbon-content">
                <h3 className="ribbon-heading">100% Raw Forest Honey</h3>
                <p className="ribbon-text">NMR lab-verified, unheated multi-flora nectar from wild cliff hives.</p>
              </div>
            </div>

            <div className="ribbon-card">
              <div className="ribbon-icon">✦</div>
              <div className="ribbon-content">
                <h3 className="ribbon-heading">Cold Stone Pounded</h3>
                <p className="ribbon-text">Slow heritage granite milling below 38°C preserving volatile oils.</p>
              </div>
            </div>

            <div className="ribbon-card">
              <div className="ribbon-icon">✦</div>
              <div className="ribbon-content">
                <h3 className="ribbon-heading">Direct Tribal Covenant</h3>
                <p className="ribbon-text">70%+ harvest value returned to 3,200+ native forest custodians.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* ================= CLASSIC HERO SECTION ================= */
        .classic-hero-section {
          position: relative;
          min-height: 92vh;
          min-height: 92dvh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #ffffff;
          padding: 120px 24px 70px 24px;
          overflow: hidden;
          background-color: #061712;
        }

        .classic-hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center 42%;
          opacity: 0;
          transform: scale(1.03);
          transition: opacity 1.6s cubic-bezier(0.22, 1, 0.36, 1), transform 8s ease-out;
          z-index: 1;
          pointer-events: none;
        }

        .classic-hero-bg.active {
          opacity: 1;
          transform: scale(1);
        }

        .classic-hero-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(5, 18, 14, 0.72) 0%,
            rgba(5, 18, 14, 0.45) 35%,
            rgba(5, 18, 14, 0.85) 100%
          );
          z-index: 2;
          pointer-events: none;
        }

        .classic-hero-mist {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 45%, rgba(212, 175, 55, 0.08) 0%, transparent 65%);
          z-index: 3;
          pointer-events: none;
        }

        .classic-hero-container {
          position: relative;
          z-index: 10;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin: 0 auto;
        }

        .classic-hero-text {
          max-width: 920px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        /* Classical Eyebrow with hairline accents */
        .classic-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 22px;
        }

        .eyebrow-line {
          width: 36px;
          height: 1px;
          background: rgba(223, 190, 132, 0.6);
        }

        .eyebrow-text {
          font-family: var(--font-sans);
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #dfbe84;
        }

        /* Regal Classic Serif Headline */
        .classic-hero-title {
          font-family: var(--font-serif);
          font-size: clamp(2.4rem, 5.2vw, 4.4rem);
          line-height: 1.12;
          font-weight: 400;
          letter-spacing: -0.015em;
          color: #ffffff;
          margin-bottom: 20px;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
        }

        .classic-hero-title-italic {
          font-style: italic;
          color: #f0d5a3;
          padding: 0 6px;
        }

        /* Classic Editorial Subtitle */
        .classic-hero-subtitle {
          font-size: clamp(0.95rem, 1.3vw, 1.12rem);
          line-height: 1.7;
          color: #e2ede8;
          max-width: 700px;
          margin: 0 auto 34px auto;
          font-weight: 300;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7);
        }

        /* Refined Classic Buttons */
        .classic-hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-classic-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: #dfbe84;
          color: #081d16;
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 14px 32px;
          border-radius: 2px;
          border: 1px solid #dfbe84;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
        }

        .btn-classic-primary:hover {
          background-color: #ebd3a7;
          border-color: #ebd3a7;
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(223, 190, 132, 0.25);
        }

        .btn-classic-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(8, 29, 22, 0.55);
          color: #f7f3e8;
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 14px 30px;
          border-radius: 2px;
          border: 1px solid rgba(223, 190, 132, 0.45);
          backdrop-filter: blur(8px);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-classic-secondary:hover {
          background: rgba(223, 190, 132, 0.15);
          border-color: #dfbe84;
          color: #ffffff;
          transform: translateY(-2px);
        }

        /* Classic Chapter Selector Strip at Bottom of Hero */
        .classic-hero-nav-bar {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 15;
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(7, 24, 19, 0.75);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(223, 190, 132, 0.22);
          border-radius: 40px;
          padding: 6px 14px;
          max-width: 90vw;
        }

        .classic-nav-arrow {
          background: transparent;
          border: none;
          color: #dfbe84;
          cursor: pointer;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .classic-nav-arrow:hover {
          background: rgba(223, 190, 132, 0.15);
          color: #ffffff;
        }

        .classic-chapter-tabs {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .classic-chapter-tab {
          display: flex;
          align-items: center;
          gap: 7px;
          background: transparent;
          border: none;
          padding: 6px 12px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
        }

        .tab-idx {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #9ea8a3;
          transition: color 0.25s ease;
        }

        .tab-name {
          font-size: 0.72rem;
          font-family: var(--font-sans);
          letter-spacing: 0.06em;
          color: #c4d0ca;
          font-weight: 500;
          transition: color 0.25s ease;
        }

        .classic-chapter-tab.active {
          background: rgba(223, 190, 132, 0.18);
        }

        .classic-chapter-tab.active .tab-idx {
          color: #dfbe84;
        }

        .classic-chapter-tab.active .tab-name {
          color: #ffffff;
          font-weight: 600;
        }

        /* ================= CLASSIC HERITAGE RIBBON ================= */
        .classic-heritage-ribbon {
          background-color: #f7f3ea;
          border-top: 1px solid #dfbe84;
          border-bottom: 1px solid rgba(14, 43, 33, 0.08);
          padding: 34px 0;
          position: relative;
          z-index: 5;
        }

        .heritage-ribbon-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .ribbon-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 0 12px;
          position: relative;
        }

        .ribbon-card:not(:last-child)::after {
          content: '';
          position: absolute;
          right: -12px;
          top: 15%;
          height: 70%;
          width: 1px;
          background: rgba(14, 43, 33, 0.12);
        }

        .ribbon-icon {
          color: #b38736;
          font-size: 0.95rem;
          line-height: 1;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .ribbon-heading {
          font-family: var(--font-serif);
          font-size: 1rem;
          font-weight: 600;
          color: #0b221a;
          margin-bottom: 4px;
          letter-spacing: -0.01em;
        }

        .ribbon-text {
          font-size: 0.8rem;
          line-height: 1.5;
          color: #645e52;
          font-weight: 400;
        }

        /* ================= RESPONSIVE ================= */
        @media (max-width: 1024px) {
          .heritage-ribbon-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 28px 16px;
          }
          .ribbon-card:nth-child(2)::after {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .classic-hero-section {
            min-height: 85vh;
            padding: 100px 16px 80px 16px;
          }

          .classic-hero-eyebrow {
            gap: 10px;
            margin-bottom: 16px;
          }

          .eyebrow-line {
            width: 20px;
          }

          .eyebrow-text {
            font-size: 0.65rem;
            letter-spacing: 0.18em;
          }

          .classic-hero-title {
            font-size: 2.1rem;
            margin-bottom: 14px;
          }

          .classic-hero-subtitle {
            font-size: 0.88rem;
            line-height: 1.55;
            margin-bottom: 26px;
          }

          .classic-hero-actions {
            gap: 12px;
          }

          .btn-classic-primary, .btn-classic-secondary {
            padding: 12px 24px;
            font-size: 0.76rem;
            width: 100%;
            max-width: 280px;
            justify-content: center;
          }

          .classic-chapter-tabs .tab-name {
            display: none;
          }

          .classic-heritage-ribbon {
            padding: 28px 0;
          }

          .heritage-ribbon-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .ribbon-card:not(:last-child)::after {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
