const mongoose = require("mongoose");

const greenvegtableschema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // NEW field
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }, // stock in DB
  img: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "Available" } // Available / Out of Stock
});

// Auto set status
greenvegtableschema.pre("save", function (next) {
  this.status = this.quantity > 0 ? "Available" : "Out of Stock";
  next();
});

greenvegtableschema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.quantity !== undefined) {
    update.status = update.quantity > 0 ? "Available" : "Out of Stock";
  }
  next();
});

module.exports = mongoose.model("GreenVegtable", greenvegtableschema);
