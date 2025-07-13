import fetch from 'node-fetch';

// Configuration - UPDATE THESE VALUES
const PRODUCTION_URL = 'https://your-app-name.onrender.com'; // Replace with your actual URL
const LOCAL_URL = 'http://localhost:3003';

async function diagnoseProduction() {
    console.log('🔍 Diagnosing Production Deployment Issues');
    console.log('==========================================\n');

    const urls = [
        { name: 'Production', url: PRODUCTION_URL },
        { name: 'Local', url: LOCAL_URL }
    ];

    for (const { name, url } of urls) {
        console.log(`\n${name.toUpperCase()} SERVER TEST:`);
        console.log('URL:', url);
        
        try {
            // Test 1: Server Status
            console.log('\n1️⃣ Testing server status...');
            const serverResponse = await fetch(`${url}/`);
            console.log(`Status: ${serverResponse.status}`);
            console.log(`Content-Type: ${serverResponse.headers.get('content-type')}`);
            
            if (serverResponse.ok) {
                console.log('✅ Server is responding');
            } else {
                console.log('❌ Server error');
                continue;
            }

            // Test 2: Login API
            console.log('\n2️⃣ Testing login API...');
            const loginResponse = await fetch(`${url}/api/auth/login`, {
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
            console.log(`Login Content-Type: ${loginResponse.headers.get('content-type')}`);

            if (loginResponse.ok) {
                const loginData = await loginResponse.json();
                console.log('✅ Login API working');
                console.log('Response:', JSON.stringify(loginData, null, 2));
            } else {
                const errorText = await loginResponse.text();
                console.log('❌ Login API failed');
                console.log('Error response:', errorText.substring(0, 200));
                
                if (errorText.includes('<html>')) {
                    console.log('🚨 ISSUE FOUND: API returning HTML instead of JSON!');
                    console.log('This is likely a CORS or routing issue.');
                }
            }

            // Test 3: Check if it's a CORS issue
            console.log('\n3️⃣ Testing CORS...');
            const corsResponse = await fetch(`${url}/api/auth/login`, {
                method: 'OPTIONS',
                headers: {
                    'Origin': 'http://localhost:3000',
                    'Access-Control-Request-Method': 'POST',
                    'Access-Control-Request-Headers': 'Content-Type'
                }
            });
            
            console.log(`CORS Status: ${corsResponse.status}`);
            console.log(`CORS Headers:`, {
                'Access-Control-Allow-Origin': corsResponse.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Methods': corsResponse.headers.get('Access-Control-Allow-Methods'),
                'Access-Control-Allow-Headers': corsResponse.headers.get('Access-Control-Allow-Headers')
            });

        } catch (error) {
            console.log(`❌ ${name} test failed:`, error.message);
        }
    }

    console.log('\n\n🔧 RECOMMENDED FIXES:');
    console.log('1. Check your environment variables in Render/Heroku');
    console.log('2. Verify MONGODB_URI is set correctly');
    console.log('3. Update ALLOWED_ORIGINS to include your production URL');
    console.log('4. Make sure your server is actually running');
    console.log('5. Check if your domain/URL is correct');
}

// Instructions for user
console.log('📋 BEFORE RUNNING THIS SCRIPT:');
console.log('1. Update the PRODUCTION_URL variable with your actual deployment URL');
console.log('2. Make sure your server is deployed and running');
console.log('3. Check your environment variables in your hosting platform\n');

diagnoseProduction(); 