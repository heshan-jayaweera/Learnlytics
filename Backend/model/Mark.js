const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    ref: 'Student'
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  courseCode: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    ref: 'Course'
  },
  course: {
    type: String,
    required: true,
    trim: true
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
  assessmentType: {
    type: String,
    enum: ['assignment', 'quiz', 'midterm', 'final', 'project', 'lab'],
    required: true
  },
  marksObtained: {
    type: Number,
    required: true,
    min: 0
  },
  totalMarks: {
    type: Number,
    required: true,
    min: 0
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  remarks: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
markSchema.index({ studentId: 1, subject: 1, assessmentType: 1 });
markSchema.index({ studentId: 1, year: 1, semester: 1 });
markSchema.index({ studentId: 1, courseCode: 1 });

module.exports = mongoose.model('Mark', markSchema);

