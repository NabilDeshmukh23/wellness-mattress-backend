const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, "Please select a category"],
        enum: {
            values: ["Memory Foam", "Hybrid", "Latex", "Orthopedic", "Pillows", "Accessories"],
            message: "Please select a valid category"
        }
    },
    productName: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    type: { 
        type: String,
        required: [true, "Please specify mattress type (e.g. Firm, Soft)"]
    },
    imageUrl: {
        type: String,
        required: [true, "Product image is required"]
    },
    size: {
        type: String, 
        required: [true, "Please enter dimensions (e.g. 72x36)"]
    },
    colors: {
        type: [String], // This allows you to store multiple colors in a list
        default: ["White"]
    },
    price: {
        type: Number,
        required: [true, "Please enter price"]
    },
    discount: {
        type: Number,
        default: 0
    },
    warranty: {
        type: String,
        required: [true, "Please enter warranty period"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// This line ensures 'updatedAt' changes every time you edit the product
productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('Product', productSchema);