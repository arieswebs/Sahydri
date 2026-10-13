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
            Join the Sahyadri Connoisseurs Guild
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
          padding: clamp(52px, 7vw, 84px) 0;
          background-color: #f7f3ea;
          position: relative;
        }

        .connoisseurs-card {
          background-color: #ffffff;
          border: 1.5px solid #dfbe84;
          border-radius: 8px;
          padding: clamp(36px, 5.5vw, 60px) clamp(20px, 4vw, 52px);
          text-align: center;
          color: #0c261e;
          box-shadow: 0 16px 40px rgba(11, 34, 26, 0.05);
          position: relative;
          max-width: 860px;
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
          margin-bottom: 12px;
          font-weight: 600;
        }

        .connoisseurs-title {
          font-family: var(--font-serif);
          font-size: clamp(1.6rem, 3.2vw, 2.6rem);
          font-weight: 500;
          color: #0c261e;
          margin-bottom: 12px;
          line-height: 1.22;
        }

        .connoisseurs-desc {
          font-size: clamp(0.88rem, 1.1vw, 0.96rem);
          color: #554f44;
          max-width: 580px;
          margin: 0 auto 30px auto;
          line-height: 1.65;
        }

        .connoisseurs-form {
          display: flex;
          max-width: 520px;
          margin: 0 auto;
          gap: 10px;
          flex-wrap: wrap;
        }

        .input-wrap {
          flex: 1 1 280px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          pointer-events: none;
        }

        .connoisseurs-input {
          width: 100%;
          background-color: #faf8f4;
          border: 1px solid #d8ccb8;
          border-radius: 4px;
          padding: 13px 16px 13px 40px;
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
          padding: 13px 26px;
          flex-shrink: 0;
          cursor: pointer;
        }

        .connoisseurs-success {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: #edf7f1;
          border: 1px solid #74db93;
          padding: 14px 24px;
          border-radius: 4px;
          color: #1a4d33;
          font-size: 0.88rem;
          font-weight: 500;
        }

        .connoisseurs-reassurance {
          margin-top: 16px;
          font-size: 0.72rem;
          color: #8c8273;
          letter-spacing: 0.02em;
        }

        @media (max-width: 640px) {
          .connoisseurs-card {
            padding: 28px 16px;
          }
          .connoisseurs-form {
            flex-direction: column;
            gap: 10px;
          }
          .connoisseurs-submit-btn {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
