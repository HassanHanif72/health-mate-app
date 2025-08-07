const express = require("express");
const userDataRouter = express.Router();
const { User } = require("../models/user");
const { authMiddleware } = require("../middleware/auth");


userDataRouter.get("/user-data", authMiddleware, async (req, res) => {
    try {
        const students = await User.findById(req.user._id).select("-password -__v");
        // const students = await User.findById(req.user._id);
        // const { password, ...userData } = students.toObject();
        // res.status(200).json(userData);
        res.status(200).json(students);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

module.exports = { userDataRouter };