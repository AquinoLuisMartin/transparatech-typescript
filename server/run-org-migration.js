require('dotenv').config();
const { query } = require('./src/config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('Running organizations migration...');
    
    const sqlPath = path.join(__dirname, 'database', 'migrations', '004_add_organizations.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Executing SQL from:', sqlPath);
    
    // Split by semicolon to run statements individually if needed, 
    // but query() might handle multiple statements if configured.
    // Generally safer to just pass the whole thing if the driver supports it.
    // Postgres driver supports multiple statements.
    
    await query(sql);
    
    console.log('Migration completed successfully.');
    
    // Verify
    const result = await query('SELECT * FROM organizations');
    console.log('Organizations count after migration:', result.rows.length);
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();