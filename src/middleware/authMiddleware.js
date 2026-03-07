const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user || !req.user.isActive) {
                return res.status(401).json({ message: "Account inactive or user not found" });
            }

            return next(); 
        } catch (error) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

exports.adminOnly = (req, res, next) => {
    // Check if the user object exists (from protect) and if the role is Admin
    if (req.user && req.user.role === 'Admin') {
        return next();
    } else {
        // Return 403 Forbidden if the user is a regular Customer
        return res.status(403).json({ 
            success: false, 
            message: "Access denied. Admin privileges required." 
        });
    }
};