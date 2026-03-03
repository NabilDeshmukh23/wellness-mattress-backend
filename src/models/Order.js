const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
            image: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            length: { type: Number, required: true },
            width: { type: Number, required: true },
            thickness: { type: String, required: true },
            sizeCategory: { type: String }, 
            isCustom: { type: Boolean, default: false }
        }
    ],

    shippingInfo: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        phoneNo: { type: String, required: true }
    },

    paymentInfo: {
        id: { type: String }, 
        orderId: { type: String }, 
        status: { 
            type: String, 
            enum: ['Pending', 'Paid', 'Failed'], 
            default: 'Pending' 
        },
        method: { type: String }
    },

    itemsPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },

    orderStatus: {
        type: String,
        required: true,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    
    paidAt: Date,
    deliveredAt: Date,
    cancelledAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);