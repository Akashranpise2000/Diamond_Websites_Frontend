import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ImagePlaceholder from './common/ImagePlaceholder';
import './QualityServices.css';

const QualityServices = () => {
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (serviceId) => {
    setImageErrors(prev => ({ ...prev, [serviceId]: true }));
  };

  const services = [
    {
      id: 1,
      title: 'Window Cleaning',
      image: '/images/office cleaning.webp',
      alt: 'Window cleaning service',
      link: '/services/window-cleaning'
    },
    {
      id: 2,
      title: 'Corporate Office Cleaning',
      image: '/images/office cleaning.webp',
      alt: 'Corporate office cleaning service',
      link: '/services/corporate-office-cleaning'
    },
    {
      id: 3,
      title: 'Industrial Housekeeping',
      image: '/images/carpet cleaning.jpg',
      alt: 'Industrial housekeeping service',
      link: '/services/industrial-housekeeping'
    },
    {
      id: 4,
      title: 'Commercial Housekeeping',
      image: '/images/sofa cleaning.webp',
      alt: 'Commercial housekeeping service',
      link: '/services/commercial-housekeeping'
    }
  ];

  return (
    <section className="quality-services">
      <div className="container">
        <h1 className="section-title">QUALITY SERVICES</h1>
        <div className="services-grid">
          {services.map((service) => (
            <Link key={service.id} to={service.link} className="service-link">
              <div className="service-card">
                {imageErrors[service.id] ? (
                  <ImagePlaceholder
                    theme={service.title}
                    className="service-image"
                  />
                ) : (
                  <img
                    src={service.image}
                    alt={service.alt}
                    className="service-image"
                    onError={() => handleImageError(service.id)}
                  />
                )}
                <div className="service-overlay">
                  <h3 className="service-title">{service.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QualityServices;