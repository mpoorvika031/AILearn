const faiss = require("faiss-node");

// 1536 = OpenAI embedding dimension (text-embedding-3-small)
const dimension = 1536;

// Create index (L2 distance)
const index = new faiss.IndexFlatL2(dimension);

// Store metadata separately
const metadata = [];

module.exports = {
  index,
  metadata
};