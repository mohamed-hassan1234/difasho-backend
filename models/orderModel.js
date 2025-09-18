// models/orderModel.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true }, // just ObjectId
  productType: { type: String, required: true }, // e.g., "FreshFruit", "FreshBread", "FreshTea"
  name: { type: String, required: true },
  img: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  deliveryMethod: { type: String, enum: ["pickup", "delivery"], default: "pickup" }
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
     email: { type: String, required: true },
      phone: { type: String, required: true }
    },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    deliveryLocation: { type: String, default: "" },
    status: { type: String, enum: ["pending", "confirmed", "shipped", "delivered"], default: "pending" },
    orderDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
