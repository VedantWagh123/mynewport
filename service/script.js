// ============================================================
// SERVICES SECTION FUNCTIONALITY
// ============================================================

// Countdown Timer
function initServiceCountdown() {
  const countdownElement = document.getElementById('serviceCountdown');
  if (!countdownElement) return;

  // Set target date to June 1, 2026
  const targetDate = new Date('2026-06-01T00:00:00').getTime();
  
  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      // Countdown expired
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      
      // Update banner text
      const bannerText = document.querySelector('.banner-text');
      if (bannerText) {
        bannerText.textContent = 'Services are now available!';
      }
      
      // Remove coming soon badges
      const badges = document.querySelectorAll('.status-badge.coming-soon');
      badges.forEach(badge => {
        badge.textContent = 'Available';
        badge.classList.remove('coming-soon');
        badge.classList.add('available');
      });
      
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update display with leading zeros
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  };

  // Update immediately
  updateCountdown();
  
  // Update every second
  setInterval(updateCountdown, 1000);
}

// Service Card Mouse Tracking
function initServiceCardTracking() {
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    const cardInner = card.querySelector('.service-card-inner');
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate position as percentage
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;
      
      // Update CSS variables for background gradient
      cardInner.style.setProperty('--mouse-x', `${xPercent}%`);
      cardInner.style.setProperty('--mouse-y', `${yPercent}%`);
      
      // Add subtle tilt effect
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      // Reset transform
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
  });
}

// Service Card Click Handler
function initServiceCardClicks() {
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const serviceName = card.querySelector('.service-title').textContent;
      showServiceNotification(serviceName);
    });
  });
}

// Show Service Notification
function showServiceNotification(serviceName) {
  // Remove existing notification if any
  const existingToast = document.querySelector('.notification-toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification-toast';
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-icon">
        <i class="fas fa-bell"></i>
      </div>
      <div class="notification-text">
        <div class="notification-title">Service Coming Soon!</div>
        <div class="notification-message">${serviceName} will be available starting June 2026. You'll be notified when it's ready!</div>
      </div>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 400);
  }, 5000);
}

// CTA Button Handler
function initServicesCTA() {
  const ctaButton = document.getElementById('servicesCTA');
  
  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      showNotificationToast('Get Notified!', 'You\'ll be the first to know when services launch in June 2026!');
    });
  }
}

// Generic Notification Toast
function showNotificationToast(title, message) {
  // Remove existing notification if any
  const existingToast = document.querySelector('.notification-toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification-toast';
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <div class="notification-text">
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
      </div>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 400);
  }, 4000);
}

// Service Section Intersection Observer
function initServiceSectionAnimations() {
  const serviceCards = document.querySelectorAll('.service-card');
  const ctaSection = document.querySelector('.services-cta');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        
        // Add staggered animation for service cards
        if (entry.target.classList.contains('service-card')) {
          const cards = Array.from(document.querySelectorAll('.service-card'));
          const index = cards.indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 0.1}s`;
        }
      }
    });
  }, observerOptions);
  
  // Observe all service cards and CTA section
  serviceCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
  
  if (ctaSection) {
    ctaSection.style.opacity = '0';
    ctaSection.style.transform = 'translateY(30px)';
    ctaSection.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(ctaSection);
  }
}

// Parallax Effect for Background Elements
function initServiceParallax() {
  const bgShapes = document.querySelectorAll('.bg-shape');
  const floatingIcons = document.querySelectorAll('.floating-icon');
  
  const handleScroll = () => {
    const scrolled = window.pageYOffset;
    const servicesSection = document.querySelector('.services-section');
    
    if (!servicesSection) return;
    
    const sectionTop = servicesSection.offsetTop;
    const sectionHeight = servicesSection.offsetHeight;
    const sectionBottom = sectionTop + sectionHeight;
    
    // Only apply parallax when in services section
    if (scrolled + window.innerHeight > sectionTop && scrolled < sectionBottom) {
      const scrollPercent = (scrolled - sectionTop) / sectionHeight;
      
      bgShapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrollPercent * speed * 100);
        shape.style.transform = `translateY(${yPos}px)`;
      });
      
      floatingIcons.forEach((icon, index) => {
        const speed = 0.3 + (index * 0.05);
        const yPos = -(scrollPercent * speed * 50);
        icon.style.transform = `translateY(${yPos}px)`;
      });
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
}

// Particle Canvas Animation
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Wrap around edges
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }
    
    draw() {
      ctx.fillStyle = `rgba(127, 0, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Create particles
  const particles = [];
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

// Initialize all service section functionality
document.addEventListener('DOMContentLoaded', () => {
  initServiceCountdown();
  initServiceCardTracking();
  initServiceCardClicks();
  initServicesCTA();
  initServiceSectionAnimations();
  initServiceParallax();
  initParticleCanvas();
  initEmailReminderForm();
  initFooterFunctionality();
});

// ============================================================
// FOOTER FUNCTIONALITY
// ============================================================

// Footer Newsletter Handler
function initFooterFunctionality() {
  const footerNewsletter = document.getElementById('footerNewsletter');
  
  if (footerNewsletter) {
    footerNewsletter.addEventListener('submit', handleFooterNewsletterSubmit);
  }
  
  // Initialize footer animations
  initFooterAnimations();
}

// Handle Footer Newsletter Submit
async function handleFooterNewsletterSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const emailInput = form.querySelector('input[type="email"]');
  const submitBtn = form.querySelector('button');
  const email = emailInput.value.trim();
  
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    showNotificationToast('Invalid Email', 'Please enter a valid email address.');
    return;
  }
  
  // Show loading state
  const originalHTML = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  submitBtn.disabled = true;
  
  try {
    // Simulate API call
    await simulateApiCall(email);
    
    // Show success message
    showNotificationToast('Success!', 'You\'ve been subscribed to our newsletter!');
    
    // Clear form
    form.reset();
    
    // Store email
    const storedEmails = JSON.parse(localStorage.getItem('newsletterEmails') || '[]');
    if (!storedEmails.includes(email)) {
      storedEmails.push(email);
      localStorage.setItem('newsletterEmails', JSON.stringify(storedEmails));
    }
    
  } catch (error) {
    showNotificationToast('Error', 'Something went wrong. Please try again.');
  } finally {
    // Reset button
    submitBtn.innerHTML = originalHTML;
    submitBtn.disabled = false;
  }
}

// Footer Animations
function initFooterAnimations() {
  // Animate footer elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe footer sections
  const footerElements = document.querySelectorAll('.footer-left, .footer-middle, .footer-right');
  footerElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    footerObserver.observe(element);
  });
  
  // Animate social links
  const socialLinks = document.querySelectorAll('.social-link');
  socialLinks.forEach((link, index) => {
    link.style.opacity = '0';
    link.style.transform = 'scale(0)';
    link.style.transition = `opacity 0.4s ease ${index * 0.1 + 0.3}s, transform 0.4s ease ${index * 0.1 + 0.3}s`;
    
    setTimeout(() => {
      link.style.opacity = '1';
      link.style.transform = 'scale(1)';
    }, 100);
  });
  
  // Add hover effect to footer links
  const footerLinks = document.querySelectorAll('.footer-links a, .contact-item');
  footerLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transition = 'all 0.3s ease';
    });
  });
  
  // Footer wave animation enhancement
  enhanceFooterWave();
}

// Enhance Footer Wave Animation
function enhanceFooterWave() {
  const footerWave = document.querySelector('.footer-wave');
  if (!footerWave) return;
  
  let scrollY = 0;
  let ticking = false;
  
  function updateWave() {
    const scrollPercent = scrollY / 1000;
    const translateX = Math.sin(scrollPercent) * 30;
    footerWave.style.transform = `translateX(${translateX}px)`;
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateWave);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', () => {
    scrollY = window.pageYOffset;
    requestTick();
  });
}

