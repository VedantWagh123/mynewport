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
