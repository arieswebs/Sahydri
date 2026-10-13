import React from 'react';
import { Leaf, Mail, Phone, MessageCircle, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="ultra-minimal-footer">
      <div className="container">
        {/* 1. Centered Brand Crest & Wordmark */}
        <div className="footer-brand-center">
          <div className="footer-crest-emblem" style={{ width: '48px', height: '48px', margin: '0 auto 12px auto' }}>
            <img
              src="/images/sahyadri-logo.png"
              alt="Sahydri Organics Logo"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid rgba(223, 190, 132, 0.4)',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
                display: 'block'
              }}
            />
          </div>
          <h3 className="footer-brand-heading">SAHYDRI ORGANICS</h3>
          <p className="footer-brand-subheading">
            Pure Single-Origin Spices & Raw Wild Forest Honey • Kerala Western Ghats
          </p>
        </div>

        {/* 2. Sleek Inline Navigation Links */}
        <nav className="footer-inline-nav" aria-label="Footer Navigation">
          <a href="#shop" className="inline-nav-link">Shop Collection</a>
          <span className="nav-divider">/</span>
          <a href="#spices" className="inline-nav-link">Single Estate Spices</a>
          <span className="nav-divider">/</span>
          <a href="#honey" className="inline-nav-link">Wild Forest Honey</a>
          <span className="nav-divider">/</span>
          <a href="#story" className="inline-nav-link">Our Story & Ethos</a>
          <span className="nav-divider">/</span>
          <a href="#heritage" className="inline-nav-link">Kerala Heritage</a>
          <span className="nav-divider">/</span>
          <a href="#contact" className="inline-nav-link">Purity Lab NMR</a>
        </nav>

        {/* 3. Minimalist Trust & Certification Seal Row */}
        <div className="footer-purity-row">
          <span className="purity-item">100% Bio-Dynamic</span>
          <span className="purity-bullet">•</span>
          <span className="purity-item">0.0% Chemical Pesticides</span>
          <span className="purity-bullet">•</span>
          <span className="purity-item">Kadar Tribal Fair Trade</span>
          <span className="purity-bullet">•</span>
          <span className="purity-item">NABL NMR Verified</span>
          <span className="purity-bullet">•</span>
          <span className="purity-item">FSSAI Lic. 11322007000184</span>
        </div>

        {/* 4. Contact & Social Concierge Row */}
        <div className="footer-concierge-row">
          <a
            href="tel:+919447012345"
            className="concierge-link"
            title="Direct Phone Line"
          >
            <Phone size={15} color="#dfbe84" />
            <span>+91 94470 12345</span>
          </a>

          <span className="concierge-sep">|</span>

          <a
            href="mailto:care@sahyadriorganics.com"
            className="concierge-link"
            title="Email Concierge"
          >
            <Mail size={15} color="#dfbe84" />
            <span>care@sahyadriorganics.com</span>
          </a>

          <span className="concierge-sep">|</span>

          <div className="social-links-minimal">
            <a href="#" className="social-dot-btn" title="Instagram" aria-label="Instagram">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
            </a>
            <a href="#" className="social-dot-btn" title="Facebook" aria-label="Facebook">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
            <a href="#" className="social-dot-btn" title="X / Twitter" aria-label="Twitter">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
            </a>
          </div>
        </div>

        {/* 5. Minimal Bottom Line: Copyright, Legal & Back to Top */}
        <div className="footer-bottom-minimal">
          <p className="copyright-text">
            © 2026 Sahyadri Organics Private Limited. Stewarded with reverence in Wayanad, Kerala.
          </p>

          <div className="legal-links-minimal">
            <a href="#shop" className="legal-text-link">Privacy Policy</a>
            <span className="dot">•</span>
            <a href="#shop" className="legal-text-link">Terms of Service</a>
            <span className="dot">•</span>
            <a href="#shop" className="legal-text-link">Shipping & Returns</a>
          </div>

          <button onClick={scrollToTop} className="top-scroll-btn" title="Scroll to top" aria-label="Scroll to top">
            <span>Top</span>
            <ArrowUp size={12} color="#dfbe84" />
          </button>
        </div>
      </div>

      <style>{`
        .ultra-minimal-footer {
          background-color: #04120e;
          background: radial-gradient(circle at 50% 10%, #082118 0%, #04120e 75%);
          color: #b5c7bd;
          border-top: 1px solid rgba(212, 175, 55, 0.22);
          padding: clamp(48px, 6vw, 72px) 0 28px 0;
          position: relative;
          text-align: center;
          width: 100%;
          overflow: hidden;
        }

        /* 1. Centered Brand Crest */
        .footer-brand-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 28px;
        }

        .footer-crest-emblem {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1.5px solid #dfbe84;
          background: rgba(14, 43, 33, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.45);
          margin-bottom: 14px;
        }

        .footer-brand-heading {
          font-family: var(--font-display);
          font-size: clamp(1.25rem, 2.5vw, 1.55rem);
          letter-spacing: 0.2em;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 6px;
        }

        .footer-brand-subheading {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: clamp(0.82rem, 1.2vw, 0.94rem);
          color: #dfbe84;
          letter-spacing: 0.03em;
          max-width: 600px;
          margin: 0;
        }

        /* 2. Inline Navigation */
        .footer-inline-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 24px;
          padding: 16px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .inline-nav-link {
          color: #a8bcaf;
          text-decoration: none;
          font-size: clamp(0.78rem, 1vw, 0.86rem);
          font-family: var(--font-sans);
          font-weight: 500;
          letter-spacing: 0.04em;
          transition: all 0.2s ease;
        }

        .inline-nav-link:hover {
          color: #f3dfb5;
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.35);
        }

        .nav-divider {
          color: rgba(212, 175, 55, 0.25);
          font-size: 0.8rem;
          user-select: none;
        }

        /* 3. Purity & Trust Row */
        .footer-purity-row {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 24px;
          font-size: 0.74rem;
          color: #8fa397;
          letter-spacing: 0.03em;
        }

        .purity-item {
          color: #c0d1c7;
        }

        .purity-bullet {
          color: rgba(212, 175, 55, 0.4);
        }

        /* 4. Concierge & Social Row */
        .footer-concierge-row {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 18px;
          margin-bottom: 34px;
          font-size: 0.82rem;
        }

        .concierge-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #c5d4cb;
          text-decoration: none;
          transition: color 0.2s ease;
          letter-spacing: 0.02em;
        }

        .concierge-link:hover {
          color: #dfbe84;
        }

        .concierge-sep {
          color: rgba(255, 255, 255, 0.12);
          user-select: none;
        }

        .social-links-minimal {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .social-dot-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid rgba(212, 175, 55, 0.28);
          background: rgba(14, 43, 33, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #dfbe84;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .social-dot-btn:hover {
          background-color: #dfbe84;
          color: #04120e;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.25);
        }

        /* 5. Minimal Bottom Line */
        .footer-bottom-minimal {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 0.74rem;
          color: #697d72;
        }

        .copyright-text {
          margin: 0;
          color: #72877b;
        }

        .legal-links-minimal {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .legal-text-link {
          color: #72877b;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .legal-text-link:hover {
          color: #dfbe84;
        }

        .dot {
          color: rgba(255, 255, 255, 0.15);
        }

        .top-scroll-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(212, 175, 55, 0.08);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #dfbe84;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .top-scroll-btn:hover {
          background-color: #dfbe84;
          color: #04120e;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .footer-inline-nav {
            gap: 10px;
            padding: 12px 0;
          }
          .nav-divider {
            display: none;
          }
          .inline-nav-link {
            padding: 4px 8px;
          }
          .footer-purity-row {
            font-size: 0.68rem;
            gap: 8px;
          }
          .purity-bullet {
            display: none;
          }
          .footer-concierge-row {
            flex-direction: column;
            gap: 12px;
          }
          .concierge-sep {
            display: none;
          }
          .footer-bottom-minimal {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 12px;
          }
        }
      `}</style>
    </footer>
  );
}
