const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const { File } = require("../models/File");
const { AiInsight } = require("../models/AiInsight");
const { Vitals } = require("../models/Vitals");

const timelineRouter = express.Router();

timelineRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const reports = await File.find({ userId }).select("fileName uploadedAt").lean();
    const insights = await AiInsight.find({ userId }).select("createdAt summaryEnglish").lean();
    const vitals = await Vitals.find({ userId }).select("date bp sugar").lean();

    const timelineData = [
      ...reports.map(r => ({ type: "report", date: r.uploadedAt, text: `Uploaded report: ${r.fileName}` })),
      ...insights.map(i => ({ type: "ai", date: i.createdAt, text: "AI Summary Generated" })),
      ...vitals.map(v => ({ type: "vitals", date: v.date, text: `Vitals Added (BP: ${v.bp || "-"}, Sugar: ${v.sugar || "-"})` }))
    ];

    timelineData.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json(timelineData);
  } catch (error) {
    console.log("Timeline error:", error);
    res.status(500).json({ message: "Error loading timeline" });
  }
});

module.exports = { timelineRouter };
