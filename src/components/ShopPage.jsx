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
                className="shop-product-card"
            >
                {/* Discount Badge */}
                {disc > 0 && (
                    <div className="shop-product-disc">
                        -{disc}%
                    </div>
                )}

                {/* Wishlist */}
                <button
                    onClick={e => handleWishlist(e, product.id)}
                    className="shop-product-wishlist"
                    aria-label={isWL ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <Heart size={14} color={isWL ? '#b91c1c' : '#9a9080'} fill={isWL ? '#b91c1c' : 'none'} />
                </button>

                {/* Product Image */}
                <div className="shop-product-img-frame">
                    <img
                        src={product.image} alt={product.name}
                        className="shop-product-img"
                    />
                    {/* Tag */}
                    {product.tag && (
                        <div className="shop-product-tag">
                            {product.tag}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="shop-product-info">
                    {/* Origin + Category */}
                    <div className="shop-product-meta">
                        <span className="shop-product-origin">
                            {product.originBadge || product.category}
                        </span>
                        <span className="shop-product-weight">
                            {product.weight}
                        </span>
                    </div>

                    {/* Name */}
                    <h3 className="shop-product-name">
                        {product.name}
                    </h3>
                    <p className="shop-product-subname">
                        {product.subname}
                    </p>

                    {/* Rating */}
                    <div className="shop-product-rating">
                        <div style={{ display: 'flex', gap: '1px' }}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} size={11}
                                    fill={s <= Math.round(product.rating) ? '#dfbe84' : 'none'}
                                    color={s <= Math.round(product.rating) ? '#dfbe84' : '#d3cdc4'}
                                />
                            ))}
                        </div>
                        <span className="shop-product-reviews">({product.reviewsCount})</span>
                    </div>

                    {/* Price + CTA */}
                    <div className="shop-product-footer">
                        <div className="shop-product-pricing">
                            <span className="shop-product-price">₹{product.price}</span>
                            {disc > 0 && <span className="shop-product-orig-price">₹{product.originalPrice}</span>}
                        </div>
                        <button
                            onClick={e => handleAddToCart(e, product)}
                            className={`shop-product-add-btn ${isAdd ? 'shop-product-added' : ''}`}
                            aria-label={`Add ${product.name} to cart`}
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
                        <div className="shop-search-field-wrap">
                            <Search size={18} className="shop-search-icon" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search spices, honey, oils…"
                                className="shop-search-input"
                                aria-label="Search catalogue products"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="shop-search-clear-btn"
                                    aria-label="Clear search"
                                    title="Clear search"
                                >
                                    <X size={14} />
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
                            <div className="shop-grid">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="skeleton" style={{ height: '320px', borderRadius: 'var(--radius-md)' }} />
                                ))}
                            </div>
                        ) : filtered.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--color-earth-600)' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(14,43,33,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <Package size={30} color="var(--color-forest-800)" />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-forest-900)', fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>No Harvest Matches</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-earth-600)', marginBottom: '20px', maxWidth: '380px', margin: '0 auto 20px' }}>We couldn't find any spices or honey matching your criteria. Try adjusting your search term or clearing filters.</p>
                                <button onClick={() => { setCategory('all'); setPriceRange('all'); setSearch(''); }} className="btn-forest">
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
          padding: 16px 0;
          border-bottom: 1px solid rgba(223, 190, 132, 0.18);
        }
        .shop-top-banner-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        .shop-search-field-wrap {
          flex: 1;
          max-width: 580px;
          position: relative;
          display: flex;
          align-items: center;
          margin: 0 auto;
        }
        .shop-search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #dfbe84;
          pointer-events: none;
          z-index: 2;
          transition: all 0.2s ease;
        }
        .shop-search-input {
          width: 100%;
          height: 46px;
          padding: 0 44px 0 48px;
          box-sizing: border-box;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(223, 190, 132, 0.35);
          border-radius: 9999px;
          font-size: 0.92rem;
          color: #f7f3ea;
          outline: none;
          font-family: inherit;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.16), inset 0 1px 1px rgba(255, 255, 255, 0.08);
          transition: all 0.25s ease;
        }
        .shop-search-input::placeholder {
          color: rgba(245, 231, 200, 0.62);
          font-weight: 400;
        }
        .shop-search-input:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(223, 190, 132, 0.55);
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.12);
        }
        .shop-search-input:focus {
          background: rgba(7, 27, 20, 0.75);
          border-color: #dfbe84;
          box-shadow: 0 0 0 3px rgba(223, 190, 132, 0.25), 0 8px 28px rgba(0, 0, 0, 0.32);
        }
        .shop-search-clear-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(223, 190, 132, 0.2);
          border: 1px solid rgba(223, 190, 132, 0.3);
          cursor: pointer;
          color: #dfbe84;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          z-index: 2;
          transition: all 0.2s ease;
        }
        .shop-search-clear-btn:hover {
          background: #dfbe84;
          color: #0b251d;
          transform: translateY(-50%) scale(1.08);
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

        /* ── Product Card (Grid) ── */
        .shop-product-card {
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid rgba(11, 37, 29, 0.08);
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }
        .shop-product-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(11, 37, 29, 0.1);
          border-color: rgba(212, 175, 55, 0.4);
        }
        .shop-product-disc {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 5;
          background: #b91c1c;
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          letter-spacing: 0.04em;
        }
        .shop-product-wishlist {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 5;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }
        .shop-product-wishlist:hover {
          transform: scale(1.08);
          background: #ffffff;
        }
        .shop-product-img-frame {
          position: relative;
          aspect-ratio: 1 / 1;
          background: #f5f1ea;
          overflow: hidden;
        }
        .shop-product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .shop-product-card:hover .shop-product-img {
          transform: scale(1.06);
        }
        .shop-product-tag {
          position: absolute;
          bottom: 10px;
          left: 10px;
          z-index: 4;
          background: rgba(11, 37, 29, 0.85);
          color: #dfbe84;
          font-size: 0.62rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 3px;
          letter-spacing: 0.1em;
        }
        .shop-product-info {
          padding: 14px 14px 16px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .shop-product-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
          gap: 6px;
        }
        .shop-product-origin {
          font-size: 0.62rem;
          color: #9e8550;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .shop-product-weight {
          font-size: 0.62rem;
          color: #a09280;
          background: #f5f1ea;
          padding: 1px 6px;
          border-radius: 3px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .shop-product-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #0e2b21;
          line-height: 1.35;
          margin: 0 0 6px;
          min-height: 2.4em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .shop-product-subname {
          font-size: 0.75rem;
          color: #7a7266;
          margin: 0 0 10px;
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .shop-product-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 10px;
        }
        .shop-product-reviews {
          font-size: 0.72rem;
          color: #7a7266;
        }
        .shop-product-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(11, 37, 29, 0.06);
          padding-top: 10px;
          gap: 6px;
        }
        .shop-product-pricing {
          display: flex;
          align-items: baseline;
          gap: 5px;
          flex-wrap: wrap;
        }
        .shop-product-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0d2820;
        }
        .shop-product-orig-price {
          font-size: 0.75rem;
          color: #a39b8e;
          text-decoration: line-through;
        }
        .shop-product-add-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 7px 12px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          border-radius: 5px;
          cursor: pointer;
          border: none;
          transition: all 0.22s ease;
          background: #0b251d;
          color: #f5e7c8;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .shop-product-add-btn:hover {
          background: #173f2f;
        }
        .shop-product-added {
          background: #1a4d34 !important;
          color: #74db93 !important;
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
          .shop-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px; }
        }
        @media (max-width: 768px) {
          .shop-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px 10px !important;
          }
          .shop-product-info {
            padding: 10px 10px 12px;
          }
          .shop-product-name {
            font-size: 0.84rem;
            min-height: 2.3em;
            margin-bottom: 4px;
            line-height: 1.25;
          }
          .shop-product-subname {
            font-size: 0.70rem;
            margin-bottom: 6px;
          }
          .shop-product-price {
            font-size: 0.96rem;
          }
          .shop-product-orig-price {
            font-size: 0.70rem;
          }
          .shop-product-add-btn {
            padding: 6px 9px;
            font-size: 0.70rem;
            gap: 4px;
          }
          .shop-product-wishlist {
            top: 7px;
            right: 7px;
            width: 27px;
            height: 27px;
          }
          .shop-product-disc {
            top: 7px;
            left: 7px;
            font-size: 0.64rem;
            padding: 2px 6px;
          }
          .shop-product-tag {
            bottom: 7px;
            left: 7px;
            font-size: 0.58rem;
            padding: 2px 6px;
          .shop-top-banner {
            padding: 12px 0;
          }
          .shop-top-banner-inner {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
          }
          .shop-search-field-wrap {
            width: 100%;
            max-width: 100%;
            margin: 0;
          }
          .shop-search-input {
            height: 44px;
            font-size: 15px; /* Prevents iOS Safari auto-zoom on input focus */
            padding: 0 40px 0 44px;
            border-radius: 9999px;
          }
          .shop-search-icon {
            left: 15px;
          }
          .shop-search-clear-btn {
            right: 12px;
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
            grid-template-columns: repeat(2, 1fr) !important; /* Always 2 products in a row on small phones */
            gap: 10px 8px !important;
          }
          .shop-product-info {
            padding: 8px 8px 10px;
          }
          .shop-product-meta {
            margin-bottom: 2px;
          }
          .shop-product-origin {
            font-size: 0.56rem;
          }
          .shop-product-weight {
            font-size: 0.56rem;
            padding: 1px 4px;
          }
          .shop-product-name {
            font-size: 0.78rem;
            line-height: 1.25;
            min-height: 2.2em;
            margin-bottom: 3px;
          }
          .shop-product-subname {
            font-size: 0.65rem;
            margin-bottom: 4px;
          }
          .shop-product-rating {
            margin-bottom: 6px;
            gap: 3px;
          }
          .shop-product-reviews {
            font-size: 0.65rem;
          }
          .shop-product-footer {
            padding-top: 6px;
            gap: 4px;
          }
          .shop-product-pricing {
            gap: 2px;
            flex-direction: column;
            align-items: flex-start;
          }
          .shop-product-price {
            font-size: 0.88rem;
          }
          .shop-product-orig-price {
            font-size: 0.62rem;
            margin-left: 0;
          }
          .shop-product-add-btn {
            padding: 5px 8px;
            font-size: 0.66rem;
            border-radius: 4px;
            gap: 3px;
          }
          .shop-product-wishlist {
            top: 6px;
            right: 6px;
            width: 25px;
            height: 25px;
          }
          .shop-product-wishlist svg {
            width: 12px;
            height: 12px;
          }
          .shop-product-disc {
            top: 6px;
            left: 6px;
            font-size: 0.60rem;
            padding: 2px 5px;
          }
          .shop-product-tag {
            bottom: 6px;
            left: 6px;
            font-size: 0.54rem;
            padding: 2px 5px;
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
          .shop-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px 8px;
          }
          .shop-categories-inner {
            gap: 6px;
          }
          .shop-cat-pill {
            padding: 6px 10px;
            font-size: 0.72rem;
            border-radius: var(--radius-full);
          }
          .shop-product-info {
            padding: 8px 8px 10px;
          }
          .shop-product-name {
            font-size: 0.8rem;
          }
          .shop-product-price {
            font-size: 0.9rem;
          }
          .shop-product-add-btn {
            padding: 6px 10px;
            font-size: 0.7rem;
            min-height: 32px;
          }
        }
      `}</style>
        </div>
    );
}
