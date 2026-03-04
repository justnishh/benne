require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const apiRoutes = require('./routes/api');
const adminApiRoutes = require('./routes/admin-api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Public API routes
app.use('/api', apiRoutes);

// Admin API routes
app.use('/api/admin', adminApiRoutes);

// Admin pages
app.get('/admin', (req, res) => res.redirect('/admin/login'));
app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin', 'login.html'));
});
app.get('/admin/:page', (req, res) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, 'views', 'admin', page + '.html');
  res.sendFile(filePath, (err) => {
    if (err) res.redirect('/admin/login');
  });
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// SPA fallback for HTML pages
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Benne server running on http://localhost:${PORT}`);
});
