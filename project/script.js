// Optimized cursor animation for performance
// ============================================

let cursor = null;
let cursorOutline = null;
let mouseX = 0;
let mouseY = 0;
let outlineX = 0;
let outlineY = 0;
let isAnimating = false;

// Track mouse position - debounced for performance
function handleMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  if (!isAnimating) {
    isAnimating = true;
  }
}

// Click effect
function handleMouseDown() {
  cursor?.classList.add('click');
}

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

