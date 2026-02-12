/**
 * TRUMPF Website - Main JavaScript
 * Handles mobile navigation, smooth scrolling, and header behavior
 *
 * Security Features:
 * - Input sanitization utilities for XSS prevention
 * - Safe DOM manipulation (no innerHTML with unsanitized input)
 * - Error boundary for robust error handling
 * - External links security (noopener noreferrer)
 */

// ============================================================================
// SECURITY UTILITIES
// ============================================================================

/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} html - HTML string to sanitize
 * @returns {string} Sanitized HTML
 */
const sanitizeHTML = (html) => {
  if (typeof html !== 'string') return '';

  const div = document.createElement('div');
  div.textContent = html; // textContent automatically escapes HTML
  return div.innerHTML;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;

  // RFC 5322 simplified email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
const isValidURL = (url) => {
  if (typeof url !== 'string') return false;

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Sanitize user input (remove HTML tags and dangerous characters)
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
};

/**
 * Log error securely (no sensitive data exposure)
 * @param {string} context - Context where error occurred
 * @param {Error} error - Error object
 */
const logError = (context, error) => {
  // In production: Send to error monitoring service (e.g., Sentry)
  // Never expose stack traces or sensitive data to users

  if (process?.env?.NODE_ENV === 'development') {
    console.error(`[${context}]`, {
      message: error.message,
      name: error.name,
      // Stack trace only in development
      stack: error.stack
    });
  } else {
    // Production: Silent fail or generic message
    // Log to monitoring service here
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Debounce function to limit execution rate of expensive operations
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, wait = 100) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Query selector with error handling
 * @param {string} selector - CSS selector
 * @returns {HTMLElement|null} Element or null
 */
const getElement = (selector) => {
  try {
    return document.querySelector(selector);
  } catch (error) {
    return null;
  }
};

/**
 * Query all selector with error handling
 * @param {string} selector - CSS selector
 * @returns {NodeList} NodeList of elements
 */
const getElements = (selector) => {
  try {
    return document.querySelectorAll(selector);
  } catch (error) {
    return [];
  }
};

// ============================================================================
// MOBILE NAVIGATION
// ============================================================================

/**
 * Initialize mobile navigation toggle functionality
 */
const initMobileNavigation = () => {
  const mobileMenuToggle = getElement('.mobile-menu-toggle');
  const mainNav = getElement('.main-nav');
  const hamburgerIcon = getElement('.hamburger-icon');

  if (!mobileMenuToggle || !mainNav) {
    return;
  }

  let isMenuOpen = false;

  /**
   * Toggle mobile menu open/close
   */
  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;

    // Toggle active class for styling
    mainNav.classList.toggle('is-active', isMenuOpen);
    mobileMenuToggle.classList.toggle('is-active', isMenuOpen);

    if (hamburgerIcon) {
      hamburgerIcon.classList.toggle('is-active', isMenuOpen);
    }

    // Update ARIA attributes for accessibility
    mobileMenuToggle.setAttribute('aria-expanded', isMenuOpen);
    mobileMenuToggle.setAttribute(
      'aria-label',
      isMenuOpen ? 'Menü schließen' : 'Menü öffnen'
    );

    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  };

  /**
   * Close mobile menu
   */
  const closeMenu = () => {
    if (isMenuOpen) {
      toggleMenu();
    }
  };

  /**
   * Trap focus within mobile menu when open
   */
  const trapFocus = (event) => {
    if (!isMenuOpen) return;

    const focusableElements = mainNav.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  // Add focus trap
  document.addEventListener('keydown', trapFocus);

  // Toggle menu on button click
  mobileMenuToggle.addEventListener('click', toggleMenu);

  // Close menu when clicking nav links (mobile only)
  const navLinks = getElements('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      // Check if mobile menu is visible (typically screen width < 768px)
      if (window.innerWidth < 768 && isMenuOpen) {
        closeMenu();
      }
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isMenuOpen) {
      closeMenu();
      mobileMenuToggle.focus(); // Return focus to toggle button
    }
  });

  // Close menu on outside click
  document.addEventListener('click', (event) => {
    if (
      isMenuOpen &&
      !mainNav.contains(event.target) &&
      !mobileMenuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  // Close menu on window resize (if switching to desktop view)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        closeMenu();
      }
    }, 250);
  });
};

// ============================================================================
// SMOOTH SCROLLING
// ============================================================================

/**
 * Initialize smooth scrolling for anchor links
 */
const initSmoothScrolling = () => {
  // Handle all links with hash anchors
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');

    if (!link) return;

    const targetId = link.getAttribute('href');

    // Skip if it's just "#" or invalid
    if (!targetId || targetId === '#') return;

    const targetElement = document.querySelector(targetId);

    if (!targetElement) return;

    // Prevent default jump behavior
    event.preventDefault();

    // Calculate offset for fixed header
    const header = getElement('.header');
    const headerHeight = header ? header.offsetHeight : 0;
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = targetPosition - headerHeight - 20; // 20px extra padding

    // Smooth scroll to target
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // Update URL hash without jumping
    if (history.pushState) {
      history.pushState(null, null, targetId);
    }

    // Set focus to target element for accessibility
    targetElement.setAttribute('tabindex', '-1');
    targetElement.focus({ preventScroll: true });
  });
};

// ============================================================================
// HEADER SCROLL BEHAVIOR
// ============================================================================

/**
 * Initialize header scroll effects
 */
