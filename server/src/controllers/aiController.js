const GenAIService = require('../services/GenAIService');
const { asyncHandler } = require('../utils/asyncHandler');

// @desc    Generate text using AI
// @route   POST /api/v1/ai/generate
// @access  Private
const generateText = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: 'Prompt is required'
    });
  }

  if (!GenAIService.isConfigured()) {
    return res.status(500).json({
      success: false,
      message: 'AI service is not properly configured'
    });
  }

  try {
    const response = await GenAIService.generateText(prompt);

    res.status(200).json({
      success: true,
      data: {
        prompt,
        response,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate content',
      error: error.message
    });
  }
});

// @desc    Analyze text using AI
// @route   POST /api/v1/ai/analyze
// @access  Private
const analyzeText = asyncHandler(async (req, res) => {
  const { text, analysisType = 'general' } = req.body;

  if (!text) {
    return res.status(400).json({
      success: false,
      message: 'Text is required for analysis'
    });
  }

  if (!GenAIService.isConfigured()) {
    return res.status(500).json({
      success: false,
      message: 'AI service is not properly configured'
    });
  }

  try {
    const analysis = await GenAIService.analyzeText(text, analysisType);

    res.status(200).json({
      success: true,
      data: {
        text,
        analysisType,
        analysis,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to analyze text',
      error: error.message
    });
  }
});

// @desc    Generate response with context
// @route   POST /api/v1/ai/chat
// @access  Private
const chatResponse = asyncHandler(async (req, res) => {
  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Message is required'
    });
  }

  if (!GenAIService.isConfigured()) {
    return res.status(500).json({
      success: false,
      message: 'AI service is not properly configured'
    });
  }

  try {
    const response = await GenAIService.generateResponse(message, context);

    res.status(200).json({
      success: true,
      data: {
        userMessage: message,
        context,
        aiResponse: response,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate response',
      error: error.message
    });
  }
});

// @desc    Check AI service status
// @route   GET /api/v1/ai/status
// @access  Private
const getAIStatus = asyncHandler(async (req, res) => {
  const isConfigured = GenAIService.isConfigured();

  res.status(200).json({
    success: true,
    data: {
      isConfigured,
      model: 'gemini-1.5-flash',
      status: isConfigured ? 'ready' : 'not_configured',
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = {
  generateText,
  analyzeText,
  chatResponse,
  getAIStatus
};