import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import logoImage from '../../assets/Screenshot_2024-08-23_at_7.42.43_AM-removebg-preview.webp';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Main Footer Content */}
        <div className="footer__main">
          {/* Company Info */}
          <div className="footer__section">
            <Link to="/" className="footer__logo">
              <img 
                src={logoImage} 
                alt="Diamond House Cleaning Logo" 
                className="footer-logo__image"
              />
            </Link>
            <p className="footer__description">
              Professional house cleaning services with quality guarantee.
              Trusted by thousands of satisfied customers across the city.
            </p>
            <div className="footer__social">
              <button className="social-link" aria-label="Facebook">
                <FaFacebook />
              </button>
              <button className="social-link" aria-label="Instagram">
                <FaInstagram />
              </button>
              <button className="social-link" aria-label="Twitter">
                <FaTwitter />
              </button>
              <button className="social-link" aria-label="YouTube">
                <FaYoutube />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__section">
            <h3 className="footer__heading">Quick Links</h3>
            <ul className="footer__links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Our Services</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer__section">
            <h3 className="footer__heading">Services</h3>
            <ul className="footer__links">
              <li><Link to="/services/regular-house-cleaning">Regular House Cleaning</Link></li>
              <li><Link to="/services/deep-cleaning">Deep Cleaning</Link></li>
              <li><Link to="/services/office-cleaning">Office Cleaning</Link></li>
              <li><Link to="/services/carpet-cleaning">Carpet Cleaning</Link></li>
              <li><Link to="/services/kitchen-cleaning">Kitchen Cleaning</Link></li>
              <li><Link to="/services/bathroom-cleaning">Bathroom Cleaning</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer__section">
            <h3 className="footer__heading">Contact Info</h3>
            <div className="footer__contact">
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <div>
                  <a href="tel:+919850781897">+91 98507 81897</a>
                </div>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <a href="rahul.nile@gmail.com">
                  rahul.nile@gmail.com
                </a>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <address>
                  Near Chavan Poultry, 2nd floor,krishna banglow,porwal road<br />
                  Lohegoan,pune Maharashtra 411047<br />
                  India
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="footer__newsletter">
          <div className="newsletter__content">
            <h3 className="newsletter__heading">Stay Updated</h3>
            <p className="newsletter__text">
              Subscribe to our newsletter for cleaning tips, offers, and updates.
            </p>
            <form className="newsletter__form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter__input"
                required
              />
              <button type="submit" className="btn btn--primary newsletter__btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <p className="copyright">
              © {currentYear} Diamond House Cleaning Services. All rights reserved.
            </p>
            <div className="footer__legal">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-of-service">Terms of Service</Link>
              <Link to="/refund-policy">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;