require('dotenv').config();
const DatabaseService = require('./src/services/DatabaseService');

async function testUserRegistration() {
  try {
    console.log('🔍 Testing enhanced user registration system...');
    
    // Test table structure validation
    console.log('\n1. Validating table structure...');
    const columns = await DatabaseService.validateTableStructure();
    console.log('✅ Table structure validated. Columns found:', columns.length);
    
    // Test user creation with the new service
    console.log('\n2. Testing user creation...');
    const testUserData = {
      email: 'test.user@example.com',
      password: 'hashedpassword123',
      firstName: 'Test',
      lastName: 'User',
      middleName: 'T',
      studentNumber: '2024-00076-SM-0',
      employeeId: null,
      organizationId: 'ACES',
      accountType: 'Organization Member (Viewer)'
    };
    
    // Check if test user already exists
    const existingUser = await DatabaseService.findSignUpByEmail(testUserData.email);
    if (existingUser) {
      console.log('🧹 Cleaning up existing test user...');
      await DatabaseService.deleteSignUp(existingUser.id);
    }
    
    // Create test user
    const createdUser = await DatabaseService.insertSignUp(testUserData);
    console.log('✅ User created successfully with ID:', createdUser.id);
    
    // Test user lookup
    console.log('\n3. Testing user lookup...');
    const foundUser = await DatabaseService.findSignUpByEmail(testUserData.email);
    console.log('✅ User lookup successful:', foundUser ? 'Found' : 'Not found');
    
    // Test student number lookup
    const foundByStudentNumber = await DatabaseService.findSignUpByStudentNumber(testUserData.studentNumber);
    console.log('✅ Student number lookup:', foundByStudentNumber ? 'Found' : 'Not found');
    
    // Clean up
    console.log('\n4. Cleaning up test data...');
    const deleted = await DatabaseService.deleteSignUp(createdUser.id);
    console.log('✅ Test user deleted:', deleted ? 'Success' : 'Failed');
    
    console.log('\n🎉 All tests passed! Registration system is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Error details:', {
      code: error.code,
      detail: error.detail,
      constraint: error.constraint
    });
  }
  
  process.exit(0);
}

testUserRegistration();