// Test script to verify the InMemoryUser fix
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

async function testSessionPersistence() {
  try {
    console.log('🧪 Testing session persistence fix...\n');

    // Test registration with proper validation
    console.log('1. Testing registration with valid data...');
    const registerData = {
      firstName: 'Test',
      lastName: 'User',
      email: `test_${Date.now()}@example.com`,
      password: 'TestPassword123', // Meets validation requirements
    };

    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, registerData);
    console.log('✅ Registration successful:', registerResponse.data);

    // Test login
    console.log('\n2. Testing login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: registerData.email,
      password: registerData.password,
    });
    console.log('✅ Login successful:', loginResponse.data);

    const token = loginResponse.data.token;
    const userId = loginResponse.data.user.id || loginResponse.data.user._id;

    // Test token verification (this was failing before)
    console.log('\n3. Testing token verification (this was previously failing)...');
    const verifyResponse = await axios.post(`${API_BASE_URL}/auth/verify-token`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('✅ Token verification successful:', verifyResponse.data);

    // Test user profile access (this was failing before)
    console.log('\n4. Testing user profile access...');
    const profileResponse = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('✅ Profile access successful:', profileResponse.data);

    // Test favorites access (this was failing before) 
    console.log('\n5. Testing favorites access...');
    const favoritesResponse = await axios.get(`${API_BASE_URL}/users/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('✅ Favorites access successful:', favoritesResponse.data);

    // Test multiple user lookups to ensure no property redefinition errors
    console.log('\n6. Testing multiple user lookups (checking for property redefinition)...');
    for (let i = 0; i < 3; i++) {
      const lookupResponse = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`   Lookup ${i + 1} successful: ${lookupResponse.data.user.fullName}`);
    }

    console.log('\n🎉 All tests passed! The "Cannot redefine property: fullName" error is fixed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data?.errors) {
      console.error('Validation errors:', error.response.data.errors);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  testSessionPersistence();
}

module.exports = testSessionPersistence;