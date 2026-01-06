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

// Admin-only mutation routes, Admin/Lecturer read routes
router.get('/', authenticate, isAdminOrLecturer, getAllStudents);
router.get('/:id', authenticate, isAdminOrLecturer, getStudentById);
router.post('/', authenticate, isAdmin, addStudent);
router.put('/:id', authenticate, isAdmin, updateStudent);
router.delete('/:id', authenticate, isAdmin, deleteStudent);

// Student route (own profile)
router.get('/profile/me', authenticate, getMyProfile);

module.exports = router;

