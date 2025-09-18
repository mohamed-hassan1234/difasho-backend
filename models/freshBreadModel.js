const mongoose = require("mongoose");

const freshBreadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // New field
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  img: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["available", "outOfStock"], default: "available" }
});

module.exports = mongoose.model("FreshBread", freshBreadSchema);
