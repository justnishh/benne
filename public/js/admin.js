// ===== Admin Panel JavaScript =====
const API = '/api/admin';
let token = localStorage.getItem('admin_token') || '';

// ===== Auth Helpers =====
function setToken(t) {
  token = t;
  localStorage.setItem('admin_token', t);
}

function getHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
}

async function apiFetch(url, opts = {}) {
  opts.headers = opts.headers || getHeaders();
  const res = await fetch(url, opts);
  if (res.status === 401) {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
    return null;
  }
  return res.json();
}

async function checkAuth() {
  if (!token) { window.location.href = '/admin/login'; return false; }
  try {
    const res = await fetch(API + '/verify', { method: 'POST', headers: getHeaders() });
    if (!res.ok) { window.location.href = '/admin/login'; return false; }
    return true;
  } catch { window.location.href = '/admin/login'; return false; }
}

// ===== Toast =====
function showToast(msg, isError) {
  let toast = document.getElementById('adminToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'toast' + (isError ? ' error' : '');
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== Login =====
function initLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = form.querySelector('.btn');
    btn.textContent = 'Logging in...';
    btn.disabled = true;
    try {
      const res = await fetch(API + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        window.location.href = '/admin/dashboard';
      } else {
        showToast(data.error || 'Login failed', true);
        btn.textContent = 'Login';
        btn.disabled = false;
      }
    } catch {
      showToast('Connection error', true);
      btn.textContent = 'Login';
      btn.disabled = false;
    }
  });
}

// ===== Dashboard =====
async function initDashboard() {
  if (!await checkAuth()) return;
  try {
    const menu = await apiFetch('/api/menu');
    const faq = await apiFetch('/api/faq');
    const el = (id) => document.getElementById(id);
    if (menu) {
      let totalItems = 0;
      menu.categories.forEach(c => totalItems += c.items.length);
      if (el('statCategories')) el('statCategories').textContent = menu.categories.length;
      if (el('statItems')) el('statItems').textContent = totalItems;
    }
    if (faq) {
      let totalFaq = 0;
      faq.categories.forEach(c => totalFaq += c.items.length);
      if (el('statFaqs')) el('statFaqs').textContent = totalFaq;
    }
    const media = await apiFetch(API + '/media');
    if (media && el('statImages')) {
      el('statImages').textContent = (media.originals || []).length + (media.uploads || []).length;
    }
    const msgs = await apiFetch(API + '/messages');
    if (msgs && el('statUnreadMessages')) {
      el('statUnreadMessages').textContent = msgs.unreadCount || 0;
    }
  } catch {}
}

// ===== Generic Page Editor =====
async function initPageEditor(page) {
  if (!await checkAuth()) return;
  const data = await apiFetch(API + '/' + page);
  if (!data) return;

  const form = document.getElementById('editorForm');
  if (!form) return;

  populateForm(form, data);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = collectForm(form, data);
    const result = await apiFetch(API + '/' + page, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(formData)
    });
    if (result && result.success) showToast('Saved successfully!');
    else showToast('Failed to save', true);
  });
}

function populateForm(form, data, prefix) {
  prefix = prefix || '';
  for (const [key, value] of Object.entries(data)) {
    const fieldName = prefix ? prefix + '.' + key : key;
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) continue;
    if (typeof value === 'object') {
      populateForm(form, value, fieldName);
      continue;
    }
    const input = form.querySelector('[name="' + fieldName + '"]');
    if (input) {
      if (input.type === 'color') input.value = value;
      else input.value = value;
    }
  }
}

function collectForm(form, originalData) {
  const result = JSON.parse(JSON.stringify(originalData));
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    if (!input.name) return;
    const keys = input.name.split('.');
    let obj = result;
    for (let i = 0; i < keys.length - 1; i++) {
      if (obj[keys[i]] === undefined) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = input.value;
  });
  return result;
}

