import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile } from '../redux/slices/userSlice';
import './About.css';

const About = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { profile, loading } = useSelector(state => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getProfile());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="about">
      <div className="container">
        <div className="about-header">
          <h1>About Diamond House Cleaning Services</h1>
          <p>Professional cleaning services with a commitment to excellence</p>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              At Diamond House Cleaning Services, we are dedicated to providing exceptional
              cleaning services that exceed our customers' expectations. With years of experience
              and a team of trained professionals, we ensure every space is left spotless and hygienic.
            </p>
          </section>

          <section className="about-section">
            <h2>Why Choose Us</h2>
            <ul className="features-list">
              <li>✓ Professional and trained staff</li>
              <li>✓ Eco-friendly cleaning products</li>
              <li>✓ Flexible scheduling</li>
              <li>✓ Competitive pricing</li>
              <li>✓ 100% satisfaction guarantee</li>
            </ul>
          </section>

          {isAuthenticated && (
            <section className="about-section user-info">
              <h2>Your Account Information</h2>
              {loading ? (
                <p>Loading your information...</p>
              ) : (
                <div className="user-details">
                  <div className="detail-item">
                    <strong>Name:</strong> {user?.firstName} {user?.lastName}
                  </div>
                  <div className="detail-item">
                    <strong>Email:</strong> {user?.email}
                  </div>
                  <div className="detail-item">
                    <strong>Phone:</strong> {user?.phone}
                  </div>
                  <div className="detail-item">
                    <strong>Role:</strong> {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Customer'}
                  </div>
                  {profile?.preferredTime && (
                    <div className="detail-item">
                      <strong>Preferred Contact Time:</strong> {profile.preferredTime}
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          <section className="about-section">
            <h2>Contact Us</h2>
            <p>
              Ready to experience our professional cleaning services? Contact us today
              to schedule your cleaning appointment.
            </p>
            <div className="contact-info">
              <p><strong>Phone:</strong> +91 9850781897</p>
              <p><strong>Email:</strong> rahul.nile@g</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;