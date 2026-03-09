import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaStar, FaUsers, FaAward, FaClock, FaShieldAlt } from 'react-icons/fa';
import Hero from '../components/Hero';
import QualityServices from '../components/QualityServices';
import servicesData from '../data/servicesData';
import './Home.css';

// Transform services data for home page display
const homeServicesData = servicesData.map(service => ({
  id: service.slug,
  title: service.serviceName,
  image: service.image,
  alt: `${service.serviceName} services`,
  slug: service.slug
}));

const Home = () => {
  useEffect(() => {
    // Add any initialization logic here
    document.title = 'Diamond House Cleaning Services - Professional Cleaning Services';
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <Hero />

      {/* Quality Services Section */}
      <QualityServices />

      {/* Services Section */}
      <section className="services-preview">
        <div className="container">

          <div className="services-image-grid">
            {homeServicesData.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.slug}`}
                className="service-image-card"
                aria-label={`Learn more about ${service.title}`}
              >
                <div className="service-image-container">
                  <img
                    src={service.image}
                    alt={service.alt}
                    loading="lazy"
                    className="service-image"
                  />
                  <div className="service-overlay">
                    <h3 className="service-title">{service.title}</h3>
                    <span className="service-link-text">Learn More</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="services-cta">
            <Link to="/services" className="btn btn--primary">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Diamond House Cleaning Services?</h2>
            <p className="section-subtitle">
              What sets us apart from other cleaning services
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3>Quality Guarantee</h3>
              <p>100% satisfaction guarantee with our professional cleaning services</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3>Verified Professionals</h3>
              <p>Background-checked, trained, and experienced cleaning staff</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaClock />
              </div>
              <h3>Flexible Scheduling</h3>
              <p>Same-day, next-day, or scheduled bookings at your convenience</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaCheck />
              </div>
              <h3>Eco-Friendly Products</h3>
              <p>Safe, non-toxic cleaning products for your family and pets</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaStar />
              </div>
              <h3>Transparent Pricing</h3>
              <p>Clear, upfront pricing with no hidden charges or fees</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaAward />
              </div>
              <h3>5-Star Service</h3>
              <p>Consistently rated 4.8+ stars by our satisfied customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">
              Real reviews from real customers
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="star" />
                ))}
              </div>
              <p className="testimonial-text">
                "Excellent service! The cleaners were professional, thorough, and used eco-friendly products.
                My home has never looked better. Highly recommend!"
              </p>
              <div className="testimonial-author">
                <strong>Sarah Johnson</strong>
                <span>Mumbai, Maharashtra</span>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="star" />
                ))}
              </div>
              <p className="testimonial-text">
                "Diamond House Cleaning Services transformed our office space. The team was punctual, efficient, and paid
                great attention to detail. Will definitely book again!"
              </p>
              <div className="testimonial-author">
                <strong>Rajesh Kumar</strong>
                <span>Delhi, India</span>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="star" />
                ))}
              </div>
              <p className="testimonial-text">
                "Outstanding deep cleaning service. They cleaned areas I didn't even know needed cleaning.
                The price was fair and the results were amazing!"
              </p>
              <div className="testimonial-author">
                <strong>Priya Sharma</strong>
                <span>Bangalore, Karnataka</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience Clean Like Never Before?</h2>
            <p>
              Book your professional cleaning service today and enjoy a spotless home or office.
              Our team is ready to serve you with excellence.
            </p>
            <div className="cta-actions">
              <Link to="/booking" className="btn btn--primary btn--large">
                Book Your Cleaning
              </Link>
              <Link to="/contact" className="btn btn--secondary btn--large">
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;