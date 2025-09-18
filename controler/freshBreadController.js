const FreshBread = require("../models/freshBreadModel");
const fs = require("fs");
const path = require("path");

// Helper function to get full image path
const getImagePath = (filename) => path.join(__dirname, "../uploads", filename);

// CREATE
exports.createFreshBread = async (req, res) => {
  try {
    const { name, category, price, quantity, description, status } = req.body;
    const img = req.file?.filename;

    if (!img) return res.status(400).json({ message: "Image is required" });

    const freshBread = new FreshBread({
      name,
      category,
      price,
      quantity,
      description,
      status: status || "available",
      img
    });

    await freshBread.save();
    res.status(201).json(freshBread);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// READ ALL
exports.getAllFreshBreads = async (req, res) => {
  try {
    const breads = await FreshBread.find();
    res.status(200).json(breads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// READ SINGLE
exports.getFreshBreadById = async (req, res) => {
  try {
    const bread = await FreshBread.findById(req.params.id);
    if (!bread) return res.status(404).json({ message: "Fresh bread not found" });
    res.status(200).json(bread);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateFreshBread = async (req, res) => {
  try {
    const bread = await FreshBread.findById(req.params.id);
    if (!bread) return res.status(404).json({ message: "Fresh bread not found" });

    if (req.file && bread.img) {
      const imgPath = getImagePath(bread.img);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    bread.name = req.body.name || bread.name;
    bread.category = req.body.category || bread.category;
    bread.price = req.body.price || bread.price;
    bread.quantity = req.body.quantity || bread.quantity;
    bread.description = req.body.description || bread.description;
    bread.status = req.body.status || bread.status;
    bread.img = req.file?.filename || bread.img;

    await bread.save();
    res.status(200).json(bread);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deleteFreshBread = async (req, res) => {
  try {
    const bread = await FreshBread.findById(req.params.id);
    if (!bread) return res.status(404).json({ message: "Fresh bread not found" });

    if (bread.img) {
      const imgPath = getImagePath(bread.img);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await FreshBread.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Fresh bread deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
