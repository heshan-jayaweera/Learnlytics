const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  course: {
    type: [String],
    required: true,
    default: []
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 2
  },
  dateOfBirth: {
    type: Date
  },
  contactNumber: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);

