require('dotenv').config();
const express = require('express');

console.log('Server Diagnostics');
console.log('==========================================');

// Check environment variables
console.log('Environment Variables:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
console.log(`   PORT: ${process.env.PORT || 'undefined'}`);
console.log(`   DB_HOST: ${process.env.DB_HOST || 'undefined'}`);
console.log(`   DB_PORT: ${process.env.DB_PORT || 'undefined'}`);
console.log(`   DB_NAME: ${process.env.DB_NAME || 'undefined'}`);
console.log(`   DB_USER: ${process.env.DB_USER || 'undefined'}`);
console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '***SET***' : 'undefined'}`);
console.log(`   CLIENT_URL: ${process.env.CLIENT_URL || 'undefined'}`);

// Check if port is available
const PORT = process.env.PORT || 3000;
const app = express();

console.log('\nTesting Port Availability:');
const server = app.listen(PORT, (error) => {
  if (error) {
    console.log(`   Port ${PORT} is NOT available:`, error.message);
    process.exit(1);
  } else {
    console.log(`   Port ${PORT} is available`);
    server.close(() => {
      console.log(`   Port ${PORT} released successfully`);
      testDatabase();
    });
  }
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`   Port ${PORT} is already in use`);
    console.log('   Try: netstat -ano | findstr :3000 to see what\'s using the port');
  } else {
    console.log(`   Server error:`, error.message);
  }
  process.exit(1);
});

// Test database connection
async function testDatabase() {
  console.log('\nTesting Database Connection:');
  
  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'db_transparatech',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      connectionTimeoutMillis: 5000,
    });

    const client = await pool.connect();
    console.log('   Database connection successful');
    
    const result = await client.query('SELECT NOW() as current_time');
    console.log(`   Database query successful: ${result.rows[0].current_time}`);
    
    client.release();
    await pool.end();
    
    console.log('\nAll diagnostics passed!');
    console.log('   The server should start successfully now.');
    
  } catch (error) {
    console.log('   Database connection failed:', error.message);
    
    if (error.code === '28P01') {
      console.log('   This is a password authentication error');
      console.log('   Check your DB_PASSWORD in the .env file');
    } else if (error.code === 'ENOTFOUND') {
      console.log('   Database host not found');
      console.log('   Make sure PostgreSQL is installed and running');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('   Connection refused');
      console.log('   Make sure PostgreSQL service is running');
    }
  }
  
  process.exit(0);
}