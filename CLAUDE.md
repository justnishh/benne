# Benne Cafe Website - Project Instructions

## Auto-Save Rule

After EVERY response that involves code changes, file modifications, or completing a task, you MUST automatically:

1. **Update `docs/SESSION_LOG.md`** - Append a new session entry with:
   - Current date and time (IST timezone)
   - Task name and objective
   - Detailed steps completed
   - Files created/modified
   - Any commits made (hash + message)
   - Verification steps performed

2. **Update `docs/RELEASE_NOTES.md`** - If a commit was made, prepend a new version entry at the top (below the header) with:
   - Version number (increment from the last version)
   - Current date and time (IST timezone)
   - Commit hash
   - Summary of changes
   - Detailed feature descriptions
   - Files changed list
   - Any API endpoints added/modified

Do NOT ask the user before doing this. Do it automatically every time.

## Project Overview

- **Stack:** Node.js / Express.js backend, vanilla HTML/CSS/JS frontend
- **Data:** JSON files in `/data/` directory
- **Auth:** JWT-based admin authentication
- **Admin Panel:** Located at `/admin/*`, pages in `views/admin/`, JS in `public/js/admin.js`
- **Public Site:** Static HTML in `public/`, JS in `public/js/main.js`
- **Styling:** `public/css/style.css` (frontend), `public/css/admin.css` (admin panel)
