const { connectDB } = require('../src/config/database');

// Database connection test and validation
const testConnection = async () => {
  try {
    console.log('Testing database connection...');
    await connectDB();
    console.log('Database connection successful!');
    console.log('Database is ready for use');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.log('\nPlease check:');
    console.log('  1. PostgreSQL is running');
    console.log('  2. Database credentials in .env file');
    console.log('  3. Database exists and is accessible');
    return false;
  }
};

// Database health check
const healthCheck = async () => {
  try {
    console.log('Running database health check...');
    const { query } = require('../src/config/database');
    
    // Test basic query
    const result = await query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('Database is healthy');
    console.log(`Current time: ${result.rows[0].current_time}`);
    console.log(`PostgreSQL version: ${result.rows[0].postgres_version}`);
    
    return true;
  } catch (error) {
    console.error('Database health check failed:', error.message);
    return false;
  }
};

// Command line interface
const command = process.argv[2];

if (command === 'test') {
  testConnection().then(() => process.exit(0));
} else if (command === 'health') {
  healthCheck().then(() => process.exit(0));
} else if (command === 'check') {
  testConnection()
    .then((connected) => {
      if (connected) {
        return healthCheck();
      }
      return false;
    })
    .then(() => {
      console.log('\nDatabase setup verification completed!');
      process.exit(0);
    });
} else {
  console.log('Available commands:');
  console.log('  test   - Test database connection');
  console.log('  health - Run database health check');
  console.log('  check  - Full database verification');
  console.log('\nNote: Execute your SQL schema directly in pgAdmin');
  process.exit(1);
}

module.exports = {
  testConnection,
  healthCheck
};