import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getServices, selectServices, selectServicesPagination, selectServicesLoading, selectServicesFilters, setFilters } from '../../redux/slices/serviceSlice';
import './AdminServices.css';

const AdminServices = () => {
  const dispatch = useDispatch();
  const services = useSelector(selectServices);
  const pagination = useSelector(selectServicesPagination);
  const loading = useSelector(selectServicesLoading);
  const filters = useSelector(selectServicesFilters);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    serviceName: '',
    description: '',
    category: '',
    basePrice: '',
    duration: '',
    isActive: true
  });

  useEffect(() => {
    fetchServices();
  }, [filters, sortBy, sortOrder]);

  const fetchServices = () => {
    dispatch(getServices({
      ...filters,
      sort: `${sortOrder === 'desc' ? '-' : ''}${sortBy}`,
      page: pagination.page,
      limit: pagination.limit
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        // Update service
        // await api.put(`/services/${editingService._id}`, formData);
        console.log('Updating service:', formData);
      } else {
        // Create service
        // await api.post('/services', formData);
        console.log('Creating service:', formData);
      }

      setShowForm(false);
      setEditingService(null);
      setFormData({
        serviceName: '',
        description: '',
        category: '',
        basePrice: '',
        duration: '',
        isActive: true
      });
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      serviceName: service.serviceName,
      description: service.description,
      category: service.category,
      basePrice: service.basePrice,
      duration: service.duration,
      isActive: service.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        // await api.delete(`/services/${serviceId}`);
        console.log('Deleting service:', serviceId);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const toggleStatus = async (serviceId, currentStatus) => {
    try {
      // await api.patch(`/services/${serviceId}`, { isActive: !currentStatus });
      console.log('Toggling status for service:', serviceId);
      fetchServices();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading services...</div>;
  }

  return (
    <div className="admin-services">
      <div className="page-header">
        <h1>Services Management</h1>
        <div className="header-actions">
          <div className="filter-controls">
            <div className="filter-group">
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange({ category: e.target.value })}
                className="filter-select"
              >
                <option value="">All Categories</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="deep_cleaning">Deep Cleaning</option>
                <option value="office">Office</option>
                <option value="specialty">Specialty</option>
              </select>
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
                <option value="serviceName_asc">Name A-Z</option>
                <option value="serviceName_desc">Name Z-A</option>
                <option value="basePrice_desc">Highest Price</option>
                <option value="basePrice_asc">Lowest Price</option>
              </select>
            </div>
          </div>
          <button
            className="btn btn--primary"
            onClick={() => setShowForm(true)}
          >
            Add New Service
          </button>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
              <button
                className="modal-close"
                onClick={() => {
                  setShowForm(false);
                  setEditingService(null);
                  setFormData({
                    serviceName: '',
                    description: '',
                    category: '',
                    basePrice: '',
                    duration: '',
                    isActive: true
                  });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="service-form">
              <div className="form-group">
                <label>Service Name</label>
                <input
                  type="text"
                  value={formData.serviceName}
                  onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="deep_cleaning">Deep Cleaning</option>
                  <option value="office">Office</option>
                  <option value="specialty">Specialty</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Base Price (₹)</label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn--primary">
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="services-table-container">
        <table className="services-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('serviceName')} className="sortable">
                Service Name {sortBy === 'serviceName' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Category</th>
              <th onClick={() => handleSort('basePrice')} className="sortable">
                Price {sortBy === 'basePrice' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service._id}>
                <td>{service.serviceName}</td>
                <td>{service.category}</td>
                <td>₹{(service.pricing?.basePrice || service.basePrice || 0).toLocaleString()}</td>
                <td>{service.duration} min</td>
                <td>
                  <span className={`status ${service.isActive ? 'active' : 'inactive'}`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn--small btn--edit"
                      onClick={() => handleEdit(service)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn--small btn--toggle"
                      onClick={() => toggleStatus(service._id, service.isActive)}
                    >
                      {service.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      className="btn btn--small btn--delete"
                      onClick={() => handleDelete(service._id)}
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
            Page {pagination.page} of {pagination.pages} ({pagination.total} total services)
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

export default AdminServices;