const { generateAIResponse } = require("../services/aiService");
const { searchDocument } = require("../services/ragService");

exports.handleChat = async (req, res) => {
  try {
    const { message, mode } = req.body;

    console.log("🔥 CHAT API HIT:", message);

    // 🔍 Get document context (RAG)
    const context = await searchDocument(message);

    console.log("📄 Context found:", context);

    // 🧠 Build prompt for AI
    const prompt = `
You are StudyGPT, an AI tutor.

Use ONLY the given context to answer.

Context:
${context}

User Question:
${message}

Rules:
- If answer is in context, explain clearly
- If not in context, say: "Not found in uploaded document"
- Keep response simple and helpful
`;

    // 🤖 Generate AI response
    const reply = await generateAIResponse(prompt, mode);

    res.json({ reply });

  } catch (err) {
    console.error("❌ Chat Error:", err);
    res.status(500).json({
      error: "Something went wrong in chat controller",
    });
  }
};