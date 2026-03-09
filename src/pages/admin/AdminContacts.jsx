import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getContacts, updateContactStatus, deleteContact, selectContacts, selectContactsPagination, selectContactsLoading, selectContactsFilters, setFilters } from '../../redux/slices/contactSlice';
import './AdminContacts.css';

const AdminContacts = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);
  const pagination = useSelector(selectContactsPagination);
  const loading = useSelector(selectContactsLoading);
  const filters = useSelector(selectContactsFilters);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedContact, setSelectedContact] = useState(null);
  const [viewMode, setViewMode] = useState('sidebar'); // 'sidebar' or 'table'

  useEffect(() => {
    fetchContacts();
  }, [filters, sortBy, sortOrder]);

  const fetchContacts = () => {
    dispatch(getContacts({
      ...filters,
      sort: `${sortOrder === 'desc' ? '-' : ''}${sortBy}`,
      page: pagination.page,
      limit: pagination.limit
    }));
  };

  const handleStatusUpdate = async (contactId, newStatus) => {
    try {
      await dispatch(updateContactStatus({ id: contactId, status: newStatus })).unwrap();
      toast.success('Contact status updated successfully');
      fetchContacts();
      if (selectedContact && selectedContact._id === contactId) {
        setSelectedContact({ ...selectedContact, status: newStatus });
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      try {
        await dispatch(deleteContact(contactId)).unwrap();
        toast.success('Contact deleted successfully');
        if (selectedContact && selectedContact._id === contactId) {
          setSelectedContact(null);
        }
        fetchContacts();
      } catch (error) {
        toast.error(error);
      }
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
      case 'in_progress': return 'info';
      case 'resolved': return 'success';
      case 'closed': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatStatus = (status) => {
    return status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';
  };

  if (loading && contacts.length === 0) {
    return <div className="loading">Loading contacts...</div>;
  }

  return (
    <div className="admin-contacts">
      <div className="page-header">
        <div className="header-left">
          <h1>Contact Inquiries</h1>
          <p>Manage and respond to customer inquiries</p>
        </div>
        <div className="header-right">
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'sidebar' ? 'active' : ''}`}
              onClick={() => setViewMode('sidebar')}
            >
              📋 Sidebar View
            </button>
            <button
              className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              📊 Table View
            </button>
          </div>
        </div>
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange({ status: e.target.value })}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
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
        <button
          className="btn btn--small"
          onClick={() => handleFilterChange({ search: '', status: '', startDate: '', endDate: '' })}
        >
          Clear Filters
        </button>
      </div>

      <div className="contacts-stats">
        <div className="stat-card stat-card--pending">
          <h3>{contacts.filter(c => c.status === 'pending').length}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card stat-card--progress">
          <h3>{contacts.filter(c => c.status === 'in_progress').length}</h3>
          <p>In Progress</p>
        </div>
        <div className="stat-card stat-card--resolved">
          <h3>{contacts.filter(c => c.status === 'resolved').length}</h3>
          <p>Resolved</p>
        </div>
        <div className="stat-card stat-card--closed">
          <h3>{contacts.filter(c => c.status === 'closed').length}</h3>
          <p>Closed</p>
        </div>
      </div>

      {viewMode === 'sidebar' ? (
        // Sidebar View
        <div className="contacts-sidebar-layout">
          <div className="contacts-list-panel">
            <div className="panel-header">
              <h3>All Contacts ({pagination.total})</h3>
            </div>
            <div className="contacts-list">
              {contacts.map((contact) => (
                <div
                  key={contact._id}
                  className={`contact-list-item ${selectedContact?._id === contact._id ? 'selected' : ''}`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="contact-item-header">
                    <span className="contact-name">{contact.name}</span>
                    <span className={`status-badge status--${getStatusColor(contact.status)}`}>
                      {formatStatus(contact.status)}
                    </span>
                  </div>
                  <div className="contact-item-email">{contact.email}</div>
                  <div className="contact-item-date">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {contacts.length === 0 && (
                <div className="no-contacts">
                  <p>No contacts found.</p>
                </div>
              )}
            </div>
            {pagination.pages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn--small"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </button>
                <span>{pagination.page}/{pagination.pages}</span>
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

          <div className="contact-detail-panel">
            {selectedContact ? (
              <>
                <div className="detail-header">
                  <h2>Contact Details</h2>
                  <div className="detail-actions">
                    {selectedContact.status === 'pending' && (
                      <button
                        className="btn btn--info"
                        onClick={() => handleStatusUpdate(selectedContact._id, 'in_progress')}
                      >
                        Start Processing
                      </button>
                    )}
                    {selectedContact.status === 'in_progress' && (
                      <button
                        className="btn btn--success"
                        onClick={() => handleStatusUpdate(selectedContact._id, 'resolved')}
                      >
                        Mark Resolved
                      </button>
                    )}
                    {selectedContact.status !== 'closed' && (
                      <button
                        className="btn btn--secondary"
                        onClick={() => handleStatusUpdate(selectedContact._id, 'closed')}
                      >
                        Close
                      </button>
                    )}
                    <button
                      className="btn btn--danger"
                      onClick={() => handleDeleteContact(selectedContact._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="detail-content">
                  <div className="detail-section">
                    <h4>Contact Information</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Name</span>
                        <span className="detail-value">{selectedContact.name}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Email</span>
                        <span className="detail-value">
                          <a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a>
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Phone</span>
                        <span className="detail-value">
                          <a href={`tel:${selectedContact.phone}`}>{selectedContact.phone}</a>
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Status</span>
                        <span className={`status status--${getStatusColor(selectedContact.status)}`}>
                          {formatStatus(selectedContact.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Message</h4>
                    <div className="message-content">
                      {selectedContact.message}
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Submission Details</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Submitted</span>
                        <span className="detail-value">
                          {new Date(selectedContact.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Last Updated</span>
                        <span className="detail-value">
                          {new Date(selectedContact.updatedAt).toLocaleString()}
                        </span>
                      </div>
                      {selectedContact.submittedBy && (
                        <div className="detail-item">
                          <span className="detail-label">Submitted By</span>
                          <span className="detail-value">Registered User</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-selection">
                <div className="no-selection-icon">📬</div>
                <h3>Select a contact</h3>
                <p>Click on a contact from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Table View
        <div className="contacts-table-container">
          <table className="contacts-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">
                  Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th onClick={() => handleSort('createdAt')} className="sortable">
                  Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('status')} className="sortable">
                  Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact._id}>
                  <td>
                    <div className="contact-name">
                      {contact.name}
                      {contact.submittedBy && (
                        <span className="registered-badge">Registered</span>
                      )}
                    </div>
                  </td>
                  <td>{contact.email}</td>
                  <td>{contact.phone}</td>
                  <td>
                    <div className="message-preview">
                      {contact.message.length > 50
                        ? `${contact.message.substring(0, 50)}...`
                        : contact.message
                      }
                    </div>
                  </td>
                  <td>
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={`status status--${getStatusColor(contact.status)}`}>
                      {formatStatus(contact.status)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn--small btn--secondary"
                        onClick={() => setSelectedContact(contact)}
                      >
                        View
                      </button>
                      {contact.status === 'pending' && (
                        <button
                          className="btn btn--small btn--info"
                          onClick={() => handleStatusUpdate(contact._id, 'in_progress')}
                        >
                          Start
                        </button>
                      )}
                      {contact.status === 'in_progress' && (
                        <button
                          className="btn btn--small btn--success"
                          onClick={() => handleStatusUpdate(contact._id, 'resolved')}
                        >
                          Resolve
                        </button>
                      )}
                      {contact.status !== 'closed' && (
                        <button
                          className="btn btn--small btn--secondary"
                          onClick={() => handleStatusUpdate(contact._id, 'closed')}
                        >
                          Close
                        </button>
                      )}
                      <button
                        className="btn btn--small btn--danger"
                        onClick={() => handleDeleteContact(contact._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {contacts.length === 0 && (
        <div className="no-contacts">
          <p>No contacts found matching the current filters.</p>
        </div>
      )}

      {/* Pagination for Table View */}
      {viewMode === 'table' && pagination.pages > 1 && (
        <div className="pagination">
          <button
            className="btn btn--small"
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
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

export default AdminContacts;