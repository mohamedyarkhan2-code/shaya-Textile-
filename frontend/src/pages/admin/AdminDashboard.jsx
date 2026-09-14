import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrdersApi, getProductsApi, getMaterialsApi, getAllUsersApi } from '../../services/api';
import { 
  ShoppingBag, DollarSign, Package, Scissors, Users, ArrowUpRight, 
  TrendingUp, BarChart2, PieChart, Activity 
} from 'lucide-react';

// Month data for charts
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DEMO_REVENUE = [42000, 58000, 71000, 54000, 83000, 97000, 112000, 135000, 128000, 151000, 174000, 198000];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    productsCount: 0,
    materialsCount: 0,
    usersCount: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartMonth, setChartMonth] = useState(new Date().getMonth());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, prodsRes, matsRes, usersRes] = await Promise.all([
          getAllOrdersApi(),
          getProductsApi({ category: 'all' }),
          getMaterialsApi({ category: 'all' }),
          getAllUsersApi(),
        ]);

        const orders = ordersRes.data;
        const totalRev = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);

        setStats({
          totalOrders: orders.length,
          totalRevenue: totalRev,
          productsCount: prodsRes.data.length,
          materialsCount: matsRes.data.length,
          usersCount: usersRes.data.length,
        });

        setRecentOrders(orders.slice(0, 6));
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="dashboard-loading">
      <div className="spinner" />
      <p>Loading dashboard metrics...</p>
    </div>
  );

  const maxRevenue = Math.max(...DEMO_REVENUE);
  const chartHeight = 160;

  const statCards = [
    { icon: <DollarSign size={22} />, label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, change: '+24.8%', color: '#2b8a3e' },
    { icon: <ShoppingBag size={22} />, label: 'Total Orders', value: stats.totalOrders, change: '+12.3%', color: '#1971c2' },
    { icon: <Package size={22} />, label: 'Ready-Made Products', value: stats.productsCount, change: 'In catalog', color: '#862e9c' },
    { icon: <Scissors size={22} />, label: 'Custom Fabrics', value: stats.materialsCount, change: 'Materials', color: '#c92a2a' },
    { icon: <Users size={22} />, label: 'Registered Users', value: stats.usersCount, change: 'All time', color: '#e67700' },
  ];

  const getStatusClass = (status) => {
    const s = status?.toLowerCase();
    if (s === 'delivered') return 'badge-success';
    if (s === 'shipped') return 'badge-warning';
    if (s === 'pending' || s === 'placed') return 'badge-user';
    return 'badge-admin';
  };

  return (
    <div className="admin-dashboard">
      {/* ── Header ── */}
      <div className="dashboard-top-bar">
        <div>
          <h2>Control Center Dashboard</h2>
          <p className="text-muted">Live metrics overview for Shaya Textile operations</p>
        </div>
        <span className="badge badge-admin"><Activity size={12} /> LIVE ADMIN VIEW</span>
      </div>

      {/* ── Stat Cards ── */}
      <div className="admin-stats-grid">
        {statCards.map((sc, idx) => (
          <div key={idx} className="stat-card-new animate-fade-in" style={{ animationDelay: `${idx * 0.07}s` }}>
            <div className="stat-icon-new" style={{ background: sc.color + '18', color: sc.color }}>
              {sc.icon}
            </div>
            <div className="stat-details">
              <span className="stat-label-sm">{sc.label}</span>
              <div className="stat-value-lg">{sc.value}</div>
              <span className="stat-change-tag">{sc.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Grid ── */}
      <div className="charts-grid-2 margin-top-lg">
        {/* Revenue Bar Chart */}
        <div className="chart-card">
          <div className="chart-header-flex">
            <div>
              <h3><BarChart2 size={18} style={{ display:'inline', marginRight:6 }} />Sales Revenue Trend</h3>
              <p className="text-muted" style={{ fontSize:'0.82rem', marginTop:3 }}>Monthly revenue for current year</p>
            </div>
            <span className="badge badge-success">↑ +24.8%</span>
          </div>

          {/* SVG Bar Chart */}
          <div className="svg-chart-container">
            <svg viewBox="0 0 540 200" className="revenue-svg">
              {/* Y-axis gridlines */}
              {[0, 1, 2, 3].map(i => (
                <line key={i} x1="36" y1={20 + i * 40} x2="520" y2={20 + i * 40}
                  stroke="#f1f3f5" strokeWidth="1.5" strokeDasharray="4,3" />
              ))}

              {/* Y labels */}
              {[200, 150, 100, 50].map((v, i) => (
                <text key={i} x="30" y={24 + i * 40} textAnchor="end" fontSize="9" fill="#adb5bd" fontWeight="600">
                  {v}k
                </text>
              ))}

              {/* Bars + Month Labels */}
              {DEMO_REVENUE.map((rev, i) => {
                const barH = (rev / maxRevenue) * chartHeight;
                const x = 46 + i * 40;
                const isCurrent = i === chartMonth;
                return (
                  <g key={i}>
                    <rect
                      x={x} y={180 - barH} width={22} height={barH} rx={5}
                      fill={isCurrent ? '#1a1d20' : '#dee2e6'}
                    />
                    <text x={x + 11} y={195} textAnchor="middle" fontSize="9" fill="#6c757d" fontWeight="600">
                      {MONTH_LABELS[i]}
                    </text>
                    {isCurrent && (
                      <text x={x + 11} y={175 - barH} textAnchor="middle" fontSize="9" fill="#1a1d20" fontWeight="800">
                        ₹{(rev / 1000).toFixed(0)}k
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Trend Line */}
              <polyline
                fill="none" stroke="#495057" strokeWidth="2" strokeDasharray="none"
                points={DEMO_REVENUE.map((rev, i) => {
                  const barH = (rev / maxRevenue) * chartHeight;
                  return `${57 + i * 40},${180 - barH}`;
                }).join(' ')}
              />

              {/* Trend dots */}
              {DEMO_REVENUE.map((rev, i) => {
                const barH = (rev / maxRevenue) * chartHeight;
                const isCurrent = i === chartMonth;
                return (
                  <circle key={i} cx={57 + i * 40} cy={180 - barH} r={isCurrent ? 5 : 3}
                    fill={isCurrent ? '#1a1d20' : '#ffffff'} stroke="#495057" strokeWidth="2" />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="chart-card">
          <div className="chart-header-flex" style={{ marginBottom: '1.25rem' }}>
            <div>
              <h3><PieChart size={18} style={{ display:'inline', marginRight:6 }} />Sales By Category</h3>
              <p className="text-muted" style={{ fontSize:'0.82rem', marginTop:3 }}>Revenue breakdown by garment type</p>
            </div>
          </div>

          {/* Donut SVG Chart */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <svg viewBox="0 0 120 120" style={{ width: 120, flexShrink: 0 }}>
              {/* Shirts: 48% */}
              <circle cx="60" cy="60" r="40" fill="none" stroke="#dee2e6" strokeWidth="20" />
              <circle cx="60" cy="60" r="40" fill="none" stroke="#1a1d20" strokeWidth="20"
                strokeDasharray={`${0.48 * 251} ${251}`} strokeDashoffset="0"
                transform="rotate(-90 60 60)" />
              <circle cx="60" cy="60" r="40" fill="none" stroke="#495057" strokeWidth="20"
                strokeDasharray={`${0.34 * 251} ${251}`} strokeDashoffset={`${-0.48 * 251}`}
                transform="rotate(-90 60 60)" />
              <circle cx="60" cy="60" r="40" fill="none" stroke="#adb5bd" strokeWidth="20"
                strokeDasharray={`${0.18 * 251} ${251}`} strokeDashoffset={`${-(0.48 + 0.34) * 251}`}
                transform="rotate(-90 60 60)" />
              <text x="60" y="56" textAnchor="middle" fontSize="13" fontWeight="900" fill="#1a1d20">64%</text>
              <text x="60" y="68" textAnchor="middle" fontSize="8" fill="#6c757d" fontWeight="600">CUSTOM</text>
            </svg>

            <div style={{ flex: 1 }}>
              {[
                { label: 'Executive Shirts', pct: 48, amt: '₹84,500', color: '#1a1d20' },
                { label: 'Tailored Pants', pct: 34, amt: '₹59,800', color: '#495057' },
                { label: 'Pima T-Shirts', pct: 18, amt: '₹31,600', color: '#adb5bd' },
              ].map((item) => (
                <div key={item.label} style={{ marginBottom: '0.75rem' }}>
                  <div className="flex-between" style={{ marginBottom: '0.3rem', fontSize: '0.82rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: item.color, display:'inline-block' }} />
                      {item.label}
                    </span>
                    <strong>{item.pct}%</strong>
                  </div>
                  <div className="bar-bg">
                    <div className="bar-fill" style={{ width: `${item.pct}%`, background: item.color }} />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', textAlign:'right' }}>{item.amt}</p>
                </div>
              ))}

              <div className="ratio-stat-box">
                <div className="r-stat"><h4>64%</h4><p>Custom Tailored</p></div>
                <div className="r-stat"><h4>36%</h4><p>Ready-Made</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Orders Table ── */}
      <div className="recent-orders-section margin-top-lg">
        <div className="flex-between margin-bottom-md">
          <h3>Recent Customer Orders</h3>
          <Link to="/admin/orders" className="link-with-arrow">
            View All Orders <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No orders yet. Orders will appear here once customers start purchasing.
                  </td>
                </tr>
              ) : (
                recentOrders.map((ord) => (
                  <tr key={ord._id}>
                    <td><strong style={{ fontFamily: 'Outfit, sans-serif' }}>{ord.orderId}</strong></td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{ord.user?.name || ord.shippingAddress?.name}</div>
                      <small className="text-muted">{ord.shippingAddress?.city}, {ord.shippingAddress?.state}</small>
                    </td>
                    <td>
                      <span className="badge badge-user">{ord.orderType?.toUpperCase()}</span>
                    </td>
                    <td style={{ fontWeight: 700 }}>₹{ord.totalAmount?.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge ${getStatusClass(ord.status)}`}>{ord.status}</span>
                    </td>
                    <td>
                      <Link to={`/track-order?orderId=${ord.orderId}`} className="btn btn-secondary btn-sm">
                        Track
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
