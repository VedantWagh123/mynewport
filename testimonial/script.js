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

    // ============================================================
    // INITIALIZATION FUNCTIONS
    // ============================================================
    // Initialize all interactive features when page loads
    initAnimations();
    initCarousel();
    initStarRatings();
    initParallaxEffect();
    initIntersectionObserver();

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

    function initFeedbackForm() {
        const form = document.getElementById('feedbackForm');
        const successMessage = document.getElementById('successMessage');
        const stars = document.querySelectorAll('.star-rating-input .star');
        const ratingValue = document.getElementById('ratingValue');
        let selectedRating = 0;

        // Star rating functionality
        stars.forEach(star => {
            star.addEventListener('click', () => {
                selectedRating = parseInt(star.dataset.rating);
                ratingValue.value = selectedRating;
                updateStarDisplay(selectedRating);
            });

            star.addEventListener('mouseenter', () => {
                const hoverRating = parseInt(star.dataset.rating);
                updateStarDisplay(hoverRating);
            });
        });

        document.getElementById('starRating').addEventListener('mouseleave', () => {
            updateStarDisplay(selectedRating);
        });

        function updateStarDisplay(rating) {
            stars.forEach((star, index) => {
                if (index < rating) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        }

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate rating
            if (selectedRating === 0) {
                showNotification('Please select a rating', 'error');
                return;
            }

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission (in real app, this would be an API call)
            submitFeedback(data);
        });

        function submitFeedback(data) {
            // Show loading state
            const submitBtn = form.querySelector('.submit-btn');
            const originalContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Hide form and show success message
                form.style.display = 'none';
                successMessage.classList.add('show');

                // Reset form
                form.reset();
                selectedRating = 0;
                updateStarDisplay(0);

                // Reset button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalContent;
                    submitBtn.disabled = false;
                    form.style.display = 'block';
                    successMessage.classList.remove('show');
                }, 5000);
            }, 2000);
        }

        // Form field animations
        const formInputs = form.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });

            input.addEventListener('input', () => {
                if (input.value) {
                    input.parentElement.classList.add('has-value');
                } else {
                    input.parentElement.classList.remove('has-value');
                }
            });
        });
    }

    function initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(99, 102, 241, 0.9)'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Add notification animations to head
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .form-group.focused label {
            color: #6366f1;
        }

        .form-group.has-value input,
        .form-group.has-value textarea {
            background: rgba(99, 102, 241, 0.05);
        }
    `;
    document.head.appendChild(notificationStyles);
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
            emailjs.send('service_your_service_id', 'template_your_template_id', testimonialData)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Show success message
                    showSuccessMessage();
                    
                    // Reset form
                    feedbackForm.reset();
                    resetStarRating();
                    
                }, function(error) {
                    console.log('FAILED...', error);
                    
                    // Fallback: create mailto link
                    sendEmailViaMailto(testimonialData);
                });
        });
    }
});

// Show success message
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    const form = document.getElementById('feedbackForm');
    
    if (successMessage && form) {
        form.style.display = 'none';
        successMessage.style.display = 'block';
        successMessage.style.opacity = '0';
        successMessage.style.transform = 'translateY(20px)';
        
        // Animate success message
        setTimeout(() => {
            successMessage.style.transition = 'all 0.5s ease';
            successMessage.style.opacity = '1';
            successMessage.style.transform = 'translateY(0)';
        }, 100);
        
        // Hide success message after 5 seconds and show form again
        setTimeout(() => {
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                successMessage.style.display = 'none';
                form.style.display = 'block';
            }, 500);
        }, 5000);
    }
}

// Fallback email function using mailto link
function sendEmailViaMailto(data) {
    const subject = encodeURIComponent(`New Testimonial from ${data.name}`);
    const body = encodeURIComponent(
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n` +
        `Company/Role: ${data.company || 'Not provided'}\n` +
        `Rating: ${data.rating} stars\n` +
        `Testimonial: ${data.testimonial}\n` +
        `Permission to display: ${data.permission}`
    );
    
    const mailtoLink = `mailto:vedantwaghwagh@gmail.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
    
    // Show success message
    showSuccessMessage();
    
    // Reset form
    document.getElementById('feedbackForm').reset();
    resetStarRating();
}

// ============================================================
// SMOOTH SCROLLING ENHANCEMENT FOR TESTIMONIALS
// ============================================================
function enhanceTestimonialScrolling() {
    const carouselTrack = document.querySelector('.carousel-track');
    if (!carouselTrack) return;

    let isScrolling = false;
    let startX = 0;
    let scrollLeft = 0;
    let velocity = 0;
    let animationFrame = null;

    // Smooth momentum scrolling for touch devices
    function startMomentumScroll(currentVelocity) {
        if (Math.abs(currentVelocity) < 0.5) return;

        function animate() {
            velocity *= 0.95; // Friction
            carouselTrack.scrollLeft += velocity;

            if (Math.abs(velocity) > 0.5) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                snapToNearestCard();
            }
        }

        animate();
    }

    // Snap to nearest card after scrolling
    function snapToNearestCard() {
        const cards = Array.from(carouselTrack.children);
        const trackRect = carouselTrack.getBoundingClientRect();
        const trackCenter = trackRect.left + trackRect.width / 2;

        let closestCard = null;
        let closestDistance = Infinity;

        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(trackCenter - cardCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestCard = card;
            }
        });

        if (closestCard) {
            const cardOffset = closestCard.offsetLeft;
            carouselTrack.scrollTo({
                left: cardOffset - (carouselTrack.offsetWidth - closestCard.offsetWidth) / 2,
                behavior: 'smooth'
            });
        }
    }

    // Touch events for mobile
    carouselTrack.addEventListener('touchstart', (e) => {
        isScrolling = true;
        startX = e.touches[0].pageX - carouselTrack.offsetLeft;
        scrollLeft = carouselTrack.scrollLeft;
        velocity = 0;
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    });

    carouselTrack.addEventListener('touchmove', (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        const x = e.touches[0].pageX - carouselTrack.offsetLeft;
        const walk = (x - startX) * 1.5; // Increase sensitivity
        const newScrollLeft = scrollLeft - walk;
        
        // Calculate velocity for momentum
        velocity = newScrollLeft - carouselTrack.scrollLeft;
        carouselTrack.scrollLeft = newScrollLeft;
    });

    carouselTrack.addEventListener('touchend', () => {
        isScrolling = false;
        startMomentumScroll(velocity);
    });

    // Mouse events for desktop
    let isMouseDown = false;
    carouselTrack.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        startX = e.pageX - carouselTrack.offsetLeft;
        scrollLeft = carouselTrack.scrollLeft;
        carouselTrack.style.cursor = 'grabbing';
    });

    carouselTrack.addEventListener('mouseleave', () => {
        isMouseDown = false;
        carouselTrack.style.cursor = 'grab';
    });

    carouselTrack.addEventListener('mouseup', () => {
        isMouseDown = false;
        carouselTrack.style.cursor = 'grab';
        snapToNearestCard();
    });

    carouselTrack.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return;
        e.preventDefault();
        const x = e.pageX - carouselTrack.offsetLeft;
        const walk = (x - startX) * 2; // Smooth scrolling
        carouselTrack.scrollLeft = scrollLeft - walk;
    });

    // Scroll wheel smoothness
    carouselTrack.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY * 2; // Slower scroll speed
        carouselTrack.scrollLeft += delta;
        
        // Debounced snap
        clearTimeout(carouselTrack.snapTimeout);
        carouselTrack.snapTimeout = setTimeout(() => {
            snapToNearestCard();
        }, 150);
    });

    // Set initial cursor
    carouselTrack.style.cursor = 'grab';
}

// Reset star rating display
function resetStarRating() {
    const stars = document.querySelectorAll('.star-rating-input .star');
    const ratingValue = document.getElementById('ratingValue');
    
    stars.forEach(star => star.classList.remove('active'));
    if (ratingValue) ratingValue.value = '0';
}

// Initialize smooth scrolling when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    enhanceTestimonialScrolling();
    initParticleAnimation();
    initMobileNavigation();
});

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

    // Scroll-based hide/show functionality
    let lastScrollTop = 0;
    let scrollThreshold = 100; // Hide after scrolling 100px down
    let isScrolling = false;

    function handleScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (currentScrollTop > scrollThreshold) {
                    if (currentScrollTop > lastScrollTop) {
                        // Scrolling down - hide navigation
                        navHeader.classList.add('hidden');
                        navHeader.classList.remove('visible');
                    } else {
                        // Scrolling up - show navigation
                        navHeader.classList.add('visible');
                        navHeader.classList.remove('hidden');
                    }
                } else {
                    // At top - always show navigation
                    navHeader.classList.add('visible');
                    navHeader.classList.remove('hidden');
                }
                
                lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
                isScrolling = false;
            });
            isScrolling = true;
        }
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Toggle mobile menu
    function toggleMobileMenu() {
        const isOpen = mobileNav.classList.contains('active');
        
        if (isOpen) {
            // Close menu
            mobileNav.classList.remove('active');
            navOverlay.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        } else {
            // Open menu
            mobileNav.classList.add('active');
            navOverlay.classList.add('active');
            hamburgerBtn.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    }

    // Event listeners
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
    navOverlay.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            navOverlay.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    // Close menu on window resize (if screen becomes larger)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
                toggleMobileMenu();
            }
        }, 250);
    });

    // Initialize navigation state
    handleScroll();
}

// ============================================================
// PARTICLE ANIMATION SYSTEM
// ============================================================
function initParticleAnimation() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;

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
            this.reset();
            this.y = Math.random() * canvas.height;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 10;
            this.size = Math.random() * 3 + 1;
            this.speedY = Math.random() * 0.5 + 0.3; // Much slower upward speed (0.3-0.8)
            this.speedX = (Math.random() - 0.5) * 0.1; // Slower horizontal drift (0.1 max)
            this.opacity = Math.random() * 0.5 + 0.3;
            this.hue = Math.random() * 60 + 240; // Purple to blue range
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;

            // Mouse interaction
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                this.x += dx * force * 0.01; // Reduced force for gentler interaction
                this.y += dy * force * 0.01;
            }

            // Reset particle if it goes off screen
            if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = `hsl(${this.hue}, 70%, 60%)`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = `hsl(${this.hue}, 70%, 60%)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    // Mouse move listener
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

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
