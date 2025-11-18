const validator = require('../utils/validator');

/**
 * Global input sanitization middleware
 * Sanitizes all incoming request body data to prevent XSS and basic SQL injection attempts
 */
const sanitizeInput = (req, res, next) => {
  try {
    // Sanitize request body
    if (req.body && typeof req.body === 'object') {
      req.body = validator.sanitizeForDatabase(req.body);
    }

    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = validator.sanitizeForDatabase(req.query);
    }

    // Sanitize URL parameters
    if (req.params && typeof req.params === 'object') {
      req.params = validator.sanitizeForDatabase(req.params);
    }

    next();
  } catch (error) {
    console.error('Input sanitization error:', error);
    return res.status(400).json({
      success: false,
      message: 'Invalid input data format'
    });
  }
};

/**
 * Rate limiting helper - tracks requests per IP
 */
const rateLimitStore = new Map();

const rateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxRequests = 100,
    message = 'Too many requests, please try again later'
  } = options;

  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    // Clean up old entries
    for (const [ip, data] of rateLimitStore.entries()) {
      if (now - data.resetTime > windowMs) {
        rateLimitStore.delete(ip);
      }
    }

    // Get or create rate limit data for this IP
    if (!rateLimitStore.has(clientIP)) {
      rateLimitStore.set(clientIP, {
        count: 0,
        resetTime: now + windowMs
      });
    }

    const rateLimitData = rateLimitStore.get(clientIP);

    // Reset if window has passed
    if (now > rateLimitData.resetTime) {
      rateLimitData.count = 0;
      rateLimitData.resetTime = now + windowMs;
    }

    // Check if limit exceeded
    if (rateLimitData.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: message,
        retryAfter: Math.ceil((rateLimitData.resetTime - now) / 1000)
      });
    }

    // Increment counter
    rateLimitData.count++;

    // Set rate limit headers
    res.set({
      'X-RateLimit-Limit': maxRequests,
      'X-RateLimit-Remaining': Math.max(0, maxRequests - rateLimitData.count),
      'X-RateLimit-Reset': new Date(rateLimitData.resetTime).toISOString()
    });

    next();
  };
};

/**
 * Security headers middleware
 */
const securityHeaders = (req, res, next) => {
  // Prevent XSS attacks
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Enforce HTTPS (only in production)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Feature policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  next();
};

module.exports = {
  sanitizeInput,
  rateLimit,
  securityHeaders
};