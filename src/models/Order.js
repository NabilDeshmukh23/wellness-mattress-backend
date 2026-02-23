const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // 1. Link to the User
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    orderItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            size: { type: String, required: true } // Important for Mattress variants
        }
    ],

    // 3. Shipping Details (Structured for logistics)
    shippingInfo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        phoneNo: { type: String, required: true }
    },

    // 4. Payment Details (Optimized for Razorpay)
    paymentInfo: {
        id: { type: String }, // Razorpay Payment ID
        orderId: { type: String }, // Razorpay Order ID
        status: { type: String, default: 'Pending' },
        method: { type: String }
    },

    // 5. Financial Breakdown
    itemsPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },

    // 6. Status Tracking
    orderStatus: {
        type: String,
        required: true,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    
    // 7. Time Tracking
    paidAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);