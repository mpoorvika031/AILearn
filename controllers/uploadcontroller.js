const fs = require("fs");
const path = require("path");
const { processDocument } = require("../services/ragService");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    // ✅ FIX: proper fileId
    const fileId = path.basename(filePath);

    console.log("📂 File received:", filePath);

    // IMPORTANT: must await
    await processDocument(fileId, filePath);

    fs.unlink(filePath, () => {});

    res.json({
      message: "File uploaded successfully",
      fileId: fileId
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({
      error: "Upload failed",
      details: err.message
    });
  }
};