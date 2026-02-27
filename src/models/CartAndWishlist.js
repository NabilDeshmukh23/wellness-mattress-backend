const mongoose = require('mongoose');

// 1. Define the Cart Item Schema separately to fix strictPopulate issues
const cartItemSchema = new mongoose.Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', // Ensure this matches mongoose.model('Product', ...) exactly
        required: true 
    },
    length: Number,
    width: Number,
    thickness: String,
    quantity: { 
        type: Number, 
        default: 1 
    },
    price: Number 
});

// 2. Define the main Cart Schema
const cartSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [cartItemSchema] // Use the sub-schema for reliable population
}, { timestamps: true });

// 3. Define the Wishlist Schema
const wishlistSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    products: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product' 
    }]
}, { timestamps: true });

// 4. Create the models
const Cart = mongoose.model('Cart', cartSchema);
const Wishlist = mongoose.model('Wishlist', wishlistSchema);

// 5. Export as an object to allow destructuring in controllers
module.exports = { Cart, Wishlist };