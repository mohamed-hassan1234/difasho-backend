const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder
} = require("../controler/orderController");

// CRUD routes
router.post("/", createOrder);     // Create order
router.get("/", getOrders);        // Get all orders
router.get("/:id", getOrder);      // Get single order
router.put("/:id", updateOrder);   // Update order (status/customer/delivery)
router.delete("/:id", deleteOrder);// Delete order

module.exports = router;
