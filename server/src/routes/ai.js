const express = require('express');
const {
  generateText,
  analyzeText,
  chatResponse,
  getAIStatus,
  analyzeSubmission
} = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All AI routes require authentication
router.use(protect);

// AI endpoints
router.get('/status', getAIStatus);
router.post('/generate', generateText);
router.post('/analyze', analyzeText);
router.post('/chat', chatResponse);
router.post('/analyze-submission/:id', analyzeSubmission);

module.exports = router;