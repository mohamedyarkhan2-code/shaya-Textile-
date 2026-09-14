import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, User } from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        setError('This portal is reserved for Administrators only. Please use Customer Login.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin email or password');
    } finally {
      setLoading(false);
    }
  };

  const autofillAdmin1 = () => {
    setEmail('mohamedyarkhan07@gmail.com');
    setPassword('Admin@123');
  };

  const autofillAdmin2 = () => {
    setEmail('admin@shayatextile.com');
    setPassword('Admin@123');
  };

  return (
    <div className="admin-login-page container">
      <div className="admin-login-card animate-fade-in">
        <div className="admin-login-header">
          <div className="admin-badge-icon">
            <ShieldCheck size={32} />
          </div>
          <h2>Executive Admin Portal</h2>
          <p>Restricted authentication portal for Shaya Textile administrators.</p>
        </div>

        {error && <div className="admin-error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label>Admin Email Address *</label>
            <div className="input-icon-box">
              <Mail size={18} className="field-icon" />
              <input
                type="email"
                placeholder="mohamedyarkhan07@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group margin-top-sm">
            <label>Admin Password *</label>
            <div className="input-icon-box">
              <Lock size={18} className="field-icon" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary width-100 margin-top-md admin-submit-btn">
            {loading ? 'Authenticating Admin...' : 'Enter Admin Control Center'} <ArrowRight size={18} />
          </button>
        </form>

        {/* Fast Admin Autofill */}
        <div className="admin-autofill-section">
          <p className="autofill-title">⚡ Fast Admin Login Autofill:</p>
          <div className="autofill-grid">
            <button type="button" onClick={autofillAdmin1} className="autofill-btn">
              <ShieldCheck size={14} /> Mohamed Yar Khan (Admin)
            </button>
            <button type="button" onClick={autofillAdmin2} className="autofill-btn">
              <ShieldCheck size={14} /> Shaya Admin
            </button>
          </div>
        </div>

        <div className="admin-login-footer">
          <span>Not an Administrator? </span>
          <Link to="/login" className="switch-portal-link">
            <User size={14} /> Switch to Customer Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
