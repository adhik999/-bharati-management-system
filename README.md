# BVIT Attendance Management System

A comprehensive educational management system for BVIT (Bharati Vidyapeeth Institute of Technology) that handles student attendance, teacher management, and administrative tasks.

## Features

- **User Authentication**: Secure login system with role-based access
- **Admin Dashboard**: Complete administrative control panel
- **Teacher Panel**: Attendance management and student tracking
- **Student Management**: Comprehensive student database
- **Attendance Tracking**: Real-time attendance recording and reporting
- **Reports Generation**: Detailed attendance and performance reports
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: Custom CSS with modern design

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd BHARATI
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm start
```

5. Open your browser and visit:
```
http://localhost:3003
```

## Default Admin Credentials

- **Username**: admin
- **Password**: admin123
- **Role**: admin

## Environment Variables

Create a `.env` file with the following variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bvit_attendance
JWT_SECRET=your_super_secure_jwt_secret_key_here_2024
PORT=3003
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3003,http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - User logout

### Admin Routes
- `GET /api/admin/users` - Get all users
- `POST /api/admin/create-user` - Create new user
- `PUT /api/admin/update-user/:id` - Update user
- `DELETE /api/admin/delete-user/:id` - Delete user

### Teacher Routes
- `GET /api/teacher/:id/students` - Get teacher's students
- `POST /api/teacher/attendance` - Record attendance

### Student Routes
- `GET /api/student/:id` - Get student details
- `GET /api/student/:id/attendance` - Get student attendance

### Attendance Routes
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Create attendance record
- `PUT /api/attendance/:id` - Update attendance record
- `DELETE /api/attendance/:id` - Delete attendance record

## Deployment

### Render (Recommended)

1. Push your code to GitHub
2. Sign up at [render.com](https://render.com)
3. Connect your GitHub repository
4. Create a new Web Service
5. Set environment variables
6. Deploy!

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bvit_attendance
JWT_SECRET=your_super_secure_jwt_secret_key_here_2024
NODE_ENV=production
ALLOWED_ORIGINS=https://your-app-name.onrender.com
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team. 