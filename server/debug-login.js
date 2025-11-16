require('dotenv').config();
const User = require('./src/models/User');
const { comparePassword } = require('./src/utils/auth');

async function debugLogin() {
  try {
    console.log('🔍 Debug Login Process');
    console.log('===========================================');
    
    const email = 'habee2004@gmail.com';
    const password = 'Alpha@1000';
    
    console.log(`📧 Testing login for: ${email}`);
    console.log(`🔑 Testing password: ${password}`);
    
    // Find user
    console.log('\n1️⃣ Finding user...');
    const user = await User.findByEmail(email);
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.first_name} ${user.last_name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Account Type: ${user.account_type}`);
    
    console.log('\n2️⃣ Password comparison...');
    console.log(`   Stored hash: ${user.password}`);
    console.log(`   Hash length: ${user.password.length}`);
    console.log(`   Hash format: ${user.password.startsWith('$2a$') || user.password.startsWith('$2b$') ? 'Valid bcrypt' : 'Invalid format'}`);
    
    // Test password comparison
    console.log(`   Comparing "${password}" with stored hash...`);
    const isMatch = await comparePassword(password, user.password);
    
    console.log(`   Password match: ${isMatch ? '✅ YES' : '❌ NO'}`);
    
    if (!isMatch) {
      console.log('\n🔧 Debugging password issues...');
      
      // Test with different password variations
      const variations = [
        password,
        password.trim(),
        password.toLowerCase(),
        password.toUpperCase(),
        'Alpha@1000', // Exact match
        'alpha@1000', // lowercase
        'ALPHA@1000'  // uppercase
      ];
      
      for (const variant of variations) {
        const testMatch = await comparePassword(variant, user.password);
        console.log(`   "${variant}": ${testMatch ? '✅' : '❌'}`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

debugLogin();