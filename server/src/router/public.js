const express = require("express");
const publicRouter = express.Router();
const { User } = require("../models/user.js");
const validator = require("validator");
const { domainList } = require("../constants/domainList.js");

// Create User
publicRouter.post("/create-user", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(409).json({ message: "User already exists" });
        }
        res.status(400).json({ message: error.message });
    }
});

// Get all users
publicRouter.get("/get-users", async (req, res) => {
    try {
        const users = await User.find().select("-password -__v");
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get User by ID
publicRouter.get("/get-user/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password -__v");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update User by ID
publicRouter.put("/update-user/:id", async (req, res) => {
    try {
        const validDomain = domainList;
        const valid = req.body.email ? req.body.email.split('@')[1].toLowerCase() : null;
        if (valid && !validDomain.some(d => valid.endsWith(d))) {
            throw new Error("Invalid email domain");
        }
        if (req.body.email && !validator.isEmail(req.body.email)) {
            throw new Error("Invalid email format");
        }
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        if (error && error.code === 11000) {
            return res.status(409).json({ message: "Email already in use" });
        }
        res.status(400).json({ message: error.message });
    }
});

// Delete User
publicRouter.delete("/delete-user/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = { publicRouter };