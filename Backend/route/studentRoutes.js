const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
  getMyProfile,
  exportStudentsForPowerBI
} = require('../controllers/studentController');
const { authenticate, isAdminOrLecturer, isAdmin } = require('../middleware/auth');

// Power BI export route (no auth required for internal use)
router.get('/export/powerbi', exportStudentsForPowerBI);

// Admin/Lecturer routes
router.get('/', authenticate, isAdminOrLecturer, getAllStudents);
router.get('/:id', authenticate, isAdminOrLecturer, getStudentById);
router.post('/', authenticate, isAdminOrLecturer, addStudent);
router.put('/:id', authenticate, isAdminOrLecturer, updateStudent);
router.delete('/:id', authenticate, isAdmin, deleteStudent);

// Student route (own profile)
router.get('/profile/me', authenticate, getMyProfile);

module.exports = router;

