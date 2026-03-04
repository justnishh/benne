// ===== Content Loader =====
// Fetches data from API and populates HTML pages dynamically.

(function() {
  const page = detectPage();

  // Load global (navbar + footer) on every page
  loadGlobal();

  // Load page-specific content
  switch (page) {
    case 'index': loadHome(); break;
    case 'menu': loadMenu(); break;
    case 'about': loadAbout(); break;
    case 'contact': loadContact(); break;
    case 'faq': loadFaq(); break;
    case 'privacy': loadPrivacy(); break;
    case 'terms': loadTerms(); break;
  }

  function detectPage() {
    const path = window.location.pathname;
    const file = path.split('/').pop().replace('.html', '') || 'index';
    return file;
  }

  async function fetchJSON(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      return res.json();
    } catch { return null; }
  }

  // ===== Global =====
  async function loadGlobal() {
    const data = await fetchJSON('/api/global');
    if (!data) return;

    // Apply custom colors as CSS variables
    if (data.colors) {
      const r = document.documentElement.style;
      if (data.colors.coffee) r.setProperty('--coffee', data.colors.coffee);
      if (data.colors.cream) r.setProperty('--cream', data.colors.cream);
      if (data.colors.teal) r.setProperty('--teal', data.colors.teal);
      if (data.colors.terra) r.setProperty('--terra', data.colors.terra);
      if (data.colors.charcoal) r.setProperty('--charcoal', data.colors.charcoal);
      if (data.colors.creamLight) r.setProperty('--cream-light', data.colors.creamLight);
      if (data.colors.creamBg) r.setProperty('--cream-bg', data.colors.creamBg);
      if (data.colors.coffeeLight) r.setProperty('--coffee-light', data.colors.coffeeLight);
      if (data.colors.tealLight) r.setProperty('--teal-light', data.colors.tealLight);
      if (data.colors.border) r.setProperty('--border', data.colors.border);
    }

    // Update logo
    const logoImg = document.querySelector('.navbar a img');
    if (logoImg && data.logo) logoImg.src = data.logo;

    // Update navbar links
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && data.navbar && data.navbar.links) {
      navLinks.innerHTML = data.navbar.links.map(l =>
        `<li><a href="${l.href}">${l.label}</a></li>`
      ).join('');
      // Re-apply active state
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      navLinks.querySelectorAll('a').forEach(a => {
        if (a.getAttribute('href') === currentPage) a.classList.add('active');
      });
      // Re-attach mobile nav close
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
      });
    }

    // Update footer
    const footer = document.querySelector('.footer');
    if (footer && data.footer) {
      const grid = footer.querySelector('.footer-grid');
      if (grid) {
        const cols = grid.children;
        // First col: site description
        if (cols[0]) {
          cols[0].innerHTML = `<h4>${data.siteName || 'Benne'}</h4><p>${data.footer.description || ''}</p>`;
        }
        // Navigate
        if (cols[1] && data.footer.navigate) {
          cols[1].innerHTML = `<h4>Navigate</h4><ul>${data.footer.navigate.map(l =>
            `<li><a href="${l.href}">${l.label}</a></li>`).join('')}</ul>`;
        }
        // Legal
        if (cols[2] && data.footer.legal) {
          cols[2].innerHTML = `<h4>Legal</h4><ul>${data.footer.legal.map(l =>
            `<li><a href="${l.href}">${l.label}</a></li>`).join('')}</ul>`;
        }
        // Contact
        if (cols[3] && data.footer.contact) {
          cols[3].innerHTML = `<h4>Get in Touch</h4><ul>${data.footer.contact.map(l =>
            `<li><a href="${l.href}"${l.external ? ' target="_blank" rel="noopener"' : ''}>${l.label}</a></li>`).join('')}</ul>`;
        }
      }
      // Footer bottom
      const bottom = footer.querySelector('.footer-bottom');
      if (bottom) {
        const p = bottom.querySelector('p');
        if (p && data.footer.copyright) p.innerHTML = data.footer.copyright;
        const socials = bottom.querySelector('.footer-socials');
        if (socials && data.footer.socials) {
          socials.innerHTML = data.footer.socials.map(s =>
            `<a href="${s.href}" target="_blank" rel="noopener">${s.label}</a>`).join('');
        }
      }
    }
  }

  // ===== Home =====
  async function loadHome() {
    const data = await fetchJSON('/api/home');
    if (!data) return;

    // Hero
    const heroH1 = document.querySelector('.hero-text h1');
    if (heroH1) heroH1.innerHTML = `${data.hero.heading}<br><span>${data.hero.headingAccent}</span>`;

    const heroDesc = document.querySelector('.hero-text > p:not(.tagline)');
    if (heroDesc) heroDesc.textContent = data.hero.description;

    const tagline = document.querySelector('.hero-text .tagline');
    if (tagline) tagline.textContent = data.hero.tagline;

    const heroImg = document.querySelector('.hero-image img');
    if (heroImg && data.hero.image) { heroImg.src = data.hero.image; heroImg.alt = data.hero.imageAlt || ''; }

    // CTAs
    const ctaContainer = document.querySelector('.hero-text div[style]');
    if (ctaContainer && data.hero.cta1) {
      const btns = ctaContainer.querySelectorAll('a');
      if (btns[0]) { btns[0].href = data.hero.cta1.href; btns[0].textContent = data.hero.cta1.label; }
      if (btns[1] && data.hero.cta2) { btns[1].href = data.hero.cta2.href; btns[1].textContent = data.hero.cta2.label; }
    }

    // Known For
    const knownSection = document.querySelectorAll('.section')[0];
    if (knownSection && data.knownFor) {
      const header = knownSection.querySelector('.section-header');
      if (header) {
        header.querySelector('h2').textContent = data.knownFor.heading;
        header.querySelector('p').textContent = data.knownFor.subtitle;
      }
      const cards = knownSection.querySelectorAll('.card');
      data.knownFor.cards.forEach((c, i) => {
        if (cards[i]) {
          cards[i].href = c.link;
          const img = cards[i].querySelector('img');
          if (img) { img.src = c.image; img.alt = c.imageAlt || c.title; }
          const content = cards[i].querySelector('.card-content');
          if (content) {
            content.querySelector('h3').textContent = c.title;
            content.querySelector('p').textContent = c.description;
          }
        }
      });
    }

    // Locations
    if (data.locations) {
      const locSection = document.querySelector('.section.section-alt');
      if (locSection) {
        const locHeader = locSection.querySelector('.section-header h2');
        if (locHeader) locHeader.textContent = data.locations.heading;
        const locDivs = locSection.querySelectorAll('.grid-2 > div');
        data.locations.items.forEach((loc, i) => {
          if (locDivs[i]) {
            const h3 = locDivs[i].querySelector('h3');
            if (h3) h3.textContent = loc.name;
            const ps = locDivs[i].querySelectorAll('p');
            if (ps[0]) ps[0].textContent = loc.address;
            if (ps[1]) ps[1].innerHTML = loc.hours.replace ? loc.hours.replace(/\n/g, '<br>') : loc.hours;
            if (ps[2]) ps[2].textContent = loc.label;
          }
        });
      }
    }

    // Social Proof
    if (data.socialProof) {
      const spSection = document.querySelector('section[style*="border-bottom"]');
      if (spSection) {
        const ps = spSection.querySelectorAll('p');
        if (ps[0]) ps[0].textContent = data.socialProof.featured;
        if (ps[1]) ps[1].textContent = data.socialProof.stats;
      }
    }

    // CTA
    if (data.cta) {
      const ctaSection = document.querySelector('section[style*="background: var(--coffee)"]');
      if (ctaSection) {
        const h2 = ctaSection.querySelector('h2');
        if (h2) h2.textContent = data.cta.heading;
        const p = ctaSection.querySelector('p');
        if (p) p.textContent = data.cta.subtitle;
        const a = ctaSection.querySelector('a');
        if (a) { a.textContent = data.cta.buttonLabel; a.href = data.cta.buttonLink; }
      }
    }
  }

  // ===== Menu =====
  async function loadMenu() {
    const data = await fetchJSON('/api/menu');
    if (!data) return;

    // Page header
    const ph = document.querySelector('.page-header');
    if (ph) {
      ph.querySelector('h1').textContent = data.pageTitle;
      ph.querySelector('p').textContent = data.pageSubtitle;
    }

    // Tabs
    const tabsContainer = document.querySelector('.menu-tabs');
    const section = document.querySelector('.section .container');
    if (!tabsContainer || !section) return;

    tabsContainer.innerHTML = '';
    // Remove old categories
    section.querySelectorAll('.menu-category').forEach(el => el.remove());

    data.categories.forEach((cat, i) => {
      // Tab
      const btn = document.createElement('button');
      btn.className = 'menu-tab' + (i === 0 ? ' active' : '');
      btn.dataset.tab = cat.id;
      btn.textContent = cat.name;
      tabsContainer.appendChild(btn);

      // Category
      const div = document.createElement('div');
      div.className = 'menu-category' + (i === 0 ? ' active' : '');
      div.id = cat.id;
      div.innerHTML = `<div class="menu-grid">${cat.items.map(item =>
        `<div class="menu-item"><div class="menu-item-info"><h3>${item.name}</h3><p class="desc">${item.description}</p></div><span class="price">${item.price}</span></div>`
      ).join('')}</div>`;
      tabsContainer.after(div);
    });

    // Footer note
    const footerNote = section.querySelector('p[style*="border-top"]');
    if (footerNote) footerNote.textContent = data.footerNote;

    // Re-attach tab listeners
    document.querySelectorAll('.menu-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.menu-category').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
      });
    });

    // CTA
    if (data.cta) {
      const ctaSec = document.querySelector('section[style*="background: var(--coffee)"]');
      if (ctaSec) {
        const h2 = ctaSec.querySelector('h2');
        const p = ctaSec.querySelector('p');
        const a = ctaSec.querySelector('a');
        if (h2) h2.textContent = data.cta.heading;
        if (p) p.textContent = data.cta.subtitle;
        if (a) { a.textContent = data.cta.buttonLabel; a.href = data.cta.buttonLink; }
      }
    }
  }

  // ===== About =====
  async function loadAbout() {
    const data = await fetchJSON('/api/about');
    if (!data) return;

    // Page header
    const ph = document.querySelector('.page-header');
    if (ph) {
      ph.querySelector('h1').textContent = data.pageTitle;
      ph.querySelector('p').textContent = data.pageSubtitle;
    }

    // Story
    const storySection = document.querySelector('.story-section');
    if (storySection) {
      const h2 = storySection.querySelector('h2');
      if (h2) h2.innerHTML = data.story.heading;
      const img = storySection.querySelector('img');
      if (img) { img.src = data.story.image; img.alt = data.story.imageAlt || ''; }
      const textDiv = storySection.querySelector('.grid-2 > div:last-child');
      if (textDiv) {
        // Keep h2, replace paragraphs
        const existing = textDiv.querySelectorAll('p');
        existing.forEach(p => p.remove());
        data.story.paragraphs.forEach(p => {
          const el = document.createElement('p');
          el.innerHTML = p;
          textDiv.appendChild(el);
        });
      }
    }

    // Quote
    const pullQuote = document.querySelector('.pull-quote');
    if (pullQuote) {
      // Set text directly (first text node)
      const cite = pullQuote.querySelector('cite');
      pullQuote.childNodes.forEach(n => { if (n.nodeType === 3) n.remove(); });
      pullQuote.insertBefore(document.createTextNode(data.quote.text + '\n'), cite);
      if (cite) cite.textContent = data.quote.cite;
    }

    // Darshini
    const darshiniSection = document.querySelectorAll('.section')[1];
    if (darshiniSection) {
      const leftDiv = darshiniSection.querySelector('.grid-2 > div:first-child');
      if (leftDiv) {
        const h2 = leftDiv.querySelector('h2');
        if (h2) h2.textContent = data.darshini.heading;
        const subtitle = leftDiv.querySelector('p');
        if (subtitle) subtitle.textContent = data.darshini.subtitle;
        const list = leftDiv.querySelector('.detail-list');
        if (list) {
          list.innerHTML = data.darshini.items.map(item =>
            `<li><strong>${item.title}</strong><span>${item.description}</span></li>`
          ).join('');
        }
      }

      // Journey
      const rightDiv = darshiniSection.querySelector('.grid-2 > div:last-child');
      if (rightDiv) {
        const h2 = rightDiv.querySelector('h2');
        if (h2) h2.textContent = data.journey.heading;
        const milestones = rightDiv.querySelectorAll('.milestone-item');
        milestones.forEach(m => m.remove());
        data.journey.milestones.forEach(m => {
          const div = document.createElement('div');
          div.className = 'milestone-item';
          div.innerHTML = `<p class="year">${m.year}</p><p>${m.text}</p>`;
          rightDiv.appendChild(div);
        });
      }
    }

    // Founders
    const foundersSection = document.querySelector('.section.section-alt');
    if (foundersSection && data.founders) {
      const header = foundersSection.querySelector('.section-header h2');
      if (header) header.textContent = data.founders.heading;
      const cards = foundersSection.querySelectorAll('.founder-card');
      data.founders.cards.forEach((f, i) => {
        if (cards[i]) {
          const img = cards[i].querySelector('img');
          if (img) { img.src = f.image; img.alt = f.imageAlt || f.name; }
          const h3 = cards[i].querySelector('h3');
          if (h3) h3.textContent = f.name;
          const role = cards[i].querySelector('.role');
          if (role) role.textContent = f.role;
          const p = cards[i].querySelector('p');
          if (p) p.textContent = f.bio;
        }
      });
      const alsoP = foundersSection.querySelector('p[style]');
      if (alsoP) alsoP.innerHTML = data.founders.alsoVisited;
    }

    // CTA
    if (data.cta) {
      const ctaSec = document.querySelector('section[style*="background: var(--coffee)"]');
      if (ctaSec) {
        const h2 = ctaSec.querySelector('h2');
        if (h2) h2.textContent = data.cta.heading;
        const p = ctaSec.querySelector('p');
        if (p) p.textContent = data.cta.subtitle;
      }
    }
  }

  // ===== Contact =====
  async function loadContact() {
    const data = await fetchJSON('/api/contact');
    if (!data) return;

    const ph = document.querySelector('.page-header');
    if (ph) {
      ph.querySelector('h1').textContent = data.pageTitle;
      ph.querySelector('p').textContent = data.pageSubtitle;
    }

    // Locations
    const locBlocks = document.querySelectorAll('.loc-block');
    data.locations.forEach((loc, i) => {
      if (locBlocks[i]) {
        const h3 = locBlocks[i].querySelector('h3');
        if (h3) h3.innerHTML = `${loc.name} <span class="loc-label">${loc.label}</span>`;
        const ps = locBlocks[i].querySelectorAll('p');
        if (ps[0]) ps[0].textContent = loc.address;
        if (loc.hours) {
          for (let hi = 0; hi < loc.hours.length; hi++) {
            if (ps[1 + hi]) ps[1 + hi].innerHTML = loc.hours[hi];
          }
        }
      }
    });

    // Contact info
    const infoItems = document.querySelectorAll('.contact-info-item');
    data.contactInfo.forEach((item, i) => {
      if (infoItems[i]) {
        const label = infoItems[i].querySelector('.label');
        if (label) label.textContent = item.label;
        const a = infoItems[i].querySelector('a');
        if (a) {
          a.textContent = item.text;
          a.href = item.href;
          if (item.external) { a.target = '_blank'; a.rel = 'noopener'; }
        }
      }
    });

    // Form
    if (data.form) {
      const formSection = document.querySelector('.form-section');
      if (formSection) {
        const h2 = formSection.querySelector('h2');
        if (h2) h2.textContent = data.form.heading;
        const p = formSection.querySelector('p');
        if (p) p.textContent = data.form.subtitle;
        const select = formSection.querySelector('select');
        if (select && data.form.subjects) {
          select.innerHTML = '<option value="">Select a topic</option>' +
            data.form.subjects.map(s => `<option>${s}</option>`).join('');
        }
      }
    }

    // Work with us
    if (data.workWithUs) {
      const ws = document.querySelector('.work-section');
      if (ws) {
        ws.querySelector('h3').textContent = data.workWithUs.heading;
        ws.querySelector('p').textContent = data.workWithUs.subtitle;
        const links = ws.querySelector('.work-links');
        if (links) {
          links.innerHTML = data.workWithUs.links.map(l =>
            `<a href="${l.href}">${l.label}</a>`).join('');
        }
      }
    }
  }

  // ===== FAQ =====
  async function loadFaq() {
    const data = await fetchJSON('/api/faq');
    if (!data) return;

    const ph = document.querySelector('.page-header');
    if (ph) {
      ph.querySelector('h1').textContent = data.pageTitle;
      ph.querySelector('p').textContent = data.pageSubtitle;
    }

    const container = document.querySelector('.story-section .container');
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    data.categories.forEach(cat => {
      const h2 = document.createElement('h2');
      h2.textContent = cat.name;
      container.appendChild(h2);

      cat.items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'faq-item';
        div.innerHTML = `<h3>${item.question}</h3><p>${item.answer}</p>`;
        container.appendChild(div);
      });
    });
  }

  // ===== Privacy =====
  async function loadPrivacy() {
    loadLegal('/api/privacy');
  }

  // ===== Terms =====
  async function loadTerms() {
    loadLegal('/api/terms');
  }

  async function loadLegal(url) {
    const data = await fetchJSON(url);
    if (!data) return;

    const ph = document.querySelector('.page-header');
    if (ph) {
      ph.querySelector('h1').textContent = data.pageTitle;
      ph.querySelector('p').textContent = data.pageSubtitle;
    }

    const container = document.querySelector('.story-section .container');
    if (!container) return;

    container.innerHTML = '';

    // Dates + intro
    const dateP = document.createElement('p');
    dateP.innerHTML = `<strong>Effective date:</strong> ${data.effectiveDate}<br><strong>Last updated:</strong> ${data.lastUpdated}`;
    container.appendChild(dateP);

    const introP = document.createElement('p');
    introP.innerHTML = data.intro;
    container.appendChild(introP);

    // Sections
    data.sections.forEach(s => {
      const h2 = document.createElement('h2');
      h2.textContent = s.heading;
      container.appendChild(h2);

      const div = document.createElement('div');
      div.innerHTML = s.content;
      container.appendChild(div);
    });
  }
})();
