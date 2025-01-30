const express = require('express');
const { createEnrollment, getAllEnrollment, deleteEnrollment } = require('../controllers/enrollment/enrollment');
const { checkAuthentication } = require('../middlewares/auth');
const router = express.Router();

// Create enrollment
router.post('/',checkAuthentication,createEnrollment);

// Get enrollment
router.get('/',checkAuthentication,getAllEnrollment);

// Delete enrollment
router.delete('/:id',checkAuthentication,deleteEnrollment);

module.exports = router;