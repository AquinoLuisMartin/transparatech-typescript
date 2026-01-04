const https = require('https');
const querystring = require('querystring');

/**
 * Google reCAPTCHA v3 Server-side Verification Service
 */
class RecaptchaService {
  constructor() {
    this.secretKey = process.env.RECAPTCHA_SECRET_KEY;
    this.isEnabled = Boolean(this.secretKey && this.secretKey !== '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe');
    this.verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    
    // Development mode check
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Verify reCAPTCHA token
   * @param {string} token - reCAPTCHA response token
   * @param {string} remoteIp - Client IP address (optional)
   * @returns {Object} Verification result
   */
  async verifyToken(token, remoteIp = null) {
    try {
      // Skip verification in development if not configured
      if (this.isDevelopment && !this.isEnabled) {
        console.warn('reCAPTCHA verification skipped in development mode');
        return {
          success: true,
          score: 1.0,
          action: 'development',
          challenge_ts: new Date().toISOString(),
          hostname: 'localhost',
          bypassed: true
        };
      }

      // Handle development bypass tokens
      if ((token === 'dev_bypass_token' || token === 'demo_bypass_token') && this.isDevelopment) {
        console.warn('Development bypass token used - this should not happen in production');
        return {
          success: true,
          score: 1.0,
          action: 'development_bypass',
          challenge_ts: new Date().toISOString(),
          hostname: 'localhost',
          bypassed: true
        };
      }

      if (!this.isEnabled) {
        throw new Error('reCAPTCHA service not configured - missing secret key');
      }

      if (!token) {
        throw new Error('reCAPTCHA token is required');
      }

      // Verify the token with Google reCAPTCHA API
      const verification = await this.makeVerificationRequest(token, remoteIp);

      console.log('reCAPTCHA verification result:', {
        success: verification.success,
        score: verification.score || 'N/A',
        action: verification.action || 'N/A',
        hostname: verification.hostname || 'N/A',
        errors: verification['error-codes'] || 'none'
      });

      return {
        success: verification.success,
        score: verification.score || null,
        action: verification.action || null,
        challenge_ts: verification.challenge_ts || null,
        hostname: verification.hostname || null,
        errors: verification['error-codes'] || null,
        bypassed: false
      };

    } catch (error) {
      console.error('reCAPTCHA verification failed:', error.message);
      
      // In development, log error but don't fail
      if (this.isDevelopment) {
        console.warn('reCAPTCHA verification failed in development - allowing request');
        return {
          success: true,
          score: 0.5,
          action: 'development_fallback',
          challenge_ts: new Date().toISOString(),
          hostname: 'localhost',
          bypassed: true,
          error: error.message
        };
      }
      
      throw error;
    }
  }

  /**
   * Make HTTP request to Google reCAPTCHA verification API
   * @param {string} token - reCAPTCHA response token
   * @param {string} remoteIp - Client IP address (optional)
   * @returns {Promise<Object>} Verification response from Google
   */
  makeVerificationRequest(token, remoteIp = null) {
    return new Promise((resolve, reject) => {
      const postData = querystring.stringify({
        secret: this.secretKey,
        response: token,
        ...(remoteIp && { remoteip: remoteIp })
      });

      const options = {
        hostname: 'www.google.com',
        port: 443,
        path: '/recaptcha/api/siteverify',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            resolve(response);
          } catch (error) {
            reject(new Error(`Failed to parse reCAPTCHA response: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`reCAPTCHA verification request failed: ${error.message}`));
      });

      req.write(postData);
      req.end();
    });
  }

  /**
   * Verify reCAPTCHA with score threshold for v3
   * @param {string} token - reCAPTCHA response token
   * @param {number} threshold - Minimum score threshold (0.0 - 1.0)
   * @param {string} expectedAction - Expected action name
   * @param {string} remoteIp - Client IP address
   * @returns {Object} Verification result with score analysis
   */
  async verifyWithScore(token, threshold = 0.5, expectedAction = null, remoteIp = null) {
    const result = await this.verifyToken(token, remoteIp);
    
    if (!result.success) {
      return {
        ...result,
        scoreCheck: false,
        actionCheck: false,
        message: 'reCAPTCHA verification failed'
      };
    }

    // Check score threshold (reCAPTCHA v3 only)
    const scoreCheck = result.score === null || result.score >= threshold;
    
    // Check action name (reCAPTCHA v3 only)
    const actionCheck = !expectedAction || result.action === expectedAction;

    return {
      ...result,
      scoreCheck,
      actionCheck,
      threshold,
      expectedAction,
      message: scoreCheck && actionCheck ? 'Verification successful' : 'Verification failed - suspicious activity detected'
    };
  }

  /**
   * Check if reCAPTCHA is enabled
   * @returns {boolean}
   */
  isConfigured() {
    return this.isEnabled;
  }

  /**
   * Get reCAPTCHA configuration status
   * @returns {Object}
   */
  getStatus() {
    return {
      enabled: this.isEnabled,
      development: this.isDevelopment,
      configured: Boolean(this.secretKey)
    };
  }
}

// Export singleton instance
module.exports = new RecaptchaService();