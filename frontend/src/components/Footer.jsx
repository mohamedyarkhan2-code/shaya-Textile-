import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, MapPin, Phone, Mail, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-features">
        <div className="container features-grid">
          <div className="feature-item">
            <Scissors size={24} />
            <div>
              <h4>Bespoke Tailoring</h4>
              <p>Custom shirts, pants & tees made to your exact measurements.</p>
            </div>
          </div>
          <div className="feature-item">
            <Truck size={24} />
            <div>
              <h4>Order Tracking</h4>
              <p>Live status updates from material cutting to final delivery.</p>
            </div>
          </div>
          <div className="feature-item">
            <RefreshCw size={24} />
            <div>
              <h4>Perfect Fit Guarantee</h4>
              <p>Free alterations on all custom tailored garments.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-content">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <Scissors size={20} />
            <span>SHAYA TEXTILE</span>
          </div>
          <p className="brand-desc">
            Shaya Textile blends modern tailoring craftsmanship with luxury fabrics. Shop readymade collections or customize your perfect attire.
          </p>
          <div className="contact-info">
            <p><MapPin size={16} /> 124 Textile Avenue, Industrial Zone, Mumbai</p>
            <p><Phone size={16} /> +91 98765 43210</p>
            <p><Mail size={16} /> support@shayatextile.com</p>
          </div>
        </div>

        <div className="footer-col">
          <h4>Ready-Made</h4>
          <ul>
            <li><Link to="/shop?category=shirt">Executive Shirts</Link></li>
            <li><Link to="/shop?category=pant">Tailored Pants & Chinos</Link></li>
            <li><Link to="/shop?category=t-shirt">Pima Cotton T-Shirts</Link></li>
            <li><Link to="/shop">New Arrivals</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Custom Studio</h4>
          <ul>
            <li><Link to="/customize?type=shirt">Custom Shirt Tailoring</Link></li>
            <li><Link to="/customize?type=pant">Custom Pant Tailoring</Link></li>
            <li><Link to="/customize?type=t-shirt">Custom T-Shirt Design</Link></li>
            <li><Link to="/track-order">Track Your Package</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/login">Sign In</Link></li>
            <li><Link to="/register">Create Account</Link></li>
            <li><Link to="/track-order">Order Tracking</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-container">
          <p>© {new Date().getFullYear()} Shaya Textile Studio. All rights reserved.</p>
          <p className="theme-credit">Designed in Executive White & Slate Grey</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
