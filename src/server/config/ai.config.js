const AI_CONFIG = {
  model: "gemini-pro",
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_ONLY_HIGH",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_ONLY_HIGH",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_ONLY_HIGH",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_ONLY_HIGH",
    },
  ],
  generationConfig: {
    temperature: 0.9,
    topK: 40,
    topP: 0.9,
    maxOutputTokens: 4096,
  },
};

module.exports = AI_CONFIG;
