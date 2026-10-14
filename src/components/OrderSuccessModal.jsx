import React from 'react';
import { CheckCircle, Package, MapPin, ArrowRight, X, Truck, ExternalLink } from 'lucide-react';
import { getShipwayTrackingUrl } from '../services/shipwayService';

export default function OrderSuccessModal({ orderData, onClose, onOpenTracking }) {
  if (!orderData) return null;

  const orderId = orderData.id || orderData.orderId || ('SY-' + Date.now().toString().slice(-6));
  const shipwayUrl = getShipwayTrackingUrl(orderId);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 22, 17, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.25s var(--ease-spring)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--color-forest-900)',
          color: '#ffffff',
          border: '1px solid rgba(223, 190, 132, 0.35)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '520px',
          width: '100%',
          padding: '36px 30px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-dropdown)',
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
          aria-label="Close modal"
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

        <p style={{ fontSize: '0.88rem', color: '#c2cfc9', marginBottom: '20px' }}>
          Your artisanal spices &amp; wild honey are being hand-packed at source in Wayanad, Kerala.
        </p>

        {/* Shipway Express Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'rgba(223, 190, 132, 0.12)',
            border: '1px solid rgba(223, 190, 132, 0.3)',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '0.75rem',
            color: '#dfbe84',
            fontWeight: '600',
            marginBottom: '20px'
          }}
        >
          <Truck size={14} />
          <span>Fulfillment via Shipway Express Courier Network</span>
        </div>

        {/* Order Info Card */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '6px',
            padding: '16px',
            textAlign: 'left',
            fontSize: '0.84rem',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#a2b4ab' }}>
            <span>Order ID:</span>
            <span style={{ color: '#ffffff', fontWeight: '700' }}>#{orderId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#a2b4ab' }}>
            <span>Items Ordered:</span>
            <span style={{ color: '#ffffff' }}>{(orderData.items || []).length} product(s)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#a2b4ab' }}>
            <span>Payment Method:</span>
            <span style={{ color: '#74db93', fontWeight: '600' }}>{orderData.paymentMethod || 'Razorpay'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#a2b4ab' }}>
            <span>Total Amount:</span>
            <span style={{ color: '#e5c98d', fontWeight: '700', fontSize: '1.05rem' }}>₹{orderData.total ?? orderData.grandTotal}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#74db93', fontSize: '0.76rem', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <MapPin size={13} />
            <span>Traceable Lot: Wayanad High-Altitude Organic Block #04 · Status: Confirmed</span>
          </div>
        </div>

        {/* Dual Actions: Track with Shipway & Continue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => {
              if (onOpenTracking) {
                onOpenTracking(orderId);
              } else {
                window.open(shipwayUrl, '_blank');
              }
            }}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#dfbe84',
              color: '#071912',
              border: 'none',
              borderRadius: '4px',
              fontWeight: '700',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}
          >
            <Truck size={16} />
            <span>Track Live with Shipway</span>
          </button>

          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '10px',
              background: 'transparent',
              border: '1px solid rgba(223, 190, 132, 0.3)',
              color: '#f5e4c3',
              borderRadius: '4px',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Continue Exploring Sahydri
          </button>
        </div>
      </div>
    </div>
  );
}
