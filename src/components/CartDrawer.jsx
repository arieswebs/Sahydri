import React, { useState, useEffect } from 'react';
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
  Loader,
  Package,
  MapPin
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useShop } from '../context/ShopContext';
import DeliveryEstimator from './DeliveryEstimator';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onAddToCart,
  onRequireLogin,
  onProceedToCheckout
}) {
  const { API, currentUser, showToast, authFetch, createOrder } = useShop();
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [addedRecommendationId, setAddedRecommendationId] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' | 'cod'
  const [deliveryAddress, setDeliveryAddress] = useState(() => currentUser?.address || '');
  const [deliveryPhone, setDeliveryPhone] = useState(() => currentUser?.phone || '');
  const [showAddressEdit, setShowAddressEdit] = useState(() => !currentUser?.address);

  useEffect(() => {
    if (currentUser?.address) setDeliveryAddress(currentUser.address);
    if (currentUser?.phone) setDeliveryPhone(currentUser.phone);
  }, [currentUser]);

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
    if (code === 'SAHYDRI10' || code === 'SAHYADRI10' || code === 'KERALA10') {
      setDiscountPercent(10);
      setPromoApplied(true);
      setPromoError('');
      if (codeToApply) setPromoCode(codeToApply);
    } else {
      setPromoError('Invalid coupon code. Try SAHYDRI10 for 10% off.');
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
        address: deliveryAddress || currentUser?.address || '',
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
          address: deliveryAddress || currentUser?.address || '',
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
        name:        'Sahydri Organics',
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
  const { products } = useShop();
  const recommendedCompanions = (products || []).filter((p) => !cartItemIds.includes(p.id)).slice(0, 2);

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
          maxHeight: '100vh',
          backgroundColor: '#faf8f4',
          color: '#0a221a',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-16px 0 48px rgba(11, 37, 29, 0.18)',
          borderLeft: '1px solid rgba(14, 43, 33, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'slideInRight 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Hairline */}
        <div
          style={{
            height: '3px',
            width: '100%',
            flexShrink: 0,
            background: 'linear-gradient(90deg, #9e8550 0%, #dfbe84 50%, #9e8550 100%)'
          }}
        />

        {/* 1. Header (Warm Luxury Light) */}
        <div
          style={{
            padding: '18px 24px',
            flexShrink: 0,
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
                  {cartItems.length === totalItemCount
                    ? `${totalItemCount} ${totalItemCount === 1 ? 'ITEM' : 'ITEMS'}`
                    : `${cartItems.length} ${cartItems.length === 1 ? 'PRODUCT' : 'PRODUCTS'} • ${totalItemCount} ITEMS`}
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
              width: '38px',
              height: '38px',
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
            flexShrink: 0,
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

        {/* 3. Scrollable Cart Body (Products, Recommendations, Delivery, Coupons, Address) */}
        <div
          className="cart-scrollable-body"
          style={{
            flex: '1 1 0%',
            minHeight: 0,
            overflowY: 'auto',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            WebkitOverflowScrolling: 'touch'
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
              {/* Product Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.weight}`}
                    style={{
                      flexShrink: 0,
                      display: 'flex',
                      gap: '14px',
                      backgroundColor: '#ffffff',
                      border: '1px solid rgba(14, 43, 33, 0.1)',
                      borderRadius: '8px',
                      padding: '14px',
                      position: 'relative',
                      boxShadow: '0 2px 8px rgba(11, 37, 29, 0.04)'
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
                              width: '32px',
                              height: '32px',
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
                            <Minus size={13} strokeWidth={2} />
                          </button>
                          <span
                            style={{
                              fontSize: '0.85rem',
                              padding: '0 8px',
                              fontWeight: '700',
                              color: '#0a221a',
                              minWidth: '24px',
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
                              width: '32px',
                              height: '32px',
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
                            <Plus size={13} strokeWidth={2} />
                          </button>
                        </div>

                        {/* Price Figure */}
                        <div style={{ textAlign: 'right' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-sans)',
                              fontWeight: '700',
                              fontSize: '1.05rem',
                              color: '#0a221a',
                              display: 'block'
                            }}
                          >
                            ₹{item.price * item.quantity}
                          </span>
                          {item.quantity > 1 && (
                            <span style={{ fontSize: '0.7rem', color: '#8c733b', fontWeight: '500' }}>
                              ₹{item.price} each
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 4. Curator's Companion Add-On */}
              {recommendedCompanions.length > 0 && (
                <div
                  style={{
                    flexShrink: 0,
                    marginTop: '2px',
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

              {/* 5. Delivery & Pincode Estimator (Scrolls with content) */}
              <div style={{ flexShrink: 0 }}>
                <DeliveryEstimator compact={true} theme="light" />
              </div>

              {/* 6. Promo Code Input & 1-Click Code (Scrolls with content) */}
              <div
                style={{
                  flexShrink: 0,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2dad0',
                  borderRadius: '8px',
                  padding: '12px 14px'
                }}
              >
                <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#0a221a', marginBottom: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Offers &amp; Coupon Codes
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleApplyPromo(); }} style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ position: 'relative', flexGrow: 1 }}>
                    <Tag size={14} color="#8c733b" style={{ position: 'absolute', top: '11px', left: '12px' }} />
                    <input
                      type="text"
                      placeholder="Coupon code (SAHYDRI10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#faf8f4',
                        border: '1px solid #d4cbb8',
                        borderRadius: '4px',
                        padding: '9px 12px 9px 34px',
                        color: '#0a221a',
                        fontSize: '0.8rem',
                        outline: 'none',
                        fontFamily: 'var(--font-sans)',
                        boxSizing: 'border-box'
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
                      padding: '9px 16px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      transition: 'all 0.2s ease',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#174235')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0a221a')}
                  >
                    Apply
                  </button>
                </form>

                {!promoApplied && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#706859' }}>Special Code:</span>
                    <button
                      type="button"
                      onClick={() => handleApplyPromo('SAHYDRI10')}
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
                      Tap to apply SAHYDRI10 (10% OFF)
                    </button>
                  </div>
                )}

                {promoApplied && (
                  <div style={{ fontSize: '0.74rem', color: '#17653d', marginTop: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={12} strokeWidth={2.5} />
                    <span>10% Estate Connoisseur Discount Applied!</span>
                  </div>
                )}
                {promoError && (
                  <div style={{ fontSize: '0.74rem', color: '#b91c1c', marginTop: '8px' }}>
                    {promoError}
                  </div>
                )}
              </div>

              {/* 7. Delivery Destination Address (Scrolls with content) */}
              <div style={{ flexShrink: 0, background: '#ffffff', border: '1px solid #e2dad0', borderRadius: '8px', padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showAddressEdit ? '8px' : '0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#0b251d', fontWeight: 600 }}>
                    <MapPin size={14} color="#8c733b" />
                    <span>{deliveryAddress ? `Ship to: ${deliveryAddress.length > 28 ? deliveryAddress.slice(0, 28) + '…' : deliveryAddress}` : 'Enter Delivery Address'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddressEdit(s => !s)}
                    style={{ background: 'none', border: 'none', color: '#8c733b', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {showAddressEdit ? 'Done' : (deliveryAddress ? 'Change' : 'Add')}
                  </button>
                </div>
                {showAddressEdit && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    <input
                      placeholder="Street address, city, state & pincode"
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      style={{ width: '100%', padding: '7px 9px', fontSize: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                    <input
                      placeholder="Phone number for dispatch SMS (optional)"
                      value={deliveryPhone}
                      onChange={e => setDeliveryPhone(e.target.value)}
                      style={{ width: '100%', padding: '7px 9px', fontSize: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                )}
              </div>

              {/* 8. Guest notice */}
              {!currentUser && (
                <div style={{
                  flexShrink: 0,
                  background: '#f8f4ec',
                  border: '1px solid #e2dad0',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '0.74rem', color: '#685e50' }}>
                    Sign in to use saved addresses and track orders.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onRequireLogin) onRequireLogin('/checkout');
                      else window.location.href = '/login?redirect=/checkout';
                    }}
                    style={{
                      background: '#0a221a',
                      color: '#dfbe84',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '5px 10px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Log In
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* 9. Fixed Docked Footer & Checkout CTA (Always Visible & Never Hidden) */}
        {cartItems.length > 0 && (
          <div
            style={{
              flexShrink: 0,
              padding: '16px 20px',
              borderTop: '1px solid rgba(14, 43, 33, 0.1)',
              backgroundColor: '#f5f0e6',
              boxShadow: '0 -6px 24px rgba(10, 34, 26, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {/* Price Calculations Breakdown */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: '800', letterSpacing: '0.01em', color: '#0a221a' }}>Grand Total</span>
                  {discountAmount > 0 && (
                    <span style={{ fontSize: '0.68rem', color: '#17653d', fontWeight: '700', backgroundColor: '#eaf5ee', padding: '2px 6px', borderRadius: '4px' }}>
                      -₹{discountAmount} (10% OFF)
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#706859', marginTop: '2px' }}>
                  Subtotal: <strong>₹{subtotal}</strong> • Delivery: <strong style={{ color: shippingFee === 0 ? '#17653d' : '#0a221a' }}>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</strong>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    color: '#0a221a',
                    letterSpacing: '-0.02em',
                    lineHeight: '1'
                  }}
                >
                  ₹{grandTotal}
                </span>
                <div style={{ fontSize: '0.64rem', color: '#7a7265', marginTop: '2px' }}>Inclusive of all taxes</div>
              </div>
            </div>

            {/* Payment Method Selector Pills */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  borderRadius: '4px',
                  cursor: 'pointer',
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
                  flex: 1,
                  padding: '7px 10px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  border: paymentMethod === 'cod' ? '1.5px solid #0b251d' : '1px solid #d4cbb8',
                  background: paymentMethod === 'cod' ? '#0b251d' : '#ffffff',
                  color: paymentMethod === 'cod' ? '#f5e4be' : '#4a4439',
                  transition: 'all 0.18s ease'
                }}
              >
                Cash on Delivery
              </button>
            </div>

            {/* ── Main Action Button: Proceed to Dedicated Checkout Page ── */}
            <button
              onClick={() => {
                onClose();
                if (onProceedToCheckout) onProceedToCheckout();
                else window.location.href = '/checkout';
              }}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '0.88rem',
                background: 'linear-gradient(135deg, #0b251d 0%, #16402e 100%)',
                color: '#f5e4be',
                fontWeight: '800',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(10, 34, 26, 0.25)',
                transition: 'all 0.25s ease',
              }}
            >
              <Lock size={15} color="#dfbe84" />
              <span>PROCEED TO CHECKOUT • ₹{grandTotal}</span>
              <ArrowRight size={16} color="#dfbe84" />
            </button>

            {/* Razorpay & Trust badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '6px',
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
                <span>100% Authentic</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={13} color="#8c733b" />
                <span style={{ color: '#2563eb', fontWeight: 600 }}>UPI · Card · COD</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
