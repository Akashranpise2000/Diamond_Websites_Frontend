import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getBookings, updateBooking, selectBookings, selectBookingsPagination, selectBookingsLoading, selectBookingsFilters, setFilters } from '../../redux/slices/bookingSlice';
import './AdminBookings.css';

const AdminBookings = () => {
  const dispatch = useDispatch();
  const bookings = useSelector(selectBookings);
  const pagination = useSelector(selectBookingsPagination);
  const loading = useSelector(selectBookingsLoading);
  const filters = useSelector(selectBookingsFilters);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchBookings();
  }, [filters, sortBy, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBookings = () => {
    dispatch(getBookings({
      ...filters,
      sort: `${sortOrder === 'desc' ? '-' : ''}${sortBy}`,
      page: pagination.page,
      limit: pagination.limit
    }));
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await dispatch(updateBooking({ id: bookingId, data: { status: newStatus } })).unwrap();
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handlePageChange = (newPage) => {
    dispatch(setFilters({ page: newPage }));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'success';
      case 'completed': return 'info';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading && bookings.length === 0) {
    return <div className="loading">Loading bookings...</div>;
  }

  return (
    <div className="admin-bookings">
      <div className="page-header">
        <h1>Bookings Management</h1>
        <div className="filter-controls">
          <div className="filter-group">
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange({ status: e.target.value })}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="filter-group">
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange({ startDate: e.target.value })}
              className="date-input"
              placeholder="Start Date"
            />
          </div>
          <div className="filter-group">
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange({ endDate: e.target.value })}
              className="date-input"
              placeholder="End Date"
            />
          </div>
          <div className="filter-group">
            <select
              value={`${sortBy}_${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('_');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="filter-select"
            >
              <option value="createdAt_desc">Newest First</option>
              <option value="createdAt_asc">Oldest First</option>
              <option value="scheduledDate_desc">Latest Schedule</option>
              <option value="scheduledDate_asc">Earliest Schedule</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bookings-stats">
        <div className="stat-card">
          <h3>{bookings.filter(b => b.status === 'pending').length}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>{bookings.filter(b => b.status === 'confirmed').length}</h3>
          <p>Confirmed</p>
        </div>
        <div className="stat-card">
          <h3>{bookings.filter(b => b.status === 'completed').length}</h3>
          <p>Completed</p>
        </div>
        <div className="stat-card">
          <h3>₹{bookings.reduce((sum, b) => sum + (b.pricing?.total || 0), 0).toLocaleString()}</h3>
          <p>Total Revenue</p>
        </div>
      </div>

      <div className="bookings-table-container">
        <table className="bookings-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('bookingNumber')} className="sortable">
                Booking Number {sortBy === 'bookingNumber' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Customer</th>
              <th>Service</th>
              <th onClick={() => handleSort('scheduledDate')} className="sortable">
                Date & Time {sortBy === 'scheduledDate' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('totalAmount')} className="sortable">
                Amount {sortBy === 'totalAmount' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.bookingNumber}</td>
                <td>
                  <div className="customer-info">
                    <div className="customer-name">
                      {booking.customerId ? `${booking.customerId.firstName} ${booking.customerId.lastName}` : 'Anonymous'}
                    </div>
                    <div className="customer-contact">{booking.customerId?.email || 'N/A'}</div>
                    <div className="customer-phone">{booking.customerId?.phone || 'N/A'}</div>
                  </div>
                </td>
                <td>
                  <div className="service-info">
                    <div className="service-name">
                      {booking.services && booking.services.length > 0 ? booking.services[0].serviceName : 'N/A'}
                    </div>
                    <div className="service-category">
                      {booking.services && booking.services.length > 0 ? `${booking.services.length} service(s)` : 'N/A'}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="booking-datetime">
                    <div>{booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString() : 'N/A'}</div>
                    <div>{booking.scheduledTimeSlot || 'N/A'}</div>
                  </div>
                </td>
                <td>₹{(booking.pricing?.total || 0).toLocaleString()}</td>
                <td>
                  <span className={`status status--${getStatusColor(booking.status)}`}>
                    {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Unknown'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {booking.status === 'pending' && (
                      <button
                        className="btn btn--small btn--success"
                        onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                      >
                        Confirm
                      </button>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        className="btn btn--small btn--info"
                        onClick={() => handleStatusUpdate(booking._id, 'completed')}
                      >
                        Complete
                      </button>
                    )}
                    {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                      <button
                        className="btn btn--small btn--danger"
                        onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                      >
                        Cancel
                      </button>
                    )}
                    <button className="btn btn--small btn--secondary">
                      View Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookings.length === 0 && (
        <div className="no-bookings">
          <p>No bookings found matching the current filters.</p>
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
            Page {pagination.page} of {pagination.pages} ({pagination.total} total bookings)
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
    </div>
  );
};

export default AdminBookings;