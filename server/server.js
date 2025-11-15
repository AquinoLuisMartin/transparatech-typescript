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
    // Test database connection (optional for now)
    try {
      await connectDB();
      console.log('Database connected successfully');
    } catch (dbError) {
      console.warn('Database connection failed, but starting server anyway:', dbError.message);
      console.warn('Please ensure PostgreSQL is running and configured correctly');
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();