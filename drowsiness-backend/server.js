const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// 🔗 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Atlas Connected"))
.catch(err => console.log("❌ DB Error:", err));


// Store latest GPS coordinates
let latestLocation = {
  latitude: null,
  longitude: null
};

// 📦 Schema
const AlertSchema = new mongoose.Schema({
    status: String,
    time: String,
    image: String,
    location: String
});

// Model
const Alert = mongoose.model("Alert", AlertSchema);

// 🚀 POST API (Python will call this)
app.post("/alert", async (req, res) => {
    try {
        const { status, time, image, location } = req.body;

        const newAlert = new Alert({ status, time, image, location });
        await newAlert.save();

        res.json({ message: "Alert saved" });
    } catch (err) {
        res.status(500).json({ error: "Error saving alert" });
    }
});

// 📥 GET API (React will use this)
app.get("/alerts", async (req, res) => {
    const alerts = await Alert.find().sort({ _id: -1 });
    res.json(alerts);
});

// Save latest GPS location from frontend
app.post("/location", (req, res) => {
    latestLocation = req.body;

    console.log("📍 GPS Updated:", latestLocation);

    res.json({ success: true });
});

// Python can fetch latest GPS location
app.get("/location", (req, res) => {
    res.json(latestLocation);
});

// ▶️ Start server
app.listen(5000, () => {
    console.log("🚀 Server running on port 5000");
});