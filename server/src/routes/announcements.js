const express = require('express');
const {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getCategories
} = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/categories', getCategories);

router
  .route('/')
  .get(getAnnouncements)
  .post(authorize('admin', 'officer'), createAnnouncement);

router
  .route('/:id')
  .get(getAnnouncement)
  .put(authorize('admin', 'officer'), updateAnnouncement)
  .delete(authorize('admin'), deleteAnnouncement);

module.exports = router;
