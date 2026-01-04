const RecaptchaService = require('../services/RecaptchaService');
const { asyncHandler } = require('../utils/asyncHandler');

// @desc    Get reCAPTCHA service status
// @route   GET /api/v1/recaptcha/status
// @access  Public
const getRecaptchaStatus = asyncHandler(async (req, res) => {
  const status = RecaptchaService.getStatus();
  
  res.status(200).json({
    success: true,
    data: {
      enabled: status.enabled,
      configured: status.configured,
      environment: status.development ? 'development' : 'production'
    }
  });
});

module.exports = {
  getRecaptchaStatus
};