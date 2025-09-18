const express = require("express");
const router = express.Router();
const { register, login, getProfile, updateCustomer, deleteCustomer, logout } = require("../controler/customerController");
const { protect } = require("../Middleware/auth");
const multer = require("multer");
const path = require("path");

// For update avatar only
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
router.post("/register", register); // 👈 no multer here
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/:id", protect, upload.single("avatar"), updateCustomer); // only here avatar
router.delete("/:id", protect, deleteCustomer);
router.post("/logout", logout);

module.exports = router;
