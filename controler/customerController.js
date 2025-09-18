const Customer = require("../models/customer.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function: generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    const avatar = req.file ? req.file.filename : null;

    // check if email exists
    const existing = await Customer.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new Customer({
      name,
      phone,
      email,
      password: hashedPassword,
      avatar,
    });

    await newCustomer.save();

    // create token
    const token = generateToken(newCustomer._id);

    // save token in cookies
    res.cookie("token", token, { httpOnly: true, secure: false });

    res.status(201).json({ message: "Registered successfully", customer: newCustomer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(customer._id);
    res.cookie("token", token, { httpOnly: true, secure: false });

    res.json({ message: "Login successful", customer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).select("-password");
    if (!customer) return res.status(404).json({ message: "User not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE CUSTOMER
exports.updateCustomer = async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) updates.avatar = req.file.filename;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.json({ message: "Updated successfully", updatedCustomer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE CUSTOMER
exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
