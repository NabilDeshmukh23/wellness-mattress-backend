const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    category: {
        type: String,
        required: [true, "Please select a category"],
        enum: {
            values: ["Memory Foam", "Hybrid", "Latex", "Orthopedic", "Pillows", "Accessories"],
            message: "Please select a valid category"
        }
    },
    subCategory: {
        type: String,
        enum: ["dream-fit", "ortho-fit", "wellness-support", "latex-pro", "spine-comfort"]
    },
    type: { 
        type: String,
        required: [true, "Please specify mattress feel (e.g. Firm, Medium, Plush)"]
    },
    imageUrl: {
        type: String,
        required: [true, "Product image URL is required"]
    },
    variants: [
        {
            size: { type: String, required: true }, // e.g. "72x36 (Single)"
            price: { type: Number, required: true },
            stock: { type: Number, required: true, default: 0 }
        }
    ],
    basePrice: {
        type: Number,
        required: [true, "Please enter a base price for the listing"]
    },
    discount: {
        type: Number, 
        default: 0
    },
    warranty: {
        type: String,
        required: [true, "Please enter warranty period (e.g. 10 Years)"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isBestseller: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }); 

module.exports = mongoose.model('Product', productSchema);