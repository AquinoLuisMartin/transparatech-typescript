const { GoogleGenAI } = require("@google/genai");

class GenAIService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY not found in environment variables');
      this.ai = null;
      this.model = null;
      return;
    }

    try {
      this.ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
      this.model = this.ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    } catch (error) {
      console.error('Failed to initialize Google GenAI:', error);
      this.ai = null;
      this.model = null;
    }
  }

  async generateText(prompt) {
    if (!this.model) {
      throw new Error('GenAI service not properly initialized');
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('GenAI Error:', error);
      throw new Error('Failed to generate content');
    }
  }

  async generateTextWithHistory(chatHistory) {
    if (!this.model) {
      throw new Error('GenAI service not properly initialized');
    }

    try {
      const chat = this.model.startChat({
        history: chatHistory
      });

      return chat;
    } catch (error) {
      console.error('GenAI Chat Error:', error);
      throw new Error('Failed to start chat session');
    }
  }

  async analyzeText(text, analysisType = "general") {
    if (!this.model) {
      throw new Error('GenAI service not properly initialized');
    }

    try {
      const prompts = {
        general: `Please analyze the following text and provide insights: ${text}`,
        sentiment: `Analyze the sentiment of this text (positive, negative, neutral): ${text}`,
        summary: `Provide a concise summary of this text: ${text}`,
        keywords: `Extract the main keywords and topics from this text: ${text}`
      };

      const prompt = prompts[analysisType] || prompts.general;
      return await this.generateText(prompt);
    } catch (error) {
      console.error('Text Analysis Error:', error);
      throw new Error('Failed to analyze text');
    }
  }

  async generateResponse(userInput, context = "") {
    if (!this.model) {
      throw new Error('GenAI service not properly initialized');
    }

    try {
      const prompt = context 
        ? `Context: ${context}\n\nUser: ${userInput}\n\nPlease provide a helpful response:`
        : userInput;

      return await this.generateText(prompt);
    } catch (error) {
      console.error('Response Generation Error:', error);
      throw new Error('Failed to generate response');
    }
  }

  // Validate API key is configured
  isConfigured() {
    return !!this.model && !!process.env.GEMINI_API_KEY;
  }
}

module.exports = new GenAIService();