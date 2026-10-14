import React, { useState } from 'react';
import { Package, Truck, CheckCircle2, Clock, MapPin, ExternalLink, X, Search, ShieldCheck } from 'lucide-react';
import { SHIPWAY_CONFIG, getShipwayTrackingUrl, getShipmentMilestones } from '../services/shipwayService';

export default function ShipwayTrackingModal({ isOpen, onClose, initialOrderId = '' }) {
  const [orderQuery, setOrderQuery] = useState(initialOrderId || '');
  const [searchedId, setSearchedId] = useState(initialOrderId || 'SY-849201');

  if (!isOpen) return null;

  const milestones = getShipmentMilestones(searchedId);
  const shipwayUrl = getShipwayTrackingUrl(searchedId);

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderQuery.trim()) {
      setSearchedId(orderQuery.trim());
    }
  };

  return (
    <div className="shipway-modal-backdrop" onClick={onClose}>
      <div className="shipway-modal-card" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="shipway-modal-header">
          <div className="shipway-header-left">
            <div className="shipway-badge">
              <Truck size={14} color="#dfbe84" />
              <span>SHIPWAY EXPRESS LOGISTICS</span>
            </div>
            <h3 className="shipway-modal-title">Live Shipment Tracking</h3>
          </div>
          <button onClick={onClose} className="shipway-close-btn" aria-label="Close tracking">
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="shipway-search-bar">
          <Search size={16} className="shipway-search-icon" />
          <input
            type="text"
            placeholder="Enter Order ID or AWB (e.g. SY-849201)"
            value={orderQuery}
            onChange={e => setOrderQuery(e.target.value)}
            className="shipway-search-input"
          />
          <button type="submit" className="shipway-search-btn">
            Track
          </button>
        </form>

        {/* Tracking Card Overview */}
        <div className="shipway-overview-box">
          <div className="shipway-overview-col">
            <span className="shipway-overview-label">Tracking Number</span>
            <span className="shipway-overview-val">#{searchedId}</span>
          </div>
          <div className="shipway-overview-col">
            <span className="shipway-overview-label">Courier Partner</span>
            <span className="shipway-overview-val">Shipway Priority Air</span>
          </div>
          <div className="shipway-overview-col">
            <span className="shipway-overview-label">Origin</span>
            <span className="shipway-overview-val">Wayanad, Kerala</span>
          </div>
          <div className="shipway-overview-col">
            <span className="shipway-overview-label">Status</span>
            <span className="shipway-status-tag">In Transit</span>
          </div>
        </div>

        {/* Timeline Milestones */}
        <div className="shipway-timeline">
          {milestones.map((step, idx) => (
            <div key={idx} className={`shipway-step ${step.completed ? 'step-done' : ''} ${step.active ? 'step-active' : ''}`}>
              <div className="shipway-step-indicator">
                {step.completed ? (
                  <CheckCircle2 size={16} className="shipway-icon-done" />
                ) : (
                  <Clock size={16} className="shipway-icon-pending" />
                )}
                {idx < milestones.length - 1 && <div className="shipway-step-line" />}
              </div>
              <div className="shipway-step-content">
                <div className="shipway-step-header">
                  <h4 className="shipway-step-title">{step.status}</h4>
                  <span className="shipway-step-time">{step.date} · {step.timestamp}</span>
                </div>
                <p className="shipway-step-detail">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="shipway-modal-footer">
          <div className="shipway-trust-seal">
            <ShieldCheck size={14} color="#dfbe84" />
            <span>Connected with Shipway Account: <strong>{SHIPWAY_CONFIG.accountEmail}</strong></span>
          </div>
          <a
            href={shipwayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shipway-external-link"
          >
            <span>Open in Shipway Portal</span>
            <ExternalLink size={13} />
          </a>
        </div>

      </div>

      <style>{`
        .shipway-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(6, 22, 17, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
        }

        .shipway-modal-card {
          width: 100%;
          max-width: 580px;
          background: linear-gradient(170deg, var(--color-forest-900) 0%, var(--color-forest-950) 100%);
          border: 1px solid rgba(223, 190, 132, 0.35);
          border-radius: var(--radius-lg);
          padding: 24px;
          color: #ffffff;
          box-shadow: var(--shadow-dropdown);
          animation: shipwayFadeIn 0.22s var(--ease-spring);
        }

        @keyframes shipwayFadeIn {
          from { opacity: 0; transform: scale(0.97) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .shipway-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .shipway-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-sans);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: #dfbe84;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .shipway-modal-title {
          font-family: var(--font-serif);
          font-size: 1.45rem;
          color: #ffffff;
          margin: 0;
          font-weight: 500;
        }

        .shipway-close-btn {
          background: rgba(223, 190, 132, 0.08);
          border: 1px solid rgba(223, 190, 132, 0.2);
          color: #c9d8d0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .shipway-close-btn:hover {
          background: #dfbe84;
          color: #04120e;
        }

        .shipway-search-bar {
          display: flex;
          align-items: center;
          background: rgba(4, 18, 14, 0.85);
          border: 1px solid rgba(223, 190, 132, 0.28);
          border-radius: 6px;
          padding: 4px 6px 4px 12px;
          margin-bottom: 18px;
        }

        .shipway-search-icon {
          color: #dfbe84;
          margin-right: 8px;
          flex-shrink: 0;
        }

        .shipway-search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-family: var(--font-sans);
          font-size: 0.86rem;
        }

        .shipway-search-input::placeholder {
          color: rgba(229, 237, 232, 0.45);
        }

        .shipway-search-btn {
          background: #dfbe84;
          color: #051913;
          border: none;
          padding: 7px 16px;
          border-radius: 4px;
          font-family: var(--font-sans);
          font-size: 0.76rem;
          font-weight: 700;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .shipway-search-btn:hover {
          background: #eedcb0;
        }

        .shipway-overview-box {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          background: rgba(223, 190, 132, 0.06);
          border: 1px solid rgba(223, 190, 132, 0.18);
          border-radius: 8px;
          padding: 12px 14px;
          margin-bottom: 20px;
        }

        .shipway-overview-col {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .shipway-overview-label {
          font-size: 0.64rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(223, 190, 132, 0.8);
          font-weight: 600;
        }

        .shipway-overview-val {
          font-size: 0.82rem;
          font-weight: 600;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .shipway-status-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: #10b981;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 2px 7px;
          border-radius: 4px;
          display: inline-block;
          width: fit-content;
        }

        .shipway-timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-bottom: 20px;
          max-height: 240px;
          overflow-y: auto;
          padding-right: 6px;
        }

        .shipway-step {
          display: flex;
          gap: 14px;
          position: relative;
        }

        .shipway-step-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
          width: 20px;
        }

        .shipway-icon-done {
          color: #10b981;
        }

        .shipway-icon-pending {
          color: rgba(223, 190, 132, 0.35);
        }

        .shipway-step-active .shipway-icon-done {
          color: #dfbe84;
        }

        .shipway-step-line {
          width: 2px;
          flex: 1;
          background: rgba(223, 190, 132, 0.2);
          margin: 4px 0;
          min-height: 24px;
        }

        .shipway-step.step-done .shipway-step-line {
          background: rgba(16, 185, 129, 0.5);
        }

        .shipway-step-content {
          padding-bottom: 16px;
          flex: 1;
        }

        .shipway-step-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 8px;
        }

        .shipway-step-title {
          font-size: 0.84rem;
          color: #ffffff;
          margin: 0;
          font-weight: 600;
        }

        .shipway-step-time {
          font-size: 0.68rem;
          color: rgba(223, 190, 132, 0.75);
          white-space: nowrap;
        }

        .shipway-step-detail {
          font-size: 0.74rem;
          color: rgba(229, 237, 232, 0.65);
          margin: 3px 0 0 0;
          line-height: 1.4;
        }

        .shipway-modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid rgba(223, 190, 132, 0.16);
          flex-wrap: wrap;
          gap: 10px;
        }

        .shipway-trust-seal {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          color: rgba(229, 237, 232, 0.7);
        }

        .shipway-trust-seal strong {
          color: #dfbe84;
        }

        .shipway-external-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #dfbe84;
          text-decoration: none;
          transition: color 0.18s ease;
        }

        .shipway-external-link:hover {
          color: #eedcb0;
          text-decoration: underline;
        }

        @media (max-width: 580px) {
          .shipway-overview-box {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .shipway-modal-card {
            padding: 18px 14px;
          }
          .shipway-modal-footer {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
