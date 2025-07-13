import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import config from './config.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import studentRoutes from './routes/student.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors({
    origin: config.ALLOWED_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Detailed request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    console.log(`\n=== ${new Date().toISOString()} ===`);
    console.log(`${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }

    // Log route parameters
    if (Object.keys(req.params).length > 0) {
        console.log('Route params:', req.params);
    }

    // Log query parameters
    if (Object.keys(req.query).length > 0) {
        console.log('Query params:', req.query);
    }

    // Capture response
    const oldSend = res.send;
    res.send = function(data) {
        console.log(`Response Status: ${res.statusCode}`);
        if (data) {
            console.log('Response Data:', typeof data === 'string' ? data : JSON.stringify(data, null, 2));
        }
        console.log(`Request took ${Date.now() - start}ms\n`);
        return oldSend.apply(res, arguments);
    };

    next();
});

// API routes - Order matters for route matching
app.use('/api/auth', authRoutes);
app.use('/api/teacher', teacherRoutes); // Teacher routes before admin routes
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/attendance', attendanceRoutes);

// Serve static files with proper MIME types
app.use(express.static(__dirname, {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        }
    }
}));

// Serve index.html for root path
app.get('/', (req, res) => {
    console.log('Serving index.html');
    res.sendFile(join(__dirname, 'index.html'));
});

// Add a route for the password reset page
app.get('/reset.html', (req, res) => {
    console.log('Serving reset.html');
    res.sendFile(join(__dirname, 'reset.html'));
});

// Handle HTML routes with logging
const htmlFiles = [
    '/login.html',
    '/admin-dashboard.html',
    '/teacher-panel.html',
    '/student-management.html',
    '/teacher-management.html',
    '/take-attendance.html',
    '/view-reports.html',
    '/notifications.html',
    '/settings.html',
    '/schedule.html'
];

htmlFiles.forEach(file => {
    app.get(file, (req, res) => {
        console.log(`Serving ${file}`);
        res.sendFile(join(__dirname, file.substring(1)));
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Handle 404s with detailed logging
app.use((req, res) => {
    console.log(`\n=== 404 Not Found ===`);
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log(`Headers:`, req.headers);
    console.log(`Query:`, req.query);
    console.log(`Body:`, req.body);
    console.log(`Params:`, req.params);
    
    if (req.path.startsWith('/api/')) {
        res.status(404).json({ 
            message: 'API endpoint not found',
            path: req.path,
            method: req.method
        });
    } else {
        res.status(404).sendFile(join(__dirname, 'index.html'));
    }
});

// Connect to MongoDB
console.log('Connecting to MongoDB...');
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully');
        
        // Start server
        const port = config.PORT || 3003;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log('\nAvailable routes:');
            console.log('- GET  /                  - Home page');
            console.log('- GET  /login.html        - Login page');
            console.log('- GET  /teacher-panel.html - Teacher Panel');
            console.log('- POST /api/auth/login    - Login endpoint');
            console.log('- GET  /api/auth/verify   - Token verification');
            console.log('- GET  /api/teacher/:id/students - Get teacher\'s students');
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }); 