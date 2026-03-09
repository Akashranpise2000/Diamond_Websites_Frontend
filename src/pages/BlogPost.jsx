import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendar, FaUser, FaClock, FaArrowLeft, FaShareAlt, FaTag } from 'react-icons/fa';
import { getPostBySlug, categories, blogPosts } from '../data/blogData';
import './Blog.css';

const BlogPost = () => {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  useEffect(() => {
    if (post) {
      // Update page title
      document.title = `${post.title} - Diamond House Cleaning Blog`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.metaDescription);
      }
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, [post]);

  if (!post) {
    return (
      <div className="blog-post-not-found">
        <div className="blog-post-not-found__content">
          <h1>Article Not Found</h1>
          <p>The article you're looking for doesn't exist or has been moved.</p>
          <Link to="/blog" className="blog-back-link">
            <FaArrowLeft /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Get related posts (same category, excluding current post)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  // Format content - convert markdown-style headings to HTML
  const formatContent = (content) => {
    return content
      .split('\n')
      .map((line, index) => {
        const trimmed = line.trim();
        
        if (trimmed.startsWith('## ')) {
          return `<h2 key="${index}">${trimmed.replace('## ', '')}</h2>`;
        } else if (trimmed.startsWith('### ')) {
          return `<h3 key="${index}">${trimmed.replace('### ', '')}</h3>`;
        } else if (trimmed.startsWith('- ')) {
          return `<li key="${index}">${trimmed.replace('- ', '')}</li>`;
        } else if (trimmed.match(/^\d+\. /)) {
          return `<li key="${index}" class="numbered">${trimmed.replace(/^\d+\. /, '')}</li>`;
        } else if (trimmed.startsWith('|')) {
          // Skip table rows for simplicity - could be enhanced
          return '';
        } else if (trimmed === '') {
          return '<br key="" />';
        } else {
          return `<p key="${index}">${trimmed}</p>`;
        }
      })
      .join('');
  };

  return (
    <div className="blog-post-page">
      {/* Breadcrumb */}
      <nav className="blog-breadcrumb">
        <div className="blog-container">
          <Link to="/">Home</Link>
          <span className="blog-breadcrumb__separator">/</span>
          <Link to="/blog">Blog</Link>
          <span className="blog-breadcrumb__separator">/</span>
          <span className="blog-breadcrumb__current">{post.title}</span>
        </div>
      </nav>

      {/* Article Header */}
      <header className="blog-post-header">
        <div className="blog-container">
          <div className="blog-post-header__category">
            <Link to={`/blog?category=${post.category}`} className="blog-post-category-tag">
              {post.categoryName}
            </Link>
          </div>
          <h1 className="blog-post-header__title">{post.title}</h1>
          <div className="blog-post-header__meta">
            <span className="blog-post-meta__item">
              <FaUser /> {post.author}
            </span>
            <span className="blog-post-meta__item">
              <FaCalendar /> {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="blog-post-meta__item">
              <FaClock /> {post.readTime}
            </span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="blog-post-hero">
        <div className="blog-container">
          <div 
            className="blog-post-hero__image" 
            style={{ backgroundImage: `url('/images/${post.image}.jpg')` }}
            role="img"
            aria-label={post.title}
          />
        </div>
      </div>

      {/* Article Content */}
      <article className="blog-post-content">
        <div className="blog-container">
          <div className="blog-post-content__wrapper">
            {/* Share Buttons */}
            <div className="blog-post-share">
              <span className="blog-post-share__label"><FaShareAlt /></span>
              <button className="blog-post-share__btn" aria-label="Share on Facebook">FB</button>
              <button className="blog-post-share__btn" aria-label="Share on Twitter">TW</button>
              <button className="blog-post-share__btn" aria-label="Print article" onClick={() => window.print()}>
                <FaTag />
              </button>
            </div>

            {/* Main Content */}
            <div 
              className="blog-post-body"
              dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
            />

            {/* Tags */}
            <div className="blog-post-tags">
              <span className="blog-post-tags__label">Tags:</span>
              <Link to={`/blog?category=${post.category}`} className="blog-post-tag">
                {post.categoryName}
              </Link>
              <Link to="/blog?category=tips-tricks" className="blog-post-tag">
                Tips & Tricks
              </Link>
              <Link to="/blog?category=house-cleaning" className="blog-post-tag">
                House Cleaning
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="blog-related">
          <div className="blog-container">
            <h2 className="blog-related__title">Related Articles</h2>
            <div className="blog-related__grid">
              {relatedPosts.map(relatedPost => (
                <article key={relatedPost.id} className="blog-card blog-card--related">
                  <Link to={`/blog/${relatedPost.slug}`} className="blog-card__image-link">
                    <div 
                      className="blog-card__image" 
                      style={{ backgroundImage: `url('/images/${relatedPost.image}.jpg')` }}
                    >
                      <span className="blog-card__category">{relatedPost.categoryName}</span>
                    </div>
                  </Link>
                  <div className="blog-card__content">
                    <h3 className="blog-card__title">
                      <Link to={`/blog/${relatedPost.slug}`}>{relatedPost.title}</Link>
                    </h3>
                    <div className="blog-card__meta">
                      <span className="blog-card__date">
                        <FaCalendar /> {new Date(relatedPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Blog */}
      <div className="blog-container">
        <Link to="/blog" className="blog-back-link">
          <FaArrowLeft /> Back to All Articles
        </Link>
      </div>

      {/* CTA Section */}
      <section className="blog-cta blog-cta--post">
        <div className="blog-cta__content">
          <h2>Ready for a Cleaner Home?</h2>
          <p>Let our professional cleaning team transform your space into a spotless sanctuary.</p>
          <div className="blog-cta__buttons">
            <Link to="/booking" className="blog-cta__btn blog-cta__btn--primary">
              Book Now
            </Link>
            <Link to="/contact" className="blog-cta__btn blog-cta__btn--secondary">
              Get Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
