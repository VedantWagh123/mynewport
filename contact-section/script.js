// DOM Elements
const contactForm = document.getElementById('contactForm');
const modal = document.getElementById('successModal');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const particlesContainer = document.getElementById('particlesContainer');
const heroParticlesContainer = document.getElementById('heroParticlesContainer');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeFormValidation();
    initializeMobileMenu();
    initializeScrollAnimations();
    initializeNewsletterForm();
    initializeParticles();
    initializeHeroParticles();
});

// Hero Section Particle System
function initializeHeroParticles() {
    if (!heroParticlesContainer) return;
    
    const particleCount = window.innerWidth < 768 ? 25 : 40;
    const particles = [];
    let animationId;
    let lastTime = 0;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        createHeroParticle(i);
    }
    
    function createHeroParticle(index) {
        const particle = document.createElement('div');
        particle.className = 'hero-particle';
        
        // Random size distribution
        const sizes = ['tiny', 'small', 'medium', 'large'];
        const weights = [0.4, 0.3, 0.2, 0.1]; // More small particles
        const randomWeight = Math.random();
        let size = sizes[0];
        let cumulativeWeight = 0;
        
        for (let i = 0; i < weights.length; i++) {
            cumulativeWeight += weights[i];
            if (randomWeight <= cumulativeWeight) {
                size = sizes[i];
                break;
            }
        }
        
        particle.classList.add(size);
        
        // Random starting position within hero section
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random opacity based on size
        const baseOpacity = size === 'tiny' ? 0.3 : size === 'small' ? 0.4 : size === 'medium' ? 0.5 : 0.6;
        particle.style.opacity = baseOpacity + Math.random() * 0.2;
        
        heroParticlesContainer.appendChild(particle);
        
        // Particle physics properties
        particles.push({
            element: particle,
            x: Math.random() * 100,
            y: Math.random() * 100,
            vx: (Math.random() - 0.5) * 0.3, // Slower movement
            vy: (Math.random() - 0.5) * 0.3,
            size: size,
            opacity: baseOpacity + Math.random() * 0.2,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.02 + Math.random() * 0.03
        });
    }
    
    // Optimized animation loop for hero particles
    function animateHeroParticles(currentTime) {
        if (currentTime - lastTime > 16) { // 60fps cap
            particles.forEach(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around hero section boundaries
                if (particle.x < 0) particle.x = 100;
                if (particle.x > 100) particle.x = 0;
                if (particle.y < 0) particle.y = 100;
                if (particle.y > 100) particle.y = 0;
                
                // Pulsing effect
                particle.pulsePhase += particle.pulseSpeed;
                const pulseFactor = 0.7 + Math.sin(particle.pulsePhase) * 0.3;
                const currentOpacity = particle.opacity * pulseFactor;
                
                // Apply transform and opacity
                particle.element.style.transform = `translate(${particle.x}%, ${particle.y}%)`;
                particle.element.style.opacity = currentOpacity;
            });
            
            lastTime = currentTime;
        }
        
        animationId = requestAnimationFrame(animateHeroParticles);
    }
    
    // Start hero particle animation
    animationId = requestAnimationFrame(animateHeroParticles);
    
    // Mouse interaction for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        let mouseX = 0;
        let mouseY = 0;
        let isMouseInHero = false;
        
        heroSection.addEventListener('mouseenter', () => {
            isMouseInHero = true;
        });
        
        heroSection.addEventListener('mouseleave', () => {
            isMouseInHero = false;
        });
        
        heroSection.addEventListener('mousemove', throttle((e) => {
            if (!isMouseInHero) return;
            
            const rect = heroSection.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) / rect.width;
            mouseY = (e.clientY - rect.top) / rect.height;
            
            // Affect nearby particles
            particles.forEach(particle => {
                const particleX = particle.x / 100;
                const particleY = particle.y / 100;
                
                const distance = Math.sqrt(
                    Math.pow(mouseX - particleX, 2) + 
                    Math.pow(mouseY - particleY, 2)
                );
                
                if (distance < 0.2) { // Within 20% of hero section
                    const force = (0.2 - distance) * 2;
                    const angle = Math.atan2(particleY - mouseY, particleX - mouseX);
                    
                    // Apply force to velocity
                    particle.vx += Math.cos(angle) * force * 0.005;
                    particle.vy += Math.sin(angle) * force * 0.005;
                    
                    // Limit velocity
                    particle.vx = Math.max(-0.5, Math.min(0.5, particle.vx));
                    particle.vy = Math.max(-0.5, Math.min(0.5, particle.vy));
                }
            });
        }, 16));
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
    
    // Pause particles when hero section is not visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animationId = requestAnimationFrame(animateHeroParticles);
            } else {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
            }
        });
    }, { threshold: 0.1 });
    
    heroObserver.observe(heroSection);
}

