const express = require('express');
const router = express.Router();

// Import the profile controller functions
const {
    getUserProfile,
    updateProfile,
    addAddress,
    deleteAddress,
    changePassword
} = require('../controllers/profileController');

// Import your existing auth middleware
const { protect } = require('../middleware/authMiddleware');

// Base Profile Routes
router.route('/').get(protect, getUserProfile);
router.route('/update').put(protect, updateProfile);
router.route('/change-password').put(protect, changePassword);

// Address Management Routes
// POST /api/profile/address - Add a new address
router.route('/address').post(protect, addAddress);

// DELETE /api/profile/address/:addressId - Remove a specific address
router.route('/address/:addressId').delete(protect, deleteAddress);

module.exports = router;