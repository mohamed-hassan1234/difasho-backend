const express = require("express");
const router = express.Router();
const FreshFruit = require("../models/freshFruitModel");
const GreenVegetable = require("../models/greenvegtable");
const FreshTea = require("../models/freshteamodel");
const FreshDreadJuice = require("../models/freshDreadJuiceModel");
const FreshBread = require("../models/freshBreadModel");
const Order = require("../models/Order");

// Helper function to calculate category totals
const calculateCategory = (products) => {
  let totalQuantity = 0;
  let totalValue = 0;
  const items = products.map(p => {
    const total = p.quantity * parseFloat(p.price);
    totalQuantity += p.quantity;
    totalValue += total;
    return {
      name: p.name,
      price: parseFloat(p.price),
      quantity: p.quantity,
      total
    };
  });

  return { items, totalQuantity, totalValue };
};

// Dashboard endpoint
router.get("/", async (req, res) => {
  try {
    const fruits = await FreshFruit.find({});
    const vegs = await GreenVegetable.find({});
    const teas = await FreshTea.find({});
    const dreadJuices = await FreshDreadJuice.find({});
    const breads = await FreshBread.find({});

    const categories = {
      fruits: calculateCategory(fruits),
      vegetables: calculateCategory(vegs),
      teas: calculateCategory(teas),
      dreadJuices: calculateCategory(dreadJuices),
      breads: calculateCategory(breads)
    };

    // Calculate overall totals
    const totalItems = Object.values(categories).reduce((acc, cat) => acc + cat.totalQuantity, 0);
    const totalStockValue = Object.values(categories).reduce((acc, cat) => acc + cat.totalValue, 0);

    // Low stock alerts (any product <5)
    const lowStock = [];
    Object.values(categories).forEach(cat => {
      cat.items.forEach(item => {
        if (item.quantity < 5) {
          lowStock.push({
            name: item.name,
            quantity: item.quantity,
            message: `Out of stock, only ${item.quantity} left`
          });
        }
      });
    });

    // Total revenue from orders
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

    res.json({
      categories,
      totalItems,
      totalStockValue,
      lowStock,
      totalRevenue
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
