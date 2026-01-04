const express = require('express');
const {
  getDocuments,
  getDocument,
  getCategories
} = require('../controllers/documentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/categories', getCategories);

router
  .route('/')
  .get(getDocuments);

router
  .route('/:id')
  .get(getDocument);

module.exports = router;
