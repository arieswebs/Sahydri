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
          padding: clamp(32px, 4.5vw, 54px) 0;
          background-color: #f7f3ea;
          position: relative;
        }

        .connoisseurs-card {
          background-color: #ffffff;
          border: 1.5px solid #dfbe84;
          border-radius: 8px;
          padding: clamp(26px, 3.8vw, 42px) clamp(18px, 3.2vw, 38px);
          text-align: center;
          color: #0c261e;
          box-shadow: 0 16px 40px rgba(11, 34, 26, 0.05);
          position: relative;
          max-width: 680px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .connoisseurs-eyebrow {
          font-family: var(--font-display);
          font-size: 0.72rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #9e8550;
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .connoisseurs-title {
          font-family: var(--font-serif);
          font-size: clamp(1.45rem, 2.8vw, 2.2rem);
          font-weight: 500;
          color: #0c261e;
          margin-bottom: 8px;
          line-height: 1.22;
        }

        .connoisseurs-desc {
          font-size: clamp(0.85rem, 1vw, 0.94rem);
          color: #554f44;
          max-width: 540px;
          margin: 0 auto 18px auto;
          line-height: 1.55;
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
          min-height: 44px;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          pointer-events: none;
        }

        .connoisseurs-input {
          width: 100%;
          height: 100%;
          min-height: 44px;
          background-color: #faf8f4;
          border: 1px solid #d8ccb8;
          border-radius: 4px;
          padding: 10px 16px 10px 40px;
          color: #0c261e;
          font-size: 0.9rem;
          outline: none;
          font-family: var(--font-sans);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .connoisseurs-input:focus {
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
          background-color: #ffffff;
        }

        .connoisseurs-submit-btn {
          padding: 11px 24px;
          min-height: 44px;
          flex-shrink: 0;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .connoisseurs-success {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: #edf7f1;
          border: 1px solid #74db93;
          padding: 12px 20px;
          border-radius: 4px;
          color: #1a4d33;
          font-size: 0.88rem;
          font-weight: 500;
        }

        .connoisseurs-reassurance {
          margin-top: 12px;
          font-size: 0.72rem;
          color: #8c8273;
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
