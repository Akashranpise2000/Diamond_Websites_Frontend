import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  updateProfile,
  selectUser,
  selectAuthLoading,
  selectAuthError
} from '../redux/slices/authSlice';
import {
  getAllUsers,
  updateUser,
  selectUsers,
  selectAdminLoading,
  selectAdminError,
  clearError as clearAdminError
} from '../redux/slices/adminSlice';
import ErrorBoundary from '../components/common/ErrorBoundary';
import './Profile.css';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const authLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  const users = useSelector(selectUsers);
  const adminLoading = useSelector(selectAdminLoading);
  const adminError = useSelector(selectAdminError);

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  // Load users for admin role management
  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(getAllUsers({ limit: 50 })); // Load more users for admin view
    }
  }, [user?.role, dispatch]);

  // Handle auth errors
  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
  }, [authError]);

  // Handle admin errors
  useEffect(() => {
    if (adminError) {
      toast.error(adminError);
      dispatch(clearAdminError());
    }
  }, [adminError, dispatch]);

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!profileForm.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!profileForm.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!profileForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      errors.email = 'Email is invalid';
    }

    if (profileForm.phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(profileForm.phone)) {
      errors.phone = 'Phone number is invalid';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await dispatch(updateProfile(profileForm)).unwrap();
      toast.success('Profile updated successfully!');
      setFormErrors({});
    } catch (error) {
      // Error is handled by the slice and useEffect above
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle role change for admin
  const handleRoleChange = async (userId, newRole) => {
    try {
      await dispatch(updateUser({
        id: userId,
        data: { role: newRole }
      })).unwrap();
      toast.success('User role updated successfully!');
    } catch (error) {
      // Error is handled by the slice and useEffect above
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (authLoading && !user) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="error">Unable to load profile. Please try logging in again.</div>;
  }

  return (
    <ErrorBoundary>
      <div className="profile-page">
        <div className="page-header">
          <h1>My Profile</h1>
        </div>

        <div className="profile-content">
          {/* Profile Update Section */}
          <div className="profile-section">
            <h2>Update Profile</h2>
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={profileForm.firstName}
                    onChange={handleInputChange}
                    className={formErrors.firstName ? 'error' : ''}
                    required
                  />
                  {formErrors.firstName && <span className="error-message">{formErrors.firstName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={profileForm.lastName}
                    onChange={handleInputChange}
                    className={formErrors.lastName ? 'error' : ''}
                    required
                  />
                  {formErrors.lastName && <span className="error-message">{formErrors.lastName}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleInputChange}
                  className={formErrors.email ? 'error' : ''}
                  required
                />
                {formErrors.email && <span className="error-message">{formErrors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleInputChange}
                  className={formErrors.phone ? 'error' : ''}
                  placeholder="+1 (555) 123-4567"
                />
                {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
              </div>

              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                  readOnly
                  className="readonly-input"
                />
              </div>

              <div className="form-group">
                <label>Member Since</label>
                <input
                  type="text"
                  value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  readOnly
                  className="readonly-input"
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={isSubmitting || authLoading}
                >
                  {isSubmitting ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>

          {/* Admin User Management Section */}
          {user.role === 'admin' && (
            <div className="profile-section">
              <h2>User Role Management</h2>
              <p className="section-description">
                As an administrator, you can manage user roles. Be careful when changing roles as this affects user permissions.
              </p>

              {adminLoading && users.length === 0 ? (
                <div className="loading">Loading users...</div>
              ) : (
                <div className="users-management">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Current Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter(u => u._id !== user._id) // Don't show current user
                        .map((u) => (
                          <tr key={u._id}>
                            <td>
                              <div className="user-info">
                                <div className="user-name">
                                  {u.firstName} {u.lastName}
                                </div>
                              </div>
                            </td>
                            <td>{u.email}</td>
                            <td>
                              <span className={`role-badge role--${u.role === 'admin' ? 'danger' : 'success'}`}>
                                {u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : 'Customer'}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                {u.role !== 'customer' && (
                                  <button
                                    className="btn btn--small btn--secondary"
                                    onClick={() => handleRoleChange(u._id, 'customer')}
                                    disabled={adminLoading}
                                  >
                                    Make Customer
                                  </button>
                                )}
                                {u.role !== 'admin' && (
                                  <button
                                    className="btn btn--small btn--delete"
                                    onClick={() => handleRoleChange(u._id, 'admin')}
                                    disabled={adminLoading}
                                  >
                                    Make Admin
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  {users.length === 1 && (
                    <div className="no-users">
                      <p>No other users found.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Profile;