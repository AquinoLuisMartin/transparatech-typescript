require('dotenv').config();
const { Pool } = require('pg');

async function testConnection() {
  console.log('Testing database connection with credentials:');
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`Port: ${process.env.DB_PORT}`);
  console.log(`Database: ${process.env.DB_NAME}`);
  console.log(`User: ${process.env.DB_USER}`);
  console.log(`Password: ${'*'.repeat(process.env.DB_PASSWORD?.length || 0)}\n`);

  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    console.log('Attempting to connect...');
    const client = await pool.connect();
    console.log('✅ Connection successful!');
    
    const result = await client.query('SELECT version()');
    console.log('\nPostgreSQL Version:');
    console.log(result.rows[0].version);
    
    client.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('\nConnection failed!');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('\nPossible solutions:');
    console.error('1. Check if PostgreSQL is running');
    console.error('2. Verify the password in your .env file');
    console.error('3. Check if the database "db_transparatech" exists');
    console.error('4. Review PostgreSQL pg_hba.conf authentication settings');
    await pool.end();
    process.exit(1);
  }
}

testConnection();
