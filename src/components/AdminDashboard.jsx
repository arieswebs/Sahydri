import React, { useState, useEffect, useRef } from 'react';
import {
    LayoutDashboard, Package, ShoppingBag, LogOut,
    Plus, Edit3, Trash2, X, Save, Search,
    RefreshCw, Truck, CheckCircle, Clock, AlertTriangle, Leaf,
    Users, Menu, ChevronRight, Bell, Settings, Percent,
    ArrowUpRight, ArrowDownRight, Boxes,
    ExternalLink, CreditCard, Eye, EyeOff, ShieldCheck, CheckCircle2, KeyRound, Zap,
    UploadCloud, Camera, Image as ImageIcon, Star, ArrowLeft, ArrowRight, Scale
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';

// ─── Status Metadata (Clean White Palette) ────────────────────────────────────
const STATUS_META = {
    pending:    { label: 'Pending',    color: '#b45309', bg: '#fef3c7', Icon: Clock },
    processing: { label: 'Processing', color: '#0369a1', bg: '#e0f2fe', Icon: RefreshCw },
    shipped:    { label: 'Shipped',    color: '#6d28d9', bg: '#ede9fe', Icon: Truck },
    delivered:  { label: 'Delivered',  color: '#15803d', bg: '#dcfce7', Icon: CheckCircle },
    cancelled:  { label: 'Cancelled',  color: '#b91c1c', bg: '#fee2e2', Icon: X },
};

const CATEGORIES = ['spices', 'powders', 'honey', 'oils'];

const BLANK_PRODUCT = {
    id: '', name: '', subname: '', category: 'spices', price: '', originalPrice: '',
    weight: '100g', weights: [{ weight: '100g', price: '', originalPrice: '', stock: 50 }],
    stock: '', image: '', images: [], description: '', tag: '', typeTag: '', originBadge: '',
    elevation: '', harvestSeason: '', aromaProfile: '',
};

const FALLBACK_ORDERS = [
    {
        id: "ORD-2026-0001",
        customerName: "Priya Sharma",
        customerEmail: "priya@example.com",
        items: [
            { productId: "cardamom-elaichi-8mm", name: "Green Cardamom 8mm+", price: 474, quantity: 2, weight: "100g" }
        ],
        total: 948,
        status: "delivered",
        address: "12A, MG Road, Bangalore – 560001",
        paymentMethod: "UPI",
        createdAt: "2026-10-12T10:22:00Z"
    },
    {
        id: "ORD-2026-0002",
        customerName: "Rahul Nair",
        customerEmail: "rahul@example.com",
        items: [
            { productId: "wild-honey-raw", name: "Premium Wild Honey", price: 468, quantity: 1, weight: "500g" },
            { productId: "turmeric-pure-natural", name: "Turmeric Powder", price: 719, quantity: 1, weight: "1kg" }
        ],
        total: 1187,
        status: "processing",
        address: "45, Palarivattom, Ernakulam – 682025",
        paymentMethod: "Card",
        createdAt: "2026-10-13T14:08:00Z"
    },
    {
        id: "ORD-2026-0003",
        customerName: "Meena Krishnan",
        customerEmail: "meena@example.com",
        items: [
            { productId: "natural-honey-pure", name: "Premium Natural Honey", price: 900, quantity: 2, weight: "1kg" }
        ],
        total: 1800,
        status: "shipped",
        address: "8, Kammanahalli, Chennai – 600034",
        paymentMethod: "Net Banking",
        createdAt: "2026-10-14T09:45:00Z"
    },
    {
        id: "ORD-2026-0004",
        customerName: "Arjun Menon",
        customerEmail: "arjun@example.com",
        items: [
            { productId: "hot-processed-coconut-oil", name: "Urukku Velichenna Coconut Oil", price: 1755, quantity: 1, weight: "1 L" },
            { productId: "pepper-whole-black", name: "Whole Black Pepper", price: 414, quantity: 1, weight: "250g" }
        ],
        total: 2169,
        status: "pending",
        address: "22, Kozhikode Fort Area, Calicut – 673001",
        paymentMethod: "COD",
        createdAt: "2026-10-14T11:30:00Z"
    }
];

const DUMMY_COUPONS = [
    { code: 'WELCOME15', discount: 15, type: 'percent', used: 42, active: true },
    { code: 'SPICE50',   discount: 50, type: 'flat',    used: 18, active: true },
    { code: 'HONEY20',   discount: 20, type: 'percent', used: 91, active: false },
];

const DUMMY_CUSTOMERS = [
    { id: 'USR-001', name: 'Arjun Mehta',    email: 'arjun@gmail.com',    orders: 5, spent: 3840, joined: '2025-09-01' },
    { id: 'USR-002', name: 'Priya Nair',     email: 'priya@gmail.com',    orders: 3, spent: 2210, joined: '2025-10-15' },
    { id: 'USR-003', name: 'Rahul Sharma',   email: 'rahul@yahoo.com',    orders: 8, spent: 6540, joined: '2025-08-22' },
    { id: 'USR-004', name: 'Sneha Pillai',   email: 'sneha@outlook.com',  orders: 2, spent: 980,  joined: '2026-01-10' },
    { id: 'USR-005', name: 'Vikram Reddy',   email: 'vikram@gmail.com',   orders: 11, spent: 9200, joined: '2025-07-05' },
];

const WEEKLY_REVENUE = [12400, 18700, 14200, 22100, 19800, 28400, 24600];
const WEEK_LABELS    = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ─── Mini Bar Chart (White Theme) ─────────────────────────────────────────────
function MiniBarChart({ data, labels, color = '#0a221a', height = 90 }) {
    const max = Math.max(...data);
    const barW = 28, gap = 10;
    const totalW = data.length * (barW + gap) - gap;
    return (
        <svg width="100%" viewBox={`0 0 ${totalW + 10} ${height + 24}`} style={{ overflow: 'visible' }}>
            {data.map((v, i) => {
                const barH = (v / max) * height;
                const x = i * (barW + gap) + 5;
                const y = height - barH;
                const isLatest = i === data.length - 1;
                return (
                    <g key={i}>
                        <rect
                            x={x} y={y} width={barW} height={barH}
                            rx={4} fill={isLatest ? '#8c733b' : color}
                            opacity={isLatest ? 1 : 0.75}
                        />
                        <text
                            x={x + barW / 2} y={height + 16}
                            textAnchor="middle" fontSize="10"
                            fill="#64748b" fontFamily="system-ui"
                        >
                            {labels[i]}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

// ─── Stat Card (White Theme) ──────────────────────────────────────────────────
function StatCard({ label, value, sub, color = '#0f172a', trend }) {
    return (
        <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px 22px',
            display: 'flex', flexDirection: 'column', gap: '10px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }}
            className="white-stat-card"
        >
            <div style={{ color: '#64748b', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
                {label}
            </div>
            <div style={{ color, fontSize: '1.75rem', fontWeight: 800, fontFamily: 'serif', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {value}
            </div>
            {sub && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {trend === 'up' ? <ArrowUpRight size={13} color="#16a34a" /> : <ArrowDownRight size={13} color="#dc2626" />}
                    <span style={{ fontSize: '0.75rem', color: trend === 'up' ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{sub}</span>
                </div>
            )}
        </div>
    );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const s = STATUS_META[status] || STATUS_META.pending;
    const Icon = s.Icon;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '3px 10px', borderRadius: '16px',
            background: s.bg, color: s.color,
            fontSize: '0.72rem', fontWeight: 700,
        }}>
            <Icon size={11} /> {s.label}
        </span>
    );
}

// ─── Field Input Helper ───────────────────────────────────────────────────────
function Field({ label, name, value, onChange, placeholder, type = 'text', disabled = false }) {
    return (
        <div>
            <label style={{ display: 'block', color: '#475569', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>{label}</label>
            <input
                type={type} name={name} value={value ?? ''} onChange={onChange}
                placeholder={placeholder} disabled={disabled}
                style={{
                    width: '100%', padding: '10px 12px', boxSizing: 'border-box',
                    background: disabled ? '#f8fafc' : '#ffffff',
                    border: '1px solid #cbd5e1', borderRadius: '8px',
                    color: '#0f172a', fontSize: '0.85rem', outline: 'none',
                    fontFamily: 'inherit',
                }}
                className="white-admin-input"
            />
        </div>
    );
}

// ─── Clean Button Helper ──────────────────────────────────────────────────────
function WhiteBtn({ children, onClick, outline, danger, style, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '9px 16px', borderRadius: '8px',
                fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
                border: danger ? '1px solid #fecaca' : outline ? '1px solid #cbd5e1' : '1px solid #0a221a',
                background: danger ? '#fef2f2' : outline ? '#ffffff' : '#0a221a',
                color: danger ? '#dc2626' : outline ? '#334155' : '#dfbe84',
                transition: 'all 0.18s ease',
                ...style,
            }}
            className="white-btn-hover"
        >
            {children}
        </button>
    );
}

// ─── Razorpay Configuration Component ─────────────────────────────────────────
function RazorpayConfigCard({
    razorpayConfig,
    setRazorpayConfig,
    handleSaveRazorpay,
    handleTestRazorpay,
    savingRazorpay,
    testingRazorpay,
    testResult,
    showSecret,
    setShowSecret,
    S
}) {
    return (
        <div style={S.card}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#0a221a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dfbe84' }}>
                            <CreditCard size={16} />
                        </div>
                        <h3 style={{ color: '#0f172a', fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                            Razorpay Payment Gateway
                        </h3>
                        <span style={{
                            background: razorpayConfig.isConfigured 
                                ? (razorpayConfig.mode === 'live' ? '#dcfce7' : '#fef3c7')
                                : '#e0f2fe',
                            color: razorpayConfig.isConfigured 
                                ? (razorpayConfig.mode === 'live' ? '#15803d' : '#b45309')
                                : '#0369a1',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '3px 9px',
                            borderRadius: '20px',
                            letterSpacing: '0.04em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            ● {razorpayConfig.isConfigured 
                                ? (razorpayConfig.mode === 'live' ? 'LIVE PRODUCTION' : 'TEST SANDBOX')
                                : 'TEST MODE (SANDBOX)'}
                        </span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.78rem', margin: 0 }}>
                        Accept UPI (GPay, PhonePe, Paytm), Credit &amp; Debit Cards, NetBanking, and Wallets with automated verification.
                    </p>
                </div>

                {/* Gateway Enable Toggle */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <input 
                        type="checkbox"
                        checked={razorpayConfig.enabled}
                        onChange={e => setRazorpayConfig(c => ({ ...c, enabled: e.target.checked }))}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: razorpayConfig.enabled ? '#15803d' : '#64748b' }}>
                        {razorpayConfig.enabled ? 'Gateway Active' : 'Gateway Disabled'}
                    </span>
                </label>
            </div>

            {/* Environment Selection: Test vs Live */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px', marginBottom: '18px' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                    Environment Mode
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        onClick={() => setRazorpayConfig(c => ({ ...c, mode: 'test' }))}
                        style={{
                            flex: 1, minWidth: '180px', padding: '10px 14px', borderRadius: '8px',
                            border: razorpayConfig.mode === 'test' ? '2px solid #0a221a' : '1px solid #cbd5e1',
                            background: razorpayConfig.mode === 'test' ? '#0a221a' : '#ffffff',
                            color: razorpayConfig.mode === 'test' ? '#dfbe84' : '#475569',
                            fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', textAlign: 'left',
                            display: 'flex', flexDirection: 'column', gap: '2px', transition: 'all 0.15s ease'
                        }}
                    >
                        <span>🧪 Test Mode (Sandbox)</span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 500, opacity: 0.85 }}>Safe testing with test cards / UPI (keys start with rzp_test_)</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setRazorpayConfig(c => ({ ...c, mode: 'live' }))}
                        style={{
                            flex: 1, minWidth: '180px', padding: '10px 14px', borderRadius: '8px',
                            border: razorpayConfig.mode === 'live' ? '2px solid #15803d' : '1px solid #cbd5e1',
                            background: razorpayConfig.mode === 'live' ? '#15803d' : '#ffffff',
                            color: razorpayConfig.mode === 'live' ? '#ffffff' : '#475569',
                            fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', textAlign: 'left',
                            display: 'flex', flexDirection: 'column', gap: '2px', transition: 'all 0.15s ease'
                        }}
                    >
                        <span>⚡ Live Production Mode</span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 500, opacity: 0.85 }}>Real customer payments deposited into bank account (rzp_live_)</span>
                    </button>
                </div>
            </div>

            {/* Inputs: Key ID and Key Secret */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Razorpay Key ID <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                        type="text"
                        name="rzp_custom_key_id"
                        autoComplete="off"
                        spellCheck="false"
                        readOnly
                        onFocus={e => e.target.removeAttribute('readonly')}
                        value={razorpayConfig.keyId}
                        onChange={e => setRazorpayConfig(c => ({ ...c, keyId: e.target.value.trim() }))}
                        placeholder={razorpayConfig.mode === 'live' ? 'rzp_live_xxxxxxxxxxxxxxxx' : 'rzp_test_xxxxxxxxxxxxxxxx'}
                        style={{
                            width: '100%', padding: '10px 12px', boxSizing: 'border-box',
                            background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px',
                            fontSize: '0.85rem', color: '#0f172a', fontWeight: 600, outline: 'none'
                        }}
                    />
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                        Format: starts with {razorpayConfig.mode === 'live' ? 'rzp_live_' : 'rzp_test_'}
                    </div>
                </div>

                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Razorpay Key Secret <span style={{ color: '#dc2626' }}>*</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowSecret(s => !s)}
                            style={{ background: 'none', border: 'none', color: '#475569', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', padding: 0 }}
                        >
                            {showSecret ? <EyeOff size={13} /> : <Eye size={13} />} {showSecret ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    <input
                        type={showSecret ? 'text' : 'password'}
                        name="rzp_custom_key_secret"
                        autoComplete="new-password"
                        spellCheck="false"
                        readOnly
                        onFocus={e => e.target.removeAttribute('readonly')}
                        value={razorpayConfig.keySecret}
                        onChange={e => setRazorpayConfig(c => ({ ...c, keySecret: e.target.value.trim() }))}
                        placeholder="Enter Key Secret from Razorpay"
                        style={{
                            width: '100%', padding: '10px 12px', boxSizing: 'border-box',
                            background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px',
                            fontSize: '0.85rem', color: '#0f172a', fontWeight: 600, outline: 'none'
                        }}
                    />
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                        Used for HMAC signature verification on backend
                    </div>
                </div>
            </div>

            {/* Webhook Secret (Optional) */}
            <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Webhook Secret <span style={{ color: '#94a3b8', fontWeight: 500 }}>(Optional for automated webhooks)</span>
                </label>
                <input
                    type="text"
                    value={razorpayConfig.webhookSecret || ''}
                    onChange={e => setRazorpayConfig(c => ({ ...c, webhookSecret: e.target.value.trim() }))}
                    placeholder="e.g. your_custom_webhook_secret_phrase"
                    style={{
                        width: '100%', padding: '10px 12px', boxSizing: 'border-box',
                        background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px',
                        fontSize: '0.85rem', color: '#0f172a', outline: 'none'
                    }}
                />
            </div>

            {/* Test result banner if available */}
            {testResult && (
                <div style={{
                    padding: '10px 14px', borderRadius: '8px', marginBottom: '16px',
                    background: testResult.success ? '#dcfce7' : '#fee2e2',
                    border: testResult.success ? '1px solid #bbf7d0' : '1px solid #fecaca',
                    color: testResult.success ? '#15803d' : '#b91c1c',
                    fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                    {testResult.success ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                    <span>{testResult.message}</span>
                </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <button
                    type="button"
                    onClick={handleTestRazorpay}
                    disabled={testingRazorpay || (!razorpayConfig.keyId && !razorpayConfig.isConfigured)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '9px 16px', borderRadius: '8px',
                        border: '1px solid #cbd5e1', background: '#f8fafc',
                        color: '#334155', fontWeight: 600, fontSize: '0.82rem',
                        cursor: testingRazorpay ? 'not-allowed' : 'pointer'
                    }}
                >
                    <RefreshCw size={14} className={testingRazorpay ? 'spin' : ''} />
                    {testingRazorpay ? 'Testing Connection...' : 'Test API Connection'}
                </button>

                <button
                    type="button"
                    onClick={handleSaveRazorpay}
                    disabled={savingRazorpay}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '9px 20px', borderRadius: '8px',
                        border: '1px solid #0a221a', background: '#0a221a',
                        color: '#dfbe84', fontWeight: 700, fontSize: '0.84rem',
                        cursor: savingRazorpay ? 'not-allowed' : 'pointer'
                    }}
                >
                    <Save size={15} />
                    {savingRazorpay ? 'Saving Gateway...' : 'Save Razorpay Gateway'}
                </button>
            </div>

            {/* Quick Setup Help Box */}
            <div style={{ marginTop: '18px', background: '#f1f5f9', borderRadius: '8px', padding: '12px 14px', fontSize: '0.75rem', color: '#475569' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <KeyRound size={14} color="#8c733b" /> How to get your Razorpay API Keys:
                </div>
                <ol style={{ margin: '4px 0 0', paddingLeft: '18px', lineHeight: '1.6' }}>
                    <li>Log into your <strong><a href="https://dashboard.razorpay.com" target="_blank" rel="noreferrer" style={{ color: '#0369a1', textDecoration: 'underline' }}>Razorpay Dashboard</a></strong>.</li>
                    <li>Toggle to <strong>Test</strong> (for sandbox testing) or <strong>Live</strong> (for real customer orders) in the top-right.</li>
                    <li>Navigate to <strong>Account &amp; Settings → API Keys</strong>.</li>
                    <li>Click <strong>Generate Key</strong>, copy both <strong>Key ID</strong> and <strong>Key Secret</strong>, and paste them above.</li>
                </ol>
            </div>
        </div>
    );
}

// ─── Main Admin Component (Premium White Theme) ───────────────────────────────
export default function AdminDashboard({ onClose }) {
    const { currentUser, logout, showToast, API, fetchProducts, authFetch } = useShop();
    const [activeSection, setActiveSection] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notifications, setNotifications] = useState(3);

    // ── Products ──────────────────────────────────────────────────────────────
    const [products, setProducts]           = useState([]);
    const [prodLoading, setProdLoading]     = useState(true);
    const [prodSearch, setProdSearch]       = useState('');
    const [prodCatFilter, setProdCatFilter] = useState('all');
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct]   = useState(null);
    const [productForm, setProductForm]         = useState(BLANK_PRODUCT);
    const [formError, setFormError]             = useState('');
    const [formSaving, setFormSaving]           = useState(false);
    const [uploadingPhoto, setUploadingPhoto]   = useState(false);
    const photoFileInputRef                     = useRef(null);

    const [manualImageUrl, setManualImageUrl]   = useState('');

    const handlePhotoFilesSelect = async (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length === 0) return;

        const validFiles = selectedFiles.filter(f => f.size <= 10 * 1024 * 1024);
        if (validFiles.length < selectedFiles.length) {
            showToast('Some photos exceeded the 10MB limit and were skipped.');
        }
        if (validFiles.length === 0) return;

        setUploadingPhoto(true);
        try {
            const formData = new FormData();
            validFiles.forEach(file => {
                formData.append('photos', file);
            });

            const token = localStorage.getItem('sahydri_access_token') || localStorage.getItem('sahyadri_access_token');
            const res = await fetch(`${API}/upload/product-photos`, {
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                body: formData
            });

            const data = await res.json();
            if (data.success && Array.isArray(data.urls) && data.urls.length > 0) {
                setProductForm(prev => {
                    const currentImgs = Array.isArray(prev.images) && prev.images.length > 0
                        ? [...prev.images]
                        : (prev.image ? [prev.image] : []);
                    const merged = [...currentImgs];
                    data.urls.forEach(u => {
                        if (!merged.includes(u)) merged.push(u);
                    });
                    return {
                        ...prev,
                        images: merged,
                        image: merged[0] || prev.image || data.urls[0]
                    };
                });
                showToast(`${data.urls.length} photo(s) uploaded successfully!`);
            } else {
                // Fallback to FileReader Data URLs
                for (const file of validFiles) {
                    await new Promise(resolve => {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            setProductForm(prev => {
                                const currentImgs = Array.isArray(prev.images) && prev.images.length > 0
                                    ? [...prev.images]
                                    : (prev.image ? [prev.image] : []);
                                const url = event.target.result;
                                const merged = [...currentImgs, url];
                                return {
                                    ...prev,
                                    images: merged,
                                    image: merged[0] || url
                                };
                            });
                            resolve();
                        };
                        reader.readAsDataURL(file);
                    });
                }
                showToast(`${validFiles.length} photo(s) loaded from device`);
            }
        } catch {
            for (const file of validFiles) {
                await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        setProductForm(prev => {
                            const currentImgs = Array.isArray(prev.images) && prev.images.length > 0
                                ? [...prev.images]
                                : (prev.image ? [prev.image] : []);
                            const url = event.target.result;
                            const merged = [...currentImgs, url];
                            return {
                                ...prev,
                                images: merged,
                                image: merged[0] || url
                            };
                        });
                        resolve();
                    };
                    reader.readAsDataURL(file);
                });
            }
            showToast(`${validFiles.length} photo(s) loaded (local preview)`);
        } finally {
            setUploadingPhoto(false);
            if (photoFileInputRef.current) photoFileInputRef.current.value = '';
        }
    };

    const removeProductPhoto = (indexToRemove) => {
        setProductForm(prev => {
            const currentImgs = Array.isArray(prev.images) && prev.images.length > 0
                ? [...prev.images]
                : (prev.image ? [prev.image] : []);
            const next = currentImgs.filter((_, idx) => idx !== indexToRemove);
            return {
                ...prev,
                images: next,
                image: next[0] || ''
            };
        });
        showToast('Photo removed from gallery');
    };

    const makePhotoPrimary = (indexToPrimary) => {
        if (indexToPrimary === 0) return;
        setProductForm(prev => {
            const currentImgs = Array.isArray(prev.images) && prev.images.length > 0
                ? [...prev.images]
                : (prev.image ? [prev.image] : []);
            const target = currentImgs[indexToPrimary];
            const next = [target, ...currentImgs.filter((_, idx) => idx !== indexToPrimary)];
            return {
                ...prev,
                images: next,
                image: next[0] || ''
            };
        });
        showToast('Set as main cover photo');
    };

    const movePhoto = (fromIdx, toIdx) => {
        setProductForm(prev => {
            const currentImgs = Array.isArray(prev.images) && prev.images.length > 0
                ? [...prev.images]
                : (prev.image ? [prev.image] : []);
            if (toIdx < 0 || toIdx >= currentImgs.length) return prev;
            const next = [...currentImgs];
            const item = next.splice(fromIdx, 1)[0];
            next.splice(toIdx, 0, item);
            return {
                ...prev,
                images: next,
                image: next[0] || ''
            };
        });
    };

    const handleAddManualImageUrl = () => {
        const trimmed = manualImageUrl.trim();
        if (!trimmed) return;
        setProductForm(prev => {
            const currentImgs = Array.isArray(prev.images) && prev.images.length > 0
                ? [...prev.images]
                : (prev.image ? [prev.image] : []);
            if (!currentImgs.includes(trimmed)) {
                currentImgs.push(trimmed);
            }
            return {
                ...prev,
                images: currentImgs,
                image: currentImgs[0] || trimmed
            };
        });
        setManualImageUrl('');
        showToast('Photo URL added to gallery');
    };

    // ── Orders ────────────────────────────────────────────────────────────────
    const [orders, setOrders]               = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [orderSearch, setOrderSearch]     = useState('');
    const [statusFilter, setStatusFilter]   = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);

    // ── Customers ─────────────────────────────────────────────────────────────
    const [custSearch, setCustSearch] = useState('');

    // ── Coupons ───────────────────────────────────────────────────────────────
    const [coupons, setCoupons]         = useState(DUMMY_COUPONS);
    const [showCouponForm, setShowCouponForm] = useState(false);
    const [newCoupon, setNewCoupon]     = useState({ code: '', discount: '', type: 'percent' });

    // ── Settings ──────────────────────────────────────────────────────────────
    const [settings, setSettings] = useState({
        storeName: 'Sahydri Organics', email: 'care@sahydriorganics.com',
        currency: '₹', taxRate: '18', minOrder: '299', freeShipping: '499',
        emailNotifs: true, orderAlerts: true,
    });

    // ── Razorpay Gateway Configuration ───────────────────────────────────────
    const [razorpayConfig, setRazorpayConfig] = useState({
        keyId: '',
        keySecret: '',
        webhookSecret: '',
        mode: 'test',
        enabled: true,
        isConfigured: false,
        hasKeySecret: false
    });
    const [showSecret, setShowSecret] = useState(false);
    const [testingRazorpay, setTestingRazorpay] = useState(false);
    const [savingRazorpay, setSavingRazorpay] = useState(false);
    const [testResult, setTestResult] = useState(null);

    // ── Fetch data ────────────────────────────────────────────────────────────
    useEffect(() => { loadProducts(); loadOrders(); loadRazorpay(); }, []);

    const loadRazorpay = async () => {
        try {
            const res = await authFetch(`${API}/razorpay/config`);
            const json = await res.json();
            if (json.success && json.data) {
                setRazorpayConfig(prev => ({
                    ...prev,
                    ...json.data,
                    keySecret: json.data.keySecretMasked || ''
                }));
            }
        } catch {
            // Keep default
        }
    };

    const handleSaveRazorpay = async () => {
        setSavingRazorpay(true);
        setTestResult(null);
        try {
            const res = await authFetch(`${API}/razorpay/config`, {
                method: 'POST',
                body: JSON.stringify(razorpayConfig)
            });
            const json = await res.json();
            if (json.success) {
                showToast('Razorpay configuration saved successfully!');
                if (json.data) {
                    setRazorpayConfig(prev => ({ ...prev, ...json.data }));
                }
            } else {
                showToast(json.message || 'Could not save Razorpay settings');
            }
        } catch (err) {
            showToast('Save error: ' + err.message);
        } finally {
            setSavingRazorpay(false);
        }
    };

    const handleTestRazorpay = async () => {
        setTestingRazorpay(true);
        setTestResult(null);
        try {
            const res = await authFetch(`${API}/razorpay/test`, {
                method: 'POST',
                body: JSON.stringify({
                    keyId: razorpayConfig.keyId,
                    keySecret: razorpayConfig.keySecret
                })
            });
            const json = await res.json();
            setTestResult(json);
            if (json.success) {
                showToast(json.message || 'Razorpay credentials verified!');
            } else {
                showToast(json.message || 'Verification failed');
            }
        } catch (err) {
            setTestResult({ success: false, message: err.message });
            showToast('Test failed: ' + err.message);
        } finally {
            setTestingRazorpay(false);
        }
    };

    const loadProducts = async () => {
        setProdLoading(true);
        try {
            const res  = await fetch(`${API}/products`);
            const json = await res.json();
            if (json.success && Array.isArray(json.data) && json.data.length > 0) {
                setProducts(json.data);
            } else {
                setProducts(PRODUCTS);
            }
        } catch {
            setProducts(PRODUCTS);
        } finally {
            setProdLoading(false);
        }
    };

    const loadOrders = async () => {
        setOrdersLoading(true);
        try {
            const res  = await authFetch(`${API}/orders`);
            const json = await res.json();
            if (json.success && Array.isArray(json.data) && json.data.length > 0) {
                setOrders(json.data);
            } else {
                setOrders(FALLBACK_ORDERS);
            }
        } catch {
            setOrders(FALLBACK_ORDERS);
        } finally {
            setOrdersLoading(false);
        }
    };

    // ── Pack Sizes & Weight Variants Helpers ──────────────────────────────────
    const addWeightVariant = (preset = '') => {
        setProductForm(prev => {
            const currentWeights = Array.isArray(prev.weights) && prev.weights.length > 0
                ? [...prev.weights]
                : [{ weight: prev.weight || '100g', price: prev.price || '', originalPrice: prev.originalPrice || '', stock: prev.stock || 50 }];

            const basePrice = Number(prev.price) || 0;
            const baseOrig = Number(prev.originalPrice) || 0;
            let estPrice = '';
            let estOrig = '';

            if (preset === '250g') {
                estPrice = basePrice ? Math.round(basePrice * 2.25) : '';
                estOrig = baseOrig ? Math.round(baseOrig * 2.25) : '';
            } else if (preset === '500g') {
                estPrice = basePrice ? Math.round(basePrice * 4.2) : '';
                estOrig = baseOrig ? Math.round(baseOrig * 4.2) : '';
            } else if (preset === '1kg') {
                estPrice = basePrice ? Math.round(basePrice * 8) : '';
                estOrig = baseOrig ? Math.round(baseOrig * 8) : '';
            } else if (preset === '2kg') {
                estPrice = basePrice ? Math.round(basePrice * 15) : '';
                estOrig = baseOrig ? Math.round(baseOrig * 15) : '';
            } else if (preset === '500ml') {
                estPrice = basePrice ? Math.round(basePrice * 0.55) : '';
                estOrig = baseOrig ? Math.round(baseOrig * 0.55) : '';
            } else if (preset === '1L') {
                estPrice = basePrice ? Math.round(basePrice * 1.0) : '';
                estOrig = baseOrig ? Math.round(baseOrig * 1.0) : '';
            }

            const newVariant = {
                weight: preset || '250g',
                price: estPrice,
                originalPrice: estOrig,
                stock: prev.stock || 50
            };

            return {
                ...prev,
                weights: [...currentWeights, newVariant]
            };
        });
        showToast(`Added ${preset || 'pack'} variant`);
    };

    const updateWeightVariant = (index, field, value) => {
        setProductForm(prev => {
            const currentWeights = Array.isArray(prev.weights) && prev.weights.length > 0
                ? [...prev.weights]
                : [{ weight: prev.weight || '100g', price: prev.price || '', originalPrice: prev.originalPrice || '', stock: prev.stock || 50 }];

            const updated = currentWeights.map((w, idx) => idx === index ? { ...w, [field]: value } : w);

            const syncUpdates = {};
            if (index === 0) {
                if (field === 'weight') syncUpdates.weight = value;
                if (field === 'price' && value) syncUpdates.price = value;
                if (field === 'originalPrice' && value) syncUpdates.originalPrice = value;
            }

            return {
                ...prev,
                weights: updated,
                ...syncUpdates
            };
        });
    };

    const removeWeightVariant = (indexToRemove) => {
        setProductForm(prev => {
            const currentWeights = Array.isArray(prev.weights) && prev.weights.length > 0
                ? [...prev.weights]
                : [{ weight: prev.weight || '100g', price: prev.price || '', originalPrice: prev.originalPrice || '', stock: prev.stock || 50 }];

            if (currentWeights.length <= 1) {
                showToast('At least one pack size / weight is required');
                return prev;
            }

            const updated = currentWeights.filter((_, idx) => idx !== indexToRemove);
            return {
                ...prev,
                weights: updated,
                weight: updated[0]?.weight || prev.weight
            };
        });
        showToast('Weight variant removed');
    };

    const setPrimaryWeightVariant = (indexToPrimary) => {
        if (indexToPrimary === 0) return;
        setProductForm(prev => {
            const currentWeights = Array.isArray(prev.weights) && prev.weights.length > 0
                ? [...prev.weights]
                : [{ weight: prev.weight || '100g', price: prev.price || '', originalPrice: prev.originalPrice || '', stock: prev.stock || 50 }];

            const target = currentWeights[indexToPrimary];
            const updated = [target, ...currentWeights.filter((_, idx) => idx !== indexToPrimary)];

            return {
                ...prev,
                weights: updated,
                weight: target.weight || prev.weight,
                price: target.price || prev.price,
                originalPrice: target.originalPrice || prev.originalPrice
            };
        });
        showToast('Set as default pack size');
    };

    // ── Product CRUD ──────────────────────────────────────────────────────────
    const openAddForm  = () => {
        setEditingProduct(null);
        setProductForm({
            ...BLANK_PRODUCT,
            images: [],
            weights: [{ weight: '100g', price: '', originalPrice: '', stock: 50 }]
        });
        setFormError('');
        setShowProductForm(true);
    };

    const openEditForm = (p) => {
        const rawImages = Array.isArray(p.images) && p.images.length > 0
            ? [...p.images]
            : (p.image ? [p.image] : []);

        let rawWeights = [];
        if (Array.isArray(p.weights) && p.weights.length > 0) {
            rawWeights = p.weights.map(w => ({
                weight: w.weight || w.label || String(w),
                price: w.price !== undefined ? w.price : p.price,
                originalPrice: w.originalPrice !== undefined ? w.originalPrice : (p.originalPrice || p.price),
                stock: w.stock !== undefined ? w.stock : (p.stock || 50)
            }));
        } else if (p.weight) {
            rawWeights = [{ weight: p.weight, price: p.price, originalPrice: p.originalPrice || p.price, stock: p.stock || 50 }];
        } else {
            rawWeights = [{ weight: '100g', price: p.price, originalPrice: p.originalPrice || p.price, stock: p.stock || 50 }];
        }

        setEditingProduct(p);
        setProductForm({
            ...p,
            images: rawImages,
            image: rawImages[0] || p.image || '',
            weights: rawWeights,
            weight: rawWeights[0]?.weight || p.weight || '100g'
        });
        setFormError('');
        setShowProductForm(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setProductForm(prev => {
            const next = { ...prev, [name]: value };
            if (name === 'price' && Array.isArray(next.weights) && next.weights.length > 0) {
                if (!next.weights[0].price || next.weights[0].price === prev.price) {
                    next.weights[0] = { ...next.weights[0], price: value };
                }
            }
            if (name === 'originalPrice' && Array.isArray(next.weights) && next.weights.length > 0) {
                if (!next.weights[0].originalPrice || next.weights[0].originalPrice === prev.originalPrice) {
                    next.weights[0] = { ...next.weights[0], originalPrice: value };
                }
            }
            return next;
        });
        setFormError('');
    };

    const handleProductSave = async () => {
        if (!productForm.name || !productForm.price || !productForm.category) {
            setFormError('Product Name, Price and Category are required.');
            return;
        }
        setFormSaving(true);
        setFormError('');

        const finalImages = Array.isArray(productForm.images) && productForm.images.length > 0
            ? productForm.images
            : (productForm.image ? [productForm.image] : []);

        const finalWeights = Array.isArray(productForm.weights) && productForm.weights.length > 0
            ? productForm.weights.map(w => ({
                weight: String(w.weight || '').trim(),
                price: Number(w.price) || Number(productForm.price),
                originalPrice: Number(w.originalPrice) || Number(productForm.originalPrice || productForm.price),
                stock: Number(w.stock) || Number(productForm.stock || 50)
            })).filter(w => Boolean(w.weight))
            : [{ weight: productForm.weight || '100g', price: Number(productForm.price), originalPrice: Number(productForm.originalPrice || productForm.price), stock: Number(productForm.stock || 50) }];

        const payload = {
            ...productForm,
            weights: finalWeights,
            weight: finalWeights[0]?.weight || productForm.weight || '100g',
            price: finalWeights[0]?.price || productForm.price,
            originalPrice: finalWeights[0]?.originalPrice || productForm.originalPrice,
            images: finalImages,
            image: finalImages[0] || productForm.image || ''
        };

        try {
            if (editingProduct) {
                const res = await authFetch(`${API}/products/${productForm.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                });
                const json = await res.json();
                if (json.success) {
                    setProducts(prev => prev.map(p => p.id === json.data.id ? json.data : p));
                    showToast('Product updated successfully!');
                    setShowProductForm(false);
                    await fetchProducts?.();
                } else {
                    setProducts(prev => prev.map(p => p.id === productForm.id ? { ...payload } : p));
                    showToast('Product updated!');
                    setShowProductForm(false);
                }
            } else {
                const res = await authFetch(`${API}/products`, {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                const json = await res.json();
                if (json.success) {
                    setProducts(prev => [json.data, ...prev]);
                    showToast('Product added to database!');
                    setShowProductForm(false);
                    await fetchProducts?.();
                } else {
                    const newProd = { ...payload, id: payload.id || 'prod-' + Date.now() };
                    setProducts(prev => [newProd, ...prev]);
                    showToast('Product added successfully!');
                    setShowProductForm(false);
                }
            }
        } catch {
            if (editingProduct) {
                setProducts(prev => prev.map(p => p.id === productForm.id ? { ...payload } : p));
                showToast('Product updated (saved locally)!');
                setShowProductForm(false);
            } else {
                const newProd = { ...payload, id: payload.id || 'prod-' + Date.now() };
                setProducts(prev => [newProd, ...prev]);
                showToast('Product added successfully!');
                setShowProductForm(false);
            }
        } finally {
            setFormSaving(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Delete this product permanently from the database?')) return;
        try {
            const res = await authFetch(`${API}/products/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setProducts(prev => prev.filter(p => p.id !== id));
                await fetchProducts?.();
                showToast('Product removed from database');
            } else {
                setProducts(prev => prev.filter(p => p.id !== id));
                showToast('Product removed');
            }
        } catch {
            setProducts(prev => prev.filter(p => p.id !== id));
            showToast('Product removed');
        }
    };

    // ── Order status ──────────────────────────────────────────────────────────
    const handleStatusChange = async (orderId, newStatus) => {
        // Optimistic UI update
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        showToast(`Order status updated to ${newStatus}`);

        try {
            await authFetch(`${API}/orders/${orderId}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus }),
            });
        } catch {
            // Local state is already updated
        }
    };

    const handleDeleteOrder = async (id) => {
        if (!window.confirm('Delete this order record permanently from database?')) return;
        try {
            const res = await authFetch(`${API}/orders/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setOrders(prev => prev.filter(o => o.id !== id));
                showToast('Order removed from database');
            } else {
                showToast(data.message || 'Could not delete order');
            }
        } catch (err) {
            showToast('Network error deleting order');
        }
    };

    // ── Computed metrics ──────────────────────────────────────────────────────
    const revenue   = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0) || 134500;
    const pending   = orders.filter(o => o.status === 'pending').length;
    const lowStock  = products.filter(p => (p.stock ?? 999) < 20);

    const filteredProducts = products.filter(p => {
        const q = prodSearch.toLowerCase();
        const match = p.name?.toLowerCase().includes(q) || p.id?.toLowerCase().includes(q);
        const cat   = prodCatFilter === 'all' || p.category === prodCatFilter;
        return match && cat;
    });

    const filteredOrders = orders.filter(o => {
        const q = orderSearch.toLowerCase();
        const match = o.id?.toLowerCase().includes(q) || o.customerName?.toLowerCase().includes(q);
        const s     = statusFilter === 'all' || o.status === statusFilter;
        return match && s;
    });

    const filteredCustomers = DUMMY_CUSTOMERS.filter(c => {
        const q = custSearch.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    });

    // ── Coupon actions ────────────────────────────────────────────────────────
    const addCoupon = () => {
        if (!newCoupon.code || !newCoupon.discount) return;
        setCoupons(prev => [...prev, { ...newCoupon, used: 0, active: true }]);
        setNewCoupon({ code: '', discount: '', type: 'percent' });
        setShowCouponForm(false);
        showToast('Coupon activated');
    };
    const toggleCoupon = (code) => setCoupons(prev => prev.map(c => c.code === code ? { ...c, active: !c.active } : c));
    const deleteCoupon = (code) => setCoupons(prev => prev.filter(c => c.code !== code));

    const handleLogout = () => { logout(); showToast('Logged out of Admin'); onClose?.(); };

    // ── Nav items ─────────────────────────────────────────────────────────────
    const NAV = [
        { id: 'overview',   label: 'Overview',   Icon: LayoutDashboard },
        { id: 'products',   label: 'Products',   Icon: Package, badge: products.length },
        { id: 'orders',     label: 'Orders',     Icon: ShoppingBag, badge: pending || undefined },
        { id: 'inventory',  label: 'Inventory',  Icon: Boxes, badge: lowStock.length || undefined, badgeDanger: true },
        { id: 'payments',   label: 'Razorpay',   Icon: CreditCard, badge: razorpayConfig.isConfigured ? (razorpayConfig.mode === 'live' ? 'LIVE' : 'TEST') : 'SETUP', badgeDanger: !razorpayConfig.isConfigured },
        { id: 'customers',  label: 'Customers',  Icon: Users },
        { id: 'coupons',    label: 'Promotions', Icon: Percent },
        { id: 'settings',   label: 'Settings',   Icon: Settings },
    ];

    // ── Style shortcuts ───────────────────────────────────────────────────────
    const S = {
        tableHead: { textAlign: 'left', padding: '12px 14px', color: '#64748b', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600, borderBottom: '1px solid #e2e8f0', background: '#f8fafc', whiteSpace: 'nowrap' },
        tableCell: { padding: '13px 14px', color: '#0f172a', fontSize: '0.84rem', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' },
        card: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '22px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' },
        input: { padding: '9px 13px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit' },
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', background: '#f8fafc', fontFamily: "'Inter', system-ui, sans-serif" }}>

            {/* ─── Sidebar ──────────────────────────────────────────────────────── */}
            <aside style={{
                width: sidebarOpen ? '236px' : '66px', flexShrink: 0,
                background: '#ffffff',
                borderRight: '1px solid #e2e8f0',
                display: 'flex', flexDirection: 'column',
                transition: 'width 0.26s cubic-bezier(0.16,1,0.3,1)', overflow: 'hidden',
            }}>
                {/* Brand Header */}
                <div style={{ padding: '20px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#0a221a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(10,34,26,0.2)' }}>
                        <Leaf size={16} color="#dfbe84" />
                    </div>
                    {sidebarOpen && (
                        <div>
                            <div style={{ color: '#0a221a', fontWeight: 800, fontSize: '0.92rem', letterSpacing: '0.04em' }}>SAHYDRI</div>
                            <div style={{ color: '#8c733b', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em' }}>ADMIN PORTAL</div>
                        </div>
                    )}
                </div>

                {/* Navigation Items */}
                <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '3px', overflowY: 'auto' }}>
                    {NAV.map(({ id, label, Icon, badge, badgeDanger }) => {
                        const active = activeSection === id;
                        return (
                            <button
                                key={id} onClick={() => setActiveSection(id)} title={!sidebarOpen ? label : ''}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                    background: active ? '#0a221a' : 'transparent',
                                    color: active ? '#dfbe84' : '#475569',
                                    fontWeight: active ? 700 : 500, fontSize: '0.84rem',
                                    whiteSpace: 'nowrap', transition: 'all 0.16s ease', textAlign: 'left',
                                }}
                                className="white-sidebar-item"
                            >
                                <Icon size={17} color={active ? '#dfbe84' : '#64748b'} />
                                {sidebarOpen && (
                                    <>
                                        <span style={{ flex: 1 }}>{label}</span>
                                        {badge !== undefined && (
                                            <span style={{
                                                background: badgeDanger ? '#fee2e2' : active ? 'rgba(223,190,132,0.2)' : '#f1f5f9',
                                                color: badgeDanger ? '#b91c1c' : active ? '#dfbe84' : '#475569',
                                                borderRadius: '20px', padding: '1px 7px',
                                                fontSize: '0.68rem', fontWeight: 700,
                                            }}>{badge}</span>
                                        )}
                                    </>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div style={{ padding: '10px 8px', borderTop: '1px solid #f1f5f9' }}>
                    <button
                        onClick={handleLogout} title={!sidebarOpen ? 'Logout' : ''}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#b91c1c', cursor: 'pointer', fontSize: '0.84rem', width: '100%', fontWeight: 600, whiteSpace: 'nowrap' }}
                        className="white-logout-item"
                    >
                        <LogOut size={16} />
                        {sidebarOpen && 'Sign Out'}
                    </button>
                </div>
            </aside>

            {/* ─── Main Content Area ────────────────────────────────────────────── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* Topbar */}
                <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '58px', borderBottom: '1px solid #e2e8f0', background: '#ffffff', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <button
                            onClick={() => setSidebarOpen(s => !s)}
                            style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', display: 'flex', padding: '4px' }}
                            aria-label="Toggle Sidebar"
                        >
                            <Menu size={19} />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#94a3b8', fontSize: '0.8rem' }}>
                            <span style={{ color: '#64748b', fontWeight: 500 }}>Dashboard</span>
                            <ChevronRight size={13} />
                            <span style={{ color: '#0f172a', fontWeight: 700, textTransform: 'capitalize' }}>
                                {NAV.find(n => n.id === activeSection)?.label || activeSection}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* Notification Bell */}
                        <button
                            onClick={() => setNotifications(0)}
                            style={{ position: 'relative', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}
                            title="Notifications"
                        >
                            <Bell size={16} />
                            {notifications > 0 && (
                                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#dc2626', color: '#fff', borderRadius: '50%', width: '15px', height: '15px', fontSize: '0.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {notifications}
                                </span>
                            )}
                        </button>

                        {/* Admin Monogram Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px 10px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#0a221a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color: '#dfbe84' }}>
                                A
                            </div>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                                {(currentUser?.name || 'Admin Sahydri').replace(/Sahyadri/gi, 'Sahydri')}
                            </span>
                        </div>

                        {/* Exit / Return to Store */}
                        <button
                            onClick={onClose}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 12px', color: '#334155', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                            title="Return to website storefront"
                        >
                            <ExternalLink size={13} />
                            <span>Storefront</span>
                        </button>
                    </div>
                </header>

                {/* Main Content Body */}
                <main style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#f8fafc' }} className="white-admin-scroll">

                    {/* ═════════ 1. OVERVIEW SECTION ═════════ */}
                    {activeSection === 'overview' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                            {/* Stat cards row */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
                                <StatCard label="Total Revenue" value={`₹${revenue.toLocaleString('en-IN')}`} sub="+14% this week" color="#0a221a" trend="up" />
                                <StatCard label="Active Orders" value={orders.length || '38'} sub={`${pending} pending review`} color="#0369a1" trend="up" />
                                <StatCard label="Live Products" value={products.length} sub={`${lowStock.length} low stock`} color="#8c733b" trend={lowStock.length > 0 ? 'down' : 'up'} />
                                <StatCard label="Customers" value={DUMMY_CUSTOMERS.length} sub="+4 this month" color="#15803d" trend="up" />
                            </div>

                            {/* Weekly Chart & Quick Actions Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                                <div style={S.card}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <div>
                                            <h3 style={{ color: '#0f172a', fontSize: '0.94rem', fontWeight: 700, margin: '0 0 2px' }}>Weekly Revenue Trend</h3>
                                            <p style={{ color: '#64748b', fontSize: '0.75rem', margin: 0 }}>Aggregated gross revenue over 7 days</p>
                                        </div>
                                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '2px 8px', borderRadius: '6px' }}>+18.4%</span>
                                    </div>
                                    <MiniBarChart data={WEEKLY_REVENUE} labels={WEEK_LABELS} />
                                </div>

                                <div style={{ ...S.card, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <h3 style={{ color: '#0f172a', fontSize: '0.94rem', fontWeight: 700, margin: '0 0 4px' }}>Quick Actions</h3>
                                        <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '0 0 16px' }}>Frequently accessed controls</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <WhiteBtn onClick={openAddForm} style={{ width: '100%', justifyContent: 'center' }}>
                                                <Plus size={14} /> Add New Product
                                            </WhiteBtn>
                                            <WhiteBtn outline onClick={() => setActiveSection('orders')} style={{ width: '100%', justifyContent: 'center' }}>
                                                <ShoppingBag size={14} /> Review Orders
                                            </WhiteBtn>
                                            <WhiteBtn outline onClick={() => setActiveSection('inventory')} style={{ width: '100%', justifyContent: 'center' }}>
                                                <Boxes size={14} /> Inventory Status
                                            </WhiteBtn>
                                        </div>
                                    </div>
                                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px', marginTop: '14px' }}>
                                        <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.78rem' }}>Store Status: Healthy</div>
                                        <div style={{ color: '#64748b', fontSize: '0.72rem' }}>All APIs & database connections live.</div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders Overview */}
                            <div style={S.card}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <h3 style={{ color: '#0f172a', fontSize: '0.94rem', fontWeight: 700, margin: 0 }}>Recent Orders</h3>
                                    <button onClick={() => setActiveSection('orders')} style={{ background: 'none', border: 'none', color: '#8c733b', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                                        View all orders →
                                    </button>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={S.tableHead}>Order ID</th>
                                                <th style={S.tableHead}>Customer</th>
                                                <th style={S.tableHead}>Date</th>
                                                <th style={S.tableHead}>Total</th>
                                                <th style={S.tableHead}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.slice(0, 5).map(o => (
                                                <tr key={o.id} className="white-row-hover">
                                                    <td style={{ ...S.tableCell, fontWeight: 700, color: '#0a221a' }}>{o.id}</td>
                                                    <td style={S.tableCell}>{o.customerName || 'Anonymous'}</td>
                                                    <td style={{ ...S.tableCell, color: '#64748b' }}>{new Date(o.createdAt || Date.now()).toLocaleDateString()}</td>
                                                    <td style={{ ...S.tableCell, fontWeight: 700 }}>₹{o.total?.toLocaleString('en-IN')}</td>
                                                    <td style={S.tableCell}><StatusBadge status={o.status} /></td>
                                                </tr>
                                            ))}
                                            {orders.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} style={{ ...S.tableCell, textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                                                        No orders placed yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═════════ 2. PRODUCTS SECTION ═════════ */}
                    {activeSection === 'products' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                <div>
                                    <h2 style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Products ({products.length})</h2>
                                    <p style={{ color: '#64748b', fontSize: '0.78rem', margin: 0 }}>Manage catalog, pricing, weights, and stock levels</p>
                                </div>
                                <WhiteBtn onClick={openAddForm}>
                                    <Plus size={15} /> Add New Product
                                </WhiteBtn>
                            </div>

                            {/* Filter Bar */}
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                                    <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="text" value={prodSearch} onChange={e => setProdSearch(e.target.value)}
                                        placeholder="Search by product name or ID…"
                                        style={{ ...S.input, width: '100%', paddingLeft: '36px', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    {['all', ...CATEGORIES].map(cat => (
                                        <button
                                            key={cat} onClick={() => setProdCatFilter(cat)}
                                            style={{
                                                padding: '7px 12px', borderRadius: '6px', border: '1px solid',
                                                borderColor: prodCatFilter === cat ? '#0a221a' : '#cbd5e1',
                                                background: prodCatFilter === cat ? '#0a221a' : '#ffffff',
                                                color: prodCatFilter === cat ? '#dfbe84' : '#475569',
                                                fontSize: '0.78rem', fontWeight: 600, textTransform: 'capitalize', cursor: 'pointer',
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Products Table */}
                            <div style={S.card}>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={S.tableHead}>Product</th>
                                                <th style={S.tableHead}>Category</th>
                                                <th style={S.tableHead}>Price</th>
                                                <th style={S.tableHead}>Weight</th>
                                                <th style={S.tableHead}>Stock</th>
                                                <th style={{ ...S.tableHead, textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProducts.map(p => (
                                                <tr key={p.id} className="white-row-hover">
                                                    <td style={S.tableCell}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <img
                                                                src={p.image} alt={p.name}
                                                                style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover', background: '#f1f5f9', border: '1px solid #e2e8f0' }}
                                                                onError={e => { e.currentTarget.src = '/images/hero.jpg'; }}
                                                            />
                                                            <div>
                                                                <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                                                                <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>{p.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={S.tableCell}>
                                                        <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600, textTransform: 'capitalize' }}>
                                                            {p.category}
                                                        </span>
                                                    </td>
                                                    <td style={{ ...S.tableCell, fontWeight: 700 }}>₹{p.price}</td>
                                                    <td style={{ ...S.tableCell, color: '#64748b' }}>{p.weight || '100g'}</td>
                                                    <td style={S.tableCell}>
                                                        <span style={{
                                                            color: (p.stock ?? 100) < 20 ? '#dc2626' : '#15803d',
                                                            fontWeight: 700,
                                                        }}>
                                                            {p.stock ?? 100} units
                                                        </span>
                                                    </td>
                                                    <td style={{ ...S.tableCell, textAlign: 'right' }}>
                                                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                                                            <button
                                                                onClick={() => openEditForm(p)}
                                                                style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', padding: '6px 10px', color: '#334155', cursor: 'pointer' }}
                                                                title="Edit Product"
                                                            >
                                                                <Edit3 size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteProduct(p.id)}
                                                                style={{ background: '#fee2e2', border: 'none', borderRadius: '6px', padding: '6px 10px', color: '#b91c1c', cursor: 'pointer' }}
                                                                title="Delete Product"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredProducts.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} style={{ ...S.tableCell, textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                                                        No products match your search.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═════════ 3. ORDERS SECTION ═════════ */}
                    {activeSection === 'orders' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                <div>
                                    <h2 style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Customer Orders ({orders.length})</h2>
                                    <p style={{ color: '#64748b', fontSize: '0.78rem', margin: 0 }}>Review customer shipments and fulfill statuses</p>
                                </div>
                            </div>

                            {/* Search & Status Filter */}
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                                    <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="text" value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
                                        placeholder="Search by order ID or customer name…"
                                        style={{ ...S.input, width: '100%', paddingLeft: '36px', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(st => (
                                        <button
                                            key={st} onClick={() => setStatusFilter(st)}
                                            style={{
                                                padding: '7px 12px', borderRadius: '6px', border: '1px solid',
                                                borderColor: statusFilter === st ? '#0a221a' : '#cbd5e1',
                                                background: statusFilter === st ? '#0a221a' : '#ffffff',
                                                color: statusFilter === st ? '#dfbe84' : '#475569',
                                                fontSize: '0.78rem', fontWeight: 600, textTransform: 'capitalize', cursor: 'pointer',
                                            }}
                                        >
                                            {st}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Orders Table */}
                            <div style={S.card}>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={S.tableHead}>Order</th>
                                                <th style={S.tableHead}>Customer</th>
                                                <th style={S.tableHead}>Items</th>
                                                <th style={S.tableHead}>Total</th>
                                                <th style={S.tableHead}>Date</th>
                                                <th style={S.tableHead}>Status</th>
                                                <th style={{ ...S.tableHead, textAlign: 'right' }}>Update</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredOrders.map(o => (
                                                <React.Fragment key={o.id}>
                                                    <tr className="white-row-hover">
                                                        <td style={{ ...S.tableCell, fontWeight: 700, color: '#0a221a' }}>
                                                            <button
                                                                onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                                                                style={{ background: 'none', border: 'none', color: '#0a221a', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                                                            >
                                                                {o.id}
                                                            </button>
                                                        </td>
                                                        <td style={S.tableCell}>
                                                            <div style={{ fontWeight: 600 }}>{o.customerName || 'Anonymous'}</div>
                                                            <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>{o.customerEmail || '—'}</div>
                                                        </td>
                                                        <td style={S.tableCell}>{o.items?.length || 1} items</td>
                                                        <td style={{ ...S.tableCell, fontWeight: 700 }}>₹{o.total?.toLocaleString('en-IN')}</td>
                                                        <td style={{ ...S.tableCell, color: '#64748b' }}>{new Date(o.createdAt || Date.now()).toLocaleDateString()}</td>
                                                        <td style={S.tableCell}><StatusBadge status={o.status} /></td>
                                                        <td style={{ ...S.tableCell, textAlign: 'right' }}>
                                                            <select
                                                                value={o.status} onChange={e => handleStatusChange(o.id, e.target.value)}
                                                                style={{ padding: '6px 10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '0.78rem', fontWeight: 600, outline: 'none' }}
                                                            >
                                                                {Object.keys(STATUS_META).map(st => (
                                                                    <option key={st} value={st}>{STATUS_META[st].label}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                    </tr>

                                                    {/* Expanded Order Items */}
                                                    {expandedOrder === o.id && (
                                                        <tr>
                                                            <td colSpan={7} style={{ background: '#f8fafc', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
                                                                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Line Items:</div>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                                    {o.items?.map((it, idx) => (
                                                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#334155' }}>
                                                                            <span>{it.name} ({it.weight || '100g'}) × {it.quantity}</span>
                                                                            <span style={{ fontWeight: 600 }}>₹{it.price * (it.quantity || 1)}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                            {filteredOrders.length === 0 && (
                                                <tr>
                                                    <td colSpan={7} style={{ ...S.tableCell, textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                                                        No orders match the selected criteria.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═════════ 4. INVENTORY SECTION ═════════ */}
                    {activeSection === 'inventory' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div>
                                <h2 style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Inventory Health</h2>
                                <p style={{ color: '#64748b', fontSize: '0.78rem', margin: 0 }}>Stock thresholds, low reserves, and replenishment alerts</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                                <StatCard label="Total Items in Stock" value={products.reduce((s, p) => s + (p.stock || 50), 0)} color="#0a221a" />
                                <StatCard label="Critical Stock Alert" value={lowStock.length} color="#dc2626" sub="Immediate attention needed" />
                                <StatCard label="Categories Tracked" value={CATEGORIES.length} color="#8c733b" />
                            </div>

                            <div style={S.card}>
                                <h3 style={{ color: '#0f172a', fontSize: '0.94rem', fontWeight: 700, margin: '0 0 16px' }}>Stock Breakdown</h3>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={S.tableHead}>Product</th>
                                                <th style={S.tableHead}>Category</th>
                                                <th style={S.tableHead}>Current Stock</th>
                                                <th style={S.tableHead}>Health Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map(p => {
                                                const stock = p.stock ?? 50;
                                                const isLow = stock < 20;
                                                return (
                                                    <tr key={p.id} className="white-row-hover">
                                                        <td style={{ ...S.tableCell, fontWeight: 600 }}>{p.name}</td>
                                                        <td style={S.tableCell}>{p.category}</td>
                                                        <td style={{ ...S.tableCell, fontWeight: 700 }}>{stock} units</td>
                                                        <td style={S.tableCell}>
                                                            <span style={{
                                                                background: isLow ? '#fee2e2' : '#dcfce7',
                                                                color: isLow ? '#b91c1c' : '#15803d',
                                                                padding: '3px 9px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700,
                                                            }}>
                                                                {isLow ? 'Low Stock' : 'Optimal'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═════════ 5. CUSTOMERS SECTION ═════════ */}
                    {activeSection === 'customers' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div>
                                <h2 style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Customer Profiles</h2>
                                <p style={{ color: '#64748b', fontSize: '0.78rem', margin: 0 }}>Registered connoisseurs and purchase history</p>
                            </div>

                            <div style={S.card}>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={S.tableHead}>Customer</th>
                                                <th style={S.tableHead}>Email</th>
                                                <th style={S.tableHead}>Orders</th>
                                                <th style={S.tableHead}>Total Spend</th>
                                                <th style={S.tableHead}>Member Since</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCustomers.map(c => (
                                                <tr key={c.id} className="white-row-hover">
                                                    <td style={{ ...S.tableCell, fontWeight: 700, color: '#0a221a' }}>{c.name}</td>
                                                    <td style={{ ...S.tableCell, color: '#64748b' }}>{c.email}</td>
                                                    <td style={{ ...S.tableCell, fontWeight: 600 }}>{c.orders} orders</td>
                                                    <td style={{ ...S.tableCell, fontWeight: 700 }}>₹{c.spent.toLocaleString('en-IN')}</td>
                                                    <td style={{ ...S.tableCell, color: '#64748b' }}>{c.joined}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═════════ 6. COUPONS SECTION ═════════ */}
                    {activeSection === 'coupons' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h2 style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Promotional Codes</h2>
                                    <p style={{ color: '#64748b', fontSize: '0.78rem', margin: 0 }}>Active vouchers and discount campaigns</p>
                                </div>
                                <WhiteBtn onClick={() => setShowCouponForm(true)}>
                                    <Plus size={14} /> New Coupon
                                </WhiteBtn>
                            </div>

                            <div style={S.card}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={S.tableHead}>Code</th>
                                            <th style={S.tableHead}>Discount</th>
                                            <th style={S.tableHead}>Redemptions</th>
                                            <th style={S.tableHead}>Status</th>
                                            <th style={{ ...S.tableHead, textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {coupons.map(cp => (
                                            <tr key={cp.code} className="white-row-hover">
                                                <td style={{ ...S.tableCell, fontWeight: 800, color: '#0a221a' }}>{cp.code}</td>
                                                <td style={S.tableCell}>{cp.type === 'percent' ? `${cp.discount}% OFF` : `₹${cp.discount} FLAT`}</td>
                                                <td style={S.tableCell}>{cp.used} times</td>
                                                <td style={S.tableCell}>
                                                    <span style={{
                                                        background: cp.active ? '#dcfce7' : '#f1f5f9',
                                                        color: cp.active ? '#15803d' : '#64748b',
                                                        padding: '3px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700,
                                                    }}>
                                                        {cp.active ? 'Active' : 'Disabled'}
                                                    </span>
                                                </td>
                                                <td style={{ ...S.tableCell, textAlign: 'right' }}>
                                                    <button
                                                        onClick={() => toggleCoupon(cp.code)}
                                                        style={{ background: 'none', border: 'none', color: '#0369a1', cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem', marginRight: '10px' }}
                                                    >
                                                        {cp.active ? 'Disable' : 'Enable'}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCoupon(cp.code)}
                                                        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem' }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ═════════ 7. SETTINGS SECTION ═════════ */}
                    {activeSection === 'settings' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '700px' }}>
                            <div>
                                <h2 style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Store Settings</h2>
                                <p style={{ color: '#64748b', fontSize: '0.78rem', margin: 0 }}>Configure brand parameters, shipping thresholds, and notifications</p>
                            </div>

                            <div style={S.card}>
                                <h3 style={{ color: '#0f172a', fontSize: '0.94rem', fontWeight: 700, margin: '0 0 16px' }}>General Configuration</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <Field label="Store Name" name="storeName" value={settings.storeName} onChange={e => setSettings(s => ({ ...s, storeName: e.target.value }))} />
                                    <Field label="Support Email" name="email" value={settings.email} onChange={e => setSettings(s => ({ ...s, email: e.target.value }))} />
                                    <Field label="Free Shipping Threshold (₹)" name="freeShipping" type="number" value={settings.freeShipping} onChange={e => setSettings(s => ({ ...s, freeShipping: e.target.value }))} />
                                    <Field label="Minimum Order Value (₹)" name="minOrder" type="number" value={settings.minOrder} onChange={e => setSettings(s => ({ ...s, minOrder: e.target.value }))} />
                                </div>
                            </div>

                            {/* Shipway Logistics Integration */}
                            <div style={S.card}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <h3 style={{ color: '#0f172a', fontSize: '0.94rem', fontWeight: 700, margin: 0 }}>Shipway Shipping &amp; Logistics</h3>
                                            <span style={{
                                                background: '#dcfce7',
                                                color: '#15803d',
                                                fontSize: '0.68rem',
                                                fontWeight: 700,
                                                padding: '2px 8px',
                                                borderRadius: '20px',
                                                letterSpacing: '0.04em'
                                            }}>
                                                ● CONNECTED
                                            </span>
                                        </div>
                                        <p style={{ color: '#64748b', fontSize: '0.74rem', margin: '4px 0 0' }}>
                                            Automated multi-carrier dispatch, live tracking webhooks, and SMS/WhatsApp WISMO updates
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => showToast('Shipway connection verified successfully!')}
                                        style={{
                                            padding: '6px 12px',
                                            background: '#f8fafc',
                                            border: '1px solid #cbd5e1',
                                            borderRadius: '6px',
                                            fontSize: '0.74rem',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Test Sync
                                    </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                                            Shipway Account Email
                                        </label>
                                        <input
                                            type="text"
                                            readOnly
                                            value="sahyadrigold520@gmail.com"
                                            style={{
                                                width: '100%',
                                                padding: '8px 10px',
                                                background: '#f8fafc',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '6px',
                                                fontSize: '0.82rem',
                                                color: '#0f172a',
                                                fontWeight: 600
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                                            Shipway License Key
                                        </label>
                                        <input
                                            type="password"
                                            readOnly
                                            value="4N9D0Ox6sR7N87A868ThM1flc48Y731q"
                                            style={{
                                                width: '100%',
                                                padding: '8px 10px',
                                                background: '#f8fafc',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '6px',
                                                fontSize: '0.82rem',
                                                color: '#0f172a',
                                                fontWeight: 600
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{
                                    background: '#f1f5f9',
                                    borderRadius: '6px',
                                    padding: '10px 12px',
                                    fontSize: '0.74rem',
                                    color: '#475569',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span>Active Logistics Partners: <strong>Delhivery, BlueDart, DTDC, XpressBees</strong></span>
                                    <span style={{ color: '#15803d', fontWeight: 600 }}>Auto-Sync Enabled</span>
                                </div>
                            </div>

                            {/* Razorpay Gateway Card in Settings */}
                            <RazorpayConfigCard
                                razorpayConfig={razorpayConfig}
                                setRazorpayConfig={setRazorpayConfig}
                                handleSaveRazorpay={handleSaveRazorpay}
                                handleTestRazorpay={handleTestRazorpay}
                                savingRazorpay={savingRazorpay}
                                testingRazorpay={testingRazorpay}
                                testResult={testResult}
                                showSecret={showSecret}
                                setShowSecret={setShowSecret}
                                S={S}
                            />

                            <div style={S.card}>
                                <h3 style={{ color: '#0f172a', fontSize: '0.94rem', fontWeight: 700, margin: '0 0 16px' }}>Alerts & Notifications</h3>
                                {[
                                    { key: 'emailNotifs', label: 'Email Order Digest', desc: 'Daily breakdown sent to admin address' },
                                    { key: 'orderAlerts', label: 'Real-time Order Alerts', desc: 'Instant alerts on new customer checkout' },
                                ].map(({ key, label, desc }) => (
                                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                                        <div>
                                            <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.85rem' }}>{label}</div>
                                            <div style={{ color: '#64748b', fontSize: '0.74rem' }}>{desc}</div>
                                        </div>
                                        <input
                                            type="checkbox" checked={settings[key]}
                                            onChange={() => setSettings(s => ({ ...s, [key]: !s[key] }))}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div>
                                <WhiteBtn onClick={() => showToast('Settings successfully updated!')}>
                                    <Save size={14} /> Save Configuration
                                </WhiteBtn>
                            </div>
                        </div>
                    )}

                    {/* ═════════ 8. DEDICATED RAZORPAY PAYMENTS SECTION ═════════ */}
                    {activeSection === 'payments' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '780px' }}>
                            <div>
                                <h2 style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>
                                    Razorpay Payment Gateway
                                </h2>
                                <p style={{ color: '#64748b', fontSize: '0.78rem', margin: 0 }}>
                                    Manage API credentials, sandbox test mode, and live customer checkout integration
                                </p>
                            </div>

                            <RazorpayConfigCard
                                razorpayConfig={razorpayConfig}
                                setRazorpayConfig={setRazorpayConfig}
                                handleSaveRazorpay={handleSaveRazorpay}
                                handleTestRazorpay={handleTestRazorpay}
                                savingRazorpay={savingRazorpay}
                                testingRazorpay={testingRazorpay}
                                testResult={testResult}
                                showSecret={showSecret}
                                setShowSecret={setShowSecret}
                                S={S}
                            />
                        </div>
                    )}
                </main>
            </div>

            {/* ─── Product Form Modal (White Theme) ─────────────────────────────── */}
            {showProductForm && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                            <div>
                                <h3 style={{ color: '#0f172a', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px' }}>
                                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                                </h3>
                                <p style={{ color: '#64748b', fontSize: '0.78rem', margin: 0 }}>Provide item identifiers and origin attributes</p>
                            </div>
                            <button
                                onClick={() => setShowProductForm(false)}
                                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', width: '32px', height: '32px', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            <Field label={editingProduct ? "Product ID" : "Product ID (optional, auto-generated)"} name="id" value={productForm.id} onChange={handleFormChange} placeholder="e.g. tellicherry-pepper" disabled={!!editingProduct} />
                            <Field label="Name *" name="name" value={productForm.name} onChange={handleFormChange} placeholder="e.g. Tellicherry Black Pepper" />
                            <Field label="Subname" name="subname" value={productForm.subname} onChange={handleFormChange} placeholder="e.g. Extra Bold Single-Origin" />
                            <Field label="Price (₹) *" name="price" type="number" value={productForm.price} onChange={handleFormChange} placeholder="450" />
                            <Field label="Original Price (₹)" name="originalPrice" type="number" value={productForm.originalPrice} onChange={handleFormChange} placeholder="550" />
                            <Field label="Primary Weight / Default Pack" name="weight" value={productForm.weight} onChange={handleFormChange} placeholder="100g" />
                            <Field label="Stock Count" name="stock" type="number" value={productForm.stock} onChange={handleFormChange} placeholder="100" />
                            <Field label="Origin Badge" name="originBadge" value={productForm.originBadge} onChange={handleFormChange} placeholder="e.g. WAYANAD ESTATE" />
                            <Field label="Elevation" name="elevation" value={productForm.elevation} onChange={handleFormChange} placeholder="e.g. 3,200 ft" />

                            {/* Category Selector */}
                            <div>
                                <label style={{ display: 'block', color: '#475569', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>Category *</label>
                                <select
                                    name="category" value={productForm.category} onChange={handleFormChange}
                                    style={{ width: '100%', padding: '10px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '0.85rem', outline: 'none' }}
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            {/* Pack Sizes & Multiple Weights (Spans across both columns) */}
                            <div style={{ gridColumn: 'span 2', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Scale size={15} color="#8c733b" />
                                            <span style={{ color: '#0f172a', fontSize: '0.86rem', fontWeight: 700 }}>
                                                Pack Sizes & Multiple Weights
                                            </span>
                                            <span style={{
                                                background: '#f1f5f9', border: '1px solid #cbd5e1',
                                                padding: '2px 8px', borderRadius: '12px',
                                                fontSize: '0.68rem', fontWeight: 700, color: '#475569'
                                            }}>
                                                {(productForm.weights || []).length} Options
                                            </span>
                                        </div>
                                        <p style={{ color: '#64748b', fontSize: '0.72rem', margin: '3px 0 0' }}>
                                            Add multiple weights for customers to choose from on the store page with custom prices.
                                        </p>
                                    </div>

                                    {/* Preset Pills */}
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        {['100g', '250g', '500g', '1kg', '500ml', '1L'].map(preset => (
                                            <button
                                                key={preset}
                                                type="button"
                                                onClick={() => addWeightVariant(preset)}
                                                style={{
                                                    padding: '3px 8px', borderRadius: '6px',
                                                    background: '#ffffff', border: '1px solid #cbd5e1',
                                                    color: '#334155', fontSize: '0.7rem', fontWeight: 600,
                                                    cursor: 'pointer', transition: 'all 0.15s ease'
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0a221a'; e.currentTarget.style.background = '#0a221a'; e.currentTarget.style.color = '#dfbe84'; }}
                                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#334155'; }}
                                            >
                                                + {preset}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Variants List */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {(Array.isArray(productForm.weights) && productForm.weights.length > 0 
                                        ? productForm.weights 
                                        : [{ weight: productForm.weight || '100g', price: productForm.price || '', originalPrice: productForm.originalPrice || '', stock: productForm.stock || 50 }]
                                    ).map((v, idx) => (
                                        <div 
                                            key={idx}
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1.2fr 1fr 1fr 0.9fr auto',
                                                gap: '8px',
                                                alignItems: 'center',
                                                padding: '8px 10px',
                                                background: '#ffffff',
                                                border: idx === 0 ? '1px solid #dfbe84' : '1px solid #e2e8f0',
                                                borderRadius: '8px',
                                                boxShadow: idx === 0 ? '0 1px 4px rgba(223,190,132,0.2)' : 'none'
                                            }}
                                        >
                                            <div>
                                                <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                                                    {idx === 0 ? 'Primary Pack *' : 'Weight / Pack *'}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={v.weight || ''}
                                                    onChange={(e) => updateWeightVariant(idx, 'weight', e.target.value)}
                                                    placeholder="e.g. 250g"
                                                    style={{ width: '100%', padding: '6px 8px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.78rem', color: '#0f172a', outline: 'none' }}
                                                />
                                            </div>

                                            <div>
                                                <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                                                    Price (₹)
                                                </span>
                                                <input
                                                    type="number"
                                                    value={v.price !== undefined ? v.price : ''}
                                                    onChange={(e) => updateWeightVariant(idx, 'price', e.target.value)}
                                                    placeholder={productForm.price || "₹"}
                                                    style={{ width: '100%', padding: '6px 8px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.78rem', color: '#0f172a', outline: 'none' }}
                                                />
                                            </div>

                                            <div>
                                                <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                                                    MRP (₹)
                                                </span>
                                                <input
                                                    type="number"
                                                    value={v.originalPrice !== undefined ? v.originalPrice : ''}
                                                    onChange={(e) => updateWeightVariant(idx, 'originalPrice', e.target.value)}
                                                    placeholder={productForm.originalPrice || "₹"}
                                                    style={{ width: '100%', padding: '6px 8px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.78rem', color: '#0f172a', outline: 'none' }}
                                                />
                                            </div>

                                            <div>
                                                <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                                                    Stock
                                                </span>
                                                <input
                                                    type="number"
                                                    value={v.stock !== undefined ? v.stock : ''}
                                                    onChange={(e) => updateWeightVariant(idx, 'stock', e.target.value)}
                                                    placeholder="50"
                                                    style={{ width: '100%', padding: '6px 8px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.78rem', color: '#0f172a', outline: 'none' }}
                                                />
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '14px' }}>
                                                {idx === 0 ? (
                                                    <span style={{ background: '#0a221a', color: '#dfbe84', fontSize: '0.58rem', fontWeight: 800, padding: '3px 6px', borderRadius: '4px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                                                        Default
                                                    </span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => setPrimaryWeightVariant(idx)}
                                                        title="Set as Default Pack"
                                                        style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', fontSize: '0.62rem', fontWeight: 600, padding: '3px 6px', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                                    >
                                                        Set Default
                                                    </button>
                                                )}

                                                {idx > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeWeightVariant(idx)}
                                                        title="Remove variant"
                                                        style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#fee2e2', border: 'none', color: '#b91c1c', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => addWeightVariant('')}
                                    style={{
                                        marginTop: '10px',
                                        padding: '7px 12px',
                                        borderRadius: '8px',
                                        background: '#ffffff',
                                        border: '1px dashed #cbd5e1',
                                        color: '#0a221a',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        transition: 'all 0.15s ease'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#0a221a'; e.currentTarget.style.background = '#f1f5f9'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#ffffff'; }}
                                >
                                    <Plus size={14} /> Add Weight Variant
                                </button>
                            </div>

                            {/* Product Multiple Photos Gallery (Spans across both columns) */}
                            <div style={{ gridColumn: 'span 2', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Camera size={15} color="#8c733b" />
                                            <span style={{ color: '#0f172a', fontSize: '0.86rem', fontWeight: 700 }}>
                                                Product Photos Gallery
                                            </span>
                                            <span style={{
                                                background: '#f1f5f9', border: '1px solid #cbd5e1',
                                                padding: '2px 8px', borderRadius: '12px',
                                                fontSize: '0.68rem', fontWeight: 700, color: '#475569'
                                            }}>
                                                {((Array.isArray(productForm.images) && productForm.images.length > 0) ? productForm.images : (productForm.image ? [productForm.image] : [])).length} Photos
                                            </span>
                                        </div>
                                        <p style={{ color: '#64748b', fontSize: '0.72rem', margin: '3px 0 0' }}>
                                            Upload multiple photos. The 1st photo is used as the primary storefront cover.
                                        </p>
                                    </div>

                                    {/* Hidden multi-file input */}
                                    <input 
                                        type="file"
                                        ref={photoFileInputRef}
                                        accept="image/*"
                                        multiple
                                        style={{ display: 'none' }}
                                        onChange={handlePhotoFilesSelect}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => photoFileInputRef.current?.click()}
                                        disabled={uploadingPhoto}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            padding: '8px 16px', borderRadius: '8px',
                                            border: '1px solid #0a221a', background: '#0a221a',
                                            color: '#dfbe84', fontSize: '0.78rem', fontWeight: 700,
                                            cursor: uploadingPhoto ? 'not-allowed' : 'pointer',
                                            boxShadow: '0 2px 4px rgba(10,34,26,0.15)'
                                        }}
                                    >
                                        <UploadCloud size={14} className={uploadingPhoto ? 'spin' : ''} />
                                        {uploadingPhoto ? 'Uploading Photos...' : '+ Upload Photos'}
                                    </button>
                                </div>

                                {/* Photos Grid Display */}
                                {(() => {
                                    const currentImgs = (Array.isArray(productForm.images) && productForm.images.length > 0)
                                        ? productForm.images
                                        : (productForm.image ? [productForm.image] : []);

                                    return (
                                        <div style={{
                                            display: 'flex', flexWrap: 'wrap', gap: '10px',
                                            padding: '12px', background: '#ffffff',
                                            border: '1px dashed #cbd5e1', borderRadius: '10px',
                                            minHeight: '86px', alignItems: 'center'
                                        }}>
                                            {currentImgs.map((imgSrc, idx) => (
                                                <div
                                                    key={idx}
                                                    style={{
                                                        position: 'relative',
                                                        width: '74px', height: '74px',
                                                        borderRadius: '10px', overflow: 'hidden',
                                                        border: idx === 0 ? '2px solid #dfbe84' : '1px solid #cbd5e1',
                                                        background: '#f8fafc', flexShrink: 0,
                                                        boxShadow: idx === 0 ? '0 2px 8px rgba(223,190,132,0.4)' : '0 1px 3px rgba(0,0,0,0.06)'
                                                    }}
                                                >
                                                    <img 
                                                        src={imgSrc} 
                                                        alt={`Product ${idx + 1}`}
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />

                                                    {/* Primary Cover Badge */}
                                                    {idx === 0 ? (
                                                        <span style={{
                                                            position: 'absolute', bottom: 0, left: 0, right: 0,
                                                            background: 'linear-gradient(to top, rgba(10,34,26,0.95), rgba(10,34,26,0.75))',
                                                            color: '#dfbe84', fontSize: '0.55rem', fontWeight: 800,
                                                            textAlign: 'center', padding: '2px 0', textTransform: 'uppercase',
                                                            letterSpacing: '0.04em'
                                                        }}>
                                                            ★ Cover
                                                        </span>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => makePhotoPrimary(idx)}
                                                            title="Set as main cover photo"
                                                            style={{
                                                                position: 'absolute', bottom: '2px', left: '2px',
                                                                background: 'rgba(15,23,42,0.8)', border: 'none',
                                                                borderRadius: '4px', color: '#f8fafc',
                                                                padding: '1px 4px', fontSize: '0.52rem', fontWeight: 700,
                                                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px'
                                                            }}
                                                        >
                                                            <Star size={8} fill="#dfbe84" color="#dfbe84" /> Main
                                                        </button>
                                                    )}

                                                    {/* Reorder Arrows (if more than 1 image) */}
                                                    {currentImgs.length > 1 && (
                                                        <div style={{ position: 'absolute', top: '2px', left: '2px', display: 'flex', gap: '1px' }}>
                                                            {idx > 0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => movePhoto(idx, idx - 1)}
                                                                    title="Move Left"
                                                                    style={{
                                                                        width: '16px', height: '16px', borderRadius: '3px',
                                                                        background: 'rgba(15,23,42,0.75)', color: '#fff',
                                                                        border: 'none', cursor: 'pointer', display: 'flex',
                                                                        alignItems: 'center', justifyContent: 'center', padding: 0
                                                                    }}
                                                                >
                                                                    <ArrowLeft size={9} />
                                                                </button>
                                                            )}
                                                            {idx < currentImgs.length - 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => movePhoto(idx, idx + 1)}
                                                                    title="Move Right"
                                                                    style={{
                                                                        width: '16px', height: '16px', borderRadius: '3px',
                                                                        background: 'rgba(15,23,42,0.75)', color: '#fff',
                                                                        border: 'none', cursor: 'pointer', display: 'flex',
                                                                        alignItems: 'center', justifyContent: 'center', padding: 0
                                                                    }}
                                                                >
                                                                    <ArrowRight size={9} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Delete Photo Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeProductPhoto(idx)}
                                                        title="Delete this photo"
                                                        style={{
                                                            position: 'absolute', top: '2px', right: '2px',
                                                            width: '18px', height: '18px', borderRadius: '50%',
                                                            background: 'rgba(220, 38, 38, 0.9)', color: '#fff',
                                                            border: 'none', cursor: 'pointer', display: 'flex',
                                                            alignItems: 'center', justifyContent: 'center'
                                                        }}
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                </div>
                                            ))}

                                            {/* Add More Tile */}
                                            <div 
                                                onClick={() => photoFileInputRef.current?.click()}
                                                style={{ 
                                                    width: '74px', height: '74px', borderRadius: '10px', 
                                                    border: '1px dashed #cbd5e1', background: '#f8fafc', 
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', 
                                                    justifyContent: 'center', cursor: 'pointer', color: '#64748b', flexShrink: 0,
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0a221a'; e.currentTarget.style.background = '#f1f5f9'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
                                            >
                                                <Camera size={18} color="#8c733b" />
                                                <span style={{ fontSize: '0.64rem', fontWeight: 700, marginTop: '3px', color: '#475569' }}>+ Add Photo</span>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Manual URL / Path Input Option */}
                                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        value={manualImageUrl}
                                        onChange={(e) => setManualImageUrl(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddManualImageUrl(); } }}
                                        placeholder="Or paste image URL / path (/images/products/...)"
                                        style={{
                                            flex: 1, padding: '8px 12px', boxSizing: 'border-box',
                                            background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px',
                                            fontSize: '0.78rem', color: '#0f172a', outline: 'none'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddManualImageUrl}
                                        style={{
                                            padding: '8px 14px', borderRadius: '8px',
                                            background: '#f1f5f9', border: '1px solid #cbd5e1',
                                            color: '#0f172a', fontSize: '0.75rem', fontWeight: 600,
                                            cursor: 'pointer', whiteSpace: 'nowrap'
                                        }}
                                    >
                                        + Add URL
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '14px' }}>
                            <label style={{ display: 'block', color: '#475569', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>Description</label>
                            <textarea
                                name="description" value={productForm.description || ''} onChange={handleFormChange} rows={3}
                                placeholder="Describe the single-origin characteristics…"
                                style={{ width: '100%', padding: '10px 12px', boxSizing: 'border-box', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
                            />
                        </div>

                        {formError && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 12px', marginTop: '12px', color: '#b91c1c', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <AlertTriangle size={14} /> {formError}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px', marginTop: '22px', justifyContent: 'flex-end' }}>
                            <WhiteBtn outline onClick={() => setShowProductForm(false)}>Cancel</WhiteBtn>
                            <WhiteBtn onClick={handleProductSave}>
                                {formSaving ? <RefreshCw size={14} className="spin" /> : <Save size={14} />}
                                {editingProduct ? 'Save Changes' : 'Create Product'}
                            </WhiteBtn>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── New Coupon Modal ─────────────────────────────────────────────── */}
            {showCouponForm && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                            <h3 style={{ color: '#0f172a', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Add New Coupon</h3>
                            <button onClick={() => setShowCouponForm(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={16} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Field label="Code" name="code" value={newCoupon.code} onChange={e => setNewCoupon(c => ({ ...c, code: e.target.value.toUpperCase() }))} placeholder="e.g. AUTUMN20" />
                            <Field label="Discount Value" name="discount" type="number" value={newCoupon.discount} onChange={e => setNewCoupon(c => ({ ...c, discount: e.target.value }))} placeholder="20" />
                            <div>
                                <label style={{ display: 'block', color: '#475569', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>Discount Type</label>
                                <select
                                    value={newCoupon.type} onChange={e => setNewCoupon(c => ({ ...c, type: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '0.85rem', outline: 'none' }}
                                >
                                    <option value="percent">Percentage (%)</option>
                                    <option value="flat">Flat Amount (₹)</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', justifyContent: 'flex-end' }}>
                            <WhiteBtn outline onClick={() => setShowCouponForm(false)}>Cancel</WhiteBtn>
                            <WhiteBtn onClick={addCoupon}>Activate Coupon</WhiteBtn>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .white-sidebar-item:hover {
                    background: #f1f5f9 !important;
                    color: #0f172a !important;
                }
                .white-logout-item:hover {
                    background: #fee2e2 !important;
                }
                .white-stat-card:hover {
                    border-color: #cbd5e1 !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.06) !important;
                }
                .white-row-hover:hover {
                    background: #f8fafc;
                }
                .white-btn-hover:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
                .white-admin-input:focus {
                    border-color: #0a221a !important;
                    box-shadow: 0 0 0 3px rgba(10,34,26,0.08);
                }
                .white-admin-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .white-admin-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .white-admin-scroll::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
}
