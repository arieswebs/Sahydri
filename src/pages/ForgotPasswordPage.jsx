import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mail, ArrowRight, KeyRound, ArrowLeft, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { secureFetch } from '../services/csrf.js';

export default function ForgotPasswordPage() {
  const { showToast, API } = useShop();
  const apiBase = API || 'http://localhost:5000/api';
  const [searchParams] = useSearchParams();
  const rawRedirect = searchParams.get('redirect');

  const [step, setStep] = useState('request'); // 'request' | 'reset' | 'success'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtpNotice, setDevOtpNotice] = useState('');

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !/\S+@\S+\.\S+/.test(cleanEmail)) {
      setError('Please provide a valid email address.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await secureFetch(`${apiBase}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Could not send recovery instructions. Please try again.');
        return;
      }
      if (data.devMode && data.devOtp) {
        setDevOtpNotice(`Dev Mode Code: ${data.devOtp}`);
        setOtp(data.devOtp);
      }
      setStep('reset');
      showToast('Verification code sent to your email');
    } catch {
      setError('Network error. Could not reach server.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await secureFetch(`${apiBase}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
          password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to reset password. Please check the code.');
        return;
      }
      setStep('success');
      showToast('Password updated successfully!');
    } catch {
      setError('Network error. Could not reach server.');
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
              <KeyRound size={22} color="#0b251d" />
            </div>
            <h1 className="auth-card-title">
              {step === 'success' ? 'Password Reset' : step === 'reset' ? 'Set New Password' : 'Reset Password'}
            </h1>
            <p className="auth-card-desc">
              {step === 'success'
                ? 'Your password has been securely reset. You can now log into your account.'
                : step === 'reset'
                ? `Enter the 6-digit code sent to ${email} and choose your new password.`
                : 'Enter your registered email address to receive secure recovery instructions.'}
            </p>
          </div>

          {error && (
            <div className="auth-alert-box" role="alert">
              <AlertCircle size={16} className="auth-alert-icon" />
              <span>{error}</span>
            </div>
          )}

          {devOtpNotice && step === 'reset' && (
            <div style={{
              background: '#fef9c3',
              border: '1px solid #fde047',
              color: '#854d0e',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '16px'
            }}>
              ⚡ {devOtpNotice}
            </div>
          )}

          {step === 'success' ? (
            <div className="auth-success-state">
              <div className="auth-success-icon-box">
                <CheckCircle2 size={36} color="#15803d" />
              </div>
              <h2 className="auth-success-heading">Password Updated!</h2>
              <p className="auth-success-desc">
                Your credentials have been securely updated. You can now sign in with your new password.
              </p>
              <Link to={loginLink} className="auth-primary-btn" style={{ textDecoration: 'none' }}>
                <span>Proceed to Sign In</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : step === 'reset' ? (
            <form onSubmit={handleResetPassword} className="auth-form-stack" noValidate>
              <div className="auth-field-group">
                <label className="auth-field-label" htmlFor="reset-otp">
                  6-Digit Verification Code
                </label>
                <div className="auth-input-container">
                  <KeyRound size={16} className="auth-input-icon" />
                  <input
                    id="reset-otp"
                    type="text"
                    maxLength={10}
                    required
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value); setError(''); }}
                    className="auth-input-element"
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <label className="auth-field-label" htmlFor="reset-new-password">
                  New Password
                </label>
                <div className="auth-input-container">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    id="reset-new-password"
                    type="password"
                    minLength={6}
                    required
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                    className="auth-input-element"
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <label className="auth-field-label" htmlFor="reset-confirm-password">
                  Confirm New Password
                </label>
                <div className="auth-input-container">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    id="reset-confirm-password"
                    type="password"
                    minLength={6}
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    className="auth-input-element"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="auth-primary-btn"
              >
                <span>{loading ? 'Updating Password…' : 'Update Password'}</span>
                {!loading && <ArrowRight size={16} />}
              </button>

              <div className="auth-card-footer">
                <p className="auth-switch-text">
                  Didn't receive code?{' '}
                  <button
                    type="button"
                    onClick={() => { setStep('request'); setError(''); }}
                    style={{ background: 'none', border: 'none', color: '#0b251d', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  >
                    Resend code
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRequestOtp} className="auth-form-stack" noValidate>
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
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid rgba(223, 190, 132, 0.5);
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(10, 34, 26, 0.12);
          overflow: hidden;
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
