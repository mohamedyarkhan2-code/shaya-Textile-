import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, Scissors, ShoppingBag, ArrowRight } from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const {
    cartItems,
    customCartItems,
    subtotal,
    removeFromCart,
    removeCustomFromCart,
    updateQuantity,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  const isEmpty = cartItems.length === 0 && customCartItems.length === 0;

  return (
    <div className="cart-page container">
      <div className="cart-header">
        <h1>Your Shopping Cart</h1>
        <p>Review ready-made apparel and bespoke custom tailored garments before checkout.</p>
      </div>

      {isEmpty ? (
        <div className="empty-cart-box">
          <ShoppingBag size={50} className="empty-icon" />
          <h3>Your cart is empty</h3>
          <p>Explore our ready-made collection or design a custom tailored shirt, pant, or t-shirt.</p>
          <div className="empty-cart-actions">
            <Link to="/shop" className="btn btn-secondary">
              Browse Ready-Made
            </Link>
            <Link to="/customize" className="btn btn-primary">
              <Scissors size={16} /> Custom Studio
            </Link>
          </div>
        </div>
      ) : (
        <div className="cart-grid">
          {/* Left Cart Items List */}
          <div className="cart-items-list">
            {/* Ready Made Products */}
            {cartItems.length > 0 && (
              <div className="cart-section">
                <h3 className="section-subtitle-heading">Ready-Made Apparel ({cartItems.length})</h3>
                {cartItems.map((item, index) => (
                  <div key={index} className="cart-item-card">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <p className="item-meta">
                        Size: <strong>{item.size}</strong> | Color: <strong>{item.color}</strong>
                      </p>
                      <p className="item-price">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>

                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(index, -1)} className="qty-btn">
                        <Minus size={14} />
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button onClick={() => updateQuantity(index, 1)} className="qty-btn">
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="item-total">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>

                    <button onClick={() => removeFromCart(index)} className="delete-btn" title="Remove item">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Custom Tailored Garments */}
            {customCartItems.length > 0 && (
              <div className="cart-section">
                <h3 className="section-subtitle-heading">
                  <Scissors size={18} /> Bespoke Tailoring Items ({customCartItems.length})
                </h3>
                {customCartItems.map((item, index) => (
                  <div key={index} className="cart-item-card custom-card-border">
                    <div className="custom-item-badge">
                      CUSTOM {item.garmentType.toUpperCase()}
                    </div>
                    <div className="cart-item-details">
                      <h4>Custom {item.garmentType.toUpperCase()} ({item.materialName})</h4>
                      <p className="item-meta">
                        Fabric: {item.fabricType} | Color: {item.selectedColor} | Pattern: {item.selectedPattern} | Fit: {item.fitType}
                      </p>
                      <div className="custom-measurements-pill">
                        Chest: {item.measurements.chest}" | Waist: {item.measurements.waist}" | Length: {item.measurements.length}"
                      </div>
                    </div>

                    <div className="item-total">
                      ₹{item.customPrice.toLocaleString('en-IN')}
                    </div>

                    <button onClick={() => removeCustomFromCart(index)} className="delete-btn" title="Remove custom item">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Summary Sidebar */}
          <div className="cart-summary-sidebar">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Shipping Charge:</span>
                <span className="free-tag">FREE</span>
              </div>
              <div className="summary-row">
                <span>Custom Fitting & Alterations:</span>
                <span className="free-tag">INCLUDED</span>
              </div>
              <hr className="summary-divider" />
              <div className="summary-row total-row">
                <span>Grand Total:</span>
                <span className="total-price-tag">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <button onClick={handleProceedToCheckout} className="btn btn-primary width-100 margin-top-md">
                Proceed to Checkout <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
