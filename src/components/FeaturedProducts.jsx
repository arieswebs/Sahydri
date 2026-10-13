import React, { useState } from 'react';
import { ArrowRight, Star, Heart, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

// 3 curated hero products to feature on the homepage
const FEATURED_IDS = ['cardamom-elaichi-8mm', 'wild-honey-raw', 'hot-processed-coconut-oil'];

export default function FeaturedProducts({ onViewProduct, onAddToCart, onToggleWishlist, onShopAll }) {
    const { products, wishlist } = useShop();
    const [addedId, setAddedId] = useState(null);

    const featured = FEATURED_IDS
        .map(id => products.find(p => p.id === id))
        .filter(Boolean);

    const handleAdd = (e, product) => {
        e.stopPropagation();
        onAddToCart(product);
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 1600);
    };

    return (
        <section style={{ padding: '90px 0 80px', background: '#faf8f4' }}>
            <div className="container">
                {/* Section Header */}
                <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px', background: 'rgba(11,37,29,0.05)', border: '1px solid rgba(11,37,29,0.1)', borderRadius: '20px', padding: '5px 14px' }}>
                        <Sparkles size={12} color="#9e8550" />
                        <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9e8550', fontWeight: 700 }}>
                            Bestsellers This Season
                        </span>
                    </div>
                    <h2 style={{
                        fontFamily: 'var(--font-serif)', fontWeight: 400,
                        fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#0a221a',
                        letterSpacing: '-0.01em', marginBottom: '12px'
                    }}>
                        The Finest <em style={{ fontStyle: 'italic', color: '#8c733b' }}>Three</em>
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: '#70685b', maxWidth: '480px', margin: '0 auto', lineHeight: 1.65 }}>
                        Hand-curated from our estate. Each product carries an unbroken chain of origin — from forest canopy to your kitchen.
                    </p>
                </div>

                {/* 3-Column Product Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '24px',
                    marginBottom: '48px'
                }} className="featured-grid">
                    {featured.map((product, idx) => {
                        const isWL = wishlist.includes(product.id);
                        const isAdd = addedId === product.id;
                        const disc = product.originalPrice > product.price
                            ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

                        return (
                            <div
                                key={product.id}
                                onClick={() => onViewProduct(product)}
                                style={{
                                    background: '#fff', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer',
                                    border: '1px solid rgba(11,37,29,0.07)', display: 'flex', flexDirection: 'column',
                                    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)', position: 'relative'
                                }}
                                className="feat-card"
                            >
                                {/* Rank badge */}
                                <div style={{
                                    position: 'absolute', top: '14px', left: '14px', zIndex: 6,
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    background: 'rgba(11,37,29,0.85)', color: '#dfbe84',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.72rem', fontWeight: 800
                                }}>
                                    #{idx + 1}
                                </div>

                                {/* Discount */}
                                {disc > 0 && (
                                    <div style={{
                                        position: 'absolute', top: '14px', right: '48px', zIndex: 6,
                                        background: '#b91c1c', color: '#fff', fontSize: '0.68rem',
                                        fontWeight: 700, padding: '2px 7px', borderRadius: '3px'
                                    }}>
                                        -{disc}%
                                    </div>
                                )}

                                {/* Wishlist */}
                                <button
                                    onClick={e => { e.stopPropagation(); onToggleWishlist(product.id); }}
                                    style={{
                                        position: 'absolute', top: '14px', right: '14px', zIndex: 6,
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.9)', border: 'none',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <Heart size={14} color={isWL ? '#b91c1c' : '#9a9080'} fill={isWL ? '#b91c1c' : 'none'} />
                                </button>

                                {/* Image */}
                                <div style={{ aspectRatio: '4/3', background: '#f3efe8', overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={product.image} alt={product.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.55s cubic-bezier(0.16,1,0.3,1)' }}
                                        className="feat-img"
                                    />
                                    {/* Hover overlay */}
                                    <div className="feat-overlay" style={{
                                        position: 'absolute', inset: 0, background: 'rgba(11,37,29,0.18)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        opacity: 0, transition: 'opacity 0.3s ease'
                                    }}>
                                        <span style={{ background: 'rgba(11,37,29,0.88)', color: '#f5e7c8', padding: '8px 18px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em' }}>
                                            VIEW DETAILS →
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div style={{ padding: '20px 20px 22px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    {/* Origin + Rating */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9e8550', fontWeight: 700 }}>
                                            {product.originBadge}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                            <Star size={11} fill="#dfbe84" color="#dfbe84" />
                                            <span style={{ fontSize: '0.72rem', color: '#7a7266', fontWeight: 600 }}>{product.rating}</span>
                                            <span style={{ fontSize: '0.68rem', color: '#a39b8e' }}>({product.reviewsCount})</span>
                                        </div>
                                    </div>

                                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 700, color: '#0e2b21', lineHeight: 1.3, marginBottom: '4px' }}>
                                        {product.name}
                                    </h3>
                                    <p style={{ fontSize: '0.78rem', color: '#7a7266', marginBottom: '12px', lineHeight: 1.5 }}>
                                        {product.subname}
                                    </p>

                                    {/* Price + CTA */}
                                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(11,37,29,0.06)', paddingTop: '14px' }}>
                                        <div>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0d2820' }}>₹{product.price}</span>
                                            {disc > 0 && <span style={{ fontSize: '0.76rem', color: '#a39b8e', textDecoration: 'line-through', marginLeft: '6px' }}>₹{product.originalPrice}</span>}
                                            <div style={{ fontSize: '0.68rem', color: '#7a7266', marginTop: '1px' }}>{product.weight}</div>
                                        </div>
                                        <button
                                            onClick={e => handleAdd(e, product)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '6px',
                                                padding: '9px 16px', fontSize: '0.78rem', fontWeight: 700,
                                                letterSpacing: '0.05em', borderRadius: '5px', cursor: 'pointer',
                                                border: 'none', transition: 'all 0.2s ease',
                                                background: isAdd ? '#1a4d34' : '#0b251d',
                                                color: isAdd ? '#74db93' : '#f5e7c8'
                                            }}
                                        >
                                            {isAdd ? <><Check size={13} strokeWidth={2.5} />Added!</> : <><ShoppingBag size={13} />Add to Cart</>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Shop All CTA */}
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.88rem', color: '#7a7266', marginBottom: '18px' }}>
                        Explore our complete range of 12+ single-origin products
                    </p>
                    <button
                        onClick={onShopAll}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '10px',
                            padding: '15px 36px', fontSize: '0.88rem', fontWeight: 700,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            background: 'linear-gradient(135deg, #0b251d, #163a2a)',
                            color: '#f5e7c8', border: 'none', borderRadius: '6px', cursor: 'pointer',
                            boxShadow: '0 8px 24px rgba(11,37,29,0.2)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 32px rgba(11,37,29,0.3)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(11,37,29,0.2)'; }}
                    >
                        Shop Full Collection
                        <ArrowRight size={16} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
                        {['12+ Products', 'Free Shipping ₹999+', 'Lab Certified', 'Easy Returns'].map(txt => (
                            <span key={txt} style={{ fontSize: '0.72rem', color: '#9a9080', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Check size={12} color="#7a9a6e" strokeWidth={2.5} /> {txt}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 860px) {
          .featured-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 14px !important;
          }
        }
        @media (max-width: 540px) {
          .featured-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .feat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 40px rgba(11,37,29,0.1);
          border-color: rgba(212,175,55,0.35) !important;
        }
        .feat-card:hover .feat-img {
          transform: scale(1.06);
        }
        .feat-card:hover .feat-overlay {
          opacity: 1 !important;
        }
      `}</style>
        </section>
    );
}
