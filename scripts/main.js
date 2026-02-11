/**
 * TRUMPF Landing Page - Main JavaScript
 * Security: XSS Protection, CSP Compliant, No Inline Scripts
 */

'use strict';

// ============================================
// SECURITY UTILITIES
// ============================================

const SecurityUtils = {
    /**
     * Sanitize HTML to prevent XSS attacks
     */
    sanitizeHTML: function(str) {
        if (typeof str !== 'string') return '';
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },
    
    /**
     * Validate URLs to prevent javascript: or data: URIs
     */
    sanitizeURL: function(url) {
        if (typeof url !== 'string') return null;
        
        const dangerousProtocols = /^(javascript|data|vbscript|file):/i;
        if (dangerousProtocols.test(url.trim())) {
            console.warn('Security: Blocked dangerous URL protocol');
            return null;
        }
        
        const allowedProtocols = /^(https?:|mailto:|tel:|#)/i;
        if (!allowedProtocols.test(url.trim()) && !url.startsWith('/')) {
            console.warn('Security: Invalid URL protocol');
            return null;
        }
        
        return url;
    }
};

// ============================================
// MOBILE NAVIGATION
// ============================================

function initMobileNavigation() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (!navbarToggle || !navbarMenu) {
        return;
    }
    
    navbarToggle.addEventListener('click', function(event) {
        event.preventDefault();
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!isExpanded));
        navbarMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navbarMenu.classList.contains('active')) {
            navbarMenu.classList.remove('active');
            navbarToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('nav-open');
        }
    });
}

// ============================================
// SMOOTH SCROLLING
// ============================================

function initSmoothScrolling() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            
            if (!href || href === '#' || href === '#kontaktformular') {
                return;
            }
            
            // Security: Sanitize to prevent injection
            const sanitizedHref = SecurityUtils.sanitizeHTML(href);
            if (sanitizedHref !== href) {
                console.warn('Security: Blocked potentially malicious href');
                event.preventDefault();
                return;
            }
            
            event.preventDefault();
            
            try {
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                    
                    const navbarMenu = document.querySelector('.navbar-menu');
                    const navbarToggle = document.querySelector('.navbar-toggle');
                    
                    if (navbarMenu && navbarMenu.classList.contains('active')) {
                        navbarMenu.classList.remove('active');
                        if (navbarToggle) {
                            navbarToggle.setAttribute('aria-expanded', 'false');
                        }
                        document.body.classList.remove('nav-open');
                    }
                }
            } catch (error) {
                console.error('Error during smooth scrolling:', error.message);
            }
        });
    });
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================

function initHeaderScrollEffect() {
    let ticking = false;
    const header = document.querySelector('.header');
    
    if (!header) {
        return;
    }
    
    function updateHeader() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    try {
        initMobileNavigation();
        initSmoothScrolling();
        initHeaderScrollEffect();
    } catch (error) {
        console.error('Initialization error:', error.message);
    }
});
