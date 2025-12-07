// ============================================================
// TESTIMONIALS PAGE - COMPLETE JAVASCRIPT FUNCTIONALITY
// ============================================================
// This file contains all interactive functionality for the testimonials section including:
// - Carousel navigation with auto-scroll and manual controls
// - Star rating display and animations
// - Parallax mouse effects
// - Intersection observer for scroll animations
// - Floating particle effects
// - Feedback form handling with validation
// - Back-to-top button functionality
// - Touch/swipe support for mobile devices
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // ============================================================
    // DOM ELEMENT REFERENCES
    // ============================================================
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(track.children);
    const nextButton = document.querySelector('.next');
    const prevButton = document.querySelector('.prev');
    const sectionHeader = document.querySelector('.section-header');
    const testimonialSection = document.querySelector('.testimonial-section');
    
    // Mobile Navigation Elements
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    const navOverlay = document.getElementById('navOverlay');

    // ============================================================
    // INITIALIZATION FUNCTIONS
    // ============================================================
    // Initialize all interactive features when page loads
    initAnimations();
    initCarousel();
    initStarRatings();
    initParallaxEffect();
    initIntersectionObserver();
    initMobileNavigation(); // Add mobile navigation initialization

    // ============================================================
    // MOBILE NAVIGATION FUNCTIONALITY
    // ============================================================
    function initMobileNavigation() {
        console.log('Initializing mobile navigation...');
        
        if (!hamburgerBtn || !mobileNav || !navOverlay) {
            console.error('Mobile navigation elements not found:', {
                hamburgerBtn: !!hamburgerBtn,
                mobileNav: !!mobileNav,
                navOverlay: !!navOverlay
            });
            return;
        }

        console.log('Mobile navigation elements found, adding event listeners...');

        // Toggle mobile navigation
        hamburgerBtn.addEventListener('click', (e) => {
            console.log('Hamburger button clicked!');
            e.preventDefault();
            toggleMobileNav();
        });
        
        // Close navigation when clicking overlay
        navOverlay.addEventListener('click', (e) => {
            console.log('Overlay clicked, closing nav...');
            e.preventDefault();
            closeMobileNav();
        });
        
        // Close navigation when clicking on a nav link
        const navLinks = mobileNav.querySelectorAll('.nav-link');
        console.log(`Found ${navLinks.length} navigation links`);
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                console.log('Nav link clicked, closing nav...');
                closeMobileNav();
            });
        });

        // Close navigation on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                console.log('Escape key pressed, closing nav...');
                closeMobileNav();
            }
        });
        
        console.log('Mobile navigation initialized successfully');
    }

    function toggleMobileNav() {
        const isActive = mobileNav.classList.contains('active');
        console.log('Toggling mobile nav, current state:', isActive);
        
        if (isActive) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    }

    function openMobileNav() {
        console.log('Opening mobile navigation...');
        mobileNav.classList.add('active');
        navOverlay.classList.add('active');
        hamburgerBtn.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent body scroll
        console.log('Mobile navigation opened');
    }

    function closeMobileNav() {
        console.log('Closing mobile navigation...');
        mobileNav.classList.remove('active');
        navOverlay.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        document.body.style.overflow = ''; // Restore body scroll
        console.log('Mobile navigation closed');
    }

    // ============================================================
    // ANIMATIONS INITIALIZATION
    // ============================================================
    function initAnimations() {
        // Stagger card animations for smooth entrance effect
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.style.animationDuration = '0.8s';
        });

        // Add floating particles effect for visual enhancement
        createFloatingParticles();
    }

    // ============================================================
    // CAROUSEL FUNCTIONALITY
    // ============================================================
    function initCarousel() {
        const cardWidth = cards[0].getBoundingClientRect().width + 30; // Include gap between cards
        let isAutoScrolling = true;
        let autoScrollInterval;

        // ============================================================
        // AUTO-SCROLL FUNCTIONALITY
        // ============================================================
        function startAutoScroll() {
            autoScrollInterval = setInterval(() => {
                const maxScroll = track.scrollWidth - track.clientWidth;
                const currentScroll = track.scrollLeft;
                
                // If reached the end, loop back to start
                if (currentScroll >= maxScroll - 1) {
                    track.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    track.scrollBy({ left: cardWidth, behavior: 'smooth' });
                }
            }, 4000); // Auto-scroll every 4 seconds
        }

        function stopAutoScroll() {
            clearInterval(autoScrollInterval);
        }

        // Start auto-scroll immediately
        startAutoScroll();

        // ============================================================
        // MANUAL CONTROLS (NEXT/PREV BUTTONS)
        // ============================================================
        nextButton.addEventListener('click', () => {
            stopAutoScroll();
            const maxScroll = track.scrollWidth - track.clientWidth;
            const currentScroll = track.scrollLeft;
            
            if (currentScroll >= maxScroll - 1) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
            
            // Resume auto-scroll after 5 seconds
            setTimeout(startAutoScroll, 5000);
        });

        prevButton.addEventListener('click', () => {
            stopAutoScroll();
            const currentScroll = track.scrollLeft;
            
            if (currentScroll <= 0) {
                track.scrollTo({ left: track.scrollWidth - track.clientWidth, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            }
            
            // Resume auto-scroll after 5 seconds
            setTimeout(startAutoScroll, 5000);
        });

        // ============================================================
        // AUTO-SCROLL CONTROL ON HOVER
        // ============================================================
        // Pause auto-scroll when user hovers over carousel
        track.addEventListener('mouseenter', stopAutoScroll);
        track.addEventListener('mouseleave', startAutoScroll);

        // ============================================================
        // SCROLL-BASED ANIMATIONS
        // ============================================================
        track.addEventListener('scroll', () => {
            const scrollProgress = track.scrollLeft / (track.scrollWidth - track.clientWidth);
            updateScrollIndicators(scrollProgress);
        });
    }

    // ============================================================
    // STAR RATING DISPLAY FUNCTIONALITY
    // ============================================================
    function initStarRatings() {
        const ratings = document.querySelectorAll('.star-rating');
        ratings.forEach((rating, index) => {
            const score = rating.dataset.rating;
            // Display filled stars based on rating score
            rating.innerHTML = '★'.repeat(score) + '☆'.repeat(5 - score);
            
            // Add entrance animation with staggered timing
            rating.style.opacity = '0';
            rating.style.transform = 'scale(0)';
            setTimeout(() => {
                rating.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                rating.style.opacity = '1';
                rating.style.transform = 'scale(1)';
            }, 1000 + (index * 100)); // Stagger animations
        });
    }

    // ============================================================
    // PARALLAX MOUSE EFFECTS
    // ============================================================
    function initParallaxEffect() {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            // Parallax effect for section header
            if (sectionHeader) {
                const moveX = (mouseX - 0.5) * 20; // Move up to 20px
                const moveY = (mouseY - 0.5) * 20;
                sectionHeader.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }

            // Subtle card parallax effect based on mouse proximity
            cards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                const cardCenterX = rect.left + rect.width / 2;
                const cardCenterY = rect.top + rect.height / 2;
                const distanceX = e.clientX - cardCenterX;
                const distanceY = e.clientY - cardCenterY;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                
                // Apply parallax effect when mouse is within 300px of card
                if (distance < 300) {
                    const intensity = 1 - (distance / 300);
                    const moveX = (distanceX / 300) * 10 * intensity;
                    const moveY = (distanceY / 300) * 10 * intensity;
                    const currentTransform = card.style.transform;
                    const translateYMatch = currentTransform ? currentTransform.match(/translateY\(([^)]+)\)/) : null;
                    const currentTranslateY = translateYMatch ? translateYMatch[1] : '0';
                    card.style.transform = `translateY(${currentTranslateY}) translateX(${moveX}px) translateY(${moveY}px)`;
                }
            });
        });
    }

    // ============================================================
    // INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
    // ============================================================
    function initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1, // Trigger when 10% of element is visible
            rootMargin: '0px 0px -50px 0px' // Start 50px before element enters viewport
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Trigger special effects for cards when they come into view
                    if (entry.target.classList.contains('testimonial-card')) {
                        addCardEntranceEffect(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe all testimonial cards for scroll animations
        cards.forEach(card => observer.observe(card));
    }

    // ============================================================
    // FLOATING PARTICLES EFFECT
    // ============================================================
    function createFloatingParticles() {
        // Create 15 floating particles for background effect
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: fixed;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: linear-gradient(135deg, #7f00ff, #00f0ff);
                border-radius: 50%;
                pointer-events: none;
                z-index: 0;
                opacity: ${Math.random() * 0.5 + 0.2};
                animation: floatParticle ${Math.random() * 10 + 15}s linear infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            document.body.appendChild(particle);
        }

        // Add particle animation CSS dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translate(${Math.random() * 200 - 100}px, -100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================================
    // CARD ENTRANCE EFFECT
    // ============================================================
    function addCardEntranceEffect(card) {
        // Add entrance glow effect when card comes into view
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(127, 0, 255, 0.3), transparent);
            transform: translate(-50%, -50%) scale(0);
            animation: glowExpand 0.6s ease-out forwards;
            pointer-events: none;
            z-index: -1;
        `;
        card.appendChild(glow);

        // Remove glow element after animation completes
        setTimeout(() => glow.remove(), 600);
    }

    // ============================================================
    // SCROLL INDICATORS UPDATE
    // ============================================================
    function updateScrollIndicators(progress) {
        // Update any scroll progress indicators (if present)
        const indicators = document.querySelectorAll('.scroll-indicator');
        indicators.forEach(indicator => {
            indicator.style.width = `${progress * 100}%`;
        });
    }

    // ============================================================
    // KEYBOARD NAVIGATION
    // ============================================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevButton.click();
        } else if (e.key === 'ArrowRight') {
            nextButton.click();
        }
    });

    // ============================================================
    // TOUCH/SWIPE SUPPORT FOR MOBILE
    // ============================================================
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50; // Minimum swipe distance
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextButton.click(); // Swipe left = next
            } else {
                prevButton.click(); // Swipe right = previous
            }
        }
    }

    // ============================================================
    // WINDOW RESIZE HANDLER
    // ============================================================
    window.addEventListener('resize', () => {
        // Recalculate card width on resize
        const newCardWidth = cards[0].getBoundingClientRect().width + 30;
        // Update any cached values if needed
    });

    // Initialize Feedback Form
    initFeedbackForm();

    // Initialize Back to Top Button
    initBackToTop();

    // ============================================================
    // FEEDBACK FORM FUNCTIONALITY
    // ============================================================
    function initFeedbackForm() {
        const form = document.getElementById('feedbackForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const testimonialData = {
                name: formData.get('name'),
                email: formData.get('email'),
                company: formData.get('company'),
                rating: formData.get('rating'),
                testimonial: formData.get('testimonial'),
                permission: formData.get('permission') ? 'Yes' : 'No'
            };

            // Here you would normally send this data to a server
            console.log('Testimonial submitted:', testimonialData);
            
            // Show success message
            showNotification('Thank you for your feedback! We appreciate your testimonial.', 'success');
            
            // Reset form
            form.reset();
        });
    }

    // ============================================================
    // BACK TO TOP BUTTON
    // ============================================================
    function initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================================
    // NOTIFICATION SYSTEM
    // ============================================================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)'};
            color: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-size: 14px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    console.log('Testimonials section initialized with full functionality');
});

// ============================================================
// EMAIL FUNCTIONALITY FOR TESTIMONIAL FORM
// ============================================================
// Initialize EmailJS
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
})();

// Handle testimonial form submission
document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedbackForm');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(feedbackForm);
            const testimonialData = {
                name: formData.get('name'),
                email: formData.get('email'),
                company: formData.get('company'),
                rating: formData.get('rating'),
                testimonial: formData.get('testimonial'),
                permission: formData.get('permission') ? 'Yes' : 'No'
            };
            
            // Send email using EmailJS
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', testimonialData)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    showNotification('Thank you for your testimonial! It has been sent successfully.', 'success');
                    feedbackForm.reset();
                }, function(error) {
                    console.log('FAILED...', error);
                    showNotification('Sorry, there was an error sending your testimonial. Please try again.', 'error');
                });
        });
    }
});

// ============================================================
// PARTICLE CANVAS ANIMATION
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
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
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
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
    for (let i = 0; i < 50; i++) {
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
});

// ============================================================
// EMAIL FUNCTIONALITY FOR TESTIMONIAL FORM
// ============================================================
// Initialize EmailJS
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
})();

// Handle testimonial form submission
document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedbackForm');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(feedbackForm);
            const testimonialData = {
                name: formData.get('name'),
                email: formData.get('email'),
                company: formData.get('company'),
                rating: formData.get('rating'),
                testimonial: formData.get('testimonial'),
                permission: formData.get('permission') ? 'Yes' : 'No'
            };
            
            // Send email using EmailJS
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', testimonialData)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    showNotification('Thank you for your testimonial! It has been sent successfully.', 'success');
                    feedbackForm.reset();
                }, function(error) {
                    console.log('FAILED...', error);
                    showNotification('Sorry, there was an error sending your testimonial. Please try again.', 'error');
                });
        });
    }
});

// ============================================================
// PARTICLE CANVAS ANIMATION
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
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
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
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
    for (let i = 0; i < 50; i++) {
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
});
