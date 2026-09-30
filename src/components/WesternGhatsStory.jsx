import React from 'react';
import { Compass, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function WesternGhatsStory() {
  return (
    <section id="story" style={{ padding: '80px 0', backgroundColor: '#091d17' }}>
      <div className="container">
        <div
          style={{
            backgroundColor: '#0d2820',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)'
          }}
        >
          {/* Left: Image Container */}
          <div style={{ position: 'relative', minHeight: '380px' }}>
            <img
              src="/images/estate.jpg"
              alt="Western Ghats Spice Plantation"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, transparent 70%, #0d2820 100%)',
                pointerEvents: 'none'
              }}
            />
          </div>

          {/* Right: Content */}
          <div
            style={{
              padding: 'clamp(32px, 5vw, 64px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            {/* Tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.72rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#e5c98d',
                marginBottom: '16px'
              }}
            >
              <Compass size={14} color="#d4af37" />
              <span>The Origin • 4,200 Ft Elevation</span>
            </div>

            {/* Headline */}
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 3.5vw, 2.9rem)',
                fontWeight: '500',
                lineHeight: '1.15',
                color: '#ffffff',
                marginBottom: '20px'
              }}
            >
              Sourced in the Western Ghats
            </h2>

            {/* Story text */}
            <p
              style={{
                fontSize: '0.94rem',
                lineHeight: '1.7',
                color: '#c2cfc9',
                marginBottom: '16px'
              }}
            >
              Our dedication to purity begins decades ago, rooted deep in the biodiverse biosphere
              of the Western Ghats, an ancient mountain range older than the Himalayas and a UNESCO
              World Heritage site. Nurtured by southwest monsoon clouds, volcanic black soil, and
              unfiltered mist.
            </p>
            <p
              style={{
                fontSize: '0.94rem',
                lineHeight: '1.7',
                color: '#c2cfc9',
                marginBottom: '36px'
              }}
            >
              We practice zero-chemical organic cultivation, biodynamic agroforestry, and slow solar
              curing. Our spices are never blended with commercial lots—every tin and pouch is
              100% single-estate traceable back to the ridge where it grew.
            </p>

            {/* Stats Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(212, 175, 55, 0.2)'
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#e5c98d',
                    lineHeight: '1.1'
                  }}
                >
                  3,200+
                </div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: '#8fa59c',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginTop: '4px'
                  }}
                >
                  Tribal Farmers Supported
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#e5c98d',
                    lineHeight: '1.1'
                  }}
                >
                  420+
                </div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: '#8fa59c',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginTop: '4px'
                  }}
                >
                  Hectares Protected
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#e5c98d',
                    lineHeight: '1.1'
                  }}
                >
                  100%
                </div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: '#8fa59c',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginTop: '4px'
                  }}
                >
                  Pure & Lab Certified
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
