import { useEffect } from 'react';

/**
 * Custom hook for SEO optimization
 * Updates document title and meta tags dynamically
 */
export const useSEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website'
}) => {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update meta tags
    const updateMetaTag = (name, content, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Update Open Graph tags
    if (title) updateMetaTag('og:title', title, true);
    if (description) updateMetaTag('og:description', description, true);
    if (image) updateMetaTag('og:image', image, true);
    if (url) updateMetaTag('og:url', url, true);
    if (type) updateMetaTag('og:type', type, true);

    // Update Twitter tags
    if (title) updateMetaTag('twitter:title', title, true);
    if (description) updateMetaTag('twitter:description', description, true);
    if (image) updateMetaTag('twitter:image', image, true);

    // Update standard meta tags
    if (description) updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);

  }, [title, description, keywords, image, url, type]);
};

/**
 * Hook for lazy loading images with intersection observer
 */
export const useLazyLoading = () => {
  useEffect(() => {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));

    return () => imageObserver.disconnect();
  }, []);
};

/**
 * Hook for performance monitoring
 */
export const usePerformance = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    if ('web-vitals' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }

    // Monitor navigation timing
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      console.log('Navigation Performance:', {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart
      });
    }
  }, []);
};

/**
 * Hook for service worker registration
 */
export const useServiceWorker = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);
};

/**
 * Hook for preloading critical resources
 */
export const usePreload = (resources = []) => {
  useEffect(() => {
    resources.forEach(resource => {
      if (resource.type === 'image') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = resource.src;
        document.head.appendChild(link);
      } else if (resource.type === 'font') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        link.href = resource.src;
        document.head.appendChild(link);
      }
    });
  }, [resources]);
};