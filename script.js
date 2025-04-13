// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Navbar Background Change on Scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        navbar.style.backgroundColor = 'transparent';
        navbar.style.boxShadow = 'none';
    }
});

// Hero Stats Counter Animation
const stats = document.querySelectorAll('.stat-number');
const statsObserverOptions = {
    threshold: 0.5
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const value = parseInt(target.textContent);
            animateValue(target, 0, value, 2000);
            statsObserver.unobserve(target);
        }
    });
}, statsObserverOptions);

stats.forEach(stat => statsObserver.observe(stat));

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Loan Calculator Function
function calculateLoan(amount, interestRate, term) {
    const monthlyRate = interestRate / 12 / 100;
    const numberOfPayments = term * 12;
    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - amount;

    return {
        monthlyPayment,
        totalPayment,
        totalInterest
    };
}

// Format currency in Indian Rupees
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

// Update calculator display
function updateCalculator() {
    const amount = parseInt(document.getElementById('loan-amount').value);
    const rate = parseFloat(document.getElementById('interest-rate').value);
    const term = parseInt(document.getElementById('loan-term').value);

    // Format displays
    document.querySelector('.amount-display').textContent = formatCurrency(amount);
    document.querySelector('.rate-display').textContent = `${rate}%`;
    document.querySelector('.term-display').textContent = `${term} years`;

    // Calculate loan details
    const result = calculateLoan(amount, rate, term);

    // Update results
    document.querySelector('.result-amount').textContent = formatCurrency(result.monthlyPayment);
    document.querySelector('.detail-item:first-child span:last-child').textContent = formatCurrency(result.totalInterest);
    document.querySelector('.detail-item:last-child span:last-child').textContent = formatCurrency(result.totalPayment);
}

// Add event listeners for calculator inputs
document.getElementById('loan-amount').addEventListener('input', updateCalculator);
document.getElementById('interest-rate').addEventListener('input', updateCalculator);
document.getElementById('loan-term').addEventListener('input', updateCalculator);

// Initial calculation
updateCalculator();

// Form Submission with Loading State
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.innerHTML = '<span class="spinner"></span> Sending...';
        
        // Get form data
        const formData = new FormData(contactForm);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        try {
            // Simulate API call (replace with actual API endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            showNotification('Message sent successfully! We will get back to you soon.', 'success');
            contactForm.reset();
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitButton.classList.remove('loading');
            submitButton.innerHTML = originalText;
        }
    });
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.5s ease-out';
    observer.observe(section);
});

// Add loading animation for buttons
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-apply').forEach(button => {
    button.addEventListener('click', function(e) {
        if (!this.classList.contains('loading')) {
            e.preventDefault();
            this.classList.add('loading');
            this.innerHTML = '<span class="spinner"></span> Loading...';
            
            // Simulate loading (remove in production)
            setTimeout(() => {
                this.classList.remove('loading');
                this.innerHTML = this.getAttribute('data-original-text') || this.innerHTML;
            }, 2000);
        }
    });
});

// Add hover effect to loan cards
document.querySelectorAll('.loan-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
}); 