import React from 'react';
import { FaPhone, FaWhatsapp } from 'react-icons/fa';
import './FloatingCTA.css';

const FloatingCTA = () => {
  // Phone number from Footer.jsx - used for both call and WhatsApp
  const phoneNumber = '+919850781897';

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleWhatsApp = () => {
    // WhatsApp API format: https://wa.me/NUMBER?text=MESSAGE
    // The number should be without + prefix for WhatsApp API
    const cleanNumber = phoneNumber.replace(/\+/g, '');
    const message = encodeURIComponent('Hello Diamond House Cleaning, I am interested in your services.');
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="floating-cta" role="navigation" aria-label="Contact options">
      {/* Call Now Button */}
      <a
        href={`tel:${phoneNumber}`}
        className="floating-cta__button floating-cta__button--call"
        onClick={handleCall}
        aria-label="Call us now"
        title="Call Now"
      >
        <FaPhone className="floating-cta__icon" aria-hidden="true" />
        <span className="floating-cta__text">Call Now</span>
      </a>

      {/* WhatsApp Button */}
      <button
        className="floating-cta__button floating-cta__button--whatsapp"
        onClick={handleWhatsApp}
        aria-label="Contact us on WhatsApp"
        title="WhatsApp"
      >
        <FaWhatsapp className="floating-cta__icon" aria-hidden="true" />
        <span className="floating-cta__text">WhatsApp</span>
      </button>
    </div>
  );
};

export default FloatingCTA;
