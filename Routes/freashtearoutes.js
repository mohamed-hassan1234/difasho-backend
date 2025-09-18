const express = require("express");
const router = express.Router();
const freshController = require("../controler/freshtea");
const multer = require("multer");
const path = require("path");
const upload = require("../Middleware/upload")
// Multer config


// Routes
router.post("/", upload.single("img"), freshController.createFresh);
router.get("/", freshController.getAllFresh);
router.get("/:id", freshController.getFreshById);
router.put("/:id", upload.single("img"), freshController.updateFresh);
router.delete("/:id", freshController.deleteFresh);

module.exports = router;
