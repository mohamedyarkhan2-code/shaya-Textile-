import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Scissors,
  Home,
  ShoppingBag,
  PackageCheck,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
  Lock,
  ChevronRight,
} from 'lucide-react';
import './SidebarNavbar.css';

const SidebarNavbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { cartCount, subtotal } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Top Header Toggle (Visible only on screens <= 992px) */}
      <div className="mobile-header-bar">
        <Link to="/" className="mobile-brand">
          <div className="mobile-logo-icon">
            <Scissors size={18} />
          </div>
          <span>SHAYA TEXTILE</span>
        </Link>
        <div className="mobile-header-right">
          <Link to="/cart" className="mobile-cart-btn">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <button className="mobile-hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* LEFT VERTICAL SIDEBAR NAVIGATION */}
      <aside className={`left-sidebar ${mobileOpen ? 'mobile-expanded' : ''}`}>
        <div className="sidebar-container">
          {/* Top Brand Logo */}
          <div className="sidebar-brand">
            <Link to="/" className="brand-logo-link" onClick={() => setMobileOpen(false)}>
              <div className="brand-icon">
                <Scissors size={24} />
              </div>
              <div className="brand-text">
                <span className="brand-name">SHAYA</span>
                <span className="brand-sub">TEXTILE STUDIO</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links Stacked Vertically */}
          <div className="sidebar-nav-section">
            <span className="sidebar-section-title">STORE NAVIGATION</span>

            <nav className="sidebar-links">
              <Link
                to="/"
                className={`sidebar-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>

              <Link
                to="/shop"
                className={`sidebar-link ${isActive('/shop') ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <ShoppingBag size={18} />
                <span>Ready-Made Apparel</span>
              </Link>

              <Link
                to="/customize"
                className={`sidebar-link ${isActive('/customize') ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <Scissors size={18} />
                <span>Custom Tailoring Studio</span>
              </Link>

              <Link
                to="/track-order"
                className={`sidebar-link ${isActive('/track-order') ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <PackageCheck size={18} />
                <span>Track Order</span>
              </Link>
            </nav>
          </div>

          {/* ADMIN PORTAL SECTION */}
          <div className="sidebar-nav-section">
            <span className="sidebar-section-title">EXECUTIVE ADMIN</span>

            {isAdmin ? (
              <Link
                to="/admin"
                className={`sidebar-link admin-sidebar-link ${isActive('/admin') ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <ShieldCheck size={18} />
                <span>Admin Panel</span>
                <span className="admin-active-badge">ADMIN</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className={`sidebar-link admin-sidebar-link ${isActive('/admin/login') ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <Lock size={18} />
                <span>Admin Login Portal</span>
              </Link>
            )}
          </div>

          {/* Shopping Cart Bar */}
          <div className="sidebar-cart-box">
            <Link to="/cart" className="cart-widget-link" onClick={() => setMobileOpen(false)}>
              <div className="cart-widget-icon">
                <ShoppingBag size={20} />
                {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
              </div>
              <div className="cart-widget-info">
                <span className="cart-widget-label">Shopping Cart</span>
                <span className="cart-widget-subtotal">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <ChevronRight size={16} className="chevron-icon" />
            </Link>
          </div>

          {/* User Account / Separate Login Buttons at Bottom */}
          <div className="sidebar-user-footer">
            {user ? (
              <div className="user-profile-card">
                <div className="user-avatar-circle">{user.name.charAt(0).toUpperCase()}</div>
                <div className="user-meta">
                  <Link to="/profile" className="user-display-name" onClick={() => setMobileOpen(false)}>
                    {user.name}
                  </Link>
                  <span className={isAdmin ? 'role-badge admin' : 'role-badge user'}>
                    {user.role.toUpperCase()}
                  </span>
                </div>
                <button onClick={handleLogout} className="logout-icon-btn" title="Sign Out">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="separate-logins-box">
                <p className="login-box-title">Choose Portal Login:</p>
                <div className="separate-btns-stack">
                  <Link
                    to="/login"
                    className="sidebar-auth-btn user-portal-btn"
                    onClick={() => setMobileOpen(false)}
                  >
                    <User size={15} /> Customer Login
                  </Link>
                  <Link
                    to="/admin/login"
                    className="sidebar-auth-btn admin-portal-btn"
                    onClick={() => setMobileOpen(false)}
                  >
                    <ShieldCheck size={15} /> Admin Portal Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)}></div>
      )}
    </>
  );
};

export default SidebarNavbar;
