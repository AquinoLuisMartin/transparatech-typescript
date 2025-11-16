require('dotenv').config();
const { Pool } = require('pg');

async function showExistingUsers() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    console.log('👥 Your Existing Users in Database:\n');
    
    const result = await pool.query(`
      SELECT id, first_name, last_name, middle_initial, email, student_number, 
             account_type, organization, created_at
      FROM "SignUp" 
      ORDER BY created_at DESC;
    `);
    
    if (result.rows.length === 0) {
      console.log('   No users found in database. Please register first at: http://localhost:5173/auth/signup');
    } else {
      console.log(`   Found ${result.rows.length} registered users:\n`);
      
      result.rows.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.first_name} ${user.last_name}${user.middle_initial ? ' ' + user.middle_initial : ''}`);
        console.log(`      Email: ${user.email}`);
        console.log(`      Student Number: ${user.student_number || 'N/A'}`);
        console.log(`      Account Type: ${user.account_type}`);
        console.log(`      Organization: ${user.organization}`);
        console.log(`      Registered: ${new Date(user.created_at).toLocaleString()}`);
        console.log('');
      });
      
      console.log('🔐 To login, use ANY of the above credentials with:');
      console.log('   - Their EMAIL + password you used during signup');
      console.log('   - Their STUDENT NUMBER + password (if they have one)');
      console.log('');
      console.log('📍 Login at: http://localhost:5173/auth/signin');
    }
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error fetching users:', error.message);
    await pool.end();
  }
}

showExistingUsers();