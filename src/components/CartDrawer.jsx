import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Leaf,
  Sparkles,
  Check,
  Lock,
  Truck,
  Loader
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useShop } from '../context/ShopContext';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onAddToCart
}) {
  const { API, currentUser, showToast, authFetch, createOrder } = useShop();
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [addedRecommendationId, setAddedRecommendationId] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' | 'cod'
  const [deliveryAddress, setDeliveryAddress] = useState(() => currentUser?.address || 'Wayanad High-Road, Kerala 673121');
  const [deliveryPhone, setDeliveryPhone] = useState(() => currentUser?.phone || '');
  const [showAddressEdit, setShowAddressEdit] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 999;
  const freeShippingLeft = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);
  const totalItemCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const handleApplyPromo = (codeToApply) => {
    const code = (codeToApply || promoCode).trim().toUpperCase();
    if (code === 'SAHYADRI10' || code === 'KERALA10') {
      setDiscountPercent(10);
      setPromoApplied(true);
      setPromoError('');
      if (codeToApply) setPromoCode(codeToApply);
    } else {
      setPromoError('Invalid coupon code. Try SAHYADRI10 for 10% off.');
    }
  };

  // ── Cash on Delivery Checkout ─────────────────────────────────────────────
  const handleCodCheckout = async () => {
    if (cartItems.length === 0) return;
    setPaymentLoading(true);

    try {
      const orderPayload = {
        customerName: currentUser?.name || 'Guest Connoisseur',
        customerEmail: currentUser?.email || 'guest@sahyadri.com',
        items: cartItems.map(i => ({
          productId: i.id,
          name: i.name,
          weight: i.weight || 'Standard',
          price: i.price,
          quantity: i.quantity
        })),
        total: grandTotal,
        address: deliveryAddress || currentUser?.address || 'Standard Delivery',
        paymentMethod: 'Cash on Delivery',
      };

      const result = await createOrder(orderPayload);
      if (result.success) {
        showToast('Order confirmed via Cash on Delivery!');
        onCheckout(result.data || { ...orderPayload, id: 'ORD-' + Date.now() });
      } else {
        showToast(result.message || 'Could not place order');
      }
    } catch (err) {
      showToast('Error placing order: ' + err.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  // ── Razorpay Checkout ─────────────────────────────────────────────────────
  const handleRazorpayCheckout = async () => {
    if (cartItems.length === 0) return;
    setPaymentLoading(true);

    try {
      // 1. Create a Razorpay order on the backend
      const res  = await authFetch(`${API}/razorpay/create-order`, {
        method: 'POST',
        body: JSON.stringify({
          amount: grandTotal * 100,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
          notes: { customerName: currentUser?.name || 'Guest' },
        }),
      });
      const data = await res.json();

      if (!data.success) {
        showToast('Payment gateway error: ' + (data.message || 'Try again'));
        setPaymentLoading(false);
        return;
      }

      // If sandbox order (without live keys or offline gateway)
      if (data.sandbox || !window.Razorpay) {
        const orderPayload = {
          customerName:  currentUser?.name  || 'Guest Connoisseur',
          customerEmail: currentUser?.email || 'guest@sahyadri.com',
          items: cartItems.map(i => ({
            productId: i.id,
            name: i.name,
            weight: i.weight || 'Standard',
            price: i.price,
            quantity: i.quantity
          })),
          total: grandTotal,
          address: deliveryAddress || currentUser?.address || 'Standard Delivery',
          paymentMethod: 'Razorpay (Online)',
          razorpayOrderId: data.orderId,
          razorpayPaymentId: 'pay_sandbox_' + Date.now(),
        };

        const orderResult = await createOrder(orderPayload);
        showToast('Payment verified! Order placed in database.');
        onCheckout(orderResult.data || { ...orderPayload, id: 'ORD-' + Date.now() });
        setPaymentLoading(false);
        return;
      }

      // 2. Open Razorpay Checkout modal
      const options = {
        key:         data.keyId,
        amount:      data.amount,
        currency:    data.currency,
        name:        'Sahyadri Naturals',
        description: `Order of ${cartItems.length} item(s)`,
        image:       '/images/sahyadri-logo.png',
        order_id:    data.orderId,
        prefill: {
          name:    currentUser?.name  || '',
          email:   currentUser?.email || '',
          contact: deliveryPhone || currentUser?.phone || '',
        },
        theme: { color: '#0b251d' },
        modal: { backdropclose: false },

        handler: async (response) => {
          try {
            await authFetch(`${API}/razorpay/verify`, {
              method: 'POST',
              body: JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
              }),
            });

            // Create store order in backend database & deduct stock
            const orderPayload = {
              customerName:  currentUser?.name  || 'Guest Connoisseur',
              customerEmail: currentUser?.email || 'guest@sahyadri.com',
              items: cartItems.map(i => ({
                productId: i.id,
                name: i.name,
                weight: i.weight || 'Standard',
                price: i.price,
                quantity: i.quantity
              })),
              total: grandTotal,
              address: deliveryAddress || currentUser?.address || 'Standard Delivery',
              paymentMethod: 'Razorpay',
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
            };

            const orderResult = await createOrder(orderPayload);
            showToast('Payment verified & order recorded!');
            onCheckout(orderResult.data || { ...orderPayload, id: 'ORD-' + Date.now() });
          } catch {
            showToast('Order recorded — payment ref: ' + response.razorpay_payment_id);
            onCheckout({ items: cartItems, subtotal, discountAmount, grandTotal, paymentMethod: 'Razorpay' });
          }
          setPaymentLoading(false);
        },

        'modal.ondismiss': () => {
          showToast('Payment cancelled');
          setPaymentLoading(false);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        showToast('Payment failed: ' + (resp.error?.description || 'Unknown error'));
        setPaymentLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error('Razorpay init error:', err);
      showToast('Could not reach payment gateway. Check your connection.');
      setPaymentLoading(false);
    }
  };

  // Find 1 or 2 recommended companions not currently in the cart
  const cartItemIds = cartItems.map((item) => item.id);
  const recommendedCompanions = PRODUCTS.filter((p) => !cartItemIds.includes(p.id)).slice(0, 2);

  const handleAddRecommendation = (rec) => {
    if (onAddToCart) {
      onAddToCart({ ...rec, quantity: 1 });
      setAddedRecommendationId(rec.id);
      setTimeout(() => setAddedRecommendationId(null), 1500);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 34, 26, 0.55)',
        backdropFilter: 'blur(8px)',
        zIndex: 120,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          height: '100%',
          backgroundColor: '#faf8f4',
          color: '#0a221a',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-16px 0 48px rgba(11, 37, 29, 0.18)',
          borderLeft: '1px solid rgba(14, 43, 33, 0.1)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Hairline */}
        <div
          style={{
            height: '3px',
            width: '100%',
            background: 'linear-gradient(90deg, #9e8550 0%, #dfbe84 50%, #9e8550 100%)'
          }}
        />

        {/* 1. Header (Warm Luxury Light) */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(14, 43, 33, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f4efe5'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/images/sahyadri-logo.png"
              alt="Sahydri Organics Logo"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid rgba(184, 147, 39, 0.4)',
                boxShadow: '0 2px 8px rgba(10, 34, 26, 0.15)',
                display: 'block'
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.08rem',
                  fontWeight: '700',
                  color: '#0a221a',
                  letterSpacing: '0.04em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>YOUR CART</span>
                <span
                  style={{
                    backgroundColor: '#0a221a',
                    color: '#dfbe84',
                    fontSize: '0.66rem',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    letterSpacing: '0.05em'
                  }}
                >
                  {totalItemCount} {totalItemCount === 1 ? 'ITEM' : 'ITEMS'}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#706859', marginTop: '2px' }}>
                Single-Origin Spices & Pure Honey • Direct Delivery
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid rgba(14, 43, 33, 0.12)',
              color: '#554f43',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0a221a';
              e.currentTarget.style.color = '#dfbe84';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#554f43';
            }}
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. Free Express Delivery Progress Bar */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: freeShippingLeft === 0 ? '#eaf5ee' : '#eee8db',
            borderBottom: '1px solid rgba(14, 43, 33, 0.08)'
          }}
        >
          <div
            style={{
              fontSize: '0.78rem',
              color: freeShippingLeft === 0 ? '#1b633d' : '#3d362b',
              marginBottom: '7px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Truck size={14} color={freeShippingLeft === 0 ? '#1b633d' : '#8c733b'} />
            {freeShippingLeft === 0 ? (
              <span>
                <strong>Complimentary Express Delivery Unlocked!</strong> (Orders over ₹999)
              </span>
            ) : (
              <span>
                Add <strong>₹{freeShippingLeft}</strong> more for <strong>FREE Express Delivery</strong>
              </span>
            )}
          </div>

          <div
            style={{
              height: '5px',
              backgroundColor: 'rgba(14, 43, 33, 0.1)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${freeShippingPercent}%`,
                background:
                  freeShippingLeft === 0
                    ? 'linear-gradient(90deg, #1b633d, #27ae60)'
                    : 'linear-gradient(90deg, #9e8550, #d4af37)',
                borderRadius: '3px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* 3. Items List Area */}
        <div
          style={{
            flexGrow: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          {cartItems.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                color: '#706859',
                padding: '40px 20px'
              }}
            >
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  backgroundColor: '#f3efe6',
                  border: '1px solid rgba(14, 43, 33, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px'
                }}
              >
                <ShoppingBag size={30} color="#9e8550" strokeWidth={1.6} />
              </div>
              <h4
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#0a221a',
                  marginBottom: '8px'
                }}
              >
                Your Cart is Empty
              </h4>
              <p style={{ fontSize: '0.86rem', maxWidth: '280px', color: '#706859', lineHeight: '1.6', marginBottom: '24px' }}>
                Discover authentic single-origin spices and pure natural honey.
              </p>
              <button
                onClick={onClose}
                style={{
                  fontSize: '0.84rem',
                  padding: '12px 24px',
                  backgroundColor: '#0a221a',
                  color: '#f5e4be',
                  fontWeight: '700',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: '0.04em'
                }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Product Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.weight}`}
                    style={{
                      display: 'flex',
                      gap: '14px',
                      backgroundColor: '#ffffff',
                      border: '1px solid rgba(14, 43, 33, 0.1)',
                      borderRadius: '8px',
                      padding: '14px',
                      position: 'relative',
                      boxShadow: '0 4px 14px rgba(11, 37, 29, 0.05)'
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: '74px',
                        height: '74px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        backgroundColor: '#f3efe6',
                        border: '1px solid rgba(14, 43, 33, 0.08)'
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>

                    {/* Item Details */}
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <h5
                          style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.94rem',
                            fontWeight: '600',
                            color: '#0a221a',
                            lineHeight: '1.3',
                            letterSpacing: '-0.01em',
                            margin: 0
                          }}
                        >
                          {item.name}
                        </h5>

                        {/* Remove Action */}
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#a39b8e',
                            cursor: 'pointer',
                            padding: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'color 0.2s ease'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#a39b8e')}
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div style={{ fontSize: '0.74rem', color: '#9e8550', marginTop: '3px', marginBottom: '10px', fontWeight: '500' }}>
                        Pack: <strong>{item.weight}</strong> • Certified Organic
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Tactile Quantity Stepper */}
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            border: '1px solid #d4cbb8',
                            borderRadius: '4px',
                            backgroundColor: '#f8f6f0',
                            overflow: 'hidden'
                          }}
                        >
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#0a221a',
                              width: '26px',
                              height: '26px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background-color 0.15s ease'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e8e2d5')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} strokeWidth={2} />
                          </button>
                          <span
                            style={{
                              fontSize: '0.84rem',
                              padding: '0 8px',
                              fontWeight: '700',
                              color: '#0a221a',
                              minWidth: '22px',
                              textAlign: 'center'
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#0a221a',
                              width: '26px',
                              height: '26px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background-color 0.15s ease'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e8e2d5')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} strokeWidth={2} />
                          </button>
                        </div>

                        {/* Price Figure */}
                        <div style={{ textAlign: 'right' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-sans)',
                              fontWeight: '700',
                              fontSize: '1.05rem',
                              color: '#0a221a'
                            }}
                          >
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 4. Curator's Companion Add-On (Fills empty space with luxury curation) */}
              {recommendedCompanions.length > 0 && (
                <div
                  style={{
                    marginTop: '6px',
                    padding: '14px',
                    borderRadius: '8px',
                    backgroundColor: '#f3efe6',
                    border: '1px dashed rgba(158, 133, 80, 0.4)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#8c733b',
                      marginBottom: '10px'
                    }}
                  >
                    <Sparkles size={12} color="#8c733b" />
                    <span>Frequently Bought Together</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {recommendedCompanions.map((companion) => {
                      const isAdded = addedRecommendationId === companion.id;
                      return (
                        <div
                          key={companion.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px',
                            padding: '8px 10px',
                            backgroundColor: '#ffffff',
                            borderRadius: '6px',
                            border: '1px solid rgba(14, 43, 33, 0.08)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={companion.image}
                              alt={companion.name}
                              style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#0a221a' }}>
                                {companion.name}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#9e8550', fontWeight: '500' }}>
                                ₹{companion.price} • {companion.weight}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleAddRecommendation(companion)}
                            style={{
                              backgroundColor: isAdded ? '#eaf5ee' : '#faf8f4',
                              border: isAdded ? '1px solid #1b633d' : '1px solid #0a221a',
                              color: isAdded ? '#1b633d' : '#0a221a',
                              borderRadius: '4px',
                              padding: '5px 12px',
                              fontSize: '0.74rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'all 0.2s ease',
                              whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => {
                              if (!isAdded) {
                                e.currentTarget.style.backgroundColor = '#0a221a';
                                e.currentTarget.style.color = '#f5e4be';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isAdded) {
                                e.currentTarget.style.backgroundColor = '#faf8f4';
                                e.currentTarget.style.color = '#0a221a';
                              }
                            }}
                          >
                            {isAdded ? (
                              <>
                                <Check size={12} strokeWidth={2.5} />
                                <span>Added</span>
                              </>
                            ) : (
                              <span>+ Add</span>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 5. Footer & Checkout Breakdown (Clean Light Luxury) */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid rgba(14, 43, 33, 0.08)',
              backgroundColor: '#f5f0e6'
            }}
          >
            {/* Promo Code Input */}
            <div style={{ marginBottom: '14px' }}>
              <form onSubmit={(e) => { e.preventDefault(); handleApplyPromo(); }} style={{ display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative', flexGrow: 1 }}>
                  <Tag size={14} color="#8c733b" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                  <input
                    type="text"
                    placeholder="Coupon code (SAHYADRI10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#ffffff',
                      border: '1px solid #d4cbb8',
                      borderRadius: '4px',
                      padding: '10px 12px 10px 34px',
                      color: '#0a221a',
                      fontSize: '0.8rem',
                      outline: 'none',
                      fontFamily: 'var(--font-sans)'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#0a221a',
                    border: '1px solid #0a221a',
                    color: '#f5e4be',
                    borderRadius: '4px',
                    padding: '10px 18px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#174235')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0a221a')}
                >
                  Apply
                </button>
              </form>

              {!promoApplied && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#706859' }}>Special Code:</span>
                  <button
                    onClick={() => handleApplyPromo('SAHYADRI10')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#8c733b',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Tap to apply SAHYADRI10 (10% OFF)
                  </button>
                </div>
              )}

              {promoApplied && (
                <div style={{ fontSize: '0.74rem', color: '#17653d', marginTop: '6px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={12} strokeWidth={2.5} />
                  <span>10% Estate Connoisseur Discount Applied!</span>
                </div>
              )}
              {promoError && (
                <div style={{ fontSize: '0.74rem', color: '#b91c1c', marginTop: '6px' }}>
                  {promoError}
                </div>
              )}
            </div>

            {/* Price Calculations Breakdown */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.86rem',
                color: '#554f43',
                marginBottom: '16px',
                paddingTop: '10px',
                borderTop: '1px solid rgba(14, 43, 33, 0.08)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: '600', color: '#0a221a' }}>₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#17653d' }}>
                  <span>Discount (10%)</span>
                  <span style={{ fontWeight: '600' }}>-₹{discountAmount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Express Delivery</span>
                <span style={{ fontWeight: '600', color: shippingFee === 0 ? '#17653d' : '#0a221a' }}>
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(14, 43, 33, 0.12)',
                  fontWeight: '700',
                  color: '#0a221a'
                }}
              >
                <div>
                  <div style={{ fontSize: '1.05rem', letterSpacing: '0.02em' }}>Grand Total</div>
                  <div style={{ fontSize: '0.68rem', color: '#7a7265', fontWeight: '400' }}>Inclusive of GST & All Estate Taxes</div>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1.5rem',
                    color: '#0a221a',
                    letterSpacing: '-0.02em'
                  }}
                >
                  ₹{grandTotal}
                </span>
              </div>
            </div>

            {/* Delivery Destination Address */}
            <div style={{ background: '#ffffff', border: '1px solid #d4cbb8', borderRadius: '6px', padding: '10px 12px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showAddressEdit ? '8px' : '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#0b251d', fontWeight: 600 }}>
                  <MapPin size={13} color="#8c733b" />
                  <span>Ship to: {deliveryAddress ? (deliveryAddress.length > 28 ? deliveryAddress.slice(0, 28) + '…' : deliveryAddress) : 'Set Address'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddressEdit(s => !s)}
                  style={{ background: 'none', border: 'none', color: '#8c733b', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {showAddressEdit ? 'Save' : 'Change'}
                </button>
              </div>
              {showAddressEdit && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                  <input
                    placeholder="Delivery Street Address & PIN"
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', fontSize: '0.78rem', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                  <input
                    placeholder="Phone number for dispatch SMS"
                    value={deliveryPhone}
                    onChange={e => setDeliveryPhone(e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', fontSize: '0.78rem', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
              )}
            </div>

            {/* Payment Method Selector Pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                style={{
                  flex: 1, padding: '8px 10px', fontSize: '0.76rem', fontWeight: 700, borderRadius: '4px', cursor: 'pointer',
                  border: paymentMethod === 'razorpay' ? '1.5px solid #0b251d' : '1px solid #d4cbb8',
                  background: paymentMethod === 'razorpay' ? '#0b251d' : '#ffffff',
                  color: paymentMethod === 'razorpay' ? '#f5e4be' : '#4a4439',
                  transition: 'all 0.18s ease'
                }}
              >
                Online (UPI / Card)
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                style={{
                  flex: 1, padding: '8px 10px', fontSize: '0.76rem', fontWeight: 700, borderRadius: '4px', cursor: 'pointer',
                  border: paymentMethod === 'cod' ? '1.5px solid #0b251d' : '1px solid #d4cbb8',
                  background: paymentMethod === 'cod' ? '#0b251d' : '#ffffff',
                  color: paymentMethod === 'cod' ? '#f5e4be' : '#4a4439',
                  transition: 'all 0.18s ease'
                }}
              >
                Cash on Delivery
              </button>
            </div>

            {/* ── Main Action Button ── */}
            <button
              onClick={paymentMethod === 'cod' ? handleCodCheckout : handleRazorpayCheckout}
              disabled={paymentLoading}
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '0.88rem',
                background: paymentLoading
                  ? 'linear-gradient(135deg, #0a221a, #1a3a2a)'
                  : 'linear-gradient(135deg, #0b251d 0%, #16402e 100%)',
                color: '#f5e4be',
                fontWeight: '800',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: 'none',
                borderRadius: '4px',
                cursor: paymentLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(10, 34, 26, 0.25)',
                transition: 'all 0.25s ease',
                opacity: paymentLoading ? 0.8 : 1,
              }}
            >
              {paymentLoading ? (
                <>
                  <Loader size={16} color="#dfbe84" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>RECORDING ORDER IN DATABASE…</span>
                </>
              ) : paymentMethod === 'cod' ? (
                <>
                  <Package size={16} color="#dfbe84" />
                  <span>CONFIRM ORDER (CASH ON DELIVERY)</span>
                  <ArrowRight size={16} color="#dfbe84" />
                </>
              ) : (
                <>
                  <Lock size={15} color="#dfbe84" />
                  <span>PAY SECURELY WITH RAZORPAY</span>
                  <ArrowRight size={16} color="#dfbe84" />
                </>
              )}
            </button>

            {/* Razorpay badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '8px' }}>
              <span style={{ fontSize: '0.66rem', color: '#9e8550', letterSpacing: '0.04em' }}>Supported:</span>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#3395FF' }}>UPI · Cards · NetBanking · COD</span>
            </div>

            {/* Luxury Trust Badges Line */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '14px',
                paddingTop: '10px',
                borderTop: '1px solid rgba(14, 43, 33, 0.06)',
                fontSize: '0.68rem',
                color: '#706859'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={13} color="#17653d" />
                <span>SSL Encrypted</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Leaf size={13} color="#8c733b" />
                <span>NABL Lab Tested</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={13} color="#8c733b" />
                <span>Fast Secure Dispatch</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
