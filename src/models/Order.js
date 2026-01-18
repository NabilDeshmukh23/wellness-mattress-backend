const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // Link to the User who placed the order
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Link to the specific Product
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    // Redundant data for fast display without doing a lookup
    productName: { type: String, required: true },
    customerName: { type: String, required: true },
    
    // Time details
    orderDate: {
        type: Date,
        default: Date.now
    },
    // You can derive time from the Date object in your frontend
    
    // Payment Details (Razorpay Integration)
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    paymentId: { 
        type: String // This will store the Razorpay generated ID
    },
    paymentMethod: { 
        type: String 
    },
    
    // Order Status
    orderStatus: {
        type: String,
        enum: ['Processing', 'In Transit', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    
    // Logistics
    address: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    
    // Cancellation tracking
    cancelledOn: { type: Date }
});

module.exports = mongoose.model('Order', orderSchema);