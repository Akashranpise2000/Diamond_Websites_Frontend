import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getAllUsers,
  updateUser,
  deleteUser,
  selectUsers,
  selectAdminPagination,
  selectAdminLoading,
  selectAdminFilters,
  setUserFilters
} from '../../redux/slices/adminSlice';
import './AdminUsers.css';

const AdminUsers = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const pagination = useSelector(selectAdminPagination);
  const loading = useSelector(selectAdminLoading);
  const filters = useSelector(selectAdminFilters);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'customer',
    isActive: true
  });

  useEffect(() => {
    fetchUsers();
  }, [filters.users, fetchUsers]);

  const fetchUsers = () => {
    dispatch(getAllUsers({
      page: pagination.users.page,
      limit: pagination.users.limit,
      ...filters.users
    }));
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'customer',
      isActive: user.isActive !== false
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUser({
        id: editingUser._id,
        data: editFormData
      })).unwrap();
      setShowEditModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleFilterChange = (newFilters) => {
    dispatch(setUserFilters(newFilters));
  };

  const handlePageChange = (newPage) => {
    dispatch(setUserFilters({ page: newPage }));
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'customer': return 'success';
      default: return 'secondary';
    }
  };

  if (loading && users.length === 0) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="admin-users">
      <div className="page-header">
        <h1>User Management</h1>
        <div className="filters-section">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.users.search || ''}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <select
              value={filters.users.role || ''}
              onChange={(e) => handleFilterChange({ role: e.target.value })}
              className="filter-select"
            >
              <option value="">All Roles</option>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="filter-group">
            <select
              value={filters.users.status || ''}
              onChange={(e) => handleFilterChange({ status: e.target.value })}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="users-stats">
        <div className="stat-card">
          <h3>{users && users.length > 0 ? users.filter(u => u.role === 'customer').length : 0}</h3>
          <p>Customers</p>
        </div>
        <div className="stat-card">
          <h3>{users && users.length > 0 ? users.filter(u => u.role === 'admin').length : 0}</h3>
          <p>Admins</p>
        </div>
        <div className="stat-card">
          <h3>{users && users.length > 0 ? users.filter(u => u.isActive !== false).length : 0}</h3>
          <p>Active Users</p>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="user-info">
                    <div className="user-name">
                      {user.firstName} {user.lastName}
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>
                  <span className={`role-badge role--${getRoleColor(user.role)}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.isActive !== false ? 'active' : 'inactive'}`}>
                    {user.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn--small btn--edit"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn--small btn--delete"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="no-users">
            <p>No users found matching the current filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.users.pages > 1 && (
        <div className="pagination">
          <button
            className="btn btn--small"
            disabled={pagination.users.page === 1}
            onClick={() => handlePageChange(pagination.users.page - 1)}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.users.page} of {pagination.users.pages}
          </span>
          <button
            className="btn btn--small"
            disabled={pagination.users.page === pagination.users.pages}
            onClick={() => handlePageChange(pagination.users.page + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit User</h2>
              <button
                className="modal-close"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="user-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editFormData.isActive}
                    onChange={(e) => setEditFormData({...editFormData, isActive: e.target.checked})}
                  />
                  Active User
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn--primary">
                  Update User
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;