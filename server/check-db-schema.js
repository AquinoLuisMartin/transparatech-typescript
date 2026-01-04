const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'transparatech',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function checkAndFixSchema() {
  try {
    console.log('Checking Submission table schema...');
    
    // Check if files column exists
    const result = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Submission' AND column_name = 'files';
    `);

    if (result.rows.length === 0) {
      console.log('files column missing in Submission table. Adding it...');
      await pool.query(`
        ALTER TABLE "Submission" 
        ADD COLUMN files TEXT[];
      `);
      console.log('Successfully added files column.');
    } else {
      console.log('files column already exists.');
    }

    // Also check if user_id and reviewer_id are integers (foreign keys)
    // Sometimes they might be created differently if not careful
    
    console.log('Schema check complete.');
  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    await pool.end();
  }
}

checkAndFixSchema();
