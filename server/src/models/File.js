const mongoose = require("mongoose");
const { Schema } = mongoose;

const fileSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  reportType: {
    type: String, // e.g., "Blood Test", "X-Ray"
    default: "General Report",
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const File = mongoose.model("File", fileSchema);
module.exports = { File };
