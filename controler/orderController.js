const Order = require("../models/orderModel");
const FreshFruit = require("../models/freshFruitModel");
const FreshBread = require("../models/freshBreadModel");
const FreshJuice = require("../models/freshJuiceModel");
const GreenVegtable = require("../models/greenvegtable");
const FreshTea = require("../models/freshteamodel");
const FreshDreadJuice = require("../models/freshDreadJuiceModel");

// ✅ Helper: map productType → correct model
const getProductModel = (type) => {
  const modelMap = {
    "FreshFruit": FreshFruit,
    "FreshBread": FreshBread,
    
    "GreenVegtable": GreenVegtable,
    "FreshTea": FreshTea,
    "FreshDreadJuice": FreshDreadJuice
  };
  
  return modelMap[type] || null;
};

/**
 * CREATE ORDER
 * - Validates items
 * - Subtracts quantity from stock
 * - Calculates subtotal & total
 */
exports.createOrder = async (req, res) => {
  try {
    const { customer, items, deliveryFee = 0, deliveryLocation = "" } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must have at least one item" });
    }

    console.log("Received order with items:", items); // Add logging

    let subtotal = 0;
    const orderItems = [];

    for (let item of items) {
      const Model = getProductModel(item.productType);
      if (!Model) {
        return res.status(400).json({ message: `Invalid product type: ${item.productType}` });
      }

      console.log(`Looking for ${item.productType} with ID: ${item.productId}`); // Add logging

      const product = await Model.findById(item.productId);
      if (!product) {
        // Log all available products of this type for debugging
        const allProducts = await Model.find({}, '_id name');
        console.log(`Available ${item.productType}s:`, allProducts);
        
        return res.status(404).json({ 
          message: `Product not found: ${item.productId} of type ${item.productType}` 
        });
      }

      // Check stock
      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      // Subtract ordered quantity from stock
      product.quantity -= item.quantity;
      await product.save();

      // Build order item
      orderItems.push({
        productId: product._id,
        productType: item.productType,
        name: product.name,
        img: product.img,
        price: Number(product.price),
        quantity: item.quantity,
        deliveryMethod: item.deliveryMethod || "pickup",
      });

      subtotal += Number(product.price) * item.quantity;
    }

    const total = subtotal + Number(deliveryFee);

    const newOrder = new Order({
      customer,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      deliveryLocation,
    });

    await newOrder.save();
    res.status(201).json(newOrder);

  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ GET ALL ORDERS
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ GET SINGLE ORDER
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ UPDATE ORDER (status or customer info)
exports.updateOrder = async (req, res) => {
  try {
    const { status, customer, deliveryLocation } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status) order.status = status;
    if (customer) order.customer = customer;
    if (deliveryLocation) order.deliveryLocation = deliveryLocation;

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ DELETE ORDER (does NOT restore stock)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};