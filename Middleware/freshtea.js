// it is the multer of fresh tea and createit   server and make the folder images
const multer = require("multer");
const path = require("path");

// Storage engine for fresh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/fresh/"); // folder gaar ah fresh
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// File filter
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb("Error: Only images are allowed!");
  }
}

const freshtea = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = freshtea;
