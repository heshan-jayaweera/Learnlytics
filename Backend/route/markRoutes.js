const express = require('express');
const router = express.Router();
const {
  addMarks,
  updateMarks,
  getAllMarks,
  getStudentMarks,
  getMyMarks,
  getMarksStatistics,
  deleteMarks,
  getStudentGpa,
  getMyGpa,
  exportMarksForPowerBI
} = require('../controllers/markController');
const { authenticate, isAdminOrLecturer, isAdmin } = require('../middleware/auth');

// Power BI export route (no auth required for internal use)
router.get('/export/powerbi', exportMarksForPowerBI);

// Admin/Lecturer routes
router.get('/', authenticate, isAdminOrLecturer, getAllMarks);
router.get('/statistics', authenticate, isAdminOrLecturer, getMarksStatistics);
router.get('/student/:studentId', authenticate, isAdminOrLecturer, getStudentMarks);
router.get('/gpa/:studentId', authenticate, isAdminOrLecturer, getStudentGpa);
router.post('/', authenticate, isAdminOrLecturer, addMarks);
router.put('/:id', authenticate, isAdminOrLecturer, updateMarks);
router.delete('/:id', authenticate, isAdmin, deleteMarks);

// Student route (own marks)
router.get('/me', authenticate, getMyMarks);
router.get('/me/gpa', authenticate, getMyGpa);

module.exports = router;

