import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__content">
          <h1 className="hero__title">
            Professional House Cleaning
            <span className="hero__title--highlight"> Services</span>
          </h1>
          <p className="hero__subtitle">
            Experience the difference with our trained professionals, eco-friendly products,
            and 100% satisfaction guarantee. Book your cleaning service today!
          </p>
          <div className="hero__stats">
            <div className="stat">
              <span className="stat__number">10,000+</span>
              <span className="stat__label">Happy Customers</span>
            </div>
            <div className="stat">
              <span className="stat__number">4.8</span>
              <span className="stat__label">Average Rating</span>
            </div>
            <div className="stat">
              <span className="stat__number">10</span>
              <span className="stat__label">Years Experience</span>
            </div>
          </div>
          <div className="hero__actions">
            <Link to="/booking" className="btn btn--primary btn--large">
              Book Now
            </Link>
            <Link to="/services" className="btn btn--secondary btn--large">
              View Services
            </Link>
          </div>
        </div>
        <div className="hero__image">
          <video
            className="hero__video"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/700x395-Diamond-House-Cleaning-Des-Moines.webp"
          >
            <source src="/videos/cleaning videos.mp4" type="video/mp4" />
            {/* Fallback image if video doesn't load */}
            <img
              src="/images/700x395-Diamond-House-Cleaning-Des-Moines.webp"
              alt="Professional House Cleaning Services"
              className="hero__image-placeholder"
            />
          </video>
        </div>
      </div>
    </section>
  );
};

export default Hero;