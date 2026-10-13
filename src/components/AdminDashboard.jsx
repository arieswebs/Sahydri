import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Package, ShoppingBag, LogOut,
    Plus, Edit3, Trash2, X, Save, Search,
    RefreshCw, Truck, CheckCircle, Clock, AlertTriangle, Leaf,
    Users, Menu, ChevronRight, Bell, Settings, Percent,
    ArrowUpRight, ArrowDownRight, Boxes,
    ExternalLink
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

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
        storeName: 'Sahyadri Organics', email: 'care@sahyadri.com',
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
        } catch { showToast('Backend offline — local sample data displayed'); }
        finally { setProdLoading(false); }
    };

    const loadOrders = async () => {
        setOrdersLoading(true);
        try {
            const res  = await authFetch(`${API}/orders`);
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
        if (!productForm.name || !productForm.price || !productForm.category) {
            setFormError('Product Name, Price and Category are required.');
            return;
        }
        setFormSaving(true);
        setFormError('');

        try {
            if (editingProduct) {
                const res = await authFetch(`${API}/products/${productForm.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(productForm)
                });
                const json = await res.json();
                if (json.success) {
                    setProducts(prev => prev.map(p => p.id === json.data.id ? json.data : p));
                    showToast('Product updated successfully!');
                    setShowProductForm(false);
                    await fetchProducts?.();
                } else {
                    setFormError(json.message || 'Failed to update product');
                }
            } else {
                const res = await authFetch(`${API}/products`, {
                    method: 'POST',
                    body: JSON.stringify(productForm)
                });
                const json = await res.json();
                if (json.success) {
                    setProducts(prev => [json.data, ...prev]);
                    showToast('Product added to database!');
                    setShowProductForm(false);
                    await fetchProducts?.();
                } else {
                    setFormError(json.message || 'Failed to add product');
                }
            }
        } catch (err) {
            setFormError(err.message || 'Failed to reach backend server');
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
                showToast(data.message || 'Could not delete product');
            }
        } catch (err) {
            showToast('Failed to delete: ' + err.message);
        }
    };

    // ── Order status ──────────────────────────────────────────────────────────
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const res = await authFetch(`${API}/orders/${orderId}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
                showToast(`Order status updated to ${newStatus}`);
            } else {
                showToast(data.message || 'Could not update status');
            }
        } catch (err) {
            showToast('Network error updating status');
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
                            <div style={{ color: '#0a221a', fontWeight: 800, fontSize: '0.92rem', letterSpacing: '0.04em' }}>SAHYADRI</div>
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
                                {currentUser?.name || 'Admin'}
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
                            <Field label="Weight" name="weight" value={productForm.weight} onChange={handleFormChange} placeholder="100g" />
                            <Field label="Stock Count" name="stock" type="number" value={productForm.stock} onChange={handleFormChange} placeholder="100" />
                            <Field label="Origin Badge" name="originBadge" value={productForm.originBadge} onChange={handleFormChange} placeholder="e.g. WAYANAD ESTATE" />
                            <Field label="Elevation" name="elevation" value={productForm.elevation} onChange={handleFormChange} placeholder="e.g. 3,200 ft" />
                            <Field label="Image Path / URL" name="image" value={productForm.image} onChange={handleFormChange} placeholder="/images/products/... or https://..." />

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
