# Learnlytics - Student Academic Data Management System

A comprehensive system for managing student academic data and analyzing performance using Power BI dashboards.

## 🎯 Features

### Admin / Lecturer
- ✅ Add and manage students
- ✅ Enter and update marks
- ✅ View analytics and Power BI dashboards
- ✅ Generate statistics and reports

### Student
- ✅ View own academic results
- ✅ Filter results by subject, year, semester
- ✅ View performance statistics

## 🏗️ System Architecture

```
React Frontend
     ↓
Node.js + Express API
     ↓
MongoDB (Student & Marks Data)
     ↓
Power BI Dataset
     ↓
Power BI Reports (Embedded)
```

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Bootstrap + Material-UI |
| Backend | Node.js + Express |
| Database | MongoDB |
| Analytics | Power BI Desktop + Service |
| Auth | JWT |
| Hosting | Azure / Render (optional) |

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Power BI Pro/Premium account (for analytics)
- npm or yarn

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string and JWT secret:
```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
PORT=5000
```

5. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your API URL:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Students (Admin/Lecturer)
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Add new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Students (Student Role)
- `GET /api/students/profile/me` - Get own profile

### Marks (Admin/Lecturer)
- `GET /api/marks` - Get all marks
- `GET /api/marks/student/:studentId` - Get marks for a student
- `GET /api/marks/statistics` - Get marks statistics
- `POST /api/marks` - Add marks
- `PUT /api/marks/:id` - Update marks
- `DELETE /api/marks/:id` - Delete marks

### Marks (Student Role)
- `GET /api/marks/me` - Get own marks

### Power BI (Admin/Lecturer)
- `GET /api/powerbi/embed-token` - Get Power BI embed token

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## 📊 Power BI Integration

**Having issues connecting to Power BI?** See below for quick fixes.

See [POWER_BI_SETUP.md](./POWER_BI_SETUP.md) for detailed instructions on setting up Power BI embedding.

### Quick Fixes & Guides

| Issue | Solution |
|-------|----------|
| "No visible columns" error from MongoDB | 👉 [POWER_BI_QUICK_FIX.md](./POWER_BI_QUICK_FIX.md) |
| Need step-by-step Power BI setup | 👉 [POWER_BI_STEP_BY_STEP.md](./POWER_BI_STEP_BY_STEP.md) |
| Want comprehensive technical details | 👉 [POWER_BI_MONGODB_FIX.md](./POWER_BI_MONGODB_FIX.md) |
| See what was changed | 👉 [POWER_BI_CHANGES.md](./POWER_BI_CHANGES.md) |

### Connecting Power BI

**New: Use API Endpoints (Recommended)**
- Marks data: `http://localhost:5000/api/marks/export/powerbi`
- Students data: `http://localhost:5000/api/students/export/powerbi`

This avoids MongoDB connection issues and provides clean, flat data for Power BI.

**Alternative: Direct MongoDB**
- See [POWER_BI_SETUP.md](./POWER_BI_SETUP.md) step 1

## 🗄️ Database Schema

### User Model
- email (unique)
- password (hashed)
- role (admin, lecturer, student)
- name
- studentId (for students)

### Student Model
- studentId (unique)
- name
- email (unique)
- course
- year (1-5)
- semester (1-2)
- dateOfBirth
- contactNumber

### Mark Model
- studentId
- subject
- course
- year
- semester
- assessmentType (assignment, quiz, midterm, final, project, lab)
- marksObtained
- totalMarks
- percentage
- grade (A+, A, A-, B+, B, B-, C+, C, C-, D, F)
- date
- remarks

## 🧪 Testing

### Create Test Users

1. **Admin User**:
   - Register with role "admin"
   - No student ID required

2. **Lecturer User**:
   - Register with role "lecturer"
   - No student ID required

3. **Student User**:
   - First, add student via Admin dashboard
   - Then register with role "student" and provide the student ID

## 📝 Usage Flow

1. **Admin/Lecturer**:
   - Login → Dashboard
   - Add students → Enter marks → View analytics

2. **Student**:
   - Register with student ID → Login → View results

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Protected API routes
- CORS configuration

## 🐛 Troubleshooting

### Backend Issues
- Check MongoDB connection string
- Verify JWT_SECRET is set
- Check port 5000 is available

### Frontend Issues
- Verify REACT_APP_API_URL matches backend URL
- Check browser console for errors
- Clear browser cache and localStorage

### Power BI Issues
- See [POWER_BI_SETUP.md](./POWER_BI_SETUP.md) troubleshooting section

## 📄 License

ISC

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions, please open an issue on the repository.

