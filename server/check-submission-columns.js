const { query } = require('./src/config/database');
require('dotenv').config();

async function checkSubmissionColumns() {
  try {
    const result = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Submission';
    `);
    
    console.log('Columns in Submission table:', result.rows.map(r => r.column_name));
    process.exit(0);
  } catch (error) {
    console.error('Error checking columns:', error);
    process.exit(1);
  }
}

checkSubmissionColumns();
