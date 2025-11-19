/**
 * Secure Logger Utility
 * Provides logging functionality that automatically sanitizes sensitive data
 * and provides different log levels for different environments
 */

/**
 * Sanitize sensitive data from objects before logging
 */
const sanitizeLogData = (data) => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sensitiveFields = [
    'password', 'hash', 'token', 'secret', 'key', 'authorization',
    'email', 'phone', 'ssn', 'social_security', 'credit_card',
    'firstName', 'lastName', 'middleName', 'first_name', 'last_name', 'middle_name',
    'address', 'postal_code', 'zip_code', 'date_of_birth', 'dob'
  ];

  const sanitized = {};

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    
    if (sensitiveFields.some(field => lowerKey.includes(field))) {
      if (key.toLowerCase().includes('email')) {
        // Show domain only for emails
        sanitized[key] = typeof value === 'string' && value.includes('@') 
          ? `***@${value.split('@')[1]}` 
          : '[REDACTED_EMAIL]';
      } else if (key.toLowerCase().includes('name')) {
        // Show first letter only for names
        sanitized[key] = typeof value === 'string' && value.length > 0
          ? `${value[0]}***`
          : '[REDACTED_NAME]';
      } else {
        sanitized[key] = '[REDACTED]';
      }
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeLogData(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * Get log level based on environment
 */
const getLogLevel = () => {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'production') return 'error';
  if (env === 'test') return 'warn';
  return 'debug'; // development
};

/**
 * Check if logging is enabled for the given level
 */
const shouldLog = (level) => {
  const levels = ['debug', 'info', 'warn', 'error'];
  const currentLevel = getLogLevel();
  return levels.indexOf(level) >= levels.indexOf(currentLevel);
};

/**
 * Format log message with timestamp and context
 */
const formatMessage = (level, message, context = null) => {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` [${context}]` : '';
  return `${timestamp} [${level.toUpperCase()}]${contextStr}: ${message}`;
};

/**
 * Secure logging functions
 */
const secureLogger = {
  debug: (message, data = null, context = null) => {
    if (!shouldLog('debug')) return;
    
    const logMessage = formatMessage('debug', message, context);
    
    if (data) {
      console.log(logMessage);
      console.log('Data:', sanitizeLogData(data));
    } else {
      console.log(logMessage);
    }
  },

  info: (message, data = null, context = null) => {
    if (!shouldLog('info')) return;
    
    const logMessage = formatMessage('info', message, context);
    
    if (data) {
      console.log(logMessage);
      console.log('Data:', sanitizeLogData(data));
    } else {
      console.log(logMessage);
    }
  },

  warn: (message, data = null, context = null) => {
    if (!shouldLog('warn')) return;
    
    const logMessage = formatMessage('warn', message, context);
    
    if (data) {
      console.warn(logMessage);
      console.warn('Data:', sanitizeLogData(data));
    } else {
      console.warn(logMessage);
    }
  },

  error: (message, error = null, context = null) => {
    if (!shouldLog('error')) return;
    
    const logMessage = formatMessage('error', message, context);
    
    if (error) {
      console.error(logMessage);
      // Only log error type and message, not full error object which may contain sensitive data
      console.error('Error Type:', error.constructor?.name || 'Unknown');
      console.error('Error Message:', typeof error === 'string' ? error : error.message || 'Unknown error');
      
      // Only log stack trace in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Stack Trace:', error.stack);
      }
    } else {
      console.error(logMessage);
    }
  },

  // Authentication specific logging
  auth: {
    loginAttempt: (success, userId = null, accountType = null, ipAddress = null) => {
      const status = success ? 'SUCCESS' : 'FAILED';
      const userInfo = userId ? `User ID: ${userId}` : 'Unknown user';
      const accountInfo = accountType ? `, Account Type: ${accountType}` : '';
      const ipInfo = ipAddress ? `, IP: ${ipAddress}` : '';
      
      secureLogger.info(`Login ${status} - ${userInfo}${accountInfo}${ipInfo}`, null, 'AUTH');
    },

    registrationAttempt: (success, accountType = null, organization = null, ipAddress = null) => {
      const status = success ? 'SUCCESS' : 'FAILED';
      const accountInfo = accountType ? `Account Type: ${accountType}` : 'Unknown type';
      const orgInfo = organization ? `, Organization: ${organization}` : '';
      const ipInfo = ipAddress ? `, IP: ${ipAddress}` : '';
      
      secureLogger.info(`Registration ${status} - ${accountInfo}${orgInfo}${ipInfo}`, null, 'AUTH');
    },

    passwordChange: (success, userId = null, ipAddress = null) => {
      const status = success ? 'SUCCESS' : 'FAILED';
      const userInfo = userId ? `User ID: ${userId}` : 'Unknown user';
      const ipInfo = ipAddress ? `, IP: ${ipAddress}` : '';
      
      secureLogger.info(`Password Change ${status} - ${userInfo}${ipInfo}`, null, 'AUTH');
    }
  },

  // Database operation logging
  database: {
    operation: (operation, table, success, recordId = null) => {
      const status = success ? 'SUCCESS' : 'FAILED';
      const recordInfo = recordId ? ` (ID: ${recordId})` : '';
      
      secureLogger.debug(`Database ${operation} ${status} - Table: ${table}${recordInfo}`, null, 'DB');
    },

    error: (operation, table, errorType = null) => {
      secureLogger.error(`Database ${operation} failed - Table: ${table}, Error Type: ${errorType || 'Unknown'}`, null, 'DB');
    }
  }
};

module.exports = secureLogger;