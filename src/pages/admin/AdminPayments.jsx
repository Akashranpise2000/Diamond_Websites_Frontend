import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getAllPaymentsAdmin,
  getPaymentStatsAdmin,
  selectPaymentsAdmin,
  selectPaymentStatsAdmin,
  selectPaymentsPaginationAdmin,
  selectAdminLoading,
  selectAdminFilters,
  setPaymentFilters,
  clearPaymentFilters
} from '../../redux/slices/adminSlice';
import './AdminPayments.css';

const AdminPayments = () => {
  const dispatch = useDispatch();
  const payments = useSelector(selectPaymentsAdmin);
  const stats = useSelector(selectPaymentStatsAdmin);
  const pagination = useSelector(selectPaymentsPaginationAdmin);
  const loading = useSelector(selectAdminLoading);
  const filters = useSelector(selectAdminFilters);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [filters, fetchPayments, fetchStats]);

  const fetchPayments = () => {
    dispatch(getAllPaymentsAdmin({
      ...filters.payments,
      page: filters.payments.page || 1,
      limit: 10
    }));
  };

  const fetchStats = () => {
    dispatch(getPaymentStatsAdmin({}));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setPaymentFilters({ [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    dispatch(setPaymentFilters({ page: newPage }));
  };

  const handleClearFilters = () => {
    dispatch(clearPaymentFilters());
  };

  const handleViewPayment = async (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'danger';
      case 'initiated': return 'info';
      case 'refunded': return 'secondary';
      default: return 'secondary';
    }
  };

  if (loading && payments.length === 0) {
    return <div className="loading">Loading payments...</div>;
  }

  return (
    <div className="admin-payments">
      <div className="page-header">
        <h1>Payment Transactions</h1>
        <div className="filter-controls">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search by transaction ID, customer..."
              value={filters.payments.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <select
              value={filters.payments.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="initiated">Initiated</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div className="filter-group">
            <input
              type="date"
              value={filters.payments.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="date-input"
              placeholder="Start Date"
            />
          </div>
          <div className="filter-group">
            <input
              type="date"
              value={filters.payments.endDate || ''}
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
      <div className="payments-stats">
        <div className="stat-card">
          <h3>₹{(stats?.overall?.totalRevenue || 0).toLocaleString()}</h3>
          <p>Total Revenue</p>
        </div>
        <div className="stat-card">
          <h3>{stats?.overall?.totalTransactions || 0}</h3>
          <p>Total Transactions</p>
        </div>
        <div className="stat-card">
          <h3>₹{(stats?.overall?.avgTransaction || 0).toLocaleString()}</h3>
          <p>Average Transaction</p>
        </div>
        <div className="stat-card">
          <h3>{stats?.period?.count || 0}</h3>
          <p>This Period</p>
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      {stats?.methodBreakdown && stats.methodBreakdown.length > 0 && (
        <div className="method-breakdown">
          <h3>Payment Methods</h3>
          <div className="method-grid">
            {stats.methodBreakdown.map((method, index) => (
              <div key={index} className="method-card">
                <span className="method-name">{method._id || 'Unknown'}</span>
                <span className="method-count">{method.count} transactions</span>
                <span className="method-amount">₹{method.amount?.toLocaleString() || 0}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="payments-table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Customer</th>
              <th>Booking</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>
                  <div className="transaction-id">
                    {payment.transactionId}
                  </div>
                </td>
                <td>
                  <div className="customer-info">
                    <div className="customer-name">
                      {payment.customerId ? `${payment.customerId.firstName} ${payment.customerId.lastName}` : 'N/A'}
                    </div>
                    <div className="customer-email">
                      {payment.customerId?.email || 'N/A'}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="booking-info">
                    <div>{payment.bookingId?.bookingNumber || 'N/A'}</div>
                    <div className="booking-date">
                      {payment.bookingId?.scheduledDate ? 
                        new Date(payment.bookingId.scheduledDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </td>
                <td className="amount">₹{payment.amount?.toLocaleString() || 0}</td>
                <td>{payment.paymentMethod || 'N/A'}</td>
                <td>
                  <span className={`status status--${getStatusColor(payment.status)}`}>
                    {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1) || 'Unknown'}
                  </span>
                </td>
                <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn--small btn--secondary"
                    onClick={() => handleViewPayment(payment)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payments.length === 0 && (
        <div className="no-payments">
          <p>No payments found matching the current filters.</p>
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
            Page {pagination.page} of {pagination.pages} ({pagination.total} total payments)
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

      {/* Payment Details Modal */}
      {showModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Payment Details</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Transaction ID:</span>
                <span className="detail-value">{selectedPayment.transactionId}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Amount:</span>
                <span className="detail-value">₹{selectedPayment.amount?.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status status--${getStatusColor(selectedPayment.status)}`}>
                  {selectedPayment.status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Payment Method:</span>
                <span className="detail-value">{selectedPayment.paymentMethod}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Gateway:</span>
                <span className="detail-value">{selectedPayment.gateway}</span>
              </div>
              {selectedPayment.gatewayTransactionId && (
                <div className="detail-row">
                  <span className="detail-label">Gateway Transaction ID:</span>
                  <span className="detail-value">{selectedPayment.gatewayTransactionId}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">
                  {new Date(selectedPayment.createdAt).toLocaleString()}
                </span>
              </div>
              {selectedPayment.refund?.isRefunded && (
                <div className="refund-info">
                  <h4>Refund Information</h4>
                  <div className="detail-row">
                    <span className="detail-label">Refunded Amount:</span>
                    <span className="detail-value">₹{selectedPayment.refund.refundAmount?.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Refunded At:</span>
                    <span className="detail-value">
                      {new Date(selectedPayment.refund.refundedAt).toLocaleString()}
                    </span>
                  </div>
                  {selectedPayment.refund.refundReason && (
                    <div className="detail-row">
                      <span className="detail-label">Reason:</span>
                      <span className="detail-value">{selectedPayment.refund.refundReason}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
