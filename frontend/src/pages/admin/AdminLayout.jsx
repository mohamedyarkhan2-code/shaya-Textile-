import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, LayoutDashboard, Package, Scissors, ShoppingBag, Users, MapPin } from 'lucide-react';
import './Admin.css';

const AdminLayout = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <div className="loading-container">Verifying admin privileges...</div>;

  // STRICT GUARD: ADMIN PANEL ONLY SEEN BY ADMIN
  if (!user || !isAdmin) {
    return (
      <div className="admin-access-denied container">
        <ShieldCheck size={60} className="denied-icon" />
        <h2>Access Restricted to Admin Only</h2>
        <p>The Admin Panel is strictly protected and only accessible by authorized Shaya Textile Administrators.</p>
        <Navigate to="/admin/login" replace />
      </div>
    );
  }

  return (
    <div className="admin-layout container">
      <div className="admin-header">
        <div className="badge badge-admin">
          <ShieldCheck size={14} /> EXECUTIVE ADMIN PANEL
        </div>
        <h1>Shaya Textile Control Center</h1>
        <p>Manage Ready-Made Apparel, Custom Fabrics, Live Customer Orders & Location Details.</p>
      </div>

      <div className="admin-body">
        {/* Admin Navigation Tabs */}
        <div className="admin-nav-tabs">
          <NavLink to="/admin" end className={({ isActive }) => `admin-tab ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `admin-tab ${isActive ? 'active' : ''}`}>
            <Package size={18} /> Ready-Made Products
          </NavLink>
          <NavLink to="/admin/materials" className={({ isActive }) => `admin-tab ${isActive ? 'active' : ''}`}>
            <Scissors size={18} /> Custom Fabrics / Cloths
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => `admin-tab ${isActive ? 'active' : ''}`}>
            <ShoppingBag size={18} /> Orders & Status
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `admin-tab ${isActive ? 'active' : ''}`}>
            <Users size={18} /> Users & Location Details
          </NavLink>
        </div>

        {/* Admin Page Content */}
        <div className="admin-content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
