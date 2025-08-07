const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const userSchema = new Schema({
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

module.exports = { User };