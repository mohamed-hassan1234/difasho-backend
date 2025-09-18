const Fresh = require("../models/freshteamodel");
const fs = require("fs");
const path = require("path");

// CREATE
const createFresh = async (req, res) => {
  try {
    const { name, category, price, quantity, description } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const freshItem = new Fresh({
      name,
      category,
      price,
      quantity,
      description,
      img: req.file.filename,
    });

    await freshItem.save();
    res.status(201).json(freshItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ALL
const getAllFresh = async (req, res) => {
  try {
    const items = await Fresh.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ BY ID
const getFreshById = async (req, res) => {
  try {
    const item = await Fresh.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
const updateFresh = async (req, res) => {
  try {
    const item = await Fresh.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const { name, category, price, quantity, description } = req.body;

    if (req.file) {
      const oldImage = path.join(__dirname, "../uploads", item.img);
      if (fs.existsSync(oldImage)) fs.unlinkSync(oldImage);
      item.img = req.file.filename;
    }

    item.name = name || item.name;
    item.category = category || item.category;
    item.price = price || item.price;
    item.quantity = quantity || item.quantity;
    item.description = description || item.description;

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
const deleteFresh = async (req, res) => {
  try {
    const item = await Fresh.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.img) {
      const filePath = path.join(__dirname, "../uploads", item.img);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await item.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createFresh,
  getAllFresh,
  getFreshById,
  updateFresh,
  deleteFresh,
};
