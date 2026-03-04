const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const { readData, writeData } = require('../utils/dataStore');

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'public', 'images', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    if (allowed.test(path.extname(file.originalname))) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

// ========== AUTH ==========
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const auth = readData('auth.json');
    if (email !== auth.email || !bcrypt.compareSync(password, auth.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ token, message: 'Login successful' });
  } catch (e) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, email: req.admin.email });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

// ========== GENERIC PAGE DATA ENDPOINTS ==========
const pages = ['home', 'menu', 'about', 'contact', 'faq', 'privacy', 'terms', 'global'];

pages.forEach(page => {
  // GET full page data
  router.get(`/${page}`, authMiddleware, (req, res) => {
    try { res.json(readData(`${page}.json`)); }
    catch (e) { res.status(500).json({ error: `Failed to load ${page} data` }); }
  });

  // PUT full page data (replace entire JSON)
  router.put(`/${page}`, authMiddleware, (req, res) => {
    try {
      writeData(`${page}.json`, req.body);
      res.json({ success: true, message: `${page} updated` });
    } catch (e) {
      res.status(500).json({ error: `Failed to update ${page}` });
    }
  });
});

// ========== MENU CRUD ==========
// Add category
router.post('/menu/category', authMiddleware, (req, res) => {
  try {
    const data = readData('menu.json');
    const { id, name } = req.body;
    data.categories.push({ id, name, items: [] });
    writeData('menu.json', data);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ error: 'Failed to add category' }); }
});

// Delete category
router.delete('/menu/category/:id', authMiddleware, (req, res) => {
  try {
    const data = readData('menu.json');
    data.categories = data.categories.filter(c => c.id !== req.params.id);
    writeData('menu.json', data);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ error: 'Failed to delete category' }); }
});

// Add item to category
router.post('/menu/category/:id/item', authMiddleware, (req, res) => {
  try {
    const data = readData('menu.json');
    const cat = data.categories.find(c => c.id === req.params.id);
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    cat.items.push(req.body);
    writeData('menu.json', data);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ error: 'Failed to add item' }); }
});

// Update item in category
router.put('/menu/category/:id/item/:index', authMiddleware, (req, res) => {
  try {
    const data = readData('menu.json');
    const cat = data.categories.find(c => c.id === req.params.id);
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    const idx = parseInt(req.params.index);
    if (idx < 0 || idx >= cat.items.length) return res.status(404).json({ error: 'Item not found' });
    cat.items[idx] = req.body;
    writeData('menu.json', data);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ error: 'Failed to update item' }); }
});

// Delete item from category
router.delete('/menu/category/:id/item/:index', authMiddleware, (req, res) => {
  try {
    const data = readData('menu.json');
    const cat = data.categories.find(c => c.id === req.params.id);
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    cat.items.splice(parseInt(req.params.index), 1);
    writeData('menu.json', data);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ error: 'Failed to delete item' }); }
});

// ========== FAQ CRUD ==========
router.post('/faq/category', authMiddleware, (req, res) => {
  try {
    const data = readData('faq.json');
    data.categories.push({ name: req.body.name, items: [] });
    writeData('faq.json', data);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ error: 'Failed to add FAQ category' }); }
});

router.delete('/faq/category/:index', authMiddleware, (req, res) => {
  try {
    const data = readData('faq.json');
    data.categories.splice(parseInt(req.params.index), 1);
    writeData('faq.json', data);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ error: 'Failed to delete FAQ category' }); }
});

router.post('/faq/category/:index/item', authMiddleware, (req, res) => {
  try {
    const data = readData('faq.json');
    const cat = data.categories[parseInt(req.params.index)];
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    cat.items.push(req.body);
    writeData('faq.json', data);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ error: 'Failed to add FAQ item' }); }
});

router.put('/faq/category/:catIndex/item/:itemIndex', authMiddleware, (req, res) => {
  try {
    const data = readData('faq.json');
    const cat = data.categories[parseInt(req.params.catIndex)];
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    cat.items[parseInt(req.params.itemIndex)] = req.body;
    writeData('faq.json', data);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ error: 'Failed to update FAQ item' }); }
});

router.delete('/faq/category/:catIndex/item/:itemIndex', authMiddleware, (req, res) => {
  try {
    const data = readData('faq.json');
    const cat = data.categories[parseInt(req.params.catIndex)];
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    cat.items.splice(parseInt(req.params.itemIndex), 1);
    writeData('faq.json', data);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ error: 'Failed to delete FAQ item' }); }
});

// ========== MEDIA ==========
router.get('/media', authMiddleware, (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '..', 'public', 'images', 'uploads');
    const imagesDir = path.join(__dirname, '..', 'public', 'images');
    const uploads = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir).filter(f => !f.startsWith('.')).map(f => 'images/uploads/' + f) : [];
    const originals = fs.readdirSync(imagesDir).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
    }).map(f => 'images/' + f);
    res.json({ uploads, originals });
  } catch (e) { res.status(500).json({ error: 'Failed to list media' }); }
});

router.post('/media/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ success: true, path: 'images/uploads/' + req.file.filename });
});

router.delete('/media/:filename', authMiddleware, (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'public', 'images', 'uploads', req.params.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (e) { res.status(500).json({ error: 'Failed to delete file' }); }
});

// ========== PASSWORD CHANGE ==========
router.put('/password', authMiddleware, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const auth = readData('auth.json');
    if (!bcrypt.compareSync(currentPassword, auth.password)) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    auth.password = bcrypt.hashSync(newPassword, 10);
    writeData('auth.json', auth);
    res.json({ success: true, message: 'Password changed' });
  } catch (e) { res.status(500).json({ error: 'Failed to change password' }); }
});

module.exports = router;
