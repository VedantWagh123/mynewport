// ============================================================
// PROJECT 2 - ADVANCED ANIMATIONS AND INTERACTIONS
// This script contains all interactive functionality including:
// - Custom cursor with advanced animations
// - Smooth scroll animations
// - Card tilt effects
// - Navigation functionality
// - Background particle animations
// - Interactive hover effects
// ============================================================

// ============================================================
// GLOBAL VARIABLES AND INITIALIZATION
// ============================================================
let cursor = null;
let cursorDot = null;
let cursorOutline = null;
let mouseX = 0;
let mouseY = 0;
let outlineX = 0;
let outlineY = 0;
let isAnimating = false;

// Performance optimization variables
let ticking = false;
let lastTime = 0;

// ============================================================
// CUSTOM CURSOR SYSTEM
// ============================================================

// Initialize custom cursor
function initCustomCursor() {
    cursor = document.getElementById('customCursor');
    if (!cursor) return;

    cursorDot = cursor.querySelector('.cursor-dot');
    cursorOutline = cursor.querySelector('.cursor-outline');

    // Only enable on desktop devices
    if (window.matchMedia('(hover: hover)').matches) {
        setupCursorEventListeners();
        startCursorAnimation();
        setupHoverEffects();
    } else {
        // Hide cursor on mobile devices
        cursor.style.display = 'none';
    }
}

// Setup cursor event listeners
function setupCursorEventListeners() {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
}

// Handle mouse movement with performance optimization
function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (!ticking) {
        requestAnimationFrame(updateCursorPosition);
        ticking = true;
    }
}

// Update cursor position
function updateCursorPosition() {
    if (cursorDot) {
        cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    }
    
    // Smooth outline following with easing
    const dx = mouseX - outlineX;
    const dy = mouseY - outlineY;
    
    outlineX += dx * 0.15;
    outlineY += dy * 0.15;
    
    if (cursorOutline) {
        cursorOutline.style.transform = `translate(${outlineX - 20}px, ${outlineY - 20}px)`;
    }
    
    ticking = false;
}

// Handle mouse down - cursor click effect
function handleMouseDown() {
    cursor?.classList.add('click');
}

// Handle mouse up - remove click effect
function handleMouseUp() {
    cursor?.classList.remove('click');
}

// Handle mouse leave - hide cursor
function handleMouseLeave() {
    cursor?.classList.add('hidden');
}

// Handle mouse enter - show cursor
function handleMouseEnter() {
    cursor?.classList.remove('hidden');
}

// Start cursor animation loop
function startCursorAnimation() {
    function animate() {
        if (!ticking) {
            requestAnimationFrame(updateCursorPosition);
            ticking = true;
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// Setup hover effects for interactive elements
function setupHoverEffects() {
    // Feature cards hover effect
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => cursor?.classList.add('hover'));
        card.addEventListener('mouseleave', () => cursor?.classList.remove('hover'));
    });

    // Project cards hover effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => cursor?.classList.add('hover'));
        card.addEventListener('mouseleave', () => cursor?.classList.remove('hover'));
    });

    // Showcase cards hover effect
    const showcaseCards = document.querySelectorAll('.showcase-card');
    showcaseCards.forEach(card => {
        card.addEventListener('mouseenter', () => cursor?.classList.add('hover'));
        card.addEventListener('mouseleave', () => cursor?.classList.remove('hover'));
    });

    // Navigation links hover effect
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => cursor?.classList.add('hover'));
        link.addEventListener('mouseleave', () => cursor?.classList.remove('hover'));
    });

    // Buttons hover effect
    const buttons = document.querySelectorAll('.cta-button, .nav-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => cursor?.classList.add('hover'));
        button.addEventListener('mouseleave', () => cursor?.classList.remove('hover'));
    });

    // Project links hover effect
    const projectLinks = document.querySelectorAll('.project-link');
    projectLinks.forEach(link => {
        link.addEventListener('mouseenter', () => cursor?.classList.add('hover'));
        link.addEventListener('mouseleave', () => cursor?.classList.remove('hover'));
    });

    // Social links hover effect
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => cursor?.classList.add('hover'));
        link.addEventListener('mouseleave', () => cursor?.classList.remove('hover'));
    });
}

// ============================================================
// CARD TILT EFFECTS
// ============================================================

// Initialize 3D tilt effects for cards
function initCardTiltEffects() {
    const tiltCards = document.querySelectorAll('[data-tilt]');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', handleCardTilt);
        card.addEventListener('mouseleave', resetCardTilt);
    });
}

// Handle card tilt on mouse move
function handleCardTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
}

// Reset card tilt when mouse leaves
function resetCardTilt(e) {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
}

// ============================================================
// SMOOTH SCROLL ANIMATIONS
// ============================================================

// Initialize smooth scroll animations
function initSmoothScroll() {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });
}

// Handle smooth scroll to anchor
function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ============================================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================================

// Initialize scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(handleScrollAnimation, observerOptions);
    
    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        observer.observe(card);
    });
    
    // Observe project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        observer.observe(card);
    });
    
    // Observe showcase items
    const showcaseItems = document.querySelectorAll('.showcase-item');
    showcaseItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        observer.observe(item);
    });
}

// Handle scroll-triggered animations
function handleScrollAnimation(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const delay = Array.from(element.parentNode.children).indexOf(element) * 100;
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay);
            
            entry.target.unobserve(entry.target);
        }
    });
}

// ============================================================
// SCROLL-BASED NAVIGATION HIDING
// ============================================================