// Particle System
function initializeParticles() {
    if (!particlesContainer) return;
    
    // Reduce particle count for better performance
    const particleCount = window.innerWidth < 768 ? 15 : 30;
    const particles = [];
    
    // Use requestAnimationFrame for smooth animations
    let animationId;
    let lastTime = 0;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(i);
    }
    
    function createParticle(index) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size
        const sizes = ['small', 'medium'];
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        particle.classList.add(size);
        
        // Random starting position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Use CSS transforms for better performance
        particle.style.willChange = 'transform';
        particle.style.opacity = 0.1 + Math.random() * 0.3;
        
        particlesContainer.appendChild(particle);
        particles.push({
            element: particle,
            x: Math.random() * 100,
            y: Math.random() * 100,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: size === 'small' ? 2 : 3
        });
    }
    
    // Optimized animation loop
    function animateParticles(currentTime) {
        if (currentTime - lastTime > 16) { // 60fps cap
            particles.forEach(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around screen
                if (particle.x < 0) particle.x = 100;
                if (particle.x > 100) particle.x = 0;
                if (particle.y < 0) particle.y = 100;
                if (particle.y > 100) particle.y = 0;
                
                // Apply transform
                particle.element.style.transform = `translate(${particle.x}%, ${particle.y}%)`;
            });
            
            lastTime = currentTime;
        }
        
        animationId = requestAnimationFrame(animateParticles);
    }
    
    // Start animation
    animationId = requestAnimationFrame(animateParticles);
    
    // Simplified mouse interaction (debounced)
    let mouseX = 0;
    let mouseY = 0;
    let isMouseMoving = false;
    let mouseTimeout;
    
    document.addEventListener('mousemove', debounce((e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
        isMouseMoving = true;
        
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
            isMouseMoving = false;
        }, 100);
        
        // Only update nearby particles
        particles.forEach((particle, index) => {
            const particleX = particle.x / 100;
            const particleY = particle.y / 100;
            
            const distance = Math.sqrt(
                Math.pow(mouseX - particleX, 2) + 
                Math.pow(mouseY - particleY, 2)
            );
            
            if (distance < 0.15) { // Reduced interaction range
                const force = (0.15 - distance) * 3;
                const angle = Math.atan2(particleY - mouseY, particleX - mouseX);
                
                particle.vx += Math.cos(angle) * force * 0.01;
                particle.vy += Math.sin(angle) * force * 0.01;
                
                // Limit velocity
                particle.vx = Math.max(-1, Math.min(1, particle.vx));
                particle.vy = Math.max(-1, Math.min(1, particle.vy));
            }
        });
    }, 16)); // 60fps throttle
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
}

// Mobile Menu Toggle
function initializeMobileMenu() {
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Smooth Scrolling for Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Form Validation and Submission
function initializeFormValidation() {
    if (!contactForm) return;

    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    
    // Real-time validation
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.parentElement.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
}

// Field Validation
function validateField(field) {
    const formGroup = field.parentElement;
    const errorElement = formGroup.querySelector('.form-error');
    let isValid = true;
    let errorMessage = '';

    // Remove previous states
    formGroup.classList.remove('error', 'success');
    if (errorElement) errorElement.textContent = '';

    // Required field validation
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && field.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(field.value.trim())) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation
    if (field.type === 'tel' && field.value.trim()) {
        const phonePattern = /^[\d\s\-\+\(\)]+$/;
        if (!phonePattern.test(field.value.trim())) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    // Message length validation
    if (field.id === 'message' && field.value.trim()) {
        if (field.value.trim().length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long';
        } else if (field.value.trim().length > 1000) {
            isValid = false;
            errorMessage = 'Message must be less than 1000 characters';
        }
    }

    // Update UI
    if (!isValid) {
        formGroup.classList.add('error');
        if (errorElement) errorElement.textContent = errorMessage;
    } else if (field.value.trim()) {
        formGroup.classList.add('success');
    }

    return isValid;
}

// Form Validation
function validateForm() {
    const formInputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;

    formInputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    return isFormValid;
}

// Form Submission
function submitForm() {
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Get form data
        const formData = new FormData(contactForm);
        const formDataObject = {};
        
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
        
        console.log('Form Data Submitted:', formDataObject);
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Show success modal
        showSuccessModal();
        
        // Reset form
        contactForm.reset();
        
        // Remove success classes
        contactForm.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('success', 'error');
        });
        
    }, 2000);
}

// Success Modal
function showSuccessModal() {
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// Newsletter Form
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const submitBtn = this.querySelector('button');
        
        if (!emailInput.value.trim()) {
            emailInput.style.borderColor = 'var(--error-color)';
            return;
        }
        
        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            emailInput.style.borderColor = 'var(--error-color)';
            return;
        }
        
        // Show loading state
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;
        
        // Simulate subscription
        setTimeout(() => {
            submitBtn.textContent = 'Subscribed!';
            submitBtn.style.background = 'var(--success-color)';
            
            // Reset after 2 seconds
            setTimeout(() => {
                submitBtn.textContent = 'Subscribe';
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                emailInput.value = '';
                emailInput.style.borderColor = '';
            }, 2000);
        }, 1000);
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.contact-card, .form-content, .form-image, .map-container');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.classList.add('scroll-animate');
        observer.observe(element);
    });
}

