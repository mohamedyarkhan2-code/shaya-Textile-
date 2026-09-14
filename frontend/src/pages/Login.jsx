import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scissors, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (redirect) {
        navigate(`/${redirect}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdminLogin = () => {
    setEmail('admin@shayatextile.com');
    setPassword('Admin@123');
  };

  const handleDemoUserLogin = () => {
    setEmail('rahul@example.com');
    setPassword('User@123');
  };

  return (
    <div className="auth-page container">
      <div className="auth-card animate-fade-in">
        <div className="auth-brand-header">
          <div className="auth-logo">
            <Scissors size={24} />
          </div>
          <span className="badge badge-user">CUSTOMER PORTAL LOGIN</span>
          <h2>Customer Sign In</h2>
          <p>Sign in to your customer account to view custom tailoring orders and track packages.</p>
        </div>

        {error && <div className="auth-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Customer Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group margin-top-sm">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary width-100 margin-top-sm">
            {loading ? 'Signing in...' : 'Sign In to Customer Account'} <ArrowRight size={18} />
          </button>
        </form>

        {/* Separate Admin Portal Link Box */}
        <div className="admin-portal-switch-box margin-top-md">
          <Link to="/admin/login" className="btn btn-secondary width-100">
            <ShieldCheck size={16} /> Switch to Executive Admin Login Portal
          </Link>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="demo-credentials-box">
          <p className="demo-title">⚡ Fast Demo Logins (Click to autofill):</p>
          <div className="demo-btns">
            <button type="button" onClick={handleDemoUserLogin} className="demo-btn user-demo">
              Customer (rahul@example.com)
            </button>
            <button type="button" onClick={() => { setEmail('mohamedyarkhan07@gmail.com'); setPassword('Admin@123'); }} className="demo-btn admin-demo">
              <ShieldCheck size={14} /> Mohamed Yar Khan (Admin)
            </button>
          </div>
        </div>

        <div className="auth-footer-link">
          Don't have an account? <Link to="/register">Create One</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