// ===== Home Editor =====
async function initHomeEditor() {
  if (!await checkAuth()) return;
  const data = await apiFetch(API + '/home');
  if (!data) return;
  window._pageData = data;

  const el = (id) => document.getElementById(id);

  // Hero
  el('heroHeading').value = data.hero.heading || '';
  el('heroAccent').value = data.hero.headingAccent || '';
  el('heroDesc').value = data.hero.description || '';
  el('heroTagline').value = data.hero.tagline || '';
  el('heroImage').value = data.hero.image || '';
  el('heroCta1Label').value = data.hero.cta1.label || '';
  el('heroCta1Href').value = data.hero.cta1.href || '';
  el('heroCta2Label').value = data.hero.cta2.label || '';
  el('heroCta2Href').value = data.hero.cta2.href || '';

  // Known For
  el('knownHeading').value = data.knownFor.heading || '';
  el('knownSubtitle').value = data.knownFor.subtitle || '';
  renderKnownForCards(data.knownFor.cards);

  // Locations
  el('locHeading').value = data.locations.heading || '';
  renderLocations(data.locations.items);

  // Social Proof
  el('socialFeatured').value = data.socialProof.featured || '';
  el('socialStats').value = data.socialProof.stats || '';

  // CTA
  el('ctaHeading').value = data.cta.heading || '';
  el('ctaSubtitle').value = data.cta.subtitle || '';
  el('ctaBtn').value = data.cta.buttonLabel || '';
  el('ctaLink').value = data.cta.buttonLink || '';

  document.getElementById('homeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    data.hero.heading = el('heroHeading').value;
    data.hero.headingAccent = el('heroAccent').value;
    data.hero.description = el('heroDesc').value;
    data.hero.tagline = el('heroTagline').value;
    data.hero.image = el('heroImage').value;
    data.hero.cta1 = { label: el('heroCta1Label').value, href: el('heroCta1Href').value };
    data.hero.cta2 = { label: el('heroCta2Label').value, href: el('heroCta2Href').value };
    data.knownFor.heading = el('knownHeading').value;
    data.knownFor.subtitle = el('knownSubtitle').value;
    data.locations.heading = el('locHeading').value;
    data.socialProof.featured = el('socialFeatured').value;
    data.socialProof.stats = el('socialStats').value;
    data.cta.heading = el('ctaHeading').value;
    data.cta.subtitle = el('ctaSubtitle').value;
    data.cta.buttonLabel = el('ctaBtn').value;
    data.cta.buttonLink = el('ctaLink').value;

    const result = await apiFetch(API + '/home', {
      method: 'PUT', headers: getHeaders(), body: JSON.stringify(data)
    });
    if (result && result.success) showToast('Home page saved!');
    else showToast('Failed to save', true);
  });
}

function renderKnownForCards(cards) {
  const container = document.getElementById('knownCards');
  if (!container) return;
  container.innerHTML = '';
  cards.forEach((card, i) => {
    container.innerHTML += `
      <div class="section-editor">
        <div class="form-group"><label>Card ${i+1} Title</label><input name="card_${i}_title" value="${esc(card.title)}"></div>
        <div class="form-group"><label>Description</label><textarea name="card_${i}_desc">${esc(card.description)}</textarea></div>
        <div class="form-group"><label>Image Path</label><input name="card_${i}_image" value="${esc(card.image)}"></div>
        <div class="form-group"><label>Link</label><input name="card_${i}_link" value="${esc(card.link)}"></div>
      </div>`;
  });
  // Wire change listeners
  container.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('change', () => {
      const parts = input.name.split('_');
      const idx = parseInt(parts[1]);
      const field = parts[2];
      const map = { title: 'title', desc: 'description', image: 'image', link: 'link' };
      if (window._pageData) window._pageData.knownFor.cards[idx][map[field]] = input.value;
    });
  });
}

function renderLocations(items) {
  const container = document.getElementById('locationItems');
  if (!container) return;
  container.innerHTML = '';
  items.forEach((loc, i) => {
    container.innerHTML += `
      <div class="section-editor">
        <div class="form-group"><label>Location ${i+1} Name</label><input name="loc_${i}_name" value="${esc(loc.name)}"></div>
        <div class="form-group"><label>Address</label><textarea name="loc_${i}_address">${esc(loc.address)}</textarea></div>
        <div class="form-group"><label>Hours</label><textarea name="loc_${i}_hours">${esc(loc.hours)}</textarea></div>
        <div class="form-group"><label>Label</label><input name="loc_${i}_label" value="${esc(loc.label)}"></div>
      </div>`;
  });
  container.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('change', () => {
      const parts = input.name.split('_');
      const idx = parseInt(parts[1]);
      const field = parts[2];
      if (window._pageData) window._pageData.locations.items[idx][field] = input.value;
    });
  });
}

// ===== Menu Editor =====
async function initMenuEditor() {
  if (!await checkAuth()) return;
  const data = await apiFetch(API + '/menu');
  if (!data) return;
  window._menuData = data;

  document.getElementById('menuPageTitle').value = data.pageTitle || '';
  document.getElementById('menuPageSubtitle').value = data.pageSubtitle || '';
  document.getElementById('menuFooterNote').value = data.footerNote || '';

  renderMenuTabs(data);
  renderMenuItems(data, 0);

  document.getElementById('menuForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    data.pageTitle = document.getElementById('menuPageTitle').value;
    data.pageSubtitle = document.getElementById('menuPageSubtitle').value;
    data.footerNote = document.getElementById('menuFooterNote').value;
    const result = await apiFetch(API + '/menu', {
      method: 'PUT', headers: getHeaders(), body: JSON.stringify(data)
    });
    if (result && result.success) showToast('Menu saved!');
    else showToast('Failed to save', true);
  });
}

function renderMenuTabs(data) {
  const tabs = document.getElementById('menuTabs');
  if (!tabs) return;
  tabs.innerHTML = '';
  data.categories.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'admin-tab' + (i === 0 ? ' active' : '');
    btn.textContent = cat.name;
    btn.onclick = () => {
      tabs.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      renderMenuItems(data, i);
    };
    tabs.appendChild(btn);
  });
  // Add category button
  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'btn btn-sm btn-secondary';
  addBtn.textContent = '+ Category';
  addBtn.onclick = () => {
    const name = prompt('Category name:');
    if (!name) return;
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    data.categories.push({ id, name, items: [] });
    renderMenuTabs(data);
    renderMenuItems(data, data.categories.length - 1);
  };
  tabs.appendChild(addBtn);
}

function renderMenuItems(data, catIndex) {
  const container = document.getElementById('menuItems');
  if (!container) return;
  const cat = data.categories[catIndex];
  container.innerHTML = `
    <div class="inline-toolbar">
      <h3 style="margin:0">${esc(cat.name)}</h3>
      <span class="badge badge-teal">${cat.items.length} items</span>
      <button type="button" class="btn btn-sm btn-primary" onclick="addMenuItem(${catIndex})">+ Add Item</button>
      <button type="button" class="btn btn-sm btn-danger" onclick="deleteCategory(${catIndex})">Delete Category</button>
    </div>
    <table class="admin-table">
      <thead><tr><th>Name</th><th>Description</th><th>Price</th><th>Actions</th></tr></thead>
      <tbody id="menuItemsBody"></tbody>
    </table>`;
  const tbody = document.getElementById('menuItemsBody');
  cat.items.forEach((item, i) => {
    tbody.innerHTML += `<tr>
      <td>${esc(item.name)}</td>
      <td>${esc(item.description)}</td>
      <td>${esc(item.price)}</td>
      <td class="actions">
        <button class="btn btn-sm btn-secondary" onclick="editMenuItem(${catIndex},${i})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteMenuItem(${catIndex},${i})">Del</button>
      </td>
    </tr>`;
  });
  window._currentCat = catIndex;
}

function addMenuItem(catIndex) {
  openItemModal('Add Item', {}, (item) => {
    window._menuData.categories[catIndex].items.push(item);
    renderMenuItems(window._menuData, catIndex);
  });
}

function editMenuItem(catIndex, itemIndex) {
  const item = window._menuData.categories[catIndex].items[itemIndex];
  openItemModal('Edit Item', item, (updated) => {
    window._menuData.categories[catIndex].items[itemIndex] = updated;
    renderMenuItems(window._menuData, catIndex);
  });
}

function deleteMenuItem(catIndex, itemIndex) {
  if (!confirm('Delete this item?')) return;
  window._menuData.categories[catIndex].items.splice(itemIndex, 1);
  renderMenuItems(window._menuData, catIndex);
}

function deleteCategory(catIndex) {
  if (!confirm('Delete this entire category and all its items?')) return;
  window._menuData.categories.splice(catIndex, 1);
  renderMenuTabs(window._menuData);
  if (window._menuData.categories.length > 0) renderMenuItems(window._menuData, 0);
  else document.getElementById('menuItems').innerHTML = '<p>No categories. Add one above.</p>';
}

function openItemModal(title, item, onSave) {
  const overlay = document.getElementById('modalOverlay');
  const modal = document.getElementById('modalContent');
  modal.innerHTML = `
    <h3>${title}</h3>
    <div class="form-group"><label>Name</label><input id="modalName" value="${esc(item.name || '')}"></div>
    <div class="form-group"><label>Description</label><input id="modalDesc" value="${esc(item.description || '')}"></div>
    <div class="form-group"><label>Price</label><input id="modalPrice" value="${esc(item.price || '')}"></div>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" id="modalSave">Save</button>
    </div>`;
  overlay.classList.add('active');
  document.getElementById('modalSave').onclick = () => {
    onSave({
      name: document.getElementById('modalName').value,
      description: document.getElementById('modalDesc').value,
      price: document.getElementById('modalPrice').value
    });
    closeModal();
  };
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.classList.remove('active');
}

// ===== About Editor =====
async function initAboutEditor() {
  if (!await checkAuth()) return;
  const data = await apiFetch(API + '/about');
  if (!data) return;
  window._aboutData = data;

  const el = (id) => document.getElementById(id);
  el('aboutPageTitle').value = data.pageTitle || '';
  el('aboutPageSubtitle').value = data.pageSubtitle || '';
  el('storyHeading').value = data.story.heading || '';
  el('storyImage').value = data.story.image || '';
  el('storyParagraphs').value = (data.story.paragraphs || []).join('\n\n');
  el('quoteText').value = data.quote.text || '';
  el('quoteCite').value = data.quote.cite || '';
  el('darshiniHeading').value = data.darshini.heading || '';
  el('darshiniSubtitle').value = data.darshini.subtitle || '';

  renderDarshiniItems(data.darshini.items);
  renderMilestones(data.journey.milestones);
  renderFounders(data.founders.cards);

  el('journeyHeading').value = data.journey.heading || '';
  el('foundersHeading').value = data.founders.heading || '';
  el('alsoVisited').value = data.founders.alsoVisited || '';
  el('aboutCtaHeading').value = data.cta.heading || '';
  el('aboutCtaSubtitle').value = data.cta.subtitle || '';

  document.getElementById('aboutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    data.pageTitle = el('aboutPageTitle').value;
    data.pageSubtitle = el('aboutPageSubtitle').value;
    data.story.heading = el('storyHeading').value;
    data.story.image = el('storyImage').value;
    data.story.paragraphs = el('storyParagraphs').value.split('\n\n').filter(p => p.trim());
    data.quote.text = el('quoteText').value;
    data.quote.cite = el('quoteCite').value;
    data.darshini.heading = el('darshiniHeading').value;
    data.darshini.subtitle = el('darshiniSubtitle').value;
    data.journey.heading = el('journeyHeading').value;
    data.founders.heading = el('foundersHeading').value;
    data.founders.alsoVisited = el('alsoVisited').value;
    data.cta.heading = el('aboutCtaHeading').value;
    data.cta.subtitle = el('aboutCtaSubtitle').value;

    const result = await apiFetch(API + '/about', {
      method: 'PUT', headers: getHeaders(), body: JSON.stringify(data)
    });
    if (result && result.success) showToast('About page saved!');
    else showToast('Failed to save', true);
  });
}

function renderDarshiniItems(items) {
  const c = document.getElementById('darshiniItems');
  if (!c) return;
  c.innerHTML = '';
  items.forEach((item, i) => {
    c.innerHTML += `<div class="section-editor">
      <div class="form-row">
        <div class="form-group"><label>Title</label><input data-i="${i}" data-f="title" value="${esc(item.title)}"></div>
        <div class="form-group"><label>Description</label><input data-i="${i}" data-f="description" value="${esc(item.description)}"></div>
      </div>
      <button type="button" class="btn btn-sm btn-danger" onclick="removeDarshini(${i})">Remove</button>
    </div>`;
  });
  c.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('change', () => {
      window._aboutData.darshini.items[parseInt(inp.dataset.i)][inp.dataset.f] = inp.value;
    });
  });
}

function removeDarshini(i) {
  window._aboutData.darshini.items.splice(i, 1);
  renderDarshiniItems(window._aboutData.darshini.items);
}

function addDarshini() {
  window._aboutData.darshini.items.push({ title: '', description: '' });
  renderDarshiniItems(window._aboutData.darshini.items);
}

function renderMilestones(milestones) {
  const c = document.getElementById('milestoneItems');
  if (!c) return;
  c.innerHTML = '';
  milestones.forEach((m, i) => {
    c.innerHTML += `<div class="section-editor">
      <div class="form-row">
        <div class="form-group"><label>Year</label><input data-i="${i}" data-f="year" value="${esc(m.year)}"></div>
        <div class="form-group"><label>Description</label><input data-i="${i}" data-f="text" value="${esc(m.text)}"></div>
      </div>
      <button type="button" class="btn btn-sm btn-danger" onclick="removeMilestone(${i})">Remove</button>
    </div>`;
  });
  c.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('change', () => {
      window._aboutData.journey.milestones[parseInt(inp.dataset.i)][inp.dataset.f] = inp.value;
    });
  });
}

function removeMilestone(i) {
  window._aboutData.journey.milestones.splice(i, 1);
  renderMilestones(window._aboutData.journey.milestones);
}

function addMilestone() {
  window._aboutData.journey.milestones.push({ year: '', text: '' });
  renderMilestones(window._aboutData.journey.milestones);
}

function renderFounders(cards) {
  const c = document.getElementById('founderCards');
  if (!c) return;
  c.innerHTML = '';
  cards.forEach((card, i) => {
    c.innerHTML += `<div class="section-editor">
      <div class="form-group"><label>Name</label><input data-i="${i}" data-f="name" value="${esc(card.name)}"></div>
      <div class="form-group"><label>Role</label><input data-i="${i}" data-f="role" value="${esc(card.role)}"></div>
      <div class="form-group"><label>Image</label><input data-i="${i}" data-f="image" value="${esc(card.image)}"></div>
      <div class="form-group"><label>Bio</label><textarea data-i="${i}" data-f="bio">${esc(card.bio)}</textarea></div>
      <button type="button" class="btn btn-sm btn-danger" onclick="removeFounder(${i})">Remove</button>
    </div>`;
  });
  c.querySelectorAll('input, textarea').forEach(inp => {
    inp.addEventListener('change', () => {
      window._aboutData.founders.cards[parseInt(inp.dataset.i)][inp.dataset.f] = inp.value;
    });
  });
}

function removeFounder(i) {
  window._aboutData.founders.cards.splice(i, 1);
  renderFounders(window._aboutData.founders.cards);
}

function addFounder() {
  window._aboutData.founders.cards.push({ name: '', role: '', image: '', imageAlt: '', bio: '' });
  renderFounders(window._aboutData.founders.cards);
}

// ===== Contact Editor =====
async function initContactEditor() {
  if (!await checkAuth()) return;
  const data = await apiFetch(API + '/contact');
  if (!data) return;
  window._contactData = data;

  const el = (id) => document.getElementById(id);
  el('contactPageTitle').value = data.pageTitle || '';
  el('contactPageSubtitle').value = data.pageSubtitle || '';
  el('formHeading').value = data.form.heading || '';
  el('formSubtitle').value = data.form.subtitle || '';
  el('formSubjects').value = (data.form.subjects || []).join('\n');
  el('workHeading').value = data.workWithUs.heading || '';
  el('workSubtitle').value = data.workWithUs.subtitle || '';

  renderContactLocations(data.locations);
  renderContactInfo(data.contactInfo);
  renderWorkLinks(data.workWithUs.links);

  document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    data.pageTitle = el('contactPageTitle').value;
    data.pageSubtitle = el('contactPageSubtitle').value;
    data.form.heading = el('formHeading').value;
    data.form.subtitle = el('formSubtitle').value;
    data.form.subjects = el('formSubjects').value.split('\n').filter(s => s.trim());
    data.workWithUs.heading = el('workHeading').value;
    data.workWithUs.subtitle = el('workSubtitle').value;

    const result = await apiFetch(API + '/contact', {
      method: 'PUT', headers: getHeaders(), body: JSON.stringify(data)
    });
    if (result && result.success) showToast('Contact page saved!');
    else showToast('Failed to save', true);
  });
}

function renderContactLocations(locations) {
  const c = document.getElementById('contactLocations');
  if (!c) return;
  c.innerHTML = '';
  locations.forEach((loc, i) => {
    c.innerHTML += `<div class="section-editor">
      <h4 style="margin-bottom:12px">${esc(loc.name)}</h4>
      <div class="form-group"><label>Name</label><input data-i="${i}" data-f="name" value="${esc(loc.name)}"></div>
      <div class="form-group"><label>Label</label><input data-i="${i}" data-f="label" value="${esc(loc.label)}"></div>
      <div class="form-group"><label>Address</label><textarea data-i="${i}" data-f="address">${esc(loc.address)}</textarea></div>
      <div class="form-group"><label>Hours (one per line)</label><textarea data-i="${i}" data-f="hours">${esc((loc.hours||[]).join('\n'))}</textarea></div>
      <div class="form-group"><label>Map Embed URL</label><input data-i="${i}" data-f="mapEmbed" value="${esc(loc.mapEmbed||'')}"></div>
    </div>`;
  });
  c.querySelectorAll('input, textarea').forEach(inp => {
    inp.addEventListener('change', () => {
      const idx = parseInt(inp.dataset.i);
      const f = inp.dataset.f;
      if (f === 'hours') window._contactData.locations[idx][f] = inp.value.split('\n').filter(s => s.trim());
      else window._contactData.locations[idx][f] = inp.value;
    });
  });
}

function renderContactInfo(info) {
  const c = document.getElementById('contactInfoItems');
  if (!c) return;
  c.innerHTML = '';
  info.forEach((item, i) => {
    c.innerHTML += `<div class="section-editor">
      <div class="form-row">
        <div class="form-group"><label>Label</label><input data-i="${i}" data-f="label" value="${esc(item.label)}"></div>
        <div class="form-group"><label>Display Text</label><input data-i="${i}" data-f="text" value="${esc(item.text)}"></div>
      </div>
      <div class="form-group"><label>Link</label><input data-i="${i}" data-f="href" value="${esc(item.href)}"></div>
    </div>`;
  });
  c.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('change', () => {
      window._contactData.contactInfo[parseInt(inp.dataset.i)][inp.dataset.f] = inp.value;
    });
  });
}

function renderWorkLinks(links) {
  const c = document.getElementById('workLinks');
  if (!c) return;
  c.innerHTML = '';
  links.forEach((link, i) => {
    c.innerHTML += `<div class="section-editor">
      <div class="form-row">
        <div class="form-group"><label>Label</label><input data-i="${i}" data-f="label" value="${esc(link.label)}"></div>
        <div class="form-group"><label>Href</label><input data-i="${i}" data-f="href" value="${esc(link.href)}"></div>
      </div>
    </div>`;
  });
  c.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('change', () => {
      window._contactData.workWithUs.links[parseInt(inp.dataset.i)][inp.dataset.f] = inp.value;
    });
  });
}

// ===== FAQ Editor =====
async function initFaqEditor() {
  if (!await checkAuth()) return;
  const data = await apiFetch(API + '/faq');
  if (!data) return;
  window._faqData = data;

  document.getElementById('faqPageTitle').value = data.pageTitle || '';
  document.getElementById('faqPageSubtitle').value = data.pageSubtitle || '';

  renderFaqCategories(data);

  document.getElementById('faqForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    data.pageTitle = document.getElementById('faqPageTitle').value;
    data.pageSubtitle = document.getElementById('faqPageSubtitle').value;
    const result = await apiFetch(API + '/faq', {
      method: 'PUT', headers: getHeaders(), body: JSON.stringify(data)
    });
    if (result && result.success) showToast('FAQ saved!');
    else showToast('Failed to save', true);
  });
}

function renderFaqCategories(data) {
  const c = document.getElementById('faqCategories');
  if (!c) return;
  c.innerHTML = '';
  data.categories.forEach((cat, ci) => {
    let html = `<div class="admin-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 style="margin:0;border:none;padding:0">${esc(cat.name)}</h3>
        <div>
          <button type="button" class="btn btn-sm btn-primary" onclick="addFaqItem(${ci})">+ Question</button>
          <button type="button" class="btn btn-sm btn-danger" onclick="removeFaqCategory(${ci})">Delete</button>
        </div>
      </div>`;
    cat.items.forEach((item, ii) => {
      html += `<div class="section-editor">
        <div class="form-group"><label>Question</label><input data-ci="${ci}" data-ii="${ii}" data-f="question" value="${esc(item.question)}"></div>
        <div class="form-group"><label>Answer (HTML)</label><textarea data-ci="${ci}" data-ii="${ii}" data-f="answer">${esc(item.answer)}</textarea></div>
        <button type="button" class="btn btn-sm btn-danger" onclick="removeFaqItem(${ci},${ii})">Remove</button>
      </div>`;
    });
    html += '</div>';
    c.innerHTML += html;
  });
  c.querySelectorAll('input, textarea').forEach(inp => {
    inp.addEventListener('change', () => {
      const ci = parseInt(inp.dataset.ci);
      const ii = parseInt(inp.dataset.ii);
      window._faqData.categories[ci].items[ii][inp.dataset.f] = inp.value;
    });
  });
}

function addFaqCategory() {
  const name = prompt('Category name:');
  if (!name) return;
  window._faqData.categories.push({ name, items: [] });
  renderFaqCategories(window._faqData);
}

function removeFaqCategory(ci) {
  if (!confirm('Delete this FAQ category?')) return;
  window._faqData.categories.splice(ci, 1);
  renderFaqCategories(window._faqData);
}

function addFaqItem(ci) {
  window._faqData.categories[ci].items.push({ question: '', answer: '' });
  renderFaqCategories(window._faqData);
}

function removeFaqItem(ci, ii) {
  window._faqData.categories[ci].items.splice(ii, 1);
  renderFaqCategories(window._faqData);
}

// ===== Legal (Privacy/Terms) Editor =====
async function initLegalEditor(page) {
  if (!await checkAuth()) return;
  const data = await apiFetch(API + '/' + page);
  if (!data) return;
  window._legalData = data;
  window._legalPage = page;

  const el = (id) => document.getElementById(id);
  el('legalPageTitle').value = data.pageTitle || '';
  el('legalPageSubtitle').value = data.pageSubtitle || '';
  el('legalEffDate').value = data.effectiveDate || '';
  el('legalUpdated').value = data.lastUpdated || '';
  el('legalIntro').value = data.intro || '';

  renderLegalSections(data.sections);

  document.getElementById('legalForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    data.pageTitle = el('legalPageTitle').value;
    data.pageSubtitle = el('legalPageSubtitle').value;
    data.effectiveDate = el('legalEffDate').value;
    data.lastUpdated = el('legalUpdated').value;
    data.intro = el('legalIntro').value;

    const result = await apiFetch(API + '/' + page, {
      method: 'PUT', headers: getHeaders(), body: JSON.stringify(data)
    });
    if (result && result.success) showToast('Saved!');
    else showToast('Failed to save', true);
  });
}

function renderLegalSections(sections) {
  const c = document.getElementById('legalSections');
  if (!c) return;
  c.innerHTML = '';
  sections.forEach((s, i) => {
    c.innerHTML += `<div class="section-editor">
      <div class="form-group"><label>Heading</label><input data-i="${i}" data-f="heading" value="${esc(s.heading)}"></div>
      <div class="form-group"><label>Content (HTML)</label><textarea data-i="${i}" data-f="content" style="min-height:120px">${esc(s.content)}</textarea></div>
      <button type="button" class="btn btn-sm btn-danger" onclick="removeLegalSection(${i})">Remove Section</button>
    </div>`;
  });
  c.querySelectorAll('input, textarea').forEach(inp => {
    inp.addEventListener('change', () => {
      window._legalData.sections[parseInt(inp.dataset.i)][inp.dataset.f] = inp.value;
    });
  });
}

function addLegalSection() {
  window._legalData.sections.push({ heading: '', content: '' });
  renderLegalSections(window._legalData.sections);
}

function removeLegalSection(i) {
  if (!confirm('Remove this section?')) return;
  window._legalData.sections.splice(i, 1);
  renderLegalSections(window._legalData.sections);
}

// ===== Settings Editor =====
async function initSettingsEditor() {
  if (!await checkAuth()) return;
  const data = await apiFetch(API + '/global');
  if (!data) return;
  window._globalData = data;

  const el = (id) => document.getElementById(id);
  el('siteName').value = data.siteName || '';
  el('siteTagline').value = data.tagline || '';
  el('siteLogo').value = data.logo || '';
  el('siteFavicon').value = data.favicon || '';

  // Colors
  const colorsContainer = document.getElementById('colorsContainer');
  if (colorsContainer) {
    colorsContainer.innerHTML = '';
    for (const [key, val] of Object.entries(data.colors || {})) {
      colorsContainer.innerHTML += `<div class="color-row">
        <input type="color" data-key="${key}" value="${val}">
        <span class="color-label">${key}</span>
        <span class="color-value">${val}</span>
      </div>`;
    }
    colorsContainer.querySelectorAll('input[type="color"]').forEach(inp => {
      inp.addEventListener('input', () => {
        window._globalData.colors[inp.dataset.key] = inp.value;
        inp.nextElementSibling.nextElementSibling.textContent = inp.value;
      });
    });
  }

  // Cookie banner
  el('cookieHeading').value = data.cookieBanner.heading || '';
  el('cookieText').value = data.cookieBanner.text || '';
  el('cookieAcceptBtn').value = data.cookieBanner.acceptBtn || '';
  el('cookieDeclineBtn').value = data.cookieBanner.declineBtn || '';

  // Footer
  el('footerDesc').value = data.footer.description || '';
  el('footerCopyright').value = data.footer.copyright || '';

  document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    data.siteName = el('siteName').value;
    data.tagline = el('siteTagline').value;
    data.logo = el('siteLogo').value;
    data.favicon = el('siteFavicon').value;
    data.cookieBanner.heading = el('cookieHeading').value;
    data.cookieBanner.text = el('cookieText').value;
    data.cookieBanner.acceptBtn = el('cookieAcceptBtn').value;
    data.cookieBanner.declineBtn = el('cookieDeclineBtn').value;
    data.footer.description = el('footerDesc').value;
    data.footer.copyright = el('footerCopyright').value;

    const result = await apiFetch(API + '/global', {
      method: 'PUT', headers: getHeaders(), body: JSON.stringify(data)
    });
    if (result && result.success) showToast('Settings saved!');
    else showToast('Failed to save', true);
  });
}

// ===== Media Library =====
async function initMediaLibrary() {
  if (!await checkAuth()) return;
  await loadMedia();

  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('fileInput');

  if (uploadArea) {
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.style.borderColor = 'var(--teal)'; });
    uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = ''; });
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = '';
      if (e.dataTransfer.files.length) uploadFile(e.dataTransfer.files[0]);
    });
  }
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) uploadFile(fileInput.files[0]);
    });
  }
}

async function loadMedia() {
  const data = await apiFetch(API + '/media');
  if (!data) return;
  const grid = document.getElementById('mediaGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const all = [...(data.originals || []), ...(data.uploads || [])];
  all.forEach(p => {
    const name = p.split('/').pop();
    const isUpload = p.includes('uploads/');
    grid.innerHTML += `<div class="media-item">
      <img src="/${p}" alt="${name}">
      <div class="filename">${name}</div>
      ${isUpload ? `<button class="delete-btn" onclick="deleteMedia('${name}')">&times;</button>` : ''}
    </div>`;
  });
}

async function uploadFile(file) {
  const formData = new FormData();
  formData.append('image', file);
  try {
    const res = await fetch(API + '/media/upload', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      showToast('Image uploaded!');
      loadMedia();
    } else {
      showToast(data.error || 'Upload failed', true);
    }
  } catch { showToast('Upload failed', true); }
}

async function deleteMedia(filename) {
  if (!confirm('Delete this image?')) return;
  const result = await apiFetch(API + '/media/' + filename, { method: 'DELETE', headers: getHeaders() });
  if (result && result.success) {
    showToast('Deleted');
    loadMedia();
  } else showToast('Failed to delete', true);
}

// ===== Password Change =====
async function initPasswordChange() {
  const form = document.getElementById('passwordForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    if (newPass !== confirm) { showToast('Passwords do not match', true); return; }
    const result = await apiFetch(API + '/password', {
      method: 'PUT', headers: getHeaders(),
      body: JSON.stringify({ currentPassword: current, newPassword: newPass })
    });
    if (result && result.success) {
      showToast('Password changed!');
      form.reset();
    } else showToast(result.error || 'Failed', true);
  });
}

// ===== Logout =====
async function logout() {
  await fetch(API + '/logout', { method: 'POST', headers: getHeaders() });
  localStorage.removeItem('admin_token');
  window.location.href = '/admin/login';
}

// ===== Messages =====
let _messagesData = [];
let _currentFilter = 'all';

async function initMessages() {
  if (!await checkAuth()) return;
  await loadMessages();

  document.querySelectorAll('#messageFilters .admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#messageFilters .admin-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      _currentFilter = tab.dataset.filter;
      renderMessages();
    });
  });
}

async function loadMessages() {
  const data = await apiFetch(API + '/messages');
  if (!data) return;
  _messagesData = data.messages || [];
  const el = (id) => document.getElementById(id);
  if (el('statTotal')) el('statTotal').textContent = _messagesData.length;
  if (el('statUnread')) el('statUnread').textContent = data.unreadCount || 0;
  renderMessages();
}

