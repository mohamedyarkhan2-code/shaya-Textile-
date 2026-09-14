import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyOrdersApi, updateProfileApi } from '../services/api';
import { User, Mail, Phone, MapPin, Package, Settings, Save, Lock, ArrowRight } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  // Profile edit state
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    currentPassword: '',
    newPassword: '',
  });
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (activeTab === 'orders' && orders.length === 0) {
      fetchMyOrders();
    }
  }, [activeTab]);

  const fetchMyOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data } = await getMyOrdersApi();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      const { data } = await updateProfileApi(formData);
      setUser(data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditMode(false);
      
      // Clear password fields
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setUpdating(false);
    }
  };

  if (!user) return <div className="container padding-y-lg text-center">Please login to view your profile.</div>;

  return (
    <div className="profile-page container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-title">
          <h1>{user.name}</h1>
          <p><Mail size={14}/> {user.email}</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <User size={18} /> Account Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={18} /> My Orders
          </button>
          <button 
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} /> Account Settings
          </button>
        </div>

        <div className="profile-main">
          {activeTab === 'overview' && (
            <div className="tab-pane animate-fade-in">
              <h2>Account Details</h2>
              <div className="info-grid">
                <div className="info-card">
                  <h4>Contact Info</h4>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
                </div>
                <div className="info-card">
                  <h4>Shipping Address</h4>
                  {user.address?.street ? (
                    <p>
                      {user.address.street}<br/>
                      {user.address.city}, {user.address.state} - {user.address.pincode}
                    </p>
                  ) : (
                    <p className="text-muted">No address provided</p>
                  )}
                </div>
              </div>
              <button 
                className="btn btn-primary margin-top-md"
                onClick={() => setActiveTab('settings')}
              >
                Edit Profile
              </button>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="tab-pane animate-fade-in">
              <h2>My Orders</h2>
              {loadingOrders ? (
                <div className="loading-container">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <Package size={48} className="text-muted" />
                  <p>You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <div>
                          <span className="order-id">{order.orderId}</span>
                          <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className={`status-badge ${order.status === 'Delivered' ? 'success' : 'primary'}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="order-body">
                        <p>Total: <strong>₹{order.totalAmount.toLocaleString()}</strong></p>
                        <p>{order.items?.length || 0} items, {order.customItems?.length || 0} custom tailored</p>
                      </div>
                      <div className="order-footer">
                        <a href={`/track-order?orderId=${order.orderId}`} className="btn btn-secondary btn-sm">
                          Track Order <ArrowRight size={14} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="tab-pane animate-fade-in">
              <div className="flex-between margin-bottom-md">
                <h2>Account Settings</h2>
                {!editMode && (
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditMode(true)}>
                    Enable Editing
                  </button>
                )}
              </div>

              {message.text && (
                <div className={`alert alert-${message.type}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className={`settings-form ${!editMode ? 'disabled-form' : ''}`}>
                <div className="form-section">
                  <h3><User size={18}/> Personal Information</h3>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!editMode} required />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="text" name="phone" value={formData.phone} onChange={handleChange} disabled={!editMode} />
                    </div>
                  </div>
                </div>

                <div className="form-section margin-top-lg">
                  <h3><MapPin size={18}/> Shipping Address</h3>
                  <div className="form-group">
                    <label>Street Address</label>
                    <input type="text" name="street" value={formData.street} onChange={handleChange} disabled={!editMode} />
                  </div>
                  <div className="form-row-3 margin-top-sm">
                    <div className="form-group">
                      <label>City</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} disabled={!editMode} />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input type="text" name="state" value={formData.state} onChange={handleChange} disabled={!editMode} />
                    </div>
                    <div className="form-group">
                      <label>Pincode</label>
                      <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} disabled={!editMode} />
                    </div>
                  </div>
                </div>

                <div className="form-section margin-top-lg">
                  <h3><Lock size={18}/> Security (Optional)</h3>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Current Password</label>
                      <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} disabled={!editMode} placeholder="Required if changing password" />
                    </div>
                    <div className="form-group">
                      <label>New Password</label>
                      <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} disabled={!editMode} placeholder="Leave blank to keep current" />
                    </div>
                  </div>
                </div>

                {editMode && (
                  <div className="form-actions margin-top-md">
                    <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={updating}>
                      <Save size={18} /> {updating ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
