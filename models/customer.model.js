const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String }, // store uploaded image filename
  password: { type: String, required: true },
}, { timestamps: true });

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
