const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product'); 
const Order = require('../models/Order');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};


exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, number, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const user = await User.create({
            name,
            email,
            password,
            number,
            role: role 
        });

        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

       
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.comparePassword(password))) {
            if (!user.isActive) {
                return res.status(403).json({ message: "Account deactivated" });
            }

            res.json({
                success: true,
                token: generateToken(user._id),
                user: { id: user._id, name: user.name, role: user.role }
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.getUserProfile = async (req, res) => {
    try {
      
        const user = await User.findById(req.user._id)
            .populate('cart.product') 
            .populate('wishlist');

        
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            success: true,
            user: {
                createdAt: user.createdAt,
                id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,
                role: user.role,
                shippingInfo: user.shippingInfo,
                cart: user.cart,
                wishlist: user.wishlist
            },
            orders 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};