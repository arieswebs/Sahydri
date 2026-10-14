import React, { useState } from 'react';
import { X, Star, ShoppingCart, ShieldCheck, MapPin, Wind, Sparkles, Check } from 'lucide-react';
import DeliveryEstimator from './DeliveryEstimator';

export default function ProductQuickView({ product, onClose, onAddToCart, onViewProduct }) {
  const [selectedWeight, setSelectedWeight] = useState(product ? product.weight : '100g');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const weights = (Array.isArray(product.weights) && product.weights.length > 0)
    ? product.weights.map(w => {
        const wLabel = w.weight || w.label || String(w);
        const wPrice = w.price !== undefined ? Number(w.price) : Number(product.price);
        const wOrigPrice = w.originalPrice !== undefined ? Number(w.originalPrice) : Number(product.originalPrice || product.price);
        return {
          label: wLabel,
          price: wPrice,
          originalPrice: wOrigPrice,
          multiplier: (Number(wPrice) && Number(product.price)) ? (Number(wPrice) / Number(product.price)) : 1
        };
      })
    : [
        { label: product.weight || '100g', multiplier: 1 },
        { label: '250g', multiplier: 2.2 },
        { label: '500g Family Pack', multiplier: 4.0 }
      ];

  const selectedOption = weights.find(w => w.label === selectedWeight) || weights[0];
  const currentMultiplier = selectedOption?.multiplier || 1;
  const currentPrice = selectedOption?.price !== undefined ? selectedOption.price : Math.round(product.price * currentMultiplier);
  const currentOriginal = selectedOption?.originalPrice !== undefined ? selectedOption.originalPrice : Math.round(product.originalPrice * currentMultiplier);

  const handleAdd = () => {
    onAddToCart({
      ...product,
      weight: selectedWeight,
      price: currentPrice,
      quantity
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 18, 14, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#0c261e',
          color: '#ffffff',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          borderRadius: '10px',
          maxWidth: '820px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(0, 0, 0, 0.5)',
            border: 'none',
            color: '#ffffff',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Left: Product Image */}
        <div style={{ position: 'relative', backgroundColor: '#061611', minHeight: '340px' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              backgroundColor: 'rgba(11, 34, 26, 0.9)',
              color: '#f3dfb5',
              fontSize: '0.68rem',
              fontWeight: '700',
              padding: '4px 10px',
              borderRadius: '3px',
              letterSpacing: '0.1em'
            }}
          >
            {product.originBadge}
          </div>
        </div>

        {/* Right: Info */}
        <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column' }}>
          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', color: '#d4af37' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#d4af37" color="#d4af37" />
              ))}
            </div>
            <span style={{ fontSize: '0.8rem', color: '#a2b4ab' }}>
              {product.rating} ({product.reviewsCount} customer reviews)
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1.45rem',
              fontWeight: '600',
              color: '#ffffff',
              lineHeight: '1.2',
              letterSpacing: '-0.01em',
              marginBottom: '4px'
            }}
          >
            {product.name}
          </h2>
          <div style={{ fontSize: '0.82rem', color: '#e5c98d', marginBottom: '14px', fontWeight: '500' }}>
            {product.subname}
          </div>

          {/* Pricing */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: '700', color: '#ffffff' }}>
              ₹{currentPrice}
            </span>
            <span style={{ fontSize: '0.95rem', color: '#7a8f84', textDecoration: 'line-through' }}>
              ₹{currentOriginal}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#74db93', fontWeight: '600' }}>
              (Inclusive of all taxes)
            </span>
          </div>

          <p style={{ fontSize: '0.86rem', lineHeight: '1.6', color: '#c5d3cc', marginBottom: '20px' }}>
            {product.description}
          </p>

          {/* Estate Origin Details Chips */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '6px',
              padding: '12px',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              fontSize: '0.75rem',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e5c98d' }}>
              <MapPin size={13} />
              <span>Elevation: {product.elevation}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e5c98d' }}>
              <Wind size={13} />
              <span>Season: {product.harvestSeason}</span>
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '6px', color: '#74db93' }}>
              <Sparkles size={13} />
              <span>Tested: {product.curcuminOrOil}</span>
            </div>
          </div>

          {/* Pack Size Selector */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a2b4ab', marginBottom: '8px' }}>
              Select Package Size:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {weights.map((w, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedWeight(w.label)}
                  style={{
                    backgroundColor: selectedWeight === w.label ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: selectedWeight === w.label ? '1px solid #d4af37' : '1px solid rgba(255, 255, 255, 0.15)',
                    color: selectedWeight === w.label ? '#ffffff' : '#b2c4bc',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    fontWeight: selectedWeight === w.label ? '600' : '400'
                  }}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery & Pincode Checker */}
          <DeliveryEstimator compact={true} theme="dark" />

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
            {/* Quantity */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  width: '32px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                -
              </button>
              <span style={{ padding: '0 12px', fontWeight: '600', fontSize: '0.9rem' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  width: '32px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                +
              </button>
            </div>

            {/* Add button */}
            <button
              onClick={handleAdd}
              className="btn-gold"
              style={{ flexGrow: 1, padding: '12px', backgroundColor: added ? '#266854' : '#ebd4a5', color: added ? '#ffffff' : '#071813' }}
            >
              {added ? (
                <>
                  <Check size={16} color="#74db93" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>

          {/* Full Page Link */}
          {onViewProduct && (
            <button
              onClick={() => {
                onClose();
                onViewProduct(product);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#dfbe84',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'center',
                textDecoration: 'underline',
                padding: '6px 0',
                marginTop: '10px'
              }}
            >
              View Full Product Details & Lab Report →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
