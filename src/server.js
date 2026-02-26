const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

// UPDATE THIS: Explicitly allow your local machine and set credentials
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Database connection logic
const uri = process.env.MONGO_URI;

// It's good practice to add these options for stable hosted connections
mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 10s
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
app.listen(PORT, '0.0.0.0', () => { // Explicitly bind to 0.0.0.0 for Render
    console.log(`🚀 Server started on port ${PORT}`);
});