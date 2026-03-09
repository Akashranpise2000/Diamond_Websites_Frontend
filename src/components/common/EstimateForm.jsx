import React, { useState } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaBolt, FaListAlt } from 'react-icons/fa';
import './EstimateForm.css';

const serviceOptions = [
  { value: '', label: 'Select a Service' },
  { value: 'house-cleaning', label: 'Regular House Cleaning' },
  { value: 'deep-cleaning', label: 'Deep Cleaning' },
  { value: 'move-in-out', label: 'Move-In/Move-Out Cleaning' },
  { value: 'office-cleaning', label: 'Office Cleaning' },
  { value: 'carpet-cleaning', label: 'Carpet Cleaning' },
  { value: 'window-cleaning', label: 'Window Cleaning' },
  { value: 'upholstery-cleaning', label: 'Upholstery Cleaning' },
  { value: 'kitchen-cleaning', label: 'Kitchen Cleaning' },
  { value: 'bathroom-cleaning', label: 'Bathroom Cleaning' },
  { value: 'house-keeping', label: 'House Keeping' },
  { value: 'floor-cleaning', label: 'Floor Cleaning' },
  { value: 'residential', label: 'Residential' },
  { value: 'tile-cleaning', label: 'Tile Cleaning' },
  { value: 'marble-cleaning', label: 'Marble Cleaning' },
  { value: 'ac-cleaning', label: 'AC Cleaning' },
  { value: 'commercial-cleaning', label: 'Commercial Cleaning' },
  { value: 'sanitization', label: 'Sanitization Services' },
  { value: 'bird-netting', label: 'Bird Netting' },
  { value: 'facade-cleaning', label: 'Facade Cleaning' },
  { value: 'water-tank-cleaning', label: 'Water Tank Cleaning' },
  { value: 'acid-cleaning', label: 'Acid Cleaning' },
];

