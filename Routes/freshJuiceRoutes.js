const express = require("express");
const router = express.Router();
const freshController = require("../controler/freshtea");
const multer = require("multer");
const path = require("path");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post("/", upload.single("img"), freshController.createFresh);
router.get("/", freshController.getAllFresh);
router.get("/:id", freshController.getFreshById);
router.put("/:id", upload.single("img"), freshController.updateFresh);
router.delete("/:id", freshController.deleteFresh);

module.exports = router;
