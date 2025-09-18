const GreenVegtable = require("../models/greenvegtable");
const multer = require("multer");
const path = require("path");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // upload folder
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);
  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("img"); // field name "img"

// CREATE
exports.createGreenVeg = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err });
    try {
      const { name, category, price, quantity, description } = req.body;
      const img = req.file ? req.file.filename : null;

      const newVeg = new GreenVegtable({
        name,
        category,
        price,
        quantity,
        description,
        img,
      });

      const savedVeg = await newVeg.save();
      res.status(201).json(savedVeg);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// READ ALL
exports.getAllGreenVeg = async (req, res) => {
  try {
    const vegs = await GreenVegtable.find();
    res.json(vegs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ONE
exports.getGreenVegById = async (req, res) => {
  try {
    const veg = await GreenVegtable.findById(req.params.id);
    if (!veg) return res.status(404).json({ message: "Not found" });
    res.json(veg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateGreenVeg = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err });
    try {
      const updateData = { ...req.body };
      if (req.file) updateData.img = req.file.filename;

      const updatedVeg = await GreenVegtable.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedVeg) return res.status(404).json({ message: "Not found" });
      res.json(updatedVeg);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// DELETE
exports.deleteGreenVeg = async (req, res) => {
  try {
    const deletedVeg = await GreenVegtable.findByIdAndDelete(req.params.id);
    if (!deletedVeg) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
