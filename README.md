# SignVerse - Student Attendance Tracker

A comprehensive MERN stack application for managing student attendance with role-based authentication for students, teachers, and administrators.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Student, Teacher, Admin)
- Secure password hashing with bcrypt
- Protected routes and middleware

### Student Features
- Dynamic attendance dashboard with real-time data
- Day-wise and subject-wise attendance tracking
- Interactive calendar with leave requests
- Communication with teachers via posts/queries
- Profile management

### Teacher Features
- Class management and student overview
- Attendance marking and tracking
- Student communication and post replies
- Class attendance analytics
- Profile management

### Admin Features
- Complete user management (CRUD operations)
- Class creation and management
- Attendance record management
- System statistics and analytics
- Full administrative control

## 🛠️ Tech Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

### Frontend
- React 19 with Vite
- React Router for navigation
- Axios for API calls
- Recharts for data visualization
- Tailwind CSS for styling
- React Calendar for calendar functionality

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
# Database Configuration
CONNECTION_STRING=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/signverse?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Server Configuration
PORT=8000
NODE_ENV=development
```

4. Seed the database with sample data:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

The backend will be running on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend/vite-project
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

## 🔐 Demo Credentials

After running the seed script, you can use these credentials to test the application:

### Administrator
- **Email:** admin@example.com
- **Password:** 12345

### Teacher
- **Email:** smith@example.com
- **Password:** 12345
- **Teacher ID:** T001

### Student
- **Email:** alice@example.com
- **Password:** 12345
- **Roll Number:** S001

## 📁 Project Structure

```
SignVerse/
├── backend/
│   ├── config/
│   │   └── dbConnection.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── attdController.js
│   │   ├── postController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── attd.js
│   │   ├── cal.js
│   │   ├── class.js
│   │   ├── post.js
│   │   └── user.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── attdRoutes.js
│   │   ├── postRoutes.js
│   │   └── userRoutes.js
│   ├── server.js
│   └── seed.js
├── frontend/vite-project/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── assets/
│   └── public/
└── README.md
```

## 🚀 Deployment

### Backend Deployment (Render/Vercel)
1. Create a MongoDB Atlas cluster
2. Set up environment variables in your deployment platform
3. Deploy the backend code
4. Update the frontend API base URL

### Frontend Deployment (Netlify/Vercel)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure environment variables if needed

## 🔧 API Endpoints

### Authentication
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Admin Routes (Protected)
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/classes` - Get all classes
- `POST /api/admin/classes` - Create new class
- `PUT /api/admin/classes/:id` - Update class
- `DELETE /api/admin/classes/:id` - Delete class
- `GET /api/admin/attendance` - Get all attendance records
- `PUT /api/admin/attendance/:id` - Update attendance record
- `DELETE /api/admin/attendance/:id` - Delete attendance record

### Posts/Communication (Protected)
- `POST /api/posts/student` - Send post from student to teacher
- `GET /api/posts/student/:id` - Get student posts
- `GET /api/posts/teacher/:id` - Get teacher posts
- `POST /api/posts/reply/:postId` - Reply to a post
- `PUT /api/posts/:id/status` - Update post status

### Attendance (Protected)
- `GET /api/student/:id/dashboard` - Get student attendance summary
- `GET /api/student/:id/dashboard/day-wise` - Get day-wise attendance
- `GET /api/student/:id/dashboard/sub-wise` - Get subject-wise attendance
- `GET /api/teacher/:id/dashboard` - Get teacher's assigned classes
- `POST /api/teacher/:id/dashboard/:className` - Mark attendance
- `GET /api/teacher/:id/dashboard/:className/view` - Get class student list

## 🎨 UI Features

- **Glassmorphism Design** - Modern glass-like UI components
- **Dark Theme** - Consistent dark theme across the application
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Interactive Charts** - Real-time data visualization with Recharts
- **Calendar Integration** - Interactive calendar for attendance tracking
- **Role-based Navigation** - Dynamic sidebar based on user role

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API endpoints
- Input validation and sanitization
- CORS configuration

## 📊 Data Models

### User Model
- Role (student/teacher/admin)
- Personal information (name, email)
- Role-specific IDs (rollNo for students, teacherId for teachers)
- Password (hashed)
- Class assignments and subjects

### Attendance Model
- Student reference
- Class reference
- Subject
- Date
- Status (Present/Absent)
- Marked by (teacher reference)

### Post Model
- Sender and receiver references
- Message content
- Type (leave_request, complaint, question, general)
- Reply and status tracking
- Timestamps

### Class Model
- Class name
- Student and teacher references
- Timestamps

## 🚀 Future Enhancements

- Real-time notifications
- Email notifications for leave requests
- Bulk attendance marking
- Advanced analytics and reporting
- Mobile app development
- Integration with external calendar systems
- Automated attendance tracking
- Parent portal access

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**SignVerse** - Making attendance tracking simple and efficient! 🎓


