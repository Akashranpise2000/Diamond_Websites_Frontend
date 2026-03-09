import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  getAllBookingsAdmin,
  getOrderStatsAdmin,
  selectBookingsAdmin,
  selectBookingsPaginationAdmin,
  selectOrderStatsAdmin,
  selectAdminLoading,
  selectAdminFilters,
  setBookingFilters,
  clearBookingFilters,
  updateBookingAdmin,
  deleteBookingAdmin
} from '../../redux/slices/adminSlice';
import './AdminOrders.css';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const bookings = useSelector(selectBookingsAdmin);
  const pagination = useSelector(selectBookingsPaginationAdmin);
  const orderStats = useSelector(selectOrderStatsAdmin);
  const loading = useSelector(selectAdminLoading);
  const filters = useSelector(selectAdminFilters);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({ status: '', notes: '' });

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, [filters]);

  const fetchBookings = () => {
    dispatch(getAllBookingsAdmin({
      ...filters.bookings,
      page: filters.bookings.page || 1,
      limit: 10
    }));
  };

  const fetchStats = () => {
    dispatch(getOrderStatsAdmin({}));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setBookingFilters({ [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    dispatch(setBookingFilters({ page: newPage }));
  };

  const handleClearFilters = () => {
    dispatch(clearBookingFilters());
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setUpdateData({ status: booking.status, notes: booking.notes || '' });
    setShowUpdateModal(true);
  };

  const handleUpdateBooking = async () => {
    try {
      await dispatch(updateBookingAdmin({
        id: selectedBooking._id,
        data: { status: updateData.status, notes: updateData.notes }
      })).unwrap();
      toast.success('Booking updated successfully');
      setShowUpdateModal(false);
      fetchBookings();
    } catch (error) {
      toast.error(error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await dispatch(deleteBookingAdmin({ id: bookingId, reason: 'Cancelled by admin' })).unwrap();
        toast.success('Booking cancelled successfully');
        fetchBookings();
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'assigned': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      case 'refunded': return 'secondary';
      default: return 'secondary';
    }
  };

  if (loading && bookings.length === 0) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="admin-orders">
      <div className="page-header">
        <h1>Order Management</h1>
        <div className="filter-controls">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search by booking number, customer..."
              value={filters.bookings.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <select
              value={filters.bookings.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="assigned">Assigned</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="filter-group">
            <input
              type="date"
              value={filters.bookings.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="date-input"
              placeholder="Start Date"
            />
          </div>
          <div className="filter-group">
            <input
              type="date"
              value={filters.bookings.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="date-input"
              placeholder="End Date"
            />
          </div>
          <button className="btn btn--small" onClick={handleClearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="orders-stats">
        <div className="stat-card">
          <h3>{orderStats?.overall?.totalBookings || 0}</h3>
          <p>Total Orders</p>
        </div>
        <div className="stat-card">
          <h3>₹{(orderStats?.overall?.totalRevenue || 0).toLocaleString()}</h3>
          <p>Total Revenue</p>
        </div>
        <div className="stat-card">
          <h3>₹{(orderStats?.overall?.avgOrderValue || 0).toLocaleString()}</h3>
          <p>Average Order Value</p>
        </div>
        <div className="stat-card">
          <h3>{orderStats?.period?.bookings || 0}</h3>
          <p>This Period</p>
        </div>
      </div>

      {/* Status Breakdown */}
      {orderStats?.statusBreakdown && (
        <div className="status-breakdown">
          <h3>Orders by Status</h3>
          <div className="status-grid">
            {orderStats.statusBreakdown.map((item, index) => (
              <div key={index} className={`status-card status-card--${getStatusColor(item._id)}`}>
                <span className="status-count">{item.count}</span>
                <span className="status-label">{item._id || 'Unknown'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Popularity */}
      {orderStats?.servicePopularity && orderStats.servicePopularity.length > 0 && (
        <div className="service-popularity">
          <h3>Top Services</h3>
          <div className="service-list">
            {orderStats.servicePopularity.slice(0, 5).map((service, index) => (
              <div key={index} className="service-item">
                <span className="service-rank">{index + 1}</span>
                <span className="service-name">{service._id || 'Unknown'}</span>
                <span className="service-count">{service.count} bookings</span>
                <span className="service-revenue">₹{service.revenue?.toLocaleString() || 0}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Booking #</th>
              <th>Customer</th>
              <th>Services</th>
              <th>Scheduled Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>
                  <div className="booking-number">
                    {booking.bookingNumber}
                  </div>
                </td>
                <td>
                  <div className="customer-info">
                    <div className="customer-name">
                      {booking.customerId ? `${booking.customerId.firstName} ${booking.customerId.lastName}` : 'Anonymous'}
                    </div>
                    <div className="customer-email">
                      {booking.customerId?.email || 'N/A'}
                    </div>
                    <div className="customer-phone">
                      {booking.customerId?.phone || 'N/A'}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="services-info">
                    {booking.services && booking.services.length > 0 ? (
                      <>
                        <div className="primary-service">
                          {booking.services[0].serviceName}
                        </div>
                        <div className="service-count">
                          {booking.services.length} service(s)
                        </div>
                      </>
                    ) : 'N/A'}
                  </div>
                </td>
                <td>
                  <div className="schedule-info">
                    <div>{booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString() : 'N/A'}</div>
                    <div className="time-slot">{booking.scheduledTimeSlot || 'N/A'}</div>
                  </div>
                </td>
                <td className="amount">₹{(booking.pricing?.total || 0).toLocaleString()}</td>
                <td>
                  <span className={`status status--${getStatusColor(booking.status)}`}>
                    {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Unknown'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn--small btn--secondary"
                      onClick={() => handleViewBooking(booking)}
                    >
                      View
                    </button>
                    {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                      <button
                        className="btn btn--small btn--primary"
                        onClick={() => handleEditBooking(booking)}
                      >
                        Edit
                      </button>
                    )}
                    {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                      <button
                        className="btn btn--small btn--danger"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookings.length === 0 && (
        <div className="no-orders">
          <p>No orders found matching the current filters.</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            className="btn btn--small"
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.page} of {pagination.pages} ({pagination.total} total orders)
          </span>
          <button
            className="btn btn--small"
            disabled={pagination.page === pagination.pages}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* View Details Modal */}
      {showModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Booking Information</h4>
                <div className="detail-row">
                  <span className="detail-label">Booking Number:</span>
                  <span className="detail-value">{selectedBooking.bookingNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`status status--${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Scheduled Date:</span>
                  <span className="detail-value">
                    {selectedBooking.scheduledDate ? new Date(selectedBooking.scheduledDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Time Slot:</span>
                  <span className="detail-value">{selectedBooking.scheduledTimeSlot || 'N/A'}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Customer Information</h4>
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">
                    {selectedBooking.customerId ? `${selectedBooking.customerId.firstName} ${selectedBooking.customerId.lastName}` : 'N/A'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedBooking.customerId?.email || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{selectedBooking.customerId?.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Services</h4>
                {selectedBooking.services && selectedBooking.services.map((service, index) => (
                  <div key={index} className="service-detail">
                    <div className="detail-row">
                      <span className="detail-label">Service:</span>
                      <span className="detail-value">{service.serviceName}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Quantity:</span>
                      <span className="detail-value">{service.quantity}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Subtotal:</span>
                      <span className="detail-value">₹{service.subtotal?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="detail-section">
                <h4>Pricing</h4>
                <div className="detail-row">
                  <span className="detail-label">Subtotal:</span>
                  <span className="detail-value">₹{selectedBooking.pricing?.subtotal?.toLocaleString() || 0}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Tax:</span>
                  <span className="detail-value">₹{selectedBooking.pricing?.tax?.toLocaleString() || 0}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total:</span>
                  <span className="detail-value amount">₹{selectedBooking.pricing?.total?.toLocaleString() || 0}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Address</h4>
                <div className="detail-row">
                  <span className="detail-label">Street:</span>
                  <span className="detail-value">{selectedBooking.serviceAddress?.street || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">City:</span>
                  <span className="detail-value">{selectedBooking.serviceAddress?.city || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">State:</span>
                  <span className="detail-value">{selectedBooking.serviceAddress?.state || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ZIP:</span>
                  <span className="detail-value">{selectedBooking.serviceAddress?.zipCode || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Booking Modal */}
      {showUpdateModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Booking</h2>
              <button className="close-btn" onClick={() => setShowUpdateModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Status</label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                  className="form-select"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="assigned">Assigned</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={updateData.notes}
                  onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
                  className="form-textarea"
                  rows={4}
                  placeholder="Add any notes..."
                />
              </div>
              <div className="modal-actions">
                <button className="btn btn--secondary" onClick={() => setShowUpdateModal(false)}>
                  Cancel
                </button>
                <button className="btn btn--primary" onClick={handleUpdateBooking}>
                  Update Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
