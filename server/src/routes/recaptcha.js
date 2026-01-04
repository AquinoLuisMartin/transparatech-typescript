const express = require('express');
const { getRecaptchaStatus } = require('../controllers/recaptchaController');

const router = express.Router();

router.get('/status', getRecaptchaStatus);

module.exports = router;