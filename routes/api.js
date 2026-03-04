const express = require('express');
const router = express.Router();
const { readData } = require('../utils/dataStore');

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

module.exports = router;
