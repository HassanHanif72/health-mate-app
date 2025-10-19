const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"],
      maxlength: [20, "First name must be less than 20 characters long"],
    },
    lastName: {
      type: String,
      required: true,
      minlength: [3, "Last name must be at least 3 characters long"],
      maxlength: [20, "Last name must be less than 20 characters long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
      default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRef5T11g0-3Lc-fy4tpXVVFLYruY9KxRMcVQ&s",
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    bloodGroup: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
