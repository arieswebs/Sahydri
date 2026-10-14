import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, KeyRound, RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

/* ── 6-Digit OTP Box Component ─────────────────────────────────────────────── */
function OtpBoxes({ value, onChange }) {
  const inputRefs = useRef([]);

  const handleKey = (idx, e) => {
    const digits = (value || '      ').split('');
    while (digits.length < 6) digits.push(' ');

    if (e.key === 'Backspace') {
      digits[idx] = ' ';
      onChange(digits.join(''));
      if (idx > 0) inputRefs.current[idx - 1]?.focus();
    } else if (/^\d$/.test(e.key)) {
      digits[idx] = e.key;
      onChange(digits.join(''));
      if (idx < 5) inputRefs.current[idx + 1]?.focus();
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, ' ').slice(0, 6));
    setTimeout(() => inputRefs.current[Math.min(pasted.length, 5)]?.focus(), 10);
  };

  return (
    <div className="auth-otp-row">
      {Array.from({ length: 6 }).map((_, i) => {
        const digit = (value || '')[i];
        const filled = digit && digit.trim();
        return (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={filled ? digit : ''}
            onKeyDown={e => handleKey(i, e)}
            onPaste={handlePaste}
            onChange={() => {}}
            aria-label={`Digit ${i + 1}`}
            className={`auth-otp-cell ${filled ? 'auth-otp-cell-active' : ''}`}
          />
        );
      })}
    </div>
  );
}

/* ── Safe internal redirect helper ─────────────────────────────────────────── */
function getSafeRedirect(redirectParam, defaultPath = '/account') {
  if (!redirectParam) return defaultPath;
  // Security: prevent open redirects to external protocols or double slashes
  if (redirectParam.startsWith('/') && !redirectParam.startsWith('//') && !redirectParam.includes(':')) {
    return redirectParam;
  }
  return defaultPath;
}

