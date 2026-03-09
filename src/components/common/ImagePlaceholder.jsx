import React, { useState } from 'react';
import './ImagePlaceholder.css';

const ImagePlaceholder = ({ theme, width = 300, height = 200, className = '' }) => {
  const [imageError, setImageError] = useState(false);

  // Generate a themed placeholder image URL
  const placeholderUrl = `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(theme)}`;

  if (imageError) {
    return (
      <div className={`image-placeholder ${className}`}>
        <div className="image-placeholder-fallback">
          {theme}
        </div>
      </div>
    );
  }

  return (
    <div className={`image-placeholder ${className}`}>
      <img
        src={placeholderUrl}
        alt={`${theme} placeholder`}
        onError={() => setImageError(true)}
        className="image-placeholder-img"
      />
    </div>
  );
};

export default ImagePlaceholder;