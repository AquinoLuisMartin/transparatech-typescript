const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const aiRoutes = require('./routes/ai');
const { errorHandler } = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');
const { sanitizeInput, rateLimit, securityHeaders } = require('./middleware/sanitization');
const { validateCorsConfig } = require('./config/corsConfig');

const app = express();

// Security Middleware (applied first)
app.use(securityHeaders);
app.use(helmet());

// Rate limiting for all routes
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100 // limit each IP to 100 requests per windowMs
}));

// Secure CORS configuration
const corsConfig = validateCorsConfig();
app.use(cors(corsConfig));

// Logging
app.use(morgan('combined'));

// Debug logging for all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

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

const path = require('path');

// API Routes
const recaptchaRoutes = require('./routes/recaptcha');
const submissionRoutes = require('./routes/submissions');
const announcementRoutes = require('./routes/announcements');
const documentRoutes = require('./routes/documents');
const feedbackRoutes = require('./routes/feedback');
const organizationRoutes = require('./routes/organizations');
const settingsRoutes = require('./routes/settings');
const analyticsRoutes = require('./routes/analytics');
const apiPrefix = process.env.API_PREFIX || '/api/v1';

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/recaptcha`, recaptchaRoutes);
app.use(`${apiPrefix}/submissions`, submissionRoutes);
app.use(`${apiPrefix}/announcements`, announcementRoutes);
app.use(`${apiPrefix}/documents`, documentRoutes);
app.use(`${apiPrefix}/feedback`, feedbackRoutes);
app.use(`${apiPrefix}/organizations`, organizationRoutes);
app.use(`${apiPrefix}/settings`, settingsRoutes);
app.use(`${apiPrefix}/analytics`, analyticsRoutes);
app.use(`${apiPrefix}/ai`, aiRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;