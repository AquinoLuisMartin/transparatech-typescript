require('dotenv').config();
// const { GoogleGenAI } = require("@google/genai"); // Temporarily commented out
const app = require('./src/app');
const { connectDB } = require('./src/config/database');

// Initialize Google GenAI (temporarily commented out)
// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY
// });

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log('🚀 Starting Transparatech Server...');
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔧 Port: ${PORT}`);
    
    // Test database connection (non-blocking)
    try {
      console.log('🔗 Testing database connection...');
      await connectDB();
      console.log('✅ Database connected successfully');
    } catch (dbError) {
      console.warn('⚠️  Database connection failed, but starting server anyway');
      console.warn('⚠️  Database Error:', dbError.message);
      console.warn('💡 Please ensure PostgreSQL is running and configured correctly');
      console.warn('💡 Server will continue to run for health checks and diagnostics');
    }

    // Start server
    const server = app.listen(PORT, (error) => {
      if (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
      }
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`🔍 Health check: http://localhost:${PORT}/health`);
      console.log(`🔑 Auth endpoint: http://localhost:${PORT}/api/v1/auth/login`);
      console.log(`🌐 CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.log('💡 Try stopping other servers or use a different port');
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('📤 Received SIGTERM, shutting down gracefully');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('📤 Received SIGINT, shutting down gracefully');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('⚠️  Unhandled Promise Rejection:', err.message);
  // Don't exit the process, just log the error
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('⚠️  Uncaught Exception:', err.message);
  console.error('Stack:', err.stack);
  // Don't exit immediately, try to gracefully shutdown
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

startServer();