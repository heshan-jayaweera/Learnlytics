const User = require('../model/User');
const Student = require('../model/Student');
const { generateToken } = require('../middleware/auth');

// Register new user
const register = async (req, res) => {
  try {
    const { email, password, role, name, studentId } = req.body;

    // Only allow student registration through public registration endpoint
    // Admin and lecturer accounts must be created by existing admins
    if (role && role !== 'student') {
      return res.status(403).json({ 
        message: 'Admin and lecturer accounts cannot be created through public registration. Please contact an administrator.' 
      });
    }

    // Force role to be student for public registration
    const userRole = 'student';

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Student ID is required for student registration
    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required for student registration' });
    }
    
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(400).json({ message: 'Student ID not found. Please contact admin.' });
    }
    
    // Check if studentId already has an account
    const existingStudentUser = await User.findOne({ studentId });
    if (existingStudentUser) {
      return res.status(400).json({ message: 'Account already exists for this student ID' });
    }

    // Create new user (only students can register)
    const user = new User({
      email,
      password,
      role: userRole,
      name,
      studentId
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        studentId: user.studentId
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        studentId: user.studentId
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile
};

