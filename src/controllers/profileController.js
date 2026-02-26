const User = require('../models/User');
const Order = require('../models/Order'); // Separate Order model
const bcrypt = require('bcryptjs');

// @desc    Get complete profile data
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist cart.product');
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ success: true, user, orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Personal Details
exports.updateProfile = async (req, res) => {
    try {
        const { name, number, dob, gender, email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, number, dob, gender, email },
            { new: true, runValidators: true }
        );
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add New Address (Detailed Fields)
exports.addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const newAddress = { ...req.body, isDefault: user.shippingInfo.length === 0 };
        
        user.shippingInfo.push(newAddress);
        await user.save();
        res.json({ success: true, shippingInfo: user.shippingInfo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete Address
exports.deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.shippingInfo = user.shippingInfo.filter(
            (addr) => addr._id.toString() !== req.params.addressId
        );
        await user.save();
        res.json({ success: true, shippingInfo: user.shippingInfo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Change Password with Current Check
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');

        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) return res.status(401).json({ message: "Current password incorrect" });

        user.password = newPassword; // Hashed by pre-save hook
        await user.save();
        res.json({ success: true, message: "Password updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};