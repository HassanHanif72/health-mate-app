const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
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
        validate: {
            validator: function (value) {
                return validator.isStrongPassword(value);
            },
            message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character",
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const User = mongoose.model("students", userSchema);

module.exports = User;