import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaCalendarAlt,
  FaHistory,
  FaStar,
  FaBell,
  FaPlus,
  FaCog,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSearch,
  FaEye,
  FaEdit
} from 'react-icons/fa';
import {
  getProfile,
  getLoyaltyPoints,
  getNotifications,
  markNotificationRead
} from '../redux/slices/userSlice';
import {
  getBookings,
  getUpcomingBookings,
  cancelBooking,
  setFilters
} from '../redux/slices/bookingSlice';
import '../styles/global.css';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { profile, loyaltyPoints, notifications, loading: userLoading } = useSelector(state => state.user);
  const { bookings, upcomingBookings, loading: bookingLoading, filters } = useSelector(state => state.bookings);

  const [activeTab, setActiveTab] = useState('overview');
  const [bookingFilter, setBookingFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load initial data
    dispatch(getProfile());
    dispatch(getLoyaltyPoints());
    dispatch(getNotifications());
    dispatch(getBookings({ limit: 5, sort: '-createdAt' })); // Recent bookings
    dispatch(getUpcomingBookings(168)); // Next 7 days
  }, [dispatch, isAuthenticated, navigate]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await dispatch(cancelBooking({ id: bookingId, reason: 'Cancelled by user' })).unwrap();
        // Refresh bookings
        dispatch(getBookings({ limit: 5, sort: '-createdAt' }));
        dispatch(getUpcomingBookings(168));
      } catch (error) {
        console.error('Failed to cancel booking:', error);
      }
    }
  };

  const handleMarkNotificationRead = (notificationId) => {
    dispatch(markNotificationRead(notificationId));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-success';
      case 'completed': return 'text-success';
      case 'pending': return 'text-warning';
      case 'cancelled': return 'text-error';
      case 'in-progress': return 'text-info';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <FaCheckCircle />;
      case 'completed': return <FaCheckCircle />;
      case 'pending': return <FaClock />;
      case 'cancelled': return <FaTimesCircle />;
      case 'in-progress': return <FaClock />;
      default: return <FaClock />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (bookingFilter === 'all') return true;
    return booking.status === bookingFilter;
  });

  if (userLoading || bookingLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome back, {user?.firstName}!</h1>
          <p className="dashboard-subtitle">Manage your bookings and account information</p>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link to="/booking" className="action-card">
            <FaPlus className="action-icon" />
            <span>Book New Service</span>
          </Link>
          <Link to="/profile" className="action-card">
            <FaCog className="action-icon" />
            <span>Edit Profile</span>
          </Link>
          <Link to="/contact" className="action-card">
            <FaPhone className="action-icon" />
            <span>Contact Support</span>
          </Link>
          <Link to="/services" className="action-card">
            <FaSearch className="action-icon" />
            <span>View Services</span>
          </Link>
        </div>

        <div className="dashboard-content">
          {/* Sidebar Navigation */}
          <div className="dashboard-sidebar">
            <nav className="sidebar-nav">
              <button
                className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <FaUser />
                Overview
              </button>
              <button
                className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                <FaCalendarAlt />
                My Bookings
              </button>
              <button
                className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                <FaHistory />
                Booking History
              </button>
              <button
                className={`nav-item ${activeTab === 'rewards' ? 'active' : ''}`}
                onClick={() => setActiveTab('rewards')}
              >
                <FaStar />
                Rewards
              </button>
              <button
                className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <FaBell />
                Notifications
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="dashboard-main">
            {activeTab === 'overview' && (
              <div className="overview-section">
                {/* Profile Summary */}
                <div className="profile-summary card">
                  <div className="profile-header">
                    <div className="profile-avatar">
                      <FaUser />
                    </div>
                    <div className="profile-info">
                      <h3>{profile?.firstName} {profile?.lastName}</h3>
                      <p>{profile?.email}</p>
                      <p>{profile?.phone}</p>
                    </div>
                  </div>
                  <div className="profile-details">
                    <div className="detail-item">
                      <FaMapMarkerAlt />
                      <span>{profile?.addresses?.[0]?.city || 'No address set'}</span>
                    </div>
                    <div className="detail-item">
                      <FaStar />
                      <span>{loyaltyPoints || 0} Loyalty Points</span>
                    </div>
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="recent-bookings card">
                  <div className="section-header">
                    <h3>Recent Bookings</h3>
                    <Link to="/dashboard?tab=bookings" className="view-all">View All</Link>
                  </div>
                  <div className="bookings-list">
                    {bookings.slice(0, 3).map(booking => (
                      <div key={booking._id} className="booking-item">
                        <div className="booking-info">
                          <h4>{booking.service?.name}</h4>
                          <p>{formatDate(booking.scheduledDate)} at {formatTime(booking.scheduledDate)}</p>
                          <p className={`status ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </p>
                        </div>
                        <div className="booking-actions">
                          <button className="btn btn--small">
                            <FaEye />
                          </button>
                          {booking.status === 'pending' && (
                            <button
                              className="btn btn--small btn--danger"
                              onClick={() => handleCancelBooking(booking._id)}
                            >
                              <FaTimesCircle />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <p className="no-data">No recent bookings found.</p>
                    )}
                  </div>
                </div>

                {/* Upcoming Bookings */}
                <div className="upcoming-bookings card">
                  <div className="section-header">
                    <h3>Upcoming Bookings</h3>
                    <Link to="/dashboard?tab=bookings" className="view-all">View All</Link>
                  </div>
                  <div className="calendar-preview">
                    {/* Simple calendar view - could be enhanced with a proper calendar library */}
                    <div className="calendar-grid">
                      {upcomingBookings.slice(0, 5).map(booking => (
                        <div key={booking._id} className="calendar-item">
                          <div className="date">
                            <span className="day">{new Date(booking.scheduledDate).getDate()}</span>
                            <span className="month">
                              {new Date(booking.scheduledDate).toLocaleDateString('en-IN', { month: 'short' })}
                            </span>
                          </div>
                          <div className="event">
                            <h5>{booking.service?.name}</h5>
                            <p>{formatTime(booking.scheduledDate)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {upcomingBookings.length === 0 && (
                      <p className="no-data">No upcoming bookings.</p>
                    )}
                  </div>
                </div>

                {/* Loyalty Points */}
                <div className="loyalty-card card">
                  <div className="loyalty-header">
                    <FaStar className="loyalty-icon" />
                    <div>
                      <h3>Loyalty Points</h3>
                      <p className="points">{loyaltyPoints || 0}</p>
                    </div>
                  </div>
                  <div className="loyalty-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${Math.min((loyaltyPoints || 0) / 1000 * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="progress-text">
                      {1000 - (loyaltyPoints || 0)} points to next reward
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="bookings-section">
                <div className="section-header">
                  <h2>My Bookings</h2>
                  <Link to="/booking" className="btn btn--primary">
                    <FaPlus />
                    New Booking
                  </Link>
                </div>

                <div className="bookings-filters">
                  <button
                    className={`filter-btn ${bookingFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setBookingFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={`filter-btn ${bookingFilter === 'pending' ? 'active' : ''}`}
                    onClick={() => setBookingFilter('pending')}
                  >
                    Pending
                  </button>
                  <button
                    className={`filter-btn ${bookingFilter === 'confirmed' ? 'active' : ''}`}
                    onClick={() => setBookingFilter('confirmed')}
                  >
                    Confirmed
                  </button>
                  <button
                    className={`filter-btn ${bookingFilter === 'completed' ? 'active' : ''}`}
                    onClick={() => setBookingFilter('completed')}
                  >
                    Completed
                  </button>
                </div>

                <div className="bookings-list detailed">
                  {filteredBookings.map(booking => (
                    <div key={booking._id} className="booking-card">
                      <div className="booking-header">
                        <h4>{booking.service?.name}</h4>
                        <span className={`status-badge ${booking.status}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <div className="booking-details">
                        <div className="detail-row">
                          <FaCalendarAlt />
                          <span>{formatDate(booking.scheduledDate)} at {formatTime(booking.scheduledDate)}</span>
                        </div>
                        <div className="detail-row">
                          <FaMapMarkerAlt />
                          <span>{booking.address?.street}, {booking.address?.city}</span>
                        </div>
                        <div className="detail-row">
                          <span>₹{booking.totalAmount}</span>
                        </div>
                      </div>
                      <div className="booking-actions">
                        <button className="btn btn--small">
                          <FaEye />
                          View
                        </button>
                        {booking.status === 'pending' && (
                          <>
                            <button className="btn btn--small btn--secondary">
                              <FaEdit />
                              Edit
                            </button>
                            <button
                              className="btn btn--small btn--danger"
                              onClick={() => handleCancelBooking(booking._id)}
                            >
                              <FaTimesCircle />
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredBookings.length === 0 && (
                    <div className="no-data">
                      <p>No bookings found with the selected filter.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="history-section">
                <div className="section-header">
                  <h2>Booking History</h2>
                </div>

                <div className="history-filters">
                  <select
                    value={filters.status || ''}
                    onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
                    className="form-select"
                  >
                    <option value="">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <input
                    type="date"
                    value={filters.startDate || ''}
                    onChange={(e) => dispatch(setFilters({ startDate: e.target.value }))}
                    className="form-input"
                    placeholder="Start Date"
                  />
                  <input
                    type="date"
                    value={filters.endDate || ''}
                    onChange={(e) => dispatch(setFilters({ endDate: e.target.value }))}
                    className="form-input"
                    placeholder="End Date"
                  />
                </div>

                <div className="history-list">
                  {bookings
                    .filter(booking => booking.status === 'completed' || booking.status === 'cancelled')
                    .map(booking => (
                      <div key={booking._id} className="history-item">
                        <div className="history-info">
                          <h4>{booking.service?.name}</h4>
                          <p>{formatDate(booking.scheduledDate)}</p>
                          <p className={`status ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </p>
                        </div>
                        <div className="history-amount">
                          <span>₹{booking.totalAmount}</span>
                        </div>
                        <div className="history-actions">
                          <button className="btn btn--small">
                            <FaEye />
                            Details
                          </button>
                          <button className="btn btn--small btn--secondary">
                            <FaStar />
                            Review
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === 'rewards' && (
              <div className="rewards-section">
                <div className="section-header">
                  <h2>Loyalty Program</h2>
                </div>

                <div className="loyalty-overview card">
                  <div className="loyalty-stats">
                    <div className="stat-item">
                      <h3>{loyaltyPoints || 0}</h3>
                      <p>Current Points</p>
                    </div>
                    <div className="stat-item">
                      <h3>{Math.floor((loyaltyPoints || 0) / 100)}</h3>
                      <p>Completed Services</p>
                    </div>
                    <div className="stat-item">
                      <h3>{Math.max(0, 10 - Math.floor((loyaltyPoints || 0) / 100))}</h3>
                      <p>Services to Next Reward</p>
                    </div>
                  </div>
                </div>

                <div className="rewards-grid">
                  <div className="reward-card">
                    <div className="reward-icon">🎁</div>
                    <h4>Free Deep Clean</h4>
                    <p>1000 points required</p>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${Math.min((loyaltyPoints || 0) / 1000 * 100, 100)}%` }}
                      ></div>
                    </div>
                    <button
                      className="btn btn--primary"
                      disabled={(loyaltyPoints || 0) < 1000}
                    >
                      Redeem
                    </button>
                  </div>

                  <div className="reward-card">
                    <div className="reward-icon">💎</div>
                    <h4>Premium Service Discount</h4>
                    <p>500 points required</p>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${Math.min((loyaltyPoints || 0) / 500 * 100, 100)}%` }}
                      ></div>
                    </div>
                    <button
                      className="btn btn--primary"
                      disabled={(loyaltyPoints || 0) < 500}
                    >
                      Redeem
                    </button>
                  </div>

                  <div className="reward-card">
                    <div className="reward-icon">⭐</div>
                    <h4>Priority Booking</h4>
                    <p>250 points required</p>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${Math.min((loyaltyPoints || 0) / 250 * 100, 100)}%` }}
                      ></div>
                    </div>
                    <button
                      className="btn btn--primary"
                      disabled={(loyaltyPoints || 0) < 250}
                    >
                      Redeem
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="notifications-section">
                <div className="section-header">
                  <h2>Notifications</h2>
                </div>

                <div className="notifications-list">
                  {notifications.map(notification => (
                    <div
                      key={notification._id}
                      className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                    >
                      <div className="notification-content">
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                        <span className="notification-date">
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>
                      {!notification.isRead && (
                        <button
                          className="btn btn--small"
                          onClick={() => handleMarkNotificationRead(notification._id)}
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="no-data">
                      <p>No notifications yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;