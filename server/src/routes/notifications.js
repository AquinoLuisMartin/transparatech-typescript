const express = require('express');
const { getLatestNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/latest', getLatestNotification);

module.exports = router;
