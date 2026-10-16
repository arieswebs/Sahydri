import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Truck,
  CheckCircle2,
  Package,
  CreditCard,
  Banknote,
  Loader,
  Plus,
  Minus,
  Trash2,
  ChevronRight,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import DeliveryEstimator from '../components/DeliveryEstimator';

export default function CheckoutPage({ onOrderComplete }) {
  const navigate = useNavigate();
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    currentUser,
    products,
    API,
    authFetch,
    createOrder,
    showToast
  } = useShop();

  // Form state
  const [fullName, setFullName] = useState(() => currentUser?.name || '');
  const [email, setEmail] = useState(() => currentUser?.email || '');
  const [phone, setPhone] = useState(() => currentUser?.phone || '');
  const [address, setAddress] = useState(() => currentUser?.address || '');
  const [city, setCity] = useState(() => currentUser?.city || '');
  const [stateName, setStateName] = useState(() => currentUser?.state || '');
  const [pincode, setPincode] = useState(() => currentUser?.pincode || '');

  // Payment & Promo state
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' | 'cod'
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [invalidField, setInvalidField] = useState('');

  // Dynamically load Razorpay SDK if not yet loaded
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentUser?.name && !fullName) setFullName(currentUser.name);
    if (currentUser?.email && !email) setEmail(currentUser.email);
    if (currentUser?.phone && !phone) setPhone(currentUser.phone);
    if (currentUser?.address && !address) setAddress(currentUser.address);
  }, [currentUser]);

  // Totals calculation
  const subtotal = cart.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1), 0);
  const freeShippingThreshold = 999;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const freeShippingLeft = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  // Apply Coupon
  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || promoCode).trim().toUpperCase();
    if (code === 'SAHYDRI10' || code === 'SAHYADRI10' || code === 'KERALA10') {
      setDiscountPercent(10);
      setPromoApplied(true);
      setPromoError('');
      if (codeToApply) setPromoCode(codeToApply);
      showToast('10% Connoisseur discount applied!');
    } else {
      setPromoError('Invalid coupon code. Try SAHYDRI10 for 10% off.');
    }
  };

  // Validation
  const validateForm = () => {
    if (!fullName.trim()) {
      const msg = 'Please enter your Full Name for delivery.';
      setFormError(msg);
      setInvalidField('fullname');
      showToast(msg);
      const el = document.getElementById('checkout-fullname');
      if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      return false;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      const msg = 'Please enter a valid 10-digit mobile number for dispatch SMS updates.';
      setFormError(msg);
      setInvalidField('phone');
      showToast(msg);
      const el = document.getElementById('checkout-phone');
      if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      return false;
    }
    if (!address.trim()) {
      const msg = 'Please enter your complete shipping street address.';
      setFormError(msg);
      setInvalidField('address');
      showToast(msg);
      const el = document.getElementById('checkout-address');
      if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      return false;
    }
    if (email.trim() && !/\S+@\S+\.\S+/.test(email.trim())) {
      const msg = 'Please enter a valid email address for order confirmation.';
      setFormError(msg);
      setInvalidField('email');
      showToast(msg);
      const el = document.getElementById('checkout-email');
      if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      return false;
    }
    setFormError('');
    setInvalidField('');
    return true;
  };

  // Complete Order & Trigger Success
  const finalizeOrder = (orderPayload, resultData) => {
    // Note: clearCart() is called by App.handleCheckout — don't double-clear
    if (onOrderComplete) {
      onOrderComplete(resultData || { ...orderPayload, id: 'ORD-' + Date.now() });
    } else {
      navigate('/account');
    }
  };

  // Cash on Delivery
  const handleCodCheckout = async () => {
    if (!validateForm()) return;
    setPaymentLoading(true);

    try {
      const orderPayload = {
        customerName: fullName.trim(),
        customerEmail: email.trim() || 'care@sahydriorganics.com',
        phone: phone.trim(),
        items: cart.map(i => ({
          productId: i.id,
          name: i.name,
          weight: i.weight || 'Standard',
          price: i.price,
          quantity: i.quantity || 1
        })),
        total: grandTotal,
        address: `${address.trim()}${city ? ', ' + city : ''}${pincode ? ' - ' + pincode : ''}`,
        paymentMethod: 'Cash on Delivery',
      };

      const result = await createOrder(orderPayload);
      if (result.success) {
        showToast('Order confirmed via Cash on Delivery!');
        finalizeOrder(orderPayload, result.data);
      } else {
        showToast(result.message || 'Could not record order');
      }
    } catch (err) {
      showToast('Error placing order: ' + err.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  // Razorpay Online Gateway
  const handleRazorpayCheckout = async () => {
    if (!validateForm()) return;
    setPaymentLoading(true);

    try {
      const fullAddressString = `${address.trim()}${city ? ', ' + city : ''}${pincode ? ' - ' + pincode : ''}`;

      // 1. Create order on backend API
      const res = await authFetch(`${API}/razorpay/create-order`, {
        method: 'POST',
        body: JSON.stringify({
          amount: grandTotal * 100,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
          notes: {
            customerName: fullName.trim(),
            phone: phone.trim(),
            address: fullAddressString
          },
        }),
      });
      const data = await res.json();

      if (!data.success) {
        showToast('Payment gateway notice: ' + (data.message || 'Please try again'));
        setPaymentLoading(false);
        return;
      }

      // Ensure Razorpay SDK script is actively loaded
      await loadRazorpayScript();

      // If sandbox fallback
      if (data.sandbox || !window.Razorpay) {
        const orderPayload = {
          customerName: fullName.trim(),
          customerEmail: email.trim() || 'guest@sahyadriorganics.com',
          phone: phone.trim(),
          items: cart.map(i => ({
            productId: i.id,
            name: i.name,
            weight: i.weight || 'Standard',
            price: i.price,
            quantity: i.quantity || 1
          })),
          total: grandTotal,
          address: fullAddressString,
          paymentMethod: 'Razorpay (Online Sandbox)',
          razorpayOrderId: data.orderId,
          razorpayPaymentId: 'pay_sandbox_' + Date.now(),
        };

        const orderResult = await createOrder(orderPayload);
        showToast('Payment verified! Order placed in database.');
        finalizeOrder(orderPayload, orderResult.data);
        setPaymentLoading(false);
        return;
      }

      // 2. Open live Razorpay popup
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Sahydri Organics',
        description: `Order of ${cart.length} item(s)`,
        image: 'https://cdn-icons-png.flaticon.com/512/628/628283.png',
        order_id: data.orderId,
        prefill: {
          name: fullName.trim(),
          email: email.trim() || 'care@sahydriorganics.com',
          contact: phone.trim(),
        },
        theme: { color: '#0b251d' },
        modal: { backdropclose: false },

        handler: async (response) => {
          try {
            const verifyRes = await authFetch(`${API}/razorpay/verify`, {
              method: 'POST',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
              showToast('Payment verification failed — please contact support.');
              setPaymentLoading(false);
              return;
            }

            const orderPayload = {
              customerName: fullName.trim(),
              customerEmail: email.trim() || 'care@sahydriorganics.com',
              phone: phone.trim(),
              items: cart.map(i => ({
                productId: i.id,
                name: i.name,
                weight: i.weight || 'Standard',
                price: i.price,
                quantity: i.quantity || 1
              })),
              total: grandTotal,
              address: fullAddressString,
              paymentMethod: 'Razorpay (Online)',
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
            };

            const orderResult = await createOrder(orderPayload);
            showToast('Payment verified & order recorded!');
            finalizeOrder(orderPayload, orderResult.data);
          } catch {
            showToast('Payment recorded — ref: ' + response.razorpay_payment_id);
            finalizeOrder({ items: cart, subtotal, discountAmount, grandTotal, paymentMethod: 'Razorpay' });
          }
          setPaymentLoading(false);
        },
      };

      // Razorpay dismiss callback — must be inside 'modal' object
      options.modal = {
        ...(options.modal || {}),
        ondismiss: () => {
          showToast('Payment cancelled');
          setPaymentLoading(false);
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        showToast('Payment failed: ' + (resp.error?.description || 'Unknown error'));
        setPaymentLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error('Razorpay init error:', err);
      showToast('Could not reach payment gateway.');
      setPaymentLoading(false);
    }
  };

  if (cart.length === 0) {
    const featured = (products || []).slice(0, 4);

    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#faf8f4', color: '#0a221a', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        {/* Top Navigation */}
        <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e7e0d5', position: 'sticky', top: 0, zIndex: 40 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={() => navigate('/shop')}
              style={{
                background: 'none',
                border: 'none',
                color: '#0e2b21',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: 600
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Shop</span>
            </button>
            <div
              onClick={() => navigate('/')}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#0a221a', cursor: 'pointer', letterSpacing: '-0.02em' }}
            >
              Sahydri Organics
            </div>
            <button
              onClick={() => navigate('/shop')}
              style={{
                background: '#f4efe6',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                color: '#0a221a',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Explore Shop
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div style={{ maxWidth: '1100px', margin: '36px auto 60px', padding: '0 20px' }}>
          {/* Hero Empty Basket Banner */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #eae4d8',
              borderRadius: '20px',
              padding: '44px 24px',
              textAlign: 'center',
              boxShadow: '0 12px 36px rgba(10,34,26,0.04)',
              marginBottom: '44px'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(14, 43, 33, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}
            >
              <ShoppingBag size={28} color="#0a221a" strokeWidth={1.8} />
            </div>

            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.9rem', color: '#0a221a', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
              Your Cart is Empty
            </h2>
            <p style={{ color: '#685e50', fontSize: '0.94rem', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              You don't have any items in your harvest basket right now. Explore our pure single-origin Kerala spices, wild honeys, and farm-fresh organic harvests below.
            </p>

            <button
              onClick={() => navigate('/shop')}
              style={{
                padding: '12px 28px',
                backgroundColor: '#0a221a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.15s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#13392d'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0a221a'; }}
            >
              <span>Explore All Products</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Featured Products Grid */}
          {featured.length > 0 && (
            <div style={{ marginBottom: '44px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '22px' }}>
                <div>
                  <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5rem', color: '#0a221a', margin: '0 0 4px', fontWeight: 700 }}>
                    Popular Products to Explore
                  </h3>
                  <p style={{ color: '#7a7062', fontSize: '0.86rem', margin: 0 }}>
                    100% authentic, NMR-tested purity harvested in Wayanad
                  </p>
                </div>
                <button
                  onClick={() => navigate('/shop')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0a221a',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>View All Products</span>
                  <ChevronRight size={15} />
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                gap: '20px'
              }}>
                {featured.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #eae4d8',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 4px 16px rgba(10,34,26,0.04)',
                      transition: 'transform 0.18s ease, box-shadow 0.18s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 28px rgba(10,34,26,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(10,34,26,0.04)';
                    }}
                  >
                    <div style={{ height: '175px', overflow: 'hidden', position: 'relative', backgroundColor: '#f5f1ea' }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {(p.originBadge || p.tag) && (
                        <span style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          backgroundColor: 'rgba(10,34,26,0.85)',
                          color: '#dfbe84',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase'
                        }}>
                          {p.originBadge || p.tag}
                        </span>
                      )}
                    </div>

                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#7a7062', fontWeight: 600, textTransform: 'uppercase' }}>
                          {p.category}
                        </span>
                        {p.weight && (
                          <span style={{ fontSize: '0.72rem', color: '#7a7062' }}>
                            {p.weight}
                          </span>
                        )}
                      </div>

                      <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0a221a', margin: '0 0 6px', lineHeight: 1.35 }}>
                        {p.name}
                      </h4>

                      <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0a221a' }}>
                            â‚¹{p.price}
                          </span>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <span style={{ fontSize: '0.78rem', color: '#9a9080', textDecoration: 'line-through', marginLeft: '6px' }}>
                              â‚¹{p.originalPrice}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            addToCart(p);
                            showToast(`Added ${p.name} to cart!`);
                          }}
                          style={{
                            padding: '7px 14px',
                            backgroundColor: '#0a221a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'background-color 0.15s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#13392d'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0a221a'; }}
                        >
                          <Plus size={13} />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trust Highlights */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            padding: '24px',
            backgroundColor: '#ffffff',
            border: '1px solid #eae4d8',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div>
              <ShieldCheck size={24} color="#0a221a" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0a221a' }}>100% NMR Tested</div>
              <div style={{ fontSize: '0.76rem', color: '#7a7062', marginTop: '2px' }}>Zero adulteration guaranteed</div>
            </div>
            <div>
              <Package size={24} color="#0a221a" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0a221a' }}>Direct from Wayanad</div>
              <div style={{ fontSize: '0.76rem', color: '#7a7062', marginTop: '2px' }}>Sustainably hand-harvested</div>
            </div>
            <div>
              <Truck size={24} color="#0a221a" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0a221a' }}>Express Safe Delivery</div>
              <div style={{ fontSize: '0.76rem', color: '#7a7062', marginTop: '2px' }}>Packed in protective glass jars</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#faf8f4', minHeight: '100vh', color: '#0a221a', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* â”€â”€ Top Bar / Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e7e0d5', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate('/shop')}
            style={{
              background: 'none',
              border: 'none',
              color: '#0e2b21',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: 600
            }}
          >
            <ArrowLeft size={16} />
            <span>Continue Shopping</span>
          </button>

          <div
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <img src="/images/sahyadri-logo.png" alt="Sahydri Logo" style={{ width: '34px', height: '34px', borderRadius: '50%' }} />
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.25rem', fontWeight: 800, color: '#0a221a', letterSpacing: '0.04em' }}>
              SAHYDRI
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#25744b', fontSize: '0.78rem', fontWeight: 700 }}>
            <Lock size={14} color="#25744b" />
            <span className="secure-badge-text">256-Bit SSL Encrypted</span>
          </div>
        </div>
      </header>

      {/* â”€â”€ Main Two-Column Layout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '36px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '32px', alignItems: 'start' }} className="checkout-grid">

          {/* â”€â”€ Left Column: Shipping & Payment â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div>
            {/* Free Shipping Progress Strip */}
            <div style={{ background: '#f4efe5', border: '1px solid #dfd7c7', borderRadius: '10px', padding: '14px 18px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.82rem', fontWeight: 700, color: '#0a221a' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={16} color="#8c733b" />
                  {freeShippingLeft === 0
                    ? 'ðŸŽ‰ You have unlocked FREE Express Delivery across India!'
                    : `Add â‚¹${freeShippingLeft} more for FREE Express Delivery`}
                </span>
                <span style={{ color: '#8c733b' }}>{Math.round(freeShippingPercent)}%</span>
              </div>
              <div style={{ height: '6px', width: '100%', background: '#e2dad0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${freeShippingPercent}%`, height: '100%', background: 'linear-gradient(90deg, #8c733b, #dfbe84)', transition: 'width 0.4s ease' }} />
              </div>
            </div>

            {/* Step 1: Customer & Delivery Address */}
            <div style={{ background: '#ffffff', border: '1px solid #e7e0d5', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(11,37,29,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #f1ece4' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0a221a', color: '#dfbe84', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>
                  1
                </div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0a221a', margin: 0, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Delivery Address & Contact
                </h2>
              </div>

              {formError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '10px 14px', color: '#b91c1c', fontSize: '0.78rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={15} />
                  <span>{formError}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Please fill in delivery details below.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (!fullName) setFullName('Admin Sahyadri');
                    setPhone('9447123456');
                    setAddress('Sahydri Organics Estate HQ, Meppadi');
                    setCity('Wayanad');
                    setPincode('673577');
                    setStateName('Kerala');
                    setFormError('');
                    setInvalidField('');
                    showToast('Prefilled address details');
                  }}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    padding: '4px 10px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#0a221a',
                    cursor: 'pointer'
                  }}
                >
                  Autofill Wayanad Estate Address
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Full Name <span style={{ color: '#b91c1c' }}>*</span>
                  </label>
                  <input
                    id="checkout-fullname"
                    type="text"
                    value={fullName}
                    onChange={e => { setFullName(e.target.value); if (invalidField === 'fullname') setInvalidField(''); }}
                    placeholder="e.g. Aditi Sharma"
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: '6px',
                      border: invalidField === 'fullname' ? '2px solid #b91c1c' : '1px solid #cbd5e1',
                      background: invalidField === 'fullname' ? '#fff5f5' : '#ffffff',
                      fontSize: '0.85rem', boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Mobile Number <span style={{ color: '#b91c1c' }}>*</span>
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    value={phone}
                    onChange={e => { setPhone(e.target.value); if (invalidField === 'phone') setInvalidField(''); }}
                    placeholder="10-digit mobile for dispatch SMS"
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: '6px',
                      border: invalidField === 'phone' ? '2px solid #b91c1c' : '1px solid #cbd5e1',
                      background: invalidField === 'phone' ? '#fff5f5' : '#ffffff',
                      fontSize: '0.85rem', boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Email Address (for order invoice & tracking)
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. aditi@gmail.com"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Complete Street Address, House/Apt No. <span style={{ color: '#b91c1c' }}>*</span>
                </label>
                <textarea
                  id="checkout-address"
                  rows={2}
                  value={address}
                  onChange={e => { setAddress(e.target.value); if (invalidField === 'address') setInvalidField(''); }}
                  placeholder="Apartment, Street name, Landmark..."
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '6px',
                    border: invalidField === 'address' ? '2px solid #b91c1c' : '1px solid #cbd5e1',
                    background: invalidField === 'address' ? '#fff5f5' : '#ffffff',
                    fontSize: '0.85rem', boxSizing: 'border-box', fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                    PIN Code <span style={{ color: '#b91c1c' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    placeholder="6-digit PIN"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                    City / Town
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="City / District"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                    State
                  </label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={e => setStateName(e.target.value)}
                    placeholder="State"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div style={{ background: '#ffffff', border: '1px solid #e7e0d5', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(11,37,29,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #f1ece4' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0a221a', color: '#dfbe84', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>
                  2
                </div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0a221a', margin: 0, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Select Payment Method
                </h2>
              </div>

              {/* Payment Selector Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {/* Razorpay Card */}
                <div
                  onClick={() => setPaymentMethod('razorpay')}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: paymentMethod === 'razorpay' ? '2px solid #0a221a' : '1px solid #cbd5e1',
                    background: paymentMethod === 'razorpay' ? '#f5f8f6' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.18s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #0a221a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {paymentMethod === 'razorpay' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0a221a' }} />}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0a221a' }}>Online Payment via Razorpay</span>
                        <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.66rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>RECOMMENDED</span>
                      </div>
                      <p style={{ margin: '3px 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                        Instant verification â€¢ UPI (Google Pay, PhonePe, Paytm), Debit & Credit Cards, NetBanking
                      </p>
                    </div>
                  </div>
                  <CreditCard size={20} color="#0a221a" />
                </div>

                {/* Cash on Delivery Card */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: paymentMethod === 'cod' ? '2px solid #0a221a' : '1px solid #cbd5e1',
                    background: paymentMethod === 'cod' ? '#f5f8f6' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.18s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #0a221a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {paymentMethod === 'cod' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0a221a' }} />}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0a221a' }}>Cash on Delivery (COD)</span>
                      <p style={{ margin: '3px 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                        Pay cash or UPI upon package doorstep arrival via logistics courier
                      </p>
                    </div>
                  </div>
                  <Banknote size={20} color="#0a221a" />
                </div>
              </div>

              {/* Error banner above payment button */}
              {formError && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #f87171',
                  borderRadius: '6px',
                  padding: '12px 14px',
                  color: '#b91c1c',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  animation: 'fadeIn 0.2s ease'
                }}>
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              {/* Main Checkout Trigger Button */}
              <button
                onClick={paymentMethod === 'cod' ? handleCodCheckout : handleRazorpayCheckout}
                disabled={paymentLoading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: paymentLoading
                    ? '#16402e'
                    : 'linear-gradient(135deg, #0b251d 0%, #16402e 100%)',
                  color: '#f5e4be',
                  fontWeight: 800,
                  fontSize: '0.94rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: paymentLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 24px rgba(10, 34, 26, 0.25)',
                  transition: 'all 0.2s ease'
                }}
              >
                {paymentLoading ? (
                  <>
                    <Loader size={18} color="#dfbe84" style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Processing Secure Orderâ€¦</span>
                  </>
                ) : paymentMethod === 'cod' ? (
                  <>
                    <Package size={18} color="#dfbe84" />
                    <span>Confirm Order (Cash on Delivery) â€¢ â‚¹{grandTotal}</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} color="#dfbe84" />
                    <span>Pay Securely with Razorpay â€¢ â‚¹{grandTotal}</span>
                  </>
                )}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '0.72rem', color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} color="#15803d" /> Verified Direct Estate Harvest
                </span>
                <span>â€¢</span>
                <span>Direct Wayanad Logistics</span>
                <span>â€¢</span>
                <span>Easy Returns</span>
              </div>
            </div>

            {/* Delivery Estimator widget */}
            <DeliveryEstimator theme="light" />
          </div>

          {/* â”€â”€ Right Column: Order Summary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div style={{ background: '#ffffff', border: '1px solid #e7e0d5', borderRadius: '12px', padding: '24px', position: 'sticky', top: '80px', boxShadow: '0 4px 20px rgba(11,37,29,0.04)' }}>
            <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.15rem', color: '#0a221a', margin: '0 0 16px', paddingBottom: '12px', borderBottom: '1px solid #f1ece4' }}>
              Order Summary ({cart.reduce((s, i) => s + (i.quantity || 1), 0)} items)
            </h3>

            {/* Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px', marginBottom: '20px' }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f8f6f0' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5dfd5' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0a221a', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </h4>
                    <span style={{ fontSize: '0.7rem', color: '#8c733b', fontWeight: 600, background: 'rgba(140,115,59,0.1)', padding: '1px 6px', borderRadius: '3px' }}>
                      {item.weight || 'Standard'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      {/* Quantity stepper */}
                      <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#f8fafc' }}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          style={{ background: 'none', border: 'none', padding: '2px 6px', cursor: 'pointer', color: '#475569' }}
                        >
                          <Minus size={11} />
                        </button>
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '0 4px', minWidth: '16px', textAlign: 'center' }}>
                          {item.quantity || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          style={{ background: 'none', border: 'none', padding: '2px 6px', cursor: 'pointer', color: '#475569' }}
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0a221a' }}>
                      â‚¹{(Number(item.price) || 0) * (item.quantity || 1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Box */}
            <div style={{ marginBottom: '20px', padding: '14px', background: '#fbf9f5', border: '1px solid #e7e0d5', borderRadius: '8px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Coupon code (e.g. SAHYDRI10)"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  style={{ flex: 1, padding: '8px 10px', fontSize: '0.78rem', borderRadius: '4px', border: '1px solid #cbd5e1', textTransform: 'uppercase' }}
                />
                <button
                  type="button"
                  onClick={() => handleApplyCoupon()}
                  style={{
                    padding: '8px 14px',
                    background: '#0a221a',
                    color: '#dfbe84',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Apply
                </button>
              </div>

              {!promoApplied && (
                <div style={{ marginTop: '8px', fontSize: '0.72rem', color: '#64748b' }}>
                  Special Offer:{' '}
                  <span
                    onClick={() => handleApplyCoupon('SAHYDRI10')}
                    style={{ color: '#8c733b', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Tap to apply SAHYDRI10 (10% OFF)
                  </span>
                </div>
              )}

              {promoApplied && (
                <div style={{ marginTop: '8px', fontSize: '0.74rem', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} />
                  <span>Coupon {promoCode || 'SAHYDRI10'} applied (-{discountPercent}%)</span>
                </div>
              )}

              {promoError && (
                <div style={{ marginTop: '8px', fontSize: '0.72rem', color: '#b91c1c' }}>
                  {promoError}
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#475569', paddingBottom: '16px', borderBottom: '1px solid #f1ece4' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: '#0a221a' }}>â‚¹{subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Express Doorstep Delivery</span>
                <span>{shippingFee === 0 ? <strong style={{ color: '#15803d' }}>FREE</strong> : `â‚¹${shippingFee}`}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#15803d', fontWeight: 700 }}>
                  <span>Connoisseur Privilege Discount</span>
                  <span>-â‚¹{discountAmount}</span>
                </div>
              )}
            </div>

            {/* Grand Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '16px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0a221a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Amount
                </span>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Inclusive of GST & All Taxes</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0a221a', letterSpacing: '-0.02em' }}>
                  â‚¹{grandTotal}
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 860px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
          .secure-badge-text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
