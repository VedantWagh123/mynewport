  // ============================================================
// MOBILE NAVIGATION FUNCTIONALITY
// Handles hamburger menu, mobile navigation, scroll-based header hiding
// ============================================================
function initMobileNavigation() {
    // Get DOM elements for mobile navigation
    const hamburgerBtn = document.getElementById('hamburgerBtn'); // Hamburger menu button
    const mobileNav = document.getElementById('mobileNav'); // Mobile navigation menu
    const navOverlay = document.getElementById('navOverlay'); // Dark overlay when menu is open
    const navLinks = document.querySelectorAll('.nav-link'); // All navigation links
    const navHeader = document.querySelector('.nav-header'); // Main navigation header

    // Exit if essential elements don't exist
    if (!hamburgerBtn || !mobileNav || !navOverlay) return;

    // Variables for scroll tracking
    let lastScrollTop = 0; // Previous scroll position
    let scrollThreshold = 100; // Minimum scroll before header starts hiding
    let isScrolling = false; // Prevent multiple scroll handlers at once

    // Handle scroll events to show/hide header based on scroll direction
    function handleScroll() {
        // Use requestAnimationFrame for smooth performance
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                // Get current scroll position (cross-browser compatible)
                const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Only apply scroll behavior after threshold is passed
                if (currentScrollTop > scrollThreshold) {
                    // Scrolling DOWN - hide the header
                    if (currentScrollTop > lastScrollTop) {
                        navHeader.classList.add('hidden');
                        navHeader.classList.remove('visible');
                    } 
                    // Scrolling UP - show the header
                    else {
                        navHeader.classList.add('visible');
                        navHeader.classList.remove('hidden');
                    }
                } else {
                    // Always show header when near top of page
                    navHeader.classList.add('visible');
                    navHeader.classList.remove('hidden');
                }
                
                // Update last scroll position (prevent negative values)
                lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
                isScrolling = false;
            });
            isScrolling = true;
        }
    }

    // Add scroll event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Toggle mobile menu open/closed state
    function toggleMobileMenu() {
        // Check if menu is currently open
        const isOpen = mobileNav.classList.contains('active');
        
        if (isOpen) {
            // CLOSE the menu - remove all active classes and restore body scroll
            mobileNav.classList.remove('active');
            navOverlay.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            document.body.style.overflow = ''; // Restore body scrolling
        } else {
            // OPEN the menu - add active classes and prevent body scroll
            mobileNav.classList.add('active');
            navOverlay.classList.add('active');
            hamburgerBtn.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent body scrolling
        }
    }

    // Event listeners for menu toggle
    hamburgerBtn.addEventListener('click', toggleMobileMenu); // Click hamburger button
    navOverlay.addEventListener('click', toggleMobileMenu); // Click overlay to close

    // Close mobile menu when any navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            navOverlay.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            document.body.style.overflow = ''; // Restore body scrolling
        });
    });

    // Close mobile menu when Escape key is pressed
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    // Handle window resize - close mobile menu if switching to desktop
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer); // Clear previous timer
        resizeTimer = setTimeout(() => {
            // If window is desktop-sized and mobile menu is open, close it
            if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
                toggleMobileMenu();
            }
        }, 250); // Wait 250ms after resize stops
    });

    // Initialize scroll state on page load
    handleScroll();
}

// Initialize mobile navigation when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initMobileNavigation();
});
// ============================================================
// PROJECTS SHOWCASE INTERACTIVE FUNCTIONALITY
// This file contains all interactive functionality for the projects showcase section including:
// - Custom cursor with smooth animations and click effects
// - Project filtering and grid management
// - Modal/lightbox functionality for project details
// - Gallery image viewing with navigation
// - Performance optimizations and smooth transitions
// - Touch/swipe support for mobile devices
// ============================================================

// ============================================================
// CUSTOM CURSOR SYSTEM
// Creates a custom animated cursor that follows mouse movement
// Only active on desktop devices (not mobile/tablet)
// ============================================================

