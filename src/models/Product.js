const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true,
        unique: true
    },
    productType: {
        type: String,
        required: [true, "Product type is required (Mattress, Pillows, or Slim Mattress)"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
   category: {
        type: String,
        required: [true, "Please select a category"],
        trim: true
    },
    feel: { 
        type: String,
        required: [true, "Specify mattress feel (e.g. Firm, Medium, Plush)"]
    },
    imageUrl: {
        type: String,
        required: [true, "Product image URL is required"]
    },
    variants: [
        {
            length: { type: Number, required: true },
            width: { type: Number, required: true },
            thickness: { type: String, required: true },
            price: { type: Number, required: true },
            stock: { type: Number, required: true, default: 0 },
            hasMemoryFoam: { type: Boolean, default: false },
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
            thickness: { type: String, required: true },
            rate: { type: Number, required: true }
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
    
    reviews: [reviewSchema], 
    ratings: { 
        type: Number, 
        default: 0 
    },
    numReviews: { 
        type: Number, 
        default: 0 
    },
    
    isBestseller: { type: Boolean, default: false }
}, { timestamps: true }); 

module.exports = mongoose.model('Product', productSchema);