// Initialize scroll-based navigation hiding
function initScrollNavigation() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;

    let lastScrollY = 0;
    let isNavVisible = true;
    let scrollThreshold = 100;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;

                // Hide navigation when scrolling DOWN past threshold
                if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
                    if (isNavVisible) {
                        nav.classList.add('nav-hidden');
                        nav.style.transform = 'translateY(-100%)';
                        nav.style.opacity = '0';
                        nav.style.pointerEvents = 'none';
                        isNavVisible = false;
                    }
                } 
                // Show navigation when scrolling UP or near top
                else if (currentScrollY < lastScrollY || currentScrollY < scrollThreshold) {
                    if (!isNavVisible) {
                        nav.classList.remove('nav-hidden');
                        nav.style.transform = 'translateY(0)';
                        nav.style.opacity = '1';
                        nav.style.pointerEvents = 'auto';
                        isNavVisible = true;
                    }
                }

                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// Initialize navigation functionality
function initNavigation() {
    const backBtn = document.getElementById('backBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (backBtn) {
        backBtn.addEventListener('click', handleBackNavigation);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', handleNextNavigation);
    }
    
    // Initialize mobile navigation
    initMobileNavigation();
}

// Handle back navigation
function handleBackNavigation() {
    // Add page transition effect
    document.body.style.transition = 'opacity 0.3s ease-out';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        // Navigate to previous page (adjust path as needed)
        window.location.href = '../project/index.html';
    }, 300);
}

// Handle next navigation
function handleNextNavigation() {
    // Add page transition effect
    document.body.style.transition = 'opacity 0.3s ease-out';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        // Navigate to next page (adjust path as needed)
        window.location.href = '../service/index.html';
    }, 300);
}

// Initialize mobile navigation
function initMobileNavigation() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburgerBtn.contains(e.target) && !navMenu.contains(e.target)) {
                if (navMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    }
}

// Toggle mobile menu with enhanced animations
function toggleMobileMenu() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    const isActive = navMenu.classList.toggle('active');
    hamburgerBtn.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (isActive) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = '';
    }
    
    // Animate hamburger lines
    const spans = hamburgerBtn.querySelectorAll('span');
    if (isActive) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// ============================================================
// BACKGROUND ANIMATIONS
// ============================================================

// Initialize background particle animations
function initBackgroundAnimations() {
    animateGradientOrbs();
    createFloatingParticles();
}

// Animate gradient orbs
function animateGradientOrbs() {
    const orbs = document.querySelectorAll('.gradient-orb');
    
    orbs.forEach((orb, index) => {
        // Random animation parameters
        const duration = 15 + Math.random() * 10;
        const delay = index * 2;
        
        orb.style.animationDuration = `${duration}s`;
        orb.style.animationDelay = `${delay}s`;
    });
}

// Create floating particles
function createFloatingParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) return;
    
    // Create additional particles dynamically
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// ============================================================
// PARALLAX EFFECTS
// ============================================================

// Initialize parallax effects
function initParallaxEffects() {
    window.addEventListener('scroll', handleParallax);
}

// Handle parallax scrolling
function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.gradient-orb');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

// ============================================================
// LOADING ANIMATIONS
// ============================================================

// Initialize loading animations
function initLoadingAnimations() {
    // Animate title words on page load
    const titleWords = document.querySelectorAll('.title-word');
    titleWords.forEach((word, index) => {
        const delay = parseInt(word.dataset.delay) || 0;
        word.style.animationDelay = `${delay}ms`;
    });
    
    // Animate hero content
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const ctaButton = document.querySelector('.cta-button');
    
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroSubtitle.style.transition = 'all 1s ease-out';
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 800);
    }
    
    if (ctaButton) {
        ctaButton.style.opacity = '0';
        ctaButton.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            ctaButton.style.transition = 'all 1s ease-out';
            ctaButton.style.opacity = '1';
            ctaButton.style.transform = 'translateY(0)';
        }, 1200);
    }
}

// ============================================================
// PERFORMANCE OPTIMIZATIONS
// ============================================================

// Initialize performance optimizations
function initPerformanceOptimizations() {
    // Debounce scroll events
    let scrollTimer;
    window.addEventListener('scroll', () => {
        if (scrollTimer) {
            cancelAnimationFrame(scrollTimer);
        }
        scrollTimer = requestAnimationFrame(() => {
            // Scroll-based animations here
        });
    }, { passive: true });
    
    // Optimize images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
    });
}

// ============================================================
// MAIN INITIALIZATION
// ============================================================

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Project 2 Advanced Animations...');
    
    // Initialize all systems
    initCustomCursor();
    initCardTiltEffects();
    initSmoothScroll();
    initScrollAnimations();
    initScrollNavigation();
    initNavigation();
    initBackgroundAnimations();
    initParallaxEffects();
    initLoadingAnimations();
    initPerformanceOptimizations();
    initMobileNavigation();
    
    console.log('Project 2 initialization complete!');
});

// Handle window resize events
window.addEventListener('resize', () => {
    // Recalculate any size-dependent animations
    const cursor = document.getElementById('customCursor');
    if (window.innerWidth <= 768 && cursor) {
        cursor.style.display = 'none';
    } else if (cursor) {
        cursor.style.display = 'block';
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        console.log('Page hidden - pausing animations');
    } else {
        // Resume animations when page is visible
        console.log('Page visible - resuming animations');
    }
});

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Export functions for potential external use
window.Project2Animations = {
    scrollToTop,
    isInViewport,
    debounce,
    throttle
};
