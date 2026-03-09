import React from 'react';
import { Link } from 'react-router-dom';
import ImagePlaceholder from '../components/common/ImagePlaceholder';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found__container">
        <div className="not-found__content">
          <h1 className="not-found__title">404</h1>
          <h2 className="not-found__subtitle">Page Not Found</h2>
          <p className="not-found__text">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="not-found__actions">
            <Link to="/" className="btn btn--primary">
              Go Home
            </Link>
            <Link to="/contact" className="btn btn--secondary">
              Contact Us
            </Link>
          </div>
        </div>
        <div className="not-found__image">
          <ImagePlaceholder
            theme="404 Page Not Found"
            width={300}
            height={200}
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;