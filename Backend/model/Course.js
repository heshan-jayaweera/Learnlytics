const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  credits: {
    type: Number,
    required: true,
    min: 0
  },
  year: {
    type: Number,
    min: 1,
    max: 5
  },
  semester: {
    type: Number,
    min: 1,
    max: 2
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

courseSchema.index({ code: 1 });
courseSchema.index({ year: 1, semester: 1 });

module.exports = mongoose.model('Course', courseSchema);

