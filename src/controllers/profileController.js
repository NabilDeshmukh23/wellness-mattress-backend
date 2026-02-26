const User = require('../models/User');
const Order = require('../models/Order'); 
const bcrypt = require('bcryptjs');

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
       
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const readableField = field === 'number' ? 'Phone number' : 'Email';
            return res.status(400).json({ 
                success: false, 
                message: `${readableField} is already linked to another account.` 
            });
        }

      
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages[0] });
        }

        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

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

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');

        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) return res.status(401).json({ message: "Current password incorrect" });

        user.password = newPassword; 
        await user.save();
        res.json({ success: true, message: "Password updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};