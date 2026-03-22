import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaCalendarAlt, FaCog, FaPhone, FaEnvelope, FaSearch, FaHome, FaConciergeBell, FaInfo, FaBlog, FaEnvelopeOpen } from 'react-icons/fa';
import logoImage from '../../assets/new-logo.png';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [navigate]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        {/* Logo */}
        <Link to="/" className="header__logo">
          <img 
            src={logoImage} 
            alt="Diamond House Cleaning Logo" 
            className="logo__image"
          />
        </Link>

        {/* Contact Info */}
        <div className="header__contact">
          <div className="contact-item">
            <FaPhone className="contact-icon" />
            <span className="contact-text">+91 9850781897</span>
          </div>
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <span className="contact-text">rahul.nile@gmail.com</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="header__nav">
          <ul className="nav__list">
            <li className="nav__item">
              <Link to="/" className="nav__link">
                <FaHome className="nav-icon" />
                Home
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/services" className="nav__link">
                <FaConciergeBell className="nav-icon" />
                Services
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/about" className="nav__link">
                <FaInfo className="nav-icon" />
                About
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/blog" className="nav__link">
                <FaBlog className="nav-icon" />
                Blog
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/contact" className="nav__link">
                <FaEnvelopeOpen className="nav-icon" />
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Search Button */}
        <button className="search-btn" aria-label="Search services">
          <FaSearch />
        </button>

        {/* User Actions */}
        <div className="header__actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <button className="user-menu__trigger">
                <FaUser className="user-icon" />
                <span className="user-name">{user?.firstName}</span>
              </button>

              <div className="user-menu__dropdown">
                {user?.role !== 'admin' && (
                  <>
                    <Link to="/dashboard" className="user-menu__item">
                      <FaCalendarAlt />
                      Dashboard
                    </Link>
                    <Link to="/profile" className="user-menu__item">
                      <FaCog />
                      Profile
                    </Link>
                  </>
                )}
                {user?.role === 'admin' && (
                  <>
                    <Link to="/admin/dashboard" className="user-menu__item">
                      <FaCog />
                      Admin Dashboard
                    </Link>
                    <Link to="/profile" className="user-menu__item">
                      <FaUser />
                      Profile
                    </Link>
                  </>
                )}
                <button onClick={handleLogout} className="user-menu__item user-menu__item--logout">
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn--secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn--primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-menu ${isMenuOpen ? 'mobile-menu--open' : ''}`}>
        <nav className="mobile-menu__nav">
          <ul className="mobile-nav__list">
            <li className="mobile-nav__item">
              <Link to="/" className="mobile-nav__link" onClick={toggleMenu}>
                <FaHome className="mobile-nav-icon" />
                Home
              </Link>
            </li>
            <li className="mobile-nav__item">
              <Link to="/services" className="mobile-nav__link" onClick={toggleMenu}>
                <FaConciergeBell className="mobile-nav-icon" />
                Services
              </Link>
            </li>
            <li className="mobile-nav__item">
              <Link to="/about" className="mobile-nav__link" onClick={toggleMenu}>
                <FaInfo className="mobile-nav-icon" />
                About
              </Link>
            </li>
            <li className="mobile-nav__item">
              <Link to="/blog" className="mobile-nav__link" onClick={toggleMenu}>
                <FaBlog className="mobile-nav-icon" />
                Blog
              </Link>
            </li>
            <li className="mobile-nav__item">
              <Link to="/contact" className="mobile-nav__link" onClick={toggleMenu}>
                <FaEnvelopeOpen className="mobile-nav-icon" />
                Contact
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                {user?.role !== 'admin' && (
                  <>
                    <li className="mobile-nav__item">
                      <Link to="/dashboard" className="mobile-nav__link" onClick={toggleMenu}>
                        Dashboard
                      </Link>
                    </li>
                    <li className="mobile-nav__item">
                      <Link to="/profile" className="mobile-nav__link" onClick={toggleMenu}>
                        Profile
                      </Link>
                    </li>
                  </>
                )}
                {user?.role === 'admin' && (
                  <>
                    <li className="mobile-nav__item">
                      <Link to="/admin/dashboard" className="mobile-nav__link" onClick={toggleMenu}>
                        Admin Dashboard
                      </Link>
                    </li>
                    <li className="mobile-nav__item">
                      <Link to="/profile" className="mobile-nav__link" onClick={toggleMenu}>
                        Profile
                      </Link>
                    </li>
                  </>
                )}
                <li className="mobile-nav__item">
                  <button onClick={handleLogout} className="mobile-nav__link mobile-nav__link--logout">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="mobile-nav__item">
                  <Link to="/login" className="mobile-nav__link" onClick={toggleMenu}>
                    Login
                  </Link>
                </li>
                <li className="mobile-nav__item">
                  <Link to="/register" className="btn btn--primary mobile-btn" onClick={toggleMenu}>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;