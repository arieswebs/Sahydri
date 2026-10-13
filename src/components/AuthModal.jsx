import React, { useState, useEffect, useRef } from 'react';
import {
    X, Leaf, Eye, EyeOff, User, Lock, Mail,
    ShieldCheck, RefreshCw, ArrowRight, KeyRound
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

// ─── Shared input style ────────────────────────────────────────────────────────
const inputStyle = {
    width: '100%', padding: '12px 14px 12px 42px', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.22)',
    borderRadius: '10px', color: '#f5e4c3', fontSize: '0.9rem', outline: 'none',
    fontFamily: 'inherit', transition: 'border-color 0.2s',
};
const labelStyle = {
    display: 'block', color: '#d4af37', fontSize: '0.72rem',
    fontWeight: 600, letterSpacing: '0.12em', marginBottom: '7px',
    textTransform: 'uppercase',
};

// ─── OTP digit input boxes ─────────────────────────────────────────────────────
function OtpBoxes({ value, onChange }) {
    const refs = Array.from({ length: 6 }, () => useRef(null));

    const handleKey = (idx, e) => {
        const digits = value.split('');
        if (e.key === 'Backspace') {
            digits[idx] = '';
            onChange(digits.join(''));
            if (idx > 0) refs[idx - 1].current?.focus();
        } else if (/^\d$/.test(e.key)) {
            digits[idx] = e.key;
            onChange(digits.join(''));
            if (idx < 5) refs[idx + 1].current?.focus();
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        onChange(pasted.padEnd(6, '').slice(0, 6));
        refs[Math.min(pasted.length, 5)].current?.focus();
        e.preventDefault();
    };

    return (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '8px 0 4px' }}>
            {Array.from({ length: 6 }).map((_, i) => (
                <input
                    key={i}
                    ref={refs[i]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[i] || ''}
                    onKeyDown={(e) => handleKey(i, e)}
                    onPaste={handlePaste}
                    onChange={() => {}}
                    style={{
                        width: '44px', height: '52px',
                        textAlign: 'center', fontSize: '1.4rem', fontWeight: '800',
                        fontFamily: 'monospace', letterSpacing: 0,
                        background: value[i] ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${value[i] ? '#d4af37' : 'rgba(212,175,55,0.2)'}`,
                        borderRadius: '10px', color: '#d4af37', outline: 'none',
                        transition: 'all 0.15s ease',
                    }}
                />
            ))}
        </div>
    );
}

// ─── Main Modal ────────────────────────────────────────────────────────────────
export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
    const { login, showToast, API } = useShop();

    // step: 'form' | 'otp'
    const [step,     setStep]     = useState('form');
    const [mode,     setMode]     = useState(initialMode);
    const [showPass, setShowPass] = useState(false);
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState('');
    const [devMode,  setDevMode]  = useState(false);

    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [otp,  setOtp]  = useState('');

    // OTP resend countdown
    const [resendCountdown, setResendCountdown] = useState(0);
    const countdownRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            setStep('form'); setError(''); setOtp(''); setForm({ name: '', email: '', password: '' });
            setMode(initialMode); setResendCountdown(0);
        }
    }, [isOpen, initialMode]);

    useEffect(() => {
        if (resendCountdown > 0) {
            countdownRef.current = setTimeout(() => setResendCountdown(c => c - 1), 1000);
        }
        return () => clearTimeout(countdownRef.current);
    }, [resendCountdown]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    // ── Step 1: Login / Signup ─────────────────────────────────────────────────
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mode === 'signup') {
                const res  = await fetch(`${API}/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
                });
                const data = await res.json();
                if (!data.success) { setError(data.message); setLoading(false); return; }
                login(data.user, data.accessToken, data.refreshToken);
                showToast('Welcome to Sahyadri Gold! 🌿');
                onClose();
            } else {
                const res  = await fetch(`${API}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: form.email, password: form.password }),
                });
                const data = await res.json();
                if (!data.success) { setError(data.message); setLoading(false); return; }

                if (data.requiresOtp) {
                    // Admin — go to OTP step
                    setDevMode(data.devMode);
                    setStep('otp');
                    setResendCountdown(60);
                    showToast(data.devMode ? '⚡ Dev: OTP printed in backend console' : '📧 OTP sent to your Gmail');
                } else {
                    // Customer — logged in
                    login(data.user, data.accessToken, data.refreshToken);
                    showToast(`Welcome back, ${data.user.name}! 🌿`);
                    onClose();
                }
            }
        } catch {
            setError('Cannot reach server. Make sure the backend is running.');
        }
        setLoading(false);
    };

    // ── Step 2: OTP Verify ─────────────────────────────────────────────────────
    const handleOtpSubmit = async (e) => {
        e?.preventDefault();
        if (otp.replace(/\s/g, '').length !== 6) { setError('Please enter the 6-digit OTP.'); return; }
        setLoading(true);
        setError('');

        try {
            const res  = await fetch(`${API}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp: otp.trim() }),
            });
            const data = await res.json();
            if (!data.success) { setError(data.message); setLoading(false); return; }
            login(data.user, data.accessToken, data.refreshToken);
            showToast('Welcome back, Admin! 🛡️');
            onClose();
        } catch {
            setError('Cannot reach server.');
        }
        setLoading(false);
    };

    // Auto-submit when all 6 digits entered
    useEffect(() => {
        if (step === 'otp' && otp.length === 6 && !otp.includes(' ')) handleOtpSubmit();
    }, [otp]);

    const handleResendOtp = async () => {
        if (resendCountdown > 0) return;
        setOtp(''); setError(''); setLoading(true);
        try {
            const res  = await fetch(`${API}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, password: form.password }),
            });
            const data = await res.json();
            if (data.success && data.requiresOtp) {
                setResendCountdown(60);
                showToast(data.devMode ? '⚡ New OTP in backend console' : '📧 New OTP sent!');
            }
        } catch { setError('Failed to resend OTP.'); }
        setLoading(false);
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 2000,
                background: 'rgba(4,12,8,0.88)', backdropFilter: 'blur(14px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
            }}
            onClick={onClose}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'linear-gradient(160deg, #0f2619 0%, #080f0c 100%)',
                    border: '1px solid rgba(212,175,55,0.22)',
                    borderRadius: '22px', padding: '42px 40px',
                    width: '100%', maxWidth: '420px',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.1)',
                    position: 'relative', animation: 'modalSlideIn 0.3s ease',
                }}
            >
                {/* Close */}
                <button onClick={onClose} style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.18)',
                    borderRadius: '50%', width: '32px', height: '32px',
                    color: 'rgba(212,175,55,0.7)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <X size={15} />
                </button>

                {/* Brand */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#d4af37,#9a7d25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Leaf size={18} color="#0c1f14" />
                        </div>
                        <span style={{ fontFamily: 'serif', fontSize: '1.3rem', color: '#d4af37', letterSpacing: '0.1em', fontWeight: 700 }}>
                            SAHYADRI
                        </span>
                    </div>
                    <p style={{ color: 'rgba(212,175,55,0.5)', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0 }}>
                        {step === 'otp' ? '🔐 Admin Verification' : mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </p>
                </div>

                {/* ── OTP Step ──────────────────────────────────────────────── */}
                {step === 'otp' ? (
                    <div>
                        <div style={{
                            background: devMode ? 'rgba(229,160,32,0.08)' : 'rgba(76,175,130,0.08)',
                            border: `1px solid ${devMode ? 'rgba(229,160,32,0.25)' : 'rgba(76,175,130,0.25)'}`,
                            borderRadius: '12px', padding: '14px 16px', marginBottom: '24px', textAlign: 'center',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                                {devMode
                                    ? <RefreshCw size={15} color="#e5a020" />
                                    : <Mail size={15} color="#4caf82" />
                                }
                                <span style={{ color: devMode ? '#e5a020' : '#4caf82', fontWeight: 700, fontSize: '0.82rem' }}>
                                    {devMode ? 'Dev Mode — Check Backend Console' : 'OTP Sent to Gmail'}
                                </span>
                            </div>
                            <p style={{ color: 'rgba(245,228,195,0.45)', fontSize: '0.75rem', margin: 0, lineHeight: 1.5 }}>
                                {devMode
                                    ? 'Configure GMAIL_USER in backend/.env to receive real emails.'
                                    : `A 6-digit code was sent to ${form.email.replace(/(.{2}).*@/, '$1***@')}`
                                }
                            </p>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ ...labelStyle, textAlign: 'center', display: 'block', marginBottom: '14px' }}>
                                Enter 6-Digit OTP
                            </label>
                            <OtpBoxes value={otp} onChange={setOtp} />
                            <p style={{ textAlign: 'center', color: 'rgba(245,228,195,0.3)', fontSize: '0.7rem', marginTop: '8px' }}>
                                OTP expires in 10 minutes
                            </p>
                        </div>

                        {error && (
                            <div style={{ background: 'rgba(220,50,50,0.12)', border: '1px solid rgba(220,50,50,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#ff7070', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldCheck size={14} /> {error}
                            </div>
                        )}

                        <button
                            onClick={handleOtpSubmit}
                            disabled={loading || otp.replace(/\D/g, '').length !== 6}
                            style={{
                                width: '100%', padding: '14px',
                                background: loading ? 'rgba(212,175,55,0.3)' : 'linear-gradient(135deg, #d4af37, #b8972f)',
                                border: 'none', borderRadius: '10px',
                                color: '#0c1f14', fontWeight: 800, fontSize: '0.9rem',
                                letterSpacing: '0.08em', cursor: loading ? 'not-allowed' : 'pointer',
                                textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            }}
                        >
                            <KeyRound size={15} />
                            {loading ? 'Verifying…' : 'Verify & Access Admin'}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '16px' }}>
                            <button
                                onClick={handleResendOtp}
                                disabled={resendCountdown > 0}
                                style={{
                                    background: 'none', border: 'none',
                                    color: resendCountdown > 0 ? 'rgba(212,175,55,0.3)' : 'rgba(212,175,55,0.7)',
                                    cursor: resendCountdown > 0 ? 'default' : 'pointer',
                                    fontSize: '0.78rem',
                                }}
                            >
                                {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend OTP'}
                            </button>
                            <span style={{ color: 'rgba(212,175,55,0.3)', margin: '0 8px' }}>·</span>
                            <button
                                onClick={() => { setStep('form'); setOtp(''); setError(''); }}
                                style={{ background: 'none', border: 'none', color: 'rgba(212,175,55,0.5)', cursor: 'pointer', fontSize: '0.78rem' }}
                            >
                                ← Back to login
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ── Login / Signup Form ───────────────────────────────── */
                    <>
                        {/* Tab toggle */}
                        <div style={{
                            display: 'flex', background: 'rgba(255,255,255,0.03)',
                            borderRadius: '10px', padding: '4px', marginBottom: '26px',
                            border: '1px solid rgba(212,175,55,0.1)',
                        }}>
                            {['login', 'signup'].map(m => (
                                <button
                                    key={m}
                                    onClick={() => { setMode(m); setError(''); }}
                                    style={{
                                        flex: 1, padding: '10px',
                                        background: mode === m ? 'linear-gradient(135deg, #d4af37, #b8972f)' : 'transparent',
                                        border: 'none', borderRadius: '8px',
                                        color: mode === m ? '#0c1f14' : '#7a6840',
                                        fontWeight: mode === m ? 700 : 500,
                                        fontSize: '0.85rem', cursor: 'pointer',
                                        letterSpacing: '0.05em', transition: 'all 0.2s ease',
                                    }}
                                >
                                    {m === 'login' ? 'Sign In' : 'Sign Up'}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleFormSubmit}>
                            {mode === 'signup' && (
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={labelStyle}>Full Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={15} color="rgba(212,175,55,0.45)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                                        <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Your full name" required style={inputStyle} className="auth-input" />
                                    </div>
                                </div>
                            )}

                            <div style={{ marginBottom: '16px' }}>
                                <label style={labelStyle}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={15} color="rgba(212,175,55,0.45)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required style={inputStyle} className="auth-input" />
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={labelStyle}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={15} color="rgba(212,175,55,0.45)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        name="password" type={showPass ? 'text' : 'password'} value={form.password}
                                        onChange={handleChange} placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'} required
                                        style={{ ...inputStyle, paddingRight: '44px' }} className="auth-input"
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(212,175,55,0.45)' }}>
                                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div style={{ background: 'rgba(220,50,50,0.12)', border: '1px solid rgba(220,50,50,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#ff7070', fontSize: '0.8rem' }}>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit" disabled={loading}
                                style={{
                                    width: '100%', padding: '14px',
                                    background: loading ? 'rgba(212,175,55,0.3)' : 'linear-gradient(135deg, #d4af37, #b8972f)',
                                    border: 'none', borderRadius: '10px',
                                    color: '#0c1f14', fontWeight: 800, fontSize: '0.9rem',
                                    letterSpacing: '0.08em', cursor: loading ? 'not-allowed' : 'pointer',
                                    textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {loading
                                    ? 'Please wait…'
                                    : <><ArrowRight size={15} />{mode === 'login' ? 'Sign In' : 'Create Account'}</>
                                }
                            </button>
                        </form>

                        {/* Admin hint — only in dev */}
                        {mode === 'login' && (
                            <p style={{ textAlign: 'center', marginTop: '18px', color: 'rgba(212,175,55,0.25)', fontSize: '0.7rem', lineHeight: 1.6 }}>
                                Admin login requires Gmail OTP verification.<br />
                                <span style={{ color: 'rgba(212,175,55,0.15)' }}>admin@sahyadri.com</span>
                            </p>
                        )}
                    </>
                )}
            </div>

            <style>{`
                @keyframes modalSlideIn {
                    from { opacity: 0; transform: translateY(-18px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                .auth-input:focus {
                    border-color: rgba(212,175,55,0.5) !important;
                    box-shadow: 0 0 0 3px rgba(212,175,55,0.08);
                }
            `}</style>
        </div>
    );
}
