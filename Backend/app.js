require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./model/User');

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./route/authRoutes'));
app.use('/api/students', require('./route/studentRoutes'));
app.use('/api/marks', require('./route/markRoutes'));
app.use('/api/courses', require('./route/courseRoutes'));
app.use('/api/powerbi', require('./route/powerBIRoutes'));

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Student Academic Data Management API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Database connection
const MongoDB_URI = process.env.MongoDB_URI;
const PORT = process.env.PORT || 5000;

// Seed a default admin if none exists
const seedDefaultAdmin = async () => {
  const adminEmail = 'heshan@learnlytics.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    return;
  }

  const admin = new User({
    email: adminEmail,
    password: '1234',
    role: 'admin',
    name: 'Heshan'
  });

  // Bypass minlength validation on the raw password (hashed value will be long)
  await admin.save({ validateBeforeSave: false });
  console.log('Seeded default admin user:', adminEmail);
};

mongoose.connect(MongoDB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      await seedDefaultAdmin();
    } catch (seedErr) {
      console.error('Error seeding default admin:', seedErr);
    }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });