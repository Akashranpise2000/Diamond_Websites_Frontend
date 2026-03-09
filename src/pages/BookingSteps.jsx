import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getServices } from '../redux/slices/serviceSlice';
import { addToCart, setServiceAddress, setSchedule, clearCart } from '../redux/slices/cartSlice';
import { createBooking } from '../redux/slices/bookingSlice';
import './BookingSteps.css';

const BookingSteps = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [serviceConfig, setServiceConfig] = useState({
    quantity: 1,
    addOns: [],
    area: 500
  });
  const [address, setAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });
  const [schedule, setScheduleData] = useState({
    date: '',
    timeSlot: ''
  });
  const [customFields, setCustomFields] = useState({
    priority: '',
    specialRequests: '',
    notes: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { serviceSlug } = useParams();

  const { services, loading: servicesLoading } = useSelector(state => state.services);
  const { items: cartItems, totals, serviceAddress, scheduledDate, scheduledTimeSlot } = useSelector(state => state.cart);
  const { loading: bookingLoading } = useSelector(state => state.bookings);

  // Find service by slug if provided in URL
  const urlService = serviceSlug ? services.find(service => service.slug === serviceSlug) : null;

  // Determine initial step based on existing cart data
  const getInitialStep = () => {
    if (cartItems.length > 0 && serviceAddress && scheduledDate && scheduledTimeSlot) {
      return 5; // Review step
    } else if (cartItems.length > 0 && serviceAddress && scheduledDate) {
      return 4; // Schedule step
    } else if (cartItems.length > 0 && serviceAddress) {
      return 3; // Address step
    } else if (cartItems.length > 0) {
      return 2; // Configure step
    }
    return 1; // Service selection step
  };

  const [currentStep, setCurrentStep] = useState(getInitialStep);

  useEffect(() => {
    dispatch(getServices({ limit: 20 }));
  }, [dispatch]);

  // Initialize form data from cart state
  useEffect(() => {
    if (serviceAddress) {
      setAddress(serviceAddress);
    }
    if (scheduledDate || scheduledTimeSlot) {
      setScheduleData({
        date: scheduledDate || '',
        timeSlot: scheduledTimeSlot || ''
      });
    }
  }, [serviceAddress, scheduledDate, scheduledTimeSlot]);

  // Pre-select service from URL parameter
  useEffect(() => {
    if (serviceSlug && !urlService) {
      // Service not found, redirect to general booking
      toast.error('Service not found');
      navigate('/booking', { replace: true });
    } else if (urlService && !selectedService) {
      setSelectedService(urlService);
      // If no cart items, start at step 2 (configure)
      if (cartItems.length === 0) {
        setCurrentStep(2);
      }
    }
  }, [serviceSlug, urlService, selectedService, cartItems.length, navigate]);

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    nextStep();
  };

  const handleServiceConfig = () => {
    if (!selectedService) return;

    const cartItem = {
      service: selectedService,
      quantity: serviceConfig.quantity,
      addOns: serviceConfig.addOns
    };

    dispatch(addToCart(cartItem));
    nextStep();
  };

  const handleAddressSubmit = () => {
    if (!address.addressLine1 || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill in all required address fields');
      return;
    }

    dispatch(setServiceAddress(address));
    nextStep();
  };

  const handleScheduleSubmit = () => {
    if (!schedule.date || !schedule.timeSlot) {
      toast.error('Please select date and time');
      return;
    }

    dispatch(setSchedule({
      date: schedule.date,
      timeSlot: schedule.timeSlot
    }));
    nextStep();
  };

  const handleBookingSubmit = async () => {
    try {
      // Validate cart items have required fields
      if (!cartItems || cartItems.length === 0) {
        toast.error('No services selected');
        return;
      }

      for (const item of cartItems) {
         if (!item.serviceId || !item.serviceName) {
           console.error('Invalid cart item:', item);
           toast.error('Invalid service data. Please select services again.');
           return;
         }
       }

      // Validate address
      if (!address.pincode || !/^\d{5,6}$/.test(address.pincode)) {
        toast.error('Please enter a valid 5-6 digit pincode');
        return;
      }

      const bookingData = {
        services: cartItems.map(item => ({
          serviceId: item.serviceId,
          serviceName: item.serviceName || 'Unknown Service',
          quantity: item.quantity || 1,
          basePrice: item.basePrice || 0,
          addOns: (item.addOns || []).map(addOn => ({
            name: addOn.name,
            price: addOn.price
          })),
          subtotal: item.totalPrice || 0
        })),
        serviceAddress: {
          street: `${address.addressLine1}${address.addressLine2 ? ', ' + address.addressLine2 : ''}`,
          city: address.city,
          state: address.state,
          zipCode: address.pincode,
          country: 'India'
        },
        scheduledDate: new Date(schedule.date).toISOString(),
        scheduledTimeSlot: schedule.timeSlot,
        specialInstructions: '',
        customFields: Object.fromEntries(
          Object.entries(customFields).filter(([key, value]) => value.trim() !== '')
        ),
        pricing: {
          subtotal: totals.subtotal || 0,
          tax: totals.tax || 0,
          discount: 0,
          total: totals.total || 0
        }
      };

      console.log('Booking data being sent:', JSON.stringify(bookingData, null, 2));

      const result = await dispatch(createBooking(bookingData)).unwrap();

      if (result && result._id) {
        toast.success('Booking created successfully!');

        // Clear cart
        dispatch(clearCart());

        // Navigate to success page
        navigate('/booking-success');
      } else {
        throw new Error('Booking creation failed - no booking data returned');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error || 'Failed to create booking');
    }
  };


  const renderStepIndicator = () => (
    <div className="booking-steps">
      {[1, 2, 3, 4, 5].map(step => (
        <div
          key={step}
          className={`step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
        >
          <div className="step-number">{step}</div>
          <div className="step-label">
            {step === 1 && 'Select Service'}
            {step === 2 && 'Configure'}
            {step === 3 && 'Address'}
            {step === 4 && 'Schedule'}
            {step === 5 && 'Review & Book'}
          </div>
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="booking-step">
      <h2>Select a Service</h2>
      <div className="services-grid">
        {servicesLoading ? (
          <div className="loading">Loading services...</div>
        ) : (
          services.map(service => (
            <div
              key={service._id}
              className="service-card"
              onClick={() => handleServiceSelect(service)}
            >
              <div className="service-icon">🧹</div>
              <h3>{service.serviceName}</h3>
              <p>{service.shortDescription}</p>
              <div className="service-price">
                From ₹{service.basePrice}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="booking-step">
      <h2>Configure Your Service</h2>
      {selectedService && (
        <div className="service-config">
          <div className="service-summary">
            <h3>{selectedService.serviceName}</h3>
            <p>{selectedService.description}</p>
          </div>

          <div className="config-options">
            <div className="config-group">
              <label>Quantity</label>
              <input
                type="number"
                min="1"
                value={serviceConfig.quantity}
                onChange={(e) => setServiceConfig({
                  ...serviceConfig,
                  quantity: parseInt(e.target.value)
                })}
              />
            </div>

            {selectedService.addOns && selectedService.addOns.length > 0 && (
              <div className="config-group">
                <label>Add-ons</label>
                {selectedService.addOns.map((addOn, index) => (
                  <label key={index} className="addon-option">
                    <input
                      type="checkbox"
                      checked={serviceConfig.addOns.some(a => a.name === addOn.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setServiceConfig({
                            ...serviceConfig,
                            addOns: [...serviceConfig.addOns, addOn]
                          });
                        } else {
                          setServiceConfig({
                            ...serviceConfig,
                            addOns: serviceConfig.addOns.filter(a => a.name !== addOn.name)
                          });
                        }
                      }}
                    />
                    {addOn.name} (+₹{addOn.price})
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="price-summary">
            <div className="price-breakdown">
              <div>Base Price: ₹{selectedService.basePrice * serviceConfig.quantity}</div>
              {serviceConfig.addOns.map((addOn, index) => (
                <div key={index}>+ {addOn.name}: ₹{addOn.price * serviceConfig.quantity}</div>
              ))}
              <div className="total">Total: ₹{calculateServiceTotal()}</div>
            </div>
          </div>
        </div>
      )}

      <div className="step-actions">
        <button className="btn btn--secondary" onClick={prevStep}>
          Back
        </button>
        <button className="btn btn--primary" onClick={handleServiceConfig}>
          Continue
        </button>
      </div>
    </div>
  );

  const calculateServiceTotal = () => {
    if (!selectedService) return 0;
    const baseTotal = selectedService.basePrice * serviceConfig.quantity;
    const addOnTotal = serviceConfig.addOns.reduce((sum, addOn) => sum + addOn.price, 0) * serviceConfig.quantity;
    return baseTotal + addOnTotal;
  };

  const renderStep3 = () => (
    <div className="booking-step">
      <h2>Service Address</h2>
      <div className="address-form">
        <div className="form-row">
          <div className="form-group">
            <label>Address Line 1 *</label>
            <input
              type="text"
              value={address.addressLine1}
              onChange={(e) => setAddress({...address, addressLine1: e.target.value})}
              placeholder="House/Flat number, Street name"
              required
            />
          </div>
          <div className="form-group">
            <label>Address Line 2</label>
            <input
              type="text"
              value={address.addressLine2}
              onChange={(e) => setAddress({...address, addressLine2: e.target.value})}
              placeholder="Apartment, Building name"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City *</label>
            <input
              type="text"
              value={address.city}
              onChange={(e) => setAddress({...address, city: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>State *</label>
            <input
              type="text"
              value={address.state}
              onChange={(e) => setAddress({...address, state: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Pincode *</label>
            <input
              type="text"
              value={address.pincode}
              onChange={(e) => setAddress({...address, pincode: e.target.value})}
              pattern="[0-9]{6}"
              required
            />
          </div>
          <div className="form-group">
            <label>Landmark</label>
            <input
              type="text"
              value={address.landmark}
              onChange={(e) => setAddress({...address, landmark: e.target.value})}
              placeholder="Near landmark"
            />
          </div>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn btn--secondary" onClick={prevStep}>
          Back
        </button>
        <button className="btn btn--primary" onClick={handleAddressSubmit}>
          Continue
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="booking-step">
      <h2>Select Date & Time</h2>
      <div className="schedule-form">
        <div className="form-group">
          <label>Preferred Date *</label>
          <input
            type="date"
            value={schedule.date}
            onChange={(e) => setScheduleData({...schedule, date: e.target.value})}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group">
          <label>Preferred Time Slot *</label>
          <select
            value={schedule.timeSlot}
            onChange={(e) => setScheduleData({...schedule, timeSlot: e.target.value})}
            required
          >
            <option value="">Select time slot</option>
            <option value="9:00 AM - 11:00 AM">9:00 AM - 11:00 AM</option>
            <option value="11:00 AM - 1:00 PM">11:00 AM - 1:00 PM</option>
            <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
            <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
          </select>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn btn--secondary" onClick={prevStep}>
          Back
        </button>
        <button className="btn btn--primary" onClick={handleScheduleSubmit}>
          Continue
        </button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="booking-step">
      <h2>Review & Confirm Booking</h2>
      <div className="booking-summary">
        <div className="summary-section">
          <h3>Service Details</h3>
          {cartItems.map((item, index) => (
            <div key={index} className="service-item">
              <div className="service-info">
                <h4>{item.serviceName}</h4>
                <p>Quantity: {item.quantity}</p>
                {item.addOns.length > 0 && (
                  <p>Add-ons: {item.addOns.map(addon => addon.name).join(', ')}</p>
                )}
              </div>
              <div className="service-price">₹{item.totalPrice}</div>
            </div>
          ))}
        </div>

        <div className="summary-section">
          <h3>Service Address</h3>
          <p>{address.addressLine1}</p>
          {address.addressLine2 && <p>{address.addressLine2}</p>}
          <p>{address.city}, {address.state} - {address.pincode}</p>
          {address.landmark && <p>Landmark: {address.landmark}</p>}
        </div>

        <div className="summary-section">
          <h3>Schedule</h3>
          <p>Date: {new Date(schedule.date).toLocaleDateString()}</p>
          <p>Time: {schedule.timeSlot}</p>
        </div>

        <div className="summary-section">
          <h3>Additional Information</h3>
          <div className="custom-fields-form">
            <div className="form-group">
              <label>Priority Level</label>
              <select
                value={customFields.priority}
                onChange={(e) => setCustomFields({...customFields, priority: e.target.value})}
              >
                <option value="">Select priority (optional)</option>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label>Special Requests</label>
              <textarea
                value={customFields.specialRequests}
                onChange={(e) => setCustomFields({...customFields, specialRequests: e.target.value})}
                placeholder="Any special requests or requirements..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                value={customFields.notes}
                onChange={(e) => setCustomFields({...customFields, notes: e.target.value})}
                placeholder="Any additional notes..."
                rows="2"
              />
            </div>
          </div>
        </div>

        <div className="summary-section">
          <h3>Price Summary</h3>
          <div className="price-breakdown">
            <div>Subtotal: ₹{totals.subtotal}</div>
            <div>GST (18%): ₹{totals.tax}</div>
            <div className="total">Total: ₹{totals.total}</div>
          </div>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn btn--secondary" onClick={prevStep}>
          Back
        </button>
        <button
          className="btn btn--primary"
          onClick={handleBookingSubmit}
          disabled={bookingLoading}
        >
          {bookingLoading ? 'Creating Booking...' : 'Confirm & Pay'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="booking-container">
      {renderStepIndicator()}

      <div className="booking-content">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
      </div>

    </div>
  );
};

export default BookingSteps;