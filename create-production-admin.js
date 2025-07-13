import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bvit_attendance';
const dbName = process.env.MONGODB_URI ? process.env.MONGODB_URI.split('/').pop().split('?')[0] : 'bvit_attendance';

async function createProductionAdmin() {
    try {
        console.log('🔗 Connecting to database...');
        console.log('Database URL:', url);
        console.log('Database Name:', dbName);
        
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        
        console.log('✅ Connected to database successfully');
        
        // Check if admin exists
        const adminExists = await db.collection('users').findOne({ role: 'admin' });
        if (adminExists) {
            console.log('⚠️ Admin already exists');
            console.log('Admin details:', {
                username: adminExists.username,
                email: adminExists.email,
                name: adminExists.name
            });
            await client.close();
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Create admin user
        const result = await db.collection('users').insertOne({
            username: 'admin',
            password: hashedPassword,
            email: 'admin@bvit.edu.in',
            name: 'System Administrator',
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log('✅ Admin user created successfully');
        console.log('Admin ID:', result.insertedId);
        console.log('Login credentials:');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('Role: admin');
        
        await client.close();
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        console.log('Make sure your MONGODB_URI environment variable is set correctly');
    }
}

createProductionAdmin(); 