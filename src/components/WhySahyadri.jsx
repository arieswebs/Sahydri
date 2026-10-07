import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, MapPin, Sparkles } from 'lucide-react';

export default function WhySahyadri() {
  const [activeStory, setActiveStory] = useState(0);

  const stories = [
    {
      id: "canopy",
      chapterNum: "01",
      chapter: "Chapter I",
      tag: "THE SACRED CANOPY",
      title: "Nurtured by Monsoons, Never by Chemistry",
      subtitle: "Zero synthetic fertilizers. Zero chemical sprays. 100% biodynamic rainforest terroir.",
      image: "/images/estate.jpg",
      location: "Wayanad Rain Reserve • 4,200 Ft",
      narrative: "Deep in the misted cloud forests of the Western Ghats, nature flourishes in an ancient equilibrium. Our spices grow wild beneath a multi-tiered rainforest canopy of silver oak and wild jackfruit, nurtured solely by southwest monsoon torrents and volcanic humus—certified 0.0% pesticide residues across 220+ NABL lab screens.",
      stats: [
        { label: "Pesticides", value: "0.0%" },
        { label: "Canopy Shade", value: "100% Wild" },
        { label: "Biosphere Age", value: "150M+ Yrs" }
      ],
      quote: "The soil here carries the deep aroma of crushed cardamom pods following the first southwest monsoon shower."
    },
    {
      id: "grinding",
      chapterNum: "02",
      chapter: "Chapter II",
      tag: "THE GRANITE CHAKKIS",
      title: "The Slow Rhythm of Cold Stone Pounding",
      subtitle: "Traditional granite mortars rotating under 38°C to guard delicate volatile oils.",
      image: "/images/cardamom.jpg",
      location: "Heritage Milled • Slow Batch Curing",
      narrative: "Industrial steel hammer-mills blaze above 85°C, burning away volatile terpenes and aromatic soul. At Sahyadri, heritage granite chakkis turn slowly at 40 RPM, never exceeding 38°C—locking in up to 40% more volatile essential oils, natural curcumin, and therapeutic pungency.",
      stats: [
        { label: "Milling Heat", value: "< 38°C" },
        { label: "Volatile Oils", value: "+40%" },
        { label: "Grinding Method", value: "Granite Stone" }
      ],
      quote: "When you open the seal, the fragrant volatile oils rise immediately because they were never scorched by machine heat."
    },
    {
      id: "honey",
      chapterNum: "03",
      chapter: "Chapter III",
      tag: "THE LIQUID GOLD",
      title: "Raw Forest Nectar, Unheated & Untamed",
      subtitle: "Gathered from high cliff cavities. 100% unpasteurized with live mountain pollen.",
      image: "/images/honey.jpg",
      location: "Deep Forest Groves • Nilgiri & Sahyadri Foothills",
      narrative: "Commercial honeys are boiled, ultra-filtered, and adulterated with artificial syrups. Our Kadar tribal honey hunters gather wild combs under starlight from cliff escarpments. Filtered gently through cotton muslin at room temperature, our raw nectar retains live enzymes, wild medicinal pollens, and 0% added sugar.",
      stats: [
        { label: "Added Sugar", value: "0.0%" },
        { label: "NMR Tested", value: "100% Pure" },
        { label: "Pasteurization", value: "Zero Heat" }
      ],
      quote: "True wild forest honey crystallizes naturally across cooler seasons because it carries living raw nectar."
    },
    {
      id: "tribal",
      chapterNum: "04",
      chapter: "Chapter IV",
      tag: "THE LIVING GUILD",
      title: "A Sovereign Covenant with Tribal Stewards",
      subtitle: "Returning over 70% of harvest value directly to indigenous forest custodians.",
      image: "/images/pepper.jpg",
      location: "Fair-Trade Alliance • 3,200+ Indigenous Families",
      narrative: "Those who preserve the sacred Western Ghats must be its primary beneficiaries. We bypass auction cartels entirely, returning over 70% of every harvest directly to 3,200+ indigenous families across Wayanad and Idukki—providing advance purchase security and funding forest tribal schools.",
      stats: [
        { label: "To Growers", value: "70%+" },
        { label: "Tribal Families", value: "3,200+" },
        { label: "Middlemen", value: "Zero" }
      ],
      quote: "We share harvests with families who have stewarded these wild pepper vines across five unbroken centuries."
    }
  ];

  const current = stories[activeStory];

  const handlePrev = () => {
    setActiveStory((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const handleNext = () => {
    setActiveStory((prev) => (prev + 1) % stories.length);
  };

  return (
    <section id="story" className="classic-story-section">
      <div className="container">
        {/* Editorial Section Header */}
        <div className="classic-story-header">
          <span className="classic-section-eyebrow">— THE CHRONICLES OF PURITY —</span>
          <h2 className="classic-story-main-title">How Pure Living is Born in the Ghats</h2>
          <p className="classic-story-main-desc">
            Four ancient commitments that separate heritage bio-dynamic cultivation from industrial commerce.
          </p>
        </div>

        {/* Elegant Chapter Selector Tabs */}
        <div className="classic-chapter-nav">
          {stories.map((story, idx) => {
            const isSelected = activeStory === idx;
            return (
              <button
                key={story.id}
                onClick={() => setActiveStory(idx)}
                className={`classic-chapter-btn ${isSelected ? 'active' : ''}`}
              >
                <span className="ch-num">{story.chapterNum}</span>
                <span className="ch-title">{story.tag}</span>
              </button>
            );
          })}
        </div>

        {/* Classic Editorial Monograph Card */}
        <div className="classic-monograph-card">
          <div className="monograph-grid">
            {/* Left: Atmospheric Photography with Archival Vignette */}
            <div className="monograph-img-col">
              <div className="monograph-img-wrapper">
                <img
                  src={current.image}
                  alt={current.title}
                  className="monograph-img"
                />
                <div className="monograph-overlay">
                  <div className="monograph-location-tag">
                    <MapPin size={12} color="#dfbe84" />
                    <span>{current.location}</span>
                  </div>
                  <blockquote className="monograph-quote">
                    "{current.quote}"
                  </blockquote>
                </div>
              </div>
            </div>

            {/* Right: Rich Narrative & Provenance Metrics */}
            <div className="monograph-content-col">
              <div className="monograph-badge-row">
                <span className="monograph-chapter-tag">{current.chapter} • {current.tag}</span>
                <span className="monograph-page-idx">{activeStory + 1} of {stories.length}</span>
              </div>

              <h3 className="monograph-headline">{current.title}</h3>
              <p className="monograph-subheadline">{current.subtitle}</p>

              <p className="monograph-narrative">{current.narrative}</p>

              {/* Purity Stats Strip */}
              <div className="monograph-stats-strip">
                {current.stats.map((stat, sIdx) => (
                  <div key={sIdx} className="monograph-stat-box">
                    <div className="monograph-stat-val">{stat.value}</div>
                    <div className="monograph-stat-lbl">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Prev / Next Controls */}
              <div className="monograph-footer-controls">
                <div className="monograph-btn-group">
                  <button
                    onClick={handlePrev}
                    className="monograph-arrow-btn"
                    aria-label="Previous Chapter"
                  >
                    <ArrowLeft size={16} />
                    <span>Previous</span>
                  </button>
                  <button
                    onClick={handleNext}
                    className="monograph-arrow-btn"
                    aria-label="Next Chapter"
                  >
                    <span>Next</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div className="monograph-dots">
                  {stories.map((_, dIdx) => (
                    <button
                      key={dIdx}
                      onClick={() => setActiveStory(dIdx)}
                      className={`monograph-dot ${activeStory === dIdx ? 'active' : ''}`}
                      aria-label={`Jump to Chapter ${dIdx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ================= CLASSIC STORY SECTION ================= */
        .classic-story-section {
          padding: 96px 0;
          background-color: #faf7f0;
          color: #0b221a;
          position: relative;
        }

        .classic-story-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 40px auto;
        }

        .classic-section-eyebrow {
          font-family: var(--font-sans);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #9e8550;
          display: block;
          margin-bottom: 12px;
        }

        .classic-story-main-title {
          font-family: var(--font-serif);
          font-size: clamp(2rem, 3.8vw, 3.1rem);
          font-weight: 400;
          line-height: 1.18;
          color: #0b221a;
          letter-spacing: -0.015em;
          margin-bottom: 12px;
        }

        .classic-story-main-desc {
          font-size: 0.94rem;
          line-height: 1.6;
          color: #6a6458;
          font-weight: 400;
        }

        /* Chapter Navigation Tabs */
        .classic-chapter-nav {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }

        .classic-chapter-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background-color: #ffffff;
          border: 1px solid rgba(14, 43, 33, 0.12);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .classic-chapter-btn:hover {
          border-color: #dfbe84;
          background-color: #fcfbf7;
        }

        .classic-chapter-btn.active {
          background-color: #0c261e;
          border-color: #0c261e;
          box-shadow: 0 4px 16px rgba(12, 38, 30, 0.18);
        }

        .classic-chapter-btn .ch-num {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #9e8550;
        }

        .classic-chapter-btn.active .ch-num {
          color: #dfbe84;
        }

        .classic-chapter-btn .ch-title {
          font-family: var(--font-sans);
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4a453b;
        }

        .classic-chapter-btn.active .ch-title {
          color: #ffffff;
        }

        /* Monograph Card */
        .classic-monograph-card {
          background-color: #ffffff;
          border: 1px solid #dfbe84;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 16px 48px rgba(11, 34, 26, 0.07);
        }

        .monograph-grid {
          display: grid;
          grid-template-columns: 46% 54%;
        }

        .monograph-img-col {
          position: relative;
          min-height: 480px;
          background-color: #0a1f18;
        }

        .monograph-img-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .monograph-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .monograph-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(6, 22, 17, 0.2) 0%,
            rgba(6, 22, 17, 0.85) 100%
          );
          padding: 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #ffffff;
        }

        .monograph-location-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(8, 29, 22, 0.82);
          border: 1px solid rgba(223, 190, 132, 0.4);
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #dfbe84;
          align-self: flex-start;
          backdrop-filter: blur(6px);
        }

        .monograph-quote {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #f7f3e8;
          border-left: 2px solid #dfbe84;
          padding-left: 14px;
          margin: 0;
        }

        /* Narrative Column */
        .monograph-content-col {
          padding: clamp(32px, 4vw, 54px);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .monograph-badge-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .monograph-chapter-tag {
          font-family: var(--font-sans);
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #9e8550;
          font-weight: 700;
        }

        .monograph-page-idx {
          font-size: 0.72rem;
          font-weight: 600;
          color: #8c8374;
          letter-spacing: 0.08em;
        }

        .monograph-headline {
          font-family: var(--font-serif);
          font-size: clamp(1.6rem, 2.8vw, 2.2rem);
          font-weight: 500;
          line-height: 1.22;
          color: #0b221a;
          margin-bottom: 10px;
          letter-spacing: -0.01em;
        }

        .monograph-subheadline {
          font-size: 0.9rem;
          color: #7a7162;
          line-height: 1.55;
          margin-bottom: 18px;
          font-weight: 500;
        }

        .monograph-narrative {
          font-size: 0.92rem;
          line-height: 1.7;
          color: #4a453b;
          margin-bottom: 26px;
        }

        /* Stats Strip */
        .monograph-stats-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding: 18px 0;
          border-top: 1px solid rgba(14, 43, 33, 0.09);
          border-bottom: 1px solid rgba(14, 43, 33, 0.09);
          margin-bottom: 26px;
        }

        .monograph-stat-val {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          font-weight: 600;
          color: #0b221a;
          line-height: 1.1;
          margin-bottom: 4px;
        }

        .monograph-stat-lbl {
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #8a8172;
          font-weight: 600;
        }

        /* Footer Controls */
        .monograph-footer-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .monograph-btn-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .monograph-arrow-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #f7f3e8;
          border: 1px solid rgba(14, 43, 33, 0.12);
          color: #0b221a;
          padding: 8px 16px;
          border-radius: 3px;
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .monograph-arrow-btn:hover {
          background-color: #0c261e;
          border-color: #0c261e;
          color: #f7f3e8;
        }

        .monograph-dots {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .monograph-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #d1c8b8;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          padding: 0;
        }

        .monograph-dot.active {
          background-color: #0c261e;
          transform: scale(1.3);
        }

        /* ================= RESPONSIVE ================= */
        @media (max-width: 900px) {
          .monograph-grid {
            grid-template-columns: 1fr;
          }

          .monograph-img-col {
            min-height: 320px;
          }

          .monograph-content-col {
            padding: 28px 20px;
          }
        }

        @media (max-width: 600px) {
          .classic-story-section {
            padding: 64px 0;
          }

          .classic-chapter-nav {
            gap: 8px;
          }

          .classic-chapter-btn {
            padding: 8px 14px;
          }

          .classic-chapter-btn .ch-title {
            font-size: 0.68rem;
          }

          .monograph-stats-strip {
            gap: 10px;
          }

          .monograph-stat-val {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </section>
  );
}
