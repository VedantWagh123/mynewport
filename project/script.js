// Preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    // Animate progress bar
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Hide preloader after progress completes
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 1000);
            }, 500);
        }
        
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        if (progressText) {
            progressText.textContent = Math.floor(progress) + '%';
        }
    }, 200);
    
    // Fallback timeout
    setTimeout(() => {
        if (preloader.style.display !== 'none') {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 1000);
        }
    }, 3000);
});

// Particle Canvas Animation
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = Math.random() > 0.5 ? '#7f00ff' : '#00f0ff';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

const particles = [];
const particleCount = 100;

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw connections
    particles.forEach((particle, index) => {
        for (let j = index + 1; j < particles.length; j++) {
            const dx = particles[j].x - particle.x;
            const dy = particles[j].y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = particle.color;
                ctx.globalAlpha = (1 - distance / 100) * 0.2;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Navigation Menu Toggle
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuIcon = document.querySelector('.menu-icon');
    
    navLinks.classList.toggle('show');
    menuIcon.classList.toggle('active');
}

// Active Navigation Link
const currentPage = window.location.pathname.split('/').pop();
const navLinks = document.querySelectorAll('.nav-links ul li a');

navLinks.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage || (currentPage === '' && linkPage === '../index.html')) {
        link.classList.add('active-link');
    }
});

// Advanced Navigation Features
let lastScrollTop = 0;
const mainNav = document.querySelector('.main-nav');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Hide/Show navigation on scroll
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        mainNav.classList.add('hidden');
    } else {
        mainNav.classList.remove('hidden');
    }
    
    // Add scrolled class for styling
    if (scrollTop > 50) {
        mainNav.classList.add('scrolled');
    } else {
        mainNav.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
});

// Navigation hover effects
document.querySelectorAll('.nav-links ul li a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        const icon = this.querySelector('i');
        if (icon) {
            icon.style.transform = 'translateX(0)';
            icon.style.opacity = '1';
        }
    });
    
    link.addEventListener('mouseleave', function() {
        const icon = this.querySelector('i');
        if (icon && !this.classList.contains('active-link')) {
            icon.style.transform = 'translateX(-5px)';
            icon.style.opacity = '0';
        }
    });
});

// Logo animation on hover
const navLogo = document.querySelector('.nav-logo');
if (navLogo) {
    navLogo.addEventListener('mouseenter', function() {
        this.querySelector('img').style.transform = 'rotate(360deg)';
    });
    
    navLogo.addEventListener('mouseleave', function() {
        this.querySelector('img').style.transform = 'rotate(0deg)';
    });
}

// Counter Animation
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.parentElement.querySelector('.stat-label').textContent === 'Satisfaction' ? '%' : '+');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
}

// Intersection Observer for Counter Animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-count'));
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-number').forEach(counter => {
    counterObserver.observe(counter);
});

// Custom Cursor
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-outline"></div>';
document.body.appendChild(cursor);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.08;
    cursorY += (mouseY - cursorY) * 0.08;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Cursor Hover Effects
const hoverElements = document.querySelectorAll('a, button, .project-card, .master-project-card');
hoverElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        if (element.classList.contains('master-project-card')) {
            cursor.classList.add('master-hover');
        } else if (element.classList.contains('project-card')) {
            cursor.classList.add('featured-hover');
        }
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover', 'master-hover', 'featured-hover');
    });
});

// Master Project Card Mouse Tracking
const masterCards = document.querySelectorAll('.master-project-card');

masterCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 40;
        const rotateY = (centerX - x) / 40;
        
        const wrapper = card.querySelector('.master-project-wrapper');
        wrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`;
        
        // Update glow position with reduced intensity
        const glow = card.querySelector('.master-glow');
        if (glow) {
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;
            glow.style.background = `radial-gradient(circle at ${xPercent}% ${yPercent}%, rgba(127, 0, 255, 0.1) 0%, transparent 50%)`;
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const wrapper = card.querySelector('.master-project-wrapper');
        wrapper.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Project Card 3D Tilt Effect
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.textContent = 'Thank you for subscribing!';
        successMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #7f00ff, #00f0ff);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.5s ease;
        `;
        
        document.body.appendChild(successMessage);
        
        // Clear form
        e.target.reset();
        
        // Remove message after 3 seconds
        setTimeout(() => {
            successMessage.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(successMessage);
            }, 500);
        }, 3000);
    });
}

// CV Download - Coming Soon Message
const cvButton = document.getElementById('cvButton');
if (cvButton) {
    cvButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Show "CV not ready yet" message
        const comingSoonMessage = document.createElement('div');
        comingSoonMessage.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
                background-size: 300% 300%;
                animation: gradientShift 3s ease infinite;
                color: white;
                padding: 1rem 2rem;
                border-radius: 12px;
                font-weight: 600;
                font-size: 1rem;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                z-index: 10000;
                position: fixed;
                top: 20px;
                right: 20px;
                text-align: center;
                border: 2px solid rgba(255,255,255,0.2);
            ">
                🚧 CV is not ready yet!
                <br>
                <small style="font-weight: 400; opacity: 0.9;">Coming soon...</small>
            </div>
        `;
        
        document.body.appendChild(comingSoonMessage);
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(style);
        
        // Remove message when clicking anywhere or scrolling
        function removeCVMessage() {
            if (comingSoonMessage && document.body.contains(comingSoonMessage)) {
                comingSoonMessage.style.animation = 'slideOut 0.5s ease';
                setTimeout(() => {
                    if (document.body.contains(comingSoonMessage)) {
                        document.body.removeChild(comingSoonMessage);
                    }
                    if (document.head.contains(style)) {
                        document.head.removeChild(style);
                    }
                }, 500);
            }
        }
        
        // Add click listener to remove message
        document.addEventListener('click', function(e) {
            if (cvButton && !cvButton.contains(e.target)) {
                removeCVMessage();
            }
        });
        
        // Add scroll listener to remove message
        window.addEventListener('scroll', removeCVMessage);
    });
}

// Scroll Reveal Animation
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

const scrollRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

scrollRevealElements.forEach(element => {
    scrollRevealObserver.observe(element);
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - scrolled / 600;
    }
});

// Dynamic Year in Footer
const yearElements = document.querySelectorAll('.current-year');
yearElements.forEach(element => {
    element.textContent = new Date().getFullYear();
});

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

// Debounced resize handler
const debouncedResize = debounce(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}, 250);

window.addEventListener('resize', debouncedResize);

// Loading States for Project Links
document.querySelectorAll('.project-btn, .card-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.getAttribute('href') === '#') {
            e.preventDefault();
            
            // Add loading state
            const originalContent = link.innerHTML;
            link.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            link.style.pointerEvents = 'none';
            
            // Simulate loading
            setTimeout(() => {
                link.innerHTML = originalContent;
                link.style.pointerEvents = 'auto';
                
                // Show demo message
                const message = document.createElement('div');
                message.textContent = 'Demo coming soon!';
                message.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(127, 0, 255, 0.9);
                    color: white;
                    padding: 2rem 3rem;
                    border-radius: 12px;
                    z-index: 10000;
                    font-size: 1.2rem;
                    backdrop-filter: blur(10px);
                `;
                
                document.body.appendChild(message);
                
                setTimeout(() => {
                    message.style.transition = 'opacity 0.5s ease';
                    message.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(message);
                    }, 500);
                }, 2000);
            }, 1000);
        }
    });
});

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in class to body for smooth entrance
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
