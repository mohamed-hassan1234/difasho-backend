const FreshJuice = require("../models/freshJuiceModel");
const fs = require("fs");
const path = require("path");

// CREATE
exports.createFreshJuice = async (req, res) => {
  try {
    const { name, category, price, quantity, description } = req.body;
    const img = req.file ? req.file.filename : null;
    if (!img) return res.status(400).json({ message: "Image is required" });

    const newJuice = new FreshJuice({ name, category, price, quantity, description, img });
    await newJuice.save();
    res.status(201).json(newJuice);
  } catch (err) {
    console.error("Create error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// READ ALL
exports.getAllFreshJuices = async (req, res) => {
  try {
    const juices = await FreshJuice.find();
    res.json(juices);
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// READ BY ID
exports.getFreshJuiceById = async (req, res) => {
  try {
    const juice = await FreshJuice.findById(req.params.id);
    if (!juice) return res.status(404).json({ message: "Not found" });
    res.json(juice);
  } catch (err) {
    console.error("Get by ID error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateFreshJuice = async (req, res) => {
  try {
    const juice = await FreshJuice.findById(req.params.id);
    if (!juice) return res.status(404).json({ message: "Not found" });

    const { name, category, price, quantity, description } = req.body;
    if (req.file) {
      // remove old image
      const oldImage = path.join(__dirname, "../uploads", juice.img);
      if (fs.existsSync(oldImage)) fs.unlinkSync(oldImage);
      juice.img = req.file.filename;
    }

    juice.name = name || juice.name;
    juice.category = category || juice.category;
    juice.price = price || juice.price;
    juice.quantity = quantity || juice.quantity;
    juice.description = description || juice.description;

    await juice.save();
    res.json(juice);
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteFreshJuice = async (req, res) => {
  try {
    const juice = await FreshJuice.findById(req.params.id);
    if (!juice) return res.status(404).json({ message: "Not found" });

    // delete image
    const imagePath = path.join(__dirname, "../uploads", juice.img);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await juice.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
