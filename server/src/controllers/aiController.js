const GenAIService = require('../services/GenAIService');
const SubmissionService = require('../services/SubmissionService');
const { asyncHandler } = require('../utils/asyncHandler');
const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

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
    console.error('Chat API Error:', error);
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
      model: 'gemini-3-flash-preview',
      status: isConfigured ? 'ready' : 'not_configured',
      timestamp: new Date().toISOString()
    }
  });
});

// @desc    Analyze submission file
// @route   POST /api/v1/ai/analyze-submission/:id
// @access  Private
const analyzeSubmission = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Get submission
  const submission = await SubmissionService.findById(id);
  if (!submission) {
    return res.status(404).json({ success: false, message: 'Submission not found' });
  }

  if (!submission.files || submission.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files found in submission' });
  }

  // 2. Read file content
  const filename = submission.files[0]; // Analyze the first file
  const filePath = path.join(__dirname, '../../uploads', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'File not found on server' });
  }

  let textContent = '';
  const ext = path.extname(filename).toLowerCase();

  try {
    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const parser = new PDFParse({ data: dataBuffer });
      const data = await parser.getText();
      textContent = data.text;
    } else if (['.txt', '.md', '.csv'].includes(ext)) {
      textContent = fs.readFileSync(filePath, 'utf8');
    } else {
      return res.status(400).json({ success: false, message: 'Unsupported file type for analysis. Only PDF and text files are supported.' });
    }
  } catch (err) {
    console.error('Error reading file:', err);
    return res.status(500).json({ success: false, message: 'Failed to read file content' });
  }

  // 3. Truncate text to avoid token limits (approx 10k chars ~ 2.5k tokens)
  const truncatedText = textContent.substring(0, 10000);

  // 4. Generate feedback
  const prompt = `
    Analyze the following financial document content and provide a concise feedback report for officers and admins.
    Focus on:
    1. Key financial figures mentioned.
    2. Any potential irregularities or missing information.
    3. Overall clarity and compliance.
    
    Keep the response under 300 words.
    
    Document Content:
    ${truncatedText}
  `;

  try {
    const feedback = await GenAIService.generateText(prompt);

    // 5. Save feedback
    await SubmissionService.updateAIFeedback(id, feedback);

    res.status(200).json({
      success: true,
      data: {
        submissionId: id,
        feedback
      }
    });
  } catch (error) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate AI analysis' });
  }
});

module.exports = {
  generateText,
  analyzeText,
  chatResponse,
  getAIStatus,
  analyzeSubmission
};