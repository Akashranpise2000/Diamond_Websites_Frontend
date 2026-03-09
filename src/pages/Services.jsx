import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import servicesData from '../data/servicesData';
import './Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filterServices = useCallback(() => {
    let filtered = services.filter(service => service.isActive);

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    setFilteredServices(filtered);
  }, [services, searchTerm, selectedCategory]);

  const fetchServices = async () => {
    try {
      // In a real app, fetch from API
      // const response = await api.get('/services');
      // setServices(response.data.data);

      // Use shared services data
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [filterServices]);

  const categories = [
    { value: 'all', label: 'All Services' },
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'deep_cleaning', label: 'Deep Cleaning' },
    { value: 'office', label: 'Office' },
    { value: 'specialty', label: 'Specialty' }
  ];

  if (loading) {
    return (
      <div className="services-page">
        <div className="loading">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Our Services</h1>
        <p>Professional cleaning services tailored to your needs</p>
      </div>

      <div className="services-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category.value}
              className={`category-btn ${selectedCategory === category.value ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="services-grid">
        {filteredServices.map((service) => (
          <div key={service._id} className="service-card">
            <div className="service-image">
              <img
                src={service.image}
                alt={service.serviceName}
                onError={(e) => {
                  e.target.src = '/images/700x395-Diamond-House-Cleaning-Des-Moines.webp'; // fallback image
                }}
              />
            </div>
            <div className="service-content">
              <h3 className="service-title">{service.serviceName}</h3>
              <p className="service-description">{service.shortDescription}</p>
              <div className="service-details">
                <div className="service-price">
                  <span className="price">₹{service.basePrice}</span>
                  <span className="duration">{service.duration} min</span>
                </div>
                <div className="service-category">
                  {service.category.replace('_', ' ').toUpperCase()}
                </div>
              </div>
              <Link
                to={`/services/${service.slug}`}
                className="btn btn--primary service-btn"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="no-services">
          <p>No services found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Services;