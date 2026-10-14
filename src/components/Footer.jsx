import React from 'react';
import { Phone, Mail, ArrowUp, ShieldCheck, Leaf, Sparkles, MapPin } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="sahydri-footer">
      <div className="container sahydri-footer-container">
        
        {/* ── Top Grid: Brand & Navigation ── */}
        <div className="footer-main-grid">
          
          {/* Column 1: Brand Identity */}
          <div className="footer-col footer-col-brand">
            <div className="footer-brand-header">
              <img
                src="/images/sahyadri-logo.png"
                alt="Sahydri Organics Logo"
                className="footer-brand-logo"
              />
              <div className="footer-brand-title-wrap">
                <span className="footer-brand-name">SAHYDRI</span>
                <span className="footer-brand-sub">ORGANICS</span>
              </div>
            </div>
            <p className="footer-brand-tagline">
              Pristine single-origin spices and raw wild comb honey, sustainably foraged by native tribal honey hunters in the mist-veiled Western Ghats.
            </p>
            <div className="footer-social-row">
              <a href="#" className="footer-social-btn" aria-label="Instagram" title="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="#" className="footer-social-btn" aria-label="Facebook" title="Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" className="footer-social-btn" aria-label="X (Twitter)" title="X">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="footer-col">
            <h4 className="footer-col-title">Collections</h4>
            <ul className="footer-nav-list">
              <li><a href="#shop" className="footer-nav-link">Tellicherry Black Pepper</a></li>
              <li><a href="#shop" className="footer-nav-link">8mm+ Green Cardamom</a></li>
              <li><a href="#shop" className="footer-nav-link">Wild Forest Comb Honey</a></li>
              <li><a href="#shop" className="footer-nav-link">High-Curcumin Turmeric</a></li>
              <li><a href="#shop" className="footer-nav-link">Artisan Gift Chests</a></li>
            </ul>
          </div>

          {/* Column 3: Heritage & Ethos */}
          <div className="footer-col">
            <h4 className="footer-col-title">Heritage</h4>
            <ul className="footer-nav-list">
              <li><a href="#story" className="footer-nav-link">Our Story &amp; Ethos</a></li>
              <li><a href="#culture" className="footer-nav-link">Western Ghats Terroir</a></li>
              <li><a href="#purity" className="footer-nav-link">NMR Nuclear Lab Reports</a></li>
              <li><a href="#story" className="footer-nav-link">Tribal Harvest Covenant</a></li>
              <li><a href="#contact" className="footer-nav-link">Wholesale &amp; Gifting</a></li>
            </ul>
          </div>

          {/* Column 4: Concierge & Location */}
          <div className="footer-col footer-col-contact">
            <h4 className="footer-col-title">Concierge</h4>
            <div className="footer-contact-items">
              <a href="tel:+919447012345" className="footer-contact-item">
                <Phone size={14} className="footer-contact-icon" />
                <span>+91 94470 12345</span>
              </a>
              <a href="mailto:care@sahydriorganics.com" className="footer-contact-item">
                <Mail size={14} className="footer-contact-icon" />
                <span>care@sahydriorganics.com</span>
              </a>
              <div className="footer-contact-item footer-location-item">
                <MapPin size={14} className="footer-contact-icon" />
                <span>Wayanad Biosphere, Kerala 673577</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Hallmark Trust Badges Row ── */}
        <div className="footer-trust-strip">
          <div className="trust-pill">
            <ShieldCheck size={14} color="#dfbe84" />
            <span>100% NMR Lab Certified</span>
          </div>
          <div className="trust-pill">
            <Sparkles size={14} color="#dfbe84" />
            <span>Raw &amp; Unheated Nectar</span>
          </div>
          <div className="trust-pill">
            <Leaf size={14} color="#dfbe84" />
            <span>Direct Fair-Value Harvest</span>
          </div>
          <div className="trust-pill">
            <span className="trust-fssai-num">FSSAI Lic. 11322007000184</span>
          </div>
        </div>

        {/* ── Bottom Line: Copyright, Legal & Back to Top ── */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © 2026 Sahydri Organics Pvt. Ltd. Stewarded with reverence in Wayanad, Kerala.
          </p>

          <div className="footer-legal-links">
            <a href="#shop" className="footer-legal-link">Privacy Policy</a>
            <span className="footer-legal-sep">·</span>
            <a href="#shop" className="footer-legal-link">Terms of Service</a>
            <span className="footer-legal-sep">·</span>
            <a href="#shop" className="footer-legal-link">Shipping &amp; Returns</a>
          </div>

          <button onClick={scrollToTop} className="footer-scroll-top-btn" aria-label="Scroll back to top">
            <span>Back to top</span>
            <ArrowUp size={13} />
          </button>
        </div>

      </div>

      <style>{`
        .sahydri-footer {
          background-color: #051913;
          background: linear-gradient(180deg, #071f18 0%, #030e0b 100%);
          color: #e5ede8;
          border-top: 1px solid rgba(223, 190, 132, 0.22);
          padding: clamp(48px, 6vw, 72px) 0 28px 0;
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .sahydri-footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── Main Multi-Column Grid ── */
        .footer-main-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        /* Brand Column */
        .footer-col-brand {
          display: flex;
          flex-direction: column;
        }

        .footer-brand-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .footer-brand-logo {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid rgba(223, 190, 132, 0.45);
          object-fit: cover;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
          display: block;
        }

        .footer-brand-title-wrap {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .footer-brand-name {
          font-family: var(--font-display);
          font-size: 1.18rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #ffffff;
        }

        .footer-brand-sub {
          font-family: var(--font-sans);
          font-size: 0.64rem;
          font-weight: 700;
          letter-spacing: 0.28em;
          color: #dfbe84;
          margin-top: 2px;
        }

        .footer-brand-tagline {
          font-family: var(--font-sans);
          font-size: 0.84rem;
          line-height: 1.6;
          color: rgba(229, 237, 232, 0.75);
          max-width: 320px;
          margin: 0 0 18px 0;
        }

        .footer-social-row {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .footer-social-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(223, 190, 132, 0.08);
          border: 1px solid rgba(223, 190, 132, 0.28);
          color: #dfbe84;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.22s ease;
          text-decoration: none;
        }

        .footer-social-btn:hover {
          background-color: #dfbe84;
          color: #04120e;
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(223, 190, 132, 0.3);
        }

        /* Column Titles & Links */
        .footer-col-title {
          font-family: var(--font-sans);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #dfbe84;
          margin: 0 0 18px 0;
        }

        .footer-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .footer-nav-link {
          color: rgba(229, 237, 232, 0.75);
          text-decoration: none;
          font-family: var(--font-sans);
          font-size: 0.86rem;
          transition: all 0.2s ease;
          display: inline-block;
        }

        .footer-nav-link:hover {
          color: #dfbe84;
          transform: translateX(3px);
        }

        /* Concierge Contact */
        .footer-contact-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-contact-item {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: rgba(229, 237, 232, 0.82);
          text-decoration: none;
          font-family: var(--font-sans);
          font-size: 0.85rem;
          transition: color 0.2s ease;
        }

        .footer-contact-item:hover {
          color: #dfbe84;
        }

        .footer-contact-icon {
          color: #dfbe84;
          flex-shrink: 0;
        }

        .footer-location-item {
          color: rgba(229, 237, 232, 0.65);
          font-size: 0.82rem;
          line-height: 1.45;
        }

        /* ── Hallmark Trust Badges Row ── */
        .footer-trust-strip {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          padding: 16px 0;
          border-top: 1px solid rgba(223, 190, 132, 0.14);
          border-bottom: 1px solid rgba(223, 190, 132, 0.14);
          margin-bottom: 26px;
        }

        .trust-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(9, 32, 24, 0.65);
          border: 1px solid rgba(223, 190, 132, 0.24);
          padding: 6px 14px;
          border-radius: 20px;
          font-family: var(--font-sans);
          font-size: 0.74rem;
          font-weight: 500;
          color: #e5ede8;
        }

        .trust-fssai-num {
          font-size: 0.72rem;
          color: rgba(223, 190, 132, 0.9);
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        /* ── Bottom Line: Copyright, Legal & Back to Top ── */
        .footer-bottom-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          font-family: var(--font-sans);
          font-size: 0.75rem;
          color: rgba(229, 237, 232, 0.55);
        }

        .footer-copyright {
          margin: 0;
          color: rgba(229, 237, 232, 0.65);
        }

        .footer-legal-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .footer-legal-link {
          color: rgba(229, 237, 232, 0.65);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-legal-link:hover {
          color: #dfbe84;
        }

        .footer-legal-sep {
          color: rgba(223, 190, 132, 0.35);
          user-select: none;
        }

        .footer-scroll-top-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(223, 190, 132, 0.08);
          border: 1px solid rgba(223, 190, 132, 0.3);
          color: #dfbe84;
          padding: 6px 14px;
          border-radius: 20px;
          font-family: var(--font-sans);
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.22s ease;
        }

        .footer-scroll-top-btn:hover {
          background-color: #dfbe84;
          color: #051913;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(223, 190, 132, 0.3);
        }

        /* ── Responsive Queries for Tablet & Mobile ── */
        @media (max-width: 900px) {
          .footer-main-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px;
          }
        }

        @media (max-width: 580px) {
          .sahydri-footer {
            padding: 40px 0 24px 0;
          }

          .sahydri-footer-container {
            padding: 0 18px;
          }

          .footer-main-grid {
            grid-template-columns: 1fr;
            gap: 26px;
            margin-bottom: 28px;
          }

          .footer-col-brand {
            padding-bottom: 6px;
            border-bottom: 1px solid rgba(223, 190, 132, 0.12);
          }

          .footer-brand-tagline {
            max-width: 100%;
            font-size: 0.82rem;
            margin-bottom: 14px;
          }

          .footer-col-title {
            margin-bottom: 12px;
          }

          .footer-nav-list {
            gap: 9px;
          }

          .footer-nav-link {
            font-size: 0.84rem;
          }

          .footer-contact-items {
            gap: 10px;
          }

          .footer-trust-strip {
            justify-content: flex-start;
            gap: 8px;
            padding: 14px 0;
            margin-bottom: 20px;
          }

          .trust-pill {
            font-size: 0.7rem;
            padding: 5px 12px;
          }

          .footer-bottom-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
          }

          .footer-legal-links {
            flex-wrap: wrap;
            gap: 8px;
          }
        }
      `}</style>
    </footer>
  );
}
