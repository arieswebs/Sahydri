import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Package, ShoppingBag, TrendingUp, LogOut,
    Plus, Edit3, Trash2, X, Save, Check, ChevronDown, Search,
    RefreshCw, Truck, CheckCircle, Clock, Eye, AlertTriangle, Leaf,
    BarChart2, Users, DollarSign, Menu
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

const STATUS_META = {
    pending: { label: 'Pending', color: '#e5a020', bg: 'rgba(229,160,32,0.12)', Icon: Clock },
    processing: { label: 'Processing', color: '#4fa3e0', bg: 'rgba(79,163,224,0.12)', Icon: RefreshCw },
    shipped: { label: 'Shipped', color: '#9b7fe8', bg: 'rgba(155,127,232,0.12)', Icon: Truck },
    delivered: { label: 'Delivered', color: '#4caf82', bg: 'rgba(76,175,130,0.12)', Icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: '#e05555', bg: 'rgba(224,85,85,0.12)', Icon: X }
};

const CATEGORIES = ['spices', 'powders', 'honey', 'oils'];

const BLANK_PRODUCT = {
    id: '', name: '', subname: '', category: 'spices', price: '', originalPrice: '',
    weight: '', stock: '', image: '', description: '', tag: '', typeTag: '', originBadge: ''
};

