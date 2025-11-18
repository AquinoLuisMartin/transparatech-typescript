const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
// const aiRoutes = require('./routes/ai'); // Temporarily commented out
const { errorHandler } = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');
const { sanitizeInput, rateLimit, securityHeaders } = require('./middleware/sanitization');

const app = express();

// Security Middleware (applied first)
app.use(securityHeaders);
app.use(helmet());

// Rate limiting for all routes
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100 // limit each IP to 100 requests per windowMs
}));

// Stricter rate limiting for auth routes
app.use('/api/v1/auth', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later'
}));

// CORS configuration
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));

// Logging
app.use(morgan('combined'));

// Body parsing with size limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Store raw body for potential signature verification
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization (applied after body parsing)
app.use(sanitizeInput);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
const apiPrefix = process.env.API_PREFIX || '/api/v1';
console.log('Registering routes with prefix:', apiPrefix);
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
// app.use(`${apiPrefix}/ai`, aiRoutes); // Temporarily commented out

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;