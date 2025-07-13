import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3003';

async function testProduction() {
    console.log('🧪 Testing Production Deployment');
    console.log('Base URL:', BASE_URL);
    console.log('=====================================\n');

    try {
        // Test 1: Server Status
        console.log('1️⃣ Testing server status...');
        const serverResponse = await fetch(`${BASE_URL}/`);
        console.log(`Server Status: ${serverResponse.status}`);
        console.log(`Content-Type: ${serverResponse.headers.get('content-type')}`);
        
        if (serverResponse.ok) {
            console.log('✅ Server is running\n');
        } else {
            console.log('❌ Server is not responding properly\n');
            return;
        }

        // Test 2: Login API
        console.log('2️⃣ Testing login API...');
        const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123',
                role: 'admin'
            })
        });

        console.log(`Login Status: ${loginResponse.status}`);
        
        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            console.log('✅ Login successful');
            console.log('Token received:', loginData.token ? 'Yes' : 'No');
            console.log('User role:', loginData.user?.role);
            
            // Test 3: Protected API with token
            console.log('\n3️⃣ Testing protected API...');
            const protectedResponse = await fetch(`${BASE_URL}/api/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${loginData.token}`
                }
            });
            
            console.log(`Protected API Status: ${protectedResponse.status}`);
            
            if (protectedResponse.ok) {
                const usersData = await protectedResponse.json();
                console.log('✅ Protected API working');
                console.log(`Found ${usersData.length} users in database`);
            } else {
                console.log('❌ Protected API failed');
                const errorText = await protectedResponse.text();
                console.log('Error:', errorText);
            }
            
        } else {
            console.log('❌ Login failed');
            const errorText = await loginResponse.text();
            console.log('Error:', errorText);
            console.log('\n💡 This usually means:');
            console.log('   - Admin user does not exist in production database');
            console.log('   - Database connection is not working');
            console.log('   - Environment variables are not set correctly');
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n💡 Possible issues:');
        console.log('   - Server is not running');
        console.log('   - Wrong BASE_URL');
        console.log('   - Network connectivity issues');
    }
}

testProduction(); 