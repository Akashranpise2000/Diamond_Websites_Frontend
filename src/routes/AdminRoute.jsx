import React, { useEffect } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser, selectAuthLoading } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

// Admin Layout
import AdminLayout from '../components/admin/AdminLayout';

// Common Components
import ErrorBoundary from '../components/common/ErrorBoundary';

// Admin Pages
import AdminDashboard from '../pages/AdminDashboard';
import AdminBookings from '../pages/admin/AdminBookings';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminPayments from '../pages/admin/AdminPayments';
import AdminServices from '../pages/admin/AdminServices';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminContacts from '../pages/admin/AdminContacts';
import AdminReports from '../pages/admin/AdminReports';

const AdminRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);

  useEffect(() => {
    if (!loading && isAuthenticated && user?.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
    }
  }, [loading, isAuthenticated, user]);

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to={user ? "/dashboard" : "/"} replace />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/bookings" element={<AdminBookings />} />
        <Route path="/orders" element={<AdminOrders />} />
        <Route path="/payments" element={<AdminPayments />} />
        <Route path="/services" element={<AdminServices />} />
        <Route path="/users" element={<ErrorBoundary><AdminUsers /></ErrorBoundary>} />
        <Route path="/contacts" element={<AdminContacts />} />
        <Route path="/reports" element={<AdminReports />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoute;