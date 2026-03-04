# Benne Cafe Website - Release Notes

---

## v1.6.0 - Contact Form Submissions & Admin Inbox
**Date:** 2026-03-04 15:16 IST
**Commit:** `ef959eb`

### Summary
The public contact form on `/contact.html` now actually submits data to the backend. Messages are stored server-side and the admin panel gets a dedicated **Messages** inbox page with full read/unread tracking, filtering, and message management.

### New Features
- **Working Contact Form**: The "Send us a message" form on the contact page now sends data via `POST /api/contact` instead of faking a "Sent!" animation
- **Message Storage**: Contact form submissions are persisted in `data/messages.json` with UUID, timestamp, and read/unread status
- **Admin Messages Page** (`/admin/messages`): Full inbox interface with:
  - Stats bar showing total messages and unread count
  - Filter tabs: All / Unread / Read
  - Messages table with status dot indicator, name, email, subject, date, and action buttons
  - Click-to-expand modal with full message details
  - Auto-mark-as-read when viewing a message
  - Toggle read/unread status per message
  - Delete messages with confirmation
  - Reply button (opens mailto: link)
  - Empty state when no messages exist
- **Sidebar Unread Badge**: Every admin page sidebar now shows a dynamic unread count badge next to the "Messages" link (hidden when count is 0)
- **Dashboard Stat Card**: New "Unread Messages" stat card on the admin dashboard alongside existing stats

### API Endpoints Added
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/contact` | Public | Submit contact form message |
| `GET` | `/api/admin/messages` | Admin | Get all messages + unread count |
| `PUT` | `/api/admin/messages/:id/read` | Admin | Mark message as read |
| `PUT` | `/api/admin/messages/:id/unread` | Admin | Mark message as unread |
| `DELETE` | `/api/admin/messages/:id` | Admin | Delete a message |

### Files Changed (17 total)
**New files (2):**
- `data/messages.json` - Empty messages data store
- `views/admin/messages.html` - Admin messages inbox page

**Modified files (15):**
- `routes/api.js` - Added POST /api/contact with validation & sanitization
- `routes/admin-api.js` - Added 4 admin message management endpoints
- `public/js/main.js` - Replaced fake form handler with real fetch submission
- `public/js/admin.js` - Added initMessages(), sidebar badge, dashboard stat
- `public/css/admin.css` - Added message table, status dot, badge, modal styles
- `views/admin/dashboard.html` - Added unread messages stat card + sidebar link
- `views/admin/home.html` - Added Messages sidebar link
- `views/admin/menu.html` - Added Messages sidebar link
- `views/admin/about.html` - Added Messages sidebar link
- `views/admin/contact.html` - Added Messages sidebar link
- `views/admin/faq.html` - Added Messages sidebar link
- `views/admin/privacy.html` - Added Messages sidebar link
- `views/admin/terms.html` - Added Messages sidebar link
- `views/admin/settings.html` - Added Messages sidebar link
- `views/admin/media.html` - Added Messages sidebar link

### Input Validation
- All fields (name, email, subject, message) are required
- Whitespace trimming on all inputs
- Length limits: name/email (200 chars), subject (300 chars), message (5000 chars)
- Button disabled during submission to prevent double-submit
- Error feedback shown directly on the submit button

---

## v1.5.0 - Express Backend, Admin CMS & Dynamic Content
**Date:** 2026-03-03
**Commit:** `e6ec450`

### Summary
Migrated from a static site to a full Express.js backend with JWT-authenticated admin CMS. All page content is now stored in JSON data files and loaded dynamically.

### New Features
- Express.js server with static file serving and API routes
- JWT-based admin authentication with login/logout
- Admin panel with sidebar navigation and page editors for:
  - Home page (hero, cards, locations, social proof, CTA)
  - Menu (categories + items CRUD)
  - About page (story, quote, darshini, journey, founders)
  - Contact page (locations, contact info, form settings, work links)
  - FAQ (categories + items CRUD)
  - Privacy Policy (sections editor)
  - Terms & Conditions (sections editor)
  - Global Settings (site name, colors, cookie banner, footer)
  - Media Library (upload, browse, delete images)
  - Password change
- Dynamic content loading on frontend via `content-loader.js`
- All page data stored as JSON in `/data/` directory

### Files Added
- `server.js`, `package.json`, `.env`
- `routes/api.js`, `routes/admin-api.js`
- `middleware/auth.js`, `utils/dataStore.js`
- `data/*.json` (auth, global, home, menu, about, contact, faq, privacy, terms)
- `views/admin/*.html` (login, dashboard, home, menu, about, contact, faq, privacy, terms, settings, media)
- `public/js/admin.js`, `public/css/admin.css`
- `public/js/content-loader.js`

---

## v1.4.0 - Founder Photos
**Date:** 2026-03-02
**Commit:** `271d30a`

### Summary
Added founder photos that were missing from the previous commit.

---

## v1.3.0 - Performance Optimization
**Date:** 2026-03-01
**Commit:** `5664c03`

### Summary
Compressed all images to WebP format, consolidated CSS files, and deferred JavaScript loading for faster page loads.

### Changes
- Converted all images to WebP format
- Consolidated CSS into fewer files
- Added `defer` attribute to script tags
- Lazy loading for images and logos

---

## v1.2.0 - Cookie Consent Banner
**Date:** 2026-02-28
**Commit:** `434f541`

### Summary
Added a cookie consent banner with humor-themed copy matching the cafe brand personality.

### Features
- Cookie consent banner with accept/decline buttons
- Toast notifications on accept/decline
- Consent stored in localStorage
- Cookie-gated iframe embeds (maps load only after consent)

---

## v1.1.0 - Legal Pages & Footer Update
**Date:** 2026-02-27
**Commit:** `9ae3ecc`

### Summary
Added legal pages (Terms & Conditions, Privacy Policy) and updated the footer to include legal links.

### Pages Added
- `terms.html` - Terms & Conditions
- `privacy.html` - Privacy Policy
- `faq.html` - Frequently Asked Questions

---

## v1.0.0 - Initial Release
**Date:** 2026-02-25
**Commit:** `2b9277f`

### Summary
Initial release of the Benne cafe website - a heritage Bangalore dosa restaurant in Mumbai.

### Pages
- Home page with hero, known-for cards, locations, social proof, and CTA
- Menu page with categorized food items and tabs
- About page with story, darshini format, journey timeline, and founders
- Contact page with locations, maps, contact info, and form

### Tech Stack
- HTML5, CSS3, Vanilla JavaScript
- Google Fonts (Playfair Display, Poppins)
- Google Maps embeds
- Responsive design
