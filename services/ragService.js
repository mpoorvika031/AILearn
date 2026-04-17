const fs = require("fs");
const pdf = require("pdf-parse");
const { index, metadata } = require("../vectorstore/db");
const { getEmbedding } = require("./embeddingService");

// 📄 PROCESS DOCUMENT
exports.processDocument = async (fileId, filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);

    const text = (data.text || "").replace(/\s+/g, " ").trim();

    // chunking
    const chunks = text.match(/.{1,800}/g) || [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      const embedding = await getEmbedding(chunk);

      // add vector
      index.add(Float32Array.from(embedding));

      metadata.push({
        fileId,
        text: chunk
      });
    }

    console.log("✅ Vector DB stored:", fileId);
  } catch (err) {
    console.error("PROCESS ERROR:", err);
    throw err;
  }
};

// 🔍 SEMANTIC SEARCH
exports.searchDocument = async (fileId, query) => {
  try {
    const queryEmbedding = await getEmbedding(query);

    const k = 5;
    const result = index.search(Float32Array.from(queryEmbedding), k);

    const matchedTexts = [];

    for (let i = 0; i < result.labels.length; i++) {
      const idx = result.labels[i];

      if (metadata[idx]?.fileId === fileId) {
        matchedTexts.push(metadata[idx].text);
      }
    }

    return matchedTexts.length
      ? matchedTexts.join("\n\n")
      : "No relevant results found";

  } catch (err) {
    console.error("SEARCH ERROR:", err);
    return "Server error";
  }
};