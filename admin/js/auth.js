// Benne Admin - Authentication & Utilities

// Check if user is authenticated
function checkAuth() { return true; }
    return true;
}

// Logout function
function logout() {
    localStorage.removeItem('benneAdminLoggedIn');
    localStorage.removeItem('benneAdminEmail');
    localStorage.removeItem('benneAdminRemember');
    window.location.href = 'login.html';
}

// Show toast notification
function showToast(message, type = 'success') {
    // Remove existing toasts
    const existing = document.querySelector('.toast-container');
    if (existing) existing.remove();
    
    const container = document.createElement('div');
    container.className = 'toast-container';
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠'
    };
    
    toast.innerHTML = `
        <span style="font-size: 20px;">${icons[type]}</span>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    document.body.appendChild(container);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => container.remove(), 300);
    }, 3000);
}

// Get data from localStorage with default
function getData(key, defaultData) {
    const data = localStorage.getItem(key);
    if (data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            return defaultData;
        }
    }
    return defaultData;
}

// Save data to localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// Initialize default data if not exists
function initDefaultData() {
    // Menu Items
    if (!localStorage.getItem('benneMenuItems')) {
        const menuItems = [
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
        localStorage.setItem('benneMenuItems', JSON.stringify(menuItems));
    }
    
    // Offers
    if (!localStorage.getItem('benneOffers')) {
        const offers = [
            { id: 1, title: 'Cold Filter Coffee', description: "Summer's best kept secret is finally here", badge: 'NEW', active: true },
            { id: 2, title: 'Filter Season', description: 'Buy 2 Filter Coffees, Get 1 Free', badge: 'LIMITED', active: true },
            { id: 3, title: 'Loyalty Rewards', description: 'Earn points with every visit', badge: 'MEMBERS', active: true }
        ];
        localStorage.setItem('benneOffers', JSON.stringify(offers));
    }
    
    // Locations
    if (!localStorage.getItem('benneLocations')) {
        const locations = [
            { id: 1, name: 'Delhi', address: 'Ground floor, 82, Block M, Greater Kailash II', hours: '10AM - 10PM', status: 'active', mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.2448657572586!2d77.242865!3d28.5323588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce159457e35a1%3A0x181cbad5a325d0d9!2sBenne%20-%20Heritage%20Bangalore%20Dosa!5e0!3m2!1sen!2sin!4v1772373741460!5m2!1sen!2sin' },
            { id: 2, name: 'Juhu', address: 'Ground floor, Nirav apartment, Gulmohar Rd, next to IDFC first bank', hours: '10AM - 10PM', status: 'active', mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241267.38677942817!2d72.52744674682614!3d19.116299964786737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c98ffc58bccd%3A0x37756e083f877e45!2sBenne%20-%20Heritage%20Bangalore%20Dosa!5e0!3m2!1sen!2sin!4v1772373834214!5m2!1sen!2sin' },
            { id: 3, name: 'Bandra', address: 'Shop no. 1, plot 85, TPS 3, louis bell building, 16th Rd, opposite Shree Sagar', hours: '10AM - 10PM', status: 'active', mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15084.1049182307!2d72.81184136867527!3d19.062584346819346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c16aa7a73b%3A0x11a01744c567af3b!2sBenne%20-%20Heritage%20Bangalore%20Dosa!5e0!3m2!1sen!2sin!4v1772373890798!5m2!1sen!2sin' }
        ];
        localStorage.setItem('benneLocations', JSON.stringify(locations));
    }
    
    // Reviews
    if (!localStorage.getItem('benneReviews')) {
        const reviews = [
            { id: 1, text: "Best dosa I've had in Mumbai. The sambar alone is worth the visit.", author: 'Rahul S.', role: 'Digital Marketer', stars: 5, active: true },
            { id: 2, text: "Finally, a place that gets Bengaluru breakfast right. The filter coffee is authentic AF.", author: 'Priya K.', role: 'Software Engineer', stars: 5, active: true },
            { id: 3, text: "Their benne dosa brings back so many childhood memories. Crispy, buttery, perfect.", author: 'Arjun M.', role: 'Business Analyst', stars: 5, active: true },
            { id: 4, text: "The Podi Masala Dosa is a game changer. That gunpowder kick hits different.", author: 'Sneha R.', role: 'Content Creator', stars: 5, active: true },
            { id: 5, text: "Hidden gem in Juhu. Worth every rupee. The mangalore buns are 🔥", author: 'Vikram N.', role: 'Designer', stars: 5, active: true },
            { id: 6, text: "This is what authentic South Indian breakfast should taste like. No compromises.", author: 'Anjali T.', role: 'Product Manager', stars: 5, active: true }
        ];
        localStorage.setItem('benneReviews', JSON.stringify(reviews));
    }
    
    // Homepage Content
    if (!localStorage.getItem('benneHomepage')) {
        const homepage = {
            hero: {
                title: 'BENNE',
                subtitle: 'Filter Coffee. Dosas. Mumbai Heart.'
            },
            about: {
                heading: 'It Started With Missing',
                paragraph1: 'Two Bangaloreans in Mumbai. A craving that wouldn\'t quit. What began as a quest for the perfect dosa became a love letter to South Indian breakfast culture — now served in Mumbai & Delhi.',
                paragraph2: 'We don\'t call ourselves a café. We call it bringing Bangalore to you.'
            },
            instagram: {
                handle: '@benne.bombay',
                bio: 'Heritage Dosa • Filter Coffee',
                location: 'Mumbai & Delhi'
            }
        };
        localStorage.setItem('benneHomepage', JSON.stringify(homepage));
    }
    
    // Settings
    if (!localStorage.getItem('benneSettings')) {
        const settings = {
            restaurantName: 'Benne',
            email: 'hello@benne.in',
            phone: '+91 8012 345 678',
            currency: '₹',
            reservationsEnabled: true
        };
        // Reservations (form submissions)
if (!localStorage.getItem('benneReservations')) {
    localStorage.setItem('benneReservations', JSON.stringify([]));
}

// Newsletter subscribers
if (!localStorage.getItem('benneSubscribers')) {
    localStorage.setItem('benneSubscribers', JSON.stringify([]));
}

localStorage.setItem('benneSettings', JSON.stringify(settings));
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initDefaultData();
});
