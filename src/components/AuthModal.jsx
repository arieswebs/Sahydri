import React, { useState } from 'react';
import { X, Leaf, Eye, EyeOff, User, Lock, Mail } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
    const { login, showToast } = useShop();
    const [mode, setMode] = useState(initialMode);
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        await new Promise(r => setTimeout(r, 800)); // simulate API

        if (mode === 'login') {
            // Admin login
            if (form.email === 'admin@sahyadri.com' && form.password === 'admin123') {
                login({ id: 'USR-001', name: 'Admin Sahyadri', email: form.email, role: 'admin' });
                showToast('Welcome back, Admin!');
                onClose();
            } else if (form.email && form.password.length >= 6) {
                // Mock customer login
                login({
                    id: 'USR-' + Date.now(),
                    name: form.email.split('@')[0],
                    email: form.email,
                    role: 'customer'
                });
                showToast('Welcome back!');
                onClose();
            } else {
                setError('Invalid email or password. Try admin@sahyadri.com / admin123');
            }
        } else {
            // Signup
            if (!form.name.trim()) {
                setError('Please enter your full name');
            } else if (!form.email.includes('@')) {
                setError('Please enter a valid email address');
            } else if (form.password.length < 6) {
                setError('Password must be at least 6 characters');
            } else {
                login({
                    id: 'USR-' + Date.now(),
                    name: form.name,
                    email: form.email,
                    role: 'customer'
                });
                showToast('Account created! Welcome to Sahyadri Gold.');
                onClose();
            }
        }
        setLoading(false);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(6,18,12,0.85)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={onClose}>
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'linear-gradient(145deg, #0e2218, #0a1a13)',
                    border: '1px solid rgba(212,175,55,0.25)',
                    borderRadius: '20px',
                    padding: '40px',
                    width: '100%',
                    maxWidth: '420px',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
                    position: 'relative',
                    animation: 'modalSlideIn 0.3s ease'
                }}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '16px', right: '16px',
                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.2)',
                        borderRadius: '50%', width: '32px', height: '32px',
                        color: '#d4af37', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <X size={16} />
                </button>

                {/* Brand Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Leaf size={22} color="#d4af37" />
                        <span style={{ fontFamily: 'serif', fontSize: '1.4rem', color: '#d4af37', letterSpacing: '0.1em', fontWeight: 700 }}>
                            SAHYADRI GOLD
                        </span>
                    </div>
                    <p style={{ color: 'rgba(212,175,55,0.6)', fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
                    </p>
                </div>

                {/* Tab Toggle */}
                <div style={{
                    display: 'flex', background: 'rgba(255,255,255,0.04)',
                    borderRadius: '10px', padding: '4px', marginBottom: '28px',
                    border: '1px solid rgba(212,175,55,0.12)'
                }}>
                    {['login', 'signup'].map(m => (
                        <button
                            key={m}
                            onClick={() => { setMode(m); setError(''); }}
                            style={{
                                flex: 1, padding: '10px',
                                background: mode === m ? 'linear-gradient(135deg, #d4af37, #b8972f)' : 'transparent',
                                border: 'none', borderRadius: '8px',
                                color: mode === m ? '#0c1f14' : '#a09070',
                                fontWeight: mode === m ? 700 : 500,
                                fontSize: '0.85rem', cursor: 'pointer',
                                letterSpacing: '0.05em', textTransform: 'capitalize',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {m === 'login' ? 'Sign In' : 'Sign Up'}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {mode === 'signup' && (
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', color: '#d4af37', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>
                                Full Name
                            </label>
                            <div style={{ position: 'relative' }}>
                                <User size={15} color="rgba(212,175,55,0.5)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    name="name" type="text" value={form.name} onChange={handleChange}
                                    placeholder="Your full name" required
                                    style={{
                                        width: '100%', padding: '12px 14px 12px 40px', boxSizing: 'border-box',
                                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)',
                                        borderRadius: '10px', color: '#f5e4c3', fontSize: '0.9rem', outline: 'none'
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', color: '#d4af37', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={15} color="rgba(212,175,55,0.5)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                name="email" type="email" value={form.email} onChange={handleChange}
                                placeholder="you@example.com" required
                                style={{
                                    width: '100%', padding: '12px 14px 12px 40px', boxSizing: 'border-box',
                                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)',
                                    borderRadius: '10px', color: '#f5e4c3', fontSize: '0.9rem', outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', color: '#d4af37', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={15} color="rgba(212,175,55,0.5)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange}
                                placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'} required
                                style={{
                                    width: '100%', padding: '12px 44px 12px 40px', boxSizing: 'border-box',
                                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)',
                                    borderRadius: '10px', color: '#f5e4c3', fontSize: '0.9rem', outline: 'none'
                                }}
                            />
                            <button
                                type="button" onClick={() => setShowPass(!showPass)}
                                style={{
                                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(212,175,55,0.5)'
                                }}
                            >
                                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(220,50,50,0.12)', border: '1px solid rgba(220,50,50,0.3)',
                            borderRadius: '8px', padding: '10px 14px', marginBottom: '16px',
                            color: '#ff7070', fontSize: '0.82rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit" disabled={loading}
                        style={{
                            width: '100%', padding: '14px',
                            background: loading ? 'rgba(212,175,55,0.4)' : 'linear-gradient(135deg, #d4af37, #b8972f)',
                            border: 'none', borderRadius: '10px',
                            color: '#0c1f14', fontWeight: 700, fontSize: '0.9rem',
                            letterSpacing: '0.08em', cursor: loading ? 'not-allowed' : 'pointer',
                            textTransform: 'uppercase', transition: 'all 0.2s ease'
                        }}
                    >
                        {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                {mode === 'login' && (
                    <p style={{ textAlign: 'center', marginTop: '16px', color: 'rgba(212,175,55,0.45)', fontSize: '0.75rem' }}>
                        Admin: admin@sahyadri.com / admin123
                    </p>
                )}
            </div>

            <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(-20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
        </div>
    );
}
