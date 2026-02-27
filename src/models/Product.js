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
    feel: { 
        type: String,
        required: [true, "Specify mattress feel (e.g. Firm, Medium, Plush)"]
    },
    imageUrl: {
        type: String,
        required: [true, "Product image URL is required"]
    },
    // Updated variants to include Size Category and Memory Foam toggle
    variants: [
        {
            length: { type: Number, required: true },
            width: { type: Number, required: true },
            thickness: { type: String, required: true },
            price: { type: Number, required: true },
            stock: { type: Number, required: true, default: 0 },
            // Logic for Memory Foam vs Standard [cite: 1, 4]
            hasMemoryFoam: { 
                type: Boolean, 
                default: false 
            },
            // Categorizing for Frontend Filtering [cite: 2, 6]
            sizeCategory: { 
                type: String, 
                enum: ['Single', 'Double', 'Queen', 'King'],
                required: true 
            }
        }
    ],
    isCustomizable: {
        type: Boolean,
        default: true
    },
   sqMtPrices: [
        {
            thickness: { type: String, required: true }, // e.g., "5\""
            rate: { type: Number, required: true }      // e.g., 7770
        }
    ],
    basePrice: {
        type: Number,
        required: [true, "Enter the starting price for display"]
    },
    discount: {
        type: Number, 
        default: 0 
    },
    warranty: {
        type: String,
        required: [true, "e.g., 24 Months, 60 Months, or 84 Months"]
    },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isBestseller: { type: Boolean, default: false }
}, { timestamps: true }); 

module.exports = mongoose.model('Product', productSchema);