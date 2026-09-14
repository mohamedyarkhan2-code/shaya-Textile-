import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductsApi, getMaterialsApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import {
  Scissors,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  PackageCheck,
  Star,
  Truck,
  RefreshCcw,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animatedStats, setAnimatedStats] = useState({ orders: 0, customers: 0, fabrics: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, matRes] = await Promise.all([
          getProductsApi({ featured: 'true' }),
          getMaterialsApi(),
        ]);
        setFeaturedProducts(prodRes.data);
        setMaterials(matRes.data.slice(0, 4));
      } catch (err) {
        console.error('Home data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Animate stats counter
    const targets = { orders: 2500, customers: 1800, fabrics: 50 };
    const duration = 1500;
    const interval = 30;
    const steps = duration / interval;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedStats({
        orders: Math.floor(targets.orders * progress),
        customers: Math.floor(targets.customers * progress),
        fabrics: Math.floor(targets.fabrics * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    {
      name: 'Arjun Sharma',
      city: 'Mumbai',
      rating: 5,
      text: 'The custom shirt I ordered fits perfectly! The fabric quality is outstanding and delivery was super fast.',
      avatar: 'A',
    },
    {
      name: 'Priya Nair',
      city: 'Bangalore',
      rating: 5,
      text: 'Shaya Textile has the best fabric selection. My bespoke suit was ready in just 5 days. Highly recommend!',
      avatar: 'P',
    },
    {
      name: 'Rahul Mehta',
      city: 'Delhi',
      rating: 5,
      text: 'Amazing experience from ordering to delivery. The order tracking feature is exactly like Flipkart — love it!',
      avatar: 'R',
    },
  ];

  return (
    <div className="home-page">
      {/* ═══════════════════════════════════════════
          HERO SECTION — Premium Gradient + Split Layout
      ═══════════════════════════════════════════ */}
      <section className="hero-section">
        <div className="hero-bg-pattern" />
        <div className="container hero-container">
          <div className="hero-content animate-fade-in">
            <div className="hero-badge">
              <Sparkles size={14} /> Premium Bespoke Tailoring Studio
            </div>
            <h1 className="hero-title">
              Crafted for <span className="highlight-text">Your Fit.</span>
              <br />
              Delivered to <span className="highlight-text">Your Door.</span>
            </h1>
            <p className="hero-subtitle">
              Shop premium ready-made apparel or design fully custom Shirts, Pants & T-Shirts
              from hand-curated Italian, Belgian & Supima fabrics — tailored to your exact measurements.
            </p>
            <div className="hero-cta-buttons">
              <Link to="/customize" className="btn btn-hero-primary">
                <Scissors size={18} /> Start Custom Tailoring
              </Link>
              <Link to="/shop" className="btn btn-hero-secondary">
                Explore Ready-Made <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hero-trust-badges">
              <span className="trust-item"><CheckCircle2 size={15} /> 100% Custom Fit Guarantee</span>
              <span className="trust-item"><Truck size={15} /> Free Express Delivery</span>
              <span className="trust-item"><PackageCheck size={15} /> Live Order Tracking</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-stack">
              <div className="hero-img-main">
                <img
                  src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&auto=format&fit=crop&q=80"
                  alt="Bespoke Tailoring Studio"
                />
                <div className="hero-img-overlay-card">
                  <div className="overlay-icon"><Scissors size={18} /></div>
                  <div>
                    <p className="overlay-title">Bespoke Tailoring</p>
                    <p className="overlay-sub">Custom fit, premium fabrics</p>
                  </div>
                </div>
              </div>
              <div className="hero-stats-float">
                <div className="float-stat">
                  <span className="float-num">{animatedStats.orders.toLocaleString()}+</span>
                  <span className="float-label">Orders Delivered</span>
                </div>
                <div className="float-stat">
                  <span className="float-num">{animatedStats.customers.toLocaleString()}+</span>
                  <span className="float-label">Happy Customers</span>
                </div>
                <div className="float-stat">
                  <span className="float-num">{animatedStats.fabrics}+</span>
                  <span className="float-label">Premium Fabrics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          VALUE PROPOSITIONS BAR
      ═══════════════════════════════════════════ */}
      <section className="value-bar">
        <div className="container value-bar-grid">
          {[
            { icon: <Scissors size={22} />, title: 'Master Tailoring', desc: 'Crafted by seasoned artisans' },
            { icon: <Truck size={22} />, title: 'Express Delivery', desc: '3-5 business days nationwide' },
            { icon: <RefreshCcw size={22} />, title: 'Easy Returns', desc: '7-day hassle-free returns' },
            { icon: <Award size={22} />, title: 'Premium Quality', desc: 'Certified premium materials' },
          ].map((item, idx) => (
            <div key={idx} className="value-item">
              <div className="value-icon">{item.icon}</div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CATEGORY SHOWCASE — Shop by Garment Type
      ═══════════════════════════════════════════ */}
      <section className="categories-section container">
        <div className="section-header text-center">
          <span className="section-subtitle">CUSTOM OR READY-MADE</span>
          <h2 className="section-title">Shop By Garment Type</h2>
          <p className="section-desc">Choose your style — fully bespoke or our curated ready-to-wear collection</p>
        </div>

        <div className="category-grid-new">
          {[
            {
              img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=700&auto=format&fit=crop&q=80',
              title: 'Executive Shirts',
              desc: 'Oxford, Linen & Formal Business Shirts',
              type: 'shirt',
              tag: 'BESTSELLER',
            },
            {
              img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=700&auto=format&fit=crop&q=80',
              title: 'Tailored Pants',
              desc: 'Worsted Wool, Twill & Casual Chinos',
              type: 'pant',
              tag: 'TRENDING',
            },
            {
              img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80',
              title: 'Pima Cotton T-Shirts',
              desc: 'Crew Necks, Oversized & Polo Tees',
              type: 't-shirt',
              tag: 'NEW',
            },
          ].map((cat, idx) => (
            <div key={idx} className="cat-card-new">
              <div className="cat-img-wrapper">
                <img src={cat.img} alt={cat.title} />
                <span className="cat-tag">{cat.tag}</span>
              </div>
              <div className="cat-body">
                <h3>{cat.title}</h3>
                <p>{cat.desc}</p>
                <div className="cat-action-row">
                  <Link to={`/customize?type=${cat.type}`} className="btn btn-primary btn-sm">
                    <Scissors size={13} /> Custom
                  </Link>
                  <Link to={`/shop?category=${cat.type}`} className="btn btn-secondary btn-sm">
                    Ready-Made <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURED PRODUCTS GRID
      ═══════════════════════════════════════════ */}
      <section className="featured-section container">
        <div className="section-header flex-between">
          <div>
            <span className="section-subtitle">READY TO SHIP</span>
            <h2 className="section-title">Featured Ready-Made Apparel</h2>
          </div>
          <Link to="/shop" className="link-with-arrow">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="products-loading-grid">
            {[1, 2, 3, 4].map((i) => <div key={i} className="product-skeleton" />)}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-products-notice">
            <Package size={40} />
            <p>Featured products coming soon. Admin is adding the collection.</p>
            <Link to="/shop" className="btn btn-secondary">Browse All Products</Link>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════
          CUSTOM FABRIC SPOTLIGHT
      ═══════════════════════════════════════════ */}
      <section className="materials-spotlight">
        <div className="container spotlight-container">
          <div className="spotlight-text">
            <span className="section-subtitle light">PREMIUM FABRIC STUDIO</span>
            <h2>Design Your Perfect Garment</h2>
            <p>
              Explore hand-curated fabrics: Supima Cotton, Belgian Linen, Italian Wool Twill, French Terry & more.
              Pick your cloth, set measurements, choose collar/sleeve style — we stitch it to perfection.
            </p>
            <div className="spotlight-steps">
              {[
                { num: '01', label: 'Choose Fabric' },
                { num: '02', label: 'Set Measurements' },
                { num: '03', label: 'Pick Style Details' },
                { num: '04', label: 'We Deliver It' },
              ].map((s) => (
                <div key={s.num} className="step-item">
                  <span className="step-num">{s.num}</span>
                  <span className="step-label">{s.label}</span>
                </div>
              ))}
            </div>
            <Link to="/customize" className="btn btn-primary btn-lg">
              Open Customization Studio <ArrowRight size={18} />
            </Link>
          </div>

          <div className="materials-preview-grid">
            {materials.length > 0 ? (
              materials.map((mat) => (
                <div key={mat._id} className="mat-card">
                  <img src={mat.image} alt={mat.name} />
                  <div className="mat-info">
                    <h4>{mat.name}</h4>
                    <p>{mat.fabricType}</p>
                    <span className="mat-price">₹{mat.pricePerMeter}/m</span>
                  </div>
                </div>
              ))
            ) : (
              // Placeholder fabric cards
              [
                { name: 'Supima Cotton', type: 'Premium Cotton', price: 380, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop&q=80' },
                { name: 'Belgian Linen', type: 'Natural Linen', price: 520, img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&auto=format&fit=crop&q=80' },
                { name: 'Italian Twill', type: 'Wool Twill', price: 750, img: 'https://images.unsplash.com/photo-1611558709798-e009c8fd7706?w=400&auto=format&fit=crop&q=80' },
                { name: 'French Terry', type: 'Cotton Fleece', price: 290, img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&auto=format&fit=crop&q=80' },
              ].map((m, i) => (
                <div key={i} className="mat-card">
                  <img src={m.img} alt={m.name} />
                  <div className="mat-info">
                    <h4>{m.name}</h4>
                    <p>{m.type}</p>
                    <span className="mat-price">₹{m.price}/m</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS SECTION
      ═══════════════════════════════════════════ */}
      <section className="testimonials-section container">
        <div className="section-header text-center">
          <span className="section-subtitle">CUSTOMER STORIES</span>
          <h2 className="section-title">What Our Customers Say</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div key={idx} className="testimonial-card animate-fade-in">
              <div className="testimonial-stars">
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="#f59f00" color="#f59f00" />)}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.avatar}</div>
                <div>
                  <p className="author-name">{t.name}</p>
                  <p className="author-city">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ORDER TRACKING TEASER CTA
      ═══════════════════════════════════════════ */}
      <section className="tracking-teaser-section">
        <div className="container tracking-teaser-inner">
          <div className="teaser-left">
            <div className="teaser-icon-circle">
              <PackageCheck size={32} />
            </div>
            <div>
              <h3>Track Your Order in Real-Time</h3>
              <p>Flipkart-style live order tracking — see every step from tailoring to doorstep delivery.</p>
            </div>
          </div>
          <div className="teaser-steps-mini">
            {['Order Placed', 'Cutting & Stitching', 'Quality Check', 'Shipped', 'Delivered'].map((s, i) => (
              <div key={i} className="mini-step">
                <div className={`mini-dot ${i < 3 ? 'done' : ''}`} />
                <span>{s}</span>
              </div>
            ))}
          </div>
          <Link to="/track-order" className="btn btn-primary">
            Track My Order <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
