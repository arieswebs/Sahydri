import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';

export default function SearchModal({ isOpen, onClose, onSelectProduct }) {
  const { products } = useShop();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const catalog = (products && products.length > 0) ? products : PRODUCTS;
  const results = query.trim() === ''
    ? []
    : catalog.filter((p) =>
        p.name?.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase()) ||
        p.originBadge?.toLowerCase().includes(query.toLowerCase()) ||
        p.category?.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 22, 17, 0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 115,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '80px',
        paddingLeft: '20px',
        paddingRight: '20px',
        animation: 'fadeIn 0.2s var(--ease-spring)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--color-forest-900)',
          color: '#ffffff',
          border: '1px solid rgba(223, 190, 132, 0.35)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '620px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-dropdown)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(223, 190, 132, 0.2)',
            backgroundColor: 'var(--color-forest-950)'
          }}
        >
          <Search size={20} color="#e5c98d" />
          <input
            type="text"
            autoFocus
            placeholder="Search spices, honey, origins (e.g. Cardamom, Turmeric, Wayanad)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flexGrow: 1,
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '1rem',
              outline: 'none',
              fontFamily: 'var(--font-sans)'
            }}
          />
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#a2b4ab',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Results */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '16px 20px' }}>
          {query.trim() === '' ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#8fa59b', fontSize: '0.85rem' }}>
              Type a spice name, origin (Wayanad, Alleppey, Malabar), or honey variety...
            </div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#8fa59b', fontSize: '0.85rem' }}>
              No spices or honey found matching "{query}".
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '10px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(212, 175, 55, 0.15)',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.12)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)')}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: '#ffffff' }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#a2b4ab' }}>
                      {product.originBadge} • ₹{product.price}
                    </div>
                  </div>
                  <ArrowRight size={16} color="#e5c98d" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
