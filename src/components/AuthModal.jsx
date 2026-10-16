import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Eye, EyeOff, User, Lock, Mail, ArrowRight, KeyRound, RefreshCw, ShieldCheck } from 'lucide-react';
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

/* ── Premium White Theme Auth Modal ────────────────────────────────────────── */
export default function AuthModal({ isOpen, onClose, onAdminSuccess, onUserSuccess, initialMode = 'login' }) {
    const { login, showToast, API, secureFetch } = useShop();

    // ── ALL HOOKS FIRST — UNCONDITIONAL ───────────────────────────────────────
    const [step,            setStep]            = useState('form');
    const [mode,            setMode]            = useState(initialMode);
    const [showPass,        setShowPass]        = useState(false);
    const [loading,         setLoading]         = useState(false);
    const [error,           setError]           = useState('');
    const [devMode,         setDevMode]         = useState(false);
    const [form,            setForm]            = useState({ name: '', email: '', password: '' });
    const [otp,             setOtp]             = useState('      ');
    const [resendCountdown, setResendCountdown]  = useState(0);

    const countdownRef = useRef(null);

    // Reset when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setStep('form');
            setError('');
            setOtp('      ');
            setForm({ name: '', email: '', password: '' });
            setMode(initialMode);
            setResendCountdown(0);
            setLoading(false);
            setShowPass(false);
        } else {
            setMode(initialMode);
            setError('');
        }
    }, [isOpen, initialMode]);

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
        if (cleanOtp.length !== 6) { setError('Please enter all 6 digits.'); return; }
        setLoading(true);
        setError('');
        try {
            const res = await secureFetch(`${API}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp: cleanOtp }),
            });
            const data = await res.json();
            if (!data.success) { setError(data.message || 'Invalid code.'); setLoading(false); return; }
            login(data.user, data.accessToken, data.refreshToken);
            if (data.user?.role === 'admin') {
                showToast('Welcome back, Admin!');
                if (onAdminSuccess) onAdminSuccess();
                else { window.location.hash = 'admin'; onClose(); }
                return;
            }
            showToast('Welcome back!');
            if (onUserSuccess) onUserSuccess();
            else { window.location.hash = 'account'; onClose(); }
        } catch {
            setError('Could not connect to server. Check if backend is running.');
        }
        setLoading(false);
    }, [otp, API, login, showToast, onClose, onAdminSuccess, onUserSuccess, secureFetch]);

    // Auto-verify when 6 digits are filled
    useEffect(() => {
        if (step === 'otp' && (otp || '').replace(/\s/g, '').length === 6) {
            handleOtpSubmit();
        }
    }, [otp, step, handleOtpSubmit]);

    // Escape key listener
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // ── Input & Form Handlers ─────────────────────────────────────────────────
    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleFormSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (mode === 'signup') {
                const res = await secureFetch(`${API}/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
                });
                const data = await res.json();
                if (!data.success) { setError(data.message); setLoading(false); return; }
                login(data.user, data.accessToken, data.refreshToken);
                showToast('Account created! Welcome to Sahyadri');
                if (onUserSuccess) onUserSuccess();
                else { window.location.hash = 'account'; onClose(); }
            } else {
                const res = await secureFetch(`${API}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: form.email, password: form.password }),
                });
                const data = await res.json();
                if (!data.success) { setError(data.message); setLoading(false); return; }
                if (data.requiresOtp) {
                    setDevMode(data.devMode);
                    setStep('otp');
                    setResendCountdown(60);
                    showToast(data.devMode ? 'Code printed in backend console' : 'Code sent to your email');
                } else {
                    login(data.user, data.accessToken, data.refreshToken);
                    if (data.user?.role === 'admin') {
                        showToast(`Welcome back, Admin!`);
                        if (onAdminSuccess) onAdminSuccess();
                        else { window.location.hash = 'admin'; onClose(); }
                        return;
                    }
                    showToast(`Welcome back, ${data.user.name}`);
                    if (onUserSuccess) onUserSuccess();
                    else { window.location.hash = 'account'; onClose(); }
                }
            }
        } catch {
            setError('Could not connect to server. Please try again.');
        }
        setLoading(false);
    };

    const handleResendOtp = async () => {
        if (resendCountdown > 0) return;
        setOtp('      '); setError(''); setLoading(true);
        try {
            const res = await secureFetch(`${API}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, password: form.password }),
            });
            const data = await res.json();
            if (data.success && data.requiresOtp) {
                setResendCountdown(60);
                showToast(data.devMode ? 'New code in console' : 'New code sent to email');
            }
        } catch { setError('Failed to resend code.'); }
        setLoading(false);
    };

    return (
        <div className="white-auth-backdrop" onClick={onClose} role="dialog" aria-modal="true">
            <div className="white-auth-card" onClick={e => e.stopPropagation()}>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="white-auth-close"
                    aria-label="Close dialog"
                >
                    <X size={18} />
                </button>

                {/* Brand Header */}
                <div className="white-auth-header">
                    <div className="white-auth-logo-badge">
                        <img
                            src="/images/sahyadri-logo.png"
                            alt="Sahyadri"
                            className="white-auth-logo-img"
                        />
                    </div>
                    <h2 className="white-auth-title">
                        {step === 'otp' ? 'Enter Code' : mode === 'login' ? 'Log In' : 'Sign Up'}
                    </h2>
                    <p className="white-auth-subtitle">
                        {step === 'otp'
                            ? (devMode ? 'Enter code from the backend console' : `Sent to ${form.email.replace(/(.{2}).*@/, '$1***@')}`)
                            : mode === 'login'
                                ? 'Welcome back! Enter your details to continue.'
                                : 'Create your account to start shopping.'}
                    </p>
                </div>

                {step === 'otp' ? (
                    /* ── OTP Flow ─────────────────────────────────────────── */
                    <div className="white-auth-body">
                        {devMode && (
                            <div className="white-auth-dev-alert">
                                <ShieldCheck size={14} />
                                <span>Dev Mode: Check backend console for code</span>
                            </div>
                        )}

                        <div className="white-auth-otp-box">
                            <label className="white-auth-label" style={{ textAlign: 'center' }}>
                                6-Digit Verification Code
                            </label>
                            <OtpBoxes value={otp} onChange={setOtp} />
                        </div>

                        {error && (
                            <div className="white-auth-error" role="alert">
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            onClick={handleOtpSubmit}
                            disabled={loading || (otp || '').replace(/\s/g, '').length !== 6}
                            className="white-auth-submit-btn"
                        >
                            <KeyRound size={15} />
                            <span>{loading ? 'Verifying…' : 'Verify Code'}</span>
                        </button>

                        <div className="white-auth-otp-actions">
                            <button
                                onClick={handleResendOtp}
                                disabled={resendCountdown > 0 || loading}
                                className="white-auth-link-btn"
                            >
                                <RefreshCw size={12} className={loading ? 'auth-spin' : ''} />
                                <span>{resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}</span>
                            </button>
                            <span className="white-auth-sep">·</span>
                            <button
                                onClick={() => { setStep('form'); setOtp('      '); setError(''); }}
                                className="white-auth-link-btn"
                            >
                                Back to Log In
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ── Simple Log In / Sign Up Flow ─────────────────────── */
                    <div className="white-auth-body">

                        {/* Crisp Tab Switcher */}
                        <div className="white-auth-tabs" role="tablist">
                            <button
                                type="button"
                                role="tab"
                                aria-selected={mode === 'login'}
                                onClick={() => { setMode('login'); setError(''); }}
                                className={`white-auth-tab ${mode === 'login' ? 'white-auth-tab-active' : ''}`}
                            >
                                Log In
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={mode === 'signup'}
                                onClick={() => { setMode('signup'); setError(''); }}
                                className={`white-auth-tab ${mode === 'signup' ? 'white-auth-tab-active' : ''}`}
                            >
                                Sign Up
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="white-auth-form">
                            {mode === 'signup' && (
                                <div className="white-auth-field">
                                    <label className="white-auth-label" htmlFor="white-name">Name</label>
                                    <div className="white-auth-input-wrap">
                                        <User size={16} className="white-auth-icon" />
                                        <input
                                            id="white-name"
                                            name="name"
                                            type="text"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Your full name"
                                            required
                                            autoComplete="name"
                                            className="white-auth-input"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="white-auth-field">
                                <label className="white-auth-label" htmlFor="white-email">Email</label>
                                <div className="white-auth-input-wrap">
                                    <Mail size={16} className="white-auth-icon" />
                                    <input
                                        id="white-email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        required
                                        autoComplete="email"
                                        className="white-auth-input"
                                    />
                                </div>
                            </div>

                            <div className="white-auth-field">
                                <div className="white-auth-label-row">
                                    <label className="white-auth-label" htmlFor="white-password">Password</label>
                                </div>
                                <div className="white-auth-input-wrap">
                                    <Lock size={16} className="white-auth-icon" />
                                    <input
                                        id="white-password"
                                        name="password"
                                        type={showPass ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter password'}
                                        required
                                        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                                        className="white-auth-input white-auth-pass-input"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(v => !v)}
                                        className="white-auth-eye"
                                        aria-label={showPass ? 'Hide password' : 'Show password'}
                                    >
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="white-auth-error" role="alert">
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="white-auth-submit-btn"
                            >
                                <span>{loading ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Sign Up'}</span>
                                {!loading && <ArrowRight size={15} />}
                            </button>
                        </form>

                        {/* Bottom helper switch */}
                        <div className="white-auth-footer">
                            {mode === 'login' ? (
                                <p className="white-auth-switch-text">
                                    Don't have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => { setMode('signup'); setError(''); }}
                                        className="white-auth-inline-link"
                                    >
                                        Sign Up
                                    </button>
                                </p>
                            ) : (
                                <p className="white-auth-switch-text">
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => { setMode('login'); setError(''); }}
                                        className="white-auth-inline-link"
                                    >
                                        Log In
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                /* ── White Theme Auth Modal ── */
                .white-auth-backdrop {
                    position: fixed;
                    inset: 0;
                    z-index: 2200;
                    background: rgba(10, 24, 18, 0.65);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    animation: whiteAuthFadeIn 0.22s ease-out;
                }

                @keyframes whiteAuthFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                @keyframes whiteAuthScale {
                    from { opacity: 0; transform: translateY(12px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }

                .white-auth-card {
                    background: #ffffff;
                    border: 1px solid rgba(14, 43, 33, 0.1);
                    border-radius: 20px;
                    width: 100%;
                    max-width: 440px;
                    padding: 38px 34px 34px;
                    box-shadow: 0 24px 60px rgba(11, 37, 29, 0.18), 0 4px 16px rgba(11, 37, 29, 0.06);
                    position: relative;
                    animation: whiteAuthScale 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                    box-sizing: border-box;
                }

                .white-auth-close {
                    position: absolute;
                    top: 18px;
                    right: 18px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #f7f5f0;
                    border: 1px solid rgba(14, 43, 33, 0.08);
                    color: #4a5d53;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .white-auth-close:hover {
                    background: #ede8df;
                    color: #0a221a;
                    transform: scale(1.05);
                }

                /* Header */
                .white-auth-header {
                    text-align: center;
                    margin-bottom: 24px;
                }

                .white-auth-logo-badge {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 2px solid #dfbe84;
                    box-shadow: 0 4px 12px rgba(11, 37, 29, 0.1);
                    margin: 0 auto 14px auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #ffffff;
                }

                .white-auth-logo-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .white-auth-title {
                    font-family: var(--font-serif);
                    font-size: 1.65rem;
                    font-weight: 600;
                    color: #0a221a;
                    margin: 0 0 6px 0;
                    letter-spacing: -0.01em;
                }

                .white-auth-subtitle {
                    font-size: 0.84rem;
                    color: #68726c;
                    margin: 0;
                    line-height: 1.5;
                }

                /* Tabs */
                .white-auth-tabs {
                    display: flex;
                    background: #f5f2eb;
                    border-radius: 10px;
                    padding: 4px;
                    margin-bottom: 22px;
                    border: 1px solid rgba(14, 43, 33, 0.06);
                }

                .white-auth-tab {
                    flex: 1;
                    padding: 9px;
                    background: transparent;
                    border: none;
                    border-radius: 8px;
                    font-family: var(--font-sans);
                    font-size: 0.82rem;
                    font-weight: 600;
                    color: #606d66;
                    cursor: pointer;
                    transition: all 0.18s ease;
                    text-align: center;
                }

                .white-auth-tab-active {
                    background: #ffffff;
                    color: #0a221a;
                    box-shadow: 0 2px 8px rgba(11, 37, 29, 0.08);
                }

                /* Form */
                .white-auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .white-auth-field {
                    display: flex;
                    flex-direction: column;
                }

                .white-auth-label-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: baseline;
                    margin-bottom: 6px;
                }

                .white-auth-label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #273e33;
                    letter-spacing: 0.04em;
                    margin-bottom: 6px;
                    display: block;
                }

                .white-auth-helper-note {
                    font-size: 0.68rem;
                    color: #8c733b;
                    font-weight: 500;
                }

                .white-auth-input-wrap {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .white-auth-icon {
                    position: absolute;
                    left: 14px;
                    color: #929d96;
                    pointer-events: none;
                }

                .white-auth-input {
                    width: 100%;
                    padding: 12px 14px 12px 42px;
                    background: #faf9f6;
                    border: 1px solid #d9d4c7;
                    border-radius: 10px;
                    color: #0a221a;
                    font-family: inherit;
                    font-size: 0.9rem;
                    outline: none;
                    transition: all 0.2s ease;
                    box-sizing: border-box;
                }

                .white-auth-input::placeholder {
                    color: #a49f93;
                }

                .white-auth-input:focus {
                    background: #ffffff;
                    border-color: #8c733b;
                    box-shadow: 0 0 0 3px rgba(140, 115, 59, 0.12);
                }

                .white-auth-pass-input {
                    padding-right: 44px;
                }

                .white-auth-eye {
                    position: absolute;
                    right: 12px;
                    background: none;
                    border: none;
                    color: #929d96;
                    cursor: pointer;
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .white-auth-eye:hover {
                    color: #0a221a;
                }

                /* Errors */
                .white-auth-error {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 8px;
                    padding: 10px 14px;
                    color: #b91c1c;
                    font-size: 0.8rem;
                    line-height: 1.4;
                }

                /* Submit Button */
                .white-auth-submit-btn {
                    margin-top: 4px;
                    width: 100%;
                    padding: 13px;
                    background: #0a221a;
                    border: 1px solid #0a221a;
                    border-radius: 10px;
                    color: #dfbe84;
                    font-family: var(--font-sans);
                    font-size: 0.86rem;
                    font-weight: 700;
                    letter-spacing: 0.04em;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.2s ease;
                }

                .white-auth-submit-btn:hover:not(:disabled) {
                    background: #153c2c;
                    border-color: #153c2c;
                    color: #ffffff;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 18px rgba(10, 34, 26, 0.2);
                }

                .white-auth-submit-btn:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                    transform: none;
                }

                /* Footer Switch */
                .white-auth-footer {
                    margin-top: 20px;
                    text-align: center;
                    border-top: 1px solid rgba(14, 43, 33, 0.08);
                    padding-top: 16px;
                }

                .white-auth-switch-text {
                    font-size: 0.82rem;
                    color: #68726c;
                    margin: 0;
                }

                .white-auth-inline-link {
                    background: none;
                    border: none;
                    color: #8c733b;
                    font-weight: 700;
                    cursor: pointer;
                    font-family: inherit;
                    font-size: inherit;
                    padding: 0;
                }
                .white-auth-inline-link:hover {
                    text-decoration: underline;
                    color: #0a221a;
                }

                /* OTP View Elements */
                .white-auth-dev-alert {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    background: #fef9c3;
                    border: 1px solid #fde047;
                    border-radius: 8px;
                    padding: 8px 12px;
                    color: #854d0e;
                    font-size: 0.76rem;
                    font-weight: 600;
                    margin-bottom: 16px;
                }

                .white-auth-otp-box {
                    margin-bottom: 20px;
                }

                .auth-otp-row {
                    display: flex;
                    gap: 8px;
                    justify-content: center;
                    margin-top: 10px;
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
                    border-radius: 10px;
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
                    background: #fbf9f4;
                    border-color: #8c733b;
                }

                .white-auth-otp-actions {
                    margin-top: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                }

                .white-auth-link-btn {
                    background: none;
                    border: none;
                    color: #8c733b;
                    font-size: 0.78rem;
                    font-weight: 600;
                    font-family: inherit;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                }
                .white-auth-link-btn:hover:not(:disabled) {
                    text-decoration: underline;
                    color: #0a221a;
                }
                .white-auth-link-btn:disabled {
                    color: #a49f93;
                    cursor: default;
                }

                .white-auth-sep {
                    color: #c9c3b6;
                }

                @media (max-width: 480px) {
                    .white-auth-card {
                        padding: 30px 20px 24px;
                        border-radius: 16px;
                    }
                    .auth-otp-cell {
                        width: 38px;
                        height: 48px;
                        font-size: 1.25rem;
                    }
                }
            `}</style>
        </div>
    );
}
