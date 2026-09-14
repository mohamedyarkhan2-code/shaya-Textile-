import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Scissors, User, ShieldCheck, LogOut, Menu, X, PackageCheck, Search } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Scissors size={20} className="scissors-svg" />
          </div>
          <div className="logo-text">
            <span className="brand-name">SHAYA</span>
            <span className="brand-tag">TEXTILE STUDIO</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/shop" className={`nav-link ${isActive('/shop') ? 'active' : ''}`}>
            Ready-Made Collection
          </Link>
          <Link to="/customize" className={`nav-link ${isActive('/customize') ? 'active' : ''}`}>
            <Scissors size={15} /> Custom Studio
          </Link>
          <Link to="/track-order" className={`nav-link ${isActive('/track-order') ? 'active' : ''}`}>
            <PackageCheck size={15} /> Track Order
          </Link>

          {/* ADMIN PANEL NAVBAR LINK */}
          <Link to={isAdmin ? "/admin" : "/login?redirect=admin"} className="admin-nav-pill">
            <ShieldCheck size={16} />
            <span>Admin Panel</span>
          </Link>
        </div>

        {/* Right Action Icons */}
        <div className="nav-actions">
          {/* Cart Icon */}
          <Link to="/cart" className="cart-icon-btn" title="View Cart">
            <ShoppingBag size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* User Account / Admin Badge */}
          {user ? (
            <div className="user-dropdown-container">
              <button
                className="user-profile-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <div className="user-info">
                  <span className="user-name">{user.name.split(' ')[0]}</span>
                  {isAdmin && <span className="admin-tag">ADMIN</span>}
                </div>
              </button>

              {userDropdownOpen && (
                <div className="dropdown-menu animate-fade-in" onClick={() => setUserDropdownOpen(false)}>
                  <div className="dropdown-header">
                    <p className="dropdown-user-name">{user.name}</p>
                    <p className="dropdown-user-email">{user.email}</p>
                    <span className={isAdmin ? "badge badge-admin" : "badge badge-user"}>
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                  <hr className="dropdown-divider" />
                  
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-item admin-highlight">
                      <ShieldCheck size={16} /> Admin Dashboard
                    </Link>
                  )}
                  <Link to="/orders" className="dropdown-item">
                    <PackageCheck size={16} /> My Orders & Tracking
                  </Link>
                  
                  <hr className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-item logout-item">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav animate-fade-in">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>Ready-Made Collection</Link>
          <Link to="/customize" onClick={() => setMobileMenuOpen(false)}>Custom Tailoring Studio</Link>
          <Link to="/track-order" onClick={() => setMobileMenuOpen(false)}>Track Your Order</Link>
          
          <Link to={isAdmin ? "/admin" : "/login?redirect=admin"} className="mobile-admin-link" onClick={() => setMobileMenuOpen(false)}>
            <ShieldCheck size={18} /> Admin Panel {isAdmin ? '(Admin Mode)' : ''}
          </Link>

          {user ? (
            <button onClick={handleLogout} className="mobile-logout-btn">
              <LogOut size={18} /> Sign Out ({user.name})
            </button>
          ) : (
            <div className="mobile-auth-btns">
              <Link to="/login" className="btn btn-secondary" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
