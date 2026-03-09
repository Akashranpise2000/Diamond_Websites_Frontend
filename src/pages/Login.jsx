import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [loginMode, setLoginMode] = useState('customer'); // 'customer' or 'admin'
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated, user } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      let redirectPath;
      if (user.role === 'admin') {
        redirectPath = '/admin/dashboard';
      } else {
        redirectPath = location.state?.from || '/dashboard';
      }
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  useEffect(() => {
    if (error) {
      // Handle different error types
      if (error.includes('Network') || error.includes('connection') || error.includes('fetch')) {
        toast.error('Network error. Please check your internet connection and try again.');
      } else if (error.includes('Invalid credentials') || error.includes('credentials')) {
        toast.error('Invalid email/phone or password. Please try again.');
      } else if (error.includes('Account')) {
        toast.error(error); // Keep specific account-related errors
      } else {
        toast.error(error);
      }
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    // Include role in login credentials for role-based authentication
    const loginCredentials = {
      ...formData,
      role: loginMode // 'customer' or 'admin'
    };

    dispatch(login(loginCredentials));
  };

  return (
    <div className={`auth-container ${loginMode === 'admin' ? 'auth-container--admin' : ''}`}>
      <div className="auth-card">
        <div className="auth-header">
          <h1>{loginMode === 'admin' ? 'Admin Login' : 'Welcome Back'}</h1>
          <p>Sign in to your {loginMode === 'admin' ? 'admin' : 'customer'} account</p>
        </div>

        <div className="login-mode-toggle">
          <button
            type="button"
            className={`toggle-btn ${loginMode === 'customer' ? 'active' : ''}`}
            onClick={() => setLoginMode('customer')}
          >
            Customer Login
          </button>
          <button
            type="button"
            className={`toggle-btn ${loginMode === 'admin' ? 'active' : ''}`}
            onClick={() => setLoginMode('admin')}
          >
            Admin Login
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="identifier" className="form-label">
              Email or Phone Number
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              className="form-input"
              placeholder="Enter your email or phone number"
              value={formData.identifier}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <button
              type="submit"
              className="btn btn--primary btn--large"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password" className="auth-link">
            Forgot your password?
          </Link>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link auth-link--primary">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;