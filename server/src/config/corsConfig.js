/**
 * Secure CORS Configuration Utility
 * Provides environment-aware CORS settings with proper security controls
 */

/**
 * Parse and validate CORS origins from environment variables
 */
const parseOrigins = (originString) => {
  if (!originString || typeof originString !== 'string') {
    return [];
  }

  return originString
    .split(',')
    .map(origin => origin.trim())
    .filter(origin => origin.length > 0)
    .filter(origin => {
      // Basic URL validation
      try {
        new URL(origin);
        return true;
      } catch {
        console.warn(`⚠️  Invalid CORS origin ignored: ${origin}`);
        return false;
      }
    });
};

/**
 * Get allowed origins based on environment
 */
const getAllowedOrigins = () => {
  const env = process.env.NODE_ENV || 'development';
  
  // Parse environment-specified origins
  const envOrigins = parseOrigins(process.env.CLIENT_URL || process.env.CORS_ORIGINS);
  
  switch (env) {
    case 'production':
      // Production: Only allow specified origins, no localhost
      if (envOrigins.length === 0) {
        console.error('🚨 CORS Error: No CLIENT_URL specified for production environment');
        throw new Error('CLIENT_URL must be specified in production');
      }
      
      // Validate no localhost origins in production
      const hasLocalhost = envOrigins.some(origin => 
        origin.includes('localhost') || origin.includes('127.0.0.1')
      );
      
      if (hasLocalhost) {
        console.error('🚨 CORS Error: Localhost origins not allowed in production');
        throw new Error('Localhost origins are not permitted in production');
      }
      
      console.log('✅ CORS Production Origins:', envOrigins);
      return envOrigins;
      
    case 'test':
      // Test: Allow specified origins plus common test URLs
      const testOrigins = [
        ...envOrigins,
        'http://localhost:3000',
        'http://localhost:3001'
      ];
      
      console.log('✅ CORS Test Origins:', testOrigins);
      return testOrigins;
      
    case 'development':
    default:
      // Development: Allow specified origins plus common dev URLs
      const devOrigins = [
        ...envOrigins,
        'http://localhost:5173', // Vite default
        'http://localhost:5174', // Vite alternative
        'http://localhost:3000', // React/Next.js
        'http://localhost:3001', // Alternative dev server
        'http://127.0.0.1:5173', // IPv4 localhost
        'http://127.0.0.1:3000'
      ];
      
      console.log('✅ CORS Development Origins:', devOrigins);
      return devOrigins;
  }
};

/**
 * Validate origin against allowed list
 */
const isOriginAllowed = (origin, allowedOrigins) => {
  if (!origin) {
    // Allow requests with no origin (e.g., mobile apps, Postman)
    return process.env.NODE_ENV !== 'production';
  }
  
  return allowedOrigins.includes(origin);
};

/**
 * Get comprehensive CORS configuration
 */
const getCorsConfig = () => {
  const allowedOrigins = getAllowedOrigins();
  const env = process.env.NODE_ENV || 'development';
  
  return {
    origin: (origin, callback) => {
      // Log CORS requests in development
      if (env === 'development') {
        console.log(`🌐 CORS Request from: ${origin || 'no-origin'}`);
      }
      
      if (isOriginAllowed(origin, allowedOrigins)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS Blocked: ${origin || 'no-origin'} not in allowed origins`);
        callback(new Error(`CORS: Origin ${origin || 'no-origin'} not allowed`), false);
      }
    },
    
    credentials: true,
    
    // Allowed HTTP methods
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    
    // Allowed headers
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-CSRF-Token',
      'X-Requested-With'
    ],
    
    // Headers exposed to the client
    exposedHeaders: [
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset'
    ],
    
    // Preflight cache duration (24 hours)
    maxAge: 24 * 60 * 60,
    
    // Handle preflight requests
    preflightContinue: false,
    optionsSuccessStatus: 204
  };
};

/**
 * Validate CORS configuration at startup
 */
const validateCorsConfig = () => {
  try {
    const config = getCorsConfig();
    console.log('✅ CORS configuration validated successfully');
    return config;
  } catch (error) {
    console.error('❌ CORS configuration error:', error.message);
    
    if (process.env.NODE_ENV === 'production') {
      console.error('🚨 Server cannot start with invalid CORS configuration in production');
      process.exit(1);
    } else {
      console.warn('⚠️  Using fallback CORS configuration for development');
      return {
        origin: true, // Allow all origins in development fallback
        credentials: true
      };
    }
  }
};

module.exports = {
  getCorsConfig,
  validateCorsConfig,
  getAllowedOrigins,
  parseOrigins
};