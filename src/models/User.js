const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // 1. userId: MongoDB creates this automatically as '_id'
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    number: {
        type: String,
        required: [true, "Please enter your phone number"]
    },
    role: {
        type: String,
        enum: ['Customer', 'Admin', 'Staff'], // Only these 3 options are allowed
        default: 'Customer'
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true // Prevents duplicate accounts
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        select: false // This hides the password from search results for security
    },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    createdAt: {
        type: Date,
        default: Date.now // Automatically sets the time when created
    }
});

module.exports = mongoose.model('User', userSchema);