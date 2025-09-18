const express = require("express");
const router = express.Router();
const greenVegController = require("../controler/greenvegtable");

// CRUD routes
router.post("/", greenVegController.createGreenVeg);
router.get("/", greenVegController.getAllGreenVeg);
router.get("/:id", greenVegController.getGreenVegById);
router.put("/:id", greenVegController.updateGreenVeg);
router.delete("/:id", greenVegController.deleteGreenVeg);

module.exports = router;
