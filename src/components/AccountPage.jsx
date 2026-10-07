import React, { useState } from 'react';
import { User, Package, MapPin, Repeat, LogOut, ArrowRight, ChevronRight, CheckCircle2, Leaf } from 'lucide-react';

export default function AccountPage({ onGoHome }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'subscriptions' | 'details'
    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState('Jane');

    // Mock Data
    const mockOrders = [
        {
            id: 'ORD-SG-8439',
            date: 'Oct 02, 2026',
            total: 1240,
            status: 'In Transit',
            items: [
                { name: 'Green Cardamom (Elaichi) 8mm+', qty: 2, image: '/images/products/cardamom_sahydri.jpg' },
                { name: 'Tellicherry Black Pepper', qty: 1, image: '/images/products/cardamom_sahydri.jpg' }
            ]
        },
        {
            id: 'ORD-SG-7102',
            date: 'Sep 15, 2026',
            total: 850,
            status: 'Delivered',
            items: [
                { name: 'Wild Forest Honey', qty: 1, image: '/images/products/cardamom_sahydri.jpg' }
            ]
        }
    ];

    const handleLogin = (e) => {
        e.preventDefault();

        if (authMode === 'signup') {
            const nameInput = e.target.querySelector('input[name="fullName"]');
            if (nameInput && nameInput.value) {
                setUserName(nameInput.value.split(' ')[0]);
            }
        } else {
            setUserName('Jane');
        }

        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            setIsAuthenticated(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1200);
    };

    if (!isAuthenticated) {
        return (
            <div className="account-auth-container">
                <style>{`
                    .account-auth-container {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 120px 20px 60px;
                        background: linear-gradient(135deg, #fcfaf6 0%, #f5f0e6 100%);
                    }
                    .auth-card-premium {
                        width: 100%;
                        max-width: 420px;
                        background: rgba(255, 255, 255, 0.7);
                        backdrop-filter: blur(24px);
                        -webkit-backdrop-filter: blur(24px);
                        border-radius: 20px;
                        padding: 48px 40px;
                        box-shadow: 0 24px 64px rgba(10, 34, 26, 0.05), inset 0 1px 0 rgba(255,255,255,1);
                        border: 1px solid rgba(14, 43, 33, 0.04);
                    }
                    .auth-title {
                        font-family: var(--font-serif);
                        font-size: 2.2rem;
                        color: #0a221a;
                        margin: 0 0 12px;
                        line-height: 1.1;
                    }
                    .auth-subtitle {
                        color: #706859;
                        font-size: 0.95rem;
                        margin: 0;
                        line-height: 1.5;
                    }
                    .auth-input-group {
                        margin-bottom: 24px;
                    }
                    .auth-label {
                        display: block;
                        font-family: var(--font-sans);
                        font-size: 0.75rem;
                        font-weight: 600;
                        color: #384b42;
                        margin-bottom: 8px;
                        text-transform: uppercase;
                        letter-spacing: 0.08em;
                    }
                    .auth-input {
                        width: 100%;
                        padding: 16px 18px;
                        border-radius: 12px;
                        border: 1px solid rgba(14, 43, 33, 0.1);
                        background-color: rgba(255, 255, 255, 0.9);
                        font-size: 1rem;
                        color: #0a221a;
                        outline: none;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .auth-input:focus {
                        border-color: #8c733b;
                        box-shadow: 0 0 0 4px rgba(140, 115, 59, 0.1);
                        background-color: #fff;
                    }
                    .auth-submit-btn {
                        margin-top: 12px;
                        width: 100%;
                        padding: 18px;
                        background-color: #0a221a;
                        color: #dfbe84;
                        border: none;
                        border-radius: 12px;
                        font-size: 0.95rem;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.08em;
                        cursor: pointer;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 12px;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .auth-submit-btn:hover:not(:disabled) {
                        background-color: #1a3328;
                        transform: translateY(-2px);
                        box-shadow: 0 8px 24px rgba(10, 34, 26, 0.15);
                    }
                    .auth-submit-btn:disabled {
                        opacity: 0.8;
                        cursor: wait;
                    }
                    @media (max-width: 480px) {
                        .auth-card-premium {
                            padding: 36px 24px;
                            border-radius: 16px;
                        }
                        .auth-title { font-size: 1.8rem; }
                    }
                `}</style>
                <div className="auth-card-premium">
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 className="auth-title">
                            {authMode === 'login' ? 'Welcome Back' : 'Join Sahyadri'}
                        </h2>
                        <p className="auth-subtitle">
                            {authMode === 'login' ? 'Access your bespoke spice collection.' : 'Experience the rarest spices of the Western Ghats.'}
                        </p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {authMode === 'signup' && (
                                <div className="auth-input-group">
                                    <label className="auth-label">Full Name</label>
                                    <input type="text" name="fullName" required placeholder="Jane Doe" className="auth-input" />
                                </div>
                            )}
                            <div className="auth-input-group">
                                <label className="auth-label">Email Address</label>
                                <input type="email" required placeholder="jane@example.com" className="auth-input" />
                            </div>
                            <div className="auth-input-group" style={{ marginBottom: '16px' }}>
                                <label className="auth-label">Password</label>
                                <input type="password" required placeholder="••••••••" className="auth-input" />
                            </div>

                            {authMode === 'login' && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#505a55', cursor: 'pointer' }}>
                                        <input type="checkbox" style={{ accentColor: '#0a221a', width: '16px', height: '16px' }} /> Remember me
                                    </label>
                                    <a href="#" style={{ fontSize: '0.85rem', color: '#8c733b', textDecoration: 'none', fontWeight: '600' }}>Forgot password?</a>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="auth-submit-btn">
                                {isLoading ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
                                {!isLoading && <ArrowRight size={18} strokeWidth={2} />}
                            </button>
                        </div>
                    </form>

                    <div style={{ marginTop: '36px', textAlign: 'center', fontSize: '0.9rem', color: '#505a55' }}>
                        {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} style={{ background: 'none', border: 'none', color: '#0a221a', fontWeight: '700', cursor: 'pointer', padding: 0, textDecoration: 'underline', textUnderlineOffset: '4px' }}>
                            {authMode === 'login' ? 'Sign up' : 'Log in'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="account-dashboard-wrapper">
            <style>{`
                .account-dashboard-wrapper {
                    padding-top: 100px;
                    padding-bottom: 80px;
                    background-color: #fcfaf6;
                    min-height: 100vh;
                    font-family: var(--font-sans);
                }
                .dashboard-container {
                    max-width: 1140px;
                    margin: 0 auto;
                    padding: 0 24px;
                }
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 48px;
                    padding-bottom: 32px;
                    border-bottom: 1px solid rgba(14, 43, 33, 0.08);
                }
                .dashboard-title {
                    font-family: var(--font-serif);
                    font-size: 2.8rem;
                    color: #0a221a;
                    margin: 0 0 8px;
                    line-height: 1.1;
                }
                .dashboard-layout {
                    display: flex;
                    gap: 48px;
                    align-items: flex-start;
                }
                .dashboard-sidebar {
                    width: 240px;
                    flex-shrink: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    position: sticky;
                    top: 100px;
                }
                .dashboard-tab-btn {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    width: 100%;
                    padding: 16px 20px;
                    background: transparent;
                    border: none;
                    border-radius: 12px;
                    color: #505a55;
                    font-weight: 500;
                    font-size: 0.95rem;
                    cursor: pointer;
                    text-align: left;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .dashboard-tab-btn.active {
                    background: #fff;
                    color: #0a221a;
                    font-weight: 600;
                    box-shadow: 0 8px 24px rgba(10,34,26,0.03);
                }
                .dashboard-tab-btn:hover:not(.active) {
                    color: #0a221a;
                    background: rgba(255,255,255,0.4);
                }
                .dashboard-main {
                    flex: 1;
                    min-width: 0;
                }
                
                /* Order Card Premium */
                .order-card-premium {
                    background: #fff;
                    border-radius: 16px;
                    border: 1px solid rgba(14, 43, 33, 0.04);
                    overflow: hidden;
                    box-shadow: 0 12px 36px rgba(10,34,26,0.02);
                    margin-bottom: 24px;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .order-card-premium:hover {
                    box-shadow: 0 16px 48px rgba(10,34,26,0.04);
                    transform: translateY(-2px);
                }
                .order-header-pane {
                    padding: 20px 28px;
                    background: #faf8f4;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    border-bottom: 1px solid rgba(14, 43, 33, 0.04);
                    gap: 20px;
                }
                .order-pane-label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: #706859;
                    margin-bottom: 6px;
                    font-weight: 600;
                }
                .order-pane-value {
                    font-weight: 600;
                    color: #0a221a;
                    font-size: 1rem;
                }
                .order-body-pane {
                    padding: 28px;
                }
                .pill-status {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 14px;
                    border-radius: 30px;
                    font-size: 0.85rem;
                    font-weight: 700;
                }
                .order-item-row {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    padding: 16px 0;
                    border-bottom: 1px dashed rgba(14, 43, 33, 0.08);
                }
                .order-item-row:last-child {
                    border-bottom: none;
                    padding-bottom: 0;
                }
                .item-thumbnail {
                    width: 64px;
                    height: 64px;
                    background-color: #f5f0e6;
                    border-radius: 12px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                @media (max-width: 860px) {
                    .dashboard-layout {
                        flex-direction: column;
                        gap: 32px;
                    }
                    .dashboard-sidebar {
                        width: 100%;
                        flex-direction: row;
                        overflow-x: auto;
                        padding-bottom: 12px;
                        position: relative;
                        top: 0;
                        -webkit-overflow-scrolling: touch;
                        scrollbar-width: none; /* Firefox */
                    }
                    .dashboard-sidebar::-webkit-scrollbar {
                        display: none;
                    }
                    .dashboard-tab-btn {
                        width: auto;
                        white-space: nowrap;
                        padding: 12px 20px;
                    }
                    .dashboard-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 24px;
                        margin-bottom: 24px;
                        padding-bottom: 24px;
                    }
                    .order-header-pane {
                        grid-template-columns: 1fr 1fr;
                        padding: 16px 20px;
                    }
                    .order-header-pane > div:last-child {
                        grid-column: span 2;
                        margin-top: 4px;
                    }
                    .order-body-pane {
                        padding: 20px;
                    }
                    .order-item-row {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }
                    .order-card-premium {
                        border-radius: 12px;
                    }
                }
            `}</style>

            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">My Account</h1>
                        <p style={{ color: '#706859', margin: 0, fontSize: '1.05rem', lineHeight: 1.5 }}>
                            Welcome back, {userName}. Here's your Sahyadri overview.
                        </p>
                    </div>
                    <button onClick={() => setIsAuthenticated(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#706859', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s', padding: '8px 0' }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#d32f2f'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#706859'}>
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>

                <div className="dashboard-layout">
                    {/* Modern Mobile-Optimized Sidebar */}
                    <div className="dashboard-sidebar">
                        <button className={`dashboard-tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                            <Package size={18} color={activeTab === 'orders' ? '#8c733b' : 'currentColor'} />
                            <span>Order History</span>
                        </button>
                        <button className={`dashboard-tab-btn ${activeTab === 'addresses' ? 'active' : ''}`} onClick={() => setActiveTab('addresses')}>
                            <MapPin size={18} color={activeTab === 'addresses' ? '#8c733b' : 'currentColor'} />
                            <span>Saved Addresses</span>
                        </button>
                        <button className={`dashboard-tab-btn ${activeTab === 'subscriptions' ? 'active' : ''}`} onClick={() => setActiveTab('subscriptions')}>
                            <Repeat size={18} color={activeTab === 'subscriptions' ? '#8c733b' : 'currentColor'} />
                            <span>Subscriptions</span>
                        </button>
                        <button className={`dashboard-tab-btn ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>
                            <User size={18} color={activeTab === 'details' ? '#8c733b' : 'currentColor'} />
                            <span>Account Details</span>
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="dashboard-main">
                        {activeTab === 'orders' && (
                            <div>
                                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#0a221a', margin: '0 0 32px' }}>Order History</h2>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {mockOrders.map((order, idx) => (
                                        <div key={idx} className="order-card-premium">
                                            <div className="order-header-pane">
                                                <div>
                                                    <div className="order-pane-label">Date Placed</div>
                                                    <div className="order-pane-value">{order.date}</div>
                                                </div>
                                                <div>
                                                    <div className="order-pane-label">Total Amount</div>
                                                    <div className="order-pane-value">₹{order.total}</div>
                                                </div>
                                                <div>
                                                    <div className="order-pane-label">Order Number</div>
                                                    <div className="order-pane-value">{order.id}</div>
                                                </div>
                                            </div>

                                            <div className="order-body-pane">
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                                                    <div className="pill-status" style={{ backgroundColor: order.status === 'Delivered' ? '#e8f5e9' : '#fff3e0', color: order.status === 'Delivered' ? '#2e7d32' : '#e65100' }}>
                                                        <CheckCircle2 size={18} />
                                                        <span>{order.status}</span>
                                                        {order.status === 'In Transit' && <span style={{ opacity: 0.8, marginLeft: '4px', fontWeight: '500' }}>• Est Oct 05</span>}
                                                    </div>
                                                    {order.status === 'In Transit' && (
                                                        <button style={{ background: '#0a221a', color: '#dfbe84', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                                            Track Package
                                                        </button>
                                                    )}
                                                </div>

                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    {order.items.map((item, i) => (
                                                        <div key={i} className="order-item-row">
                                                            <div style={{ display: 'flex', gap: '20px', flex: 1, alignItems: 'center' }}>
                                                                <div className="item-thumbnail">
                                                                    {item.image ? (
                                                                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                    ) : (
                                                                        <Leaf size={24} color="#8c733b" opacity={0.5} />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#1a3328', fontWeight: '600' }}>{item.name}</h4>
                                                                    <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: '#706859' }}>Qty: {item.qty}</p>
                                                                </div>
                                                            </div>
                                                            <button style={{ background: 'transparent', border: '1px solid #8c733b', color: '#8c733b', borderRadius: '8px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', alignSelf: 'flex-start' }}>
                                                                Buy Again
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#0a221a', margin: 0 }}>Saved Addresses</h2>
                                    <button style={{ background: '#0a221a', color: '#dfbe84', border: 'none', borderRadius: '8px', padding: '12px 20px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>+ Add New</button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                                    <div style={{ border: '2px solid #8c733b', borderRadius: '16px', padding: '32px', backgroundColor: '#fff', position: 'relative', boxShadow: '0 12px 36px rgba(10,34,26,0.02)' }}>
                                        <div style={{ position: 'absolute', top: '24px', right: '24px', backgroundColor: '#fcfaf6', color: '#8c733b', fontSize: '0.7rem', padding: '6px 12px', borderRadius: '30px', fontWeight: '700', textTransform: 'uppercase', border: '1px solid currentColor' }}>Default</div>
                                        <h3 style={{ margin: '0 0 16px', fontSize: '1.2rem', color: '#0a221a' }}>Jane Doe</h3>
                                        <p style={{ margin: '0 0 6px', fontSize: '1rem', color: '#505a55' }}>Apto 4B, The Residency</p>
                                        <p style={{ margin: '0 0 6px', fontSize: '1rem', color: '#505a55' }}>Marine Drive, Mumbai</p>
                                        <p style={{ margin: '0 0 24px', fontSize: '1rem', color: '#505a55' }}>Maharashtra, 400020, India</p>
                                        <div style={{ display: 'flex', gap: '24px' }}>
                                            <button style={{ background: 'none', border: 'none', color: '#0a221a', fontWeight: '600', fontSize: '0.95rem', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}>Edit</button>
                                            <button style={{ background: 'none', border: 'none', color: '#d32f2f', fontWeight: '600', fontSize: '0.95rem', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'subscriptions' && (
                            <div>
                                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#0a221a', margin: '0 0 12px' }}>My Subscriptions</h2>
                                <p style={{ color: '#706859', marginBottom: '32px', fontSize: '1.05rem', maxWidth: '600px' }}>Manage your recurring deliveries to ensure you never run out of your favorite spices.</p>

                                <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid rgba(14, 43, 33, 0.04)', padding: '32px', display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'center', boxShadow: '0 12px 36px rgba(10,34,26,0.02)' }}>
                                    <div style={{ width: '100px', height: '100px', backgroundColor: '#f5f0e6', borderRadius: '12px', overflow: 'hidden' }}>
                                        <img src="/images/products/cardamom_sahydri.jpg" alt="Item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#e8f5e9', color: '#2e7d32', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', padding: '6px 12px', borderRadius: '6px', marginBottom: '12px' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></div>
                                            Active
                                        </div>
                                        <h3 style={{ margin: '0 0 8px', fontSize: '1.25rem', color: '#0a221a' }}>Green Cardamom (Elaichi) 8mm+</h3>
                                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#505a55', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            Next delivery: Oct 15, 2026 • 200g
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '200px' }}>
                                        <button style={{ border: '2px solid #0a221a', background: 'transparent', color: '#0a221a', padding: '12px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}
                                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#0a221a'; e.currentTarget.style.color = '#fff' }}
                                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#0a221a' }}>
                                            Manage Delivery
                                        </button>
                                        <button style={{ border: 'none', background: 'transparent', color: '#706859', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline' }}>
                                            Skip this shipment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div>
                                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#0a221a', margin: '0 0 32px' }}>Account Details</h2>
                                <form style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#384b42', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Full Name</label>
                                        <input type="text" defaultValue="Jane Doe" style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(14, 43, 33, 0.1)', backgroundColor: '#fff', fontSize: '1rem', color: '#0a221a', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#384b42', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</label>
                                        <input type="email" defaultValue="jane@example.com" style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(14, 43, 33, 0.1)', backgroundColor: '#fff', fontSize: '1rem', color: '#0a221a', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#384b42', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Phone Number</label>
                                        <input type="tel" defaultValue="+91 98765 43210" style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(14, 43, 33, 0.1)', backgroundColor: '#fff', fontSize: '1rem', color: '#0a221a', outline: 'none' }} />
                                    </div>
                                    <button type="button" style={{ background: '#0a221a', color: '#dfbe84', border: 'none', padding: '16px 20px', borderRadius: '12px', fontWeight: '600', marginTop: '12px', cursor: 'pointer', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Save Changes</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
