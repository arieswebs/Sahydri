import React, { useState, useEffect, useMemo } from 'react';
import {
    Search, SlidersHorizontal, X, ChevronDown, ChevronUp,
    Star, Heart, ShoppingBag, Check, Eye, ArrowLeft,
    Package, Truck, Shield, Leaf, Grid3X3, List,
    TrendingUp, Zap, Award, Filter
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

const CATEGORIES = [
    { id: 'all', label: 'All Products' },
    { id: 'spices', label: 'Whole Spices' },
    { id: 'powders', label: 'Stone Ground' },
    { id: 'honey', label: 'Wild Forest Honey' },
    { id: 'oils', label: 'Traditional Oils' },
];

const SORT_OPTIONS = [
    { id: 'featured', label: 'Featured' },
    { id: 'price-asc', label: 'Price: Low to High' },
    { id: 'price-desc', label: 'Price: High to Low' },
    { id: 'rating', label: 'Avg. Customer Review' },
    { id: 'newest', label: 'Newest First' },
];

const PRICE_RANGES = [
    { id: 'all', label: 'All Prices', min: 0, max: Infinity },
    { id: 'u250', label: 'Under ₹250', min: 0, max: 250 },
    { id: '250-500', label: '₹250 – ₹500', min: 250, max: 500 },
    { id: '500-1k', label: '₹500 – ₹1,000', min: 500, max: 1000 },
    { id: 'o1k', label: 'Over ₹1,000', min: 1000, max: Infinity },
];

export default function ShopPage({ onViewProduct, onAddToCart, onBuyNow }) {
    const { products, productsLoading, wishlist, toggleWishlist, showToast } = useShop();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [priceRange, setPriceRange] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [addedId, setAddedId] = useState(null);

    // Close mobile sidebar on resize
    useEffect(() => {
        const handler = () => { if (window.innerWidth > 860) setMobileSidebarOpen(false); };
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    const filtered = useMemo(() => {
        const priceR = PRICE_RANGES.find(r => r.id === priceRange) || PRICE_RANGES[0];
        let result = products.filter(p => {
            const matchCat = category === 'all' || p.category === category;
            const matchPrice = p.price >= priceR.min && p.price <= priceR.max;
            const matchSrc = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.subname?.toLowerCase().includes(search.toLowerCase()) ||
                p.category?.toLowerCase().includes(search.toLowerCase());
            return matchCat && matchPrice && matchSrc;
        });

        switch (sortBy) {
            case 'price-asc': result = [...result].sort((a, b) => a.price - b.price); break;
            case 'price-desc': result = [...result].sort((a, b) => b.price - a.price); break;
            case 'rating': result = [...result].sort((a, b) => b.rating - a.rating); break;
            default: break;
        }
        return result;
    }, [products, category, priceRange, search, sortBy]);

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        onAddToCart(product);
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 1800);
    };

    const handleWishlist = (e, id) => {
        e.stopPropagation();
        toggleWishlist(id);
        showToast(wishlist.includes(id) ? 'Removed from wishlist' : 'Saved to wishlist');
    };

    // ── Sub-components ────────────────────────────────────────────────────────────
    const SidebarContent = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {/* Category */}
            <SidebarSection title="Category">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            width: '100%', padding: '9px 12px', background: 'none', border: 'none',
                            borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                            background: category === cat.id ? 'rgba(11,37,29,0.07)' : 'transparent',
                            borderLeft: category === cat.id ? '3px solid #0b251d' : '3px solid transparent',
                            transition: 'all 0.18s ease'
                        }}
                    >
                        <span style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            fontSize: '0.85rem', color: category === cat.id ? '#0b251d' : '#4a4439',
                            fontWeight: category === cat.id ? 700 : 500
                        }}>
                            {cat.label}
                        </span>
                        <span style={{
                            background: category === cat.id ? '#0b251d' : '#e5e0d8',
                            color: category === cat.id ? '#f5e7c8' : '#7a7266',
                            fontSize: '0.68rem', fontWeight: 700, padding: '1px 7px',
                            borderRadius: '10px', minWidth: '20px', textAlign: 'center'
                        }}>
                            {cat.id === 'all' ? products.length : products.filter(p => p.category === cat.id).length}
                        </span>
                    </button>
                ))}
            </SidebarSection>

            {/* Price Range */}
            <SidebarSection title="Price Range">
                {PRICE_RANGES.map(r => (
                    <label key={r.id} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '7px 12px', cursor: 'pointer',
                        fontSize: '0.85rem', color: priceRange === r.id ? '#0b251d' : '#4a4439',
                        fontWeight: priceRange === r.id ? 700 : 400
                    }}>
                        <input
                            type="radio" name="price" checked={priceRange === r.id}
                            onChange={() => setPriceRange(r.id)}
                            style={{ accentColor: '#0b251d', width: '14px', height: '14px' }}
                        />
                        {r.label}
                    </label>
                ))}
            </SidebarSection>

            {/* Avg Rating */}
            <SidebarSection title="Avg. Customer Review">
                {[5, 4, 3].map(stars => (
                    <button
                        key={stars}
                        onClick={() => setSortBy('rating')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '6px 12px', background: 'none', border: 'none',
                            cursor: 'pointer', borderRadius: '6px', width: '100%',
                            transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(11,37,29,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                        {[...Array(stars)].map((_, i) => <Star key={i} size={13} fill="#dfbe84" color="#dfbe84" />)}
                        {[...Array(5 - stars)].map((_, i) => <Star key={i} size={13} fill="none" color="#d3cdc4" />)}
                        <span style={{ fontSize: '0.77rem', color: '#5a6e3d', marginLeft: '3px' }}>& Up</span>
                    </button>
                ))}
            </SidebarSection>

            {/* Trust Badges */}
            <div style={{ padding: '16px', background: 'rgba(11,37,29,0.04)', borderRadius: '10px', margin: '12px 0' }}>
                {[
                    { Icon: Truck, text: 'Free delivery over ₹999' },
                    { Icon: Shield, text: '100% natural & verified' },
                    { Icon: Package, text: 'Packed at source, Kerala' },
                ].map(({ Icon, text }) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.77rem', color: '#4a5e44' }}>
                        <Icon size={13} color="#7a9a5e" />
                        {text}
                    </div>
                ))}
            </div>
        </div>
    );

    const SidebarSection = ({ title, children }) => {
        const [open, setOpen] = useState(true);
        return (
            <div style={{ borderBottom: '1px solid rgba(11,37,29,0.08)', paddingBottom: '8px', marginBottom: '4px' }}>
                <button
                    onClick={() => setOpen(o => !o)}
                    style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        width: '100%', background: 'none', border: 'none', padding: '14px 12px 10px',
                        cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', color: '#0b251d',
                        letterSpacing: '0.06em', textTransform: 'uppercase'
                    }}
                >
                    {title}
                    {open ? <ChevronUp size={14} color="#0b251d" /> : <ChevronDown size={14} color="#0b251d" />}
                </button>
                {open && <div>{children}</div>}
            </div>
        );
    };

    // ── Product Card (Grid) ───────────────────────────────────────────────────────
    const ProductCard = ({ product }) => {
        const isWL = wishlist.includes(product.id);
        const isAdd = addedId === product.id;
        const disc = product.originalPrice > product.price
            ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

        return (
            <div
                onClick={() => onViewProduct(product)}
                style={{
                    background: '#fff', borderRadius: '8px', border: '1px solid rgba(11,37,29,0.08)',
                    overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    transition: 'all 0.28s cubic-bezier(0.16,1,0.3,1)', position: 'relative'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(11,37,29,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(11,37,29,0.08)'; }}
            >
                {/* Discount Badge */}
                {disc > 0 && (
                    <div style={{
                        position: 'absolute', top: '10px', left: '10px', zIndex: 5,
                        background: '#b91c1c', color: '#fff', fontSize: '0.7rem', fontWeight: 700,
                        padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.04em'
                    }}>
                        -{disc}%
                    </div>
                )}

                {/* Wishlist */}
                <button
                    onClick={e => handleWishlist(e, product.id)}
                    style={{
                        position: 'absolute', top: '10px', right: '10px', zIndex: 5,
                        width: '30px', height: '30px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'all 0.2s ease'
                    }}
                >
                    <Heart size={14} color={isWL ? '#b91c1c' : '#9a9080'} fill={isWL ? '#b91c1c' : 'none'} />
                </button>

                {/* Product Image */}
                <div style={{ position: 'relative', aspectRatio: '1/1', background: '#f5f1ea', overflow: 'hidden' }}>
                    <img
                        src={product.image} alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    />
                    {/* Tag */}
                    {product.tag && (
                        <div style={{
                            position: 'absolute', bottom: '10px', left: '10px', zIndex: 4,
                            background: 'rgba(11,37,29,0.85)', color: '#dfbe84',
                            fontSize: '0.62rem', fontWeight: 700, padding: '3px 8px',
                            borderRadius: '3px', letterSpacing: '0.1em'
                        }}>
                            {product.tag}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    {/* Origin + Category */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.62rem', color: '#9e8550', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            {product.originBadge || product.category}
                        </span>
                        <span style={{ fontSize: '0.62rem', color: '#a09280', background: '#f5f1ea', padding: '1px 6px', borderRadius: '3px' }}>
                            {product.weight}
                        </span>
                    </div>

                    {/* Name */}
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0e2b21', lineHeight: 1.35, margin: '0 0 6px', minHeight: '2.4em' }}>
                        {product.name}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#7a7266', margin: '0 0 10px', lineHeight: 1.5 }}>
                        {product.subname}
                    </p>

                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', gap: '1px' }}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} size={11}
                                    fill={s <= Math.round(product.rating) ? '#dfbe84' : 'none'}
                                    color={s <= Math.round(product.rating) ? '#dfbe84' : '#d3cdc4'}
                                />
                            ))}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#7a7266' }}>({product.reviewsCount})</span>
                    </div>

                    {/* Price + CTA */}
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(11,37,29,0.06)', paddingTop: '10px' }}>
                        <div>
                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0d2820' }}>₹{product.price}</span>
                            {disc > 0 && <span style={{ fontSize: '0.75rem', color: '#a39b8e', textDecoration: 'line-through', marginLeft: '5px' }}>₹{product.originalPrice}</span>}
                        </div>
                        <button
                            onClick={e => handleAddToCart(e, product)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '5px',
                                padding: '7px 12px', fontSize: '0.75rem', fontWeight: 700,
                                letterSpacing: '0.04em', borderRadius: '5px', cursor: 'pointer',
                                border: 'none', transition: 'all 0.22s ease',
                                background: isAdd ? '#1a4d34' : '#0b251d',
                                color: isAdd ? '#74db93' : '#f5e7c8'
                            }}
                        >
                            {isAdd ? <><Check size={12} strokeWidth={2.5} />Added</> : <><ShoppingBag size={12} />Add</>}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // ── List View Card ────────────────────────────────────────────────────────────
    const ListCard = ({ product }) => {
        const isWL = wishlist.includes(product.id);
        const isAdd = addedId === product.id;
        const disc = product.originalPrice > product.price
            ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

        return (
            <div
                onClick={() => onViewProduct(product)}
                className="shop-list-card"
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(11,37,29,0.07)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(11,37,29,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
                <div className="shop-list-img-frame">
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                    {disc > 0 && <div style={{ position: 'absolute', top: '8px', left: '8px', background: '#b91c1c', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '3px' }}>-{disc}%</div>}
                </div>
                <div style={{ flex: 1, padding: '18px 20px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <span style={{ fontSize: '0.62rem', color: '#9e8550', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                                {product.originBadge}
                            </span>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0e2b21', margin: '0 0 4px', lineHeight: 1.3 }}>{product.name}</h3>
                            <p style={{ fontSize: '0.8rem', color: '#7a7266', margin: '0 0 8px' }}>{product.subname}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill={s <= Math.round(product.rating) ? '#dfbe84' : 'none'} color={s <= Math.round(product.rating) ? '#dfbe84' : '#d3cdc4'} />)}
                                <span style={{ fontSize: '0.75rem', color: '#5a6e3d', fontWeight: 600 }}>{product.rating}</span>
                                <span style={{ fontSize: '0.72rem', color: '#9a9080' }}>({product.reviewsCount} reviews)</span>
                            </div>
                            <p style={{ fontSize: '0.78rem', color: '#5a6254', lineHeight: 1.6, margin: 0 }}>{product.description?.slice(0, 100)}…</p>
                        </div>
                        <button onClick={e => handleWishlist(e, product.id)} style={{ marginLeft: '12px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                            <Heart size={16} color={isWL ? '#b91c1c' : '#9a9080'} fill={isWL ? '#b91c1c' : 'none'} />
                        </button>
                    </div>
                    <div className="shop-list-footer">
                        <div className="shop-list-pricing-col">
                            <div>
                                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0d2820' }}>₹{product.price}</span>
                                {disc > 0 && <span style={{ fontSize: '0.78rem', color: '#a39b8e', textDecoration: 'line-through', marginLeft: '6px' }}>₹{product.originalPrice}</span>}
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#5a7a5e', background: 'rgba(90,122,94,0.1)', padding: '2px 8px', borderRadius: '3px', fontWeight: 600 }}>
                                {product.weight}
                            </span>
                        </div>
                        <div className="shop-list-actions">
                            <button
                                onClick={e => { e.stopPropagation(); onBuyNow(product); }}
                                className="shop-list-btn-buynow"
                            >
                                Buy Now
                            </button>
                            <button
                                onClick={e => handleAddToCart(e, product)}
                                className={`shop-list-btn-add ${isAdd ? 'shop-list-btn-added' : ''}`}
                            >
                                {isAdd ? <><Check size={13} />Added</> : <><ShoppingBag size={13} />Add to Cart</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ── RENDER ────────────────────────────────────────────────────────────────────
    return (
        <div style={{ minHeight: '100vh', background: '#f7f4ef', paddingTop: '70px' }}>
            {/* ── Top Search & Banner ── */}
            <div className="shop-top-banner">
                <div className="container">
                    <div className="shop-top-banner-inner">
                        <div className="shop-banner-header-row">
                            <div className="shop-store-badge">
                                <Leaf size={16} color="#dfbe84" />
                                <span className="shop-store-title">
                                    Sahyadri Store
                                </span>
                            </div>
                            <div className="shop-free-shipping-tag">
                                <Truck size={14} color="#dfbe84" />
                                <span className="shipping-text-full">Free delivery over ₹999</span>
                                <span className="shipping-text-short">Free &gt; ₹999</span>
                            </div>
                        </div>

                        <div className="shop-search-field-wrap">
                            <Search size={17} className="shop-search-icon" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search single-estate spices, raw honey, oils…"
                                className="shop-search-input"
                                aria-label="Search catalogue products"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="shop-search-clear-btn"
                                    aria-label="Clear search"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Category Pill Tabs (Responsive wrap, no horizontal scroll) ── */}
            <div className="shop-categories-bar">
                <div className="container shop-categories-inner">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={`shop-cat-pill ${category === cat.id ? 'shop-cat-pill-active' : ''}`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="container" style={{ paddingTop: '24px', paddingBottom: '60px' }}>
                <div className="shop-layout-row">
                    {/* ── Desktop Filter Sidebar (Sticky & Fixed in Viewport) ── */}
                    <aside className="shop-sidebar-wrapper">
                        <div className="shop-sidebar-card">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 10px', borderBottom: '1px solid rgba(11,37,29,0.06)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Filter size={15} color="#0b251d" />
                                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0b251d', letterSpacing: '0.03em' }}>Filters</span>
                                </div>
                                {(category !== 'all' || priceRange !== 'all') && (
                                    <button
                                        onClick={() => { setCategory('all'); setPriceRange('all'); }}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.74rem', color: '#b91c1c', fontWeight: 700, textDecoration: 'underline' }}
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>
                            <SidebarContent />
                        </div>
                    </aside>

                    {/* ── Mobile Sidebar Overlay ── */}
                    {mobileSidebarOpen && (
                        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex' }} onClick={() => setMobileSidebarOpen(false)}>
                            <div style={{ width: 'min(300px, 86vw)', background: '#fff', height: '100%', overflowY: 'auto', boxShadow: '4px 0 24px rgba(0,0,0,0.15)', padding: '16px 0' }} onClick={e => e.stopPropagation()}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px 12px', borderBottom: '1px solid rgba(11,37,29,0.06)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Filter size={15} color="#0b251d" />
                                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0b251d' }}>Filters</span>
                                    </div>
                                    <button onClick={() => setMobileSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} color="#0b251d" /></button>
                                </div>
                                <SidebarContent />
                            </div>
                            <div style={{ flex: 1, background: 'rgba(0,0,0,0.4)' }} />
                        </div>
                    )}

                    {/* ── Product Grid / List (Scrolling Content) ── */}
                    <main className="shop-products-main" style={{ flex: 1, minWidth: 0 }}>
                        {/* ── Results Bar ── */}
                        <div className="shop-toolbar-row">
                            <div className="shop-toolbar-left">
                                {/* Mobile Filter Toggle */}
                                <button
                                    onClick={() => setMobileSidebarOpen(true)}
                                    className="shop-mobile-filter-btn"
                                >
                                    <Filter size={14} /> Filters
                                </button>
                                <div className="shop-results-count">
                                    {productsLoading ? 'Loading…' : (
                                        <><strong style={{ color: '#0b251d' }}>{filtered.length}</strong> result{filtered.length !== 1 ? 's' : ''} {category !== 'all' ? `in "${CATEGORIES.find(c => c.id === category)?.label}"` : ''}</>
                                    )}
                                </div>
                            </div>
                            <div className="shop-toolbar-right">
                                {/* Sort */}
                                <div className="shop-sort-wrap">
                                    <span className="shop-sort-label">Sort:</span>
                                    <select
                                        value={sortBy} onChange={e => setSortBy(e.target.value)}
                                        className="shop-sort-select"
                                    >
                                        {SORT_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                    </select>
                                </div>
                                {/* View Toggle */}
                                <div className="shop-view-toggle">
                                    {[
                                        { id: 'grid', Icon: Grid3X3 },
                                        { id: 'list', Icon: List }
                                    ].map(({ id, Icon }) => (
                                        <button
                                            key={id}
                                            onClick={() => setViewMode(id)}
                                            className={`shop-view-btn ${viewMode === id ? 'shop-view-btn-active' : ''}`}
                                            title={`${id === 'grid' ? 'Grid' : 'List'} View`}
                                            aria-label={`${id === 'grid' ? 'Grid' : 'List'} View`}
                                        >
                                            <Icon size={15} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Product Cards */}
                        {productsLoading ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} style={{ background: '#fff', borderRadius: '8px', height: '340px', animation: 'shimmer 1.5s infinite' }} />
                                ))}
                            </div>
                        ) : filtered.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#7a7266' }}>
                                <Package size={48} color="#d3cdc4" style={{ marginBottom: '16px' }} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4a4439', marginBottom: '8px' }}>No products found</h3>
                                <p style={{ fontSize: '0.88rem', marginBottom: '16px' }}>Try adjusting your filters or search term.</p>
                                <button onClick={() => { setCategory('all'); setPriceRange('all'); setSearch(''); }} style={{ padding: '10px 24px', background: '#0b251d', color: '#f5e7c8', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                                    Clear Filters
                                </button>
                            </div>
                        ) : viewMode === 'grid' ? (
                            <div className="shop-grid">
                                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
                            </div>
                        ) : (
                            <div>
                                {filtered.map(p => <ListCard key={p.id} product={p} />)}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <style>{`
        .shop-top-banner {
          background: linear-gradient(135deg, #0b251d 0%, #163a2a 100%);
          padding: 14px 0 16px;
          border-bottom: 1px solid rgba(223, 190, 132, 0.18);
        }
        .shop-top-banner-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          width: 100%;
        }
        .shop-banner-header-row {
          display: contents;
        }
        .shop-store-badge {
          order: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .shop-store-title {
          color: #f5e7c8;
          font-family: var(--font-serif), Georgia, serif;
          font-weight: 700;
          font-size: 1.15rem;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }
        .shop-search-field-wrap {
          order: 2;
          flex: 1;
          max-width: 520px;
          position: relative;
          display: flex;
          align-items: center;
          margin: 0 auto;
        }
        .shop-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #1b4b3c;
          pointer-events: none;
          z-index: 2;
        }
        .shop-search-input {
          width: 100%;
          height: 44px;
          padding: 0 42px 0 44px;
          box-sizing: border-box;
          background: #ffffff;
          border: 1.5px solid #dfbe84;
          border-radius: 8px;
          font-size: 0.92rem;
          color: #0b251d;
          outline: none;
          font-family: inherit;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .shop-search-input::placeholder {
          color: #687970;
          font-weight: 400;
        }
        .shop-search-input:focus {
          border-color: #dfbe84;
          box-shadow: 0 0 0 3px rgba(223, 190, 132, 0.35);
        }
        .shop-search-clear-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(11, 37, 29, 0.08);
          border: none;
          cursor: pointer;
          color: #575146;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          z-index: 2;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .shop-search-clear-btn:hover {
          background: rgba(11, 37, 29, 0.15);
          color: #0b251d;
        }
        .shop-free-shipping-tag {
          order: 3;
          display: flex;
          align-items: center;
          gap: 7px;
          color: #dfbe84;
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .shipping-text-short {
          display: none;
        }
        .shipping-text-full {
          display: inline;
        }

        /* ── Category Pill Tabs (Responsive wrap, no horizontal scroll) ── */
        .shop-categories-bar {
          background: #ffffff;
          border-bottom: 1px solid rgba(11, 37, 29, 0.08);
          padding: 10px 0;
        }
        .shop-categories-inner {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }
        .shop-cat-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 20px;
          border: 1px solid rgba(11, 37, 29, 0.12);
          background: #faf8f5;
          color: #4a4439;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          font-family: inherit;
        }
        .shop-cat-pill:hover {
          background: #f1ede4;
          color: #0b251d;
          border-color: rgba(11, 37, 29, 0.25);
        }
        .shop-cat-pill-active {
          background: #0b251d !important;
          color: #f5e7c8 !important;
          border-color: #0b251d !important;
          font-weight: 700 !important;
          box-shadow: 0 2px 8px rgba(11, 37, 29, 0.16);
        }

        /* ── Toolbar & Results ── */
        .shop-toolbar-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .shop-toolbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .shop-mobile-filter-btn {
          display: none;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: #0b251d;
          color: #f5e7c8;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.82rem;
          font-weight: 700;
        }
        .shop-results-count {
          font-size: 0.85rem;
          color: #7a7266;
        }
        .shop-toolbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .shop-sort-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .shop-sort-label {
          font-size: 0.8rem;
          color: #7a7266;
          font-weight: 600;
          white-space: nowrap;
        }
        .shop-sort-select {
          padding: 7px 10px;
          background: #ffffff;
          border: 1px solid rgba(11, 37, 29, 0.15);
          border-radius: 6px;
          font-size: 0.82rem;
          color: #0b251d;
          font-weight: 600;
          cursor: pointer;
          outline: none;
          font-family: inherit;
        }
        .shop-view-toggle {
          display: flex;
          background: #ffffff;
          border: 1px solid rgba(11, 37, 29, 0.12);
          border-radius: 6px;
          overflow: hidden;
        }
        .shop-view-btn {
          padding: 7px 10px;
          border: none;
          cursor: pointer;
          background: transparent;
          color: #9a9080;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .shop-view-btn-active {
          background: #0b251d;
          color: #f5e7c8;
        }

        /* ── Layout & Sidebar ── */
        .shop-layout-row {
          display: flex;
          gap: 28px;
          position: relative;
        }
        .shop-sidebar-wrapper {
          width: 250px;
          flex-shrink: 0;
          position: sticky;
          top: 86px;
          align-self: flex-start;
          max-height: calc(100vh - 104px);
          overflow-y: auto;
          overscroll-behavior: contain;
          scrollbar-width: thin;
          scrollbar-color: rgba(223, 190, 132, 0.6) transparent;
          z-index: 20;
        }
        .shop-sidebar-wrapper::-webkit-scrollbar {
          width: 5px;
        }
        .shop-sidebar-wrapper::-webkit-scrollbar-track {
          background: transparent;
        }
        .shop-sidebar-wrapper::-webkit-scrollbar-thumb {
          background: rgba(223, 190, 132, 0.6);
          border-radius: 4px;
        }
        .shop-sidebar-wrapper::-webkit-scrollbar-thumb:hover {
          background: #dfbe84;
        }
        .shop-sidebar-card {
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid rgba(11, 37, 29, 0.08);
          box-shadow: 0 4px 20px rgba(11, 37, 29, 0.04);
          padding: 4px 0 16px;
        }
        .shop-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .shop-list-card {
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid rgba(11, 37, 29, 0.08);
          display: flex;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.22s ease;
          margin-bottom: 12px;
        }
        .shop-list-img-frame {
          width: 160px;
          flex-shrink: 0;
          background: #f5f1ea;
          position: relative;
          overflow: hidden;
        }
        .shop-list-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: auto;
          padding-top: 12px;
        }
        .shop-list-pricing-col {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .shop-list-actions {
          margin-left: auto;
          display: flex;
          gap: 8px;
        }
        .shop-list-btn-buynow {
          padding: 8px 16px;
          font-size: 0.8rem;
          font-weight: 700;
          background: #f5e7c8;
          border: 1px solid #c8a84a;
          border-radius: 5px;
          color: #0b251d;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .shop-list-btn-buynow:hover {
          background: #ebd8aa;
        }
        .shop-list-btn-add {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          font-size: 0.8rem;
          font-weight: 700;
          background: #0b251d;
          color: #f5e7c8;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .shop-list-btn-add:hover {
          background: #173f2f;
        }
        .shop-list-btn-added {
          background: #1a4d34 !important;
          color: #74db93 !important;
        }

        /* ── Viewport Breakpoints ── */
        @media (max-width: 1100px) {
          .shop-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 860px) {
          .shop-sidebar-wrapper { display: none !important; }
          .shop-mobile-filter-btn { display: flex !important; }
          .shop-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
        @media (max-width: 768px) {
          .shop-top-banner {
            padding: 12px 0 14px;
          }
          .shop-top-banner-inner {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          .shop-banner-header-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          }
          .shop-store-badge {
            order: unset;
          }
          .shop-store-title {
            font-size: 1.05rem;
          }
          .shop-free-shipping-tag {
            order: unset;
            font-size: 0.74rem;
          }
          .shop-search-field-wrap {
            order: unset;
            width: 100%;
            max-width: 100%;
            margin: 0;
          }
          .shop-search-input {
            height: 44px;
            font-size: 16px; /* Prevents iOS Safari auto-zoom on input focus */
            padding: 0 40px 0 42px;
            border-radius: 8px;
          }
        }
        @media (max-width: 360px) {
          .shipping-text-full {
            display: none;
          }
          .shipping-text-short {
            display: inline;
          }
          .shop-store-title {
            font-size: 0.95rem;
          }
        }
        @media (max-width: 580px) {
          .shop-list-card {
            flex-direction: column;
          }
          .shop-list-img-frame {
            width: 100%;
            height: 180px;
          }
          .shop-toolbar-row {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          .shop-toolbar-left {
            width: 100%;
            justify-content: space-between;
          }
          .shop-toolbar-right {
            width: 100%;
            justify-content: space-between;
          }
          .shop-list-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          .shop-list-pricing-col {
            width: 100%;
            justify-content: space-between;
          }
          .shop-list-actions {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-left: 0;
          }
          .shop-list-btn-buynow,
          .shop-list-btn-add {
            width: 100%;
            justify-content: center;
          }
        }
        @media (max-width: 480px) {
          .shop-grid {
            grid-template-columns: repeat(1, 1fr);
          }
          .shop-categories-bar {
            padding: 8px 0;
          }
          .shop-categories-inner {
            gap: 6px;
          }
          .shop-cat-pill {
            padding: 6px 12px;
            font-size: 0.76rem;
            border-radius: 16px;
          }
          .shop-sort-select {
            font-size: 0.78rem;
            padding: 6px 8px;
          }
        }
        @media (max-width: 360px) {
          .shop-categories-inner {
            gap: 5px;
          }
          .shop-cat-pill {
            padding: 5px 9px;
            font-size: 0.70rem;
            border-radius: 14px;
          }
          .shop-store-title {
            font-size: 0.96rem;
          }
          .shop-free-shipping-tag {
            font-size: 0.70rem;
          }
        }
        @keyframes shimmer {
          0%   { background: #f5f1ea; }
          50%  { background: #ede9e0; }
          100% { background: #f5f1ea; }
        }
      `}</style>
        </div>
    );
}
