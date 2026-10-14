import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mail, ArrowRight, KeyRound, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ForgotPasswordPage() {
  const { showToast } = useShop();
  const [searchParams] = useSearchParams();
  const rawRedirect = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !/\S+@\S+\.\S+/.test(cleanEmail)) {
      setError('Please provide a valid email address.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // Simulate/perform recovery dispatch
      await new Promise(res => setTimeout(res, 800));
      setSubmitted(true);
      showToast('Recovery link sent to your email');
    } catch {
      setError('Could not process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loginLink = rawRedirect ? `/login?redirect=${encodeURIComponent(rawRedirect)}` : '/login';

  return (
    <div className="auth-page-wrapper">
      <header className="auth-page-header">
        <div className="auth-header-inner">
          <Link to="/" className="auth-brand-link" aria-label="Sahydri Organics Homepage">
            <img
              src="/images/sahyadri-logo.png"
              alt="Sahydri Organics"
              className="auth-brand-logo"
            />
            <div className="auth-brand-text">
              <span className="auth-brand-name">SAHYDRI</span>
              <span className="auth-brand-tag">ORGANICS · WESTERN GHATS</span>
            </div>
          </Link>

          <Link to="/" className="auth-back-link">
            <ArrowLeft size={14} />
            <span>Return to Store</span>
          </Link>
        </div>
      </header>

      <main className="auth-main-content">
        <div className="auth-card">
          <div className="auth-card-top">
            <div className="auth-card-badge">
              <KeyRound size={18} color="#dfbe84" />
            </div>
            <h1 className="auth-card-title">Reset Password</h1>
            <p className="auth-card-desc">
              Enter your registered email address and we will send you secure recovery instructions.
            </p>
          </div>

          {error && (
            <div className="auth-alert-box" role="alert">
              <AlertCircle size={16} className="auth-alert-icon" />
              <span>{error}</span>
            </div>
          )}

          {submitted ? (
            <div className="auth-success-state">
              <div className="auth-success-icon-box">
                <CheckCircle2 size={36} color="#15803d" />
              </div>
              <h2 className="auth-success-heading">Check Your Inbox</h2>
              <p className="auth-success-desc">
                If an account exists for <strong>{email}</strong>, you will receive password reset instructions shortly.
              </p>
              <Link to={loginLink} className="auth-primary-btn" style={{ textDecoration: 'none' }}>
                <span>Return to Sign In</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form-stack" noValidate>
              <div className="auth-field-group">
                <label className="auth-field-label" htmlFor="forgot-email">
                  Email Address
                </label>
                <div className="auth-input-container">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className="auth-input-element"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="auth-primary-btn"
              >
                <span>{loading ? 'Sending Instructions…' : 'Send Recovery Instructions'}</span>
                {!loading && <ArrowRight size={16} />}
              </button>

              <div className="auth-card-footer">
                <p className="auth-switch-text">
                  Remembered your credentials?{' '}
                  <Link to={loginLink} className="auth-switch-link">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </main>

      <style>{`
        .auth-page-wrapper {
          min-height: 100vh;
          min-height: 100dvh;
          background: #faf8f5;
          display: flex;
          flex-direction: column;
          color: #0a221a;
          font-family: var(--font-sans);
        }

        .auth-page-header {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(14, 43, 33, 0.08);
          background: #ffffff;
        }

        .auth-header-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .auth-brand-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: inherit;
        }

        .auth-brand-logo {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid #dfbe84;
          box-shadow: 0 2px 8px rgba(11, 37, 29, 0.12);
        }

        .auth-brand-text {
          display: flex;
          flex-direction: column;
        }

        .auth-brand-name {
          font-size: 1.05rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: #0a221a;
        }

        .auth-brand-tag {
          font-size: 0.64rem;
          letter-spacing: 0.12em;
          color: #8c733b;
          font-weight: 600;
        }

        .auth-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #4a5d53;
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 6px;
          border: 1px solid rgba(14, 43, 33, 0.1);
          transition: all 0.2s ease;
        }

        .auth-back-link:hover {
          background: #f1ede4;
          color: #0a221a;
        }

        .auth-main-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 20px;
        }

        .auth-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border: 1px solid rgba(14, 43, 33, 0.1);
          border-radius: 16px;
          padding: 38px 34px;
          box-shadow: 0 20px 50px rgba(11, 37, 29, 0.08), 0 4px 12px rgba(11, 37, 29, 0.03);
          box-sizing: border-box;
        }

        .auth-card-top {
          text-align: center;
          margin-bottom: 26px;
        }

        .auth-card-badge {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #0a221a;
          margin: 0 auto 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(10, 34, 26, 0.18);
        }

        .auth-card-title {
          font-family: var(--font-serif);
          font-size: 1.65rem;
          font-weight: 600;
          color: #0a221a;
          margin: 0 0 6px 0;
          letter-spacing: -0.01em;
        }

        .auth-card-desc {
          font-size: 0.85rem;
          color: #68726c;
          margin: 0;
          line-height: 1.5;
        }

        .auth-alert-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 11px 14px;
          color: #b91c1c;
          font-size: 0.82rem;
          line-height: 1.4;
          margin-bottom: 20px;
        }

        .auth-alert-icon {
          flex-shrink: 0;
        }

        .auth-form-stack {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .auth-field-group {
          display: flex;
          flex-direction: column;
        }

        .auth-field-label {
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #273e33;
          margin-bottom: 6px;
        }

        .auth-input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .auth-input-icon {
          position: absolute;
          left: 14px;
          color: #8e9a93;
          pointer-events: none;
        }

        .auth-input-element {
          width: 100%;
          padding: 12px 14px 12px 42px;
          background: var(--surface-card);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-sm);
          color: var(--color-earth-900);
          font-family: var(--font-sans);
          font-size: 0.92rem;
          outline: none;
          transition: all var(--transition-fast);
          box-sizing: border-box;
        }

        .auth-input-element:focus {
          background: #ffffff;
          border-color: var(--color-forest-800);
          box-shadow: 0 0 0 3px rgba(10, 34, 26, 0.08);
        }

        .auth-primary-btn {
          margin-top: 6px;
          width: 100%;
          padding: 13px;
          min-height: 46px;
          background: linear-gradient(135deg, var(--color-forest-950) 0%, var(--color-forest-900) 100%);
          border: 1px solid rgba(223, 190, 132, 0.3);
          border-radius: var(--radius-sm);
          color: var(--color-gold-300);
          font-family: var(--font-sans);
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-xs);
        }

        .auth-primary-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--color-forest-900) 0%, var(--color-forest-800) 100%);
          border-color: var(--color-gold-400);
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }

        .auth-primary-btn:active:not(:disabled) {
          transform: scale(0.98);
        }

        .auth-primary-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
        }

        .auth-card-footer {
          margin-top: 10px;
          text-align: center;
          border-top: 1px solid rgba(14, 43, 33, 0.08);
          padding-top: 18px;
        }

        .auth-switch-text {
          font-size: 0.83rem;
          color: #68726c;
          margin: 0;
        }

        .auth-switch-link {
          color: #8c733b;
          font-weight: 700;
          text-decoration: none;
        }

        .auth-switch-link:hover {
          text-decoration: underline;
          color: #0a221a;
        }

        .auth-success-state {
          text-align: center;
          padding: 12px 0;
        }

        .auth-success-icon-box {
          margin-bottom: 16px;
        }

        .auth-success-heading {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          color: #0a221a;
          margin: 0 0 8px 0;
        }

        .auth-success-desc {
          font-size: 0.85rem;
          color: #4b5563;
          line-height: 1.55;
          margin-bottom: 24px;
        }

        @media (max-width: 480px) {
          .auth-main-area {
            padding: 24px 12px;
          }
          .auth-card {
            padding: 24px 18px;
            border-radius: 12px;
          }
          .auth-card-title {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </div>
  );
}