// Global cursor variables for tracking and animation state
let cursor = null; // Main cursor element
let cursorOutline = null; // Cursor outline/trail element
let mouseX = 0; // Current mouse X position
let mouseY = 0; // Current mouse Y position
let outlineX = 0; // Current outline X position (for smooth following)
let outlineY = 0; // Current outline Y position (for smooth following)
let isAnimating = false; // Prevent multiple animation loops

// Track mouse position - optimized for performance
// Updates global mouse coordinates on every mouse movement
function handleMouseMove(e) {
  mouseX = e.clientX; // Horizontal mouse position
  mouseY = e.clientY; // Vertical mouse position
  
  // Only set animation flag if not already animating to prevent performance issues
  if (!isAnimating) {
    isAnimating = true;
  }
}

// Mouse down effect - cursor scales down when clicking
// Adds visual feedback for user interactions
function handleMouseDown() {
  cursor?.classList.add('click'); // Add 'click' class for scale animation
}

// Mouse up effect - cursor returns to normal size
// Removes the click effect when mouse button is released
function handleMouseUp() {
  cursor?.classList.remove('click'); // Remove 'click' class
}

// Optimized cursor animation loop using requestAnimationFrame
// Creates smooth trailing effect for cursor outline
function animateCursor() {
  // Calculate distance between mouse and outline position
  const dx = mouseX - outlineX;
  const dy = mouseY - outlineY;
  
  // Move outline towards mouse position with easing (25% speed)
  // This creates a smooth trailing effect
  outlineX += dx * 0.25;
  outlineY += dy * 0.25;

  // Update main cursor position to follow mouse exactly
  if (cursor && isAnimating) {
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }

  // Continue animation loop
  requestAnimationFrame(animateCursor);
}

// Initialize custom cursor with performance optimizations
// Sets up all cursor functionality and event listeners
function initCustomCursor() {
  cursor = document.getElementById('customCursor');
  if (!cursor) return; // Exit if cursor element doesn't exist

  cursorOutline = cursor.querySelector('.cursor-outline');

  // Only enable custom cursor on desktop devices (hover capability)
  // This prevents cursor issues on touch devices
  if (window.matchMedia('(hover: hover)').matches) {
    // Add event listeners for mouse tracking and interactions
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    animateCursor(); // Start animation loop

    // Add hover effects on project cards
    // Hide custom cursor and show default cursor when hovering over project cards
    document.querySelectorAll('.featured-project-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        cursor?.classList.add('hide-cursor'); // Hide custom cursor
        card.style.cursor = 'default'; // Show default cursor
      });
      card.addEventListener('mouseleave', () => {
        cursor?.classList.remove('hide-cursor'); // Show custom cursor again
        card.style.cursor = ''; // Remove inline cursor style
      });
    });

    // Master feature cards cursor effects
    // Hide custom cursor and show default cursor when hovering over feature cards
    document.querySelectorAll('.feature-card.master-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        cursor?.classList.add('hide-cursor'); // Hide custom cursor
        card.style.cursor = 'default'; // Show default cursor
      });
      card.addEventListener('mouseleave', () => {
        cursor?.classList.remove('hide-cursor'); // Show custom cursor again
        card.style.cursor = ''; // Remove inline cursor style
      });
    });

    // Advanced project cards cursor effects
    // Hide custom cursor and show default cursor when hovering over project cards
    document.querySelectorAll('.project-card.advanced-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        cursor?.classList.add('hide-cursor'); // Hide custom cursor
        card.style.cursor = 'default'; // Show default cursor
      });
      card.addEventListener('mouseleave', () => {
        cursor?.classList.remove('hide-cursor'); // Show custom cursor again
        card.style.cursor = ''; // Remove inline cursor style
      });
    });

    // Enhanced cursor effects for project links
    document.querySelectorAll('.project-link, .feature-link').forEach(link => {
      link.addEventListener('mouseenter', () => {
        cursor?.classList.add('link-hover'); // Add link hover state
      });
      link.addEventListener('mouseleave', () => {
        cursor?.classList.remove('link-hover'); // Remove hover effect
      });
    });

    // Tech badges hover effect
    document.querySelectorAll('.tech-badge').forEach(badge => {
      badge.addEventListener('mouseenter', () => {
        cursor?.classList.add('badge-hover'); // Add badge hover state
      });
      badge.addEventListener('mouseleave', () => {
        cursor?.classList.remove('badge-hover'); // Remove hover effect
      });
    });

    // Standard hover effects for other interactive elements
    document.querySelectorAll('a, button, .card-link').forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor?.classList.add('hover'); // Standard hover effect
      });
      element.addEventListener('mouseleave', () => {
        cursor?.classList.remove('hover'); // Remove hover effect
      });
    });

    // Footer hover effect for social links
    document.querySelectorAll('.social-link').forEach(link => {
      link.addEventListener('mouseenter', () => {
        cursor?.classList.add('footer-hover'); // Footer hover effect for social links
      });
      link.addEventListener('mouseleave', () => {
        cursor?.classList.remove('footer-hover'); // Remove hover effect
      });
    });
  } else {
    // Hide custom cursor on mobile/tablet devices
    // Prevents conflicts with native touch cursors
    if (cursor) cursor.style.display = 'none';
  }
}

