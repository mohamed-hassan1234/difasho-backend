const express = require("express");
const router = express.Router();
// const { upload } = require("../models/freshFruitModel");
const upload = require("../Middleware/upload")
const freshFruitController = require("../controler/freshFruitController");

// CREATE
router.post("/", upload.single("img"), freshFruitController.createFreshFruit);

// READ ALL
router.get("/", freshFruitController.getAllFreshFruits);

// READ SINGLE
router.get("/:id", freshFruitController.getFreshFruitById);

// UPDATE
router.put("/:id", upload.single("img"), freshFruitController.updateFreshFruit);

// DELETE
router.delete("/:id", freshFruitController.deleteFreshFruit);

module.exports = router;
