import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaCalendar, FaClock, FaArrowRight } from 'react-icons/fa';
import { blogPosts, categories, getFeaturedPosts } from '../data/blogData';
import './Blog.css';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visiblePosts, setVisiblePosts] = useState(6);

  const featuredPosts = useMemo(() => getFeaturedPosts(), []);

  const filteredPosts = useMemo(() => {
    let posts = blogPosts;
    
    if (selectedCategory !== 'all') {
      posts = posts.filter(post => post.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return posts;
  }, [selectedCategory, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setVisiblePosts(6);
  };

  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setVisiblePosts(6);
  };

  const loadMore = () => {
    setVisiblePosts(prev => prev + 6);
  };

  const displayedPosts = filteredPosts.slice(0, visiblePosts);
  const hasMore = visiblePosts < filteredPosts.length;

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="blog-hero__content">
          <h1 className="blog-hero__title">Cleaning Tips & Insights</h1>
          <p className="blog-hero__subtitle">
            Expert advice, tips, and guides for keeping your home spotless
          </p>
        </div>
      </section>

      <div className="blog-container">
        {/* Search and Categories */}
        <div className="blog-controls">
          {/* Search Bar */}
          <div className="blog-search">
            <div className="blog-search__input-wrapper">
              <FaSearch className="blog-search__icon" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={handleSearch}
                className="blog-search__input"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="blog-categories">
            <button
              className={`blog-category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('all')}
            >
              All Posts
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                className={`blog-category-btn ${selectedCategory === category.slug ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.slug)}
              >
                <span className="blog-category-icon">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        {selectedCategory === 'all' && searchQuery === '' && featuredPosts.length > 0 && (
          <section className="blog-featured">
            <h2 className="blog-section__title">Featured Articles</h2>
            <div className="blog-featured__grid">
              {featuredPosts.map(post => (
                <article key={post.id} className="blog-card blog-card--featured">
                  <Link to={`/blog/${post.slug}`} className="blog-card__image-link">
                    <div className="blog-card__image blog-card__image--featured" style={{ backgroundImage: `url('/images/${post.image}.jpg')` }}>
                      <span className="blog-card__category">{post.categoryName}</span>
                    </div>
                  </Link>
                  <div className="blog-card__content">
                    <h3 className="blog-card__title">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="blog-card__excerpt">{post.excerpt}</p>
                    <div className="blog-card__meta">
                      <span className="blog-card__date">
                        <FaCalendar /> {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <span className="blog-card__read-time">
                        <FaClock /> {post.readTime}
                      </span>
                    </div>
                    <Link to={`/blog/${post.slug}`} className="blog-card__read-more">
                      Read Article <FaArrowRight />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="blog-posts">
          <h2 className="blog-section__title">
            {selectedCategory === 'all' && searchQuery === '' ? 'Latest Articles' : 
             searchQuery ? `Search Results for "${searchQuery}"` : 
             categories.find(c => c.slug === selectedCategory)?.name || 'Articles'}
            <span className="blog-post-count">({filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'})</span>
          </h2>

          {displayedPosts.length > 0 ? (
            <div className="blog-posts__grid">
              {displayedPosts.map(post => (
                <article key={post.id} className="blog-card">
                  <Link to={`/blog/${post.slug}`} className="blog-card__image-link">
                    <div className="blog-card__image" style={{ backgroundImage: `url('/images/${post.image}.jpg')` }}>
                      <span className="blog-card__category">{post.categoryName}</span>
                    </div>
                  </Link>
                  <div className="blog-card__content">
                    <h3 className="blog-card__title">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="blog-card__excerpt">{post.excerpt}</p>
                    <div className="blog-card__meta">
                      <span className="blog-card__date">
                        <FaCalendar /> {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                      <span className="blog-card__read-time">
                        <FaClock /> {post.readTime}
                      </span>
                    </div>
                    <Link to={`/blog/${post.slug}`} className="blog-card__read-more">
                      Read More <FaArrowRight />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="blog-no-results">
              <h3>No articles found</h3>
              <p>Try adjusting your search or filter to find what you're looking for.</p>
              <button 
                className="blog-clear-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {hasMore && (
            <div className="blog-load-more">
              <button className="blog-load-more__btn" onClick={loadMore}>
                Load More Articles
              </button>
            </div>
          )}
        </section>
      </div>

      {/* CTA Section */}
      <section className="blog-cta">
        <div className="blog-cta__content">
          <h2>Need Professional Cleaning Help?</h2>
          <p>Let our expert team handle your cleaning needs while you enjoy a spotless home.</p>
          <div className="blog-cta__buttons">
            <Link to="/services" className="blog-cta__btn blog-cta__btn--primary">
              Our Services
            </Link>
            <Link to="/contact" className="blog-cta__btn blog-cta__btn--secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
