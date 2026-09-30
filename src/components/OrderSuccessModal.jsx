import React from 'react';
import { CheckCircle, Package, MapPin, ArrowRight, X } from 'lucide-react';

export default function OrderSuccessModal({ orderData, onClose }) {
  if (!orderData) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 18, 14, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 120,
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
          border: '1px solid #d4af37',
          borderRadius: '12px',
          maxWidth: '520px',
          width: '100%',
          padding: '36px 30px',
          textAlign: 'center',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#a2b4ab',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Checkmark circle */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(116, 219, 147, 0.15)',
            border: '2px solid #74db93',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px auto'
          }}
        >
          <CheckCircle size={36} color="#74db93" />
        </div>

        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.74rem',
            color: '#e5c98d',
            letterSpacing: '0.2em',
            textTransform: 'uppercase'
          }}
        >
          HARVEST DISPATCH CONFIRMED
        </span>

        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            color: '#ffffff',
            marginTop: '6px',
            marginBottom: '10px'
          }}
        >
          Thank You for Your Order!
        </h3>

        <p style={{ fontSize: '0.88rem', color: '#c2cfc9', marginBottom: '24px' }}>
          Your artisanal spices & wild honey are being hand-packed at source in Wayanad, Kerala.
        </p>

        {/* Order Info Card */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '6px',
            padding: '16px',
            textAlign: 'left',
            fontSize: '0.84rem',
            marginBottom: '24px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#a2b4ab' }}>
            <span>Order ID:</span>
            <span style={{ color: '#ffffff', fontWeight: '700' }}>#SY-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#a2b4ab' }}>
            <span>Items Ordered:</span>
            <span style={{ color: '#ffffff' }}>{orderData.items.length} product(s)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#a2b4ab' }}>
            <span>Amount Paid:</span>
            <span style={{ color: '#e5c98d', fontWeight: '700', fontSize: '1.05rem' }}>₹{orderData.grandTotal}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#74db93', fontSize: '0.76rem', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <MapPin size={13} />
            <span>Traceable Lot: Wayanad High-Altitude Organic Block #04</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn-gold"
          style={{ width: '100%', padding: '12px' }}
        >
          Continue Exploring Sahyadri
        </button>
      </div>
    </div>
  );
}
