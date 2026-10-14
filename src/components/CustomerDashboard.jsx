import React, { useState, useEffect } from 'react';
import {
    User, Package, MapPin, LogOut,
    Star, Truck, CheckCircle, Clock, RefreshCw, Edit3, Save, X,
    ShoppingBag, ChevronRight, ExternalLink, Heart, Plus, Loader,
    LayoutDashboard, Settings, ArrowRight, ArrowLeft
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { getShipwayTrackingUrl } from '../services/shipwayService';

// ─── Status Metadata ──────────────────────────────────────────────────────────
const STATUS_META = {
    pending:    { label: 'Pending',    color: '#b45309', bg: '#fef3c7', Icon: Clock },
    processing: { label: 'Processing', color: '#0369a1', bg: '#e0f2fe', Icon: RefreshCw },
    shipped:    { label: 'Shipped',    color: '#6d28d9', bg: '#ede9fe', Icon: Truck },
    delivered:  { label: 'Delivered',  color: '#15803d', bg: '#dcfce7', Icon: CheckCircle },
    cancelled:  { label: 'Cancelled',  color: '#b91c1c', bg: '#fee2e2', Icon: X },
};

const SECTIONS = ['Overview', 'Orders', 'Addresses', 'Profile', 'Wishlist'];

export default function CustomerDashboard({
    onClose,
    onViewProduct,
    onGoShop,
    isPageMode = false,
    initialSection = 'Overview',
    onTabChange
}) {
    const {
        currentUser, logout, wishlist, products, showToast,
        fetchUserOrders, updateUserProfile, addToCart
    } = useShop();

    const [activeSection, setActiveSection] = useState(initialSection || 'Overview');
    const [editingProfile, setEditingProfile] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);

    useEffect(() => {
        if (initialSection) setActiveSection(initialSection);
    }, [initialSection]);

    const handleSelectSection = (s) => {
        setActiveSection(s);
        onTabChange?.(s);
    };

    // Profile state synced with currentUser
    const [profile, setProfile] = useState({
        name: currentUser?.name || 'Customer',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        address: currentUser?.address || ''
    });

    // Orders state loaded live from backend
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    // Sync profile state when currentUser changes
    useEffect(() => {
        if (currentUser) {
            setProfile({
                name: currentUser.name || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
                address: currentUser.address || ''
            });
        }
    }, [currentUser]);

    // Live order history fetch
    useEffect(() => {
        let isMounted = true;
        const loadOrders = async () => {
            setOrdersLoading(true);
            try {
                const res = await fetchUserOrders();
                if (isMounted) {
                    if (res && res.success && Array.isArray(res.data)) {
                        setOrders(res.data);
                    } else {
                        setOrders([]);
                    }
                }
            } catch {
                if (isMounted) setOrders([]);
            } finally {
                if (isMounted) setOrdersLoading(false);
            }
        };
        loadOrders();
        return () => { isMounted = false; };
    }, [fetchUserOrders]);

    const handleLogout = () => {
        logout();
        showToast('Logged out of account');
        onClose();
    };

    const handleShopClick = () => {
        onClose();
        if (onGoShop) onGoShop();
        else window.location.hash = 'shop';
    };

    const handleSaveProfile = async () => {
        if (editingProfile) {
            setSavingProfile(true);
            const res = await updateUserProfile({
                name: profile.name,
                phone: profile.phone,
                address: profile.address
            });
            setSavingProfile(false);
            if (res.success) {
                showToast('Profile details updated successfully');
                setEditingProfile(false);
            } else {
                showToast(res.message || 'Error updating profile');
            }
        } else {
            setEditingProfile(true);
        }
    };

    const wishlistProducts = products.filter(p => wishlist.includes(p.id));
    const initials = (profile.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    const dashboardCard = (
        <div className={`account-modal-container ${isPageMode ? 'account-page-mode-card' : ''}`} onClick={e => e.stopPropagation()}>

            {/* ── Top Header Bar ── */}
            <div className="account-header">
                <div className="account-user-meta">
                    <div className="account-avatar-pill">
                        <span className="account-avatar-text">{initials}</span>
                    </div>
                    <div>
                        <div className="account-user-name-row">
                            <h2 className="account-user-name">{profile.name || 'Valued Member'}</h2>
                            <span className="account-member-chip">MEMBER</span>
                        </div>
                        <span className="account-user-email">{profile.email}</span>
                    </div>
                </div>

                <div className="account-header-actions">
                    {/* Prominent "Go to Shop" Button */}
                    <button
                        onClick={handleShopClick}
                        className="account-shop-cta-btn"
                        title="Explore Shop Products"
                    >
                        <ShoppingBag size={14} />
                        <span>Go to Shop</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="account-logout-btn"
                        title="Log Out"
                    >
                        <LogOut size={14} />
                        <span className="desktop-text">Sign Out</span>
                    </button>

                    {!isPageMode && (
                        <button
                            onClick={onClose}
                            className="account-close-btn"
                            aria-label="Close dialog"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* ── Main Dashboard Body ── */}
            <div className="account-body-split">

                {/* Sidebar Tabs */}
                <div className="account-sidebar">
                    <div className="account-nav-list">
                        {SECTIONS.map(s => {
                            const icons = {
                                Overview: LayoutDashboard,
                                Orders: Package,
                                Addresses: MapPin,
                                Profile: Settings,
                                Wishlist: Heart
                            };
                            const labels = {
                                Overview: 'Overview',
                                Orders: 'My Orders',
                                Addresses: 'Saved Addresses',
                                Profile: 'Account Settings',
                                Wishlist: 'Wishlist'
                            };
                            const Icon = icons[s] || Package;
                            const active = activeSection === s;
                            const count = s === 'Orders' ? orders.length : s === 'Wishlist' ? wishlistProducts.length : null;

                            return (
                                <button
                                    key={s}
                                    onClick={() => handleSelectSection(s)}
                                    className={`account-tab-btn ${active ? 'account-tab-active' : ''}`}
                                >
                                    <Icon size={16} className="account-tab-icon" />
                                    <span className="account-tab-label">{labels[s] || s}</span>
                                    {count !== null && (
                                        <span className={`account-tab-badge ${active ? 'account-tab-badge-active' : ''}`}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Direct Shop Shortcut in Sidebar */}
                    <div className="account-sidebar-promo">
                        <span className="account-promo-title">Fresh Harvests</span>
                        <p className="account-promo-desc">Single-origin spices & raw forest honey delivered fresh from Kerala.</p>
                        <button onClick={handleShopClick} className="account-promo-link">
                            Browse Shop Catalog →
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="account-main-content">

                    {/* ═════ 0. OVERVIEW SECTION ═════ */}
                    {activeSection === 'Overview' && (
                        <div className="account-section-block">
                            <div className="account-overview-welcome">
                                <div>
                                    <h3 className="account-overview-greeting">Welcome, {profile.name || 'Member'}</h3>
                                    <p className="account-overview-sub">
                                        Your customer dashboard for active dispatches, delivery addresses, and estate spice orders.
                                    </p>
                                </div>
                                <button onClick={handleShopClick} className="account-inline-shop-btn">
                                    <ShoppingBag size={13} />
                                    <span>Browse Shop</span>
                                </button>
                            </div>

                            {/* Clean Snapshot Cards */}
                            <div className="account-overview-grid">
                                <div className="account-overview-card" onClick={() => handleSelectSection('Orders')}>
                                    <div className="account-overview-card-top">
                                        <span className="account-overview-card-label">Orders Placed</span>
                                        <Package size={16} color="#8c733b" />
                                    </div>
                                    <div className="account-overview-card-val">{ordersLoading ? '…' : orders.length}</div>
                                    <div className="account-overview-card-link">View Order History →</div>
                                </div>

                                <div className="account-overview-card" onClick={() => handleSelectSection('Addresses')}>
                                    <div className="account-overview-card-top">
                                        <span className="account-overview-card-label">Delivery Address</span>
                                        <MapPin size={16} color="#8c733b" />
                                    </div>
                                    <div className="account-overview-card-snippet">
                                        {profile.address ? (profile.address.length > 34 ? profile.address.slice(0, 34) + '…' : profile.address) : 'No address saved'}
                                    </div>
                                    <div className="account-overview-card-link">Manage Addresses →</div>
                                </div>

                                <div className="account-overview-card" onClick={() => handleSelectSection('Profile')}>
                                    <div className="account-overview-card-top">
                                        <span className="account-overview-card-label">Account Settings</span>
                                        <Settings size={16} color="#8c733b" />
                                    </div>
                                    <div className="account-overview-card-snippet">
                                        {profile.email}
                                    </div>
                                    <div className="account-overview-card-link">Update Settings →</div>
                                </div>
                            </div>

                            {/* Recent Orders Preview */}
                            <div className="account-overview-recent-block">
                                <div className="account-section-header" style={{ marginTop: '22px' }}>
                                    <div>
                                        <h4 className="account-section-title" style={{ fontSize: '1.02rem' }}>Recent Orders</h4>
                                        <p className="account-section-desc">Latest activity for your account.</p>
                                    </div>
                                    {orders.length > 0 && (
                                        <button onClick={() => handleSelectSection('Orders')} className="account-link-btn-text">
                                            See All ({orders.length}) →
                                        </button>
                                    )}
                                </div>

                                {ordersLoading ? (
                                    <div className="account-loading-box">
                                        <Loader size={20} className="account-spinner" />
                                        <span>Fetching recent dispatches…</span>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="account-empty-state" style={{ padding: '28px 20px' }}>
                                        <Package size={28} color="#8c733b" />
                                        <h4 className="account-empty-title">No orders placed yet</h4>
                                        <p className="account-empty-desc">
                                            Discover our single-origin harvests and raw forest honey directly from Wayanad.
                                        </p>
                                        <button onClick={handleShopClick} className="account-empty-cta">
                                            <ShoppingBag size={14} />
                                            <span>Shop Our Collection</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="account-orders-stack">
                                        {orders.slice(0, 2).map(order => {
                                            const meta = STATUS_META[order.status] || STATUS_META.pending;
                                            const Icon = meta.Icon;
                                            const dateFormatted = order.createdAt
                                                ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })
                                                : 'Recent';

                                            return (
                                                <div key={order.id} className="account-order-card">
                                                    <div className="account-order-top">
                                                        <div>
                                                            <div className="account-order-id">{order.id}</div>
                                                            <div className="account-order-date">Placed on {dateFormatted}</div>
                                                        </div>
                                                        <span
                                                            className="account-status-pill"
                                                            style={{ background: meta.bg, color: meta.color }}
                                                        >
                                                            <Icon size={12} />
                                                            <span>{meta.label}</span>
                                                        </span>
                                                    </div>

                                                    <div className="account-order-items">
                                                        {(order.items || []).map((item, i) => (
                                                            <div key={i} className="account-order-item-row">
                                                                <span className="account-order-item-name">
                                                                    {item.name} {item.weight && <span className="account-item-weight">({item.weight})</span>} × {item.quantity || item.qty || 1}
                                                                </span>
                                                                <span className="account-order-item-price">
                                                                    ₹{((item.price || 0) * (item.quantity || item.qty || 1)).toLocaleString('en-IN')}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="account-order-bottom">
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                                                            <span className="account-order-method">
                                                                Paid via {order.paymentMethod || 'Razorpay / Prepaid'}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    window.open(getShipwayTrackingUrl(order.id), '_blank');
                                                                }}
                                                                style={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: '6px',
                                                                    background: 'rgba(223, 190, 132, 0.12)',
                                                                    border: '1px solid rgba(223, 190, 132, 0.35)',
                                                                    color: '#dfbe84',
                                                                    padding: '4px 10px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '0.72rem',
                                                                    fontWeight: '600',
                                                                    cursor: 'pointer'
                                                                }}
                                                                title="Track live on Shipway"
                                                            >
                                                                <Truck size={12} />
                                                                <span>Track with Shipway</span>
                                                                <ExternalLink size={10} />
                                                            </button>
                                                        </div>
                                                        <div className="account-order-total-group">
                                                            <span className="account-order-total-label">Total:</span>
                                                            <span className="account-order-total-val">₹{Number(order.total || 0).toLocaleString('en-IN')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ═════ 1. ORDERS SECTION ═════ */}
                    {activeSection === 'Orders' && (
                            <div className="account-section-block">
                                <div className="account-section-header">
                                    <div>
                                        <h3 className="account-section-title">Order History</h3>
                                        <p className="account-section-desc">Track status, receipts, and shipments from our estates.</p>
                                    </div>
                                    <button onClick={handleShopClick} className="account-inline-shop-btn">
                                        <ShoppingBag size={13} />
                                        <span>Order More</span>
                                    </button>
                                </div>

                                {ordersLoading ? (
                                    <div className="account-loading-box">
                                        <Loader size={22} className="account-spinner" />
                                        <span>Fetching your live orders...</span>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="account-empty-state">
                                        <div className="account-empty-icon-wrap">
                                            <Package size={30} color="#8c733b" />
                                        </div>
                                        <h4 className="account-empty-title">No orders placed yet</h4>
                                        <p className="account-empty-desc">
                                            Discover authentic bold green cardamom, high-curcumin turmeric, and raw forest honey directly from the Western Ghats.
                                        </p>
                                        <button onClick={handleShopClick} className="account-empty-cta">
                                            <ShoppingBag size={14} />
                                            <span>Explore Estate Harvests</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="account-orders-stack">
                                        {orders.map(order => {
                                            const meta = STATUS_META[order.status] || STATUS_META.pending;
                                            const Icon = meta.Icon;
                                            const dateFormatted = order.createdAt
                                                ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })
                                                : 'Recent';

                                            return (
                                                <div key={order.id} className="account-order-card">
                                                    <div className="account-order-top">
                                                        <div>
                                                            <div className="account-order-id">{order.id}</div>
                                                            <div className="account-order-date">Placed on {dateFormatted}</div>
                                                        </div>
                                                        <span
                                                            className="account-status-pill"
                                                            style={{ background: meta.bg, color: meta.color }}
                                                        >
                                                            <Icon size={12} />
                                                            <span>{meta.label}</span>
                                                        </span>
                                                    </div>

                                                    <div className="account-order-items">
                                                        {(order.items || []).map((item, i) => (
                                                            <div key={i} className="account-order-item-row">
                                                                <span className="account-order-item-name">
                                                                    {item.name} {item.weight && <span className="account-item-weight">({item.weight})</span>} × {item.quantity || item.qty || 1}
                                                                </span>
                                                                <span className="account-order-item-price">
                                                                    ₹{((item.price || 0) * (item.quantity || item.qty || 1)).toLocaleString('en-IN')}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="account-order-bottom">
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                                                            <span className="account-order-method">
                                                                Paid via {order.paymentMethod || 'Razorpay / Prepaid'}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    window.open(getShipwayTrackingUrl(order.id), '_blank');
                                                                }}
                                                                style={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: '6px',
                                                                    background: 'rgba(223, 190, 132, 0.12)',
                                                                    border: '1px solid rgba(223, 190, 132, 0.35)',
                                                                    color: '#dfbe84',
                                                                    padding: '4px 10px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '0.72rem',
                                                                    fontWeight: '600',
                                                                    cursor: 'pointer'
                                                                }}
                                                                title="Track live on Shipway"
                                                            >
                                                                <Truck size={12} />
                                                                <span>Track with Shipway</span>
                                                                <ExternalLink size={10} />
                                                            </button>
                                                        </div>
                                                        <div className="account-order-total-group">
                                                            <span className="account-order-total-label">Total Paid:</span>
                                                            <span className="account-order-total-val">₹{Number(order.total || 0).toLocaleString('en-IN')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ═════ 2. PROFILE SECTION ═════ */}
                        {activeSection === 'Profile' && (
                            <div className="account-section-block">
                                <div className="account-section-header">
                                    <div>
                                        <h3 className="account-section-title">Account Details</h3>
                                        <p className="account-section-desc">Your personal credentials and contact preferences.</p>
                                    </div>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={savingProfile}
                                        className="account-edit-btn"
                                    >
                                        {savingProfile ? (
                                            <><Loader size={13} className="account-spinner" /> Saving...</>
                                        ) : editingProfile ? (
                                            <><Save size={13} /> Save Details</>
                                        ) : (
                                            <><Edit3 size={13} /> Edit Profile</>
                                        )}
                                    </button>
                                </div>

                                <div className="account-fields-grid">
                                    {[
                                        { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Enter your full name' },
                                        { label: 'Email Address', key: 'email', type: 'email', disabled: true, note: 'Registered email address cannot be changed' },
                                        { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+91 98400 12345' },
                                        { label: 'Primary Delivery Address', key: 'address', type: 'text', placeholder: 'Door no., street, city, postal code' }
                                    ].map(f => (
                                        <div key={f.key} className="account-field-card">
                                            <label className="account-field-label">{f.label}</label>
                                            {editingProfile && !f.disabled ? (
                                                <input
                                                    type={f.type}
                                                    value={profile[f.key] || ''}
                                                    placeholder={f.placeholder}
                                                    onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                                                    className="account-field-input"
                                                />
                                            ) : (
                                                <div className="account-field-value">
                                                    {profile[f.key] || <span className="account-placeholder-text">Not provided</span>}
                                                </div>
                                            )}
                                            {f.note && <span className="account-field-note">{f.note}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ═════ 3. ADDRESSES SECTION ═════ */}
                        {activeSection === 'Addresses' && (
                            <div className="account-section-block">
                                <div className="account-section-header">
                                    <div>
                                        <h3 className="account-section-title">Shipping Addresses</h3>
                                        <p className="account-section-desc">Addresses used for dispatching estate shipments.</p>
                                    </div>
                                </div>

                                <div className="account-address-card">
                                    <div className="account-address-top">
                                        <span className="account-default-badge">DEFAULT SHIPPING ADDRESS</span>
                                    </div>
                                    <div className="account-address-text">
                                        <strong>{profile.name || 'Member'}</strong><br />
                                        {profile.address || 'No shipping address saved yet.'}<br />
                                        {profile.phone && <span className="account-address-phone">Phone: {profile.phone}</span>}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setActiveSection('Profile')}
                                    className="account-add-address-btn"
                                >
                                    <Edit3 size={14} /> Update Shipping Address
                                </button>
                            </div>
                        )}

                        {/* ═════ 4. WISHLIST SECTION ═════ */}
                        {activeSection === 'Wishlist' && (
                            <div className="account-section-block">
                                <div className="account-section-header">
                                    <div>
                                        <h3 className="account-section-title">My Saved Wishlist ({wishlistProducts.length})</h3>
                                        <p className="account-section-desc">Handpicked single-estate goods saved for later.</p>
                                    </div>
                                    <button onClick={handleShopClick} className="account-inline-shop-btn">
                                        <ShoppingBag size={13} />
                                        <span>Browse All</span>
                                    </button>
                                </div>

                                {wishlistProducts.length === 0 ? (
                                    <div className="account-empty-wishlist">
                                        <Heart size={36} className="account-empty-icon" />
                                        <h4 className="account-empty-title">Your wishlist is empty</h4>
                                        <p className="account-empty-desc">Save your favorite cardamom, wild honey, and pepper to purchase later.</p>
                                        <button onClick={handleShopClick} className="account-empty-cta">
                                            Start Exploring Spices
                                        </button>
                                    </div>
                                ) : (
                                    <div className="account-wishlist-grid">
                                        {wishlistProducts.map(p => (
                                            <div
                                                key={p.id}
                                                className="account-wishlist-item"
                                            >
                                                <div
                                                    className="account-wishlist-img-frame"
                                                    onClick={() => { onViewProduct?.(p); onClose(); }}
                                                >
                                                    <img src={p.image} alt={p.name} className="account-wishlist-img" />
                                                </div>
                                                <div className="account-wishlist-meta">
                                                    <div
                                                        className="account-wishlist-name"
                                                        onClick={() => { onViewProduct?.(p); onClose(); }}
                                                    >
                                                        {p.name}
                                                    </div>
                                                    <div className="account-wishlist-bottom">
                                                        <span className="account-wishlist-price">₹{p.price}</span>
                                                        <div className="account-wishlist-actions">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    addToCart(p);
                                                                    showToast(`Added ${p.name} to cart`);
                                                                }}
                                                                className="account-wishlist-add-btn"
                                                            >
                                                                Add to Cart
                                                            </button>
                                                        </div>
                                                    </div>
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
        );

    return (
        <>
            {isPageMode ? (
                <div className="account-page-mode-wrapper">
                    {dashboardCard}
                </div>
            ) : (
                <div className="account-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
                    {dashboardCard}
                </div>
            )}

            <style>{`
                /* ── Page Mode & Overview Additions ── */
                .account-page-mode-wrapper {
                    width: 100%;
                    animation: accountFadeIn 0.22s ease-out;
                }

                .account-page-mode-card {
                    max-height: none !important;
                    box-shadow: 0 10px 30px rgba(11, 37, 29, 0.06), 0 1px 3px rgba(11, 37, 29, 0.04) !important;
                }

                .account-overview-welcome {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 12px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #e2e8f0;
                    margin-bottom: 20px;
                }

                .account-overview-greeting {
                    font-family: var(--font-serif);
                    font-size: 1.35rem;
                    color: #0a221a;
                    margin: 0 0 4px 0;
                }

                .account-overview-sub {
                    font-size: 0.82rem;
                    color: #64748b;
                    margin: 0;
                }

                .account-overview-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
                    gap: 14px;
                    margin-bottom: 24px;
                }

                .account-overview-card {
                    background: #fbf9f5;
                    border: 1px solid #e7dfd1;
                    border-radius: 12px;
                    padding: 16px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    flex-direction: column;
                }

                .account-overview-card:hover {
                    border-color: #8c733b;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(11, 37, 29, 0.06);
                    background: #ffffff;
                }

                .account-overview-card-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }

                .account-overview-card-label {
                    font-size: 0.74rem;
                    font-weight: 700;
                    color: #64748b;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                }

                .account-overview-card-val {
                    font-size: 1.6rem;
                    font-weight: 800;
                    color: #0a221a;
                    font-family: var(--font-serif);
                    margin-bottom: 6px;
                }

                .account-overview-card-snippet {
                    font-size: 0.84rem;
                    color: #0a221a;
                    font-weight: 600;
                    line-height: 1.4;
                    margin-bottom: 6px;
                    word-break: break-all;
                }

                .account-overview-card-link {
                    margin-top: auto;
                    font-size: 0.74rem;
                    font-weight: 700;
                    color: #8c733b;
                    padding-top: 8px;
                }

                .account-link-btn-text {
                    background: none;
                    border: none;
                    color: #8c733b;
                    font-weight: 700;
                    font-size: 0.78rem;
                    cursor: pointer;
                    padding: 0;
                }

                .account-link-btn-text:hover {
                    text-decoration: underline;
                }

                /* ── Premium White Theme Customer Dashboard ── */
                .account-modal-overlay {
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
                    animation: accountFadeIn 0.22s ease-out;
                }

                @keyframes accountFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                @keyframes accountScale {
                    from { opacity: 0; transform: translateY(12px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }

                .account-modal-container {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 20px;
                    width: 100%;
                    max-width: 920px;
                    max-height: 88vh;
                    overflow: hidden;
                    box-shadow: 0 25px 60px rgba(11, 37, 29, 0.18), 0 4px 16px rgba(11, 37, 29, 0.05);
                    display: flex;
                    flex-direction: column;
                    animation: accountScale 0.26s cubic-bezier(0.16, 1, 0.3, 1);
                    font-family: var(--font-sans);
                }

                /* Header */
                .account-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 28px;
                    border-bottom: 1px solid #e2e8f0;
                    background: #fbf9f5;
                }

                .account-user-meta {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .account-avatar-pill {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: #0a221a;
                    border: 2px solid #dfbe84;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    box-shadow: 0 2px 8px rgba(10, 34, 26, 0.15);
                }

                .account-avatar-text {
                    font-size: 0.85rem;
                    font-weight: 800;
                    color: #dfbe84;
                    letter-spacing: 0.05em;
                }

                .account-user-name-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .account-user-name {
                    font-family: var(--font-serif);
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: #0a221a;
                    margin: 0;
                }

                .account-member-chip {
                    background: rgba(140, 115, 59, 0.15);
                    border: 1px solid rgba(140, 115, 59, 0.35);
                    border-radius: 12px;
                    padding: 1px 7px;
                    font-size: 0.6rem;
                    font-weight: 800;
                    letter-spacing: 0.08em;
                    color: #8c733b;
                }

                .account-user-email {
                    font-size: 0.78rem;
                    color: #64748b;
                }

                .account-header-actions {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .account-shop-cta-btn {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    background: #0a221a;
                    color: #f5e4be;
                    border: 1px solid #0a221a;
                    border-radius: 8px;
                    padding: 8px 14px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    letter-spacing: 0.03em;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .account-shop-cta-btn:hover {
                    background: #174235;
                    border-color: #174235;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(10, 34, 26, 0.18);
                }

                .account-logout-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: #ffffff;
                    color: #b91c1c;
                    border: 1px solid #fee2e2;
                    border-radius: 8px;
                    padding: 8px 12px;
                    font-size: 0.78rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.18s ease;
                }

                .account-logout-btn:hover {
                    background: #fee2e2;
                    border-color: #fca5a5;
                }

                .account-close-btn {
                    width: 34px;
                    height: 34px;
                    border-radius: 8px;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    color: #64748b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.18s ease;
                }

                .account-close-btn:hover {
                    background: #f1f5f9;
                    color: #0f172a;
                }

                /* Body Split */
                .account-body-split {
                    display: flex;
                    flex: 1;
                    min-height: 480px;
                    overflow: hidden;
                }

                /* Sidebar */
                .account-sidebar {
                    width: 220px;
                    background: #fafaf9;
                    border-right: 1px solid #e2e8f0;
                    padding: 20px 14px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    flex-shrink: 0;
                }

                .account-nav-list {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .account-tab-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    padding: 10px 12px;
                    border-radius: 8px;
                    border: none;
                    background: transparent;
                    color: #475569;
                    font-size: 0.84rem;
                    font-weight: 600;
                    cursor: pointer;
                    text-align: left;
                    transition: all 0.18s ease;
                }

                .account-tab-btn:hover {
                    background: #f1f5f9;
                    color: #0f172a;
                }

                .account-tab-active {
                    background: #0a221a !important;
                    color: #ffffff !important;
                }

                .account-tab-icon {
                    flex-shrink: 0;
                }

                .account-tab-label {
                    flex: 1;
                }

                .account-tab-badge {
                    background: #e2e8f0;
                    color: #475569;
                    font-size: 0.68rem;
                    font-weight: 700;
                    border-radius: 10px;
                    padding: 1px 7px;
                }

                .account-tab-badge-active {
                    background: rgba(223, 190, 132, 0.3);
                    color: #f5e4be;
                }

                /* Sidebar Promo */
                .account-sidebar-promo {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 14px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .account-promo-title {
                    font-family: var(--font-serif);
                    font-size: 0.86rem;
                    font-weight: 700;
                    color: #0a221a;
                }

                .account-promo-desc {
                    font-size: 0.72rem;
                    color: #64748b;
                    line-height: 1.45;
                    margin: 0;
                }

                .account-promo-link {
                    background: none;
                    border: none;
                    color: #8c733b;
                    font-size: 0.74rem;
                    font-weight: 700;
                    cursor: pointer;
                    padding: 0;
                    margin-top: 4px;
                    text-align: left;
                    transition: color 0.18s;
                }

                .account-promo-link:hover {
                    color: #0a221a;
                }

                /* Main Content */
                .account-main-content {
                    flex: 1;
                    padding: 28px;
                    overflow-y: auto;
                    background: #ffffff;
                }

                .account-section-block {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .account-section-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .account-section-title {
                    font-family: var(--font-serif);
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: #0a221a;
                    margin: 0 0 4px 0;
                }

                .account-section-desc {
                    font-size: 0.78rem;
                    color: #64748b;
                    margin: 0;
                }

                .account-inline-shop-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: #fbf9f5;
                    border: 1px solid #d4cbb8;
                    border-radius: 6px;
                    padding: 6px 12px;
                    font-size: 0.76rem;
                    font-weight: 700;
                    color: #0a221a;
                    cursor: pointer;
                    transition: all 0.18s;
                }

                .account-inline-shop-btn:hover {
                    background: #0a221a;
                    color: #f5e4be;
                    border-color: #0a221a;
                }

                /* Orders Stack */
                .account-orders-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                }

                .account-order-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 18px 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                    transition: box-shadow 0.2s, border-color 0.2s;
                }

                .account-order-card:hover {
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
                    border-color: #cbd5e1;
                }

                .account-order-top {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    border-bottom: 1px solid #f1f5f9;
                    padding-bottom: 12px;
                }

                .account-order-id {
                    font-family: var(--font-sans);
                    font-weight: 700;
                    font-size: 0.88rem;
                    color: #0a221a;
                }

                .account-order-date {
                    font-size: 0.74rem;
                    color: #64748b;
                    margin-top: 2px;
                }

                .account-status-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 0.02em;
                }

                .account-order-items {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .account-order-item-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 0.82rem;
                }

                .account-order-item-name {
                    color: #334155;
                }

                .account-item-weight {
                    color: #64748b;
                    font-size: 0.76rem;
                }

                .account-order-item-price {
                    font-weight: 600;
                    color: #0a221a;
                }

                .account-order-bottom {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-top: 1px solid #f1f5f9;
                    padding-top: 12px;
                }

                .account-order-method {
                    font-size: 0.74rem;
                    color: #64748b;
                }

                .account-order-total-group {
                    display: flex;
                    align-items: baseline;
                    gap: 6px;
                }

                .account-order-total-label {
                    font-size: 0.76rem;
                    color: #64748b;
                }

                .account-order-total-val {
                    font-size: 1.05rem;
                    font-weight: 800;
                    color: #0a221a;
                }

                /* Loading & Empty States */
                .account-loading-box {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 48px 20px;
                    color: #64748b;
                    font-size: 0.85rem;
                }

                .account-spinner {
                    animation: spin 1s linear infinite;
                    color: #8c733b;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }

                .account-empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    padding: 48px 24px;
                    background: #fbf9f5;
                    border: 1px dashed #d4cbb8;
                    border-radius: 14px;
                }

                .account-empty-icon-wrap {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 14px;
                }

                .account-empty-title {
                    font-family: var(--font-serif);
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: #0a221a;
                    margin: 0 0 6px 0;
                }

                .account-empty-desc {
                    font-size: 0.8rem;
                    color: #64748b;
                    max-width: 380px;
                    line-height: 1.55;
                    margin: 0 0 20px 0;
                }

                .account-empty-cta {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #0a221a;
                    color: #f5e4be;
                    border: none;
                    border-radius: 8px;
                    padding: 10px 18px;
                    font-size: 0.82rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .account-empty-cta:hover {
                    background: #174235;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 14px rgba(10, 34, 26, 0.2);
                }

                /* Profile Grid */
                .account-fields-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                    gap: 14px;
                }

                .account-field-card {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    padding: 14px 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .account-field-label {
                    font-size: 0.72rem;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .account-field-value {
                    font-size: 0.88rem;
                    font-weight: 600;
                    color: #0f172a;
                    word-break: break-word;
                }

                .account-field-note {
                    font-size: 0.68rem;
                    color: #94a3b8;
                    margin-top: 2px;
                }

                .account-placeholder-text {
                    color: #94a3b8;
                    font-style: italic;
                    font-weight: 400;
                }

                .account-field-input {
                    background: #ffffff;
                    border: 1px solid #cbd5e1;
                    border-radius: 6px;
                    padding: 8px 10px;
                    font-size: 0.85rem;
                    color: #0f172a;
                    outline: none;
                    font-family: inherit;
                    transition: border-color 0.18s;
                }

                .account-field-input:focus {
                    border-color: #0a221a;
                    box-shadow: 0 0 0 2px rgba(10, 34, 26, 0.1);
                }

                .account-edit-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: #0a221a;
                    color: #f5e4be;
                    border: none;
                    border-radius: 6px;
                    padding: 7px 14px;
                    font-size: 0.76rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.18s;
                }

                .account-edit-btn:hover {
                    background: #174235;
                }

                /* Address Card */
                .account-address-card {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .account-default-badge {
                    background: rgba(21, 128, 61, 0.12);
                    color: #15803d;
                    border: 1px solid rgba(21, 128, 61, 0.25);
                    border-radius: 10px;
                    padding: 2px 8px;
                    font-size: 0.62rem;
                    font-weight: 800;
                    letter-spacing: 0.06em;
                }

                .account-address-text {
                    font-size: 0.86rem;
                    color: #334155;
                    line-height: 1.6;
                }

                .account-address-phone {
                    color: #64748b;
                    font-size: 0.8rem;
                    margin-top: 4px;
                    display: block;
                }

                .account-add-address-btn {
                    align-self: flex-start;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: #ffffff;
                    border: 1px solid #cbd5e1;
                    border-radius: 6px;
                    padding: 8px 14px;
                    font-size: 0.78rem;
                    font-weight: 600;
                    color: #0f172a;
                    cursor: pointer;
                    transition: all 0.18s;
                }

                .account-add-address-btn:hover {
                    background: #f1f5f9;
                    border-color: #94a3b8;
                }

                /* Wishlist Grid */
                .account-wishlist-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 16px;
                }

                .account-wishlist-item {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .account-wishlist-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
                    border-color: #cbd5e1;
                }

                .account-wishlist-img-frame {
                    width: 100%;
                    aspect-ratio: 1;
                    background: #f8fafc;
                    overflow: hidden;
                    cursor: pointer;
                }

                .account-wishlist-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s;
                }

                .account-wishlist-item:hover .account-wishlist-img {
                    transform: scale(1.04);
                }

                .account-wishlist-meta {
                    padding: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    flex: 1;
                }

                .account-wishlist-name {
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #0a221a;
                    line-height: 1.35;
                    cursor: pointer;
                }

                .account-wishlist-bottom {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: auto;
                    padding-top: 6px;
                }

                .account-wishlist-price {
                    font-weight: 800;
                    font-size: 0.92rem;
                    color: #0a221a;
                }

                .account-wishlist-add-btn {
                    background: #0a221a;
                    color: #f5e4be;
                    border: none;
                    border-radius: 4px;
                    padding: 4px 8px;
                    font-size: 0.68rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background 0.18s;
                }

                .account-wishlist-add-btn:hover {
                    background: #174235;
                }

                .account-empty-wishlist {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    padding: 48px 24px;
                    background: #fbf9f5;
                    border: 1px dashed #d4cbb8;
                    border-radius: 14px;
                }

                .account-empty-icon {
                    color: #cbd5e1;
                    margin-bottom: 12px;
                }

                /* Mobile Adaptations */
                @media (max-width: 768px) {
                    .account-modal-overlay {
                        padding: 0;
                        align-items: flex-end;
                    }

                    .account-modal-container {
                        max-height: 94vh;
                        border-bottom-left-radius: 0;
                        border-bottom-right-radius: 0;
                    }

                    .account-body-split {
                        flex-direction: column;
                    }

                    .account-sidebar {
                        width: 100%;
                        border-right: none;
                        border-bottom: 1px solid #e2e8f0;
                        padding: 12px 16px;
                    }

                    .account-nav-list {
                        flex-direction: row;
                        overflow-x: auto;
                    }

                    .account-tab-btn {
                        white-space: nowrap;
                        padding: 8px 12px;
                    }

                    .account-sidebar-promo {
                        display: none;
                    }

                    .account-main-content {
                        padding: 18px 16px;
                    }

                    .desktop-text {
                        display: none;
                    }

                    .account-header {
                        padding: 14px 16px;
                        flex-wrap: wrap;
                        gap: 12px;
                    }

                    .account-avatar-pill {
                        width: 38px;
                        height: 38px;
                    }

                    .account-user-name {
                        font-size: 1.05rem;
                    }

                    .account-shop-cta-btn {
                        padding: 6px 10px;
                        font-size: 0.75rem;
                    }

                    .account-logout-btn {
                        padding: 6px 10px;
                    }

                    .account-overview-grid {
                        grid-template-columns: 1fr;
                    }

                    .account-wishlist-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 10px;
                    }

                    .account-order-top {
                        flex-wrap: wrap;
                        gap: 8px;
                    }

                    .account-order-bottom {
                        flex-wrap: wrap;
                        gap: 8px;
                    }
                }

                @media (max-width: 480px) {
                    .account-wishlist-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 8px;
                    }
                    .account-header-actions {
                        width: 100%;
                        justify-content: flex-end;
                    }
                }
            `}</style>
        </>
    );
}