const EstimateForm = ({ preSelectedService = null, onSubmit }) => {
  // Mode: 'full' or 'quick'
  const [formMode, setFormMode] = useState('full');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    service: preSelectedService || '',
    message: ''
  });

  // Quick form state
  const [quickData, setQuickData] = useState({
    phone: preSelectedService ? '' : '',
    service: preSelectedService || ''
  });

  const [errors, setErrors] = useState({});
  const [quickErrors, setQuickErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Full form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact number is required';
    } else if (!/^[0-9+\-\s()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Full address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Quick form validation
  const validateQuickForm = () => {
    const newErrors = {};

    if (!quickData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]{10,}$/.test(quickData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!quickData.service) {
      newErrors.service = 'Please select a service';
    }

    setQuickErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleQuickChange = (e) => {
    const { name, value } = e.target;
    setQuickData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (quickErrors[name]) {
      setQuickErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formMode === 'full') {
      if (!validateForm()) {
        return;
      }
    } else {
      if (!validateQuickForm()) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const formPayload = formMode === 'full' ? formData : {
        name: 'Quick Request',
        phone: quickData.phone,
        email: '',
        address: '',
        service: quickData.service,
        message: 'Quick estimate request'
      };
      
      if (onSubmit) {
        onSubmit(formPayload);
      }
      
      setSubmitStatus({ 
        success: true, 
        message: formMode === 'full' 
          ? 'Thank you! We will contact you shortly.' 
          : 'Quick request sent! We\'ll call you soon.' 
      });
      
      // Reset forms
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        service: '',
        message: ''
      });
      
      setQuickData({
        phone: '',
        service: preSelectedService || ''
      });
      
    } catch (error) {
      setSubmitStatus({ success: false, message: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchToFull = () => {
    setFormMode('full');
    setQuickErrors({});
    setSubmitStatus(null);
  };

  const switchToQuick = () => {
    setFormMode('quick');
    setErrors({});
    setSubmitStatus(null);
  };

  return (
    <div className="estimate-form-container">
      {/* Mode Toggle */}
      <div className="estimate-form-tabs">
        <button 
          type="button"
          className={`form-tab ${formMode === 'full' ? 'active' : ''}`}
          onClick={switchToFull}
        >
          <FaListAlt /> Full Estimate Form
        </button>
        <button 
          type="button"
          className={`form-tab ${formMode === 'quick' ? 'active' : ''}`}
          onClick={switchToQuick}
        >
          <FaBolt /> Quick Estimate
        </button>
      </div>

      <div className="estimate-form-header">
        <h3>
          {formMode === 'full' ? 'Request an Estimate' : 'Quick Estimate'}
        </h3>
        <p>
          {formMode === 'full' 
            ? 'Fill out the form below and we\'ll get back to you within 24 hours'
            : 'Just provide your phone number and we\'ll call you with a quote!'
          }
        </p>
      </div>

      <form className="estimate-form" onSubmit={handleSubmit} noValidate>
        {formMode === 'full' ? (
          // Full Form Fields
          <>
            {/* Service Selection */}
            <div className="form-group">
              <label htmlFor="service">
                <FaCalendarAlt className="form-icon" />
                Select Your Services <span className="required">*</span>
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className={`form-input ${errors.service ? 'has-error' : ''}`}
              >
                {serviceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.service && <span className="error-message">{errors.service}</span>}
            </div>

            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name">
                <FaUser className="form-icon" />
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`form-input ${errors.name ? 'has-error' : ''}`}
                aria-required="true"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            {/* Contact Number */}
            <div className="form-group">
              <label htmlFor="phone">
                <FaPhone className="form-icon" />
                Contact Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className={`form-input ${errors.phone ? 'has-error' : ''}`}
                aria-required="true"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope className="form-icon" />
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={`form-input ${errors.email ? 'has-error' : ''}`}
                aria-required="true"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* Full Address */}
            <div className="form-group">
              <label htmlFor="address">
                <FaMapMarkerAlt className="form-icon" />
                Address <span className="required">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                rows="3"
                className={`form-input ${errors.address ? 'has-error' : ''}`}
                aria-required="true"
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            {/* Additional Message (Optional) */}
            <div className="form-group">
              <label htmlFor="message">
                Additional Notes <span className="optional">(Optional)</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Any specific requirements or additional information..."
                rows="3"
                className="form-input"
              />
            </div>
          </>
        ) : (
          // Quick Form Fields
          <>
            <div className="quick-form-intro">
              <FaBolt className="quick-icon" />
              <span>Get a fast quote with just your phone number!</span>
            </div>

            {/* Service Selection - Quick */}
            <div className="form-group">
              <label htmlFor="quick-service">
                <FaCalendarAlt className="form-icon" />
                Select Your Services <span className="required">*</span>
              </label>
              <select
                id="quick-service"
                name="service"
                value={quickData.service}
                onChange={handleQuickChange}
                className={`form-input ${quickErrors.service ? 'has-error' : ''}`}
              >
                {serviceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {quickErrors.service && <span className="error-message">{quickErrors.service}</span>}
            </div>

            {/* Phone - Quick */}
            <div className="form-group">
              <label htmlFor="quick-phone">
                <FaPhone className="form-icon" />
                Phone Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="quick-phone"
                name="phone"
                value={quickData.phone}
                onChange={handleQuickChange}
                placeholder="Enter your phone number"
                className={`form-input ${quickErrors.phone ? 'has-error' : ''}`}
                aria-required="true"
              />
              {quickErrors.phone && <span className="error-message">{quickErrors.phone}</span>}
              <span className="field-hint">We'll call you with the quote within minutes!</span>
            </div>

            <button 
              type="button"
              className="switch-form-link"
              onClick={switchToFull}
            >
              Need to add more details? Switch to full form →
            </button>
          </>
        )}

        {/* Submit Status */}
        {submitStatus && (
          <div className={`submit-status ${submitStatus.success ? 'success' : 'error'}`}>
            {submitStatus.message}
          </div>
        )}

        {/* Submit Button */}
        <button 
          type="submit" 
          className="estimate-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? 'Submitting...' 
            : formMode === 'full' 
              ? 'Book Now' 
              : 'Get Quick Quote'
          }
        </button>

        <p className="form-disclaimer">
          {formMode === 'full' 
            ? 'By submitting, you agree to our privacy policy and terms of service.'
            : 'We\'ll call you as soon as possible with your estimate.'
          }
        </p>
      </form>
    </div>
  );
};

export default EstimateForm;
