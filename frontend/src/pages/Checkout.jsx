import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrderApi } from '../services/api';
import { MapPin, Phone, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, customCartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    paymentMethod: 'Cash on Delivery',
  });

  const [locationCoords, setLocationCoords] = useState({
    latitude: user?.locationDetails?.latitude || null,
    longitude: user?.locationDetails?.longitude || null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Attempt auto-detect geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocationCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.street || !formData.city || !formData.pincode) {
      alert('Please fill in all shipping details');
      return;
    }

    setLoading(true);
    try {
      const orderType = cartItems.length > 0 && customCartItems.length > 0
        ? 'mixed'
        : customCartItems.length > 0
        ? 'custom'
        : 'readymade';

      const orderData = {
        orderType,
        items: cartItems,
        customItems: customCartItems,
        totalAmount: subtotal,
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          locationCoords,
        },
        paymentMethod: formData.paymentMethod,
      };

      const { data } = await createOrderApi(orderData);
      clearCart();
      // Redirect to Order Tracking page for this new order!
      navigate(`/track-order?orderId=${data.orderId}`);
    } catch (err) {
      console.error('Order creation error:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page container">
      <div className="checkout-header">
        <h1>Checkout & Order Placement</h1>
        <p>Enter your shipping location details to confirm your Shaya Textile order.</p>
      </div>

      <form onSubmit={handleSubmit} className="checkout-grid">
        {/* Shipping Form */}
        <div className="checkout-form-card">
          <div className="form-card-title">
            <MapPin size={20} /> Shipping & Delivery Address
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group margin-top-sm">
            <label>Street Address / House No. / Building *</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="e.g. Flat 402, Royal Residency, MG Road"
              required
            />
          </div>

          <div className="form-row-3 margin-top-sm">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Location details summary badge */}
          {locationCoords.latitude && (
            <div className="location-detected-badge">
              <CheckCircle2 size={16} /> GPS Location Coordinates Captured ({locationCoords.latitude.toFixed(4)}, {locationCoords.longitude.toFixed(4)}) for Admin Tracking.
            </div>
          )}

          {/* Payment Method */}
          <div className="form-card-title margin-top-lg">
            <CreditCard size={20} /> Select Payment Method
          </div>

          <div className="payment-options-grid">
            {['Cash on Delivery', 'UPI / Google Pay', 'Credit / Debit Card'].map((pm) => (
              <label key={pm} className={`payment-radio-box ${formData.paymentMethod === pm ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={pm}
                  checked={formData.paymentMethod === pm}
                  onChange={handleChange}
                />
                <span>{pm}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkout-summary-card">
          <h3>Order Overview</h3>

          <div className="summary-items-list">
            {cartItems.map((item, i) => (
              <div key={i} className="mini-item-row">
                <span>{item.name} ({item.size}) x{item.quantity}</span>
                <strong>₹{item.price * item.quantity}</strong>
              </div>
            ))}

            {customCartItems.map((item, i) => (
              <div key={i} className="mini-item-row custom-item-text">
                <span>Custom {item.garmentType.toUpperCase()} ({item.materialName})</span>
                <strong>₹{item.customPrice}</strong>
              </div>
            ))}
          </div>

          <hr className="summary-divider" />

          <div className="summary-row total-row">
            <span>Total Amount Payable:</span>
            <span className="total-price-tag">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary width-100 margin-top-md btn-lg">
            {loading ? 'Processing Order...' : 'Confirm & Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
