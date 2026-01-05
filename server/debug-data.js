const { query } = require('./src/config/database');
require('dotenv').config();

async function showData() {
  try {
    console.log('--- Users (SignUp) ---');
    const users = await query('SELECT id, first_name, last_name, email, account_type FROM "SignUp" LIMIT 5');
    console.table(users.rows);

    console.log('\n--- Submissions ---');
    const submissions = await query('SELECT id, title, status, user_id FROM "Submission" LIMIT 5');
    console.table(submissions.rows);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

showData();
