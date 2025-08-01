const express = require("express");
require("dotenv").config();
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

// Middleware
app.use(express.json());

app.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const user = await new User({ firstName, lastName, email, password });
        await user.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Connect to MongoDB
connectDB();

// Server Port
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
})


