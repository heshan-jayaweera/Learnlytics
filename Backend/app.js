require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors(
  {
    origin: ["https://deploy-mern-1whq.vercel.app"],
    methods:["POST","GET"],
    credentials:true
  }

// Middleware
app.use(cors());
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
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://lecturer:MKiPSxKCiGSg1PiF@cluster0.cjvhnm4.mongodb.net/learnlytics";
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