// Footer Parallax Effect
function initFooterParallax() {
  const footerSection = document.querySelector('.footer-section');
  const floatingShapes = document.querySelectorAll('.shape');
  const particles = document.querySelectorAll('.particle');
  
  if (!footerSection) return;
  
  const handleScroll = () => {
    const scrolled = window.pageYOffset;
    const sectionTop = footerSection.offsetTop;
    const sectionHeight = footerSection.offsetHeight;
    const windowHeight = window.innerHeight;
    
    // Only apply parallax when footer is visible or near visible
    if (scrolled + windowHeight > sectionTop - 200) {
      const scrollPercent = Math.max(0, (scrolled + windowHeight - sectionTop) / (windowHeight + 200));
      
      // Parallax for floating shapes
      floatingShapes.forEach((shape, index) => {
        const speed = 0.3 + (index * 0.1);
        const yPos = -(scrollPercent * speed * 50);
        const xPos = Math.sin(scrollPercent + index) * 20;
        shape.style.transform = `translate(${xPos}px, ${yPos}px)`;
      });
      
      // Parallax for particles
      particles.forEach((particle, index) => {
        const speed = 0.5 + (index * 0.05);
        const yPos = -(scrollPercent * speed * 30);
        const xPos = Math.cos(scrollPercent + index * 2) * 15;
        particle.style.transform = `translate(${xPos}px, ${yPos}px)`;
      });
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
}

// Footer Link Smooth Scroll
function initFooterSmoothScroll() {
  const footerLinks = document.querySelectorAll('.footer-links a[href^="#"]');
  
  footerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Footer Social Link Hover Effects
function initFooterSocialEffects() {
  const socialLinks = document.querySelectorAll('.social-link');
  
  socialLinks.forEach(link => {
    link.addEventListener('mouseenter', (e) => {
      const icon = link.querySelector('i');
      if (icon) {
        icon.style.transform = 'rotate(360deg) scale(1.2)';
        icon.style.transition = 'transform 0.6s ease';
      }
    });
    
    link.addEventListener('mouseleave', (e) => {
      const icon = link.querySelector('i');
      if (icon) {
        icon.style.transform = 'rotate(0deg) scale(1)';
      }
    });
  });
}

// Footer Year Update
function updateFooterYear() {
  const yearElements = document.querySelectorAll('.footer-bottom-left p');
  const currentYear = new Date().getFullYear();
  
  yearElements.forEach(element => {
    element.textContent = element.textContent.replace(/\d{4}/, currentYear);
  });
}

// Initialize all footer-specific features
document.addEventListener('DOMContentLoaded', () => {
  initFooterParallax();
  initFooterSmoothScroll();
  initFooterSocialEffects();
  updateFooterYear();
  initQuickContactForm();
});

// ============================================================
// QUICK CONTACT FORM FUNCTIONALITY
// ============================================================

// Quick Contact Form Handler
function initQuickContactForm() {
  const quickContactForm = document.getElementById('quickContactForm');
  
  if (quickContactForm) {
    quickContactForm.addEventListener('submit', handleQuickContactSubmit);
  }
  
  // Add form field animations
  initFormAnimations();
}

// Handle Quick Contact Submit
async function handleQuickContactSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const nameInput = form.querySelector('#quickName');
  const emailInput = form.querySelector('#quickEmail');
  const messageInput = form.querySelector('#quickMessage');
  const submitBtn = form.querySelector('.contact-submit-btn');
  
  // Validate form
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();
  
  if (!name || !email || !message) {
    showNotificationToast('Validation Error', 'Please fill in all required fields.');
    return;
  }
  
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotificationToast('Invalid Email', 'Please enter a valid email address.');
    return;
  }
  
  // Show loading state
  const originalBtnText = submitBtn.querySelector('.btn-text').textContent;
  const originalBtnIcon = submitBtn.querySelector('i').className;
  submitBtn.querySelector('.btn-text').textContent = 'Sending...';
  submitBtn.querySelector('i').className = 'fas fa-spinner fa-spin';
  submitBtn.disabled = true;
  
  try {
    // Simulate API call
    await simulateApiCall(email);
    
    // Show success message
    showContactSuccess(form);
    showNotificationToast('Message Sent!', 'Thank you for contacting us. We\'ll get back to you soon!');
    
    // Store message in localStorage (for demo purposes)
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push({
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    
    // Reset form after delay
    setTimeout(() => {
      form.reset();
      resetContactForm(form);
    }, 3000);
    
  } catch (error) {
    showNotificationToast('Error', 'Failed to send message. Please try again.');
    resetContactForm(form);
  }
}

// Show Contact Success
function showContactSuccess(form) {
  const successMessage = document.createElement('div');
  successMessage.className = 'contact-form-success show';
  successMessage.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <p>Message sent successfully!</p>
  `;
  
  // Replace form with success message
  form.style.display = 'none';
  form.parentNode.appendChild(successMessage);
}

// Reset Contact Form
function resetContactForm(form) {
  const submitBtn = form.querySelector('.contact-submit-btn');
  submitBtn.querySelector('.btn-text').textContent = 'Send Message';
  submitBtn.querySelector('i').className = 'fas fa-paper-plane';
  submitBtn.disabled = false;
  
  // Remove success message if exists
  const successMessage = form.parentNode.querySelector('.contact-form-success');
  if (successMessage) {
    successMessage.remove();
  }
  
  form.style.display = 'flex';
}

// Form Field Animations
function initFormAnimations() {
  const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
  
  formInputs.forEach(input => {
    // Add focus animations
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
    });
    
    // Add typing animation
    input.addEventListener('input', () => {
      const label = input.nextElementSibling;
      if (label && label.tagName === 'LABEL') {
        label.style.color = 'var(--accent-secondary)';
        setTimeout(() => {
          label.style.color = '';
        }, 300);
      }
    });
  });
  
  // Add button ripple effect
  const submitBtn = document.querySelector('.contact-submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', function(e) {
      const ripple = this.querySelector('.btn-ripple');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
    });
  }
}

// Enhanced Contact Item Interactions
function initContactItemInteractions() {
  const contactItems = document.querySelectorAll('.contact-item');
  
  contactItems.forEach(item => {
    // Add magnetic effect on hover
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const moveX = x * 0.15;
      const moveY = y * 0.15;
      
      item.style.transform = `translateX(${8 + moveX}px) translateY(${moveY}px)`;
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
    
    // Add click feedback
    item.addEventListener('click', () => {
      item.style.transition = 'transform 0.1s ease';
      item.style.transform = 'translateX(12px) scale(0.98)';
      
      setTimeout(() => {
        item.style.transform = '';
        item.style.transition = '';
      }, 100);
    });
  });
}

// Contact Icon Pulse Effects
function initContactIconPulse() {
  const iconWrappers = document.querySelectorAll('.contact-icon-wrapper');
  
  iconWrappers.forEach((wrapper, index) => {
    // Add staggered pulse animations
    setTimeout(() => {
      wrapper.classList.add('pulse-active');
    }, index * 200);
    
    // Enhanced hover effects
    wrapper.addEventListener('mouseenter', () => {
      const icon = wrapper.querySelector('i');
      icon.style.transform = 'scale(1.2) rotate(10deg)';
    });
    
    wrapper.addEventListener('mouseleave', () => {
      const icon = wrapper.querySelector('i');
      icon.style.transform = '';
    });
  });
}

// Initialize all contact enhancements
document.addEventListener('DOMContentLoaded', () => {
  initContactItemInteractions();
  initContactIconPulse();
});

// ============================================================
// EMAIL REMINDER FORM FUNCTIONALITY
// ============================================================

// Email Reminder Form Handler
function initEmailReminderForm() {
  const comingSoonBanner = document.getElementById('comingSoonBanner');
  const notifyBtn = document.getElementById('notifyBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const reminderForm = document.getElementById('reminderForm');
  const emailInput = document.getElementById('emailInput');
  const emailError = document.getElementById('emailError');
  const consentCheckbox = document.getElementById('consentCheckbox');
  const submitBtn = document.getElementById('submitBtn');
  const successMessage = document.getElementById('successMessage');

  // Open modal when clicking on the banner or notify button
  if (comingSoonBanner) {
    comingSoonBanner.addEventListener('click', (e) => {
      // Don't open modal if clicking on the notify button itself
      if (!e.target.closest('.notify-btn')) {
        openReminderModal();
      }
    });
  }

  if (notifyBtn) {
    notifyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openReminderModal();
    });
  }

  // Close modal handlers
  if (modalClose) {
    modalClose.addEventListener('click', closeReminderModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeReminderModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('show')) {
      closeReminderModal();
    }
  });

  // Form submission
  if (reminderForm) {
    reminderForm.addEventListener('submit', handleFormSubmit);
  }

  // Email validation
  if (emailInput) {
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', clearEmailError);
  }
}

// Open Reminder Modal
function openReminderModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  const emailInput = document.getElementById('emailInput');
  
  if (modalOverlay) {
    modalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focus email input after animation
    setTimeout(() => {
      if (emailInput) {
        emailInput.focus();
      }
    }, 300);
  }
}

// Close Reminder Modal
function closeReminderModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  const reminderForm = document.getElementById('reminderForm');
  const successMessage = document.getElementById('successMessage');
  const emailInput = document.getElementById('emailInput');
  const consentCheckbox = document.getElementById('consentCheckbox');
  const submitBtn = document.getElementById('submitBtn');
  
  if (modalOverlay) {
    modalOverlay.classList.remove('show');
    document.body.style.overflow = '';
    
    // Reset form after animation
    setTimeout(() => {
      if (reminderForm) {
        reminderForm.reset();
      }
      if (emailInput) {
        emailInput.classList.remove('error');
      }
      if (emailError) {
        emailError.classList.remove('show');
      }
      if (successMessage) {
        successMessage.classList.remove('show');
      }
      if (submitBtn) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Notify Me';
      }
    }, 300);
  }
}

// Validate Email
function validateEmail() {
  const emailInput = document.getElementById('emailInput');
  const emailError = document.getElementById('emailError');
  const email = emailInput.value.trim();
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    showEmailError('Email address is required');
    return false;
  }
  
  if (!emailRegex.test(email)) {
    showEmailError('Please enter a valid email address');
    return false;
  }
  
  clearEmailError();
  return true;
}

// Show Email Error
function showEmailError(message) {
  const emailInput = document.getElementById('emailInput');
  const emailError = document.getElementById('emailError');
  
  if (emailInput) {
    emailInput.classList.add('error');
  }
  
  if (emailError) {
    emailError.textContent = message;
    emailError.classList.add('show');
  }
}

// Clear Email Error
function clearEmailError() {
  const emailInput = document.getElementById('emailInput');
  const emailError = document.getElementById('emailError');
  
  if (emailInput) {
    emailInput.classList.remove('error');
  }
  
  if (emailError) {
    emailError.classList.remove('show');
  }
}

// Handle Form Submit
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const emailInput = document.getElementById('emailInput');
  const consentCheckbox = document.getElementById('consentCheckbox');
  const submitBtn = document.getElementById('submitBtn');
  const successMessage = document.getElementById('successMessage');
  const reminderForm = document.getElementById('reminderForm');
  
  // Validate email
  if (!validateEmail()) {
    return;
  }
  
  // Check consent
  if (!consentCheckbox.checked) {
    showNotificationToast('Consent Required', 'Please agree to receive notifications to continue.');
    return;
  }
  
  // Show loading state
  if (submitBtn) {
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Submitting...';
  }
  
  // Simulate API call (replace with actual API call)
  try {
    await simulateApiCall(emailInput.value.trim());
    
    // Show success message
    if (successMessage) {
      successMessage.classList.add('show');
    }
    
    // Hide form
    if (reminderForm) {
      reminderForm.style.display = 'none';
    }
    
    // Store email in localStorage (for demo purposes)
    const storedEmails = JSON.parse(localStorage.getItem('serviceNotifications') || '[]');
    if (!storedEmails.includes(emailInput.value.trim())) {
      storedEmails.push(emailInput.value.trim());
      localStorage.setItem('serviceNotifications', JSON.stringify(storedEmails));
    }
    
    // Show success notification
    showNotificationToast('Success!', 'You\'ll be notified when our services launch in June 2026.');
    
    // Close modal after delay
    setTimeout(() => {
      closeReminderModal();
    }, 3000);
    
  } catch (error) {
    // Show error state
    if (submitBtn) {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Notify Me';
    }
    
    showNotificationToast('Error', 'Something went wrong. Please try again.');
  }
}

// Simulate API Call
function simulateApiCall(email) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate 90% success rate
      if (Math.random() > 0.1) {
        resolve({ success: true, email });
      } else {
        reject(new Error('Network error'));
      }
    }, 2000);
  });
}
