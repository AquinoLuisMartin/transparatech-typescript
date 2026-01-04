const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { query } = require('./src/config/database');

const runMigration = async () => {
  try {
    const migrationFile = path.join(__dirname, 'database', 'migrations', '006_add_submission_review_fields.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');
    
    console.log('Running migration 006_add_submission_review_fields.sql...');
    await query(sql);
    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigration();
