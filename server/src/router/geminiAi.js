// server/src/router/geminiAi.js
const express = require("express");
const geminiAiRouter = express.Router();
const { authMiddleware } = require("../middleware/auth");
const { File } = require("../models/File");
const { AiInsight } = require("../models/AiInsight");
const { sendFileForAnalysis } = require("../services/geminiService");

// POST /api/ai/process-file
geminiAiRouter.post("/process-file", authMiddleware, async (req, res) => {
  try {
    const { fileId, fileUrl } = req.body;
    let targetUrl = fileUrl;

    if (!targetUrl) {
      if (!fileId) return res.status(400).json({ message: "fileId or fileUrl required" });
      const fileDoc = await File.findById(fileId);
      if (!fileDoc) return res.status(404).json({ message: "File not found" });
      if (String(fileDoc.userId) !== String(req.user._id)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      targetUrl = fileDoc.fileUrl;
    }

    // pass user context
    const userContext = {
      age: req.user.age || null,
      gender: req.user.gender || null,
      bloodGroup: req.user.bloodGroup || null,
    };

    // Call service which first extracts & validates then summarizes
    const aiResult = await sendFileForAnalysis(targetUrl, { userContext });

    // If the file is NOT medical, the service returns isMedical: false
    if (!aiResult || aiResult.isMedical === false) {
      return res.status(400).json({
        message: "This file does not appear to be a medical report. Please upload a valid medical report."
      });
    }

    // Save AiInsight only when isMedical = true
    const insight = new AiInsight({
      userId: req.user._id,
      fileId: fileId || null,
      summaryEnglish: aiResult.summaryEnglish || "No summary generated",
      summaryUrdu: aiResult.summaryUrdu || "",
      doctorQuestions: aiResult.doctorQuestions || [],
      foodTips: aiResult.foodTips || [],
      homeRemedies: aiResult.homeRemedies || [],
    });

    await insight.save();

    return res.status(200).json({ message: "AI analysis saved", insight });
  } catch (err) {
    console.error("AI process error:", err);
    return res.status(500).json({ message: "AI processing failed", error: err.message || err });
  }
});

// GET insight and list routes (keep existing)
geminiAiRouter.get("/insights/:fileId", authMiddleware, async (req, res) => {
  try {
    const insights = await AiInsight.findOne({ fileId: req.params.fileId }).sort({ createdAt: -1 });
    if (!insights) return res.status(404).json({ message: "No insights found" });
    res.status(200).json(insights);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch insights" });
  }
});

geminiAiRouter.get("/list", authMiddleware, async (req, res) => {
  try {
    const insights = await AiInsight.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(insights);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch AI insights" });
  }
});

module.exports = {
  geminiAiRouter
};
