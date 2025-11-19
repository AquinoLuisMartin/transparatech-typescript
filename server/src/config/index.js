const { getJWTSecret, initializeConfig } = require('./envValidator');

// Initialize and validate configuration
initializeConfig();

const config = {
  development: {
    port: process.env.PORT || 3000,
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      name: process.env.DB_NAME || 'transparatech_db',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      pool: {
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
      }
    },
    jwt: {
      secret: getJWTSecret(),
      expiresIn: process.env.JWT_EXPIRE || '7d'
    },
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  },
  
  production: {
    port: process.env.PORT || 3000,
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      name: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      pool: {
        max: 50,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
      }
    },
    jwt: {
      secret: getJWTSecret(),
      expiresIn: process.env.JWT_EXPIRE || '7d'
    },
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 50 // stricter limit for production
    }
  },

  test: {
    port: process.env.PORT || 3001,
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      name: process.env.DB_NAME_TEST || 'transparatech_test_db',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      pool: {
        max: 5,
        idleTimeoutMillis: 1000,
        connectionTimeoutMillis: 1000
      }
    },
    jwt: {
      secret: getJWTSecret(),
      expiresIn: '1h'
    },
    cors: {
      origin: 'http://localhost:3000',
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 1000 // relaxed for testing
    }
  }
};

const env = process.env.NODE_ENV || 'development';

module.exports = config[env];