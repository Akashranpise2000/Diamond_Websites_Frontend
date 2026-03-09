import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import servicesData from '../data/servicesData';
import EstimateForm from '../components/common/EstimateForm';
import './ServiceDetail.css';

const ServiceDetail = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use shared services data

  useEffect(() => {
    const foundService = servicesData.find(s => s.slug === slug);
    setService(foundService);
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="service-detail-page">
        <div className="loading">Loading service details...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="service-detail-page">
        <div className="not-found">
          <h1>Service Not Found</h1>
          <p>The service you're looking for doesn't exist.</p>
          <Link to="/services" className="btn btn--primary">Back to Services</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="service-detail-page">
      <div className="service-hero">
        <div className="service-hero-content">
          <div className="service-image-large">
            {service.video ? (
              <div className="service-video-container">
                <video
                  controls
                  autoPlay
                  muted
                  loop
                  className="service-video"
                  poster={service.image}
                >
                  <source src={service.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <span className="service-video-badge">
                  <span className="video-icon">▶</span> Watch Demo
                </span>
              </div>
            ) : (
              <img
                src={service.image}
                alt={service.serviceName}
                onError={(e) => {
                  e.target.src = '/images/700x395-Diamond-House-Cleaning-Des-Moines.webp';
                }}
              />
            )}
          </div>
          <div className="service-info">
            <h1 className="service-title">{service.serviceName}</h1>
            <p className="service-description">{service.description}</p>
            <div className="service-meta">
              <div className="service-price">
                <span className="price">₹{service.basePrice}</span>
                <span className="duration">{service.duration} minutes</span>
              </div>
              <div className="service-category">
                {service.category.replace('_', ' ').toUpperCase()}
              </div>
            </div>
            <div className="service-actions">
              <Link to={`/booking/${service.slug}`} className="btn btn--primary btn--large">
                Book This Service
              </Link>
              <Link to="/contact" className="btn btn--secondary btn--large">
                Get Quote
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="service-features">
        <h2>What We Include</h2>
        <div className="features-grid">
          {service.features.map((feature, index) => (
            <div key={index} className="feature-item">
              <span className="feature-check">✓</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Estimate Request Form */}
      <div className="service-estimate-form">
        <EstimateForm preSelectedService={service.slug} />
      </div>

      <div className="service-cta">
        <h2>Ready to Book?</h2>
        <p>Get your {service.serviceName.toLowerCase()} scheduled today!</p>
        <div className="cta-buttons">
          <Link to={`/booking/${service.slug}`} className="btn btn--primary">
            Book Now
          </Link>
          <Link to="/services" className="btn btn--secondary">
            View All Services
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;