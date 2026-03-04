const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../utils/dataStore');

router.get('/global', (req, res) => {
  try { res.json(readData('global.json')); }
  catch (e) { res.status(500).json({ error: 'Failed to load global data' }); }
});

router.get('/home', (req, res) => {
  try { res.json(readData('home.json')); }
  catch (e) { res.status(500).json({ error: 'Failed to load home data' }); }
});

router.get('/menu', (req, res) => {
  try { res.json(readData('menu.json')); }
  catch (e) { res.status(500).json({ error: 'Failed to load menu data' }); }
});

router.get('/about', (req, res) => {
  try { res.json(readData('about.json')); }
  catch (e) { res.status(500).json({ error: 'Failed to load about data' }); }
});

router.get('/contact', (req, res) => {
  try { res.json(readData('contact.json')); }
  catch (e) { res.status(500).json({ error: 'Failed to load contact data' }); }
});

router.get('/faq', (req, res) => {
  try { res.json(readData('faq.json')); }
  catch (e) { res.status(500).json({ error: 'Failed to load faq data' }); }
});

router.get('/privacy', (req, res) => {
  try { res.json(readData('privacy.json')); }
  catch (e) { res.status(500).json({ error: 'Failed to load privacy data' }); }
});

router.get('/terms', (req, res) => {
  try { res.json(readData('terms.json')); }
  catch (e) { res.status(500).json({ error: 'Failed to load terms data' }); }
});

// ========== CONTACT FORM SUBMISSION ==========
router.post('/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Basic sanitization & length limits
    const trimmed = {
      name: String(name).trim().slice(0, 200),
      email: String(email).trim().slice(0, 200),
      subject: String(subject).trim().slice(0, 300),
      message: String(message).trim().slice(0, 5000)
    };

    if (!trimmed.name || !trimmed.email || !trimmed.subject || !trimmed.message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const data = readData('messages.json');
    data.messages.push({
      id: uuidv4(),
      name: trimmed.name,
      email: trimmed.email,
      subject: trimmed.subject,
      message: trimmed.message,
      read: false,
      createdAt: new Date().toISOString()
    });
    writeData('messages.json', data);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to submit message' });
  }
});

module.exports = router;
