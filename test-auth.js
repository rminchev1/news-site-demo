// Quick test script to verify authentication is working
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

async function testAuth() {
  try {
    console.log('🧪 Testing authentication flow...\n');

    // Test registration
    console.log('1. Testing registration...');
    const registerData = {
      username: 'testuser_' + Date.now(),
      email: `test_${Date.now()}@example.com`,
      password: 'testpassword123',
    };

    try {
      const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, registerData);
      console.log('✅ Registration successful:', registerResponse.data);
    } catch (regError) {
      if (regError.response?.status === 400 && regError.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️  User already exists, continuing with login test');
      } else {
        throw regError;
      }
    }

    // Test login
    console.log('\n2. Testing login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: registerData.email,
      password: registerData.password,
    });
    console.log('✅ Login successful:', loginResponse.data);

    const token = loginResponse.data.token;

    // Test protected route
    console.log('\n3. Testing protected route...');
    const profileResponse = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('✅ Protected route accessible:', profileResponse.data);

    // Test token verification
    console.log('\n4. Testing token verification...');
    const verifyResponse = await axios.get(`${API_BASE_URL}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('✅ Token verification successful:', verifyResponse.data);

    console.log('\n🎉 All authentication tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  testAuth();
}

module.exports = testAuth;