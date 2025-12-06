document.addEventListener('DOMContentLoaded', () => {
    // Hide/Show Navigation on Scroll
    const contactNav = document.querySelector('.contact-nav');
    let lastScrollTop = 0;
    let scrollTimeout;

    const handleNavbarScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        // Show navbar if scrolled to top
        if (scrollTop <= 10) {
            contactNav.classList.remove('hide');
            contactNav.classList.add('show');
        }
        // Hide navbar when scrolling down
        else if (scrollTop > lastScrollTop) {
            contactNav.classList.add('hide');
            contactNav.classList.remove('show');
        }
        // Show navbar when scrolling up
        else {
            contactNav.classList.remove('hide');
            contactNav.classList.add('show');
        }

        lastScrollTop = scrollTop;

        // Clear existing timeout and set a new one
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Optional: Show nav after scrolling stops
        }, 150);
    };

    window.addEventListener('scroll', handleNavbarScroll, false);
    contactNav.classList.add('show'); // Initial state

    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        for (let i = 0; i < revealElements.length; i++) {
            const elementTop = revealElements[i].getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                revealElements[i].classList.add('revealed');
            }
        }
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submitBtn');
    const successFeedback = document.querySelector('.form-feedback.success');
    const errorFeedback = document.querySelector('.form-feedback.error');

    // Form field validation
    const validateField = (field) => {
        const formRow = field.closest('.form-row');
        const errorSpan = formRow?.querySelector('.error-message');
        let isValid = true;
        let errorMsg = '';

        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!field.value.trim()) {
                errorMsg = 'Email is required';
                isValid = false;
            } else if (!emailRegex.test(field.value)) {
                errorMsg = 'Please enter a valid email address';
                isValid = false;
            }
        } else if (field.type === 'text') {
            if (!field.value.trim()) {
                errorMsg = 'This field is required';
                isValid = false;
            } else if (field.value.trim().length < 2) {
                errorMsg = 'Must be at least 2 characters';
                isValid = false;
            }
        } else if (field.type === 'tel') {
            if (field.value.trim()) {
                const phoneRegex = /^\+?[\d\s\-()]{7,}$/;
                if (!phoneRegex.test(field.value)) {
                    errorMsg = 'Please enter a valid phone number';
                    isValid = false;
                }
            }
        } else if (field.tagName === 'SELECT') {
            if (!field.value) {
                errorMsg = 'Please select an option';
                isValid = false;
            }
        } else if (field.tagName === 'TEXTAREA') {
            if (!field.value.trim()) {
                errorMsg = 'Please provide project details';
                isValid = false;
            } else if (field.value.trim().length < 10) {
                errorMsg = 'Please provide at least 10 characters';
                isValid = false;
            }
        }

        if (isValid) {
            formRow?.classList.remove('error');
            if (errorSpan) errorSpan.textContent = '';
        } else {
            formRow?.classList.add('error');
            if (errorSpan) errorSpan.textContent = errorMsg;
        }

        return isValid;
    };

    // Real-time validation
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('change', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.closest('.form-row')?.classList.contains('error')) {
                validateField(field);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate all fields
        let allValid = true;
        fields.forEach(field => {
            if (!validateField(field)) {
                allValid = false;
            }
        });

        if (!allValid) {
            showError('Please fix the errors above and try again');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';

        // Simulate form submission
        setTimeout(() => {
            // In a real scenario, you would send this to a backend
            const formData = {
                fullName: form.fullName.value,
                email: form.email.value,
                phone: form.phone.value,
                projectType: form.projectType.value,
                message: form.message.value,
                nda: form.nda.checked
            };

            console.log('Form submitted:', formData);

            // Reset button
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';

            // Show success message
            showSuccess('Your query has been sent successfully! I\'ll get back to you within 48 hours.');
            form.reset();

            // Remove error states
            document.querySelectorAll('.form-row.error').forEach(row => {
                row.classList.remove('error');
            });
        }, 1500);
    });

    // Helper functions
    function showSuccess(message) {
        successFeedback.textContent = message;
        successFeedback.classList.add('show');
        errorFeedback.classList.remove('show');

        setTimeout(() => {
            successFeedback.classList.remove('show');
        }, 5000);
    }

    function showError(message) {
        errorFeedback.textContent = message;
        errorFeedback.classList.add('show');
        successFeedback.classList.remove('show');
    }

    // Set current year in footer
    const yearSpan = document.querySelector('[data-year]');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

// Mobile Menu Toggle Function
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.contact-nav');
    
    if (hamburger && nav) {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        
        // Close menu when clicking outside
        if (nav.classList.contains('active')) {
            setTimeout(() => {
                document.addEventListener('click', closeMenuOnClickOutside);
            }, 100);
        } else {
            document.removeEventListener('click', closeMenuOnClickOutside);
        }
    }
}

// Close menu when clicking outside
function closeMenuOnClickOutside(event) {
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.contact-nav');
    
    if (!hamburger.contains(event.target) && !nav.contains(event.target)) {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        document.removeEventListener('click', closeMenuOnClickOutside);
    }
}

