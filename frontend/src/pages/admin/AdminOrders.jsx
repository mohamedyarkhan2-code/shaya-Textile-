import React, { useState, useEffect } from 'react';
import { getAllOrdersApi, updateOrderStatusApi } from '../../services/api';
import { ShoppingBag, Eye, MapPin, Scissors, CheckCircle } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await getAllOrdersApi();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatusModal = (ord) => {
    setSelectedOrder(ord);
    setUpdateStatus(ord.status);
    setStatusNote('');
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      await updateOrderStatusApi(selectedOrder._id, {
        status: updateStatus,
        note: statusNote,
      });
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      alert('Status update failed');
    }
  };

  const statusOptions = [
    'Order Placed',
    'Processing',
    'Fabric Cutting & Tailoring',
    'Quality Check',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
  ];

  return (
    <div className="admin-orders">
      <h2>All Customer Orders & Tailoring Progress</h2>
      <p className="text-muted margin-bottom-md">
        View live order statuses, custom measurements, delivery addresses, and update Flipkart-style tracking stages.
      </p>

      {loading ? (
        <div className="loading-container">Loading orders...</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer & Address</th>
                <th>Order Type</th>
                <th>Total</th>
                <th>Current Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord._id}>
                  <td><strong>{ord.orderId}</strong></td>
                  <td>
                    <strong>{ord.shippingAddress?.name || ord.user?.name}</strong>
                    <br />
                    <small className="text-muted"><MapPin size={12} /> {ord.shippingAddress?.city}, {ord.shippingAddress?.state}</small>
                  </td>
                  <td>
                    <span className="badge badge-user">{ord.orderType?.toUpperCase()}</span>
                  </td>
                  <td><strong>₹{ord.totalAmount?.toLocaleString('en-IN')}</strong></td>
                  <td>
                    <span className="badge badge-admin">{ord.status}</span>
                  </td>
                  <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleOpenStatusModal(ord)} className="btn btn-secondary btn-sm">
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Status Update Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card animate-fade-in">
            <div className="modal-header">
              <h3>Update Tracking Status: {selectedOrder.orderId}</h3>
              <button onClick={() => setSelectedOrder(null)} className="btn btn-sm btn-secondary">Close</button>
            </div>

            <div className="order-details-modal-body">
              <div className="customer-info-box margin-bottom-md">
                <h4>Shipping Address & Contact:</h4>
                <p><strong>{selectedOrder.shippingAddress?.name}</strong> ({selectedOrder.shippingAddress?.phone})</p>
                <p>{selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}</p>
                {selectedOrder.shippingAddress?.locationCoords?.latitude && (
                  <small className="text-muted">
                    Location GPS: {selectedOrder.shippingAddress.locationCoords.latitude.toFixed(4)}, {selectedOrder.shippingAddress.locationCoords.longitude.toFixed(4)}
                  </small>
                )}
              </div>

              {/* Custom Measurements Review if custom order */}
              {selectedOrder.customItems && selectedOrder.customItems.length > 0 && (
                <div className="custom-measurements-review-box margin-bottom-md">
                  <h4><Scissors size={16} /> Tailoring Measurements Required:</h4>
                  {selectedOrder.customItems.map((c, i) => (
                    <div key={i} className="c-m-item">
                      <p><strong>Custom {c.garmentType.toUpperCase()}</strong> ({c.materialName} - {c.selectedColor})</p>
                      <p className="m-pills">
                        Chest: {c.measurements?.chest}" | Waist: {c.measurements?.waist}" | Length: {c.measurements?.length}" | Shoulder: {c.measurements?.shoulder}" | Sleeve: {c.measurements?.sleeve}"
                      </p>
                      {c.specialInstructions && <p className="instructions">Note: "{c.specialInstructions}"</p>}
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleStatusSubmit} className="admin-form">
                <div className="form-group">
                  <label>Select New Order Status (Updates User Flipkart-Style Timeline) *</label>
                  <select value={updateStatus} onChange={(e) => setUpdateStatus(e.target.value)}>
                    {statusOptions.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group margin-top-sm">
                  <label>Status Update Note (Visible on User Order Tracker)</label>
                  <input
                    type="text"
                    placeholder="e.g. Master tailor completed stitching; sent for pressing."
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                  />
                </div>

                <div className="margin-top-md flex-between">
                  <button type="button" onClick={() => setSelectedOrder(null)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Order Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
