import React, { useState } from 'react';
import './Gallery.css';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  // Gallery images data - combining local and online images
  const galleryImages = [
    // Local images from public/images folder
    {
      id: 1,
      src: '/images/home-cleaning.jpg',
      alt: 'Home Cleaning Service',
      category: 'residential',
      title: 'Complete Home Cleaning',
      description: 'Professional home cleaning service'
    },
    {
      id: 2,
      src: '/images/bathroom-cleaning.jpg',
      alt: 'Bathroom Cleaning',
      category: 'bathroom',
      title: 'Bathroom Deep Clean',
      description: 'Thorough bathroom sanitization'
    },
    {
      id: 3,
      src: '/images/kitchen-cleaning.webp',
      alt: 'Kitchen Cleaning',
      category: 'kitchen',
      title: 'Kitchen Cleaning',
      description: 'Sparkling clean kitchen spaces'
    },
    {
      id: 4,
      src: '/images/office-cleaning.webp',
      alt: 'Office Cleaning',
      category: 'commercial',
      title: 'Office Cleaning',
      description: 'Professional office maintenance'
    },
    {
      id: 5,
      src: '/images/carpet-cleaning.jpg',
      alt: 'Carpet Cleaning',
      category: 'carpet',
      title: 'Carpet Cleaning',
      description: 'Deep carpet cleaning service'
    },
    {
      id: 6,
      src: '/images/sofa-cleaning.webp',
      alt: 'Sofa Cleaning',
      category: 'upholstery',
      title: 'Sofa & Upholstery Cleaning',
      description: 'Furniture cleaning specialists'
    },
    {
      id: 7,
      src: '/images/marble-polish.jpg',
      alt: 'Marble Polishing',
      category: 'flooring',
      title: 'Marble Polishing',
      description: 'Marble floor restoration'
    },
    {
      id: 8,
      src: '/images/facade-cleaning.jpg',
      alt: 'Facade Cleaning',
      category: 'exterior',
      title: 'Building Facade Cleaning',
      description: 'Exterior building maintenance'
    },
    {
      id: 9,
      src: '/images/window-cleaning.jpg',
      alt: 'Window Cleaning',
      category: 'windows',
      title: 'Window Cleaning',
      description: 'Crystal clear window cleaning'
    },
    {
      id: 10,
      src: '/images/post-construction-cleaning.jpg',
      alt: 'Post Construction Cleaning',
      category: 'construction',
      title: 'Post Construction Cleaning',
      description: 'Construction site cleanup'
    },
    {
      id: 11,
      src: '/images/commercial-cleaning.jpg',
      alt: 'Commercial Cleaning',
      category: 'commercial',
      title: 'Commercial Space Cleaning',
      description: 'Office and retail cleaning'
    },
    {
      id: 12,
      src: '/images/residential-cleaning.jpg',
      alt: 'Residential Cleaning',
      category: 'residential',
      title: 'Residential Cleaning',
      description: 'Home cleaning services'
    },

    // High-quality online images for additional variety
    {
      id: 13,
      src: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop',
      alt: 'Professional Cleaning Team',
      category: 'team',
      title: 'Our Expert Team',
      description: 'Trained professionals at work'
    },
    {
      id: 14,
      src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
      alt: 'Eco-friendly Cleaning',
      category: 'eco',
      title: 'Eco-friendly Products',
      description: 'Green cleaning solutions'
    },
    {
      id: 15,
      src: 'https://images.unsplash.com/photo-1584622781564-1d987fa99c66?w=600&h=400&fit=crop',
      alt: 'Deep Cleaning Service',
      category: 'deep-clean',
      title: 'Deep Cleaning',
      description: 'Comprehensive cleaning service'
    },
    {
      id: 16,
      src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      alt: 'Floor Cleaning',
      category: 'flooring',
      title: 'Floor Maintenance',
      description: 'Professional floor care'
    },
    {
      id: 17,
      src: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=600&h=400&fit=crop',
      alt: 'Sanitization Service',
      category: 'disinfection',
      title: 'Disinfection Services',
      description: 'Medical-grade sanitization'
    },
    {
      id: 18,
      src: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop',
      alt: 'Move-in Cleaning',
      category: 'move-in',
      title: 'Move-in/Move-out Cleaning',
      description: 'Property transition cleaning'
    },
    {
      id: 19,
      src: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=600&h=400&fit=crop',
      alt: 'Industrial Cleaning',
      category: 'industrial',
      title: 'Industrial Cleaning',
      description: 'Heavy-duty cleaning solutions'
    },
    {
      id: 20,
      src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      alt: 'Carpet Steam Cleaning',
      category: 'carpet',
      title: 'Steam Carpet Cleaning',
      description: 'Hot water extraction cleaning'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Services', icon: '🖼️' },
    { id: 'residential', name: 'Residential', icon: '🏠' },
    { id: 'commercial', name: 'Commercial', icon: '🏢' },
    { id: 'bathroom', name: 'Bathroom', icon: '🛁' },
    { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
    { id: 'flooring', name: 'Flooring', icon: '🏞️' },
    { id: 'carpet', name: 'Carpet', icon: '🧶' },
    { id: 'upholstery', name: 'Upholstery', icon: '🛋️' },
    { id: 'windows', name: 'Windows', icon: '🪟' },
    { id: 'exterior', name: 'Exterior', icon: '🏗️' },
    { id: 'construction', name: 'Construction', icon: '🔨' },
    { id: 'eco', name: 'Eco-friendly', icon: '🌱' },
    { id: 'disinfection', name: 'Disinfection', icon: '🧴' }
  ];

  const filteredImages = selectedCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="gallery-page">
      {/* Header Section */}
      <div className="gallery-header">
        <h1>Our Cleaning Services Gallery</h1>
        <p>Explore our professional cleaning services through our portfolio of completed projects</p>
      </div>

      {/* Category Filter */}
      <div className="gallery-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="filter-icon">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="gallery-grid">
        {filteredImages.map(image => (
          <div
            key={image.id}
            className="gallery-item"
            onClick={() => openModal(image)}
          >
            <div className="gallery-image-container">
              <img
                src={image.src}
                alt={image.alt}
                className="gallery-image"
                loading="lazy"
                onLoad={(e) => e.target.classList.add('loaded')}
              />
              <div className="gallery-overlay">
                <div className="gallery-info">
                  <h3>{image.title}</h3>
                  <p>{image.description}</p>
                  <span className="view-more">Click to view</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="gallery-modal" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="modal-image"
            />
            <div className="modal-info">
              <h2>{selectedImage.title}</h2>
              <p>{selectedImage.description}</p>
              <span className="modal-category">
                {categories.find(cat => cat.id === selectedImage.category)?.name || 'Service'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="gallery-cta">
        <h2>Ready to Experience Our Cleaning Excellence?</h2>
        <p>Book your professional cleaning service today and see the difference quality makes.</p>
        <button className="cta-button">Book Now</button>
      </div>
    </div>
  );
};

export default Gallery;