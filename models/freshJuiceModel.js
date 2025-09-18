const mongoose = require("mongoose");

const freshJuiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // new field
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  img: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["Available", "Out of Stock"],
    default: "Available"
  }
});

// middleware: update status based on quantity
freshJuiceSchema.pre("save", function (next) {
  this.status = this.quantity > 0 ? "Available" : "Out of Stock";
  next();
});

module.exports = mongoose.model("FreshJuice", freshJuiceSchema);
