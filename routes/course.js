const express = require('express');
const { createCourse, getAllCourse } = require('../controllers/course/course');
const { checkAuthentication } = require('../middlewares/auth');
const router = express.Router();

// Create Course
router.post('/',checkAuthentication, createCourse);

// Get All Courses
router.get('/',checkAuthentication, getAllCourse);

module.exports = router;