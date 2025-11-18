const errorHandler = (err, req, res, next) => {
  // Initialize sanitized error object
  let sanitizedError = {
    message: 'Internal Server Error',
    statusCode: 500
  };

  // Log full error details for debugging (server-side only)
  console.error('=== ERROR DETAILS ===');
  console.error('Timestamp:', new Date().toISOString());
  console.error('Error Type:', err.constructor.name);
  console.error('Route:', req.method, req.path);
  console.error('User IP:', req.ip || req.connection.remoteAddress);
  
  // Only log sensitive details in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Message:', err.message);
    console.error('Error Code:', err.code);
    console.error('Stack:', err.stack);
  }
  console.error('=== END ERROR ===\n');

  // Database error handling - NEVER expose database internals to client
  if (err.code && typeof err.code === 'string') {
    switch (err.code) {
      case '23505': // Unique constraint violation
        sanitizedError = { 
          message: 'This record already exists', 
          statusCode: 409 
        };
        break;
      case '23503': // Foreign key constraint violation
        sanitizedError = { 
          message: 'Referenced resource not found', 
          statusCode: 400 
        };
        break;
      case '23502': // Not null constraint violation
        sanitizedError = { 
          message: 'Required field is missing', 
          statusCode: 400 
        };
        break;
      case '23514': // Check constraint violation
        sanitizedError = { 
          message: 'Invalid data format', 
          statusCode: 400 
        };
        break;
      case '42P01': // Undefined table
      case '42703': // Undefined column
      case '42601': // Syntax error
        sanitizedError = { 
          message: 'Database operation failed', 
          statusCode: 500 
        };
        break;
      default:
        // Generic database error
        sanitizedError = { 
          message: 'Database operation failed', 
          statusCode: 500 
        };
    }
  }
  
  // Authentication/Authorization errors
  else if (err.name === 'JsonWebTokenError') {
    sanitizedError = { message: 'Invalid authentication token', statusCode: 401 };
  }
  else if (err.name === 'TokenExpiredError') {
    sanitizedError = { message: 'Authentication token has expired', statusCode: 401 };
  }
  else if (err.name === 'NotBeforeError') {
    sanitizedError = { message: 'Authentication token not active', statusCode: 401 };
  }
  
  // Validation errors
  else if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map(val => 
      typeof val === 'object' && val.message ? val.message : 'Invalid input'
    );
    sanitizedError = { 
      message: messages.length > 0 ? messages.join(', ') : 'Validation failed', 
      statusCode: 400 
    };
  }
  
  // Rate limiting errors
  else if (err.statusCode === 429) {
    sanitizedError = { message: 'Too many requests, please try again later', statusCode: 429 };
  }
  
  // Custom application errors with safe messages
  else if (err.statusCode && err.statusCode >= 400 && err.statusCode < 500) {
    sanitizedError = { 
      message: err.message || 'Request failed', 
      statusCode: err.statusCode 
    };
  }

  // Build response object
  const response = {
    success: false,
    error: sanitizedError.message,
    timestamp: new Date().toISOString()
  };

  // Only include stack trace in development and for 500 errors
  if (process.env.NODE_ENV === 'development' && sanitizedError.statusCode >= 500) {
    response.debug = {
      type: err.constructor.name,
      originalMessage: err.message
    };
  }

  res.status(sanitizedError.statusCode).json(response);
};

module.exports = { errorHandler };