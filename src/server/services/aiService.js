const { GoogleGenerativeAI } = require("@google/generative-ai");
const AI_CONFIG = require("../config/ai.config");
const APP_CONFIG = require("../config/app.config");
require("dotenv").config();

class AIService {
  constructor() {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY environment variable is not set");
    }

    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    this.lastRequestTime = 0;
  }

  async generateWithRetry(prompt, maxAttempts = APP_CONFIG.book.maxAttempts) {
    let lastFewStarts = [];

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await this.handleRateLimit();

        console.log("API Key:", process.env.GOOGLE_API_KEY);
        console.log("Attempting to generate content...");

        const model = this.genAI.getGenerativeModel({
          model: AI_CONFIG.model,
          safetySettings: AI_CONFIG.safetySettings,
        });

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: AI_CONFIG.generationConfig,
        });

        console.log("Content generated successfully");

        const response = await result.response;

        if (result.response.promptFeedback?.blockReason) {
          throw new Error(
            `Response blocked: ${result.response.promptFeedback.blockReason}`
          );
        }

        const generatedText = response.text();
        const contentStart = generatedText
          .trim()
          .substring(0, 20)
          .toLowerCase();

        if (lastFewStarts.includes(contentStart)) {
          console.log("Benzer başlangıç tespit edildi, yeniden deneniyor...");
          continue;
        }

        if (generatedText.trim().startsWith("...")) {
          console.log(
            "Üç nokta ile başlayan içerik tespit edildi, yeniden deneniyor..."
          );
          continue;
        }

        lastFewStarts.push(contentStart);
        if (lastFewStarts.length > 5) lastFewStarts.shift();

        return generatedText;
      } catch (error) {
        console.error("AI Service Error:", error);

        if (attempt === maxAttempts - 1) {
          throw new Error(
            `AI generation failed after ${maxAttempts} attempts: ${error.message}`
          );
        }

        const waitTime = this.calculateWaitTime(error, attempt);
        console.log(
          `Attempt ${attempt + 1} failed, retrying in ${
            waitTime / 1000
          } seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  async generateText(prompt) {
    return this.generateWithRetry(prompt);
  }

  async handleRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < APP_CONFIG.rateLimit.minRequestInterval) {
      await new Promise((resolve) =>
        setTimeout(
          resolve,
          APP_CONFIG.rateLimit.minRequestInterval - timeSinceLastRequest
        )
      );
    }

    this.lastRequestTime = Date.now();
  }

  calculateWaitTime(error, attempt) {
    const baseWaitTime = 1000 * Math.pow(2, attempt);

    if (error.message.includes("blocked")) return 2000;
    if (error.status === 429) return Math.max(baseWaitTime, 5000);
    if (error.status === 503) return Math.max(baseWaitTime, 10000);

    return baseWaitTime;
  }
}

module.exports = new AIService();
