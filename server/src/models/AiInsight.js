const mongoose = require("mongoose");
const { Schema } = mongoose;

const aiInsightSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
  summaryEnglish: { type: String, required: true },
  summaryUrdu: { type: String, required: false },
  doctorQuestions: { type: [String], default: [] },
  foodTips: { type: [String], default: [] },
  homeRemedies: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

const AiInsight = mongoose.model("AiInsight", aiInsightSchema);
module.exports = { AiInsight };
