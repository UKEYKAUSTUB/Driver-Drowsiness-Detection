const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// 🔗 MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/drowsinessDB")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));

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

// ▶️ Start server
app.listen(5000, () => {
    console.log("🚀 Server running on port 5000");
});