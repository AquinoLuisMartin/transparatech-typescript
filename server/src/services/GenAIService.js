const { GoogleGenerativeAI } = require("@google/generative-ai");

class GenAIService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY not found in environment variables');
      this.ai = null;
      this.model = null;
      return;
    }

    try {
      this.ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      // Using gemini-3-flash-preview as requested
      this.modelName = "gemini-3-flash-preview";
      this.model = this.ai.getGenerativeModel({ model: this.modelName });
      console.log(`GenAI Service initialized with model: ${this.modelName}`);
    } catch (error) {
      console.error('Failed to initialize Google GenAI:', error);
      this.ai = null;
      this.model = null;
    }
  }

  async _retryOperation(operation, maxRetries = 3, delay = 2000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (error.message.includes('429') || error.status === 429) {
          if (i === maxRetries - 1) throw error;
          console.log(`Rate limited (${this.modelName}). Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        } else {
          throw error;
        }
      }
    }
  }

  async generateText(prompt) {
    if (!this.model) {
      throw new Error('GenAI service not properly initialized');
    }

    try {
      const result = await this._retryOperation(() => this.model.generateContent(prompt));
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('GenAI Error:', error);
      if (error.message.includes('429')) {
        throw new Error('AI Model is currently busy (Rate Limit). Please try again in a moment.');
      }
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