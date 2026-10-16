import React, { useState, useEffect } from 'react';
import { Truck, Check, CheckCircle2, Clock, ExternalLink, X, Search } from 'lucide-react';
import { getShipwayTrackingUrl, getShipmentMilestones } from '../services/shipwayService';

export default function ShipwayTrackingModal({ isOpen, onClose, initialOrderId = '' }) {
  const [orderQuery, setOrderQuery] = useState(initialOrderId || '');
  const [searchedId, setSearchedId] = useState(initialOrderId || 'SY-849201');

  useEffect(() => {
    if (initialOrderId) {
      setOrderQuery(initialOrderId);
      setSearchedId(initialOrderId);
    }
  }, [initialOrderId]);

  if (!isOpen) return null;

  const milestones = getShipmentMilestones(searchedId);
  const cleanId = String(searchedId).replace(/^#/, '');
  const displayId = `#${cleanId}`;
  const shipwayUrl = getShipwayTrackingUrl(cleanId);

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderQuery.trim()) {
      setSearchedId(orderQuery.trim());
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
          maxWidth: '460px',
          width: '100%',
          padding: '28px 24px',
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

        {/* Header */}
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Truck size={18} color="#059669" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                Track Shipment
              </h3>
            </div>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 44px' }}>
            Real-time delivery status for your order
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
          <div style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px' }} />
            <input
              type="text"
              placeholder="Enter Order ID (e.g. SY-849201)"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 34px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '0.84rem',
                color: '#0f172a',
                outline: 'none',
                transition: 'border-color 0.15s ease'
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#0a221a'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '9px 16px',
              backgroundColor: '#0a221a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#13392d'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0a221a'; }}
          >
            Track
          </button>
        </form>

        {/* Order Status Summary */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '14px 16px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500 }}>Shipment Reference</div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace', marginTop: '2px' }}>
              {displayId}
            </div>
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#ecfdf5',
            color: '#047857',
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 600
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span>In Transit</span>
          </div>
        </div>

        {/* Timeline */}
        <div style={{
          maxHeight: '260px',
          overflowY: 'auto',
          padding: '4px 8px 4px 4px',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          {milestones.map((step, idx) => {
            const isCompleted = step.completed;
            const isActive = step.active;

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '12px',
                  position: 'relative',
                  paddingBottom: idx < milestones.length - 1 ? '18px' : '4px'
                }}
              >
                {/* Connecting line */}
                {idx < milestones.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '22px',
                    left: '11px',
                    bottom: 0,
                    width: '2px',
                    backgroundColor: isCompleted ? '#a7f3d0' : '#e2e8f0'
                  }} />
                )}

                {/* Status Dot */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? '#ecfdf5' : (isActive ? '#fef3c7' : '#f1f5f9'),
                  border: `2px solid ${isCompleted ? '#10b981' : (isActive ? '#f59e0b' : '#cbd5e1')}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  zIndex: 1
                }}>
                  {isCompleted ? (
                    <Check size={12} color="#059669" strokeWidth={3} />
                  ) : (
                    <Clock size={11} color={isActive ? '#b45309' : '#94a3b8'} strokeWidth={2} />
                  )}
                </div>

                {/* Status Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{
                      fontSize: '0.84rem',
                      fontWeight: isActive || isCompleted ? 600 : 500,
                      color: isCompleted || isActive ? '#0f172a' : '#94a3b8'
                    }}>
                      {step.status}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      {step.date} · {step.timestamp}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '0.76rem',
                    color: '#64748b',
                    margin: '3px 0 0 0',
                    lineHeight: 1.4
                  }}>
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <a
            href={shipwayUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              padding: '11px 16px',
              backgroundColor: '#0a221a',
              color: '#ffffff',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              textDecoration: 'none',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#13392d'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0a221a'; }}
          >
            <span>Open in Shipway</span>
            <ExternalLink size={13} />
          </a>

          <button
            onClick={onClose}
            style={{
              padding: '11px 18px',
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
