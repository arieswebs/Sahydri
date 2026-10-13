import React, { useState } from 'react';
import {
    User, Package, MapPin, Bell, LogOut, ChevronRight,
    Star, Truck, CheckCircle, Clock, RefreshCw, Leaf, Edit3, Save, X
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

const STATUS_META = {
    pending: { label: 'Pending', color: '#e5a020', bg: 'rgba(229,160,32,0.12)', Icon: Clock },
    processing: { label: 'Processing', color: '#4fa3e0', bg: 'rgba(79,163,224,0.12)', Icon: RefreshCw },
    shipped: { label: 'Shipped', color: '#9b7fe8', bg: 'rgba(155,127,232,0.12)', Icon: Truck },
    delivered: { label: 'Delivered', color: '#4caf82', bg: 'rgba(76,175,130,0.12)', Icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: '#e05555', bg: 'rgba(224,85,85,0.12)', Icon: X }
};

// Mock orders for the logged-in customer
const MOCK_ORDERS = [
    {
        id: 'ORD-2024-0021',
        items: [{ name: 'Green Cardamom 8mm+', qty: 2, price: 474, weight: '100g' }],
        total: 948,
        status: 'delivered',
        createdAt: '2024-10-18'
    },
    {
        id: 'ORD-2024-0037',
        items: [
            { name: 'Premium Wild Honey', qty: 1, price: 468, weight: '500g' },
            { name: 'Garam Masala Powder', qty: 1, price: 158, weight: '100g' }
        ],
        total: 626,
        status: 'shipped',
        createdAt: '2024-11-02'
    },
    {
        id: 'ORD-2024-0044',
        items: [{ name: 'Natural Coconut Oil', qty: 2, price: 360, weight: '1L' }],
        total: 720,
        status: 'processing',
        createdAt: '2024-11-19'
    }
];

const SECTIONS = ['Orders', 'Profile', 'Addresses', 'Wishlist'];

export default function CustomerDashboard({ onClose, onViewProduct }) {
    const { currentUser, logout, wishlist, products, showToast } = useShop();
    const [activeSection, setActiveSection] = useState('Orders');
    const [editingProfile, setEditingProfile] = useState(false);
    const [profile, setProfile] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: '+91 98400 12345',
        address: '12A, MG Road, Bangalore – 560001'
    });

    const handleLogout = () => {
        logout();
        showToast('Logged out successfully');
        onClose();
    };

    const wishlistProducts = products.filter(p => wishlist.includes(p.id));

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(6,18,12,0.9)', backdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
            <div style={{
                background: 'linear-gradient(145deg, #0e2218, #091811)',
                border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: '24px', width: '100%', maxWidth: '900px',
                maxHeight: '90vh', overflow: 'hidden',
                boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
                display: 'flex', flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '24px 32px',
                    borderBottom: '1px solid rgba(212,175,55,0.12)',
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.06), transparent)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '52px', height: '52px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #d4af37, #b8972f)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <User size={22} color="#0c1f14" />
                        </div>
                        <div>
                            <div style={{ color: '#f5e4c3', fontWeight: 700, fontSize: '1.05rem', fontFamily: 'serif' }}>
                                {currentUser?.name}
                            </div>
                            <div style={{ color: 'rgba(212,175,55,0.6)', fontSize: '0.78rem' }}>{currentUser?.email}</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={handleLogout}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)',
                                borderRadius: '8px', padding: '8px 14px', color: '#e07070',
                                fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600
                            }}
                        >
                            <LogOut size={14} /> Logout
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.2)',
                                borderRadius: '8px', width: '36px', height: '36px',
                                color: '#d4af37', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    {/* Sidebar */}
                    <div style={{
                        width: '200px', flexShrink: 0,
                        borderRight: '1px solid rgba(212,175,55,0.1)',
                        padding: '20px 12px',
                        display: 'flex', flexDirection: 'column', gap: '4px'
                    }}>
                        {SECTIONS.map(s => {
                            const icons = { Orders: Package, Profile: User, Addresses: MapPin, Wishlist: Star };
                            const Icon = icons[s];
                            const active = activeSection === s;
                            return (
                                <button
                                    key={s}
                                    onClick={() => setActiveSection(s)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        padding: '11px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                        background: active ? 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08))' : 'transparent',
                                        borderLeft: active ? '2px solid #d4af37' : '2px solid transparent',
                                        color: active ? '#d4af37' : 'rgba(245,228,195,0.5)',
                                        fontWeight: active ? 700 : 500, fontSize: '0.85rem',
                                        textAlign: 'left', transition: 'all 0.2s ease'
                                    }}
                                >
                                    <Icon size={16} />
                                    {s}
                                </button>
                            );
                        })}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>

                        {/* ── Orders ── */}
                        {activeSection === 'Orders' && (
                            <div>
                                <h3 style={{ color: '#d4af37', fontFamily: 'serif', fontSize: '1.1rem', marginBottom: '20px', fontWeight: 700 }}>
                                    Order History
                                </h3>
                                {MOCK_ORDERS.map(order => {
                                    const meta = STATUS_META[order.status] || STATUS_META.pending;
                                    const Icon = meta.Icon;
                                    return (
                                        <div key={order.id} style={{
                                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.1)',
                                            borderRadius: '14px', padding: '20px', marginBottom: '14px'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                <div>
                                                    <div style={{ color: '#d4af37', fontWeight: 700, fontSize: '0.88rem', fontFamily: 'monospace' }}>{order.id}</div>
                                                    <div style={{ color: 'rgba(245,228,195,0.4)', fontSize: '0.75rem', marginTop: '2px' }}>
                                                        Placed on {order.createdAt}
                                                    </div>
                                                </div>
                                                <span style={{
                                                    display: 'flex', alignItems: 'center', gap: '5px',
                                                    background: meta.bg, color: meta.color,
                                                    border: `1px solid ${meta.color}40`,
                                                    borderRadius: '20px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700
                                                }}>
                                                    <Icon size={11} /> {meta.label}
                                                </span>
                                            </div>
                                            {order.items.map((item, i) => (
                                                <div key={i} style={{
                                                    display: 'flex', justifyContent: 'space-between',
                                                    color: 'rgba(245,228,195,0.7)', fontSize: '0.83rem', paddingLeft: '8px',
                                                    borderLeft: '2px solid rgba(212,175,55,0.2)', marginBottom: '4px', paddingBlock: '2px'
                                                }}>
                                                    <span>{item.name} ({item.weight}) × {item.qty}</span>
                                                    <span>₹{(item.price * item.qty).toLocaleString()}</span>
                                                </div>
                                            ))}
                                            <div style={{
                                                display: 'flex', justifyContent: 'flex-end',
                                                borderTop: '1px solid rgba(212,175,55,0.1)', marginTop: '12px', paddingTop: '12px',
                                                color: '#d4af37', fontWeight: 700, fontSize: '0.92rem'
                                            }}>
                                                Total: ₹{order.total.toLocaleString()}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* ── Profile ── */}
                        {activeSection === 'Profile' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3 style={{ color: '#d4af37', fontFamily: 'serif', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                                        Account Details
                                    </h3>
                                    <button
                                        onClick={() => setEditingProfile(!editingProfile)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)',
                                            borderRadius: '8px', padding: '7px 14px', color: '#d4af37',
                                            fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600
                                        }}
                                    >
                                        {editingProfile ? <><Save size={13} /> Save</> : <><Edit3 size={13} /> Edit</>}
                                    </button>
                                </div>
                                {[
                                    { label: 'Full Name', key: 'name' },
                                    { label: 'Email', key: 'email' },
                                    { label: 'Phone', key: 'phone' }
                                ].map(field => (
                                    <div key={field.key} style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', color: 'rgba(212,175,55,0.6)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>
                                            {field.label}
                                        </label>
                                        {editingProfile ? (
                                            <input
                                                value={profile[field.key]}
                                                onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                                                style={{
                                                    width: '100%', padding: '11px 14px', boxSizing: 'border-box',
                                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)',
                                                    borderRadius: '10px', color: '#f5e4c3', fontSize: '0.9rem', outline: 'none'
                                                }}
                                            />
                                        ) : (
                                            <div style={{ color: '#f5e4c3', fontSize: '0.9rem', padding: '4px 0' }}>{profile[field.key]}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ── Addresses ── */}
                        {activeSection === 'Addresses' && (
                            <div>
                                <h3 style={{ color: '#d4af37', fontFamily: 'serif', fontSize: '1.1rem', marginBottom: '20px', fontWeight: 700 }}>
                                    Saved Addresses
                                </h3>
                                <div style={{
                                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.15)',
                                    borderRadius: '14px', padding: '20px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <span style={{
                                            background: 'rgba(212,175,55,0.15)', color: '#d4af37', borderRadius: '20px',
                                            padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em'
                                        }}>DEFAULT</span>
                                    </div>
                                    <div style={{ color: '#f5e4c3', fontSize: '0.9rem', lineHeight: 1.7 }}>
                                        {profile.name}<br />
                                        {profile.address}<br />
                                        <span style={{ color: 'rgba(245,228,195,0.5)' }}>{profile.phone}</span>
                                    </div>
                                </div>
                                <button style={{
                                    marginTop: '14px', width: '100%', padding: '12px',
                                    background: 'transparent', border: '1px dashed rgba(212,175,55,0.3)',
                                    borderRadius: '12px', color: 'rgba(212,175,55,0.6)', cursor: 'pointer',
                                    fontSize: '0.85rem', fontWeight: 600
                                }}>
                                    + Add New Address
                                </button>
                            </div>
                        )}

                        {/* ── Wishlist ── */}
                        {activeSection === 'Wishlist' && (
                            <div>
                                <h3 style={{ color: '#d4af37', fontFamily: 'serif', fontSize: '1.1rem', marginBottom: '20px', fontWeight: 700 }}>
                                    My Wishlist ({wishlistProducts.length})
                                </h3>
                                {wishlistProducts.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(245,228,195,0.4)' }}>
                                        <Star size={32} color="rgba(212,175,55,0.3)" style={{ marginBottom: '12px' }} />
                                        <p>Your wishlist is empty. Start exploring our collection!</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
                                        {wishlistProducts.map(p => (
                                            <div
                                                key={p.id}
                                                onClick={() => { onViewProduct(p); onClose(); }}
                                                style={{
                                                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.12)',
                                                    borderRadius: '14px', overflow: 'hidden', cursor: 'pointer',
                                                    transition: 'transform 0.2s ease, border-color 0.2s ease'
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.12)'; }}
                                            >
                                                <img src={p.image} alt={p.name} style={{ width: '100%', height: '130px', objectFit: 'cover' }} />
                                                <div style={{ padding: '12px' }}>
                                                    <div style={{ color: '#f5e4c3', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px', lineHeight: 1.3 }}>{p.name}</div>
                                                    <div style={{ color: '#d4af37', fontWeight: 700, fontSize: '0.9rem' }}>₹{p.price}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
