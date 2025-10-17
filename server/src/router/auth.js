const express = require("express");
const authRouter = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { domainList } = require("../constants/domainList");

// Create token
const createToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const ONE_HOUR_MS = 60 * 60 * 1000;
// const isProd = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  // secure: isProd,
  // sameSite: isProd ? "none" : "lax",
  maxAge: ONE_HOUR_MS,
  path: "/",
};

// Login
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const validDomain = domainList;
    const valid = email.split("@")[1].toLowerCase();
    if (!validDomain.some(d => valid.endsWith(d))) {
      return res.status(400).json({ message: "Invalid email domain" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = createToken(user._id);
    res.cookie("token", token, cookieOptions);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Register
authRouter.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const validDomain = domainList;
    const valid = email.split("@")[1].toLowerCase();
    if (!validDomain.some(d => valid.endsWith(d))) {
      return res.status(400).json({ message: "Invalid email domain" });
    }

    if (!validator.isStrongPassword(password)) {
      return res
        .status(400)
        .json({
          message:
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character",
        });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();

    const token = createToken(user._id);
    res.cookie("token", token, cookieOptions);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({ message: "User already exists" });
    }
    res.status(500).json({ message: error.message });
  }
});

// Logout
authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);
    req.user = null;
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = { authRouter };
