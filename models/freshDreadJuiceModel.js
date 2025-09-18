const mongoose = require("mongoose");

const freshDreadJuiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  img: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["available", "out of stock"], 
    default: "available" 
  }
}, { timestamps: true });

// Add pre-save hook
freshDreadJuiceSchema.pre("save", function (next) {
  this.status = this.quantity > 0 ? "available" : "out of stock";
  next();
});

module.exports = mongoose.model("FreshDreadJuice", freshDreadJuiceSchema);