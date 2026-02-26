const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

app.use(cors({
    origin: '*', // For testing on Postman, allow all origins temporarily
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
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
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});