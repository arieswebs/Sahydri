import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, MapPin, Play, Pause } from 'lucide-react';

export default function WhySahyadri() {
  const [activeStory, setActiveStory] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const SLIDE_DURATION = 5000; // 5 seconds per chapter

  const stories = [
    {
      id: "canopy",
      chapter: "Chapter I",
      tag: "THE SACRED CANOPY",
      title: "Nurtured by Monsoons, Never by Chemistry",
      subtitle: "Zero synthetic fertilizers. Zero chemical sprays. 100% biodynamic rainforest terroir.",
      image: "/images/estate.jpg",
      location: "Wayanad Rain Reserve • 4,200 Ft",
      narrative: "Deep in the misted cloud forests of the Western Ghats, nature flourishes in an ancient equilibrium. Our spices grow wild beneath a multi-tiered rainforest canopy of silver oak and jackfruit, nurtured solely by monsoon torrents and volcanic humus—certified 0.0% pesticide residues across 220+ lab screens.",
      stats: [
        { label: "Pesticides", value: "0.0%" },
        { label: "Canopy Shade", value: "100% Wild" },
        { label: "Biosphere Age", value: "150M+ Yrs" }
      ],
      quote: "The soil here smells like crushed black cardamom after first monsoon rains."
    },
    {
      id: "grinding",
      chapter: "Chapter II",
      tag: "THE GRANITE CHAKKIS",
      title: "The Slow Rhythm of Cold Stone Pounding",
      subtitle: "Traditional granite mortars rotating under 38°C to guard delicate volatile oils.",
      image: "/images/cardamom.jpg",
      location: "Heritage Milled • Slow Batch Curing",
      narrative: "Industrial hammer-mills blaze above 85°C, burning away volatile terpenes and aromatic soul. At Sahydri, heritage granite chakkis turn slowly at 40 RPM, never exceeding 38°C—locking in up to 40% more volatile essential oils, natural curcumin, and therapeutic pungency.",
      stats: [
        { label: "Milling Heat", value: "< 38°C" },
        { label: "Volatile Oils", value: "+40%" },
        { label: "Grinding Method", value: "Granite Stone" }
      ],
      quote: "When you open the seal, the volatile oils rise immediately because they were never scorched."
    },
    {
      id: "honey",
      chapter: "Chapter III",
      tag: "THE LIQUID GOLD",
      title: "Raw Forest Nectar, Unheated & Untamed",
      subtitle: "Gathered from high cliffs and wild cavities. 100% unpasteurized with live mountain pollen.",
      image: "/images/honey.jpg",
      location: "Deep Forest Groves • Nilgiri & Sahydri Foothills",
      narrative: "Commercial honeys are boiled, pasteurized, and diluted with corn syrup. Our Kadar tribal gatherers harvest wild combs from cliff escarpments at night. Filtered gently through cotton muslin at room temperature, our raw nectar retains live enzymes, wild medicinal pollens, and 0% added sugar.",
      stats: [
        { label: "Added Sugar", value: "0.0%" },
        { label: "NMR Tested", value: "100% Pure" },
        { label: "Pasteurization", value: "Zero Heat" }
      ],
      quote: "True wild honey crystallizes with the seasons because it carries living forest nectar."
    },
    {
      id: "tribal",
      chapter: "Chapter IV",
      tag: "THE LIVING GUILD",
      title: "A Sovereign Covenant with Tribal Stewards",
      subtitle: "Returning over 70% of harvest value directly to indigenous forest custodians.",
      image: "/images/pepper.jpg",
      location: "Fair-Trade Alliance • 3,200+ Indigenous Families",
      narrative: "Those who preserve the sacred Western Ghats must be its primary beneficiaries. We bypass auction cartels entirely, returning over 70% of every harvest directly to 3,200+ indigenous families in Wayanad and Idukki—providing advance purchase security and funding forest tribal schooling.",
      stats: [
        { label: "To Growers", value: "70%+" },
        { label: "Families", value: "3,200+" },
        { label: "Middlemen", value: "Zero" }
      ],
      quote: "We share harvests with families who have stewarded these pepper vines for five centuries."
    }
  ];

  // Continuous timer that advances slide and drives progress bar
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 50;
    const step = (intervalTime / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStory((curr) => (curr + 1) % stories.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, stories.length]);

  const goToSlide = (idx) => {
    setActiveStory(idx);
    setProgress(0);
  };

  const handlePrev = () => {
    setActiveStory((curr) => (curr - 1 + stories.length) % stories.length);
    setProgress(0);
  };

  const handleNext = () => {
    setActiveStory((curr) => (curr + 1) % stories.length);
    setProgress(0);
  };

  return (
    <section id="story" className="story-section">
      <div className="container">
        {/* Compact Integrated Header Bar */}
        <div className="whysahyadri-header-row">
          <div className="whysahyadri-title-block">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="whysahyadri-eyebrow">
                THE CHRONICLES OF PURITY
              </span>
              <span className="whysahyadri-counter-pill">
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#d4af37',
                    display: 'inline-block',
                    animation: isPaused ? 'none' : 'pulseDot 1.5s infinite'
                  }}
                />
                {activeStory + 1} of {stories.length}
              </span>
            </div>
            <h2 className="whysahyadri-header-title">
              How Pure Living is Born in the Ghats
            </h2>
          </div>

          {/* Chapter Navigation Pills with Live Moving Progress Indicator */}
          <div className="whysahyadri-pills-row">
            {stories.map((story, idx) => {
              const isSelected = activeStory === idx;
              return (
                <button
                  key={story.id}
                  onClick={() => goToSlide(idx)}
                  className={`story-pill ${isSelected ? 'story-pill-active' : ''}`}
                >
                  <span style={{ color: isSelected ? '#dfbe84' : '#948a7b', fontWeight: '700' }}>
                    0{idx + 1}
                  </span>
                  <span>{story.chapter}</span>
                  {isSelected && !isPaused && (
                    <span
                      className="pill-progress-bar"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              );
            })}

            {/* Play/Pause control button */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="pause-play-btn"
              title={isPaused ? "Play slideshow" : "Pause slideshow"}
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            >
              {isPaused ? <Play size={12} fill="#0c261e" /> : <Pause size={12} fill="#0c261e" />}
            </button>
          </div>
        </div>

        {/* Global Progress Bar Tracking Transition to Next Slide */}
        <div className="global-progress-track">
          <div
            style={{
              height: '100%',
              backgroundColor: '#d4af37',
              width: `${((activeStory + progress / 100) / stories.length) * 100}%`,
              transition: 'width 50ms linear'
            }}
          />
        </div>

        {/* True Moving Carousel Container: Horizontal Slide Track */}
        <div className="story-carousel-card">
          {/* Sliding Track containing all 4 chapters */}
          <div
            className="story-slides-track"
            style={{
              width: `${stories.length * 100}%`,
              transform: `translateX(-${(activeStory * 100) / stories.length}%)`
            }}
          >
            {stories.map((story, idx) => (
              <div
                key={story.id}
                style={{ width: `${100 / stories.length}%` }}
                className="story-slide-grid"
              >
                {/* Left: Atmospheric High-Res Terroir Image */}
                <div className="story-img-container">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="story-img-tag"
                  />
                  {/* Subtle Scrim Vignette */}
                  <div className="story-vignette-overlay">
                    <div className="story-location-chip">
                      <MapPin size={11} color="#dfbe84" />
                      <span>{story.location}</span>
                    </div>

                    <p className="story-quote-caption">
                      "{story.quote}"
                    </p>
                  </div>
                </div>

                {/* Right: Narrative Editorial Body */}
                <div className="story-narrative-container">
                  <div>
                    {/* Chapter & Tag badge */}
                    <div className="story-tag-row">
                      <div className="story-tag-text">
                        {story.chapter} • {story.tag}
                      </div>
                      <span className="story-num-indicator">
                        0{idx + 1} / 0{stories.length}
                      </span>
                    </div>

                    <h3 className="story-title">
                      {story.title}
                    </h3>

                    <p className="story-subtitle-text">
                      {story.subtitle}
                    </p>

                    <p className="story-narrative-text">
                      {story.narrative}
                    </p>
                  </div>

                  {/* Bottom Row: Stats & Previous/Next Navigation */}
                  <div className="story-bottom-row">
                    {/* Terroir / Lab Stats */}
                    <div className="story-stats-grid">
                      {story.stats.map((stat, sIdx) => (
                        <div key={sIdx} className="story-stat-cell">
                          <div className="story-stat-val">
                            {stat.value}
                          </div>
                          <div className="story-stat-lbl">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Interactive Arrows */}
                    <div className="story-nav-buttons">
                      <button
                        onClick={handlePrev}
                        className="nav-arrow-btn"
                        title="Previous Chapter"
                        aria-label="Previous Chapter"
                      >
                        <ArrowLeft size={14} />
                      </button>

                      <button
                        onClick={handleNext}
                        className="next-btn"
                      >
                        <span>Next</span>
                        <ArrowRight size={13} color="#dfbe84" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .story-section {
          padding: clamp(60px, 6vw, 90px) 0;
          background-color: var(--surface-ground);
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          width: 100%;
        }

        .whysahyadri-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--surface-border-subtle);
          padding-bottom: 16px;
          width: 100%;
        }

        .whysahyadri-title-block {
          max-width: 100%;
        }

        .whysahyadri-eyebrow {
          font-family: var(--font-sans);
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--color-gold-text);
          font-weight: 700;
        }

        .whysahyadri-counter-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background-color: rgba(14, 43, 33, 0.08);
          padding: 3px 10px;
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-forest-900);
        }

        .whysahyadri-header-title {
          font-family: var(--font-serif);
          font-size: clamp(1.6rem, 3vw, 2.5rem);
          font-weight: 500;
          color: var(--color-forest-900);
          line-height: 1.2;
          margin-top: 6px;
          letter-spacing: -0.01em;
          word-break: break-word;
        }

        .whysahyadri-pills-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          align-items: center;
        }

        .story-pill {
          background-color: rgba(255, 255, 255, 0.7);
          color: #575146;
          border: 1px solid rgba(14, 43, 33, 0.12);
          border-radius: 4px;
          padding: 7px 12px;
          font-size: 0.72rem;
          font-family: var(--font-sans);
          font-weight: 500;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .story-pill-active {
          background-color: #0c261e !important;
          color: #f5e7c8 !important;
          border-color: #0c261e !important;
          font-weight: 600 !important;
        }

        .pill-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          background-color: #d4af37;
          transition: width 50ms linear;
        }

        .pause-play-btn {
          background-color: rgba(255, 255, 255, 0.7);
          color: #0c261e;
          border: 1px solid rgba(14, 43, 33, 0.12);
          border-radius: 4px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .global-progress-track {
          width: 100%;
          height: 2px;
          background-color: rgba(14, 43, 33, 0.08);
          margin-bottom: 14px;
          border-radius: 2px;
          overflow: hidden;
        }

        .story-carousel-card {
          background-color: #ffffff;
          border-radius: 8px;
          border: 1px solid rgba(212, 175, 55, 0.25);
          box-shadow: 0 12px 32px rgba(11, 37, 29, 0.07);
          overflow: hidden;
          position: relative;
          width: 100%;
          box-sizing: border-box;
        }

        .story-slides-track {
          display: flex;
          transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }

        .story-slide-grid {
          flex-shrink: 0;
          display: grid;
          grid-template-columns: minmax(280px, 44%) 1fr;
          min-height: 420px;
          box-sizing: border-box;
        }

        .story-img-container {
          position: relative;
          min-height: 260px;
          background-color: #091f19;
          overflow: hidden;
        }

        .story-img-tag {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .story-vignette-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(6, 22, 17, 0.94) 0%, rgba(6, 22, 17, 0.35) 55%, transparent 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: clamp(14px, 3vw, 24px);
        }

        .story-location-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(6, 22, 17, 0.85);
          border: 1px solid rgba(212, 175, 55, 0.4);
          color: #e5c98d;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.65rem;
          font-family: var(--font-sans);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 8px;
          backdrop-filter: blur(4px);
          width: fit-content;
        }

        .story-quote-caption {
          font-family: var(--font-serif);
          font-style: italic;
          color: #ffffff;
          font-size: clamp(0.78rem, 1.1vw, 0.88rem);
          line-height: 1.45;
          text-shadow: 0 2px 8px rgba(0,0,0,0.7);
          margin: 0;
        }

        .story-narrative-container {
          padding: clamp(18px, 3vw, 34px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background-color: #ffffff;
          box-sizing: border-box;
          overflow: hidden;
        }

        .story-tag-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .story-tag-text {
          font-family: var(--font-sans);
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          color: #9e8550;
          font-weight: 700;
          text-transform: uppercase;
        }

        .story-num-indicator {
          font-family: var(--font-sans);
          font-size: 0.68rem;
          color: #a39887;
          font-weight: 600;
        }

        .story-title {
          font-family: var(--font-serif);
          font-size: clamp(1.22rem, 2.2vw, 1.8rem);
          font-weight: 500;
          color: #0c261e;
          line-height: 1.25;
          margin-bottom: 10px;
          word-break: break-word;
        }

        .story-subtitle-text {
          font-size: clamp(0.8rem, 1vw, 0.88rem);
          line-height: 1.55;
          color: #1a4437;
          font-weight: 600;
          margin-bottom: 12px;
          padding-left: 10px;
          border-left: 2px solid #d4af37;
        }

        .story-narrative-text {
          font-size: clamp(0.8rem, 0.95vw, 0.88rem);
          line-height: 1.6;
          color: #554f44;
          margin-bottom: 18px;
        }

        .story-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid rgba(14, 43, 33, 0.08);
          gap: 10px;
          flex-wrap: wrap;
          width: 100%;
        }

        .story-stats-grid {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .story-stat-cell {
          min-width: 60px;
        }

        .story-stat-val {
          font-family: var(--font-sans);
          font-size: clamp(1.05rem, 1.8vw, 1.28rem);
          font-weight: 700;
          color: #0c261e;
          line-height: 1;
        }

        .story-stat-lbl {
          font-size: 0.62rem;
          color: #827869;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-top: 4px;
        }

        .story-nav-buttons {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .nav-arrow-btn {
          background-color: rgba(14, 43, 33, 0.08);
          color: #0c261e;
          border: none;
          border-radius: 3px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .next-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: '#0c261e';
          background: #0c261e;
          color: #f5e7c8;
          border: none;
          border-radius: 3px;
          padding: 8px 14px;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        @keyframes pulseDot {
          0% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.4; transform: scale(0.9); }
        }

        @media (max-width: 860px) {
          .whysahyadri-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .whysahyadri-header-title {
            font-size: clamp(1.2rem, 5.2vw, 1.6rem);
          }
          .story-slide-grid {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .story-img-container {
            min-height: 180px;
            height: 190px;
            max-height: 200px;
          }
          .story-narrative-container {
            padding: 16px 14px;
          }
          .story-title {
            font-size: clamp(1.15rem, 5vw, 1.45rem);
          }
          .story-stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            width: 100%;
          }
          .story-bottom-row {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          .story-nav-buttons {
            justify-content: flex-end;
          }
        }
      `}</style>
    </section>
  );
}