export default function LoginPage() {
  const { login, currentUser, showToast, API } = useShop();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  const safeRedirect = getSafeRedirect(rawRedirect, '/account');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // OTP step for admin accounts
  const [step, setStep] = useState('login'); // 'login' | 'otp'
  const [otp, setOtp] = useState('      ');
  const [resendCountdown, setResendCountdown] = useState(0);
  const countdownRef = useRef(null);

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(safeRedirect, { replace: true });
      }
    }
  }, [currentUser, navigate, safeRedirect]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCountdown > 0) {
      countdownRef.current = setTimeout(() => setResendCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(countdownRef.current);
  }, [resendCountdown]);

  // Submit OTP
  const handleOtpSubmit = useCallback(async () => {
    const cleanOtp = (otp || '').replace(/\s/g, '');
    if (cleanOtp.length !== 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: cleanOtp }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Invalid or expired verification code.');
        setLoading(false);
        return;
      }
      login(data.user, data.accessToken, data.refreshToken);
      if (data.user?.role === 'admin') {
        showToast('Welcome back, Admin!');
        navigate('/admin', { replace: true });
      } else {
        showToast('Welcome back to Sahydri Organics!');
        navigate(safeRedirect, { replace: true });
      }
    } catch {
      setError('Could not connect to authentication server. Please check your network.');
    } finally {
      setLoading(false);
    }
  }, [otp, API, login, showToast, navigate, safeRedirect]);

  // Auto-verify when 6 digits are typed
  useEffect(() => {
    if (step === 'otp' && (otp || '').replace(/\s/g, '').length === 6) {
      handleOtpSubmit();
    }
  }, [otp, step, handleOtpSubmit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Invalid email or password. Please try again.');
        setLoading(false);
        return;
      }

      if (data.requiresOtp) {
        setStep('otp');
        setResendCountdown(60);
        showToast('Verification code sent');
      } else {
        login(data.user, data.accessToken, data.refreshToken);
        if (data.user?.role === 'admin') {
          showToast('Welcome back, Admin!');
          navigate('/admin', { replace: true });
        } else {
          showToast(`Welcome back, ${data.user.name || 'Connoisseur'}!`);
          navigate(safeRedirect, { replace: true });
        }
      }
    } catch {
      setError('Unable to reach server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0 || loading) return;
    setOtp('      ');
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (data.success && data.requiresOtp) {
        setResendCountdown(60);
        showToast('A new verification code has been generated');
      } else {
        setError(data.message || 'Failed to resend verification code.');
      }
    } catch {
      setError('Network error while resending verification code.');
    } finally {
      setLoading(false);
    }
  };

  const registerLink = rawRedirect ? `/register?redirect=${encodeURIComponent(rawRedirect)}` : '/register';
  const forgotPasswordLink = rawRedirect ? `/forgot-password?redirect=${encodeURIComponent(rawRedirect)}` : '/forgot-password';

  return (
    <div className="auth-page-wrapper">
      {/* Top Heritage Bar */}
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

      {/* Main Authentication Card */}
      <main className="auth-main-content">
        <div className="auth-card">
          <div className="auth-card-top">
            <div className="auth-card-badge">
              <ShieldCheck size={18} color="#dfbe84" />
            </div>
            <h1 className="auth-card-title">
              {step === 'otp' ? 'Security Verification' : 'Welcome Back'}
            </h1>
            <p className="auth-card-desc">
              {step === 'otp'
                ? `Enter the 6-digit code sent for ${email.replace(/(.{2}).*@/, '$1***@')}`
                : 'Sign in to access your orders, saved addresses, and member benefits.'}
            </p>
          </div>

          {error && (
            <div className="auth-alert-box" role="alert">
              <AlertCircle size={16} className="auth-alert-icon" />
              <span>{error}</span>
            </div>
          )}

          {step === 'otp' ? (
            /* ── OTP Verification Step ── */
            <div className="auth-form-stack">
              <div className="auth-otp-wrapper">
                <label className="auth-field-label" style={{ textAlign: 'center', display: 'block' }}>
                  6-Digit Verification Code
                </label>
                <OtpBoxes value={otp} onChange={setOtp} />
              </div>

              <button
                type="button"
                onClick={handleOtpSubmit}
                disabled={loading || (otp || '').replace(/\s/g, '').length !== 6}
                className="auth-primary-btn"
              >
                <KeyRound size={16} />
                <span>{loading ? 'Verifying Code…' : 'Verify & Continue'}</span>
              </button>

              <div className="auth-otp-footer-row">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCountdown > 0 || loading}
                  className="auth-link-button"
                >
                  <RefreshCw size={13} className={loading ? 'auth-spin-icon' : ''} />
                  <span>{resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}</span>
                </button>
                <span className="auth-sep-dot">·</span>
                <button
                  type="button"
                  onClick={() => { setStep('login'); setOtp('      '); setError(''); }}
                  className="auth-link-button"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          ) : (
            /* ── Direct Login Step ── */
            <form onSubmit={handleSubmit} className="auth-form-stack" noValidate>
              <div className="auth-field-group">
                <label className="auth-field-label" htmlFor="login-email">
                  Email Address
                </label>
                <div className="auth-input-container">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className="auth-input-element"
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <div className="auth-field-label-row">
                  <label className="auth-field-label" htmlFor="login-password">
                    Password
                  </label>
                  <Link to={forgotPasswordLink} className="auth-forgot-link">
                    Forgot password?
                  </Link>
                </div>
                <div className="auth-input-container">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    className="auth-input-element auth-input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="auth-eye-button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="auth-primary-btn"
              >
                <span>{loading ? 'Authenticating…' : 'Sign In'}</span>
                {!loading && <ArrowRight size={16} />}
              </button>

              <div className="auth-card-footer">
                <p className="auth-switch-text">
                  New to Sahydri Organics?{' '}
                  <Link to={registerLink} className="auth-switch-link">
                    Create an account
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

        .auth-field-label-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 6px;
        }

        .auth-field-label {
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #273e33;
          margin-bottom: 6px;
        }

        .auth-forgot-link {
          font-size: 0.74rem;
          font-weight: 600;
          color: #8c733b;
          text-decoration: none;
        }

        .auth-forgot-link:hover {
          text-decoration: underline;
          color: #0a221a;
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
          background: #faf9f6;
          border: 1px solid #d9d4c7;
          border-radius: 9px;
          color: #0a221a;
          font-family: inherit;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .auth-input-element:focus {
          background: #ffffff;
          border-color: #8c733b;
          box-shadow: 0 0 0 3px rgba(140, 115, 59, 0.12);
        }

        .auth-input-password {
          padding-right: 44px;
        }

        .auth-eye-button {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #8e9a93;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .auth-eye-button:hover {
          color: #0a221a;
        }

        .auth-primary-btn {
          margin-top: 6px;
          width: 100%;
          padding: 13px;
          background: #0a221a;
          border: 1px solid #0a221a;
          border-radius: 9px;
          color: #dfbe84;
          font-family: var(--font-sans);
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .auth-primary-btn:hover:not(:disabled) {
          background: #14382c;
          border-color: #14382c;
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(10, 34, 26, 0.18);
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

        .auth-otp-wrapper {
          margin-bottom: 8px;
        }

        .auth-otp-row {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-top: 12px;
        }

        .auth-otp-cell {
          width: 44px;
          height: 52px;
          text-align: center;
          font-size: 1.45rem;
          font-weight: 700;
          font-family: 'SFMono-Regular', Consolas, monospace;
          background: #faf9f6;
          border: 1.5px solid #d9d4c7;
          border-radius: 9px;
          color: #0a221a;
          outline: none;
          transition: all 0.15s ease;
        }

        .auth-otp-cell:focus {
          background: #ffffff;
          border-color: #8c733b;
          box-shadow: 0 0 0 3px rgba(140, 115, 59, 0.15);
        }

        .auth-otp-cell-active {
          background: #fdfbf7;
        }

        .auth-otp-footer-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 6px;
        }

        .auth-link-button {
          background: none;
          border: none;
          color: #8c733b;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 0;
        }

        .auth-link-button:hover:not(:disabled) {
          text-decoration: underline;
          color: #0a221a;
        }

        .auth-link-button:disabled {
          color: #9ca3af;
          cursor: not-allowed;
        }

        .auth-sep-dot {
          color: #9ca3af;
        }

        .auth-spin-icon {
          animation: authSpin 1s linear infinite;
        }

        @keyframes authSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
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
          .auth-otp-row {
            gap: 4px;
          }
          .auth-otp-cell {
            width: 36px;
            height: 44px;
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}
