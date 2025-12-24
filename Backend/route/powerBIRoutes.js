const express = require('express');
const router = express.Router();
const { generateEmbedToken } = require('../controllers/powerBIController');
const { authenticate, isAdminOrLecturer } = require('../middleware/auth');

// Generate Power BI embed token (Admin/Lecturer only)
router.get('/embed-token', authenticate, isAdminOrLecturer, generateEmbedToken);

module.exports = router;

