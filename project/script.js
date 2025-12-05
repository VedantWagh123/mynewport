// ============================================================
// MOBILE NAVIGATION FUNCTIONALITY
// ============================================================
function initMobileNavigation() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const navHeader = document.querySelector('.nav-header');

    if (!hamburgerBtn || !mobileNav || !navOverlay) return;

    let lastScrollTop = 0;
    let scrollThreshold = 100;
    let isScrolling = false;

    function handleScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (currentScrollTop > scrollThreshold) {
                    if (currentScrollTop > lastScrollTop) {
                        navHeader.classList.add('hidden');
                        navHeader.classList.remove('visible');
                    } else {
                        navHeader.classList.add('visible');
                        navHeader.classList.remove('hidden');
                    }
                } else {
                    navHeader.classList.add('visible');
                    navHeader.classList.remove('hidden');
                }
                
                lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
                isScrolling = false;
            });
            isScrolling = true;
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    function toggleMobileMenu() {
        const isOpen = mobileNav.classList.contains('active');
        
        if (isOpen) {
            mobileNav.classList.remove('active');
            navOverlay.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            mobileNav.classList.add('active');
            navOverlay.classList.add('active');
            hamburgerBtn.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hamburgerBtn.addEventListener('click', toggleMobileMenu);
    navOverlay.addEventListener('click', toggleMobileMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            navOverlay.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
                toggleMobileMenu();
            }
        }, 250);
    });

    handleScroll();
}

// Initialize mobile navigation
document.addEventListener('DOMContentLoaded', function() {
    initMobileNavigation();
});
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
// ============================================================

// Global cursor variables for tracking and animation
let cursor = null;
let cursorOutline = null;
let mouseX = 0;
let mouseY = 0;
let outlineX = 0;
let outlineY = 0;
let isAnimating = false;

// Track mouse position - optimized for performance
function handleMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Only animate if not already animating to prevent performance issues
  if (!isAnimating) {
    isAnimating = true;
  }
}

// Mouse down effect - cursor scales down when clicking
function handleMouseDown() {
  cursor?.classList.add('click');
}

// Mouse up effect - cursor returns to normal size
function handleMouseUp() {
  cursor?.classList.remove('click');
}

// Optimized cursor animation - minimal reflows
function animateCursor() {
  const dx = mouseX - outlineX;
  const dy = mouseY - outlineY;
  
  // Faster follow speed
  outlineX += dx * 0.25;
  outlineY += dy * 0.25;

  if (cursor && isAnimating) {
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }

  requestAnimationFrame(animateCursor);
}

// Initialize cursor with performance optimization
function initCustomCursor() {
  cursor = document.getElementById('customCursor');
  if (!cursor) return;

  cursorOutline = cursor.querySelector('.cursor-outline');

  // Only on desktop (not mobile)
  if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    animateCursor();

    // Hover effects on project cards
    const projectCards = document.querySelectorAll('.project-card.advanced-card');
    projectCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        cursor?.classList.add('hover');
      });
      card.addEventListener('mouseleave', () => {
        cursor?.classList.remove('hover');
      });
    });

    // Hover effects on footer theory boxes
    const theoryBoxes = document.querySelectorAll('.theory-box');
    theoryBoxes.forEach((box) => {
      box.addEventListener('mouseenter', () => {
        cursor?.classList.add('footer-hover');
      });
      box.addEventListener('mouseleave', () => {
        cursor?.classList.remove('footer-hover');
      });
    });

    // Hover effects on footer nav links
    const footerLinks = document.querySelectorAll('.footer-nav-link');
    footerLinks.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        cursor?.classList.add('hover');
      });
      link.addEventListener('mouseleave', () => {
        cursor?.classList.remove('hover');
      });
    });

    // Hover effects on social links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        cursor?.classList.add('footer-hover');
      });
      link.addEventListener('mouseleave', () => {
        cursor?.classList.remove('footer-hover');
      });
    });
  } else {
    // Hide cursor on mobile
    if (cursor) cursor.style.display = 'none';
  }
}

// Fast image loading optimization
function initImageLoading() {
  const images = document.querySelectorAll('.card-image');
  
  images.forEach(img => {
    if (img.complete && img.naturalHeight !== 0) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      }, { once: true });
    }
  });
}

// Hide/Show Navigation on Scroll
function initScrollNavigation() {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;

  let lastScrollY = 0;
  let isNavVisible = true;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Hide nav when scrolling down
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      if (isNavVisible) {
        nav.style.transform = 'translateY(-100%)';
        nav.style.opacity = '0';
        nav.style.pointerEvents = 'none';
        isNavVisible = false;
      }
    } 
    // Show nav when scrolling up
    else if (currentScrollY < lastScrollY) {
      if (!isNavVisible) {
        nav.style.transform = 'translateY(0)';
        nav.style.opacity = '1';
        nav.style.pointerEvents = 'auto';
        isNavVisible = true;
      }
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  initCustomCursor();
  initImageLoading();
  initScrollNavigation();
});

