const SubmissionService = require('../services/SubmissionService');
const { connectDB, pool } = require('../config/database');

const initTable = async () => {
  try {
    await connectDB();
    console.log('Connected to database...');
    
    console.log('Creating Submission table...');
    await SubmissionService.createTable();
    console.log('Submission table created successfully!');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Failed to create Submission table:', error);
    process.exit(1);
  }
};

initTable();
