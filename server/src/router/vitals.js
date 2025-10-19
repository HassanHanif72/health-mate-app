// server/src/router/vitals.js
const express = require("express");
const vitalsRouter = express.Router();
const { authMiddleware } = require("../middleware/auth");
const { Vitals } = require("../models/Vitals");

// Add vitals
vitalsRouter.post("/add", authMiddleware, async (req, res) => {
  try {
    const { bp, sugar, weight, notes, date } = req.body;

    const newVitals = new Vitals({
      userId: req.user._id,
      date: date ? new Date(date) : Date.now(),
      bp: bp || "",
      sugar: sugar !== undefined ? Number(sugar) : undefined,
      weight: weight !== undefined ? Number(weight) : undefined,
      notes: notes || "",
    });

    await newVitals.save();
    res.status(201).json({ message: "Vitals saved", vitals: newVitals });
  } catch (err) {
    console.error("Add vitals error:", err);
    res.status(500).json({ message: "Failed to save vitals" });
  }
});

// Get logged-in user's vitals (sorted newest first)
vitalsRouter.get("/my-vitals", authMiddleware, async (req, res) => {
  try {
    const entries = await Vitals.find({ userId: req.user._id }).sort({ date: -1 });
    res.status(200).json(entries);
  } catch (err) {
    console.error("Fetch vitals error:", err);
    res.status(500).json({ message: "Failed to fetch vitals" });
  }
});

// Optional: delete a vitals entry
vitalsRouter.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const doc = await Vitals.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!doc) return res.status(404).json({ message: "Vitals entry not found" });
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete vitals error:", err);
    res.status(500).json({ message: "Failed to delete vitals" });
  }
});

module.exports = { vitalsRouter };
