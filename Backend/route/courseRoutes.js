const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCoursesForPowerBI,
  getCourseByCode,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.get('/', authenticate, getCourses);
router.get('/export/powerbi', authenticate, isAdmin, getCoursesForPowerBI);
router.get('/:code', authenticate, getCourseByCode);
router.post('/', authenticate, isAdmin, createCourse);
router.put('/:code', authenticate, isAdmin, updateCourse);
router.delete('/:code', authenticate, isAdmin, deleteCourse);

module.exports = router;

