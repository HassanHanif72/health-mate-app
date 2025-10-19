const express = require("express");
const fileUploadRouter = express.Router();
const { upload } = require("../config/cloudinary");
const { authMiddleware } = require("../middleware/auth");
const { File } = require("../models/File");

// Upload File
fileUploadRouter.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    // Check if file exists
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Save file info to MongoDB
    const newFile = new File({
      userId: req.user._id,
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      reportType: req.body.reportType || "General Report",
    });

    await newFile.save();

    res.status(200).json({
      message: "File uploaded & saved successfully",
      file: newFile,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "File upload failed", error });
  }
});


// Get My Uploaded Files
fileUploadRouter.get("/my-files", authMiddleware, async (req, res) => {
  try {
    const files = await File.find({ userId: req.user._id }).sort({ uploadedAt: -1 });
    res.status(200).json(files);
  } catch (error) {
    console.error("Fetch files error:", error);
    res.status(500).json({ message: "Failed to fetch files" });
  }
});

// Get All Files for Logged-in User
fileUploadRouter.get("/list", authMiddleware, async (req, res) => {
  try {
    const files = await File.find({ userId: req.user._id }).sort({ uploadedAt: -1 });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch files" });
  }
});



module.exports = { fileUploadRouter };
