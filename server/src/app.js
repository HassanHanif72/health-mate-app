const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { connectDB } = require("./config/database");
const { authRouter } = require("./router/auth");
const { userDataRouter } = require("./router/userData");
const { publicRouter } = require("./router/public");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000', // frontend URL
    credentials: true
}));


app.use("/auth", authRouter);
app.use("/user", userDataRouter);
app.use("/public", publicRouter);

// Connect to MongoDB
connectDB();

// Server Port
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
})


