import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  CheckCircle,
  Truck,
  Leaf,
  Wind,
  Check,
  Share2,
  Calendar,
  Flame
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import Footer from './Footer';
import DeliveryEstimator from './DeliveryEstimator';

export default function ProductDetailPage({
  product,
  onBack,
  onAddToCart,
  onBuyNow,
  wishlist,
  onToggleWishlist,
  onSelectProduct
}) {
  const [selectedWeight, setSelectedWeight] = useState(product.weight || '100g');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('terroir');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Dynamic weight options & price calculations tailored to product type
  const getPackOptions = (p) => {
    if (p.category === 'oils') {
      return [
        { label: '500ml Bottle', multiplier: 0.55 },
        { label: '1 L Glass Bottle', multiplier: 1.0 },
        { label: '2 L Reserve Canister', multiplier: 1.9 }
      ];
    }
    if (p.category === 'honey') {
      if (p.weight === '1kg') {
        return [
          { label: '500g Glass Jar', multiplier: 0.55 },
          { label: '1kg Heritage Pot', multiplier: 1.0 },
          { label: '2kg Estate Reserve', multiplier: 1.9 }
        ];
      }
      return [
        { label: '250g Artisanal Jar', multiplier: 0.55 },
        { label: '500g Raw Honey Jar', multiplier: 1.0 },
        { label: '1kg Heritage Crock', multiplier: 1.9 }
      ];
    }
    if (p.id === 'cardamom-pepper-combo') {
      return [
        { label: 'Twin Gift Set', multiplier: 1.0 },
        { label: 'Grand Heritage Gift Box', multiplier: 1.8 }
      ];
    }
    if (p.weight === '1kg') {
      return [
        { label: '500g Pouch', multiplier: 0.55 },
        { label: '1kg Master Pack', multiplier: 1.0 },
        { label: '2kg Bulk Sack', multiplier: 1.9 }
      ];
    }
    if (p.weight === '250g') {
      return [
        { label: '100g Trial Pouch', multiplier: 0.45 },
        { label: '250g Heritage Tin', multiplier: 1.0 },
        { label: '500g Reserve Pack', multiplier: 1.9 }
      ];
    }
    // Default whole spices & stone ground powders
    return [
      { label: '100g Aroma-Lock Pouch', multiplier: 1.0 },
      { label: '250g Heritage Tin', multiplier: 2.25 },
      { label: '500g Estate Reserve Pack', multiplier: 4.2 }
    ];
  };

  const weightOptions = getPackOptions(product);

  // Scroll to top & set initial weight when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const packs = getPackOptions(product);
    const defaultPack = packs.find((o) => o.multiplier === 1.0) || packs[0];
    setSelectedWeight(defaultPack.label);
    setQuantity(1);
    setSelectedImageIdx(0);
  }, [product.id]);

  const currentMultiplier = weightOptions.find((w) => w.label === selectedWeight)?.multiplier || 1;
  const currentPrice = Math.round(product.price * currentMultiplier);
  const currentOriginalPrice = Math.round(product.originalPrice * currentMultiplier);
  const discountAmount = currentOriginalPrice - currentPrice;
  const isWishlisted = wishlist.includes(product.id);

  // Gallery images (main product, terroir, whole harvest, NMR certificate)
  const galleryImages = [
    { src: product.image, label: 'Estate Product' },
    { src: '/images/products/cardamom_sahydri.jpg', label: 'Whole Pods' },
    { src: '/images/estate.jpg', label: 'Rainforest Canopy' },
    { src: '/images/hero.jpg', label: 'Wayanad Mountain' }
  ];

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      weight: selectedWeight,
      price: currentPrice,
      quantity
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow({
        ...product,
        weight: selectedWeight,
        price: currentPrice,
        quantity
      });
    } else {
      handleAddToCart();
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Companion products (other products excluding the current one)
  const companionProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="product-page-root">
      {/* 1. Breadcrumbs & Quick Back Navigation */}
      <div className="product-breadcrumb-bar">
        <div className="container">
          <div className="breadcrumb-inner">
            <button onClick={onBack} className="back-nav-btn">
              <ArrowLeft size={16} />
              <span>Back to Collection</span>
            </button>

            <div className="breadcrumb-path">
              <span onClick={onBack} className="crumb-link">Home</span>
              <span className="crumb-sep">/</span>
              <span onClick={onBack} className="crumb-link">{product.category === 'honey' ? 'Wild Honey' : 'Single Estate Spices'}</span>
              <span className="crumb-sep">/</span>
              <span className="crumb-current">{product.name}</span>
            </div>

            <button onClick={handleShare} className="share-btn" title="Copy Product Link">
              <Share2 size={14} color="#dfbe84" />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Product Showcase Split */}
      <div className="container product-main-container">
        <div className="product-split-grid">
          {/* Left: Interactive Media Gallery */}
          <div className="product-gallery-col">
            <div className="main-image-frame">
              <img
                src={galleryImages[selectedImageIdx].src}
                alt={product.name}
                className="main-display-image"
              />

              {/* Tag Overlays */}
              <div className="image-origin-badge">
                <MapPin size={12} color="#dfbe84" />
                <span>{product.elevation} • Western Ghats</span>
              </div>

              <div className="image-purity-pill">
                <ShieldCheck size={12} color="#74db93" />
                <span>100% Bio-Dynamic</span>
              </div>

              {/* Wishlist Heart */}
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`gallery-wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                aria-label="Wishlist"
              >
                <Heart size={18} fill={isWishlisted ? '#d4af37' : 'none'} color={isWishlisted ? '#d4af37' : '#2b261e'} />
              </button>
            </div>

            {/* Thumbnail Row */}
            <div className="gallery-thumbnails-row">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`thumb-btn ${selectedImageIdx === idx ? 'thumb-active' : ''}`}
                >
                  <img src={img.src} alt={img.label} className="thumb-img" />
                </button>
              ))}
            </div>

          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="product-details-col">
            {/* Origin & Category Tag */}
            <div className="product-top-badge">
              <Sparkles size={12} color="#dfbe84" />
              <span>SINGLE ESTATE • {product.originBadge}</span>
            </div>

            {/* Headline */}
            <h1 className="pdp-title">{product.name}</h1>
            <p className="pdp-subname">{product.subname}</p>

            {/* Reviews Rating Strip */}
            <div className="pdp-rating-strip">
              <div className="stars-cluster">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#d4af37" color="#d4af37" />
                ))}
              </div>
              <span className="rating-num">{product.rating}</span>
              <span className="rating-count">({product.reviewsCount} verified connoisseur reviews)</span>
              <span className="verified-pill">
                <CheckCircle size={12} color="#21744b" />
                <span>Batch #SH-2026-B8</span>
              </span>
            </div>

            {/* Price Box */}
            <div className="pdp-price-box">
              <div className="price-main-row">
                <span className="price-currency">₹</span>
                <span className="price-figure">{currentPrice}</span>
                <span className="price-original">₹{currentOriginalPrice}</span>
                <span className="discount-tag">Save ₹{discountAmount}</span>
              </div>
              <p className="price-legal-note">
                Inclusive of all taxes. Free express delivery across India on orders over ₹499.
              </p>
            </div>

            {/* Short Narrative */}
            <p className="pdp-lead-description">
              {product.description}
            </p>

            {/* Weight Pack Size Selector */}
            <div className="pdp-selector-group">
              <div className="selector-label-row">
                <span className="group-label">Select Pack Size:</span>
                <span className="selected-weight-display">{selectedWeight}</span>
              </div>
              <div className="weights-buttons-row">
                {weightOptions.map((opt, wIdx) => {
                  const isSelected = selectedWeight === opt.label;
                  return (
                    <button
                      key={wIdx}
                      onClick={() => setSelectedWeight(opt.label)}
                      className={`weight-option-btn ${isSelected ? 'weight-selected' : ''}`}
                    >
                      <span className="weight-opt-name">{opt.label}</span>
                      <span className="weight-opt-price">₹{Math.round(product.price * opt.multiplier)}</span>
                      {isSelected && <Check size={12} color="#dfbe84" strokeWidth={2.5} className="weight-check-dot" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Controller & Add to Cart Action Row */}
            <div className="pdp-actions-container">
              <div className="quantity-controller">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="qty-btn"
                  title="Decrease Quantity"
                  aria-label="Decrease Quantity"
                >
                  –
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="qty-btn"
                  title="Increase Quantity"
                  aria-label="Increase Quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`btn-gold pdp-add-cart-btn ${addedAnimation ? 'cart-added-state' : ''}`}
              >
                {addedAnimation ? (
                  <>
                    <Check size={16} color="#0c261e" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Add to Cart • ₹{currentPrice * quantity}</span>
                  </>
                )}
              </button>

              <button onClick={handleBuyNow} className="pdp-buy-now-btn">
                <span>Buy Now</span>
              </button>
            </div>

            {/* Delivery Date & Indian Pincode Checker */}
            <DeliveryEstimator theme="light" />

            {/* Quick Guarantees Box (Direct Dispatch, NMR Purity, Fair Trade) placed right after Buy Now */}
            <div className="pdp-guarantees-card">
              <div className="guarantee-row">
                <div className="guarantee-icon-wrap">
                  <Truck size={16} color="#dfbe84" />
                </div>
                <div>
                  <div className="g-title">Direct Dispatch</div>
                  <div className="g-sub">Hand-packed with care • Dispatched within 24 hours</div>
                </div>
              </div>

              <div className="guarantee-row">
                <div className="guarantee-icon-wrap">
                  <Award size={16} color="#dfbe84" />
                </div>
                <div>
                  <div className="g-title">NABL NMR Certified Purity</div>
                  <div className="g-sub">0.0% Chemical Pesticides across 220+ European lab screens</div>
                </div>
              </div>

              <div className="guarantee-row">
                <div className="guarantee-icon-wrap">
                  <Leaf size={16} color="#dfbe84" />
                </div>
                <div>
                  <div className="g-title">Fair Trade Certified</div>
                  <div className="g-sub">Direct partnerships supporting native farming communities in Kerala</div>
                </div>
              </div>
            </div>

            {/* 4 Core Terroir Specs Strip */}
            <div className="pdp-specs-grid">
              <div className="spec-item">
                <div className="spec-lbl">Elevation</div>
                <div className="spec-val">{product.elevation}</div>
                <div className="spec-desc">High-Range Terroir</div>
              </div>

              <div className="spec-item">
                <div className="spec-lbl">Season</div>
                <div className="spec-val">{product.harvestSeason}</div>
                <div className="spec-desc">Hand-Selected</div>
              </div>

              <div className="spec-item">
                <div className="spec-lbl">Aroma Profile</div>
                <div className="spec-val">{product.aromaProfile.split(',')[0]}</div>
                <div className="spec-desc">Unscorched Terpenes</div>
              </div>

              <div className="spec-item">
                <div className="spec-lbl">Purity Standard</div>
                <div className="spec-val">{product.curcuminOrOil.split(' ')[0]}</div>
                <div className="spec-desc">100% Raw & Unbleached</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Detailed Heritage & Lab Report Tabs */}
        <div className="pdp-tabs-section">
          <div className="tabs-nav-bar">
            <button
              onClick={() => setActiveTab('terroir')}
              className={`tab-btn ${activeTab === 'terroir' ? 'tab-active' : ''}`}
            >
              Terroir & Cultivation
            </button>
            <button
              onClick={() => setActiveTab('lab')}
              className={`tab-btn ${activeTab === 'lab' ? 'tab-active' : ''}`}
            >
              NMR Lab Purity Scan
            </button>
            <button
              onClick={() => setActiveTab('culinary')}
              className={`tab-btn ${activeTab === 'culinary' ? 'tab-active' : ''}`}
            >
              Culinary & Ayurvedic Usage
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`tab-btn ${activeTab === 'reviews' ? 'tab-active' : ''}`}
            >
              Connoisseur Reviews ({product.reviewsCount})
            </button>
          </div>

          <div className="tab-content-card">
            {activeTab === 'terroir' && (
              <div className="tab-pane">
                <h3 className="tab-pane-title">Nurtured Under Kerala's Western Ghats Canopy</h3>
                <p className="tab-pane-p">
                  Our {product.name} is cultivated at an elevation of {product.elevation} in the pristine
                  cloud-forest valleys of Wayanad and Idukki. Unlike monoculture plantation crops, our plants
                  grow wild beneath a multi-tiered rainforest canopy of silver oak and jackfruit trees, nurtured
                  exclusively by torrential monsoon showers and nutrient-rich volcanic humus.
                </p>
                <div className="terroir-specs-callout">
                  <div className="callout-block">
                    <strong>Aroma & Terpene Signature:</strong>
                    <span> {product.aromaProfile}</span>
                  </div>
                  <div className="callout-block">
                    <strong>Potency Benchmark:</strong>
                    <span> {product.curcuminOrOil}</span>
                  </div>
                  <div className="callout-block">
                    <strong>Stewardship Ethics:</strong>
                    <span> Handpicked in micro-batches with zero chemical insecticides or synthetic accelerators.</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'lab' && (
              <div className="tab-pane">
                <h3 className="tab-pane-title">NABL Accredited & NMR Spectrometry Report</h3>
                <p className="tab-pane-p">
                  Every batch of {product.name} undergoes rigorous laboratory profiling to ensure complete absence of
                  heavy metals, artificial colorants, synthetic fragrance enhancers, or moisture adulteration.
                </p>
                <div className="lab-table-wrap">
                  <table className="lab-report-table">
                    <thead>
                      <tr>
                        <th>Quality Parameter</th>
                        <th>Standard Specification</th>
                        <th>Lab Test Result</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Pesticide Residue (220+ screens)</td>
                        <td>Below Detection Limit</td>
                        <td>0.0% Non-Detected</td>
                        <td><span className="status-pass">PASS</span></td>
                      </tr>
                      <tr>
                        <td>Moisture Content</td>
                        <td>&lt; 10.0%</td>
                        <td>7.8% (Optimal Aroma Curing)</td>
                        <td><span className="status-pass">PASS</span></td>
                      </tr>
                      <tr>
                        <td>Volatile Essential Oil Content</td>
                        <td>&gt; 4.0%</td>
                        <td>{product.curcuminOrOil}</td>
                        <td><span className="status-pass">SUPERIOR GRADE</span></td>
                      </tr>
                      <tr>
                        <td>Artificial Colorants & Polish</td>
                        <td>Nil Allowed</td>
                        <td>100% Unbleached & Natural</td>
                        <td><span className="status-pass">AUTHENTIC</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'culinary' && (
              <div className="tab-pane">
                <h3 className="tab-pane-title">Culinary Pairings & Storage Recommendations</h3>
                <p className="tab-pane-p">
                  Because our spices are unheated and sun-cured with intact volatile oils, you only require half the
                  usual quantity to achieve profound depth of flavor.
                </p>
                <ul className="culinary-recommendations-list">
                  <li><strong>Recommended Pairings:</strong> Traditional Malabar Biryanis, Slow-Simmered Kerala Stews, Golden Haldi Doodh, and Spiced Masala Chai.</li>
                  <li><strong>Grinding Technique:</strong> Gently crush whole pods or seeds in a granite mortar pestle immediately prior to use to release volatile terpenes.</li>
                  <li><strong>Storage Guidelines:</strong> Transfer to an airtight brass, glass, or glazed earthenware container. Store in a cool, shaded pantry away from direct solar radiation.</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-pane">
                <div className="reviews-summary-row">
                  <div>
                    <div className="reviews-big-num">{product.rating}</div>
                    <div className="stars-cluster">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="#d4af37" color="#d4af37" />
                      ))}
                    </div>
                    <div className="reviews-verified-lbl">100% Verified Buyer Reviews</div>
                  </div>
                </div>

                <div className="reviews-cards-list">
                  <div className="review-single-card">
                    <div className="rev-stars">{[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#d4af37" color="#d4af37" />)}</div>
                    <p className="rev-quote">
                      "The aroma from this {product.name} is unlike anything available in commercial grocery stores.
                      The oils are alive, potent, and deeply aromatic. Will never buy commercial spices again."
                    </p>
                    <div className="rev-author">— Radhika M., Verified Culinary Enthusiast, Bangalore</div>
                  </div>

                  <div className="review-single-card">
                    <div className="rev-stars">{[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#d4af37" color="#d4af37" />)}</div>
                    <p className="rev-quote">
                      "True Kerala Western Ghats quality. The color, aroma, and packaging reflect authentic heritage care.
                      Worth every single rupee."
                    </p>
                    <div className="rev-author">— Chef Siddharth R., Executive Chef, Mumbai</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. Companion Products / Frequently Paired Together */}
        <div className="companion-products-section">
          <div className="companion-header">
            <span className="section-subtitle">— RECOMMENDED —</span>
            <h3 className="companion-title">Frequently Bought Together</h3>
          </div>

          <div className="companion-grid">
            {companionProducts.map((comp) => (
              <div
                key={comp.id}
                onClick={() => onSelectProduct(comp)}
                className="companion-card"
              >
                <div className="comp-img-wrap">
                  <img src={comp.image} alt={comp.name} className="comp-img" />
                  <span className="comp-weight">{comp.weight}</span>
                </div>
                <div className="comp-body">
                  <div className="comp-name">{comp.name}</div>
                  <div className="comp-price-row">
                    <span className="comp-price">₹{comp.price}</span>
                    <span className="comp-orig">₹{comp.originalPrice}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart({ ...comp, quantity: 1 });
                    }}
                    className="comp-add-btn"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Minimalist Brand Footer */}
      <Footer />

      <style>{`
        .product-page-root {
          background-color: #faf8f4;
          color: #1a2e25;
          min-height: 100vh;
          padding-top: 100px;
          font-family: var(--font-product);
        }

        .product-breadcrumb-bar,
        .product-breadcrumb-bar *,
        .product-main-container,
        .product-main-container *,
        .pdp-tabs-section,
        .pdp-tabs-section *,
        .companion-products-section,
        .companion-products-section * {
          font-family: var(--font-product);
        }

        /* 1. Breadcrumbs */
        .product-breadcrumb-bar {
          background-color: #f4efe4;
          border-bottom: 1px solid rgba(14, 43, 33, 0.08);
          padding: 12px 0;
          font-size: 0.8rem;
        }

        .breadcrumb-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .back-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: #0c261e;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: color 0.2s ease, transform 0.2s ease;
          padding: 0;
        }
        .back-nav-btn:hover {
          color: #9e8550;
          transform: translateX(-3px);
        }

        .breadcrumb-path {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #7a7265;
          font-size: 0.78rem;
        }

        .crumb-link {
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .crumb-link:hover {
          color: #0c261e;
        }

        .crumb-sep {
          color: #c2b59f;
        }

        .crumb-current {
          color: #0c261e;
          font-weight: 600;
        }

        .share-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #ffffff;
          border: 1px solid #d4af37;
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #0c261e;
          cursor: pointer;
        }

        /* 2. Main Showcase Split */
        .product-main-container {
          padding-top: 36px;
          padding-bottom: 50px;
        }

        .product-split-grid {
          display: grid;
          grid-template-columns: 1.05fr 1.2fr;
          gap: clamp(32px, 5vw, 64px);
          align-items: flex-start;
        }

        /* Left: Gallery */
        .main-image-frame {
          position: relative;
          background-color: #ffffff;
          border: 1px solid rgba(212, 175, 55, 0.35);
          border-radius: 8px;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          box-shadow: 0 12px 36px rgba(11, 37, 29, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .main-display-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .main-display-image:hover {
          transform: scale(1.03);
        }

        .image-origin-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(6, 22, 17, 0.85);
          border: 1px solid rgba(212, 175, 55, 0.5);
          color: #f5e4be;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
        }

        .image-purity-pill {
          position: absolute;
          bottom: 16px;
          left: 16px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background-color: rgba(255, 255, 255, 0.94);
          border: 1px solid #74db93;
          color: #1a4d33;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.68rem;
          font-weight: 600;
          backdrop-filter: blur(8px);
        }

        .gallery-wishlist-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.9);
          border: 1px solid #ebd9b8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .gallery-thumbnails-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-top: 14px;
        }

        .thumb-btn {
          width: 100%;
          aspect-ratio: 1 / 1;
          height: auto;
          border-radius: 6px;
          border: 1.5px solid #d8cebc;
          background-color: #ffffff;
          overflow: hidden;
          cursor: pointer;
          padding: 0;
          transition: all 0.2s ease;
        }

        .thumb-btn.thumb-active {
          border-color: #d4af37;
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.35);
        }

        .thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pdp-guarantees-card {
          background-color: #fbf9f5;
          border: 1px solid #ebd9b8;
          border-radius: 8px;
          padding: 16px 18px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 4px 14px rgba(11, 37, 29, 0.04);
        }

        .guarantee-row {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .guarantee-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid rgba(223, 190, 132, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(11, 37, 29, 0.04);
        }

        .g-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #0c261e;
        }

        .g-sub {
          font-size: 0.74rem;
          color: #6a6255;
          margin-top: 2px;
          line-height: 1.4;
        }

        /* Right: Details */
        .product-top-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(14, 43, 33, 0.08);
          border: 1px solid rgba(212, 175, 55, 0.4);
          color: #8c733b;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .pdp-title {
          font-family: var(--font-product);
          font-size: clamp(1.8rem, 3.2vw, 2.6rem);
          font-weight: 700;
          color: #0c261e;
          line-height: 1.2;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }

        .pdp-subname {
          font-size: clamp(0.95rem, 1.2vw, 1.1rem);
          color: #706859;
          font-family: var(--font-product);
          font-style: normal;
          font-weight: 500;
          margin-bottom: 16px;
        }

        .pdp-rating-strip {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 22px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(14, 43, 33, 0.1);
        }

        .stars-cluster {
          display: flex;
          gap: 2px;
        }

        .rating-num {
          font-weight: 700;
          font-size: 0.95rem;
          color: #0c261e;
        }

        .rating-count {
          font-size: 0.78rem;
          color: #726b5d;
        }

        .verified-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background-color: #eaf5ee;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.68rem;
          color: #1a4d33;
          font-weight: 600;
        }

        .pdp-price-box {
          background-color: #f6f1e6;
          border: 1px solid #ebd9b8;
          border-radius: 6px;
          padding: 16px 20px;
          margin-bottom: 22px;
        }

        .price-main-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
          flex-wrap: wrap;
        }

        .price-currency {
          font-size: 1.4rem;
          font-weight: 700;
          color: #0c261e;
        }

        .price-figure {
          font-family: var(--font-sans);
          font-size: 2.2rem;
          font-weight: 700;
          color: #0c261e;
          line-height: 1;
        }

        .price-original {
          font-size: 1.1rem;
          color: #8f8576;
          text-decoration: line-through;
        }

        .discount-tag {
          background-color: #0c261e;
          color: #dfbe84;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.04em;
        }

        .price-legal-note {
          font-size: 0.74rem;
          color: #6a6255;
          margin-top: 6px;
        }

        .pdp-lead-description {
          font-size: 0.92rem;
          line-height: 1.7;
          color: #4a4439;
          margin-bottom: 24px;
        }

        /* Weights Selector */
        .pdp-selector-group {
          margin-bottom: 26px;
        }

        .selector-label-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .group-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #0c261e;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .selected-weight-display {
          font-size: 0.8rem;
          color: #9e8550;
          font-weight: 600;
        }

        .weights-buttons-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(115px, 1fr));
          gap: 8px;
        }

        .weight-option-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          background-color: #ffffff;
          border: 1px solid #d4c8b4;
          border-radius: 4px;
          padding: 10px 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          min-height: 52px;
        }

        .weight-option-btn:hover {
          border-color: #0c261e;
        }

        .weight-option-btn.weight-selected {
          border-color: #0c261e;
          background-color: #0c261e;
          color: #ffffff;
        }

        .weight-opt-name {
          font-size: 0.78rem;
          font-weight: 600;
        }

        .weight-opt-price {
          font-size: 0.72rem;
          color: #9e8550;
          font-weight: 600;
        }

        .weight-selected .weight-opt-price {
          color: #dfbe84;
        }

        .weight-check-dot {
          position: absolute;
          top: 3px;
          right: 5px;
          font-size: 0.62rem;
          color: #dfbe84;
        }

        /* Actions: Qty & Add to Cart */
        .pdp-actions-container {
          display: flex;
          gap: 10px;
          margin-bottom: 28px;
          align-items: stretch;
        }

        .quantity-controller {
          display: flex;
          align-items: center;
          border: 1px solid #c2b59f;
          border-radius: 4px;
          background-color: #ffffff;
          overflow: hidden;
          flex-shrink: 0;
          height: 48px;
        }

        .qty-btn {
          width: 38px;
          height: 100%;
          background: none;
          border: none;
          font-size: 1.1rem;
          color: #0c261e;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .qty-btn:hover {
          background-color: #f2eee5;
        }

        .qty-value {
          width: 32px;
          text-align: center;
          font-weight: 700;
          font-size: 0.95rem;
          color: #0c261e;
        }

        .pdp-add-cart-btn {
          flex: 1 1 auto;
          padding: 0 20px;
          font-size: 0.86rem;
          height: 48px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          white-space: nowrap;
        }

        .cart-added-state {
          background-color: #74db93 !important;
          color: #0c261e !important;
          border-color: #74db93 !important;
        }

        .pdp-buy-now-btn {
          flex: 0 0 auto;
          min-width: 130px;
          padding: 0 20px;
          height: 48px;
          background-color: #0c261e;
          color: #f5e4be;
          border: 1px solid #0c261e;
          border-radius: 4px;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pdp-buy-now-btn:hover {
          background-color: #174235;
          border-color: #174235;
        }

        /* 4 Specs Grid */
        .pdp-specs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          padding-top: 24px;
          border-top: 1px solid rgba(14, 43, 33, 0.1);
        }

        .spec-item {
          background-color: #ffffff;
          border: 1px solid #e5dccb;
          border-radius: 4px;
          padding: 12px;
          text-align: center;
        }

        .spec-lbl {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #8c8273;
          margin-bottom: 3px;
        }

        .spec-val {
          font-family: var(--font-sans);
          font-size: 0.88rem;
          font-weight: 700;
          color: #0c261e;
        }

        .spec-desc {
          font-size: 0.64rem;
          color: #9e8550;
          margin-top: 2px;
        }

        /* 3. Deep Dive Tabs */
        .pdp-tabs-section {
          margin-top: 50px;
          margin-bottom: 60px;
        }

        .tabs-nav-bar {
          display: flex;
          gap: 4px;
          border-bottom: 2px solid #e0d5c1;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .tab-btn {
          background: none;
          border: none;
          padding: 14px 22px;
          font-family: var(--font-sans);
          font-size: 0.84rem;
          font-weight: 600;
          color: #6a6255;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          margin-bottom: -2px;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .tab-btn:hover {
          color: #0c261e;
        }

        .tab-btn.tab-active {
          color: #0c261e;
          border-bottom-color: #d4af37;
          font-weight: 700;
        }

        .tab-content-card {
          background-color: #ffffff;
          border: 1px solid #dfbe84;
          border-top: none;
          border-radius: 0 0 8px 8px;
          padding: clamp(24px, 4vw, 44px);
          box-shadow: 0 8px 28px rgba(11, 37, 29, 0.05);
        }

        .tab-pane-title {
          font-family: var(--font-sans);
          font-size: clamp(1.3rem, 2.2vw, 1.7rem);
          font-weight: 700;
          letter-spacing: -0.01em;
          color: #0c261e;
          margin-bottom: 14px;
        }

        .tab-pane-p {
          font-size: 0.92rem;
          line-height: 1.7;
          color: #554f44;
          margin-bottom: 20px;
        }

        .terroir-specs-callout {
          background-color: #faf7f0;
          border-left: 3px solid #d4af37;
          padding: 16px 20px;
          border-radius: 0 4px 4px 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 0.86rem;
          color: #4a4439;
        }

        .lab-table-wrap {
          overflow-x: auto;
        }

        .lab-report-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.84rem;
          text-align: left;
        }

        .lab-report-table th {
          background-color: #0c261e;
          color: #f5e4be;
          padding: 12px 14px;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        .lab-report-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #e8e0d1;
          color: #3b352b;
        }

        .status-pass {
          background-color: #e5f6ed;
          color: #17653d;
          font-weight: 700;
          font-size: 0.72rem;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .culinary-recommendations-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-size: 0.88rem;
          color: #4a4439;
          line-height: 1.6;
        }

        .reviews-summary-row {
          margin-bottom: 24px;
          padding-bottom: 18px;
          border-bottom: 1px solid #eee5d4;
        }

        .reviews-big-num {
          font-size: 2.8rem;
          font-weight: 700;
          color: #0c261e;
          line-height: 1;
        }

        .reviews-verified-lbl {
          font-size: 0.78rem;
          color: #726b5d;
          margin-top: 4px;
        }

        .reviews-cards-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .review-single-card {
          background-color: #faf7f0;
          border: 1px solid #e8dfcf;
          border-radius: 6px;
          padding: 16px 20px;
        }

        .rev-stars {
          color: #d4af37;
          font-size: 0.9rem;
          margin-bottom: 8px;
        }

        .rev-quote {
          font-family: var(--font-sans);
          font-style: normal;
          font-size: 0.95rem;
          line-height: 1.55;
          color: #2b261e;
          margin-bottom: 8px;
        }

        .rev-author {
          font-size: 0.74rem;
          color: #7a7265;
          font-weight: 600;
        }

        /* 4. Companion Products */
        .companion-products-section {
          margin-bottom: 70px;
        }

        .companion-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .companion-title {
          font-family: var(--font-sans);
          font-size: clamp(1.5rem, 2.5vw, 2.1rem);
          font-weight: 700;
          letter-spacing: -0.01em;
          color: #0c261e;
        }

        .companion-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .companion-card {
          background-color: #ffffff;
          border: 1px solid rgba(11, 37, 29, 0.1);
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .companion-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(11, 37, 29, 0.08);
          border-color: #d4af37;
        }

        .comp-img-wrap {
          position: relative;
          aspect-ratio: 1 / 1;
          background-color: #f3efe8;
        }

        .comp-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .comp-weight {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(255, 255, 255, 0.9);
          padding: 2px 6px;
          border-radius: 2px;
          font-size: 0.62rem;
          font-weight: 600;
        }

        .comp-body {
          padding: 12px;
        }

        .comp-name {
          font-size: 0.84rem;
          font-weight: 600;
          color: #0c261e;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 6px;
        }

        .comp-price-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 10px;
        }

        .comp-price {
          font-weight: 700;
          font-size: 0.92rem;
          color: #0c261e;
        }

        .comp-orig {
          font-size: 0.74rem;
          color: #8c8273;
          text-decoration: line-through;
        }

        .comp-add-btn {
          width: 100%;
          padding: 6px 10px;
          background: #fdfbf7;
          border: 1px solid #d4af37;
          border-radius: 3px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #0c261e;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .comp-add-btn:hover {
          background: #d4af37;
          color: #071813;
        }

        /* High Responsiveness Breakpoints */
        @media (max-width: 1024px) {
          .product-split-grid {
            gap: 32px;
          }
        }

        @media (max-width: 900px) {
          .product-split-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .product-gallery-col {
            max-width: 500px;
            margin: 0 auto;
            width: 100%;
          }
          .pdp-specs-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .companion-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }

        @media (max-width: 640px) {
          .product-page-root {
            padding-top: 86px;
          }
          .product-main-container {
            padding-top: 18px;
            padding-bottom: 36px;
          }
          .crumb-current {
            display: none;
          }
          .crumb-sep:last-of-type {
            display: none;
          }
          .pdp-title {
            font-size: clamp(1.4rem, 6vw, 1.95rem);
            margin-bottom: 4px;
          }
          .pdp-subname {
            font-size: 0.9rem;
            margin-bottom: 12px;
          }
          .pdp-rating-strip {
            gap: 6px;
            margin-bottom: 16px;
            padding-bottom: 12px;
          }
          .price-figure {
            font-size: 1.85rem;
          }
          .pdp-price-box {
            padding: 12px 14px;
            margin-bottom: 18px;
          }
          .pdp-lead-description {
            font-size: 0.88rem;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .weights-buttons-row {
            grid-template-columns: repeat(auto-fit, minmax(95px, 1fr));
            gap: 6px;
          }
          .weight-option-btn {
            padding: 8px 6px;
            min-height: 48px;
          }
          .weight-opt-name {
            font-size: 0.72rem;
          }
          .weight-opt-price {
            font-size: 0.68rem;
          }

          /* Mobile 2-row action bar: top row [Qty] + [Add to Cart], bottom row [Buy Now] */
          .pdp-actions-container {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 8px;
            margin-bottom: 24px;
          }
          .quantity-controller {
            grid-column: 1;
            grid-row: 1;
            height: 44px;
          }
          .pdp-add-cart-btn {
            grid-column: 2;
            grid-row: 1;
            height: 44px;
            font-size: 0.8rem;
            padding: 0 10px;
          }
          .pdp-buy-now-btn {
            grid-column: 1 / -1;
            grid-row: 2;
            width: 100%;
            height: 44px;
            font-size: 0.82rem;
          }

          .pdp-specs-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            padding-top: 18px;
          }
          .spec-item {
            padding: 8px;
          }
          .spec-val {
            font-size: 0.8rem;
          }

          .pdp-tabs-section {
            margin-top: 36px;
            margin-bottom: 40px;
          }
          .tab-btn {
            padding: 10px 14px;
            font-size: 0.76rem;
          }
          .tab-content-card {
            padding: 18px 14px;
          }
          .lab-report-table {
            min-width: 480px;
          }
          .lab-report-table th, .lab-report-table td {
            padding: 9px 10px;
            font-size: 0.76rem;
          }
          .companion-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .companion-header {
            margin-bottom: 20px;
          }
          .comp-body {
            padding: 8px 10px;
          }
          .comp-name {
            font-size: 0.76rem;
          }
          .comp-price {
            font-size: 0.84rem;
          }
          .comp-add-btn {
            font-size: 0.68rem;
            padding: 5px;
          }
        }

        @media (max-width: 420px) {
          .breadcrumb-path {
            display: none;
          }
          .breadcrumb-inner {
            justify-content: space-between;
          }
          .weights-buttons-row {
            grid-template-columns: repeat(auto-fit, minmax(82px, 1fr));
            gap: 5px;
          }
          .pdp-actions-container {
            grid-template-columns: 96px 1fr;
          }
          .quantity-controller {
            width: 100%;
          }
          .qty-btn {
            width: 30px;
          }
          .qty-value {
            width: 26px;
          }
          .pdp-add-cart-btn {
            font-size: 0.76rem;
            padding: 0 8px;
          }
        }

        @media (max-width: 360px) {
          .weights-buttons-row {
            grid-template-columns: repeat(auto-fit, minmax(78px, 1fr));
          }
          .pdp-actions-container {
            grid-template-columns: 88px 1fr;
          }
          .qty-btn {
            width: 28px;
          }
          .qty-value {
            width: 22px;
            font-size: 0.78rem;
          }
          .pdp-add-cart-btn {
            font-size: 0.72rem;
            padding: 0 6px;
          }
        }
      `}</style>
    </div>
  );
}
