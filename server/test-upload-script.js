const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'http://localhost:3001/api/v1';
const TEST_FILE_PATH = path.join(__dirname, 'test-upload.txt');

// Create a dummy file for testing
fs.writeFileSync(TEST_FILE_PATH, 'This is a test file content.');

async function testUpload() {
  try {
    console.log('1. Logging in...');
    // We need a valid user. Since I don't have one, I'll try to register one first.
    // If it fails (already exists), I'll try to login.
    
    const userData = {
      email: 'officer_test@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'Officer',
      accountType: 'Officer',
      organization: 'ACES'
    };

    let token;

    try {
      console.log('Attempting registration...');
      const regRes = await axios.post(`${API_URL}/auth/register`, userData);
      token = regRes.data.token;
      console.log('Registration successful. Token obtained.');
    } catch (regError) {
      if (regError.response && regError.response.status === 409) {
        console.log('User already exists. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
          email: userData.email,
          password: userData.password
        });
        token = loginRes.data.token;
        console.log('Login successful. Token obtained.');
      } else {
        throw regError;
      }
    }

    console.log('2. Preparing upload...');
    const form = new FormData();
    form.append('title', 'Test Submission');
    form.append('category', 'Financial Report');
    form.append('type', 'Financial Report');
    form.append('description', 'This is a test submission from the script.');
    form.append('priority', 'medium');
    form.append('files', fs.createReadStream(TEST_FILE_PATH));

    console.log('3. Uploading file...');
    const uploadRes = await axios.post(`${API_URL}/submissions`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ Upload successful!');
    console.log('Response:', uploadRes.data);

  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  } finally {
    // Cleanup
    if (fs.existsSync(TEST_FILE_PATH)) {
      fs.unlinkSync(TEST_FILE_PATH);
    }
  }
}

testUpload();
