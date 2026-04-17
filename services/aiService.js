const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateAIResponse = async (prompt, mode) => {
  let systemPrompt = "";

  if (mode === "kids") {
    systemPrompt = "Explain in very simple words like a kid.";
  } else if (mode === "student") {
    systemPrompt = "Explain clearly with examples.";
  } else {
    systemPrompt = "Give detailed explanation like a teacher.";
  }

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
  });

  return response.choices[0].message.content;
};