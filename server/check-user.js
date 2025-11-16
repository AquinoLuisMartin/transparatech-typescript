require('dotenv').config();
const User = require('./src/models/User');
const { comparePassword } = require('./src/utils/auth');

async function checkUserLogin() {
  try {
    console.log('🔍 Checking user credentials...\n');
    
    const email = 'habee2004@gmail.com';
    const studentNumber = '2022-00076-SM-0';
    const password = 'Alpha@1000';

    // Check if user exists by email
    console.log('📧 Checking by email:', email);
    const userByEmail = await User.findByEmail(email);
    
    if (userByEmail) {
      console.log('✅ User found by email:');
      console.log(`   ID: ${userByEmail.id}`);
      console.log(`   Name: ${userByEmail.first_name} ${userByEmail.last_name}`);
      console.log(`   Email: ${userByEmail.email}`);
      console.log(`   Student Number: ${userByEmail.student_number}`);
      console.log(`   Account Type: ${userByEmail.account_type}`);
      console.log(`   Organization: ${userByEmail.organization_id}`);
      
      // Test password
      const isPasswordValid = await comparePassword(password, userByEmail.password);
      console.log(`   Password Valid: ${isPasswordValid ? '✅ YES' : '❌ NO'}`);
    } else {
      console.log('❌ No user found with email:', email);
    }

    console.log('\n🎓 Checking by student number:', studentNumber);
    const userByStudentNumber = await User.findByStudentNumber(studentNumber);
    
    if (userByStudentNumber) {
      console.log('✅ User found by student number:');
      console.log(`   ID: ${userByStudentNumber.id}`);
      console.log(`   Name: ${userByStudentNumber.first_name} ${userByStudentNumber.last_name}`);
      console.log(`   Email: ${userByStudentNumber.email}`);
      console.log(`   Student Number: ${userByStudentNumber.student_number}`);
      console.log(`   Account Type: ${userByStudentNumber.account_type}`);
      
      // Test password
      const isPasswordValid = await comparePassword(password, userByStudentNumber.password);
      console.log(`   Password Valid: ${isPasswordValid ? '✅ YES' : '❌ NO'}`);
    } else {
      console.log('❌ No user found with student number:', studentNumber);
    }

    // List all users in database
    console.log('\n👥 All users in database:');
    const allUsers = await User.findAll(10, 0);
    
    if (allUsers.length === 0) {
      console.log('   No users found in database');
    } else {
      allUsers.forEach((user, index) => {
        console.log(`\n   ${index + 1}. ${user.first_name} ${user.last_name}`);
        console.log(`      Email: ${user.email}`);
        console.log(`      Student Number: ${user.student_number || 'N/A'}`);
        console.log(`      Account Type: ${user.account_type}`);
        console.log(`      Organization: ${user.organization_id}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

checkUserLogin();