const Order = require("../models/Order");
const FreshFruit = require("../models/freshFruitModel");
const GreenVegetable = require("../models/greenvegtable");
const FreshTea = require("../models/freshteamodel");
const FreshDreadJuice = require("../models/freshDreadJuiceModel");
const FreshBread = require("../models/freshBreadModel");

const modelsMap = {
  FreshFruit,
  GreenVegetable,
  FreshTea,
  FreshDreadJuice,
  FreshBread,
};

const createOrder = async (req, res) => {
  try {
    const { customer, items, deliveryLocation } = req.body;
    let subtotal = 0;
    let deliveryFee = 0;

    for (const item of items) {
      const Model = modelsMap[item.productType];
      if (!Model) return res.status(400).json({ message: `Invalid product type: ${item.productType}` });

      const product = await Model.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.name}` });

      if (product.quantity < item.quantity)
        return res.status(400).json({ message: `Not enough stock for ${item.name}` });

      product.quantity -= item.quantity;
      await product.save();

      subtotal += item.price * item.quantity;
      if (item.deliveryMethod === "delivery") deliveryFee += 2;
    }

    const total = subtotal + deliveryFee;

    const order = new Order({ customer, items, subtotal, deliveryFee, total, deliveryLocation });
    await order.save();

    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating order", error: err.message });
  }
};




// ✅ Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};

// ✅ Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order", error: err.message });
  }
};

// ✅ Update order (example: update status)
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order updated successfully", order });
  } catch (err) {
    res.status(500).json({ message: "Error updating order", error: err.message });
  }
};

// ✅ Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting order", error: err.message });
  }
};

// ✅ Get orders for a specific user
const getUserOrders = async (req, res) => {
  try {
    const userEmail = req.params.email; // You can also use user ID if available

    const orders = await Order.find({ "customer.email": userEmail }).sort({ createdAt: -1 });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user orders", error: err.message });
  }
};



module.exports = {
  createOrder,
  getUserOrders,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
