const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error with full details in development
  console.error('=== ERROR DETAILS ===');
  console.error('Error Type:', err.constructor.name);
  console.error('Error Message:', err.message);
  console.error('Error Code:', err.code);
  console.error('Route:', req.method, req.path);
  if (process.env.NODE_ENV === 'development') {
    console.error('Full Error:', err);
  }
  console.error('=== END ERROR ===\n');

  // PostgreSQL error handling
  if (err.code === '23505') {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  if (err.code === '23503') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  if (err.code === '23502') {
    const message = 'Required field missing';
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler };