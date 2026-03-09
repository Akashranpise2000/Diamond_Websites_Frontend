import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: '📊',
      label: 'Dashboard Overview',
      description: 'Overview and statistics'
    },
    {
      path: '/admin/bookings',
      icon: '📅',
      label: 'Bookings Management',
      description: 'View and manage bookings'
    },
    {
      path: '/admin/orders',
      icon: '📦',
      label: 'Order Tracking',
      description: 'Track and manage orders'
    },
    {
      path: '/admin/payments',
      icon: '💳',
      label: 'Payment Transactions',
      description: 'Monitor payments and revenue'
    },
    {
      path: '/admin/users',
      icon: '👥',
      label: 'User Management',
      description: 'Manage customers and roles'
    },
    {
      path: '/admin/services',
      icon: '🧹',
      label: 'Services Management',
      description: 'Add, edit, delete services'
    },
    {
      path: '/admin/reports',
      icon: '📈',
      label: 'Reports & Analytics',
      description: 'View analytics and reports'
    }
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
        <p>Diamond House Cleaning</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <div className="sidebar-link-content">
              <span className="sidebar-icon">{item.icon}</span>
              <div className="sidebar-text">
                <span className="sidebar-label">{item.label}</span>
                <span className="sidebar-description">{item.description}</span>
              </div>
            </div>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="sidebar-back-link">
          ← Back to Website
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;