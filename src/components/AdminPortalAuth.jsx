import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, Sparkles, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function AdminPortalAuth({ onLoginSuccess }) {
  const { login, showToast, API, secureFetch } = useShop();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpRequired, setOtpRequired] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [devOtpCode, setDevOtpCode] = useState('');

  // 1-Click Fast Direct Store Manager Login
  const handleQuickAccess = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await secureFetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'care@sahydriorganics.com',
          password: 'Sahydri@2004',
          directLogin: true
        })
      });

      const data = await res.json();
      if (data.success && data.user?.role === 'admin') {
        login(data.user, data.accessToken, data.refreshToken);
        showToast('Authenticated as Store Administrator');
        onLoginSuccess?.();
        return;
      }
      setError(data.message || 'Quick access rejected. Please enter credentials manually.');
    } catch {
      // Offline fallback: log in locally as admin in local development mode only
      if (import.meta.env.DEV) {
        const fallbackAdmin = {
          id: 'USR-001',
          name: 'Admin Sahydri',
          email: 'care@sahydriorganics.com',
          role: 'admin'
        };
        login(fallbackAdmin, 'mock-admin-token-' + Date.now(), 'mock-refresh-token');
        showToast('Dev Mode: Offline Admin Access Granted');
        onLoginSuccess?.();
        return;
      }
      setError('Could not reach backend authentication service.');
    } finally {
      setLoading(false);
    }
  };

  // Standard Form Submit (Email & Password)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await secureFetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, directLogin: true })
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Invalid administrator credentials.');
        setLoading(false);
        return;
      }

      if (data.requiresOtp) {
        setOtpRequired(true);
        if (data.devOtp) {
          setDevOtpCode(data.devOtp);
          setOtpValue(data.devOtp);
        }
        showToast(data.message || 'Verification code required');
        setLoading(false);
        return;
      }

      login(data.user, data.accessToken, data.refreshToken);
      showToast('Welcome back to Admin Portal');
      onLoginSuccess?.();
    } catch {
      // Local client fallback only in development mode
      if (import.meta.env.DEV && (email.toLowerCase() === 'care@sahydriorganics.com' || email.toLowerCase() === 'admin@sahyadri.com') && password === 'Sahydri@2004') {
        const fallbackAdmin = {
          id: 'USR-001',
          name: 'Admin Sahydri',
          email: 'care@sahydriorganics.com',
          role: 'admin'
        };
        login(fallbackAdmin, 'mock-admin-token-' + Date.now(), 'mock-refresh-token');
        showToast('Dev Mode: Welcome back, Admin!');
        onLoginSuccess?.();
      } else {
        setError('Could not reach backend authentication service.');
      }
    } finally {
      setLoading(false);
    }
  };

  // OTP Verification Submit
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (!otpValue || otpValue.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await secureFetch(`${API}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otpValue.trim() })
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Invalid or expired code.');
        setLoading(false);
        return;
      }

      login(data.user, data.accessToken, data.refreshToken);
      showToast('Admin verification complete');
      onLoginSuccess?.();
    } catch {
      setError('Could not verify OTP. Please try Direct Access.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-portal-login-page">
      <div className="admin-portal-container">
        
        {/* Top Back Link */}
        <div className="admin-portal-top-bar">
          <a href="/" className="admin-back-store-btn">
            <ArrowLeft size={15} />
            <span>Return to Storefront</span>
          </a>
          <div className="admin-secure-pill">
            <Shield size={13} color="#dfbe84" />
            <span>256-Bit SSL Encrypted Admin Portal</span>
          </div>
        </div>

        {/* Card */}
        <div className="admin-portal-card">
          <div className="admin-portal-header">
            <div className="admin-badge-icon">
              <Shield size={28} color="#0c261e" />
            </div>
            <h1 className="admin-portal-title">SAHYDRI ORGANICS</h1>
            <div className="admin-portal-sub">Store Manager &amp; Operations Portal</div>
            <p className="admin-portal-desc">
              Manage product catalog, process customer orders, monitor stock levels, and track Shipway logistics in real time.
            </p>
          </div>

          {/* Quick Access Hero Button */}
          <div className="admin-quick-access-box">
            <button
              onClick={handleQuickAccess}
              disabled={loading}
              className="admin-quick-btn"
            >
              <Sparkles size={16} />
              <span>{loading ? 'Authenticating...' : '⚡ Quick Admin Access (1-Click)'}</span>
            </button>
            <div className="admin-quick-sub">
              Instant access with full store manager privileges
            </div>
          </div>

          <div className="admin-portal-divider">
            <span>or sign in with credentials</span>
          </div>

          {/* Form */}
          {!otpRequired ? (
            <form onSubmit={handleFormSubmit} className="admin-portal-form">
              <div className="admin-form-group">
                <label className="admin-form-lbl">Administrator Email</label>
                <div className="admin-input-wrap">
                  <Mail size={16} className="admin-input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@sahyadri.com"
                    required
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-lbl">Password</label>
                <div className="admin-input-wrap">
                  <Lock size={16} className="admin-input-icon" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="admin-input"
                  />
                </div>
              </div>

              {error && (
                <div className="admin-error-box">
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="admin-submit-btn"
              >
                <span>{loading ? 'Verifying...' : 'Sign In to Portal'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpVerify} className="admin-portal-form">
              <div className="admin-otp-banner">
                <CheckCircle2 size={18} color="#10b981" />
                <div>
                  <div className="admin-otp-banner-title">OTP Code Generated</div>
                  <div className="admin-otp-banner-sub">
                    {devOtpCode ? `Dev Code: ${devOtpCode}` : `Code sent to ${email}`}
                  </div>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-lbl">Enter 6-Digit OTP</label>
                <div className="admin-input-wrap">
                  <Lock size={16} className="admin-input-icon" />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    autoFocus
                    required
                    className="admin-input"
                  />
                </div>
              </div>

              {error && (
                <div className="admin-error-box">
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otpValue.length !== 6}
                className="admin-submit-btn"
              >
                <span>{loading ? 'Verifying Code...' : 'Verify & Enter Portal'}</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => setOtpRequired(false)}
                className="admin-back-btn"
              >
                Back to Password Login
              </button>
            </form>
          )}

          {/* Footer Credentials Note */}
          <div className="admin-portal-footer">
            <div className="admin-cred-hint">
              <span>Default Credentials:</span>{' '}
              <strong>admin@sahyadri.com</strong> · <strong>admin123</strong>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .admin-portal-login-page {
          min-height: 100vh;
          background: radial-gradient(circle at 50% 10%, #0d2e24 0%, #061913 70%, #030d0a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px 16px;
          color: #ffffff;
          font-family: var(--font-sans);
        }

        .admin-portal-container {
          max-width: 480px;
          width: 100%;
        }

        .admin-portal-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .admin-back-store-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #dfbe84;
          font-size: 0.8rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .admin-back-store-btn:hover {
          color: #ffffff;
          transform: translateX(-2px);
        }

        .admin-secure-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          color: rgba(223, 190, 132, 0.85);
          background: rgba(14, 43, 33, 0.8);
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid rgba(223, 190, 132, 0.2);
        }

        .admin-portal-card {
          background: #092119;
          border: 1px solid rgba(223, 190, 132, 0.35);
          border-radius: 14px;
          padding: 36px 32px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(223, 190, 132, 0.15);
        }

        .admin-portal-header {
          text-align: center;
          margin-bottom: 26px;
        }

        .admin-badge-icon {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #dfbe84 0%, #ebd4a8 100%);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          box-shadow: 0 8px 24px rgba(223, 190, 132, 0.35);
        }

        .admin-portal-title {
          font-family: var(--font-serif);
          font-size: 1.55rem;
          letter-spacing: 0.12em;
          color: #dfbe84;
          margin: 0;
          font-weight: 700;
        }

        .admin-portal-sub {
          font-size: 0.82rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #e5ede8;
          margin-top: 4px;
          font-weight: 600;
        }

        .admin-portal-desc {
          font-size: 0.78rem;
          color: rgba(229, 237, 232, 0.7);
          line-height: 1.45;
          margin: 10px auto 0;
          max-width: 380px;
        }

        .admin-quick-access-box {
          background: rgba(223, 190, 132, 0.08);
          border: 1px dashed rgba(223, 190, 132, 0.45);
          border-radius: 8px;
          padding: 14px;
          text-align: center;
          margin-bottom: 20px;
        }

        .admin-quick-btn {
          width: 100%;
          padding: 12px 18px;
          background: linear-gradient(135deg, #dfbe84 0%, #d4ae68 100%);
          color: #0c261e;
          border: none;
          border-radius: 6px;
          font-family: var(--font-sans);
          font-size: 0.88rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(223, 190, 132, 0.25);
          transition: all 0.2s ease;
        }

        .admin-quick-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #ebd4a8 0%, #dfbe84 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(223, 190, 132, 0.4);
        }

        .admin-quick-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .admin-quick-sub {
          font-size: 0.72rem;
          color: rgba(223, 190, 132, 0.8);
          margin-top: 8px;
        }

        .admin-portal-divider {
          display: flex;
          align-items: center;
          text-align: center;
          color: rgba(229, 237, 232, 0.4);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin: 18px 0;
        }

        .admin-portal-divider::before,
        .admin-portal-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid rgba(223, 190, 132, 0.15);
        }

        .admin-portal-divider span {
          padding: 0 10px;
        }

        .admin-portal-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .admin-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .admin-form-lbl {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: rgba(229, 237, 232, 0.85);
          font-weight: 600;
        }

        .admin-input-wrap {
          display: flex;
          align-items: center;
          background: rgba(5, 18, 14, 0.9);
          border: 1px solid rgba(223, 190, 132, 0.3);
          border-radius: 6px;
          padding: 0 12px;
          height: 44px;
          transition: border-color 0.2s ease;
        }

        .admin-input-wrap:focus-within {
          border-color: #dfbe84;
          box-shadow: 0 0 10px rgba(223, 190, 132, 0.3);
        }

        .admin-input-icon {
          color: #dfbe84;
          margin-right: 10px;
          flex-shrink: 0;
        }

        .admin-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-family: var(--font-sans);
          font-size: 0.88rem;
        }

        .admin-input::placeholder {
          color: rgba(229, 237, 232, 0.35);
        }

        .admin-submit-btn {
          height: 44px;
          background: #dfbe84;
          color: #0c261e;
          border: none;
          border-radius: 6px;
          font-family: var(--font-sans);
          font-size: 0.86rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          margin-top: 4px;
        }

        .admin-submit-btn:hover:not(:disabled) {
          background: #ebd4a8;
          transform: translateY(-1px);
        }

        .admin-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .admin-error-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 6px;
          padding: 10px 12px;
          color: #fca5a5;
          font-size: 0.78rem;
        }

        .admin-otp-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 6px;
          padding: 10px 14px;
        }

        .admin-otp-banner-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #74db93;
        }

        .admin-otp-banner-sub {
          font-size: 0.74rem;
          color: rgba(229, 237, 232, 0.8);
          margin-top: 2px;
        }

        .admin-back-btn {
          background: none;
          border: none;
          color: #dfbe84;
          font-size: 0.76rem;
          text-decoration: underline;
          cursor: pointer;
          margin-top: 4px;
          text-align: center;
        }

        .admin-portal-footer {
          margin-top: 24px;
          padding-top: 18px;
          border-top: 1px solid rgba(223, 190, 132, 0.15);
          text-align: center;
        }

        .admin-cred-hint {
          font-size: 0.74rem;
          color: rgba(229, 237, 232, 0.6);
        }

        .admin-cred-hint strong {
          color: #dfbe84;
        }
      `}</style>
    </div>
  );
}
