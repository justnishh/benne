/**
 * BENNE - Main JavaScript
 * Urban South Indian Café Website
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initReviewsCarousel();
    initMenuCarousel();
    initFormValidation();
    initSmoothScroll();
    initPopups();
    initDateValidation();
});

/**
 * Navbar - Scroll Effect
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    if (!navbar) return;
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (!menuBtn || !navLinks) return;
    
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Scroll Reveal Animation
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .stagger-children');
    
    if (!reveals.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    reveals.forEach(el => observer.observe(el));
}

/**
 * Reviews Carousel
 */
function initReviewsCarousel() {
    const track = document.getElementById('reviewsTrack');
    const dots = document.querySelectorAll('.review-dot');
    const prevBtn = document.getElementById('reviewsPrev');
    const nextBtn = document.getElementById('reviewsNext');
    
    if (!track || !dots.length) return;
    
    let currentIndex = 0;
    const totalSlides = dots.length;
    
    const goToSlide = (index) => {
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    };
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Arrow navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const prevIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
            goToSlide(prevIndex);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % totalSlides;
            goToSlide(nextIndex);
        });
    }
    
    // Auto-advance every 5 seconds
    setInterval(() => {
        const nextIndex = (currentIndex + 1) % totalSlides;
        goToSlide(nextIndex);
    }, 5000);
}

/**
 * Menu Carousel Arrow Navigation
 */
function initMenuCarousel() {
    const prevBtn = document.getElementById('menuPrev');
    const nextBtn = document.getElementById('menuNext');
    const menuScroll = document.getElementById('menuScroll');
    
    if (!prevBtn || !nextBtn || !menuScroll) return;
    
    const scrollAmount = 240;
    
    prevBtn.addEventListener('click', () => {
        menuScroll.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    nextBtn.addEventListener('click', () => {
        menuScroll.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Hide arrows at boundaries
    menuScroll.addEventListener('scroll', () => {
        const isAtStart = menuScroll.scrollLeft <= 0;
        const isAtEnd = menuScroll.scrollLeft + menuScroll.clientWidth >= menuScroll.scrollWidth - 10;
        
        prevBtn.style.opacity = isAtStart ? '0.3' : '1';
        prevBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';
        
        nextBtn.style.opacity = isAtEnd ? '0.3' : '1';
        nextBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
    });
}

/**
 * Reservation Date/Time Validation
 */
function initDateValidation() {
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    
    if (!dateInput || !timeInput) return;
    
    // Set minimum date to today
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);
    
    // Update time options based on date
    dateInput.addEventListener('change', () => {
        const selectedDate = new Date(dateInput.value);
        const now = new Date();
        
        // If selected date is today, filter out past times
        if (selectedDate.toDateString() === now.toDateString()) {
            const currentHour = now.getHours();
            const currentMinutes = now.getMinutes();
            
            Array.from(timeInput.options).forEach(option => {
                const [hour, minute] = option.value.split(':').map(Number);
                const optionTime = hour * 60 + minute;
                const currentTime = currentHour * 60 + currentMinutes + 30; // 30 min buffer
                
                option.disabled = optionTime < currentTime;
            });
        } else {
            // Reset for future dates
            Array.from(timeInput.options).forEach(option => {
                option.disabled = false;
            });
        }
    });
}

/**
 * Form Validation
 */
function initFormValidation() {
    // Reservation Form
    const reserveForm = document.querySelector('.reserve-form');
    
    if (reserveForm) {
        reserveForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const date = document.getElementById('date');
            const time = document.getElementById('time');
            const guests = document.getElementById('guests');
            
            // Validation
            if (!date.value || !time.value || !guests.value) {
                showPopup('error', 'Please fill in all fields');
                return;
            }
            
            // Check if selected time is disabled
            const selectedTimeOption = time.options[time.selectedIndex];
            if (selectedTimeOption && selectedTimeOption.disabled) {
                showPopup('error', 'This time slot is no longer available. Please select another time.');
                return;
            }
            
            // Simulate submission
            const btn = reserveForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Finding Table...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                reserveForm.reset();
                showPopup('success', 'Table Request Received!', 'We\'ll confirm your reservation via phone or email.');
            }, 1500);
        });
    }
    
    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input[type="email"]');
            
            if (!email.value || !email.value.includes('@')) {
                showPopup('error', 'Please enter a valid email');
                return;
            }
            
            const btn = newsletterForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Joining...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                email.value = '';
                showPopup('success', 'Welcome to the Benne Family! 🎉', 'You\'ll receive exclusive offers and menu updates.');
            }, 1000);
        });
    }
}

/**
 * Custom Popup System
 */
function initPopups() {
    // Create popup container if not exists
    if (!document.querySelector('.popup-overlay')) {
        const popupHTML = `
            <div class="popup-overlay" id="popupOverlay">
                <div class="popup-container">
                    <button class="popup-close" id="popupClose" aria-label="Close popup">&times;</button>
                    <div class="popup-icon" id="popupIcon"></div>
                    <h3 class="popup-title" id="popupTitle"></h3>
                    <p class="popup-message" id="popupMessage"></p>
                    <button class="popup-btn" id="popupBtn">OK</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', popupHTML);
        
        // Add event listeners
        document.getElementById('popupClose').addEventListener('click', closePopup);
        document.getElementById('popupOverlay').addEventListener('click', (e) => {
            if (e.target === document.getElementById('popupOverlay')) {
                closePopup();
            }
        });
        document.getElementById('popupBtn').addEventListener('click', closePopup);
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closePopup();
        });
    }
}

/**
 * Show Popup
 */
function showPopup(type, title, message = '') {
    const overlay = document.getElementById('popupOverlay');
    const icon = document.getElementById('popupIcon');
    const titleEl = document.getElementById('popupTitle');
    const messageEl = document.getElementById('popupMessage');
    
    if (!overlay) return;
    
    // Set content
    titleEl.textContent = title;
    messageEl.textContent = message;
    messageEl.style.display = message ? 'block' : 'none';
    
    // Set icon and style based on type
    if (type === 'success') {
        icon.innerHTML = '✓';
        icon.className = 'popup-icon popup-icon-success';
    } else if (type === 'error') {
        icon.innerHTML = '✕';
        icon.className = 'popup-icon popup-icon-error';
    } else {
        icon.innerHTML = 'ℹ';
        icon.className = 'popup-icon popup-icon-info';
    }
    
    // Show popup
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close Popup
 */
function closePopup() {
    const overlay = document.getElementById('popupOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Make showPopup globally available
window.showPopup = showPopup;

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#' || targetId === '#menu' || targetId === '#reserve') {
                // Let these have default behavior or skip
            }
            
            const target = document.querySelector(targetId);
            
            if (target) {
                e.preventDefault();
                
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
