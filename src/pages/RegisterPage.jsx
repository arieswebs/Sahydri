import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, UserPlus, ArrowLeft, AlertCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

function getSafeRedirect(redirectParam, defaultPath = '/account') {
  if (!redirectParam) return defaultPath;
  if (redirectParam.startsWith('/') && !redirectParam.startsWith('//') && !redirectParam.includes(':')) {
    return redirectParam;
  }
  return defaultPath;
}

export default function RegisterPage() {
  const { login, currentUser, showToast, API } = useShop();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  const safeRedirect = getSafeRedirect(rawRedirect, '/account');

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect
  useEffect(() => {
    if (currentUser) {
      navigate(safeRedirect, { replace: true });
    }
  }, [currentUser, navigate, safeRedirect]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanName = form.name.trim();
    const cleanEmail = form.email.trim();
    const cleanPass = form.password;

    if (!cleanName) {
      setError('Please provide your full name.');
      return;
    }
    if (!cleanEmail || !/\S+@\S+\.\S+/.test(cleanEmail)) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!cleanPass || cleanPass.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, email: cleanEmail, password: cleanPass }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      login(data.user, data.accessToken, data.refreshToken);
      showToast(`Welcome to Sahyadri Organics, ${data.user.name}!`);
      navigate(safeRedirect, { replace: true });
    } catch {
      setError('Could not connect to registration server. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const loginLink = rawRedirect ? `/login?redirect=${encodeURIComponent(rawRedirect)}` : '/login';

  return (
    <div className="auth-page-wrapper">
      <header className="auth-page-header">
        <div className="auth-header-inner">
          <Link to="/" className="auth-brand-link" aria-label="Sahyadri Organics Homepage">
            <img
              src="/images/sahyadri-logo.png"
              alt="Sahyadri Organics"
              className="auth-brand-logo"
            />
            <div className="auth-brand-text">
              <span className="auth-brand-name">SAHYADRI</span>
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
              <UserPlus size={18} color="#dfbe84" />
            </div>
            <h1 className="auth-card-title">Create an Account</h1>
            <p className="auth-card-desc">
              Join the Sahyadri Connoisseurs circle for priority harvest releases and seamless order tracking.
            </p>
          </div>

          {error && (
            <div className="auth-alert-box" role="alert">
              <AlertCircle size={16} className="auth-alert-icon" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form-stack" noValidate>
            <div className="auth-field-group">
              <label className="auth-field-label" htmlFor="reg-name">
                Full Name
              </label>
              <div className="auth-input-container">
                <User size={16} className="auth-input-icon" />
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="e.g. Thomas Varghese"
                  value={form.name}
                  onChange={handleChange}
                  className="auth-input-element"
                />
              </div>
            </div>

            <div className="auth-field-group">
              <label className="auth-field-label" htmlFor="reg-email">
                Email Address
              </label>
              <div className="auth-input-container">
                <Mail size={16} className="auth-input-icon" />
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="auth-input-element"
                />
              </div>
            </div>

            <div className="auth-field-group">
              <div className="auth-field-label-row">
                <label className="auth-field-label" htmlFor="reg-password">
                  Password
                </label>
                <span className="auth-field-hint">Min. 6 characters</span>
              </div>
              <div className="auth-input-container">
                <Lock size={16} className="auth-input-icon" />
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
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
              <span>{loading ? 'Creating Account…' : 'Create Account'}</span>
              {!loading && <ArrowRight size={16} />}
            </button>

            <div className="auth-card-footer">
              <p className="auth-switch-text">
                Already have an account?{' '}
                <Link to={loginLink} className="auth-switch-link">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
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

        .auth-field-hint {
          font-size: 0.72rem;
          color: #8c733b;
          font-weight: 500;
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
