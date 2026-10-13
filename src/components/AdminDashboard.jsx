import React, { useState, useEffect, useRef } from 'react';
import {
    LayoutDashboard, Package, ShoppingBag, LogOut,
    Plus, Edit3, Trash2, X, Save, Search,
    RefreshCw, Truck, CheckCircle, Clock, AlertTriangle, Leaf,
    Users, DollarSign, Menu, ChevronRight, ChevronDown,
    TrendingUp, TrendingDown, Bell, Settings, Tag, BarChart2,
    ArrowUpRight, ArrowDownRight, Filter, Download, Eye,
    Boxes, Percent, Star, Upload, Image as ImageIcon,
    Globe, Lock, Mail, MessageSquare, Shield, CreditCard,
    Zap, Activity, PieChart, Info, CheckSquare, XSquare
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_META = {
    pending:    { label: 'Pending',    color: '#e5a020', bg: 'rgba(229,160,32,0.12)',  Icon: Clock },
    processing: { label: 'Processing', color: '#4fa3e0', bg: 'rgba(79,163,224,0.12)', Icon: RefreshCw },
    shipped:    { label: 'Shipped',    color: '#9b7fe8', bg: 'rgba(155,127,232,0.12)',Icon: Truck },
    delivered:  { label: 'Delivered',  color: '#4caf82', bg: 'rgba(76,175,130,0.12)', Icon: CheckCircle },
    cancelled:  { label: 'Cancelled',  color: '#e05555', bg: 'rgba(224,85,85,0.12)',  Icon: X },
};

const CATEGORIES = ['spices', 'powders', 'honey', 'oils'];

const BLANK_PRODUCT = {
    id: '', name: '', subname: '', category: 'spices', price: '', originalPrice: '',
    weight: '', stock: '', image: '', description: '', tag: '', typeTag: '', originBadge: '',
    elevation: '', harvestSeason: '', aromaProfile: '',
};

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

// ─── Mini Bar Chart (inline SVG) ──────────────────────────────────────────────

function MiniBarChart({ data, labels, color = '#d4af37', height = 90 }) {
    const max = Math.max(...data);
    const barW = 28, gap = 10;
    const totalW = data.length * (barW + gap) - gap;
    return (
        <svg width="100%" viewBox={`0 0 ${totalW + 10} ${height + 24}`} style={{ overflow: 'visible' }}>
            {data.map((v, i) => {
                const barH = (v / max) * height;
                const x = i * (barW + gap) + 5;
                const y = height - barH;
                return (
                    <g key={i}>
                        <rect
                            x={x} y={y} width={barW} height={barH}
                            rx={4} fill={color}
                            opacity={i === data.length - 1 ? 1 : 0.45}
                        />
                        <text
                            x={x + barW / 2} y={height + 16}
                            textAnchor="middle" fontSize="9"
                            fill="rgba(245,228,195,0.4)" fontFamily="system-ui"
                        >
                            {labels[i]}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

// ─── Mini Sparkline ────────────────────────────────────────────────────────────
function Sparkline({ data, color = '#4caf82', width = 80, height = 28 }) {
    const max = Math.max(...data), min = Math.min(...data);
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / (max - min || 1)) * height;
        return `${x},${y}`;
    }).join(' ');
    return (
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
            <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, color, trend, spark }) {
    return (
        <div style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
            border: '1px solid rgba(212,175,55,0.12)', borderRadius: '18px', padding: '22px 24px',
            display: 'flex', flexDirection: 'column', gap: '14px',
            transition: 'border-color 0.2s ease',
        }}
            className="stat-card"
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ color: 'rgba(245,228,195,0.45)', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
                        {label}
                    </div>
                    <div style={{ color, fontSize: '1.7rem', fontWeight: 800, fontFamily: 'serif', letterSpacing: '-0.02em' }}>
                        {value}
                    </div>
                    {sub && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                            {trend === 'up' ? <ArrowUpRight size={12} color="#4caf82" /> : <ArrowDownRight size={12} color="#e05555" />}
                            <span style={{ fontSize: '0.72rem', color: trend === 'up' ? '#4caf82' : '#e05555', fontWeight: 600 }}>{sub}</span>
                        </div>
                    )}
                </div>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color={color} />
                </div>
            </div>
            {spark && <Sparkline data={spark} color={color} width={120} height={28} />}
        </div>
    );
}

// ─── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, action }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
                <h2 style={{ color: '#f5e4c3', fontFamily: 'serif', fontSize: '1.15rem', fontWeight: 700, margin: '0 0 4px' }}>{title}</h2>
                {subtitle && <p style={{ color: 'rgba(245,228,195,0.4)', fontSize: '0.78rem', margin: 0 }}>{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const meta = STATUS_META[status] || STATUS_META.pending;
    return (
        <span style={{
            background: meta.bg, color: meta.color,
            border: `1px solid ${meta.color}40`, borderRadius: '20px',
            padding: '3px 11px', fontSize: '0.7rem', fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', gap: '5px',
        }}>
            <meta.Icon size={10} />
            {meta.label}
        </span>
    );
}

// ─── Input / Field Component ───────────────────────────────────────────────────
function Field({ label, name, value, onChange, type = 'text', placeholder, disabled, span2 = false }) {
    return (
        <div style={{ gridColumn: span2 ? '1 / -1' : undefined }}>
            <label style={{ display: 'block', color: 'rgba(212,175,55,0.7)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>
                {label}
            </label>
            <input
                name={name} type={type} value={value} onChange={onChange}
                placeholder={placeholder} disabled={disabled}
                style={{
                    width: '100%', padding: '10px 13px', boxSizing: 'border-box',
                    background: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(212,175,55,0.18)', borderRadius: '10px',
                    color: disabled ? 'rgba(245,228,195,0.4)' : '#f5e4c3',
                    fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.2s',
                    fontFamily: 'inherit',
                }}
                className="admin-input"
            />
        </div>
    );
}

// ─── GoldBtn ──────────────────────────────────────────────────────────────────
function GoldBtn({ onClick, children, small, outline, danger }) {
    return (
        <button onClick={onClick} style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            background: danger ? 'rgba(224,85,85,0.12)' : outline ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg,#d4af37,#b8972f)',
            border: danger ? '1px solid rgba(224,85,85,0.35)' : outline ? '1px solid rgba(212,175,55,0.25)' : 'none',
            borderRadius: '10px',
            padding: small ? '7px 13px' : '10px 20px',
            color: danger ? '#e07070' : outline ? 'rgba(245,228,195,0.75)' : '#0c1f14',
            fontWeight: 700, fontSize: small ? '0.78rem' : '0.85rem', cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all 0.2s ease',
        }} className="admin-btn">
            {children}
        </button>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdminDashboard({ onClose }) {
    const { currentUser, logout, showToast, API, fetchProducts } = useShop();
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

    // ── Orders ────────────────────────────────────────────────────────────────
    const [orders, setOrders]               = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [orderSearch, setOrderSearch]     = useState('');
    const [statusFilter, setStatusFilter]   = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);

    // ── Customers (static demo) ───────────────────────────────────────────────
    const [custSearch, setCustSearch] = useState('');

    // ── Coupons (static demo) ─────────────────────────────────────────────────
    const [coupons, setCoupons]         = useState(DUMMY_COUPONS);
    const [showCouponForm, setShowCouponForm] = useState(false);
    const [newCoupon, setNewCoupon]     = useState({ code: '', discount: '', type: 'percent' });

    // ── Settings ──────────────────────────────────────────────────────────────
    const [settings, setSettings] = useState({
        storeName: 'Sahyadri Naturals', email: 'hello@sahyadri.in',
        currency: '₹', taxRate: '18', minOrder: '299', freeShipping: '499',
        emailNotifs: true, orderAlerts: true,
    });

    // ── Fetch data ────────────────────────────────────────────────────────────
    useEffect(() => { loadProducts(); loadOrders(); }, []);

    const loadProducts = async () => {
        setProdLoading(true);
        try {
            const res  = await fetch(`${API}/products`);
            const json = await res.json();
            if (json.success) setProducts(json.data);
        } catch { showToast('Backend offline — static data shown'); }
        finally { setProdLoading(false); }
    };

    const loadOrders = async () => {
        setOrdersLoading(true);
        try {
            const res  = await fetch(`${API}/orders`);
            const json = await res.json();
            if (json.success) setOrders(json.data);
        } catch { setOrders([]); }
        finally { setOrdersLoading(false); }
    };

    // ── Product CRUD ──────────────────────────────────────────────────────────
    const openAddForm  = () => { setEditingProduct(null); setProductForm(BLANK_PRODUCT); setFormError(''); setShowProductForm(true); };
    const openEditForm = (p)  => { setEditingProduct(p); setProductForm({ ...p }); setFormError(''); setShowProductForm(true); };
    const handleFormChange = (e) => { setProductForm(prev => ({ ...prev, [e.target.name]: e.target.value })); setFormError(''); };

    const handleProductSave = async () => {
        if (!productForm.id || !productForm.name || !productForm.price || !productForm.category) {
            setFormError('Product ID, Name, Price and Category are required.'); return;
        }
        setFormSaving(true);
        try {
            if (editingProduct) {
                const res  = await fetch(`${API}/products/${productForm.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productForm) });
                const json = await res.json();
                if (json.success) { setProducts(prev => prev.map(p => p.id === json.data.id ? json.data : p)); showToast('Product updated!'); }
            } else {
                const res  = await fetch(`${API}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productForm) });
                const json = await res.json();
                if (json.success) { setProducts(prev => [...prev, json.data]); showToast('Product added!'); }
                else { setFormError(json.message); setFormSaving(false); return; }
            }
            fetchProducts(); setShowProductForm(false);
        } catch {
            setFormError('Backend unreachable — saved locally.');
            if (editingProduct) setProducts(prev => prev.map(p => p.id === productForm.id ? { ...p, ...productForm } : p));
            else setProducts(prev => [...prev, { ...productForm, price: +productForm.price, rating: 5, reviewsCount: 0 }]);
            setShowProductForm(false);
            showToast(editingProduct ? 'Updated (local)' : 'Added (local)');
        }
        setFormSaving(false);
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Delete this product? This cannot be undone.')) return;
        try { await fetch(`${API}/products/${id}`, { method: 'DELETE' }); } catch {}
        setProducts(prev => prev.filter(p => p.id !== id));
        fetchProducts();
        showToast('Product deleted');
    };

    // ── Order status ──────────────────────────────────────────────────────────
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await fetch(`${API}/orders/${orderId}/status`, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
        } catch {}
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        showToast(`Order ${orderId} → ${newStatus}`);
    };

    const handleDeleteOrder = async (id) => {
        if (!window.confirm('Delete this order?')) return;
        try { await fetch(`${API}/orders/${id}`, { method: 'DELETE' }); } catch {}
        setOrders(prev => prev.filter(o => o.id !== id));
        showToast('Order deleted');
    };

    // ── Computed metrics ──────────────────────────────────────────────────────
    const revenue   = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
    const pending   = orders.filter(o => o.status === 'pending').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
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
        showToast('Coupon created!');
    };
    const toggleCoupon = (code) => setCoupons(prev => prev.map(c => c.code === code ? { ...c, active: !c.active } : c));
    const deleteCoupon = (code) => setCoupons(prev => prev.filter(c => c.code !== code));

    const handleLogout = () => { logout(); showToast('Logged out'); onClose(); };

    // ── Nav items ─────────────────────────────────────────────────────────────
    const NAV = [
        { id: 'overview',   label: 'Overview',   Icon: LayoutDashboard },
        { id: 'products',   label: 'Products',   Icon: Package, badge: products.length },
        { id: 'orders',     label: 'Orders',     Icon: ShoppingBag, badge: pending || undefined },
        { id: 'inventory',  label: 'Inventory',  Icon: Boxes, badge: lowStock.length || undefined, badgeDanger: true },
        { id: 'customers',  label: 'Customers',  Icon: Users },
        { id: 'coupons',    label: 'Promotions', Icon: Percent },
        { id: 'settings',   label: 'Settings',   Icon: Settings },
    ];

    // ── Style helpers ─────────────────────────────────────────────────────────
    const S = {
        tableHead: { textAlign: 'left', padding: '10px 14px', color: 'rgba(212,175,55,0.55)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, borderBottom: '1px solid rgba(212,175,55,0.1)', whiteSpace: 'nowrap' },
        tableCell: { padding: '12px 14px', color: '#f5e4c3', fontSize: '0.84rem', borderBottom: '1px solid rgba(255,255,255,0.03)', verticalAlign: 'middle' },
        card: { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '16px', padding: '22px' },
        input: { padding: '9px 13px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '10px', color: '#f5e4c3', fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit' },
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', background: '#060f0a', fontFamily: "'Inter', system-ui, sans-serif" }}>

            {/* ─── Sidebar ──────────────────────────────────────────────────────── */}
            <div style={{
                width: sidebarOpen ? '236px' : '66px', flexShrink: 0,
                background: 'linear-gradient(180deg, #0b1e15 0%, #060f0a 100%)',
                borderRight: '1px solid rgba(212,175,55,0.1)',
                display: 'flex', flexDirection: 'column',
                transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1)', overflow: 'hidden',
            }}>
                {/* Brand */}
                <div style={{ padding: '22px 16px 18px', borderBottom: '1px solid rgba(212,175,55,0.08)', display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg,#d4af37,#9a7d25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Leaf size={17} color="#0c1f14" />
                    </div>
                    {sidebarOpen && (
                        <div>
                            <div style={{ color: '#d4af37', fontWeight: 800, fontSize: '0.92rem', letterSpacing: '0.06em', fontFamily: 'serif' }}>SAHYADRI</div>
                            <div style={{ color: 'rgba(212,175,55,0.45)', fontSize: '0.62rem', letterSpacing: '0.18em' }}>ADMIN CONSOLE</div>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
                    {NAV.map(({ id, label, Icon, badge, badgeDanger }) => {
                        const active = activeSection === id;
                        return (
                            <button key={id} onClick={() => setActiveSection(id)} title={!sidebarOpen ? label : ''}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '10px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                    background: active ? 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.07))' : 'transparent',
                                    borderLeft: `2px solid ${active ? '#d4af37' : 'transparent'}`,
                                    color: active ? '#d4af37' : 'rgba(245,228,195,0.4)',
                                    fontWeight: active ? 700 : 500, fontSize: '0.84rem',
                                    whiteSpace: 'nowrap', transition: 'all 0.18s ease', textAlign: 'left',
                                }}
                                className="sidebar-btn"
                            >
                                <Icon size={17} />
                                {sidebarOpen && (
                                    <>
                                        <span style={{ flex: 1 }}>{label}</span>
                                        {badge !== undefined && (
                                            <span style={{
                                                background: badgeDanger ? 'rgba(224,85,85,0.25)' : 'rgba(212,175,55,0.2)',
                                                color: badgeDanger ? '#e07070' : '#d4af37',
                                                borderRadius: '20px', padding: '1px 8px',
                                                fontSize: '0.68rem', fontWeight: 700,
                                            }}>{badge}</span>
                                        )}
                                    </>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div style={{ padding: '10px 8px', borderTop: '1px solid rgba(212,175,55,0.08)' }}>
                    <button onClick={handleLogout} title={!sidebarOpen ? 'Logout' : ''}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: 'none', background: 'transparent', color: '#e07070', cursor: 'pointer', fontSize: '0.84rem', width: '100%', whiteSpace: 'nowrap' }}>
                        <LogOut size={16} />
                        {sidebarOpen && 'Logout'}
                    </button>
                </div>
            </div>

            {/* ─── Main ─────────────────────────────────────────────────────────── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* Topbar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', height: '58px', borderBottom: '1px solid rgba(212,175,55,0.08)', background: 'rgba(6,15,10,0.7)', backdropFilter: 'blur(12px)', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <button onClick={() => setSidebarOpen(s => !s)} style={{ background: 'none', border: 'none', color: 'rgba(212,175,55,0.7)', cursor: 'pointer', display: 'flex', padding: '4px' }}>
                            <Menu size={20} />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(245,228,195,0.3)', fontSize: '0.8rem' }}>
                            <span style={{ color: 'rgba(245,228,195,0.5)' }}>Admin</span>
                            <ChevronRight size={13} />
                            <span style={{ color: '#d4af37', fontWeight: 600, textTransform: 'capitalize' }}>
                                {NAV.find(n => n.id === activeSection)?.label || activeSection}
                            </span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Notification bell */}
                        <button onClick={() => setNotifications(0)} style={{ position: 'relative', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#d4af37' }}>
                            <Bell size={16} />
                            {notifications > 0 && (
                                <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#e05555', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{notifications}</span>
                            )}
                        </button>
                        {/* User pill */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: '10px', padding: '6px 14px' }}>
                            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg,#d4af37,#9a7d25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: '#0c1f14' }}>
                                {currentUser?.name?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <span style={{ color: 'rgba(245,228,195,0.8)', fontSize: '0.82rem', fontWeight: 600 }}>{currentUser?.name || 'Admin'}</span>
                            <span style={{ background: 'rgba(212,175,55,0.2)', color: '#d4af37', borderRadius: '20px', padding: '1px 8px', fontSize: '0.62rem', fontWeight: 800 }}>ADMIN</span>
                        </div>
                        {/* Close */}
                        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '10px', width: '36px', height: '36px', color: 'rgba(245,228,195,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflow: 'auto', padding: '30px 32px' }} className="admin-scroll">

                    {/* ══ OVERVIEW ══════════════════════════════════════════════════════ */}
                    {activeSection === 'overview' && (
                        <div>
                            {/* KPI grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '16px', marginBottom: '28px' }}>
                                <StatCard label="Total Revenue"  value={`₹${revenue.toLocaleString()}`}  sub="+12% this week" trend="up"   icon={DollarSign}    color="#d4af37" spark={WEEKLY_REVENUE} />
                                <StatCard label="Total Orders"   value={orders.length}                   sub="+3 today"      trend="up"   icon={ShoppingBag}   color="#4fa3e0" spark={[5,8,6,11,9,14,12]} />
                                <StatCard label="Products"       value={products.length}                 sub="in catalogue"              icon={Package}       color="#9b7fe8" spark={null} />
                                <StatCard label="Delivered"      value={delivered}                       sub="fulfilled"     trend="up"   icon={CheckCircle}   color="#4caf82" spark={[2,3,2,5,4,7,6]} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                {/* Revenue Chart */}
                                <div style={{ ...S.card }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <div>
                                            <div style={{ color: '#d4af37', fontFamily: 'serif', fontWeight: 700, fontSize: '0.95rem' }}>Weekly Revenue</div>
                                            <div style={{ color: 'rgba(245,228,195,0.4)', fontSize: '0.75rem', marginTop: '2px' }}>Last 7 days</div>
                                        </div>
                                        <div style={{ color: '#4caf82', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <TrendingUp size={14} /> +8.4%
                                        </div>
                                    </div>
                                    <MiniBarChart data={WEEKLY_REVENUE} labels={WEEK_LABELS} color="#d4af37" height={90} />
                                </div>

                                {/* Order breakdown */}
                                <div style={{ ...S.card }}>
                                    <div style={{ color: '#d4af37', fontFamily: 'serif', fontWeight: 700, fontSize: '0.95rem', marginBottom: '18px' }}>Order Status Breakdown</div>
                                    {Object.entries(STATUS_META).map(([key, meta]) => {
                                        const count = orders.filter(o => o.status === key).length;
                                        const pct   = orders.length ? Math.round((count / orders.length) * 100) : 0;
                                        return (
                                            <div key={key} style={{ marginBottom: '12px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                    <span style={{ color: meta.color, fontSize: '0.78rem', fontWeight: 600 }}>{meta.label}</span>
                                                    <span style={{ color: 'rgba(245,228,195,0.5)', fontSize: '0.78rem' }}>{count} ({pct}%)</span>
                                                </div>
                                                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${pct}%`, background: meta.color, borderRadius: '4px', transition: 'width 1s ease' }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Low stock alert */}
                            {lowStock.length > 0 && (
                                <div style={{ ...S.card, borderColor: 'rgba(229,160,32,0.3)', background: 'rgba(229,160,32,0.06)', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                        <AlertTriangle size={17} color="#e5a020" />
                                        <span style={{ color: '#e5a020', fontWeight: 700, fontSize: '0.9rem' }}>Low Stock Alert — {lowStock.length} item{lowStock.length > 1 ? 's' : ''} running low</span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {lowStock.map(p => (
                                            <div key={p.id} style={{ background: 'rgba(229,160,32,0.12)', border: '1px solid rgba(229,160,32,0.25)', borderRadius: '8px', padding: '6px 12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <span style={{ color: '#f5e4c3', fontSize: '0.82rem', fontWeight: 600 }}>{p.name}</span>
                                                <span style={{ background: 'rgba(224,85,85,0.25)', color: '#ff7070', borderRadius: '20px', padding: '1px 8px', fontSize: '0.68rem', fontWeight: 800 }}>{p.stock ?? 0} left</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recent orders table */}
                            <div style={S.card}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <span style={{ color: '#d4af37', fontFamily: 'serif', fontWeight: 700, fontSize: '0.95rem' }}>Recent Orders</span>
                                    <button onClick={() => setActiveSection('orders')} style={{ background: 'none', border: 'none', color: 'rgba(212,175,55,0.6)', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}>View all <ChevronRight size={13} /></button>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead><tr>{['Order ID', 'Customer', 'Total', 'Status', 'Date'].map(h => <th key={h} style={S.tableHead}>{h}</th>)}</tr></thead>
                                        <tbody>
                                            {orders.slice(0, 6).map(o => (
                                                <tr key={o.id}>
                                                    <td style={S.tableCell}><span style={{ color: '#d4af37', fontFamily: 'monospace', fontSize: '0.8rem' }}>{o.id}</span></td>
                                                    <td style={S.tableCell}>{o.customerName}</td>
                                                    <td style={{ ...S.tableCell, fontWeight: 700 }}>₹{o.total?.toLocaleString()}</td>
                                                    <td style={S.tableCell}><StatusBadge status={o.status} /></td>
                                                    <td style={{ ...S.tableCell, color: 'rgba(245,228,195,0.4)', fontSize: '0.75rem' }}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══ PRODUCTS ══════════════════════════════════════════════════════ */}
                    {activeSection === 'products' && (
                        <div>
                            <SectionHeader
                                title="Product Catalogue"
                                subtitle={`${filteredProducts.length} of ${products.length} products`}
                                action={<GoldBtn onClick={openAddForm}><Plus size={14} /> Add Product</GoldBtn>}
                            />

                            {/* Filters */}
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                                <div style={{ position: 'relative', flex: '1 1 220px' }}>
                                    <Search size={14} color="rgba(212,175,55,0.45)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input value={prodSearch} onChange={e => setProdSearch(e.target.value)} placeholder="Search by name or ID…" style={{ ...S.input, paddingLeft: '36px', width: '100%', boxSizing: 'border-box' }} className="admin-input" />
                                </div>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {['all', ...CATEGORIES].map(c => (
                                        <button key={c} onClick={() => setProdCatFilter(c)} style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, textTransform: 'capitalize', background: prodCatFilter === c ? 'linear-gradient(135deg,#d4af37,#b8972f)' : 'rgba(255,255,255,0.05)', color: prodCatFilter === c ? '#0c1f14' : 'rgba(245,228,195,0.5)' }}>
                                            {c === 'all' ? 'All' : c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {prodLoading ? (
                                <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(245,228,195,0.3)', fontSize: '0.9rem' }}>Loading products…</div>
                            ) : (
                                <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead><tr style={{ background: 'rgba(212,175,55,0.05)' }}>{['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map(h => <th key={h} style={S.tableHead}>{h}</th>)}</tr></thead>
                                            <tbody>
                                                {filteredProducts.map(p => (
                                                    <tr key={p.id} className="table-row-hover">
                                                        <td style={S.tableCell}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                <img src={p.image} alt={p.name} style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', background: '#0a1e14', border: '1px solid rgba(212,175,55,0.12)' }} onError={e => e.target.style.opacity = '0.3'} />
                                                                <div>
                                                                    <div style={{ fontWeight: 600, color: '#f5e4c3', fontSize: '0.85rem' }}>{p.name}</div>
                                                                    <div style={{ color: 'rgba(245,228,195,0.35)', fontSize: '0.7rem', fontFamily: 'monospace' }}>{p.id}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={S.tableCell}><span style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', borderRadius: '6px', padding: '3px 9px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'capitalize' }}>{p.category}</span></td>
                                                        <td style={{ ...S.tableCell, fontWeight: 700 }}>
                                                            <div>₹{p.price}</div>
                                                            {p.originalPrice > p.price && <div style={{ color: 'rgba(245,228,195,0.3)', textDecoration: 'line-through', fontSize: '0.72rem' }}>₹{p.originalPrice}</div>}
                                                        </td>
                                                        <td style={S.tableCell}>
                                                            <span style={{ color: (p.stock ?? 999) < 20 ? '#e05555' : '#4caf82', fontWeight: 700 }}>{p.stock ?? '—'}</span>
                                                            {(p.stock ?? 999) < 20 && <span style={{ marginLeft: '6px', fontSize: '0.65rem', color: '#e5a020' }}>⚠ Low</span>}
                                                        </td>
                                                        <td style={S.tableCell}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <Star size={12} fill="#d4af37" color="#d4af37" />
                                                                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{p.rating}</span>
                                                                <span style={{ color: 'rgba(245,228,195,0.3)', fontSize: '0.72rem' }}>({p.reviewsCount})</span>
                                                            </div>
                                                        </td>
                                                        <td style={S.tableCell}>
                                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                                <GoldBtn small outline onClick={() => openEditForm(p)}><Edit3 size={12} /> Edit</GoldBtn>
                                                                <GoldBtn small danger onClick={() => handleDeleteProduct(p.id)}><Trash2 size={12} /></GoldBtn>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ══ ORDERS ════════════════════════════════════════════════════════ */}
                    {activeSection === 'orders' && (
                        <div>
                            <SectionHeader
                                title="Order Management"
                                subtitle={`${filteredOrders.length} orders found`}
                                action={
                                    <button onClick={loadOrders} style={{ ...S.input, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', paddingLeft: '14px', paddingRight: '14px' }}>
                                        <RefreshCw size={14} /> Refresh
                                    </button>
                                }
                            />

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                                <div style={{ position: 'relative', flex: '1 1 240px' }}>
                                    <Search size={14} color="rgba(212,175,55,0.45)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input value={orderSearch} onChange={e => setOrderSearch(e.target.value)} placeholder="Order ID or customer…" style={{ ...S.input, paddingLeft: '36px', width: '100%', boxSizing: 'border-box' }} className="admin-input" />
                                </div>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {['all', ...Object.keys(STATUS_META)].map(s => (
                                        <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '8px 13px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, textTransform: 'capitalize', background: statusFilter === s ? 'linear-gradient(135deg,#d4af37,#b8972f)' : 'rgba(255,255,255,0.05)', color: statusFilter === s ? '#0c1f14' : 'rgba(245,228,195,0.5)' }}>
                                            {s === 'all' ? 'All' : STATUS_META[s].label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {ordersLoading ? (
                                <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(245,228,195,0.3)' }}>Loading orders…</div>
                            ) : filteredOrders.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(245,228,195,0.3)' }}>No orders match your filter.</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {filteredOrders.map(order => {
                                        const expanded = expandedOrder === order.id;
                                        return (
                                            <div key={order.id} style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
                                                {/* Order header row */}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', flexWrap: 'wrap', gap: '10px', cursor: 'pointer', background: expanded ? 'rgba(212,175,55,0.04)' : 'transparent', transition: 'background 0.2s' }} onClick={() => setExpandedOrder(expanded ? null : order.id)}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                                        <span style={{ color: '#d4af37', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem' }}>{order.id}</span>
                                                        <div>
                                                            <div style={{ color: '#f5e4c3', fontWeight: 600, fontSize: '0.88rem' }}>{order.customerName}</div>
                                                            <div style={{ color: 'rgba(245,228,195,0.35)', fontSize: '0.72rem' }}>{order.customerEmail}</div>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                                        <span style={{ color: '#d4af37', fontWeight: 800, fontSize: '1rem' }}>₹{order.total?.toLocaleString()}</span>
                                                        <select
                                                            value={order.status}
                                                            onChange={e => { e.stopPropagation(); handleStatusChange(order.id, e.target.value); }}
                                                            onClick={e => e.stopPropagation()}
                                                            style={{ background: STATUS_META[order.status]?.bg, color: STATUS_META[order.status]?.color, border: `1px solid ${STATUS_META[order.status]?.color}40`, borderRadius: '8px', padding: '6px 10px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', outline: 'none' }}
                                                        >
                                                            {Object.keys(STATUS_META).map(s => <option key={s} value={s} style={{ background: '#0a1e14', color: '#f5e4c3' }}>{STATUS_META[s].label}</option>)}
                                                        </select>
                                                        <button onClick={e => { e.stopPropagation(); handleDeleteOrder(order.id); }} style={{ background: 'rgba(224,85,85,0.1)', border: '1px solid rgba(224,85,85,0.25)', borderRadius: '7px', padding: '6px 8px', color: '#e07070', cursor: 'pointer', display: 'flex' }}>
                                                            <Trash2 size={13} />
                                                        </button>
                                                        <ChevronDown size={16} color="rgba(212,175,55,0.5)" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                                                    </div>
                                                </div>

                                                {/* Expanded details */}
                                                {expanded && (
                                                    <div style={{ borderTop: '1px solid rgba(212,175,55,0.08)', padding: '16px 20px', background: 'rgba(255,255,255,0.01)' }}>
                                                        <div style={{ marginBottom: '12px', color: 'rgba(245,228,195,0.45)', fontSize: '0.75rem' }}>
                                                            📍 {order.address || 'No address provided'} &nbsp;·&nbsp; 💳 {order.paymentMethod || 'COD'} &nbsp;·&nbsp; 🕐 {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : '—'}
                                                        </div>
                                                        {order.items?.map((item, i) => (
                                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'rgba(245,228,195,0.65)', fontSize: '0.83rem' }}>
                                                                <span>{item.name} ({item.weight || '—'}) × {item.quantity || item.qty}</span>
                                                                <span style={{ fontWeight: 700, color: '#f5e4c3' }}>₹{((item.price) * (item.quantity || item.qty)).toLocaleString()}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ══ INVENTORY ════════════════════════════════════════════════════ */}
                    {activeSection === 'inventory' && (
                        <div>
                            <SectionHeader title="Inventory Management" subtitle="Track stock levels and reorder needs" />

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '14px', marginBottom: '28px' }}>
                                {[
                                    { label: 'Total SKUs', value: products.length, Icon: Package, color: '#9b7fe8' },
                                    { label: 'In Stock', value: products.filter(p => (p.stock ?? 999) >= 20).length, Icon: CheckCircle, color: '#4caf82' },
                                    { label: 'Low Stock', value: lowStock.length, Icon: AlertTriangle, color: '#e5a020' },
                                    { label: 'Out of Stock', value: products.filter(p => (p.stock ?? 999) === 0).length, Icon: XSquare, color: '#e05555' },
                                ].map(({ label, value, Icon, color }) => (
                                    <div key={label} style={{ ...S.card, display: 'flex', gap: '14px', alignItems: 'center' }}>
                                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Icon size={20} color={color} />
                                        </div>
                                        <div>
                                            <div style={{ color: 'rgba(245,228,195,0.4)', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>{label}</div>
                                            <div style={{ color, fontSize: '1.5rem', fontWeight: 800, fontFamily: 'serif' }}>{value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
                                <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
                                    <span style={{ color: '#d4af37', fontFamily: 'serif', fontWeight: 700 }}>Stock Levels — All Products</span>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead><tr>{['Product', 'Category', 'Stock', 'Status', 'Reorder?'].map(h => <th key={h} style={S.tableHead}>{h}</th>)}</tr></thead>
                                        <tbody>
                                            {[...products].sort((a, b) => (a.stock ?? 999) - (b.stock ?? 999)).map(p => {
                                                const stock = p.stock ?? 0;
                                                const status = stock === 0 ? 'Out' : stock < 20 ? 'Low' : 'OK';
                                                const statusColor = stock === 0 ? '#e05555' : stock < 20 ? '#e5a020' : '#4caf82';
                                                const pct = Math.min(100, Math.round((stock / 100) * 100));
                                                return (
                                                    <tr key={p.id} className="table-row-hover">
                                                        <td style={S.tableCell}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                <img src={p.image} alt="" style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', background: '#0a1e14' }} />
                                                                <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{p.name}</div>
                                                            </div>
                                                        </td>
                                                        <td style={S.tableCell}><span style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', borderRadius: '6px', padding: '3px 9px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'capitalize' }}>{p.category}</span></td>
                                                        <td style={S.tableCell}>
                                                            <div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                                                    <span style={{ color: statusColor, fontWeight: 700 }}>{stock}</span>
                                                                    <span style={{ color: 'rgba(245,228,195,0.3)', fontSize: '0.72rem' }}>units</span>
                                                                </div>
                                                                <div style={{ width: '80px', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                                                                    <div style={{ height: '100%', width: `${pct}%`, background: statusColor, borderRadius: '4px' }} />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={S.tableCell}><span style={{ background: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}40`, borderRadius: '20px', padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700 }}>{status}</span></td>
                                                        <td style={S.tableCell}>{stock < 20 && <button onClick={() => openEditForm(p)} style={{ background: 'rgba(229,160,32,0.12)', border: '1px solid rgba(229,160,32,0.3)', borderRadius: '7px', padding: '5px 12px', color: '#e5a020', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>Update Stock</button>}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══ CUSTOMERS ════════════════════════════════════════════════════ */}
                    {activeSection === 'customers' && (
                        <div>
                            <SectionHeader title="Customer Directory" subtitle="View and manage registered customers" />
                            <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '360px' }}>
                                <Search size={14} color="rgba(212,175,55,0.45)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input value={custSearch} onChange={e => setCustSearch(e.target.value)} placeholder="Search name or email…" style={{ ...S.input, paddingLeft: '36px', width: '100%', boxSizing: 'border-box' }} className="admin-input" />
                            </div>

                            <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead><tr style={{ background: 'rgba(212,175,55,0.04)' }}>{['Customer', 'Email', 'Orders', 'Total Spent', 'Joined'].map(h => <th key={h} style={S.tableHead}>{h}</th>)}</tr></thead>
                                    <tbody>
                                        {filteredCustomers.map(c => (
                                            <tr key={c.id} className="table-row-hover">
                                                <td style={S.tableCell}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#d4af37,#9a7d25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800, color: '#0c1f14', flexShrink: 0 }}>
                                                            {c.name[0]}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600, color: '#f5e4c3', fontSize: '0.86rem' }}>{c.name}</div>
                                                            <div style={{ color: 'rgba(245,228,195,0.35)', fontSize: '0.7rem', fontFamily: 'monospace' }}>{c.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ ...S.tableCell, color: 'rgba(245,228,195,0.6)', fontSize: '0.8rem' }}>{c.email}</td>
                                                <td style={{ ...S.tableCell, fontWeight: 700 }}>{c.orders}</td>
                                                <td style={{ ...S.tableCell, color: '#d4af37', fontWeight: 800 }}>₹{c.spent.toLocaleString()}</td>
                                                <td style={{ ...S.tableCell, color: 'rgba(245,228,195,0.4)', fontSize: '0.75rem' }}>{new Date(c.joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ══ PROMOTIONS / COUPONS ═════════════════════════════════════════ */}
                    {activeSection === 'coupons' && (
                        <div>
                            <SectionHeader
                                title="Promotions & Coupons"
                                subtitle="Create and manage discount codes"
                                action={<GoldBtn onClick={() => setShowCouponForm(s => !s)}><Plus size={14} /> New Coupon</GoldBtn>}
                            />

                            {showCouponForm && (
                                <div style={{ ...S.card, marginBottom: '20px', borderColor: 'rgba(212,175,55,0.25)' }}>
                                    <div style={{ fontWeight: 700, color: '#d4af37', fontFamily: 'serif', marginBottom: '16px' }}>Create Coupon</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '12px', marginBottom: '14px' }}>
                                        <div>
                                            <label style={{ display: 'block', color: 'rgba(212,175,55,0.7)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>Coupon Code</label>
                                            <input value={newCoupon.code} onChange={e => setNewCoupon(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="e.g. SAVE20" style={{ ...S.input, width: '100%', boxSizing: 'border-box', textTransform: 'uppercase' }} className="admin-input" />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', color: 'rgba(212,175,55,0.7)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>Discount</label>
                                            <input value={newCoupon.discount} onChange={e => setNewCoupon(p => ({ ...p, discount: e.target.value }))} type="number" placeholder="20" style={{ ...S.input, width: '100%', boxSizing: 'border-box' }} className="admin-input" />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', color: 'rgba(212,175,55,0.7)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>Type</label>
                                            <select value={newCoupon.type} onChange={e => setNewCoupon(p => ({ ...p, type: e.target.value }))} style={{ ...S.input, width: '100%', boxSizing: 'border-box' }}>
                                                <option value="percent">Percent (%)</option>
                                                <option value="flat">Flat (₹)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <GoldBtn onClick={addCoupon}><Save size={13} /> Create</GoldBtn>
                                        <GoldBtn outline onClick={() => setShowCouponForm(false)}>Cancel</GoldBtn>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '14px' }}>
                                {coupons.map(c => (
                                    <div key={c.code} style={{ ...S.card, opacity: c.active ? 1 : 0.5, transition: 'opacity 0.2s' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                                            <div>
                                                <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 800, color: '#d4af37', letterSpacing: '0.08em' }}>{c.code}</div>
                                                <div style={{ color: 'rgba(245,228,195,0.5)', fontSize: '0.75rem', marginTop: '3px' }}>
                                                    {c.type === 'percent' ? `${c.discount}% off` : `₹${c.discount} flat off`}
                                                </div>
                                            </div>
                                            <span style={{ background: c.active ? 'rgba(76,175,130,0.15)' : 'rgba(224,85,85,0.12)', color: c.active ? '#4caf82' : '#e05555', border: `1px solid ${c.active ? '#4caf8240' : '#e0555540'}`, borderRadius: '20px', padding: '3px 10px', fontSize: '0.68rem', fontWeight: 700 }}>
                                                {c.active ? 'ACTIVE' : 'INACTIVE'}
                                            </span>
                                        </div>
                                        <div style={{ color: 'rgba(245,228,195,0.35)', fontSize: '0.75rem', marginBottom: '14px' }}>Used {c.used} times</div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <GoldBtn small outline onClick={() => toggleCoupon(c.code)}>{c.active ? 'Disable' : 'Enable'}</GoldBtn>
                                            <GoldBtn small danger onClick={() => deleteCoupon(c.code)}><Trash2 size={12} /></GoldBtn>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ══ SETTINGS ════════════════════════════════════════════════════ */}
                    {activeSection === 'settings' && (
                        <div style={{ maxWidth: '720px' }}>
                            <SectionHeader title="Store Settings" subtitle="Configure your store preferences" />

                            {/* General */}
                            <div style={{ ...S.card, marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
                                    <Globe size={16} color="#d4af37" />
                                    <span style={{ color: '#d4af37', fontWeight: 700, fontFamily: 'serif' }}>General</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <Field label="Store Name" name="storeName" value={settings.storeName} onChange={e => setSettings(s => ({ ...s, storeName: e.target.value }))} />
                                    <Field label="Contact Email" name="email" value={settings.email} onChange={e => setSettings(s => ({ ...s, email: e.target.value }))} />
                                    <Field label="Currency Symbol" name="currency" value={settings.currency} onChange={e => setSettings(s => ({ ...s, currency: e.target.value }))} />
                                    <Field label="Tax Rate (%)" name="taxRate" type="number" value={settings.taxRate} onChange={e => setSettings(s => ({ ...s, taxRate: e.target.value }))} />
                                </div>
                            </div>

                            {/* Shipping */}
                            <div style={{ ...S.card, marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
                                    <Truck size={16} color="#4fa3e0" />
                                    <span style={{ color: '#d4af37', fontWeight: 700, fontFamily: 'serif' }}>Shipping</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <Field label="Minimum Order (₹)" name="minOrder" type="number" value={settings.minOrder} onChange={e => setSettings(s => ({ ...s, minOrder: e.target.value }))} />
                                    <Field label="Free Shipping Above (₹)" name="freeShipping" type="number" value={settings.freeShipping} onChange={e => setSettings(s => ({ ...s, freeShipping: e.target.value }))} />
                                </div>
                            </div>

                            {/* Notifications */}
                            <div style={{ ...S.card, marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
                                    <Bell size={16} color="#9b7fe8" />
                                    <span style={{ color: '#d4af37', fontWeight: 700, fontFamily: 'serif' }}>Notifications</span>
                                </div>
                                {[
                                    { key: 'emailNotifs', label: 'Email Notifications', desc: 'Receive daily order summaries via email' },
                                    { key: 'orderAlerts', label: 'New Order Alerts', desc: 'Push alerts for every new order placed' },
                                ].map(({ key, label, desc }) => (
                                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <div>
                                            <div style={{ color: '#f5e4c3', fontWeight: 600, fontSize: '0.88rem' }}>{label}</div>
                                            <div style={{ color: 'rgba(245,228,195,0.35)', fontSize: '0.75rem', marginTop: '2px' }}>{desc}</div>
                                        </div>
                                        <button onClick={() => setSettings(s => ({ ...s, [key]: !s[key] }))} style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: settings[key] ? '#d4af37' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                                            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: settings[key] ? '23px' : '3px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <GoldBtn onClick={() => showToast('Settings saved!')}><Save size={14} /> Save All Settings</GoldBtn>
                        </div>
                    )}
                </div>
            </div>

            {/* ─── Product Form Modal ──────────────────────────────────────────────── */}
            {showProductForm && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(6,15,10,0.88)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: 'linear-gradient(145deg, #0e2218, #0a1a13)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '22px', padding: '34px', width: '100%', maxWidth: '660px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 40px 100px rgba(0,0,0,0.75)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '26px' }}>
                            <div>
                                <h3 style={{ color: '#d4af37', fontFamily: 'serif', fontSize: '1.15rem', fontWeight: 700, margin: '0 0 4px' }}>
                                    {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
                                </h3>
                                <p style={{ color: 'rgba(245,228,195,0.35)', fontSize: '0.75rem', margin: 0 }}>Fill in the product details below</p>
                            </div>
                            <button onClick={() => setShowProductForm(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '10px', width: '36px', height: '36px', color: 'rgba(245,228,195,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X size={16} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            <Field label="Product ID *" name="id" value={productForm.id} onChange={handleFormChange} placeholder="e.g. pepper-whole-black" disabled={!!editingProduct} />
                            <Field label="Product Name *" name="name" value={productForm.name} onChange={handleFormChange} placeholder="Full product name" />
                            <Field label="Subname / Tagline" name="subname" value={productForm.subname} onChange={handleFormChange} placeholder="Short descriptor" />
                            <Field label="Price (₹) *" name="price" type="number" value={productForm.price} onChange={handleFormChange} placeholder="0" />
                            <Field label="Original Price (₹)" name="originalPrice" type="number" value={productForm.originalPrice} onChange={handleFormChange} placeholder="0" />
                            <Field label="Weight / Unit" name="weight" value={productForm.weight} onChange={handleFormChange} placeholder="e.g. 100g, 1L" />
                            <Field label="Stock Quantity" name="stock" type="number" value={productForm.stock} onChange={handleFormChange} placeholder="0" />
                            <Field label="Image Path / URL" name="image" value={productForm.image} onChange={handleFormChange} placeholder="/images/products/..." />
                            <Field label="Tag" name="tag" value={productForm.tag} onChange={handleFormChange} placeholder="EXTRA BOLD" />
                            <Field label="Type Tag" name="typeTag" value={productForm.typeTag} onChange={handleFormChange} placeholder="WHOLE / GROUND / RAW" />
                            <Field label="Origin Badge" name="originBadge" value={productForm.originBadge} onChange={handleFormChange} placeholder="MALABAR COAST" />
                            <Field label="Elevation" name="elevation" value={productForm.elevation} onChange={handleFormChange} placeholder="e.g. 3,800 ft" />
                            <Field label="Harvest Season" name="harvestSeason" value={productForm.harvestSeason} onChange={handleFormChange} placeholder="Sep – Dec" />
                            <Field label="Aroma Profile" name="aromaProfile" value={productForm.aromaProfile} onChange={handleFormChange} placeholder="Floral, citrus, earthy" />

                            {/* Category select */}
                            <div>
                                <label style={{ display: 'block', color: 'rgba(212,175,55,0.7)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>Category *</label>
                                <select name="category" value={productForm.category} onChange={handleFormChange} style={{ width: '100%', padding: '10px 13px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: '10px', color: '#f5e4c3', fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit' }}>
                                    {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#0a1e14' }}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div style={{ marginTop: '14px' }}>
                            <label style={{ display: 'block', color: 'rgba(212,175,55,0.7)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>Description</label>
                            <textarea name="description" value={productForm.description || ''} onChange={handleFormChange} rows={3} placeholder="Product description…" style={{ width: '100%', padding: '10px 13px', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: '10px', color: '#f5e4c3', fontSize: '0.85rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} className="admin-input" />
                        </div>

                        {/* Error */}
                        {formError && (
                            <div style={{ background: 'rgba(220,50,50,0.12)', border: '1px solid rgba(220,50,50,0.3)', borderRadius: '10px', padding: '11px 14px', marginTop: '14px', color: '#ff7070', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertTriangle size={14} /> {formError}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
                            <GoldBtn outline onClick={() => setShowProductForm(false)}>Cancel</GoldBtn>
                            <GoldBtn onClick={handleProductSave}>
                                {formSaving ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
                                {editingProduct ? 'Save Changes' : 'Add Product'}
                            </GoldBtn>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Global Styles ───────────────────────────────────────────────────── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                .sidebar-btn:hover {
                    background: rgba(212,175,55,0.1) !important;
                    color: rgba(245,228,195,0.8) !important;
                }
                .stat-card:hover {
                    border-color: rgba(212,175,55,0.25) !important;
                }
                .table-row-hover:hover {
                    background: rgba(212,175,55,0.04);
                }
                .admin-btn:hover {
                    opacity: 0.85;
                    transform: translateY(-1px);
                }
                .admin-input:focus {
                    border-color: rgba(212,175,55,0.45) !important;
                    box-shadow: 0 0 0 3px rgba(212,175,55,0.07);
                }
                .admin-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .admin-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .admin-scroll::-webkit-scrollbar-thumb {
                    background: rgba(212,175,55,0.2);
                    border-radius: 4px;
                }
                .admin-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(212,175,55,0.35);
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
