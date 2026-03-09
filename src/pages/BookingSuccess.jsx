import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaRupeeSign, FaUser, FaPhone } from 'react-icons/fa';
import './BookingSuccess.css';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const { currentBooking } = useSelector(state => state.bookings);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    // Redirect if no booking data
    if (!currentBooking) {
      navigate('/booking', { replace: true });
    }
  }, [currentBooking, navigate]);

  if (!currentBooking) {
    return (
      <div className="booking-success-loading">
        <div className="loading-spinner"></div>
        <p>Loading booking details...</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeSlot) => {
    return timeSlot;
  };

  const getServiceNames = () => {
    return currentBooking.services?.map(service => service.serviceName).join(', ') || 'Service';
  };

  return (
    <div className="booking-success">
      <div className="success-container">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <h1>Booking Confirmed!</h1>
          <p className="success-subtitle">
            Your cleaning service has been successfully booked. We'll be there as scheduled.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="booking-details-card">
          <div className="booking-header">
            <h2>Booking Details</h2>
            <div className="booking-id">
              <span>Booking ID: </span>
              <strong>{currentBooking._id || currentBooking.id}</strong>
            </div>
          </div>

          {/* Service Information */}
          <div className="detail-section">
            <h3>
              <FaUser className="section-icon" />
              Service Information
            </h3>
            <div className="service-list">
              {currentBooking.services?.map((service, index) => (
                <div key={index} className="service-item">
                  <div className="service-name">{service.serviceName}</div>
                  <div className="service-details">
                    <span>Quantity: {service.quantity}</span>
                    {service.addOns?.length > 0 && (
                      <span>Add-ons: {service.addOns.map(addon => addon.name).join(', ')}</span>
                    )}
                  </div>
                  <div className="service-price">₹{service.subtotal || service.totalPrice}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Information */}
          <div className="detail-section">
            <h3>
              <FaCalendarAlt className="section-icon" />
              Schedule Information
            </h3>
            <div className="schedule-info">
              <div className="schedule-item">
                <FaCalendarAlt className="info-icon" />
                <div>
                  <strong>Date:</strong>
                  <span>{formatDate(currentBooking.scheduledDate)}</span>
                </div>
              </div>
              <div className="schedule-item">
                <FaClock className="info-icon" />
                <div>
                  <strong>Time:</strong>
                  <span>{formatTime(currentBooking.scheduledTimeSlot)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="detail-section">
            <h3>
              <FaMapMarkerAlt className="section-icon" />
              Service Address
            </h3>
            <div className="address-info">
              <p>{currentBooking.serviceAddress?.street}</p>
              <p>{currentBooking.serviceAddress?.city}, {currentBooking.serviceAddress?.state} - {currentBooking.serviceAddress?.zipCode}</p>
              <p>{currentBooking.serviceAddress?.country}</p>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="detail-section">
            <h3>
              <FaRupeeSign className="section-icon" />
              Pricing Summary
            </h3>
            <div className="pricing-summary">
              <div className="pricing-row">
                <span>Subtotal:</span>
                <span>₹{currentBooking.pricing?.subtotal || currentBooking.totalAmount}</span>
              </div>
              <div className="pricing-row">
                <span>GST (18%):</span>
                <span>₹{currentBooking.pricing?.tax || Math.round((currentBooking.pricing?.subtotal || currentBooking.totalAmount) * 0.18)}</span>
              </div>
              {currentBooking.pricing?.discount > 0 && (
                <div className="pricing-row discount">
                  <span>Discount:</span>
                  <span>-₹{currentBooking.pricing.discount}</span>
                </div>
              )}
              <div className="pricing-row total">
                <span><strong>Total Amount:</strong></span>
                <span><strong>₹{currentBooking.pricing?.total || currentBooking.totalAmount}</strong></span>
              </div>
            </div>
          </div>

          {/* Custom Fields */}
          {currentBooking.customFields && Object.keys(currentBooking.customFields).length > 0 && (
            <div className="detail-section">
              <h3>
                <FaUser className="section-icon" />
                Additional Information
              </h3>
              <div className="custom-fields-display">
                {currentBooking.customFields.priority && (
                  <div className="custom-field-item">
                    <strong>Priority:</strong>
                    <span className={`priority-badge priority-${currentBooking.customFields.priority.toLowerCase()}`}>
                      {currentBooking.customFields.priority}
                    </span>
                  </div>
                )}
                {currentBooking.customFields.specialRequests && (
                  <div className="custom-field-item">
                    <strong>Special Requests:</strong>
                    <span>{currentBooking.customFields.specialRequests}</span>
                  </div>
                )}
                {currentBooking.customFields.notes && (
                  <div className="custom-field-item">
                    <strong>Notes:</strong>
                    <span>{currentBooking.customFields.notes}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status */}
          <div className="detail-section">
            <div className="status-info">
              <div className="status-badge">
                {currentBooking.status || 'Confirmed'}
              </div>
              <p className="status-message">
                Your booking is confirmed. Our professional cleaners will arrive at the scheduled time.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="success-actions">
          <Link to="/dashboard" className="btn btn--primary">
            View My Bookings
          </Link>
          <Link to="/services" className="btn btn--secondary">
            Book Another Service
          </Link>
          <Link to="/" className="btn btn--outline">
            Back to Home
          </Link>
        </div>

        {/* Contact Information */}
        <div className="contact-info-card">
          <h3>Need Help?</h3>
          <p>If you have any questions or need to make changes to your booking, please contact us:</p>
          <div className="contact-methods">
            <div className="contact-method">
              <FaPhone className="contact-icon" />
              <div>
                <strong>Phone:</strong>
                <a href="tel:+919850781897">+91 98507 81897</a>
              </div>
            </div>
            <div className="contact-method">
              <FaUser className="contact-icon" />
              <div>
                <strong>Email:</strong>
                <a href="mailto:rahul.nile@gmail.com">rahul.nile@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;