// ============================================================
// IMAGE LOADING OPTIMIZATION
// Improves perceived performance by handling image loading states
// ============================================================

// Fast image loading optimization with fade-in effects
// Adds 'loaded' class to images when they finish loading
function initImageLoading() {
  const images = document.querySelectorAll('.card-image'); // Get all card images
  
  images.forEach(img => {
    // Check if image is already loaded (from cache)
    if (img.complete && img.naturalHeight !== 0) {
      img.classList.add('loaded'); // Add loaded class immediately
    } else {
      // Add loaded class when image finishes loading
      img.addEventListener('load', () => {
        img.classList.add('loaded'); // Trigger fade-in animation
      }, { once: true }); // Remove listener after first trigger
    }
  });
}

// ============================================================
// SCROLL-BASED NAVIGATION HIDING
// Automatically hides/shows navigation based on scroll direction
// Improves screen real estate when browsing content
// ============================================================

// Hide/Show Navigation on Scroll
// Creates auto-hiding navigation for better content viewing
function initScrollNavigation() {
  const nav = document.querySelector('.main-nav'); // Get main navigation element
  if (!nav) return; // Exit if navigation doesn't exist

  let lastScrollY = 0; // Previous scroll position
  let isNavVisible = true; // Current visibility state

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY; // Current scroll position

    // Hide navigation when scrolling DOWN past 100px
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      if (isNavVisible) {
        // Animate navigation up and out of view
        nav.style.transform = 'translateY(-100%)'; // Move up
        nav.style.opacity = '0'; // Fade out
        nav.style.pointerEvents = 'none'; // Disable interactions
        isNavVisible = false;
      }
    } 
    // Show navigation when scrolling UP
    else if (currentScrollY < lastScrollY) {
      if (!isNavVisible) {
        // Animate navigation back into view
        nav.style.transform = 'translateY(0)'; // Move to original position
        nav.style.opacity = '1'; // Fade in
        nav.style.pointerEvents = 'auto'; // Enable interactions
        isNavVisible = true;
      }
    }

    lastScrollY = currentScrollY; // Update last scroll position
  }, { passive: true }); // Use passive listener for better performance
}

// ============================================================
// INITIALIZATION
// Starts all functionality when the page loads
// ============================================================

// Initialize all interactive features when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  initCustomCursor(); // Start custom cursor system
  initImageLoading(); // Optimize image loading
  initScrollNavigation(); // Enable scroll-based navigation
});