const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Protect ensures the order is linked to the logged-in user
router.post('/create', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/admin/dashboard', protect, adminOnly, getAdminDashboardStats);

module.exports = router;