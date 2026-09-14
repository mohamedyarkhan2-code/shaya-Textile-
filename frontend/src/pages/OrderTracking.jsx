import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getOrderByIdApi, getMyOrdersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PackageCheck, Search, CheckCircle2, Clock, Truck, Scissors, MapPin, AlertCircle, ChevronRight, Phone } from 'lucide-react';
import './OrderTracking.css';

const OrderTracking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';

  const { user } = useAuth();
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialOrderId) {
      fetchOrderDetails(initialOrderId);
    } else if (user) {
      fetchUserOrders();
    } else {
      // Auto load demo order SHAYA-84920 so timeline is instantly visible like Flipkart without typing ID
      fetchOrderDetails('SHAYA-84920');
      setOrderIdInput('SHAYA-84920');
    }
  }, [initialOrderId, user]);

  const fetchOrderDetails = async (idToSearch) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getOrderByIdApi(idToSearch);
      setCurrentOrder(data);
    } catch (err) {
      console.error('Order tracking fetch error:', err);
      setError('Order not found. Please verify your Order ID (e.g. SHAYA-84920).');
      setCurrentOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const { data } = await getMyOrdersApi();
      setMyOrders(data);
      if (!initialOrderId && data.length > 0) {
        setCurrentOrder(data[0]);
        setOrderIdInput(data[0].orderId);
      } else if (!initialOrderId) {
        fetchOrderDetails('SHAYA-84920');
        setOrderIdInput('SHAYA-84920');
      }
    } catch (err) {
      console.error('Error fetching user orders:', err);
      fetchOrderDetails('SHAYA-84920');
      setOrderIdInput('SHAYA-84920');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;
    setSearchParams({ orderId: orderIdInput.trim() });
    fetchOrderDetails(orderIdInput.trim());
  };

  return (
    <div className="tracking-page container">
      <div className="tracking-header">
        <div className="badge badge-user">
          <PackageCheck size={14} /> LIVE FLIPKART-STYLE ORDER TRACKER
        </div>
        <h1>Track Your Shaya Textile Order</h1>
        <p>Monitor your ready-made shipment or custom tailoring process step-by-step.</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="tracking-search-bar">
        <div className="search-input-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Enter Order ID (e.g. SHAYA-84920)..."
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Track Order
        </button>
      </form>

      {/* Select from My Orders pills */}
      {user && myOrders.length > 0 && (
        <div className="my-orders-pills">
          <span>Your Recent Orders:</span>
          {myOrders.map((ord) => (
            <button
              key={ord._id}
              className={`order-pill ${currentOrder?.orderId === ord.orderId ? 'active' : ''}`}
              onClick={() => {
                setOrderIdInput(ord.orderId);
                setSearchParams({ orderId: ord.orderId });
                fetchOrderDetails(ord.orderId);
              }}
            >
              {ord.orderId} ({ord.status})
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Fetching live tracking updates...</p>
        </div>
      ) : error ? (
        <div className="error-box">
          <AlertCircle size={24} />
          <p>{error}</p>
        </div>
      ) : currentOrder ? (
        <div className="tracking-result-card animate-fade-in">
          {/* Order Header Summary */}
          <div className="order-summary-header">
            <div>
              <span className="order-id-label">ORDER ID</span>
              <h2>{currentOrder.orderId}</h2>
              <p className="order-date-text">
                Placed on {new Date(currentOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="est-delivery-box">
              <span className="est-label">ESTIMATED DELIVERY</span>
              <p className="est-date">
                {currentOrder.estimatedDeliveryDate
                  ? new Date(currentOrder.estimatedDeliveryDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
                  : '3-5 Business Days'}
              </p>
              <span className="status-badge-current">{currentOrder.status.toUpperCase()}</span>
            </div>
          </div>

          {/* FLIPKART-STYLE STEPPER TIMELINE */}
          <div className="stepper-timeline-wrapper">
            <h3>Live Shipment Progress</h3>
            <div className="stepper-timeline">
              {currentOrder.trackingSteps?.map((step, idx) => (
                <div
                  key={idx}
                  className={`stepper-node ${step.completed ? 'completed' : ''} ${step.status === currentOrder.status ? 'current' : ''}`}
                >
                  <div className="node-icon-wrapper">
                    {step.completed ? (
                      <CheckCircle2 size={20} className="check-svg" />
                    ) : (
                      <div className="dot-svg" />
                    )}
                  </div>

                  <div className="node-info">
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                    {step.timestamp && (
                      <span className="node-time">
                        {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items & Shipping Address Details */}
          <div className="order-details-grid">
            {/* Items */}
            <div className="details-card">
              <h3>Items in this Order</h3>
              <div className="items-list">
                {currentOrder.items?.map((item, index) => (
                  <div key={index} className="item-row-detail">
                    {item.image && <img src={item.image} alt={item.name} className="item-thumb" />}
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                    </div>
                    <span className="item-price">₹{item.price * item.quantity}</span>
                  </div>
                ))}

                {currentOrder.customItems?.map((custom, index) => (
                  <div key={index} className="item-row-detail custom-highlight">
                    <div className="custom-icon-box">
                      <Scissors size={20} />
                    </div>
                    <div className="item-info">
                      <h4>Bespoke Tailored {custom.garmentType.toUpperCase()} ({custom.materialName})</h4>
                      <p>Fabric: {custom.fabricType} | Color: {custom.selectedColor} | Fit: {custom.fitType}</p>
                      <p className="measurements-summary-text">
                        Chest: {custom.measurements?.chest}" | Waist: {custom.measurements?.waist}" | Length: {custom.measurements?.length}"
                      </p>
                    </div>
                    <span className="item-price">₹{custom.customPrice}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="details-card">
              <h3>Delivery & Payment Details</h3>
              <div className="address-box">
                <p className="addr-name"><strong>{currentOrder.shippingAddress?.name}</strong></p>
                <p><Phone size={14} /> {currentOrder.shippingAddress?.phone}</p>
                <p><MapPin size={14} /> {currentOrder.shippingAddress?.street}, {currentOrder.shippingAddress?.city}, {currentOrder.shippingAddress?.state} - {currentOrder.shippingAddress?.pincode}</p>
              </div>

              <hr className="summary-divider" />

              <div className="payment-summary-box">
                <div className="p-row">
                  <span>Payment Method:</span>
                  <strong>{currentOrder.paymentMethod}</strong>
                </div>
                <div className="p-row">
                  <span>Payment Status:</span>
                  <span className={currentOrder.isPaid ? 'badge badge-admin' : 'badge badge-user'}>
                    {currentOrder.isPaid ? 'PAID' : 'PENDING'}
                  </span>
                </div>
                <div className="p-row total-amount-row">
                  <span>Total Amount:</span>
                  <strong className="total-val">₹{currentOrder.totalAmount?.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-tracking-state">
          <PackageCheck size={48} />
          <p>Enter an Order ID above to track your order details in real-time.</p>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
