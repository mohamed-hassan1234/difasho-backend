// server/models/user.model.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 15
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String, // This will store the image URL or base64 string
    default: null
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
