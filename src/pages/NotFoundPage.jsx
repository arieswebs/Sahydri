import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft, Search, Sparkles, Package, Leaf, ArrowRight, HelpCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './NotFoundPage.css';

export default function NotFoundPage({ onOpenSearch, onOpenTracking, onViewProduct }) {
  const navigate = useNavigate();
  const { products } = useShop();
  const [searchQuery, setSearchQuery] = useState('');

  // Set descriptive page title
  useEffect(() => {
    const prevTitle = document.title;
    document.title = '404 - Trail Not Found | Sahydri Organics';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      document.title = prevTitle;
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      if (onOpenSearch) onOpenSearch();
      else navigate('/shop');
      return;
    }
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  };

  // Curate 3 or 4 highlight products
  const curatedProducts = (products && products.length > 0)
    ? products.slice(0, 4)
    : [
        {
          id: 'cardamom-8mm',
          name: 'Imperial Green Cardamom',
          subname: '8mm+ Jumbo Export Bold Pods',
          price: 490,
          image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600&auto=format&fit=crop'
        },
        {
          id: 'black-pepper-wayanad',
          name: 'Tellicherry Black Gold',
          subname: 'Late-Harvest Sun-Dried Peppercorns',
          price: 380,
          image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=600&auto=format&fit=crop'
        },
        {
          id: 'wayanad-turmeric',
          name: 'High-Curcumin Turmeric',
          subname: 'Heritage Native Rhizome Powder',
          price: 290,
          image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600&auto=format&fit=crop'
        },
        {
          id: 'raw-forest-honey',
          name: 'Wild Forest Honey',
          subname: 'Unfiltered Sahyadri Mountain Comb Nectar',
          price: 650,
          image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600&auto=format&fit=crop'
        }
      ];

  const handleProductClick = (product) => {
    if (onViewProduct) {
      onViewProduct(product);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <div className="notfound-container">
      <div className="notfound-bg-ambient" aria-hidden="true" />

      <main className="notfound-content">
        {/* Visual 404 Display */}
        <div className="notfound-number-wrapper">
          <span className="notfound-number" aria-hidden="true">404</span>
          <div className="notfound-badge">
            <Compass size={14} className="animate-spin-slow" />
            <span>Trail Not Found</span>
          </div>
        </div>

        {/* Brand Headline */}
        <h1 className="notfound-title">
          You’ve Wandered Off The Spice Trail
        </h1>
        <p className="notfound-subtitle">
          The sacred terroir you are seeking has shifted with the Western Ghats breeze,
          or this footpath no longer exists. Let us gently guide you back to our harvest.
        </p>

        {/* Quick In-Page Search */}
        <form className="notfound-search-bar" onSubmit={handleSearchSubmit} role="search">
          <Search size={18} className="notfound-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="notfound-search-input"
            placeholder="Search our spices, honey, or botanical oils..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search spices"
          />
          <button type="submit" className="notfound-search-btn" aria-label="Submit search">
            <span>Find Spice</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Action Buttons */}
        <div className="notfound-actions">
          <Link to="/" className="notfound-btn-primary">
            <Home size={16} />
            <span>Return to Sanctuary</span>
          </Link>

          <Link to="/shop" className="notfound-btn-secondary">
            <Sparkles size={16} color="var(--color-gold-500)" />
            <span>Explore Botanical Harvest</span>
          </Link>

          {onOpenTracking && (
            <button
              type="button"
              className="notfound-btn-outline"
              onClick={() => onOpenTracking()}
            >
              <Package size={15} />
              <span>Track an Order</span>
            </button>
          )}

          <button
            type="button"
            className="notfound-btn-outline"
            onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
          >
            <ArrowLeft size={15} />
            <span>Go Back</span>
          </button>
        </div>

        {/* Curated Bestsellers Showcase */}
        <section className="notfound-curated-section" aria-labelledby="curated-heading">
          <div className="notfound-curated-header">
            <p className="notfound-curated-tag">Curated from the Rainforest</p>
            <h2 id="curated-heading" className="notfound-curated-title">
              Bestselling Botanical Treasures
            </h2>
          </div>

          <div className="notfound-grid">
            {curatedProducts.map((p) => (
              <article
                key={p.id}
                className="notfound-card"
                onClick={() => handleProductClick(p)}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') handleProductClick(p); }}
                role="button"
                aria-label={`View ${p.name}`}
              >
                <div className="notfound-card-img-wrapper">
                  <img
                    src={p.image || '/images/spice-placeholder.jpg'}
                    alt={p.name}
                    className="notfound-card-img"
                    loading="lazy"
                  />
                </div>
                <h3 className="notfound-card-name">{p.name}</h3>
                <p className="notfound-card-subname">{p.subname || 'Artisan Estate Harvest'}</p>
                <div className="notfound-card-footer">
                  <span className="notfound-card-price">₹{p.price}</span>
                  <button type="button" className="notfound-card-view-btn">
                    View
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Support Note */}
        <footer className="notfound-support-note">
          <HelpCircle size={14} />
          <span>
            Lost or looking for something specific? Contact our spice masters at{' '}
            <a href="mailto:care@sahydriorganics.com" className="notfound-support-link">
              care@sahydriorganics.com
            </a>
          </span>
        </footer>
      </main>
    </div>
  );
}
