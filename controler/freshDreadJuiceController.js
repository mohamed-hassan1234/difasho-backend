const FreshDreadJuice = require("../models/freshDreadJuiceModel");
const fs = require("fs");
const path = require("path");

// CREATE
exports.createFreshDreadJuice = async (req, res) => {
  try {
    const { name, price, quantity, category, description } = req.body;
    const img = req.file ? req.file.filename : null;

    if (!img) return res.status(400).json({ message: "Image is required" });

    const newJuice = new FreshDreadJuice({ name, price, quantity, category, description, img });
    const savedJuice = await newJuice.save();
    res.status(201).json(savedJuice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ALL
exports.getAllFreshDreadJuices = async (req, res) => {
  try {
    const juices = await FreshDreadJuice.find();
    res.status(200).json(juices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ SINGLE
exports.getFreshDreadJuiceById = async (req, res) => {
  try {
    const juice = await FreshDreadJuice.findById(req.params.id);
    if (!juice) return res.status(404).json({ message: "Juice not found" });
    res.status(200).json(juice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateFreshDreadJuice = async (req, res) => {
  try {
    const { name, price, quantity, category, description, status } = req.body;
    const juice = await FreshDreadJuice.findById(req.params.id);
    if (!juice) return res.status(404).json({ message: "Juice not found" });

    if (req.file) {
      // delete old image
      if (juice.img && fs.existsSync(path.join(__dirname, "../uploads/", juice.img))) {
        fs.unlinkSync(path.join(__dirname, "../uploads/", juice.img));
      }
      juice.img = req.file.filename;
    }

    juice.name = name || juice.name;
    juice.price = price || juice.price;
    juice.quantity = quantity || juice.quantity;
    juice.category = category || juice.category;
    juice.description = description || juice.description;
    juice.status = status || juice.status;

    const updatedJuice = await juice.save();
    res.status(200).json(updatedJuice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deleteFreshDreadJuice = async (req, res) => {
  try {
    const juice = await FreshDreadJuice.findById(req.params.id);
    if (!juice) return res.status(404).json({ message: "Juice not found" });

    if (juice.img && fs.existsSync(path.join(__dirname, "../uploads/", juice.img))) {
      fs.unlinkSync(path.join(__dirname, "../uploads/", juice.img));
    }

    await juice.deleteOne();
    res.status(200).json({ message: "Juice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
