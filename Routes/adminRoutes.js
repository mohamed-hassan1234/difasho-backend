// admin.routes.js (corrected)
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const adminAuth = require("../Middleware/adminAuth");

const router = express.Router();

// Helper: generate JWT token
const generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id, role: "admin" },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "1d" }
  );
};

// Register - Admin - FIXED: Don't return token
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, secretKey, avatar } = req.body;

    // Map "name" to "username" for the model
    const username = name;

    if (!username || !email || !password || !secretKey) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if secretKey matches environment variable
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: "Email already exists" });

    const admin = new Admin({ username, email, password, secretKey, avatar });
    await admin.save();

    // CRITICAL: Don't generate or return a token here
    // Registration should not automatically log the admin in
    res.status(201).json({
      message: "Admin registered successfully. Please login.",
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        avatar: admin.avatar,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(admin);

    // Update last activity
    admin.lastActivity = new Date();
    await admin.save();

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        avatar: admin.avatar,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Fetch Admin Profile
router.get("/profile", adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password -secretKey");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching profile" });
  }
});

// Update Admin Profile
router.put("/update", adminAuth, async (req, res) => {
  try {
    const { username, email, avatar } = req.body;
    
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (avatar) updateData.avatar = avatar;
    
    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password -secretKey");
    
    res.json({
      message: "Profile updated successfully",
      admin,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error updating profile" });
  }
});

// Delete Admin Account
router.delete("/delete", adminAuth, async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.admin.id);
    res.json({ message: "Admin account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting account" });
  }
});

// Update Last Activity
router.put("/last-activity", adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      { lastActivity: new Date() },
      { new: true }
    );
    res.json({ message: "Last activity updated", lastActivity: admin.lastActivity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating last activity" });
  }
});

// Admin Logout
router.post("/logout", adminAuth, (req, res) => {
  res.json({ message: "Logged out successfully" });
});

module.exports = router;