const express = require("express");
const router = express.Router();
const freshBreadController = require("../controler/freshBreadController");
const upload = require("../middleware/upload");

// CREATE
router.post("/", upload.single("img"), freshBreadController.createFreshBread);

// READ ALL
router.get("/", freshBreadController.getAllFreshBreads);

// READ SINGLE
router.get("/:id", freshBreadController.getFreshBreadById);

// UPDATE
router.put("/:id", upload.single("img"), freshBreadController.updateFreshBread);

// DELETE
router.delete("/:id", freshBreadController.deleteFreshBread);

module.exports = router;