function renderMessages() {
  const container = document.getElementById('messagesContainer');
  if (!container) return;

  let filtered = _messagesData;
  if (_currentFilter === 'unread') filtered = _messagesData.filter(m => !m.read);
  else if (_currentFilter === 'read') filtered = _messagesData.filter(m => m.read);

  // Sort newest first
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state"><h3>No messages</h3><p>Messages from the contact form will appear here.</p></div>';
    return;
  }

  let html = `<table class="admin-table">
    <thead><tr><th>Status</th><th>Name</th><th>Email</th><th>Subject</th><th>Date</th><th>Actions</th></tr></thead>
    <tbody>`;
  filtered.forEach(m => {
    const date = new Date(m.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    html += `<tr class="message-row${m.read ? '' : ' unread'}" onclick="viewMessage('${m.id}')">
      <td><span class="status-dot${m.read ? '' : ' unread'}"></span></td>
      <td>${esc(m.name)}</td>
      <td>${esc(m.email)}</td>
      <td>${esc(m.subject)}</td>
      <td>${date}</td>
      <td class="actions" onclick="event.stopPropagation()">
        <button class="btn btn-sm btn-secondary" onclick="toggleRead('${m.id}', ${m.read})">${m.read ? 'Unread' : 'Read'}</button>
        <button class="btn btn-sm btn-danger" onclick="deleteMessage('${m.id}')">Del</button>
      </td>
    </tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

async function viewMessage(id) {
  const msg = _messagesData.find(m => m.id === id);
  if (!msg) return;

  // Auto-mark as read
  if (!msg.read) {
    await apiFetch(API + '/messages/' + id + '/read', { method: 'PUT', headers: getHeaders() });
    msg.read = true;
    renderMessages();
    updateUnreadStats();
    updateSidebarBadge();
  }

  const date = new Date(msg.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const modal = document.getElementById('modalContent');
  modal.innerHTML = `<div class="message-detail">
    <h3>${esc(msg.subject)}</h3>
    <div class="message-meta">
      <strong>From:</strong> ${esc(msg.name)} &lt;${esc(msg.email)}&gt;<br>
      <strong>Date:</strong> ${date}
    </div>
    <div class="message-body">${esc(msg.message)}</div>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      <a href="mailto:${esc(msg.email)}?subject=Re: ${encodeURIComponent(msg.subject)}" class="btn btn-primary">Reply</a>
    </div>
  </div>`;
  document.getElementById('modalOverlay').classList.add('active');
}

async function toggleRead(id, isRead) {
  const endpoint = isRead ? '/unread' : '/read';
  const result = await apiFetch(API + '/messages/' + id + endpoint, { method: 'PUT', headers: getHeaders() });
  if (result && result.success) {
    const msg = _messagesData.find(m => m.id === id);
    if (msg) msg.read = !isRead;
    renderMessages();
    updateUnreadStats();
    updateSidebarBadge();
  }
}

async function deleteMessage(id) {
  if (!confirm('Delete this message?')) return;
  const result = await apiFetch(API + '/messages/' + id, { method: 'DELETE', headers: getHeaders() });
  if (result && result.success) {
    _messagesData = _messagesData.filter(m => m.id !== id);
    renderMessages();
    updateUnreadStats();
    updateSidebarBadge();
    showToast('Message deleted');
  } else {
    showToast('Failed to delete', true);
  }
}

function updateUnreadStats() {
  const unread = _messagesData.filter(m => !m.read).length;
  const el = (id) => document.getElementById(id);
  if (el('statTotal')) el('statTotal').textContent = _messagesData.length;
  if (el('statUnread')) el('statUnread').textContent = unread;
}

// ===== Sidebar Unread Badge =====
async function updateSidebarBadge() {
  try {
    let unread;
    if (_messagesData && _messagesData.length !== undefined) {
      unread = _messagesData.filter(m => !m.read).length;
    } else {
      const data = await apiFetch(API + '/messages');
      if (!data) return;
      unread = data.unreadCount || 0;
    }
    const msgLink = document.querySelector('.sidebar-nav a[href="/admin/messages"]');
    if (!msgLink) return;
    let badge = msgLink.querySelector('.sidebar-badge');
    if (unread > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'sidebar-badge';
        msgLink.appendChild(badge);
      }
      badge.textContent = unread;
    } else if (badge) {
      badge.remove();
    }
  } catch {}
}

// Load sidebar badge on any admin page after auth
(function() {
  const origCheckAuth = checkAuth;
  checkAuth = async function() {
    const result = await origCheckAuth();
    if (result) {
      // Fetch unread count for sidebar badge
      try {
        const data = await fetch(API + '/messages', { headers: getHeaders() });
        if (data.ok) {
          const json = await data.json();
          const unread = json.unreadCount || 0;
          const msgLink = document.querySelector('.sidebar-nav a[href="/admin/messages"]');
          if (msgLink && unread > 0) {
            let badge = msgLink.querySelector('.sidebar-badge');
            if (!badge) {
              badge = document.createElement('span');
              badge.className = 'sidebar-badge';
              msgLink.appendChild(badge);
            }
            badge.textContent = unread;
          }
        }
      } catch {}
    }
    return result;
  };
})();

// ===== Utility =====
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
