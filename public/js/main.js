// Mobile Nav
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Active nav link
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === page) link.classList.add('active');
});

// Subtle fade-in on scroll
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => observer.observe(el));
}

// Cookie consent banner — loads text from API if available
(function() {
  var consent = localStorage.getItem('benne_cookies');
  if (consent) {
    if (consent === 'accepted') loadCookieEmbeds();
    return;
  }

  // Try to fetch cookie banner text from global settings
  var bannerData = {
    heading: 'We serve cookies too — but the digital kind.',
    text: "Unlike our benne dosas, these cookies aren't crispy, buttery, or worth standing in line for. They just help our website work better. No personal data is sold — ever. That's a promise stronger than our filter coffee.",
    acceptBtn: 'Yes, serve me cookies',
    declineBtn: 'No thanks, just dosas',
    acceptToast: 'Cookies accepted — now go order a real one.',
    declineToast: 'No cookies for you — more sambar for us.'
  };

  function buildBanner(bd) {
    var banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.innerHTML =
      '<div class="cookie-inner">' +
        '<div class="cookie-text">' +
          '<strong>' + bd.heading + '</strong>' +
          '<p>' + bd.text + '</p>' +
        '</div>' +
        '<div class="cookie-buttons">' +
          '<button id="cookieAccept" class="btn btn-primary">' + bd.acceptBtn + '</button>' +
          '<button id="cookieDecline" class="btn btn-secondary">' + bd.declineBtn + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    var toast = document.createElement('div');
    toast.id = 'cookieToast';
    document.body.appendChild(toast);

    document.getElementById('cookieAccept').addEventListener('click', function() {
      localStorage.setItem('benne_cookies', 'accepted');
      banner.classList.add('cookie-hidden');
      loadCookieEmbeds();
      showToast(bd.acceptToast);
    });

    document.getElementById('cookieDecline').addEventListener('click', function() {
      localStorage.setItem('benne_cookies', 'declined');
      banner.classList.add('cookie-hidden');
      showToast(bd.declineToast);
    });

    function showToast(msg) {
      toast.textContent = msg;
      toast.classList.add('cookie-toast-show');
      setTimeout(function() { toast.classList.remove('cookie-toast-show'); }, 3000);
    }
  }

  // Try API first, fall back to defaults
  fetch('/api/global').then(function(r) { return r.json(); }).then(function(data) {
    if (data && data.cookieBanner) {
      bannerData.heading = data.cookieBanner.heading || bannerData.heading;
      bannerData.text = data.cookieBanner.text || bannerData.text;
      bannerData.acceptBtn = data.cookieBanner.acceptBtn || bannerData.acceptBtn;
      bannerData.declineBtn = data.cookieBanner.declineBtn || bannerData.declineBtn;
      bannerData.acceptToast = data.cookieBanner.acceptToast || bannerData.acceptToast;
      bannerData.declineToast = data.cookieBanner.declineToast || bannerData.declineToast;
    }
    buildBanner(bannerData);
  }).catch(function() {
    buildBanner(bannerData);
  });
})();

function loadCookieEmbeds() {
  document.querySelectorAll('iframe[data-cookie-src]').forEach(function(el) {
    el.src = el.getAttribute('data-cookie-src');
  });
}

// Menu tabs
document.querySelectorAll('.menu-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu-category').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// Contact form
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn');
    const original = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          subject: document.getElementById('subject').value,
          message: document.getElementById('message').value
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        btn.textContent = 'Sent!';
        btn.style.background = '#2F5D50';
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
        }, 2500);
      } else {
        btn.textContent = data.error || 'Failed to send';
        btn.style.background = '#c0392b';
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          btn.disabled = false;
        }, 2500);
      }
    } catch {
      btn.textContent = 'Connection error';
      btn.style.background = '#c0392b';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 2500);
    }
  });
}