// Performance optimization - Debounce function
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

// Throttle function for performance
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
    }
}

// Initialize Animations
function initializeAnimations() {
    // Add entrance animations to elements
    const entranceElements = document.querySelectorAll('.animate-slide-in-left, .animate-slide-in-right, .animate-slide-in-bottom, .animate-fade-in, .animate-fade-in-up, .animate-scale-up');
    
    entranceElements.forEach(element => {
        // Add animation end event listener
        element.addEventListener('animationend', function() {
            this.style.opacity = '1';
        });
    });
    
    // Parallax effect for hero section
    initializeParallax();
    
    // Floating animation for shapes
    initializeFloatingShapes();
}

// Parallax Effect
function initializeParallax() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = heroSection.querySelectorAll('.shape');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Floating Shapes Animation
function initializeFloatingShapes() {
    const shapes = document.querySelectorAll('.shape, .float-element');
    
    shapes.forEach((shape, index) => {
        // Random animation duration and delay
        const duration = 4 + Math.random() * 4; // 4-8 seconds
        const delay = Math.random() * 2; // 0-2 seconds delay
        
        shape.style.animationDuration = `${duration}s`;
        shape.style.animationDelay = `${delay}s`;
    });
}

// Header Scroll Effect
function initializeHeaderScroll() {
    const header = document.querySelector('.animated-header');
    if (!header) return;
    
    let lastScroll = 0;
    let ticking = false;
    let headerVisible = true;
    
    function updateHeader() {
        const currentScroll = window.pageYOffset;
        
        // Hide header when scrolling down, show when scrolling up
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            if (headerVisible) {
                header.style.transform = 'translateY(-100%)';
                headerVisible = false;
            }
        } else {
            // Scrolling up or at top
            if (!headerVisible) {
                header.style.transform = 'translateY(0)';
                headerVisible = true;
            }
        }
        
        // Update header background based on scroll position
        if (currentScroll > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
        }
        
        lastScroll = currentScroll;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
}

// Contact Card Hover Effects
function initializeCardEffects() {
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Button Ripple Effect
function initializeRippleEffect() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .submit-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple effect styles
const rippleStyles = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn-primary, .btn-secondary, .submit-btn {
        position: relative;
        overflow: hidden;
    }
`;

// Add ripple styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = rippleStyles;
document.head.appendChild(styleSheet);

// Initialize all effects
document.addEventListener('DOMContentLoaded', function() {
    initializeHeaderScroll();
    initializeCardEffects();
    initializeRippleEffect();
});

// Form Field Character Counter
function initializeCharacterCounter() {
    const messageField = document.getElementById('message');
    if (!messageField) return;
    
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
        text-align: right;
        font-size: 0.875rem;
        color: var(--text-light);
        margin-top: 0.25rem;
    `;
    
    messageField.parentElement.appendChild(counter);
    
    function updateCounter() {
        const length = messageField.value.length;
        const maxLength = 1000;
        counter.textContent = `${length}/${maxLength} characters`;
        
        if (length > maxLength * 0.9) {
            counter.style.color = 'var(--error-color)';
        } else if (length > maxLength * 0.7) {
            counter.style.color = 'var(--accent-color)';
        } else {
            counter.style.color = 'var(--text-light)';
        }
    }
    
    messageField.addEventListener('input', updateCounter);
    updateCounter();
}

// Initialize character counter
document.addEventListener('DOMContentLoaded', initializeCharacterCounter);

// Tooltips for contact cards
function initializeTooltips() {
    const cardLinks = document.querySelectorAll('.card-link');
    
    cardLinks.forEach(link => {
        link.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('href').startsWith('tel:') || 
                               this.getAttribute('href').startsWith('mailto:') ? 
                               'Click to ' + this.textContent.replace(' →', '') : 
                               'Learn more';
            
            tooltip.style.cssText = `
                position: absolute;
                background: var(--text-dark);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                font-size: 0.875rem;
                white-space: nowrap;
                z-index: 1000;
                pointer-events: none;
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.3s ease;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(0)';
            }, 10);
            
            this.addEventListener('mouseleave', function() {
                tooltip.remove();
            }, { once: true });
        });
    });
}

// Initialize tooltips
document.addEventListener('DOMContentLoaded', initializeTooltips);

// Performance optimization - Debounce scroll events
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

// Apply throttle to scroll events
window.addEventListener('scroll', throttle(() => {
    // Scroll-related functions
}, 100));

// Lazy load images for better performance
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);
