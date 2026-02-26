const express = require('express');
const router = express.Router();

const {
    getUserProfile,
    updateProfile,
    addAddress,
    deleteAddress,
    changePassword
} = require('../controllers/profileController');

const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getUserProfile);
router.route('/update').put(protect, updateProfile);
router.route('/change-password').put(protect, changePassword);


router.route('/address').post(protect, addAddress);

router.route('/address/:addressId').delete(protect, deleteAddress);

module.exports = router;