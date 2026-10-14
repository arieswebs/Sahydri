import React, { useState } from 'react';
import {
  Sparkles, Gift, Check, ShoppingBag, Eye, Heart, Star,
  ShieldCheck, Truck, Feather, X, ChevronRight, ArrowRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ARTISAN_COLLECTIONS = [
  {
    id: "royal-malabar-spice-chest",
    name: "The Royal Malabar Spice Chest",
    subname: "Handcrafted Teak Box with 4 Single-Estate Spices",
    category: "hampers",
    price: 2499,
    originalPrice: 2899,
    rating: 4.9,
    reviewsCount: 142,
    tag: "HANDCRAFTED TEAK",
    originBadge: "WAYANAD RAINFOREST",
    image: "/images/collections/teak_spice_chest.jpg",
    itemsIncluded: [
      "8mm+ Alleppey Green Cardamom (100g)",
      "Tellicherry Garbled Black Pepper (200g)",
      "High-Curcumin Wayanad Turmeric (150g)",
      "Organic Malabar Whole Cloves (80g)",
      "Handmade Seasoned Teak Box with Brass Latches"
    ],
    description: "Crafted from seasoned Kerala teakwood by traditional Wayanad woodcarvers. Fitted with antique brass latches, housing four airtight glass jars of Kerala's highest-grade single-estate spices.",
    giftReady: true,
    elevation: "3,800 ft",
    harvestYear: "2026 Reserve Harvest"
  },
  {
    id: "artisanal-honey-collection-trio",
    name: "The Wild Honey Trio & Forest Comb",
    subname: "Raw Cliff Nectar, Jamun Blossom & Comb Honey",
    category: "honey",
    price: 1699,
    originalPrice: 1999,
    rating: 5.0,
    reviewsCount: 98,
    tag: "RARE FOREST HARVEST",
    originBadge: "CLIFFSIDE COLONIES",
    image: "/images/collections/honey_trio_gift_set.jpg",
    itemsIncluded: [
      "Raw Wild Forest Honey (300g)",
      "Monofloral Jamun Blossom Honey (300g)",
      "Fresh Raw Honeycomb Nectar (300g)",
      "Handmade Wooden Honey Dipper",
      "Emerald Velvet Gifting Case"
    ],
    description: "Harvested from wild Apis Dorsata rock bee hives in the high canopies of the Western Ghats. Raw, unfiltered, unheated, paired with seasonal Jamun blossom nectar in an emerald velvet gift box.",
    giftReady: true,
    elevation: "4,200 ft",
    harvestYear: "Summer Wild Harvest"
  },
  {
    id: "ayurvedic-wellness-hamper",
    name: "Ayurvedic Golden Wellness Hamper",
    subname: "Daily Rejuvenation Ritual with Urukku Velichenna",
    category: "wellness",
    price: 2199,
    originalPrice: 2499,
    rating: 4.9,
    reviewsCount: 116,
    tag: "AYURVEDIC RITUAL",
    originBadge: "HERITAGE COLD PRESSED",
    image: "/images/collections/ayurvedic_wellness_hamper.jpg",
    itemsIncluded: [
      "Traditional Urukku Velichenna (250ml)",
      "High-Curcumin Wayanad Turmeric (250g)",
      "Raw Forest Honey (300g)",
      "Whole Green Cardamom Pods (50g)",
      "Woven Bamboo Hamper with Golden Silk Ribbon"
    ],
    description: "An authentic tribute to centuries of Kerala Ayurvedic wisdom. Contains hand-cooked Urukku Velichenna from fresh coconut milk, anti-inflammatory turmeric, pure forest honey, and green cardamom for your morning elixirs.",
    giftReady: true,
    elevation: "Western Ghats Foothills",
    harvestYear: "Fresh Batch Cold-Cooked"
  },
  {
    id: "master-chef-spice-kit",
    name: "The Master Chef Spice Collection",
    subname: "6 Culinary Hill Spices in UV Amber Glass Jars",
    category: "culinary",
    price: 1899,
    originalPrice: 2199,
    rating: 4.9,
    reviewsCount: 87,
    tag: "CHEF'S RESERVE",
    originBadge: "6 SINGLE ESTATES",
    image: "/images/collections/master_chef_spice_kit.jpg",
    itemsIncluded: [
      "Tellicherry Black Peppercorns",
      "Stone-Ground Garam Masala",
      "Malabar Whole Cloves",
      "Ceylon Cinnamon Quills",
      "Whole Star Anise",
      "8mm+ Green Cardamom"
    ],
    description: "Designed for discerning chefs and culinary connoisseurs. Six airtight UV-protected amber glass jars with brushed brass lids, preserving volatile essential oils and aroma for restaurant-grade gourmet cooking.",
    giftReady: true,
    elevation: "High Range Estates",
    harvestYear: "2026 Estate Selection"
  },
  {
    id: "cardamom-pepper-combo",
    name: "The King & Queen Dual Reserve",
    subname: "Extra Bold Cardamom 8mm+ & Tellicherry Peppercorns",
    category: "hampers",
    price: 912,
    originalPrice: 1020,
    rating: 4.9,
    reviewsCount: 115,
    tag: "SPECIAL COMBO",
    originBadge: "MALABAR COAST",
    image: "/images/products/combo_cardamom_pepper.png",
    itemsIncluded: [
      "Alleppey Green Cardamom 8mm+ (100g)",
      "Tellicherry Bold Peppercorns (200g)",
      "Matte Gift Box with Golden Crest"
    ],
    description: "The historical rulers of the Malabar Spice Route brought together in an embossed dual presentation box. Unrivaled fragrance and pungency harvested at peak maturity.",
    giftReady: true,
    elevation: "High Ranges",
    harvestYear: "Winter Harvest"
  },
  {
    id: "pure-oil-turmeric-duo",
    name: "The Golden Kitchen Duo",
    subname: "Cold-Pressed Coconut Oil & Stone-Ground Turmeric",
    category: "wellness",
    price: 1079,
    originalPrice: 1199,
    rating: 4.8,
    reviewsCount: 76,
    tag: "PANTRY ESSENTIAL",
    originBadge: "ESTATE MILLED",
    image: "/images/products/natural_coconut_oil_sahydri.png",
    itemsIncluded: [
      "Natural Cold-Pressed Coconut Oil (1L)",
      "Cold Stone-Ground Turmeric Powder (1kg)",
      "Eco Jute Carry Bag"
    ],
    description: "The two foundational pillars of Kerala healthy living: pure wood-pressed virgin coconut oil paired with antioxidant-rich turmeric stone-ground without friction heat.",
    giftReady: false,
    elevation: "Malabar Basin & Wayanad",
    harvestYear: "All-Year Fresh Extraction"
  }
];

const TABS = [
  { id: 'all', label: 'All Collections' },
  { id: 'hampers', label: 'Gift Chests' },
  { id: 'honey', label: 'Honey Flights' },
  { id: 'wellness', label: 'Ayurvedic Sets' },
  { id: 'culinary', label: "Chef's Pantry" }
];

export default function ArtisanCollections({ onAddToCart, onGoShop }) {
  const { wishlist, toggleWishlist, addToCart, showToast } = useShop();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedSet, setSelectedSet] = useState(null);
  const [addedId, setAddedId] = useState(null);

  const filteredSets = activeTab === 'all'
    ? ARTISAN_COLLECTIONS
    : ARTISAN_COLLECTIONS.filter(item => item.category === activeTab);

  const handleAdd = (e, item) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(item);
    } else {
      addToCart(item);
      showToast(`Added ${item.name} to your cart`);
    }
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const handleWishlist = (e, id) => {
    e.stopPropagation();
    toggleWishlist(id);
  };

  return (
    <section className="artisan-section">
      <div className="container">

        {/* Section Header */}
        <div className="artisan-header">
          <div className="artisan-kicker">
            <Sparkles size={14} color="#dfbe84" />
            <span>THE CONNOISSEUR'S RESERVE</span>
          </div>
          <h2 className="artisan-title">
            Artisan Collections &amp; Gift Chests
          </h2>
          <p className="artisan-subtitle">
            Handcrafted teakwood hampers, rare wild honey flights, and curated Ayurvedic ritual sets—sourced directly from the mist-covered peaks of the Western Ghats.
          </p>

          {/* Filter Tabs */}
          <div className="artisan-tabs-wrap">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`artisan-tab-btn ${activeTab === tab.id ? 'artisan-tab-active' : ''}`}
              >
                {tab.id === 'hampers' && <Gift size={13} />}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Collections Grid */}
        <div className="artisan-grid">
          {filteredSets.map(item => {
            const isWL = wishlist?.includes(item.id);
            const isAdd = addedId === item.id;
            const discount = Math.round((1 - item.price / item.originalPrice) * 100);

            return (
              <div
                key={item.id}
                onClick={() => setSelectedSet(item)}
                className="artisan-card"
              >
                {/* Image Frame with Minimalist Badge & Wishlist */}
                <div className="artisan-img-frame">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="artisan-img"
                    loading="lazy"
                  />
                  <span className="artisan-coming-soon-badge">Coming Soon</span>
                  <button
                    onClick={e => handleWishlist(e, item.id)}
                    className="artisan-wl-btn"
                    aria-label="Wishlist"
                  >
                    <Heart size={14} color={isWL ? '#b91c1c' : '#ffffff'} fill={isWL ? '#b91c1c' : 'none'} />
                  </button>
                  <div className="artisan-img-overlay">
                    <button className="artisan-preview-pill">
                      <Eye size={13} />
                      <span>Quick View</span>
                    </button>
                  </div>
                </div>

                {/* Simplified Clean Card Body */}
                <div className="artisan-card-body">
                  <h3 className="artisan-card-title">{item.name}</h3>

                  {/* Pricing and Action */}
                  <div className="artisan-card-footer">
                    <div className="artisan-price-col">
                      <span className="artisan-price">₹{item.price.toLocaleString('en-IN')}</span>
                      {item.originalPrice > item.price && (
                        <span className="artisan-orig-price">₹{item.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    <button
                      disabled
                      className="artisan-coming-soon-btn"
                    >
                      <Sparkles size={12} color="#dfbe84" />
                      <span>Coming Soon</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Luxury Gifting Trust Banner */}
        <div className="artisan-trust-bar">
          <div className="artisan-trust-item">
            <Gift size={20} color="#dfbe84" />
            <div>
              <strong>Bespoke Gift Packaging</strong>
              <span>Luxury boxes with wax seal &amp; gold crest</span>
            </div>
          </div>
          <div className="artisan-trust-item">
            <Feather size={20} color="#dfbe84" />
            <div>
              <strong>Complimentary Calligraphy Card</strong>
              <span>Handwritten message included with every order</span>
            </div>
          </div>
          <div className="artisan-trust-item">
            <Truck size={20} color="#dfbe84" />
            <div>
              <strong>Pan-India Express Dispatch</strong>
              <span>Climate-controlled courier dispatch within 24h</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="artisan-bottom-cta">
          <button
            onClick={() => onGoShop ? onGoShop() : window.location.href = '/shop'}
            className="artisan-explore-all-btn"
          >
            <span>Explore All 12+ Single-Estate Harvesters</span>
            <ArrowRight size={15} />
          </button>
        </div>

      </div>

      {/* Detail Modal */}
      {selectedSet && (
        <div className="artisan-modal-backdrop" onClick={() => setSelectedSet(null)}>
          <div className="artisan-modal-sheet" onClick={e => e.stopPropagation()}>
            <button
              className="artisan-modal-close-btn"
              onClick={() => setSelectedSet(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="artisan-modal-grid">
              {/* Modal Image */}
              <div className="artisan-modal-img-col">
                <img src={selectedSet.image} alt={selectedSet.name} className="artisan-modal-img" />
                <div className="artisan-modal-badge-row">
                  <span className="artisan-tag-badge">{selectedSet.tag}</span>
                  <span className="artisan-modal-elevation">⛰️ {selectedSet.elevation}</span>
                </div>
              </div>

              {/* Modal Details */}
              <div className="artisan-modal-info-col">
                <div className="artisan-modal-header">
                  <span className="artisan-origin-text">{selectedSet.originBadge}</span>
                  <div className="artisan-stars-row">
                    <Star size={12} fill="#dfbe84" color="#dfbe84" />
                    <strong>{selectedSet.rating}</strong>
                    <span>({selectedSet.reviewsCount} verified reviews)</span>
                  </div>
                </div>

                <h3 className="artisan-modal-title">{selectedSet.name}</h3>
                <p className="artisan-modal-sub">{selectedSet.subname}</p>

                <p className="artisan-modal-desc">{selectedSet.description}</p>

                {/* Items Included Box */}
                <div className="artisan-modal-box">
                  <div className="artisan-modal-box-title">
                    <Gift size={14} color="#dfbe84" />
                    <span>What's Inside this Collection:</span>
                  </div>
                  <ul className="artisan-modal-list">
                    {selectedSet.itemsIncluded.map((item, idx) => (
                      <li key={idx}>
                        <Check size={13} color="#dfbe84" strokeWidth={2.5} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing & Add to Cart */}
                <div className="artisan-modal-footer">
                  <div className="artisan-price-col">
                    <span className="artisan-modal-price">₹{selectedSet.price.toLocaleString('en-IN')}</span>
                    {selectedSet.originalPrice > selectedSet.price && (
                      <span className="artisan-orig-price">₹{selectedSet.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <button
                    disabled
                    className="artisan-modal-coming-soon-btn"
                  >
                    <Sparkles size={15} color="#dfbe84" />
                    <span>Coming Soon · Reserve Batch</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Component Styles */}
      <style>{`
        .artisan-section {
          padding: clamp(52px, 7vw, 96px) 0;
          background: radial-gradient(circle at 50% 20%, #122f25 0%, #071813 65%, #04100c 100%);
          color: #ffffff;
          position: relative;
          overflow: hidden;
          border-top: 1px solid rgba(223, 190, 132, 0.15);
          border-bottom: 1px solid rgba(223, 190, 132, 0.15);
        }
        .artisan-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(223, 190, 132, 0.05) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }

        .artisan-header {
          text-align: center;
          max-width: 780px;
          margin: 0 auto clamp(32px, 5vw, 48px);
          position: relative;
          z-index: 2;
        }
        .artisan-kicker {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #dfbe84;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .artisan-title {
          font-family: var(--font-serif), Georgia, serif;
          font-size: clamp(1.8rem, 4vw, 3.2rem);
          font-weight: 400;
          color: #f7f3ea;
          line-height: 1.15;
          margin-bottom: 14px;
          letter-spacing: -0.01em;
        }
        .artisan-subtitle {
          font-size: 0.92rem;
          line-height: 1.6;
          color: #a7b8b0;
          margin: 0 auto 28px;
          max-width: 620px;
        }

        /* Tabs */
        .artisan-tabs-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .artisan-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(223, 190, 132, 0.22);
          color: #c7d4cd;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.22s ease;
          font-family: inherit;
        }
        .artisan-tab-btn:hover {
          background: rgba(223, 190, 132, 0.15);
          color: #f5e7c8;
          border-color: rgba(223, 190, 132, 0.45);
        }
        .artisan-tab-active {
          background: #dfbe84 !important;
          color: #0b251d !important;
          border-color: #dfbe84 !important;
          font-weight: 700 !important;
          box-shadow: 0 4px 16px rgba(223, 190, 132, 0.3);
        }

        /* Grid */
        .artisan-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          position: relative;
          z-index: 2;
        }

        /* Card */
        .artisan-card {
          background: rgba(11, 37, 29, 0.65);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(223, 190, 132, 0.25);
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.32s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.3);
        }
        .artisan-card:hover {
          transform: translateY(-5px);
          border-color: rgba(223, 190, 132, 0.6);
          box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45), 0 0 20px rgba(223, 190, 132, 0.15);
        }

        .artisan-coming-soon-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 5;
          background: rgba(8, 28, 22, 0.92);
          border: 1px solid rgba(223, 190, 132, 0.65);
          color: #dfbe84;
          font-family: var(--font-sans);
          font-size: 0.64rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 9px;
          border-radius: 4px;
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45);
        }
        .artisan-wl-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 5;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(11, 37, 29, 0.85);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(223, 190, 132, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .artisan-wl-btn:hover {
          transform: scale(1.1);
          background: rgba(11, 37, 29, 1);
          border-color: #dfbe84;
        }

        /* Image frame */
        .artisan-img-frame {
          position: relative;
          aspect-ratio: 4 / 3;
          background: #061611;
          overflow: hidden;
        }
        .artisan-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .artisan-card:hover .artisan-img {
          transform: scale(1.06);
        }
        .artisan-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(7, 24, 19, 0.75) 0%, transparent 60%);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 12px;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .artisan-card:hover .artisan-img-overlay {
          opacity: 1;
        }
        .artisan-preview-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 9999px;
          background: rgba(223, 190, 132, 0.95);
          color: #0b251d;
          font-size: 0.74rem;
          font-weight: 700;
          border: none;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
          cursor: pointer;
        }

        /* Simplified Card Body */
        .artisan-card-body {
          padding: 14px 12px 14px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .artisan-card-title {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 1.05rem;
          color: #ffffff;
          line-height: 1.3;
          margin: 0 0 10px;
          font-weight: 500;
        }

        /* Footer */
        .artisan-card-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid rgba(223, 190, 132, 0.12);
          gap: 8px;
        }
        .artisan-price-col {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }
        .artisan-price {
          font-size: 1.05rem;
          font-weight: 700;
          color: #dfbe84;
        }
        .artisan-orig-price {
          font-size: 0.78rem;
          color: #798e83;
          text-decoration: line-through;
        }

        .artisan-coming-soon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 4px;
          background: rgba(223, 190, 132, 0.12);
          border: 1px solid rgba(223, 190, 132, 0.4);
          color: #dfbe84;
          font-family: var(--font-sans);
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: not-allowed;
          white-space: nowrap;
          box-shadow: inset 0 1px 0 rgba(223, 190, 132, 0.15);
        }

        .artisan-modal-coming-soon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 26px;
          border-radius: 5px;
          background: rgba(223, 190, 132, 0.14);
          border: 1px solid rgba(223, 190, 132, 0.45);
          color: #dfbe84;
          font-family: var(--font-sans);
          font-size: 0.86rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: not-allowed;
          box-shadow: inset 0 1px 0 rgba(223, 190, 132, 0.2);
        }

        /* Trust Bar */
        .artisan-trust-bar {
          margin-top: clamp(36px, 6vw, 56px);
          padding: 20px 24px;
          background: rgba(11, 37, 29, 0.45);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(223, 190, 132, 0.2);
          border-radius: 12px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          position: relative;
          z-index: 2;
        }
        .artisan-trust-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .artisan-trust-item strong {
          display: block;
          font-size: 0.85rem;
          color: #f5e7c8;
          font-weight: 600;
          margin-bottom: 2px;
        }
        .artisan-trust-item span {
          display: block;
          font-size: 0.74rem;
          color: #9db0a6;
          line-height: 1.35;
        }

        /* Bottom CTA */
        .artisan-bottom-cta {
          text-align: center;
          margin-top: 36px;
          position: relative;
          z-index: 2;
        }
        .artisan-explore-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 9999px;
          background: transparent;
          color: #dfbe84;
          border: 1px solid rgba(223, 190, 132, 0.45);
          font-size: 0.86rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.22s ease;
          font-family: inherit;
        }
        .artisan-explore-all-btn:hover {
          background: rgba(223, 190, 132, 0.12);
          border-color: #dfbe84;
          transform: translateY(-2px);
        }

        /* Modal */
        .artisan-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(3, 12, 9, 0.85);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .artisan-modal-sheet {
          background: #0a241b;
          border: 1px solid rgba(223, 190, 132, 0.4);
          border-radius: 14px;
          max-width: 820px;
          width: 100%;
          overflow: hidden;
          position: relative;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
          max-height: 90vh;
          overflow-y: auto;
        }
        .artisan-modal-close-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
        }
        .artisan-modal-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
        }
        .artisan-modal-img-col {
          position: relative;
          background: #04100c;
        }
        .artisan-modal-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          min-height: 360px;
        }
        .artisan-modal-badge-row {
          position: absolute;
          bottom: 14px;
          left: 14px;
          right: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .artisan-modal-elevation {
          background: rgba(11, 37, 29, 0.85);
          backdrop-filter: blur(6px);
          color: #d1ded7;
          font-size: 0.66rem;
          padding: 3px 8px;
          border-radius: 4px;
        }
        .artisan-modal-info-col {
          padding: 28px;
          display: flex;
          flex-direction: column;
        }
        .artisan-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .artisan-modal-title {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 1.45rem;
          color: #ffffff;
          margin: 0 0 6px;
        }
        .artisan-modal-sub {
          font-size: 0.82rem;
          color: #a4b5ad;
          margin: 0 0 14px;
        }
        .artisan-modal-desc {
          font-size: 0.84rem;
          line-height: 1.6;
          color: #c7d8cf;
          margin: 0 0 18px;
        }
        .artisan-modal-box {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(223, 190, 132, 0.2);
          border-radius: 8px;
          padding: 12px 14px;
          margin-bottom: 22px;
        }
        .artisan-modal-box-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          font-weight: 700;
          color: #dfbe84;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }
        .artisan-modal-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .artisan-modal-list li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          color: #e2ede7;
        }
        .artisan-modal-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid rgba(223, 190, 132, 0.15);
        }
        .artisan-modal-price {
          font-size: 1.4rem;
          font-weight: 700;
          color: #dfbe84;
        }
        .artisan-modal-add-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border-radius: 6px;
          background: #dfbe84;
          color: #0b251d;
          font-size: 0.84rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .artisan-modal-add-btn:hover {
          background: #f0dcab;
        }

        /* ── Breakpoints ── */
        @media (max-width: 1024px) {
          .artisan-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 18px;
          }
          .artisan-trust-bar {
            grid-template-columns: 1fr;
            gap: 14px;
          }
        }
        @media (max-width: 640px) {
          .artisan-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px 8px !important;
          }
          .artisan-card-body {
            padding: 10px 8px 10px;
          }
          .artisan-card-title {
            font-size: 0.84rem;
            min-height: 2.3em;
            line-height: 1.25;
            margin-bottom: 6px;
          }
          .artisan-card-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 6px;
            padding-top: 6px;
          }
          .artisan-price-col {
            justify-content: flex-start;
            gap: 5px;
          }
          .artisan-price {
            font-size: 0.92rem;
          }
          .artisan-orig-price {
            font-size: 0.72rem;
          }
          .artisan-add-btn {
            width: 100%;
            justify-content: center;
            padding: 6px 8px;
            font-size: 0.72rem;
          }
          .artisan-tab-btn {
            padding: 6px 12px;
            font-size: 0.74rem;
          }
          .artisan-modal-grid {
            grid-template-columns: 1fr;
          }
          .artisan-modal-img {
            min-height: 220px;
            max-height: 260px;
          }
          .artisan-modal-info-col {
            padding: 18px;
          }
        }
        @media (max-width: 380px) {
          .artisan-grid {
            gap: 8px 6px !important;
          }
          .artisan-card-title {
            font-size: 0.80rem;
          }
          .artisan-price {
            font-size: 0.88rem;
          }
        }
      `}</style>
    </section>
  );
}
