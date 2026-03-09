import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getDashboardStats, selectDashboardStats, selectAdminLoading } from '../redux/slices/adminSlice';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const stats = useSelector(selectDashboardStats);
  const loading = useSelector(selectAdminLoading);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.firstName}!</p>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings || 0}
          icon="📅"
          color="blue"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${(stats.totalRevenue || 0).toLocaleString()}`}
          icon="💰"
          color="green"
        />
        <StatCard
          title="Active Services"
          value={stats.activeServices || 0}
          icon="🧹"
          color="purple"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers || 0}
          icon="👥"
          color="orange"
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/admin/dashboard" className="action-btn">
              <span className="action-icon">📊</span>
              <span>Dashboard</span>
            </Link>
            <Link to="/admin/bookings" className="action-btn">
              <span className="action-icon">📅</span>
              <span>Manage Bookings</span>
            </Link>
            <Link to="/admin/orders" className="action-btn">
              <span className="action-icon">📦</span>
              <span>Order Tracking</span>
            </Link>
            <Link to="/admin/payments" className="action-btn">
              <span className="action-icon">💳</span>
              <span>Payment Transactions</span>
            </Link>
            <Link to="/admin/services" className="action-btn">
              <span className="action-icon">⚙️</span>
              <span>Manage Services</span>
            </Link>
            <Link to="/admin/users" className="action-btn">
              <span className="action-icon">👥</span>
              <span>Manage Customers</span>
            </Link>
            <Link to="/admin/reports" className="action-btn">
              <span className="action-icon">📈</span>
              <span>View Reports</span>
            </Link>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">📅</div>
                  <div className="activity-content">
                    <p>
                      Booking {activity.status} - ₹{activity.pricing?.total || 0}
                    </p>
                    <span className="activity-time">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="activity-item">
                  <div className="activity-icon">📅</div>
                  <div className="activity-content">
                    <p>New booking created</p>
                    <span className="activity-time">2 minutes ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">💰</div>
                  <div className="activity-content">
                    <p>Payment received</p>
                    <span className="activity-time">15 minutes ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">⭐</div>
                  <div className="activity-content">
                    <p>New review submitted</p>
                    <span className="activity-time">1 hour ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">👤</div>
                  <div className="activity-content">
                    <p>New customer registered</p>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Quick Stats</h2>
          <div className="quick-stats">
            <div className="quick-stat-item">
              <span className="quick-stat-label">Total Revenue</span>
              <span className="quick-stat-value">₹{(stats.totalRevenue || 0).toLocaleString()}</span>
            </div>
            <div className="quick-stat-item">
              <span className="quick-stat-label">Active Services</span>
              <span className="quick-stat-value">{stats.activeServices || 0}</span>
            </div>
            <div className="quick-stat-item">
              <span className="quick-stat-label">Total Customers</span>
              <span className="quick-stat-value">{stats.totalCustomers || 0}</span>
            </div>
            <div className="quick-stat-item">
              <span className="quick-stat-label">Total Bookings</span>
              <span className="quick-stat-value">{stats.totalBookings || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;