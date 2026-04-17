const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadFile } = require("../controllers/uploadController");

// 📁 store uploaded files
const upload = multer({ dest: "uploads/" });

// ✅ IMPORTANT ROUTE
router.post("/", upload.single("file"), uploadFile);

module.exports = router;