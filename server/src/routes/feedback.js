const express = require('express');
const {
  submitFeedback,
  getFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  getCategories
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/categories', getCategories);

router
  .route('/')
  .post(submitFeedback)
  .get(authorize('admin', 'officer'), getFeedback);

router
  .route('/:id')
  .get(authorize('admin', 'officer'), getFeedbackById)
  .put(authorize('admin', 'officer'), updateFeedbackStatus);

module.exports = router;
