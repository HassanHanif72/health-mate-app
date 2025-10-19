const mongoose = require("mongoose");
const { Schema } = mongoose;

const vitalsSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  bp: {
    type: String, // Example: "130/80"
  },
  sugar: {
    type: Number, // Example: 95
  },
  weight: {
    type: Number, // in kg
  },
  notes: {
    type: String,
  },
});

const Vitals = mongoose.model("Vitals", vitalsSchema);
module.exports = { Vitals };
