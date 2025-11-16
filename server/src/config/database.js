const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'db_transparatech',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
  connectionTimeoutMillis: 5000, // Increased timeout to 5 seconds
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Handle pool errors to prevent server crashes
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  // Don't exit the process, just log the error
});

// Test database connection
const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// Query function with error handling
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Get a client from the pool for transactions
const getClient = async () => {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    console.error('Error getting database client:', error);
    throw error;
  }
};

module.exports = {
  pool,
  query,
  connectDB,
  getClient
};