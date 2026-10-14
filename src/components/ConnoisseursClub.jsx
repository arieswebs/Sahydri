import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

export default function ConnoisseursClub() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
  };

  return (
    <section className="connoisseurs-section">
      <div className="container">
        <div className="connoisseurs-card">


          <span className="connoisseurs-eyebrow">
            — EXCLUSIVE HARVEST INVITATION —
          </span>

          <h2 className="connoisseurs-title">
            Join the Sahydri Connoisseurs Guild
          </h2>

          <p className="connoisseurs-desc">
            Receive private harvest notifications, rare batch wild honey allocations, and traditional
            Kerala culinary secrets delivered directly to your inbox.
          </p>

          {subscribed ? (
            <div className="connoisseurs-success">
              <CheckCircle2 size={20} color="#21744b" />
              <span>Welcome to the Guild! Your private 10% welcome invitation has been sent to your email.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="connoisseurs-form">
              <div className="input-wrap">
                <Mail size={16} color="#9e8550" className="input-icon" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="connoisseurs-input"
                />
              </div>
              <button type="submit" className="btn-gold connoisseurs-submit-btn">
                <span>Join the Guild</span>
                <Send size={14} />
              </button>
            </form>
          )}

          <div className="connoisseurs-reassurance">
            <ShieldCheck size={13} color="#8c8273" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} />
            <span>Zero spam. Direct estate updates only. Unsubscribe with one click.</span>
          </div>
        </div>
      </div>

      <style>{`
        .connoisseurs-section {
          padding: clamp(60px, 6vw, 80px) 0;
          background-color: var(--surface-ground);
          position: relative;
        }

        .connoisseurs-card {
          background-color: var(--surface-card);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-lg);
          padding: clamp(32px, 4vw, 48px) clamp(20px, 3.5vw, 42px);
          text-align: center;
          color: var(--color-forest-900);
          box-shadow: var(--shadow-sm);
          position: relative;
          max-width: 680px;
          margin: 0 auto;
          box-sizing: border-box;
          transition: box-shadow var(--transition-normal);
        }
        .connoisseurs-card:hover {
          box-shadow: var(--shadow-md);
        }

        .connoisseurs-eyebrow {
          font-family: var(--font-sans);
          font-size: 0.72rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--color-gold-text);
          display: block;
          margin-bottom: 8px;
          font-weight: 700;
        }

        .connoisseurs-title {
          font-family: var(--font-serif);
          font-size: clamp(1.6rem, 2.8vw, 2.3rem);
          font-weight: 500;
          color: var(--color-forest-900);
          margin-bottom: 10px;
          line-height: 1.22;
          letter-spacing: -0.015em;
        }

        .connoisseurs-desc {
          font-size: clamp(0.88rem, 1vw, 0.98rem);
          color: var(--color-earth-600);
          max-width: 540px;
          margin: 0 auto 22px auto;
          line-height: 1.6;
        }

        .connoisseurs-form {
          display: flex;
          max-width: 500px;
          margin: 0 auto;
          gap: 10px;
          align-items: stretch;
        }

        .input-wrap {
          flex: 1 1 auto;
          position: relative;
          display: flex;
          align-items: center;
          min-height: 46px;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          pointer-events: none;
        }

        .connoisseurs-input {
          width: 100%;
          height: 100%;
          min-height: 46px;
          background-color: var(--surface-card);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-sm);
          padding: 10px 16px 10px 42px;
          color: var(--color-earth-900);
          font-size: 0.92rem;
          outline: none;
          font-family: var(--font-sans);
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
          box-sizing: border-box;
        }

        .connoisseurs-input:focus {
          border-color: var(--color-gold-500);
          box-shadow: 0 0 0 3px rgba(201, 164, 86, 0.2);
          background-color: #ffffff;
        }

        .connoisseurs-submit-btn {
          padding: 12px 26px;
          min-height: 46px;
          flex-shrink: 0;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: var(--radius-sm);
        }

        .connoisseurs-success {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: var(--color-success-bg);
          border: 1px solid var(--color-success);
          padding: 12px 20px;
          border-radius: var(--radius-sm);
          color: var(--color-success);
          font-size: 0.88rem;
          font-weight: 600;
        }

        .connoisseurs-reassurance {
          margin-top: 14px;
          font-size: 0.74rem;
          color: var(--color-earth-500);
          letter-spacing: 0.02em;
        }

        @media (max-width: 640px) {
          .connoisseurs-section {
            padding: 24px 0;
          }
          .connoisseurs-card {
            padding: 22px 16px;
            max-width: 100%;
          }
          .connoisseurs-title {
            font-size: 1.4rem;
            margin-bottom: 6px;
          }
          .connoisseurs-desc {
            font-size: 0.84rem;
            margin: 0 auto 16px auto;
            line-height: 1.5;
          }
          .connoisseurs-form {
            flex-direction: column;
            gap: 10px;
            width: 100%;
          }
          .input-wrap {
            flex: none;
            width: 100%;
            min-height: 44px;
          }
          .connoisseurs-submit-btn {
            width: 100%;
            min-height: 44px;
            padding: 12px 20px;
          }
          .connoisseurs-reassurance {
            margin-top: 10px;
            font-size: 0.70rem;
          }
        }
      `}</style>
    </section>
  );
}
