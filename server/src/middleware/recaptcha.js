const RecaptchaService = require('../services/RecaptchaService');
const { asyncHandler } = require('../utils/asyncHandler');
const logger = require('../utils/secureLogger');

/**
 * Middleware to verify reCAPTCHA v3 token
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Minimum score threshold (0.0 - 1.0)
 * @param {string} options.action - Expected action name
 * @param {boolean} options.required - Whether reCAPTCHA is required (default: true)
 */
const verifyRecaptcha = (options = {}) => {
  const {
    threshold = 0.5,
    action = null,
    required = true
  } = options;

  return asyncHandler(async (req, res, next) => {
    try {
      const { recaptchaToken } = req.body;
      const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];

      // Check if reCAPTCHA service is configured
      if (!RecaptchaService.isConfigured() && required) {
        logger.warn('reCAPTCHA verification skipped - service not configured', {
          endpoint: req.path,
          ip: clientIp
        }, 'SECURITY');
        
        // In development, continue without reCAPTCHA
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Development mode - reCAPTCHA verification bypassed', null, 'SECURITY');
          return next();
        }
        
        return res.status(500).json({
          success: false,
          message: 'Security verification not configured'
        });
      }

      // Skip if not required and not configured
      if (!required && !RecaptchaService.isConfigured()) {
        logger.debug('reCAPTCHA verification skipped - not required', null, 'SECURITY');
        return next();
      }

      // Handle demo bypass token first
      if (recaptchaToken === 'demo_bypass_token' && process.env.NODE_ENV === 'development') {
        console.log('✅ Demo bypass token detected - allowing request in development mode');
        logger.info('Demo bypass token used - allowing request in development mode', {
          endpoint: req.path,
          ip: clientIp
        }, 'SECURITY');
        
        req.recaptchaVerification = {
          success: true,
          score: 1.0,
          action: 'demo_bypass',
          challenge_ts: new Date().toISOString(),
          hostname: 'localhost',
          bypassed: true
        };
        
        return next();
      }

      // Check for reCAPTCHA token
      if (!recaptchaToken && required) {
        logger.warn('reCAPTCHA token missing', {
          endpoint: req.path,
          ip: clientIp
        }, 'SECURITY');
        
        return res.status(400).json({
          success: false,
          message: 'Security verification required'
        });
      }

      // Skip verification if no token provided and not required
      if (!recaptchaToken && !required) {
        logger.debug('reCAPTCHA token not provided - verification skipped', null, 'SECURITY');
        return next();
      }

      // Verify reCAPTCHA token
      logger.debug('Verifying reCAPTCHA token', {
        action,
        threshold,
        endpoint: req.path,
        ip: clientIp
      }, 'SECURITY');

      const verification = await RecaptchaService.verifyWithScore(
        recaptchaToken,
        threshold,
        action,
        clientIp
      );

      // Log verification result
      logger.info('reCAPTCHA verification completed', {
        success: verification.success,
        score: verification.score,
        scoreCheck: verification.scoreCheck,
        actionCheck: verification.actionCheck,
        action: verification.action,
        expectedAction: verification.expectedAction,
        threshold,
        bypassed: verification.bypassed || false,
        endpoint: req.path,
        ip: clientIp
      }, 'SECURITY');

      // Check verification result
      if (!verification.success) {
        logger.warn('reCAPTCHA verification failed', {
          errors: verification.errors,
          endpoint: req.path,
          ip: clientIp
        }, 'SECURITY');
        
        return res.status(400).json({
          success: false,
          message: 'Security verification failed'
        });
      }

      // Check score threshold (reCAPTCHA v3)
      if (verification.score !== null && !verification.scoreCheck) {
        logger.warn('reCAPTCHA score below threshold', {
          score: verification.score,
          threshold,
          endpoint: req.path,
          ip: clientIp
        }, 'SECURITY');
        
        return res.status(400).json({
          success: false,
          message: 'Security verification failed - suspicious activity detected'
        });
      }

      // Check action name (reCAPTCHA v3)
      // Only check if action is present in response (v3)
      if (action && verification.action && !verification.actionCheck) {
        logger.warn('reCAPTCHA action mismatch', {
          expected: action,
          received: verification.action,
          endpoint: req.path,
          ip: clientIp
        }, 'SECURITY');
        
        return res.status(400).json({
          success: false,
          message: 'Security verification failed - invalid request'
        });
      }

      // Add verification result to request for downstream use
      req.recaptchaVerification = verification;

      logger.info('reCAPTCHA verification successful', {
        score: verification.score,
        action: verification.action,
        endpoint: req.path,
        ip: clientIp
      }, 'SECURITY');

      next();

    } catch (error) {
      logger.error('reCAPTCHA verification error', error, 'SECURITY');
      
      // In development mode, log error but continue
      if (process.env.NODE_ENV === 'development') {
        logger.warn('Development mode - reCAPTCHA error bypassed', { error: error.message }, 'SECURITY');
        return next();
      }
      
      res.status(500).json({
        success: false,
        message: 'Security verification failed'
      });
    }
  });
};

/**
 * Predefined reCAPTCHA middleware for common use cases
 */
const recaptchaMiddleware = {
  // For login forms - medium security
  login: verifyRecaptcha({
    threshold: 0.5,
    action: 'login',
    required: true
  }),

  // For registration forms - high security
  register: verifyRecaptcha({
    threshold: 0.7,
    action: 'register',
    required: true
  }),

  // For forgot password - medium security
  forgotPassword: verifyRecaptcha({
    threshold: 0.5,
    action: 'forgot_password',
    required: true
  }),

  // For contact forms - low security
  contact: verifyRecaptcha({
    threshold: 0.3,
    action: 'contact',
    required: false
  }),

  // Custom verification
  custom: verifyRecaptcha
};

module.exports = {
  verifyRecaptcha,
  recaptchaMiddleware
};