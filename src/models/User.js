const mongoose = require('mongoose');
const validator = require('validator'); 
const bcrypt = require('bcryptjs');     

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        trim: true,
        maxLength: [50, "Name cannot exceed 50 characters"]
    },
    dob: {
        type: Date,
        required: [false, "Please enter your date of birth"] 
    },
    number: {
        type: String,
        required: [true, "Please enter your phone number"],
        unique: true, 
        match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"]
    },
    role: {
        type: String,
        enum: ['Customer', 'Admin', 'Staff'],
        default: 'Customer'
    },

    isActive: {
        type: Boolean,
        default: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        lowercase: true, 
        validate: [validator.isEmail, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password should be at least 8 characters"],
        select: false 
    },
    
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product' 
        }
    ],
    cart: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 },
            size: { type: String } 
        }
    ],

  shippingInfo: [
    {
        fullName: { type: String, required: true },
        phoneNo: { type: String, required: true },
        addressLine: { type: String, required: true }, // House No, Building, Company
        street: { type: String, required: true },      // Area, Colony, Street, Sector
        landmark: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        addressType: { 
            type: String, 
            enum: ['Home', 'Work', 'Other'], 
            default: 'Home' 
        },
        isDefault: { type: Boolean, default: false }
    }
],

    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function () {
   
    if (!this.isModified('password')) return;

   
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);