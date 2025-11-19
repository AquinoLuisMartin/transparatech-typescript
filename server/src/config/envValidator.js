const crypto = require('crypto');

/**
 * Environment Variable Validator
 * Validates required environment variables and generates secure defaults where appropriate
 */

/**
 * Generate a cryptographically secure JWT secret
 */
const generateSecureJWTSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

/**
 * Validate required environment variables
 */
const validateEnvironment = () => {
  const errors = [];
  const env = process.env.NODE_ENV || 'development';

  // Critical security variables that must be set
  const criticalVars = {
    JWT_SECRET: 'JWT secret key for token signing',
    DB_PASSWORD: 'Database password'
  };

  // Production-only required variables
  const productionVars = {
    DB_HOST: 'Database host',
    DB_NAME: 'Database name',
    DB_USER: 'Database user',
    CLIENT_URL: 'Client application URL (CORS origins)'
  };

  // Check critical variables for all environments
  for (const [varName, description] of Object.entries(criticalVars)) {
    if (!process.env[varName] || process.env[varName].trim() === '') {
      errors.push(`Missing required environment variable: ${varName} (${description})`);
    }
  }

  // Additional checks for production
  if (env === 'production') {
    for (const [varName, description] of Object.entries(productionVars)) {
      if (!process.env[varName] || process.env[varName].trim() === '') {
        errors.push(`Missing required production environment variable: ${varName} (${description})`);
      }
    }

    // JWT secret strength validation for production
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
      errors.push('JWT_SECRET must be at least 32 characters long in production');
    }
  }

  // Validate JWT secret strength for all environments
  if (process.env.JWT_SECRET) {
    if (process.env.JWT_SECRET.length < 16) {
      errors.push('JWT_SECRET must be at least 16 characters long');
    }

    // Check for weak/common secrets
    const weakSecrets = [
      'secret', 'password', '123456', 'test-secret', 'your_jwt_secret_key_here',
      'jwt-secret', 'supersecret', 'development-secret'
    ];

    if (weakSecrets.includes(process.env.JWT_SECRET.toLowerCase())) {
      errors.push('JWT_SECRET appears to be a weak or default secret. Please use a strong, unique secret.');
    }
  }

  // CORS validation for production
  if (env === 'production') {
    if (process.env.CLIENT_URL) {
      const origins = process.env.CLIENT_URL.split(',').map(o => o.trim());
      const hasLocalhost = origins.some(origin => 
        origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes(':3000') || origin.includes(':5173')
      );
      
      if (hasLocalhost) {
        errors.push('CLIENT_URL contains localhost origins which are not allowed in production');
      }

      // Validate URL format
      origins.forEach(origin => {
        try {
          new URL(origin);
          if (!origin.startsWith('https://') && env === 'production') {
            errors.push(`CLIENT_URL origin "${origin}" should use HTTPS in production`);
          }
        } catch {
          errors.push(`CLIENT_URL contains invalid URL: "${origin}"`);
        }
      });
    }
  }

  return errors;
};

/**
 * Get or generate secure JWT secret based on environment
 */
const getJWTSecret = () => {
  const env = process.env.NODE_ENV || 'development';
  
  // For production, always require environment variable
  if (env === 'production') {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required in production');
    }
    return process.env.JWT_SECRET;
  }

  // For development/test, use env var if provided, otherwise generate secure one
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  // Generate a secure secret and warn developer
  const generatedSecret = generateSecureJWTSecret();
  
  console.warn(`
⚠️  WARNING: JWT_SECRET environment variable not set for ${env} environment.
    Generated temporary secure secret for this session.
    
    For consistent authentication across server restarts, please set:
    JWT_SECRET=${generatedSecret}
    
    Add this to your .env file.
  `);
  
  return generatedSecret;
};

/**
 * Initialize configuration with validation
 */
const initializeConfig = () => {
  // Validate environment variables
  const validationErrors = validateEnvironment();
  
  if (validationErrors.length > 0) {
    console.error('❌ Environment Configuration Errors:');
    validationErrors.forEach(error => console.error(`   - ${error}`));
    
    // In production, fail hard
    if (process.env.NODE_ENV === 'production') {
      console.error('\n🚨 Server cannot start in production with missing environment variables.');
      process.exit(1);
    } else {
      console.error('\n⚠️  Server starting with configuration issues. Please fix for production deployment.');
    }
  }

  console.log(`✅ Configuration initialized for ${process.env.NODE_ENV || 'development'} environment`);
};

module.exports = {
  validateEnvironment,
  getJWTSecret,
  generateSecureJWTSecret,
  initializeConfig
};