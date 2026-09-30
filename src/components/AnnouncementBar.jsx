import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div style={{
      backgroundColor: '#071813',
      color: '#e5c98d',
      padding: '7px 16px',
      fontSize: '0.74rem',
      fontWeight: '500',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      borderBottom: '1px solid rgba(212, 175, 55, 0.22)',
      textAlign: 'center',
      position: 'relative',
      zIndex: 50
    }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <Sparkles size={12} style={{ color: '#d4af37' }} />
        DIRECT FROM THE MIST-BLESSED HILLS OF KERALA
      </span>
      <span style={{ opacity: 0.4 }}>|</span>
      <span>COMPLIMENTARY EXPRESS SHIPPING ON ORDERS ABOVE ₹999</span>
      <span style={{ opacity: 0.4 }} className="hide-mobile">|</span>
      <span className="hide-mobile" style={{ color: '#ffffff', opacity: 0.85 }}>100% ORGANIC & TRACEABLE</span>
    </div>
  );
}