export default function AdminDashboard({ onClose }) {
    const { currentUser, logout, showToast, API, fetchProducts } = useShop();
    const [activeSection, setActiveSection] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // ── Products State ──────────────────────────────────────────────────────────
    const [products, setProducts] = useState([]);
    const [prodLoading, setProdLoading] = useState(true);
    const [prodSearch, setProdSearch] = useState('');
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState(BLANK_PRODUCT);
    const [formError, setFormError] = useState('');

    // ── Orders State ─────────────────────────────────────────────────────────────
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [orderSearch, setOrderSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // ── Fetch Data ───────────────────────────────────────────────────────────────
    useEffect(() => {
        loadProducts();
        loadOrders();
    }, []);

    const loadProducts = async () => {
        setProdLoading(true);
        try {
            const res = await fetch(`${API}/products`);
            const json = await res.json();
            if (json.success) setProducts(json.data);
        } catch { showToast('Could not reach backend – showing static data'); }
        finally { setProdLoading(false); }
    };

    const loadOrders = async () => {
        setOrdersLoading(true);
        try {
            const res = await fetch(`${API}/orders`);
            const json = await res.json();
            if (json.success) setOrders(json.data);
        } catch { setOrders([]); }
        finally { setOrdersLoading(false); }
    };

    // ── Product CRUD ─────────────────────────────────────────────────────────────
    const openAddForm = () => {
        setEditingProduct(null);
        setProductForm(BLANK_PRODUCT);
        setFormError('');
        setShowProductForm(true);
    };

    const openEditForm = (product) => {
        setEditingProduct(product);
        setProductForm({ ...product });
        setFormError('');
        setShowProductForm(true);
    };

    const handleFormChange = (e) => {
        setProductForm(p => ({ ...p, [e.target.name]: e.target.value }));
        setFormError('');
    };

    const handleProductSave = async () => {
        if (!productForm.id || !productForm.name || !productForm.price || !productForm.category) {
            setFormError('ID, Name, Price, and Category are required.');
            return;
        }
        try {
            if (editingProduct) {
                const res = await fetch(`${API}/products/${productForm.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productForm)
                });
                const json = await res.json();
                if (json.success) {
                    setProducts(prev => prev.map(p => p.id === json.data.id ? json.data : p));
                    showToast('Product updated!');
                }
            } else {
                const res = await fetch(`${API}/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productForm)
                });
                const json = await res.json();
                if (json.success) {
                    setProducts(prev => [...prev, json.data]);
                    showToast('Product added!');
                } else {
                    setFormError(json.message);
                    return;
                }
            }
            fetchProducts();
            setShowProductForm(false);
        } catch {
            setFormError('Backend unreachable. Changes saved locally only.');
            if (editingProduct) {
                setProducts(prev => prev.map(p => p.id === productForm.id ? { ...p, ...productForm } : p));
            } else {
                setProducts(prev => [...prev, { ...productForm, rating: 5, reviewsCount: 0 }]);
            }
            setShowProductForm(false);
            showToast(editingProduct ? 'Product updated (local)' : 'Product added (local)');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await fetch(`${API}/products/${id}`, { method: 'DELETE' });
            setProducts(prev => prev.filter(p => p.id !== id));
            fetchProducts();
            showToast('Product deleted');
        } catch {
            setProducts(prev => prev.filter(p => p.id !== id));
            showToast('Product deleted (local)');
        }
    };

    // ── Order Status Update ───────────────────────────────────────────────────────
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await fetch(`${API}/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
        } catch { /* silent */ }
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        showToast(`Order ${orderId} → ${newStatus}`);
    };

    // ── Computed Metrics ─────────────────────────────────────────────────────────
    const metrics = {
        revenue: orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
        orders: orders.length,
        products: products.length,
        delivered: orders.filter(o => o.status === 'delivered').length
    };

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(prodSearch.toLowerCase()) ||
        p.category?.toLowerCase().includes(prodSearch.toLowerCase())
    );

    const filteredOrders = orders.filter(o => {
        const matchSearch = o.id?.toLowerCase().includes(orderSearch.toLowerCase()) ||
            o.customerName?.toLowerCase().includes(orderSearch.toLowerCase());
        const matchStatus = statusFilter === 'all' || o.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleLogout = () => { logout(); showToast('Logged out'); onClose(); };

    const NAV_ITEMS = [
        { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
        { id: 'products', label: 'Products', Icon: Package },
        { id: 'orders', label: 'Orders', Icon: ShoppingBag },
    ];

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', background: '#060f0a', fontFamily: 'system-ui, sans-serif' }}>
            {/* ─── Sidebar ─────────────────────────────────────────────────────────── */}
            <div style={{
                width: sidebarOpen ? '230px' : '64px', flexShrink: 0,
                background: 'linear-gradient(180deg, #0a1e14, #060f0a)',
                borderRight: '1px solid rgba(212,175,55,0.12)',
                display: 'flex', flexDirection: 'column',
                transition: 'width 0.3s ease', overflow: 'hidden'
            }}>
                <div style={{
                    padding: '20px 14px', borderBottom: '1px solid rgba(212,175,55,0.1)',
                    display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap'
                }}>
                    <Leaf size={20} color="#d4af37" />
                    {sidebarOpen && (
                        <div>
                            <div style={{ color: '#d4af37', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'serif', letterSpacing: '0.05em' }}>SAHYADRI</div>
                            <div style={{ color: 'rgba(212,175,55,0.5)', fontSize: '0.65rem', letterSpacing: '0.15em' }}>ADMIN PANEL</div>
                        </div>
                    )}
                </div>

                <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {NAV_ITEMS.map(({ id, label, Icon }) => {
                        const active = activeSection === id;
                        return (
                            <button
                                key={id}
                                onClick={() => setActiveSection(id)}
                                title={!sidebarOpen ? label : ''}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '11px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                    background: active ? 'linear-gradient(135deg, rgba(212,175,55,0.22), rgba(212,175,55,0.08))' : 'transparent',
                                    borderLeft: active ? '2px solid #d4af37' : '2px solid transparent',
                                    color: active ? '#d4af37' : 'rgba(245,228,195,0.45)',
                                    fontWeight: active ? 700 : 500, fontSize: '0.85rem',
                                    whiteSpace: 'nowrap', transition: 'all 0.2s ease', textAlign: 'left'
                                }}
                            >
                                <Icon size={17} />
                                {sidebarOpen && label}
                            </button>
                        );
                    })}
                </nav>

                <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '11px 14px', borderRadius: '10px', border: 'none',
                            background: 'transparent', color: '#e07070', cursor: 'pointer',
                            fontSize: '0.85rem', width: '100%', whiteSpace: 'nowrap'
                        }}
                    >
                        <LogOut size={16} />
                        {sidebarOpen && 'Logout'}
                    </button>
                </div>
            </div>

            {/* ─── Main Content ─────────────────────────────────────────────────────── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Topbar */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 28px', borderBottom: '1px solid rgba(212,175,55,0.1)',
                    background: 'rgba(10,30,20,0.6)', backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: '#d4af37', cursor: 'pointer', display: 'flex' }}>
                            <Menu size={20} />
                        </button>
                        <h1 style={{ color: '#f5e4c3', margin: 0, fontSize: '1rem', fontWeight: 700, fontFamily: 'serif', textTransform: 'capitalize' }}>
                            {activeSection === 'overview' ? 'Dashboard Overview' : activeSection}
                        </h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)',
                            borderRadius: '20px', padding: '5px 14px',
                            color: '#d4af37', fontSize: '0.78rem', fontWeight: 700
                        }}>
                            ADMIN
                        </div>
                        <span style={{ color: 'rgba(245,228,195,0.6)', fontSize: '0.82rem' }}>{currentUser?.name}</span>
                        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', width: '32px', height: '32px', color: '#d4af37', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <X size={15} />
                        </button>
                    </div>
                </div>

                <div style={{ flex: 1, overflow: 'auto', padding: '28px' }}>

                    {/* ══ OVERVIEW ══════════════════════════════════════════════════════ */}
                    {activeSection === 'overview' && (
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                                {[
                                    { label: 'Total Revenue', value: `₹${metrics.revenue.toLocaleString()}`, Icon: DollarSign, color: '#d4af37' },
                                    { label: 'Total Orders', value: metrics.orders, Icon: ShoppingBag, color: '#4fa3e0' },
                                    { label: 'Products', value: metrics.products, Icon: Package, color: '#9b7fe8' },
                                    { label: 'Delivered', value: metrics.delivered, Icon: CheckCircle, color: '#4caf82' }
                                ].map(({ label, value, Icon, color }) => (
                                    <div key={label} style={{
                                        background: 'linear-gradient(145deg, rgba(255,255,255,0.04), transparent)',
                                        border: '1px solid rgba(212,175,55,0.12)', borderRadius: '16px', padding: '22px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div style={{ color: 'rgba(245,228,195,0.5)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</div>
                                                <div style={{ color: color, fontSize: '1.6rem', fontWeight: 800, fontFamily: 'serif' }}>{value}</div>
                                            </div>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Icon size={18} color={color} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Orders */}
                            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '16px', padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <h3 style={{ color: '#d4af37', fontFamily: 'serif', fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Recent Orders</h3>
                                    <button onClick={() => setActiveSection('orders')} style={{ background: 'none', border: 'none', color: 'rgba(212,175,55,0.6)', cursor: 'pointer', fontSize: '0.78rem' }}>View all →</button>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
                                                {['Order ID', 'Customer', 'Total', 'Status'].map(h => (
                                                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'rgba(212,175,55,0.6)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.slice(0, 5).map(order => {
                                                const meta = STATUS_META[order.status] || STATUS_META.pending;
                                                return (
                                                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                        <td style={{ padding: '10px 12px', color: '#d4af37', fontFamily: 'monospace', fontSize: '0.82rem' }}>{order.id}</td>
                                                        <td style={{ padding: '10px 12px', color: '#f5e4c3', fontSize: '0.85rem' }}>{order.customerName}</td>
                                                        <td style={{ padding: '10px 12px', color: '#f5e4c3', fontWeight: 700, fontSize: '0.85rem' }}>₹{order.total?.toLocaleString()}</td>
                                                        <td style={{ padding: '10px 12px' }}>
                                                            <span style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}40`, borderRadius: '20px', padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
                                                                {meta.label}
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

                    {/* ══ PRODUCTS ══════════════════════════════════════════════════════ */}
                    {activeSection === 'products' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                                <div style={{ position: 'relative' }}>
                                    <Search size={14} color="rgba(212,175,55,0.5)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        value={prodSearch} onChange={e => setProdSearch(e.target.value)}
                                        placeholder="Search products..."
                                        style={{
                                            padding: '10px 14px 10px 36px', background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(212,175,55,0.2)', borderRadius: '10px',
                                            color: '#f5e4c3', fontSize: '0.85rem', outline: 'none', width: '240px'
                                        }}
                                    />
                                </div>
                                <button onClick={openAddForm} style={{
                                    display: 'flex', alignItems: 'center', gap: '7px',
                                    background: 'linear-gradient(135deg, #d4af37, #b8972f)',
                                    border: 'none', borderRadius: '10px', padding: '10px 18px',
                                    color: '#0c1f14', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
                                }}>
                                    <Plus size={15} /> Add Product
                                </button>
                            </div>

                            {prodLoading ? (
                                <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(245,228,195,0.4)' }}>Loading products…</div>
                            ) : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
                                                {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (
                                                    <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: 'rgba(212,175,55,0.6)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProducts.map(p => (
                                                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.04)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <td style={{ padding: '12px 14px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', background: '#0a1e14' }} />
                                                            <div>
                                                                <div style={{ color: '#f5e4c3', fontSize: '0.85rem', fontWeight: 600 }}>{p.name}</div>
                                                                <div style={{ color: 'rgba(245,228,195,0.4)', fontSize: '0.72rem' }}>{p.weight}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '12px 14px' }}>
                                                        <span style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', borderRadius: '6px', padding: '3px 9px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                                            {p.category}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '12px 14px', color: '#d4af37', fontWeight: 700, fontSize: '0.88rem' }}>₹{p.price}</td>
                                                    <td style={{ padding: '12px 14px' }}>
                                                        <span style={{ color: p.stock < 20 ? '#e05555' : '#4caf82', fontSize: '0.85rem', fontWeight: 600 }}>
                                                            {p.stock ?? '—'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '12px 14px', color: '#f5e4c3', fontSize: '0.85rem' }}>⭐ {p.rating}</td>
                                                    <td style={{ padding: '12px 14px' }}>
                                                        <div style={{ display: 'flex', gap: '6px' }}>
                                                            <button onClick={() => openEditForm(p)} style={{ background: 'rgba(79,163,224,0.1)', border: '1px solid rgba(79,163,224,0.25)', borderRadius: '7px', padding: '6px 10px', color: '#4fa3e0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}>
                                                                <Edit3 size={12} /> Edit
                                                            </button>
                                                            <button onClick={() => handleDeleteProduct(p.id)} style={{ background: 'rgba(224,85,85,0.1)', border: '1px solid rgba(224,85,85,0.25)', borderRadius: '7px', padding: '6px 10px', color: '#e05555', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}>
                                                                <Trash2 size={12} /> Del
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ══ ORDERS ════════════════════════════════════════════════════════ */}
                    {activeSection === 'orders' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                                <div style={{ position: 'relative' }}>
                                    <Search size={14} color="rgba(212,175,55,0.5)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
                                        placeholder="Search by order ID or customer…"
                                        style={{
                                            padding: '10px 14px 10px 36px', background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(212,175,55,0.2)', borderRadius: '10px',
                                            color: '#f5e4c3', fontSize: '0.85rem', outline: 'none', width: '260px'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {['all', ...Object.keys(STATUS_META)].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setStatusFilter(s)}
                                            style={{
                                                padding: '7px 13px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                                                background: statusFilter === s ? 'linear-gradient(135deg, #d4af37, #b8972f)' : 'rgba(255,255,255,0.05)',
                                                color: statusFilter === s ? '#0c1f14' : 'rgba(245,228,195,0.5)',
                                                textTransform: 'capitalize'
                                            }}
                                        >
                                            {s === 'all' ? 'All' : STATUS_META[s].label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {ordersLoading ? (
                                <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(245,228,195,0.4)' }}>Loading orders…</div>
                            ) : filteredOrders.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(245,228,195,0.4)' }}>No orders found.</div>
                            ) : (
                                filteredOrders.map(order => {
                                    const meta = STATUS_META[order.status] || STATUS_META.pending;
                                    return (
                                        <div key={order.id} style={{
                                            background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(212,175,55,0.1)',
                                            borderRadius: '14px', padding: '20px', marginBottom: '14px'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                                                <div>
                                                    <div style={{ color: '#d4af37', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'monospace' }}>{order.id}</div>
                                                    <div style={{ color: '#f5e4c3', fontSize: '0.85rem', marginTop: '2px' }}>{order.customerName}</div>
                                                    <div style={{ color: 'rgba(245,228,195,0.4)', fontSize: '0.75rem' }}>{order.customerEmail} · {order.address}</div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <span style={{ color: '#d4af37', fontWeight: 700, fontSize: '1rem' }}>₹{order.total?.toLocaleString()}</span>
                                                    <select
                                                        value={order.status}
                                                        onChange={e => handleStatusChange(order.id, e.target.value)}
                                                        style={{
                                                            background: meta.bg, color: meta.color,
                                                            border: `1px solid ${meta.color}40`, borderRadius: '8px',
                                                            padding: '6px 10px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', outline: 'none'
                                                        }}
                                                    >
                                                        {Object.keys(STATUS_META).map(s => (
                                                            <option key={s} value={s} style={{ background: '#0a1e14', color: '#f5e4c3' }}>
                                                                {STATUS_META[s].label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            {order.items?.map((item, i) => (
                                                <div key={i} style={{
                                                    display: 'flex', justifyContent: 'space-between',
                                                    color: 'rgba(245,228,195,0.65)', fontSize: '0.82rem',
                                                    paddingLeft: '10px', borderLeft: '2px solid rgba(212,175,55,0.2)',
                                                    marginBottom: '3px'
                                                }}>
                                                    <span>{item.name} ({item.weight || '—'}) × {item.quantity || item.qty}</span>
                                                    <span>₹{((item.price) * (item.quantity || item.qty)).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ─── Product Form Modal ────────────────────────────────────────────────── */}
            {showProductForm && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 3000,
                    background: 'rgba(6,15,10,0.85)', backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}>
                    <div style={{
                        background: 'linear-gradient(145deg, #0e2218, #0a1a13)',
                        border: '1px solid rgba(212,175,55,0.25)', borderRadius: '20px',
                        padding: '32px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
                        boxShadow: '0 32px 80px rgba(0,0,0,0.7)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h3 style={{ color: '#d4af37', fontFamily: 'serif', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button onClick={() => setShowProductForm(false)} style={{ background: 'none', border: 'none', color: '#d4af37', cursor: 'pointer' }}>
                                <X size={18} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            {[
                                { label: 'Product ID *', name: 'id', placeholder: 'e.g. pepper-whole-black', disabled: !!editingProduct },
                                { label: 'Product Name *', name: 'name', placeholder: 'Full product name' },
                                { label: 'Subname / Tagline', name: 'subname', placeholder: 'Short descriptor' },
                                { label: 'Price (₹) *', name: 'price', type: 'number', placeholder: '0' },
                                { label: 'Original Price (₹)', name: 'originalPrice', type: 'number', placeholder: '0' },
                                { label: 'Weight / Unit', name: 'weight', placeholder: 'e.g. 100g, 1L' },
                                { label: 'Stock Quantity', name: 'stock', type: 'number', placeholder: '0' },
                                { label: 'Image Path', name: 'image', placeholder: '/images/products/...' },
                                { label: 'Tag (e.g. BOLD)', name: 'tag', placeholder: 'EXTRA BOLD' },
                                { label: 'Type Tag', name: 'typeTag', placeholder: 'WHOLE / GROUND / RAW' },
                                { label: 'Origin Badge', name: 'originBadge', placeholder: 'MALABAR COAST' },
                            ].map(({ label, name, type, placeholder, disabled }) => (
                                <div key={name}>
                                    <label style={{ display: 'block', color: 'rgba(212,175,55,0.7)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>
                                        {label}
                                    </label>
                                    <input
                                        name={name} type={type || 'text'} value={productForm[name] || ''}
                                        onChange={handleFormChange} placeholder={placeholder} disabled={disabled}
                                        style={{
                                            width: '100%', padding: '10px 12px', boxSizing: 'border-box',
                                            background: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(212,175,55,0.18)', borderRadius: '8px',
                                            color: disabled ? 'rgba(245,228,195,0.4)' : '#f5e4c3',
                                            fontSize: '0.85rem', outline: 'none'
                                        }}
                                    />
                                </div>
                            ))}

                            <div>
                                <label style={{ display: 'block', color: 'rgba(212,175,55,0.7)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>
                                    Category *
                                </label>
                                <select
                                    name="category" value={productForm.category} onChange={handleFormChange}
                                    style={{
                                        width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(212,175,55,0.18)', borderRadius: '8px',
                                        color: '#f5e4c3', fontSize: '0.85rem', outline: 'none'
                                    }}
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#0a1e14' }}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div style={{ marginTop: '14px' }}>
                            <label style={{ display: 'block', color: 'rgba(212,175,55,0.7)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>
                                Description
                            </label>
                            <textarea
                                name="description" value={productForm.description || ''} onChange={handleFormChange}
                                rows={3} placeholder="Product description..."
                                style={{
                                    width: '100%', padding: '10px 12px', boxSizing: 'border-box',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.18)',
                                    borderRadius: '8px', color: '#f5e4c3', fontSize: '0.85rem', outline: 'none',
                                    resize: 'vertical', fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        {formError && (
                            <div style={{ background: 'rgba(220,50,50,0.12)', border: '1px solid rgba(220,50,50,0.3)', borderRadius: '8px', padding: '10px 14px', marginTop: '14px', color: '#ff7070', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertTriangle size={14} /> {formError}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px', marginTop: '22px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowProductForm(false)} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '10px', color: 'rgba(245,228,195,0.7)', cursor: 'pointer', fontSize: '0.85rem' }}>
                                Cancel
                            </button>
                            <button onClick={handleProductSave} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 22px', background: 'linear-gradient(135deg, #d4af37, #b8972f)', border: 'none', borderRadius: '10px', color: '#0c1f14', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                                <Save size={14} /> {editingProduct ? 'Save Changes' : 'Add Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