const initHeaderScrollBehavior = () => {
  const header = getElement('.header');

  if (!header) {
    return;
  }

  let lastScrollY = window.pageYOffset;
  const scrollThreshold = 100; // Pixels to scroll before adding shadow

  /**
   * Handle scroll effects on header
   */
  const handleHeaderScroll = () => {
    const currentScrollY = window.pageYOffset;

    // Add/remove shadow class based on scroll position
    if (currentScrollY > scrollThreshold) {
      header.classList.add('has-shadow');
    } else {
      header.classList.remove('has-shadow');
    }

    lastScrollY = currentScrollY;
  };

  // Debounced scroll handler for performance
  const debouncedScrollHandler = debounce(handleHeaderScroll, 50);

  window.addEventListener('scroll', debouncedScrollHandler, { passive: true });

  // Run once on load
  handleHeaderScroll();
};

// ============================================================================
// ACTIVE NAVIGATION LINK (Scroll-based for single-page)
// ============================================================================

/**
 * Update active navigation link based on scroll position (for anchor links)
 */
const initScrollBasedActiveNavigation = () => {
  const navLinks = getElements('.nav-link');

  if (navLinks.length === 0) return;

  /**
   * Determine which section is currently in view
   */
  const updateActiveLink = () => {
    // Get all sections that might have corresponding nav links
    const sections = Array.from(document.querySelectorAll('section[id], main[id]'));

    if (sections.length === 0) return;

    const scrollPosition = window.pageYOffset + 200; // Offset for better UX

    // Find the current section
    let currentSection = null;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentSection = section;
      }
    });

    // Update active state on nav links (only for anchor links)
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');

      if (!href || !href.startsWith('#')) {
        return;
      }

      const targetId = href.substring(1);

      if (currentSection && currentSection.id === targetId) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    });
  };

  // Debounced scroll handler
  const debouncedUpdateActive = debounce(updateActiveLink, 100);

  window.addEventListener('scroll', debouncedUpdateActive, { passive: true });

  // Run once on load
  updateActiveLink();
};

// ============================================================================
// ACTIVE NAVIGATION LINK (Page-based for multi-page)
// ============================================================================

/**
 * Set active navigation link based on current page
 * Works for multi-page websites with separate HTML files
 */
const initPageBasedActiveNavigation = () => {
  const navLinks = getElements('.nav-link');

  if (navLinks.length === 0) return;

  /**
   * Get current page name from URL
   * @returns {string} Current page name without extension
   */
  const getCurrentPage = () => {
    const pathname = window.location.pathname;
    const filename = pathname.split('/').pop();

    // Handle root path or empty filename (defaults to index)
    if (!filename || filename === '' || filename === '/') {
      return 'index';
    }

    // Remove .html extension if present
    return filename.replace('.html', '');
  };

  const currentPage = getCurrentPage();

  /**
   * Update active state on navigation links
   */
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const pageName = link.getAttribute('data-page');

    // Skip anchor links (handled by scroll-based navigation)
    if (href && href.startsWith('#')) {
      return;
    }

    // Check if this link points to the current page
    const isCurrentPage = pageName === currentPage ||
                          href === `${currentPage}.html` ||
                          (currentPage === 'index' && (href === '/' || href === 'index.html'));

    if (isCurrentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
};

// ============================================================================
// EXTERNAL LINK ACCESSIBILITY
// ============================================================================

/**
 * Add accessibility attributes to external links
 */
const initExternalLinks = () => {
  const links = getElements('a[href^="http"]');

  links.forEach((link) => {
    const href = link.getAttribute('href');
    const currentHost = window.location.hostname;

    // Check if link is external
    if (href && !href.includes(currentHost)) {
      // Add rel attributes for security and SEO
      if (!link.getAttribute('rel')) {
        link.setAttribute('rel', 'noopener noreferrer');
      }

      // Add target blank if not already set
      if (!link.getAttribute('target')) {
        link.setAttribute('target', '_blank');
      }

      // Add screen reader hint for external links
      const srHint = link.querySelector('.sr-only');
      if (!srHint) {
        const span = document.createElement('span');
        span.className = 'sr-only';
        span.textContent = ' (öffnet in neuem Tab)';
        link.appendChild(span);
      }
    }
  });
};

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

/**
 * Log performance metrics (only in development)
 */
const logPerformanceMetrics = () => {
  // Performance metrics removed for production
  // Use browser DevTools Performance tab or Lighthouse for performance analysis
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize all functionality when DOM is ready
 */
const init = () => {
  try {
    initMobileNavigation();
  } catch (error) {
    logError('initMobileNavigation', error);
  }

  try {
    initSmoothScrolling();
  } catch (error) {
    logError('initSmoothScrolling', error);
  }

  try {
    initHeaderScrollBehavior();
  } catch (error) {
    logError('initHeaderScrollBehavior', error);
  }

  try {
    initPageBasedActiveNavigation(); // Multi-page navigation (primary)
  } catch (error) {
    logError('initPageBasedActiveNavigation', error);
  }

  try {
    initScrollBasedActiveNavigation(); // Single-page anchor navigation (secondary)
  } catch (error) {
    logError('initScrollBasedActiveNavigation', error);
  }

  try {
    initExternalLinks();
  } catch (error) {
    logError('initExternalLinks', error);
  }

  try {
    logPerformanceMetrics();
  } catch (error) {
    logError('logPerformanceMetrics', error);
  }
};

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM is already loaded
  init();
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // Initialization functions
    init,
    initMobileNavigation,
    initSmoothScrolling,
    initHeaderScrollBehavior,
    initPageBasedActiveNavigation,
    initScrollBasedActiveNavigation,
    // Security utilities
    sanitizeHTML,
    sanitizeInput,
    isValidEmail,
    isValidURL,
    logError
  };
}
