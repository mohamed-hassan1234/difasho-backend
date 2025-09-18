const express = require("express");
const router = express.Router();
const upload = require("../models/upload");
const freshDreadJuiceController = require("../controler/freshDreadJuiceController");

// CRUD routes
router.post("/", upload.single("img"), freshDreadJuiceController.createFreshDreadJuice);
router.get("/", freshDreadJuiceController.getAllFreshDreadJuices);
router.get("/:id", freshDreadJuiceController.getFreshDreadJuiceById);
router.put("/:id", upload.single("img"), freshDreadJuiceController.updateFreshDreadJuice);
router.delete("/:id", freshDreadJuiceController.deleteFreshDreadJuice);

module.exports = router;
