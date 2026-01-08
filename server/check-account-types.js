require('dotenv').config();
const { query } = require('./src/config/database');

async function checkAccountTypes() {
  try {
    const res = await query('SELECT DISTINCT account_type FROM "SignUp"');
    console.log('Account Types:', res.rows);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkAccountTypes();