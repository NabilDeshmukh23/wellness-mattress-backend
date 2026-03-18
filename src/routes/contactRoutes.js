const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware'); 
const { submitContactForm, getAdminContacts} = require('../controllers/contactController');

// POST /api/contact
router.post('/', submitContactForm);
router.get('/admin/all', protect, adminOnly, getAdminContacts);

module.exports = router;