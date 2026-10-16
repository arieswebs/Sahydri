import React, { useState } from 'react';
import { Check, CheckCircle2, Copy, X, Truck } from 'lucide-react';
import { getShipwayTrackingUrl } from '../services/shipwayService';

export default function OrderSuccessModal({ orderData, onClose, onOpenTracking }) {
  const [copied, setCopied] = useState(false);
  if (!orderData) return null;

  const rawId = orderData.id || orderData.orderId || ('SY-' + Date.now().toString().slice(-6));
  const cleanId = String(rawId).replace(/^#/, '');
  const orderId = `#${cleanId}`;
  const shipwayUrl = getShipwayTrackingUrl(cleanId);
  const items = orderData.items || [];
  const itemCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0) || items.length || 1;
  const totalAmount = orderData.total ?? orderData.grandTotal ?? 0;
  const paymentMethod = orderData.paymentMethod || 'Online Payment';

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cleanId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          color: '#0f172a',
          borderRadius: '20px',
          maxWidth: '430px',
          width: '100%',
          padding: '32px 28px',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          position: 'relative',
          fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
          animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
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
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.15s, background-color 0.15s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Clean Success Badge */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#ecfdf5',
            border: '2px solid #a7f3d0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}
        >
          <CheckCircle2 size={32} color="#059669" strokeWidth={2.2} />
        </div>

        {/* Header */}
        <h3
          style={{
            fontSize: '1.45rem',
            fontWeight: 700,
            color: '#0f172a',
            margin: '0 0 6px 0',
            letterSpacing: '-0.02em'
          }}
        >
          Thank You for Your Order!
        </h3>

        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 20px 0', lineHeight: 1.45 }}>
          Your order has been received and is being prepared for dispatch.
        </p>

        {/* Clean Summary Card */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '16px 18px',
            textAlign: 'left',
            fontSize: '0.84rem',
            marginBottom: '20px'
          }}
        >
          {/* Order ID Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px' }}>
            <span style={{ color: '#64748b', fontWeight: 500 }}>Order ID</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.84rem', fontFamily: 'monospace' }}>
                {orderId}
              </span>
              <button
                onClick={handleCopy}
                title="Copy Order ID"
                style={{
                  background: copied ? '#ecfdf5' : '#ffffff',
                  border: `1px solid ${copied ? '#a7f3d0' : '#cbd5e1'}`,
                  borderRadius: '6px',
                  padding: '3px 6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.72rem',
                  color: copied ? '#059669' : '#64748b',
                  transition: 'all 0.15s ease'
                }}
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '0 0 10px 0' }} />

          {/* Items & Payment */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#64748b' }}>Items</span>
            <span style={{ color: '#0f172a', fontWeight: 600 }}>{itemCount} product{itemCount > 1 ? 's' : ''}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#64748b' }}>Payment</span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              color: '#047857',
              backgroundColor: '#ecfdf5',
              padding: '2px 8px',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '0.76rem'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              {paymentMethod}
            </span>
          </div>

          <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '10px 0' }} />

          {/* Total Amount */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.88rem' }}>Total Amount</span>
            <span style={{ color: '#0a221a', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
              ₹{Number(totalAmount).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Clean Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => {
              if (onOpenTracking) {
                onOpenTracking(cleanId);
              } else {
                window.open(shipwayUrl, '_blank');
              }
            }}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#0a221a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#13392d'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0a221a'; }}
          >
            <Truck size={16} />
            <span>Track Order Status</span>
          </button>

          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '11px 16px',
              backgroundColor: 'transparent',
              border: '1px solid #e2e8f0',
              color: '#475569',
              borderRadius: '10px',
              fontSize: '0.84rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.15s ease, color 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#475569'; }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
