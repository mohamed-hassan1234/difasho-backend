const FreshFruit = require("../models/freshFruitModel"); // ✅ no destructuring
const fs = require("fs");
const path = require("path");

// CREATE
exports.createFreshFruit = async (req, res) => {
  try {
    const { name, category, price, quantity, description } = req.body;
    const img = req.file ? req.file.filename : null;

    if (!img) return res.status(400).json({ message: "Image is required" });

    const freshFruit = new FreshFruit({ name, category, price, quantity, description, img });
    await freshFruit.save();
    res.status(201).json(freshFruit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ALL
exports.getAllFreshFruits = async (req, res) => {
  try {
    const fruits = await FreshFruit.find();
    res.status(200).json(fruits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ SINGLE
exports.getFreshFruitById = async (req, res) => {
  try {
    const fruit = await FreshFruit.findById(req.params.id);
    if (!fruit) return res.status(404).json({ message: "Fruit not found" });
    res.status(200).json(fruit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateFreshFruit = async (req, res) => {
  try {
    const { name, category, price, quantity, description, status } = req.body;
    const fruit = await FreshFruit.findById(req.params.id);
    if (!fruit) return res.status(404).json({ message: "Fruit not found" });

    if (req.file) {
      const oldImage = path.join(__dirname, "../uploads/", fruit.img);
      if (fs.existsSync(oldImage)) fs.unlinkSync(oldImage);
      fruit.img = req.file.filename;
    }

    fruit.name = name || fruit.name;
    fruit.category = category || fruit.category;
    fruit.price = price || fruit.price;
    fruit.quantity = quantity || fruit.quantity;
    fruit.description = description || fruit.description;
    fruit.status = status || fruit.status;

    await fruit.save();
    res.status(200).json(fruit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deleteFreshFruit = async (req, res) => {
  try {
    const fruit = await FreshFruit.findById(req.params.id);
    if (!fruit) return res.status(404).json({ message: "Fruit not found" });

    const imagePath = path.join(__dirname, "../uploads/", fruit.img);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await fruit.deleteOne();
    res.status(200).json({ message: "Fruit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
