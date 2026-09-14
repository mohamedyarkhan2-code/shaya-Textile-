import React, { useState, useEffect } from 'react';
import { getAllUsersApi } from '../../services/api';
import { Users, MapPin, Phone, Mail, ShieldCheck, Globe } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getAllUsersApi();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-users">
      <h2>Registered Customers & User Location Details</h2>
      <p className="text-muted margin-bottom-md">
        Admin dashboard view of all registered users, delivery addresses, and captured GPS location coordinates.
      </p>

      {loading ? (
        <div className="loading-container">Loading customer location directory...</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Contact Info</th>
                <th>Role</th>
                <th>Delivery Address</th>
                <th>Captured GPS Coordinates / Location</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((usr) => (
                <tr key={usr._id}>
                  <td>
                    <strong>{usr.name}</strong>
                  </td>
                  <td>
                    <div className="user-contact">
                      <span><Mail size={12} /> {usr.email}</span>
                      {usr.phone && <span><Phone size={12} /> {usr.phone}</span>}
                    </div>
                  </td>
                  <td>
                    <span className={usr.role === 'admin' ? 'badge badge-admin' : 'badge badge-user'}>
                      {usr.role.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {usr.address?.street ? (
                      <div>
                        <p><MapPin size={12} /> {usr.address.street}</p>
                        <small className="text-muted">{usr.address.city}, {usr.address.state} - {usr.address.pincode}</small>
                      </div>
                    ) : (
                      <span className="text-muted">No address stored</span>
                    )}
                  </td>
                  <td>
                    {usr.locationDetails?.latitude ? (
                      <div className="location-badge-pill">
                        <Globe size={12} /> Lat: {usr.locationDetails.latitude.toFixed(4)}, Lng: {usr.locationDetails.longitude.toFixed(4)}
                        <br />
                        <small className="text-muted">
                          {usr.locationDetails.city || 'City Auto'}, {usr.locationDetails.state || 'State Auto'}
                        </small>
                      </div>
                    ) : (
                      <span className="text-muted">GPS pending</span>
                    )}
                  </td>
                  <td>{new Date(usr.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
