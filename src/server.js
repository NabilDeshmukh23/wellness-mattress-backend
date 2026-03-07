const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Route Imports
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profileRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();


app.use(cors({
    origin: true, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes); 

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000 
})
    .then(() => {
        console.log("✅ MongoDB Connection Successful: Connected to Wellness-Mattress-DB");
    })
    .catch((err) => {
        console.log("❌ MongoDB Connection Error:");
        console.error(err);
    });

app.get('/', (req, res) => {
    res.send("Wellness Mattress API is Live and Database is Connected!");
});


const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, '0.0.0.0', () => { 
    console.log(`🚀 Server started on port ${PORT}`);
});