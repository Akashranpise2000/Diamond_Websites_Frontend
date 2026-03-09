import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser, selectAuthLoading } from '../redux/slices/authSlice';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Prevent admin users from accessing user-specific routes except profile
  if (user?.role === 'admin' && location.pathname !== '/profile') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;