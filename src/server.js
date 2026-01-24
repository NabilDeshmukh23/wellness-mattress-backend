const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
    .then(() => {
        console.log("✅ MongoDB Connection Successful: Connected to Wellness-Mattress-DB");
    })
    .catch((err) => {
        console.log("❌ MongoDB Connection Error:");
        console.error(err);
    });

// Test Route
app.get('/', (req, res) => {
    res.send("Wellness Mattress API is Live and Database is Connected!");
});

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});