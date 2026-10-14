import React, { useState, useEffect } from 'react';
import { Truck, MapPin, CheckCircle2, Clock, AlertCircle, Sparkles } from 'lucide-react';

// Helper to calculate realistic business delivery dates (excluding Sundays)
function addBusinessDays(baseDate, daysToAdd) {
  const result = new Date(baseDate);
  let added = 0;
  while (added < daysToAdd) {
    result.setDate(result.getDate() + 1);
    // Sunday (0) is a courier non-delivery day
    if (result.getDay() !== 0) {
      added++;
    }
  }
  return result;
}

function formatDate(date) {
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

// Estimate delivery date range and region based on Indian postal circle prefix
function calculateDeliveryInfo(pincode) {
  const pin = String(pincode).trim();
  if (!/^[1-9][0-9]{5}$/.test(pin)) {
    return { valid: false, error: 'Please enter a valid 6-digit Indian pincode.' };
  }

  const prefix = pin.slice(0, 2);
  let minDays = 4;
  let maxDays = 6;
  let region = 'National Express Corridor';

  // Order cut-off: If ordered after 3 PM (15:00), packaging/dispatch begins next morning
  const now = new Date();
  const dispatchBase = new Date(now);
  if (now.getHours() >= 15) {
    dispatchBase.setDate(dispatchBase.getDate() + 1);
  }

  if (['67', '68', '69'].includes(prefix)) {
    minDays = 2;
    maxDays = 3;
    region = 'Kerala';
  } else if (['56', '57', '58', '59'].includes(prefix)) {
    minDays = 3;
    maxDays = 4;
    region = 'Karnataka';
  } else if (['60', '61', '62', '63', '64'].includes(prefix)) {
    minDays = 3;
    maxDays = 4;
    region = 'Tamil Nadu';
  } else if (['50', '51', '52', '53'].includes(prefix)) {
    minDays = 3;
    maxDays = 5;
    region = 'Telangana & Andhra Pradesh';
  } else if (['40', '41', '42', '43', '44'].includes(prefix)) {
    minDays = 3;
    maxDays = 5;
    region = 'Maharashtra';
  } else if (['11', '12', '13', '20'].includes(prefix)) {
    minDays = 4;
    maxDays = 6;
    region = 'Delhi NCR';
  } else if (['70', '71', '72', '73', '74'].includes(prefix)) {
    minDays = 4;
    maxDays = 6;
    region = 'West Bengal';
  } else if (['78', '79', '18', '19'].includes(prefix)) {
    minDays = 5;
    maxDays = 7;
    region = 'North East';
  } else {
    minDays = 4;
    maxDays = 6;
    region = 'Standard Delivery Zone';
  }

  const minDate = addBusinessDays(dispatchBase, minDays);
  const maxDate = addBusinessDays(dispatchBase, maxDays);

  const formattedRange = `${formatDate(minDate)} – ${formatDate(maxDate)}`;

  return {
    valid: true,
    minDays,
    maxDays,
    daysLabel: `${minDays}–${maxDays} Business Days`,
    region,
    formattedRange,
    pincode: pin
  };
}

export default function DeliveryEstimator({ compact = false, theme = 'light' }) {
  const [pincode, setPincode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-load saved pincode from previous checks
  useEffect(() => {
    const savedPin = localStorage.getItem('sahydri_user_pincode');
    if (savedPin && /^[1-9][0-9]{5}$/.test(savedPin)) {
      setPincode(savedPin);
      setDeliveryResult(calculateDeliveryInfo(savedPin));
    }
  }, []);

  const handleCheck = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!pincode || pincode.trim().length !== 6) {
      setErrorMsg('Enter a valid 6-digit pincode.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = calculateDeliveryInfo(pincode);
      if (!res.valid) {
        setErrorMsg(res.error);
        setDeliveryResult(null);
      } else {
        setDeliveryResult(res);
        localStorage.setItem('sahydri_user_pincode', res.pincode);
      }
      setLoading(false);
    }, 280);
  };

  const handleReset = () => {
    setDeliveryResult(null);
    setPincode('');
    setErrorMsg('');
    localStorage.removeItem('sahydri_user_pincode');
  };

  const isLight = theme === 'light';

  return (
    <div className={`pincode-delivery-card ${compact ? 'pincode-compact' : ''} ${isLight ? 'pincode-theme-light' : 'pincode-theme-dark'}`}>
      <div className="pincode-card-header">
        <div className="pincode-header-title">
          <Truck size={15} color={isLight ? '#8c733b' : '#dfbe84'} />
          <span>Delivery &amp; Pincode Availability</span>
        </div>
        {deliveryResult && (
          <button type="button" onClick={handleReset} className="pincode-change-btn">
            Change
          </button>
        )}
      </div>

      {!deliveryResult ? (
        <form onSubmit={handleCheck} className="pincode-form">
          <div className="pincode-input-wrap">
            <MapPin size={14} className="pincode-pin-icon" />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="Enter 6-digit Pincode"
              value={pincode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setPincode(val);
                if (val.length === 6) {
                  setErrorMsg('');
                }
              }}
              className="pincode-input"
            />
          </div>
          <button
            type="submit"
            disabled={loading || pincode.length !== 6}
            className="pincode-check-btn"
          >
            {loading ? 'Checking...' : 'Check'}
          </button>
        </form>
      ) : (
        <div className="pincode-result-box">
          <div className="delivery-date-row">
            <CheckCircle2 size={16} color={isLight ? '#16a34a' : '#10b981'} className="delivery-check-icon" />
            <div>
              <div className="delivery-date-text">
                Estimated Delivery: <strong className="delivery-date-highlight">{deliveryResult.formattedRange}</strong>
              </div>
              <div className="delivery-region-text">
                Delivery in {deliveryResult.daysLabel} to {deliveryResult.pincode}
              </div>
            </div>
          </div>

          <div className="delivery-features-list">
            <div className="delivery-feature-item">
              <span className="feature-dot">⚡</span>
              <span>Dispatched within 24 hours</span>
            </div>
            <div className="delivery-feature-item">
              <span className="feature-dot">🚚</span>
              <span>Express Doorstep Delivery</span>
            </div>
            <div className="delivery-feature-item">
              <span className="feature-dot">💵</span>
              <span>Cash on Delivery &amp; UPI Available</span>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="pincode-error-msg">
          <AlertCircle size={13} />
          <span>{errorMsg}</span>
        </div>
      )}

      <style>{`
        .pincode-delivery-card {
          background: rgba(14, 43, 33, 0.55);
          border: 1px solid rgba(223, 190, 132, 0.28);
          border-radius: 8px;
          padding: 14px 16px;
          margin: 18px 0;
          color: #ffffff;
          box-shadow: inset 0 1px 0 rgba(223, 190, 132, 0.12);
        }

        .pincode-compact {
          padding: 10px 12px;
          margin: 12px 0;
        }

        .pincode-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .pincode-header-title {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: var(--font-sans);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #dfbe84;
        }

        .pincode-change-btn {
          background: none;
          border: none;
          color: #dfbe84;
          font-family: var(--font-sans);
          font-size: 0.72rem;
          font-weight: 600;
          text-decoration: underline;
          cursor: pointer;
          padding: 0;
          transition: color 0.18s ease;
        }

        .pincode-change-btn:hover {
          color: #ffffff;
        }

        .pincode-form {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .pincode-input-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          background: rgba(5, 18, 14, 0.85);
          border: 1px solid rgba(223, 190, 132, 0.28);
          border-radius: 4px;
          padding: 0 10px;
          height: 38px;
          transition: border-color 0.2s ease;
        }

        .pincode-input-wrap:focus-within {
          border-color: #dfbe84;
          box-shadow: 0 0 10px rgba(223, 190, 132, 0.25);
        }

        .pincode-pin-icon {
          color: #dfbe84;
          margin-right: 6px;
          flex-shrink: 0;
        }

        .pincode-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-family: var(--font-sans);
          font-size: 0.86rem;
          letter-spacing: 0.06em;
        }

        .pincode-input::placeholder {
          color: rgba(229, 237, 232, 0.45);
          font-size: 0.8rem;
          letter-spacing: 0;
        }

        .pincode-check-btn {
          height: 38px;
          padding: 0 18px;
          background: #dfbe84;
          color: #071912;
          border: none;
          border-radius: 4px;
          font-family: var(--font-sans);
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .pincode-check-btn:hover:not(:disabled) {
          background: #ebd4a8;
          transform: translateY(-1px);
        }

        .pincode-check-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pincode-result-box {
          animation: pincodeFadeIn 0.24s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes pincodeFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .delivery-date-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(223, 190, 132, 0.15);
          margin-bottom: 10px;
        }

        .delivery-check-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .delivery-date-text {
          font-size: 0.88rem;
          color: #ffffff;
          font-family: var(--font-sans);
          line-height: 1.35;
        }

        .delivery-date-highlight {
          color: #74db93;
          font-weight: 700;
        }

        .delivery-region-text {
          font-size: 0.72rem;
          color: rgba(223, 190, 132, 0.8);
          margin-top: 2px;
        }

        .delivery-features-list {
          display: flex;
          flex-direction: column;
          gap: 5px;
          font-size: 0.74rem;
          color: rgba(229, 237, 232, 0.8);
          font-family: var(--font-sans);
        }

        .delivery-feature-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .feature-dot {
          font-size: 0.75rem;
        }

        .pincode-error-msg {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #ef4444;
          font-size: 0.74rem;
          margin-top: 8px;
          font-family: var(--font-sans);
        }

        /* Light Theme (Product Detail Page & Cart Drawer) */
        .pincode-theme-light {
          background-color: #fbf9f5;
          border: 1px solid #ebd9b8;
          border-radius: 8px;
          color: #0c261e;
          box-shadow: 0 4px 14px rgba(11, 37, 29, 0.04);
        }

        .pincode-theme-light .pincode-header-title {
          color: #0c261e;
          font-weight: 700;
        }

        .pincode-theme-light .pincode-change-btn {
          color: #8c733b;
          font-weight: 700;
        }

        .pincode-theme-light .pincode-change-btn:hover {
          color: #0c261e;
        }

        .pincode-theme-light .pincode-input-wrap {
          background: #ffffff;
          border: 1px solid #d4cbb8;
        }

        .pincode-theme-light .pincode-input-wrap:focus-within {
          border-color: #8c733b;
          box-shadow: 0 0 8px rgba(140, 115, 59, 0.25);
        }

        .pincode-theme-light .pincode-pin-icon {
          color: #8c733b;
        }

        .pincode-theme-light .pincode-input {
          color: #0c261e;
          font-weight: 600;
        }

        .pincode-theme-light .pincode-input::placeholder {
          color: #8c8273;
          font-weight: 400;
        }

        .pincode-theme-light .pincode-check-btn {
          background: #0c261e;
          color: #dfbe84;
          font-weight: 700;
        }

        .pincode-theme-light .pincode-check-btn:hover:not(:disabled) {
          background: #174537;
          color: #ffffff;
        }

        .pincode-theme-light .delivery-date-row {
          border-bottom: 1px solid rgba(140, 115, 59, 0.2);
        }

        .pincode-theme-light .delivery-date-text {
          color: #0c261e;
          font-size: 0.94rem;
          font-weight: 600;
        }

        .pincode-theme-light .delivery-date-highlight {
          color: #166534;
          font-weight: 800;
        }

        .pincode-theme-light .delivery-region-text {
          color: #6a6255;
          font-size: 0.76rem;
          font-weight: 500;
        }

        .pincode-theme-light .delivery-features-list {
          color: #3b3529;
          font-size: 0.76rem;
          font-weight: 500;
        }

        .pincode-theme-light .delivery-feature-item {
          color: #3b3529;
        }
      `}</style>
    </div>
  );
}
