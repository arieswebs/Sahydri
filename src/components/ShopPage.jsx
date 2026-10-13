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
                            <span style={{ fontSize: '1rem' }}>{cat.emoji}</span>
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
                style={{
                    background: '#fff', borderRadius: '8px', border: '1px solid rgba(11,37,29,0.08)',
                    display: 'flex', cursor: 'pointer', overflow: 'hidden',
                    transition: 'all 0.22s ease', marginBottom: '12px'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(11,37,29,0.07)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(11,37,29,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
                <div style={{ width: '160px', flexShrink: 0, background: '#f5f1ea', position: 'relative', overflow: 'hidden' }}>
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
                    <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div>
                            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0d2820' }}>₹{product.price}</span>
                            {disc > 0 && <span style={{ fontSize: '0.78rem', color: '#a39b8e', textDecoration: 'line-through', marginLeft: '6px' }}>₹{product.originalPrice}</span>}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#5a7a5e', background: 'rgba(90,122,94,0.1)', padding: '2px 8px', borderRadius: '3px', fontWeight: 600 }}>
                            {product.weight}
                        </span>
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                            <button
                                onClick={e => { e.stopPropagation(); onBuyNow(product); }}
                                style={{ padding: '8px 16px', fontSize: '0.8rem', fontWeight: 700, background: '#f5e7c8', border: '1px solid #c8a84a', borderRadius: '5px', color: '#0b251d', cursor: 'pointer' }}
                            >
                                Buy Now
                            </button>
                            <button
                                onClick={e => handleAddToCart(e, product)}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.8rem', fontWeight: 700, background: isAdd ? '#1a4d34' : '#0b251d', color: isAdd ? '#74db93' : '#f5e7c8', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
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
            <div style={{ background: 'linear-gradient(135deg, #0b251d, #163a2a)', padding: '22px 0' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Leaf size={18} color="#dfbe84" />
                        <span style={{ color: '#f5e7c8', fontFamily: 'serif', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.04em' }}>
                            Sahyadri Store
                        </span>
                    </div>
                    <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                        <Search size={16} color="#7a9a5e" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search spices, honey, oils…"
                            style={{
                                width: '100%', padding: '11px 14px 11px 42px', boxSizing: 'border-box',
                                background: '#fff', border: '2px solid #dfbe84', borderRadius: '6px',
                                fontSize: '0.9rem', color: '#1a2e25', outline: 'none',
                                fontFamily: 'inherit'
                            }}
                        />
                        {search && (
                            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9a9080' }}>
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dfbe84', fontSize: '0.8rem' }}>
                        <Truck size={14} />
                        <span>Free delivery over ₹999</span>
                    </div>
                </div>
            </div>

            {/* ── Category Pill Tabs ── */}
            <div style={{ background: '#fff', borderBottom: '1px solid rgba(11,37,29,0.08)', overflowX: 'auto' }}>
                <div className="container" style={{ display: 'flex', gap: '4px', padding: '10px 0', whiteSpace: 'nowrap' }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '7px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                                background: category === cat.id ? '#0b251d' : 'transparent',
                                color: category === cat.id ? '#f5e7c8' : '#4a4439',
                                fontSize: '0.82rem', fontWeight: category === cat.id ? 700 : 500,
                                transition: 'all 0.2s ease', whiteSpace: 'nowrap'
                            }}
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
                            <div style={{ width: '300px', background: '#fff', height: '100%', overflowY: 'auto', boxShadow: '4px 0 24px rgba(0,0,0,0.15)', padding: '16px 0' }} onClick={e => e.stopPropagation()}>
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {/* Mobile Filter Toggle */}
                                <button
                                    onClick={() => setMobileSidebarOpen(true)}
                                    style={{ display: 'none', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#0b251d', color: '#f5e7c8', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700 }}
                                    className="shop-mobile-filter-btn"
                                >
                                    <Filter size={14} /> Filters
                                </button>
                                <div style={{ fontSize: '0.85rem', color: '#7a7266' }}>
                                    {productsLoading ? 'Loading…' : (
                                        <><strong style={{ color: '#0b251d' }}>{filtered.length}</strong> result{filtered.length !== 1 ? 's' : ''} {category !== 'all' ? `in "${CATEGORIES.find(c => c.id === category)?.label}"` : ''}</>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {/* Sort */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#7a7266', fontWeight: 600, whiteSpace: 'nowrap' }}>Sort by:</span>
                                    <select
                                        value={sortBy} onChange={e => setSortBy(e.target.value)}
                                        style={{ padding: '7px 10px', background: '#fff', border: '1px solid rgba(11,37,29,0.15)', borderRadius: '6px', fontSize: '0.82rem', color: '#0b251d', fontWeight: 600, cursor: 'pointer', outline: 'none', fontFamily: 'inherit' }}
                                    >
                                        {SORT_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                    </select>
                                </div>
                                {/* View Toggle */}
                                <div style={{ display: 'flex', background: '#fff', border: '1px solid rgba(11,37,29,0.12)', borderRadius: '6px', overflow: 'hidden' }}>
                                    {[
                                        { id: 'grid', Icon: Grid3X3 },
                                        { id: 'list', Icon: List }
                                    ].map(({ id, Icon }) => (
                                        <button
                                            key={id}
                                            onClick={() => setViewMode(id)}
                                            style={{
                                                padding: '7px 10px', border: 'none', cursor: 'pointer',
                                                background: viewMode === id ? '#0b251d' : 'transparent',
                                                color: viewMode === id ? '#f5e7c8' : '#9a9080',
                                                transition: 'all 0.15s ease'
                                            }}
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
        @media (max-width: 1100px) {
          .shop-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 860px) {
          .shop-sidebar-wrapper { display: none !important; }
          .shop-mobile-filter-btn { display: flex !important; }
          .shop-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
        @media (max-width: 480px) {
          .shop-grid { grid-template-columns: repeat(1, 1fr); }
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
