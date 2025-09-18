const mongoose = require("mongoose");

const freshFruitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  img: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Available", "Out of Stock"], 
    default: "Available" 
  },
}, { timestamps: true });

// Auto update status on save
freshFruitSchema.pre("save", function (next) {
  this.status = this.quantity > 0 ? "Available" : "Out of Stock";
  next();
});

module.exports = mongoose.model("FreshFruit", freshFruitSchema);
