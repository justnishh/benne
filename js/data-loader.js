/**
 * Benne Website - Data Loader
 * Connects frontend to admin panel localStorage
 */

(function() {
    'use strict';
    
    // Default data in case localStorage is empty
    const defaultMenuItems = [
        { id: 1, name: 'Benne Dosa', description: 'The signature classic', price: 180, category: 'Dosas', badge: 'SIGNATURE', available: true },
        { id: 2, name: 'Masala Dosa', description: 'Classic & perfect', price: 160, category: 'Dosas', badge: '', available: true },
        { id: 3, name: 'Podi Masala Dosa', description: 'Spiced gunpowder twist', price: 170, category: 'Dosas', badge: '', available: true },
        { id: 4, name: 'Garlic Roast', description: 'Garlic lovers dream', price: 190, category: 'Dosas', badge: '', available: true },
        { id: 5, name: 'Filter Coffee', description: 'Poured from height', price: 40, category: 'Beverages', badge: '', available: true },
        { id: 6, name: 'Iced Filter Coffee', description: 'Chilled perfection', price: 60, category: 'Beverages', badge: '', available: true },
        { id: 7, name: 'Idli Vada', description: 'Soft & crispy combo', price: 120, category: 'Idli & Vada', badge: '', available: true },
        { id: 8, name: 'Ghee Idli', description: 'Rich & aromatic', price: 130, category: 'Idli & Vada', badge: '', available: true },
        { id: 9, name: 'Akki Roti', description: 'Rice flour delight', price: 100, category: 'Bangalore Specials', badge: '', available: true },
        { id: 10, name: 'Mangalore Buns', description: 'Sweet & soft', price: 80, category: 'Bangalore Specials', badge: '', available: true },
        { id: 11, name: 'Mysore Pak', description: 'Classic sweet treat', price: 60, category: 'Sweets', badge: '', available: true },
        { id: 12, name: 'Badam Halwa', description: 'Almond indulgence', price: 120, category: 'Sweets', badge: '', available: true }
    ];
    
    const defaultOffers = [
        { id: 1, title: 'Cold Filter Coffee', description: "Summer's best kept secret is finally here", badge: 'NEW', active: true },
        { id: 2, title: 'Filter Season', description: 'Buy 2 Filter Coffees, Get 1 Free', badge: 'LIMITED', active: true },
        { id: 3, title: 'Loyalty Rewards', description: 'Earn points with every visit', badge: 'MEMBERS', active: true }
    ];
    
    const defaultLocations = [
        { id: 1, name: 'Delhi', address: 'Ground floor, 82, Block M, Greater Kailash II', hours: '10AM - 10PM', status: 'active', mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.2448657572586!2d77.242865!3d28.5323588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce159457e35a1%3A0x181cbad5a325d0d9!2sBenne%20-%20Heritage%20Bangalore%20Dosa!5e0!3m2!1sen!2sin!4v1772373741460!5m2!1sen!2sin' },
        { id: 2, name: 'Juhu', address: 'Ground floor, Nirav apartment, Gulmohar Rd, next to IDFC first bank', hours: '10AM - 10PM', status: 'active', mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241267.38677942817!2d72.52744674682614!3d19.116299964786737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c98ffc58bccd%3A0x37756e083f877e45!2sBenne%20-%20Heritage%20Bangalore%20Dosa!5e0!3m2!1sen!2sin!4v1772373834214!5m2!1sen!2sin' },
        { id: 3, name: 'Bandra', address: 'Shop no. 1, plot 85, TPS 3, louis bell building, 16th Rd, opposite Shree Sagar', hours: '10AM - 10PM', status: 'active', mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15084.1049182307!2d72.81184136867527!3d19.062584346819346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c16aa7a73b%3A0x11a01744c567af3b!2sBenne%20-%20Heritage%20Bangalore%20Dosa!5e0!3m2!1sen!2sin!4v1772373890798!5m2!1sen!2sin' }
    ];
    
    const defaultReviews = [
        { id: 1, text: "Best dosa I've had in Mumbai. The sambar alone is worth the visit.", author: 'Rahul S.', role: 'Digital Marketer', stars: 5, active: true },
        { id: 2, text: "Finally, a place that gets Bengaluru breakfast right. The filter coffee is authentic AF.", author: 'Priya K.', role: 'Software Engineer', stars: 5, active: true },
        { id: 3, text: "Their benne dosa brings back so many childhood memories. Crispy, buttery, perfect.", author: 'Arjun M.', role: 'Business Analyst', stars: 5, active: true },
        { id: 4, text: "The Podi Masala Dosa is a game changer. That gunpowder kick hits different.", author: 'Sneha R.', role: 'Content Creator', stars: 5, active: true },
        { id: 5, text: "Hidden gem in Juhu. Worth every rupee. The mangalore buns are 🔥", author: 'Vikram N.', role: 'Designer', stars: 5, active: true },
        { id: 6, text: "This is what authentic South Indian breakfast should taste like. No compromises.", author: 'Anjali T.', role: 'Product Manager', stars: 5, active: true }
    ];
    
    // Helper: Get data from localStorage or return defaults
    function getData(key, defaults) {
        try {
            const data = localStorage.getItem(key);
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.warn('Error reading localStorage:', e);
        }
        return defaults;
    }
    
    // Public API
    window.BenneData = {
        getMenuItems: function() {
            return getData('benneMenuItems', defaultMenuItems);
        },
        
        getOffers: function() {
            return getData('benneOffers', defaultOffers).filter(o => o.active);
        },
        
        getLocations: function() {
            return getData('benneLocations', defaultLocations).filter(l => l.status === 'active');
        },
        
        getReviews: function() {
            return getData('benneReviews', defaultReviews).filter(r => r.active);
        },
        
        getFeaturedItems: function() {
            const homepage = getData('benneHomepage', {});
            const featuredIds = homepage.featuredItems || [];
            const menuItems = this.getMenuItems().filter(item => item.available);
            
            if (featuredIds.length > 0) {
                return menuItems.filter(item => featuredIds.includes(item.id));
            }
            return menuItems.slice(0, 6);
        },
        
        getHomepage: function() {
            return getData('benneHomepage', {
                hero: { title: 'BENNE', subtitle: 'Filter Coffee. Dosas. Mumbai Heart.' },
                about: { 
                    heading: 'It Started With Missing',
                    paragraph1: "Two Bangaloreans in Mumbai. A craving that wouldn't quit. What began as a quest for the perfect dosa became a love letter to South Indian breakfast culture — now served in Mumbai & Delhi.",
                    paragraph2: "We don't call ourselves a café. We call it bringing Bangalore to you."
                },
                instagram: { handle: '@benne.bombay', bio: 'Heritage Dosa • Filter Coffee', location: 'Mumbai & Delhi' }
            });
        },
        
        getSettings: function() {
            return getData('benneSettings', {
                email: 'hello@benne.in',
                phone: '+91 8012 345 678',
                reservationsEnabled: true
            });
        },
        
        refresh: function() {
            this._cached = null;
        }
    };
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDynamicContent);
    } else {
        initDynamicContent();
    }
    
    function initDynamicContent() {
        renderHomepageContent();
        renderFeaturedItems();
        renderOffers();
        renderLocations();
        renderReviews();
        renderFooter();
        renderInstagram();
        renderReservations();
    }
    
    function renderHomepageContent() {
        const homepage = window.BenneData.getHomepage();
        
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroTitle && homepage.hero) {
            heroTitle.textContent = homepage.hero.title || 'BENNE';
            heroSubtitle.textContent = homepage.hero.subtitle || 'Filter Coffee. Dosas. Mumbai Heart.';
        }
        
        const storyTitle = document.querySelector('.story-teaser .section-title');
        const storyTexts = document.querySelectorAll('.story-text');
        if (homepage.about) {
            if (storyTitle) storyTitle.textContent = homepage.about.heading || 'It Started With Missing';
            if (storyTexts[0]) storyTexts[0].textContent = homepage.about.paragraph1 || '';
            if (storyTexts[1]) storyTexts[1].textContent = homepage.about.paragraph2 || '';
        }
    }
    
    function renderFeaturedItems() {
        const menuScroll = document.getElementById('menuScroll');
        if (!menuScroll) return;
        
        const items = window.BenneData.getFeaturedItems();
        
        if (items.length === 0) {
            // Hide section if no items
            const section = document.querySelector('.featured');
            if (section) section.style.display = 'none';
            return;
        }
        
        menuScroll.innerHTML = items.map(item => `
            <div class="featured-card">
                <div class="featured-img">
                    <img src="images/menu-dosa.svg" alt="${item.name}">
                </div>
                <h3>${item.name}</h3>
                <p>${item.description || ''}</p>
                <span class="price">₹${item.price}</span>
                ${item.badge ? `<span class="badge-popular">★ ${item.badge}</span>` : ''}
            </div>
        `).join('');
        
        // Update arrows visibility
        setTimeout(updateMenuArrows, 100);
    }
    
    function updateMenuArrows() {
        const menuScroll = document.getElementById('menuScroll');
        const menuPrev = document.getElementById('menuPrev');
        const menuNext = document.getElementById('menuNext');
        
        if (!menuScroll || !menuPrev || !menuNext) return;
        
        const scrollWidth = menuScroll.scrollWidth;
        const clientWidth = menuScroll.clientWidth;
        
        if (scrollWidth <= clientWidth) {
            menuPrev.style.display = 'none';
            menuNext.style.display = 'none';
        } else {
            menuPrev.style.display = 'flex';
            menuNext.style.display = 'flex';
        }
    }
    
    function renderOffers() {
        const offersGrid = document.querySelector('.offers-grid');
        if (!offersGrid) return;
        
        const offers = window.BenneData.getOffers();
        
        if (offers.length === 0) {
            const section = document.querySelector('.offers');
            if (section) section.style.display = 'none';
            return;
        }
        
        offersGrid.innerHTML = offers.map(offer => `
            <div class="offer-card">
                ${offer.badge ? `<span class="offer-badge">${offer.badge}</span>` : ''}
                <h3>${offer.title}</h3>
                <p>${offer.description}</p>
            </div>
        `).join('');
    }
    
    function renderLocations() {
        const locationsSection = document.querySelector('.locations .container');
        if (!locationsSection) return;
        
        const locations = window.BenneData.getLocations();
        
        // Update section title
        const title = locationsSection.querySelector('.section-title');
        if (title) title.textContent = 'Find Your BENE';
        
        let grid = locationsSection.querySelector('.locations-grid');
        if (!grid) {
            const existingCards = locationsSection.querySelectorAll('.location-card');
            existingCards.forEach(card => card.remove());
            grid = document.createElement('div');
            grid.className = 'location-grid';
            locationsSection.appendChild(grid);
        }
        
        if (locations.length === 0) {
            grid.innerHTML = '<p>No locations available</p>';
            return;
        }
        
        grid.innerHTML = locations.map(loc => `
            <div class="location-card">
                <h3>${loc.name}</h3>
                <p class="location-address">${loc.address}</p>
                <p class="location-hours">Open Daily • ${loc.hours || '10AM - 10PM'}</p>
                <a href="https://maps.google.com/?q=${encodeURIComponent(loc.name + ' Benne')}" target="_blank" rel="noopener" class="btn btn-small">Get Directions →</a>
                <div class="location-map">
                    ${loc.mapEmbed ? loc.mapEmbed : ''}
                </div>
            </div>
        `).join('');
    }
    
    function renderReviews() {
        const reviewsTrack = document.getElementById('reviewsTrack');
        if (!reviewsTrack) return;
        
        const reviews = window.BenneData.getReviews();
        
        if (reviews.length === 0) {
            const section = document.querySelector('.social-proof');
            if (section) section.style.display = 'none';
            return;
        }
        
        reviewsTrack.innerHTML = reviews.map(review => `
            <div class="review-card">
                <div class="review-stars">${'★'.repeat(review.stars)}${'☆'.repeat(5-review.stars)}</div>
                <p class="review-text">"${review.text}"</p>
                <p class="review-author">— ${review.author}</p>
                <p class="review-role">${review.role || ''}</p>
            </div>
        `).join('');
        
        // Update navigation dots
        updateReviewDots(reviews.length);
    }
    
    function updateReviewDots(count) {
        const dotsContainer = document.querySelector('.reviews-nav');
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('button');
            dot.className = 'review-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('data-index', i);
            dot.setAttribute('aria-label', 'Review ' + (i + 1));
            dotsContainer.appendChild(dot);
        }
    }
    
    function renderInstagram() {
        const homepage = window.BenneData.getHomepage();
        
        // Update Instagram handle and bio in the profile section
        const instaHandle = document.querySelector('.insta-handle');
        const instaBio = document.querySelector('.insta-bio');
        const instaLocation = document.querySelector('.insta-location');
        
        if (homepage.instagram) {
            if (instaHandle) instaHandle.textContent = homepage.instagram.handle || '@benne.bombay';
            if (instaBio) instaBio.textContent = homepage.instagram.bio || 'Heritage Dosa • Filter Coffee';
            if (instaLocation) instaLocation.textContent = homepage.instagram.location || 'Mumbai & Delhi';
        }
    }
    
    function renderReservations() {
        const settings = window.BenneData.getSettings();
        const reserveSection = document.querySelector('.reserve-cta');
        
        if (!reserveSection) return;
        
        if (!settings.reservationsEnabled) {
            reserveSection.innerHTML = `
                <div class="container">
                    <h2>Reservations Unavailable</h2>
                    <p>We're currently fully booked. Please try again later or walk in!</p>
                    <a href="#locations" class="btn btn-primary">View Locations</a>
                </div>
            `;
            return;
        }
        
        // Add form submission handler
        const reserveForm = reserveSection.querySelector('.reserve-form');
        if (reserveForm) {
            reserveForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = {
                    id: Date.now(),
                    date: document.getElementById('date').value,
                    time: document.getElementById('time').value,
                    guests: document.getElementById('guests').value,
                    name: 'Guest', // Could add name field
                    phone: 'N/A',
                    status: 'pending',
                    submittedAt: new Date().toISOString()
                };
                
                // Save to localStorage
                const existing = getData('benneReservations', []);
                existing.push(formData);
                localStorage.setItem('benneReservations', JSON.stringify(existing));
                
                alert('Table reserved successfully! We will confirm shortly.');
                reserveForm.reset();
            });
        }
        
        // Newsletter form handler
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = newsletterForm.querySelector('input[type="email"]').value;
                
                if (email) {
                    const subscriber = {
                        email: email,
                        date: new Date().toISOString().split('T')[0]
                    };
                    
                    const existing = getData('benneSubscribers', []);
                    
                    // Check if already subscribed
                    if (!existing.some(s => s.email === email)) {
                        existing.push(subscriber);
                        localStorage.setItem('benneSubscribers', JSON.stringify(existing));
                        alert('Welcome to the Benne family! 🎉');
                    } else {
                        alert('You are already subscribed!');
                    }
                    
                    newsletterForm.reset();
                }
            });
        }
    }
    
    function renderFooter() {
        const settings = window.BenneData.getSettings();
        
        // Update footer brand - remove duplicate phone
        const footerBrand = document.querySelector('.footer-brand p');
        if (footerBrand) {
            footerBrand.textContent = 'Filter Coffee. Dosas. Mumbai Heart.';
        }
        
        // Update contact info
        const contactLinks = document.querySelectorAll('.footer-links ul li a');
        contactLinks.forEach(link => {
            if (link.href.startsWith('mailto:')) {
                link.href = 'mailto:' + (settings.email || 'hello@benne.in');
                link.textContent = settings.email || 'hello@benne.in';
            }
            if (link.href.startsWith('tel:')) {
                link.href = 'tel:' + (settings.phone || '+918012345678').replace(/\s/g, '');
            }
        });
        
        // Remove footer tagline
        const footerBottom = document.querySelector('.footer-bottom');
        if (footerBottom) {
            footerBottom.innerHTML = '<p>© 2026 Benne. All rights reserved.</p>';
        }
    }
    
    console.log('✅ Benne Data Loader initialized');
})();
