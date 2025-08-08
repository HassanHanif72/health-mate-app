const express = require("express");
const authRouter = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const domainList = require("../constant/domainList");

// Create token
const createToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

// Login
authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("All fields are required");
        }
        if (!validator.isEmail(email)) {
            throw new Error("Invalid email");
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new Error("Invalid password");
        }
        const token = createToken(user._id);
        res.cookie("token", token, {
            expires: new Date(Date.now() + 60 * 1000),
            httpOnly: true,
            secure: true,
            // maxAge: 3600000
        });
        res.status(200).json({ message: "Login successful" });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// Signup
authRouter.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            throw new Error("All fields are required");
        }

        if (!validator.isEmail(email)) {
            throw new Error("Invalid email");
        }

        const validDomain = domainList;
        const valid = email.split('.').pop().toLowerCase();
        if (!validDomain.includes(valid)) {
            throw new Error("Invalid email domain");
        }

        if (!validator.isStrongPassword(password)) {
            throw new Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character");
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })
        await user.save();

        const token = createToken(user._id);
        res.cookie("token", token, {
            expires: new Date(Date.now() + 60 * 1000),
            httpOnly: true,
            secure: true,
            // maxAge: 3600000
        });
        res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// Logout
authRouter.post("/logout", async (req, res) => {
    try {
        res.clearCookie("token");
        req.user = null;
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

module.exports = { authRouter };