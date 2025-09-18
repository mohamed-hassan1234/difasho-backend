const express = require("express");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getUserOrders 
} = require("../controler/order.Controller");

const router = express.Router();

// ✅ CRUD routes
router.post("/", createOrder);     // Create order
router.get("/", getOrders);        // Get all orders
router.get("/:id", getOrderById);  // Get order by ID
router.put("/:id", updateOrder);   // Update order
router.delete("/:id", deleteOrder); // Delete order
router.get("/user/:email", getUserOrders);
module.exports = router;
