const express = require('express');
const { 
  createSubmission, 
  getSubmissions, 
  getSubmission, 
  updateSubmissionStatus,
  getSubmissionStats,
  getPublicSubmissions,
  getNotifications,
  getCategories
} = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Protect all routes
router.use(protect);

// Submission routes
router.route('/')
  .post(upload.array('files'), createSubmission)
  .get(getSubmissions);

router.get('/stats', getSubmissionStats);
router.get('/public', getPublicSubmissions);
router.get('/notifications', getNotifications);
router.get('/categories', getCategories);

router.route('/:id')
  .get(getSubmission);

router.route('/:id/status')
  .put(authorize('admin', 'officer'), updateSubmissionStatus);

module.exports = router;
