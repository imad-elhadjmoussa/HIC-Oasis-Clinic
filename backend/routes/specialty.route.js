const express = require('express');
const router = express.Router();
const specialtyController = require('../controllers/specialty.controller');

// GET /api/specialties - Get all specialties
router.get('/', specialtyController.getSpecialties);
router.get('/:specialtyId/details', specialtyController.getSpecialtyDetails);

module.exports = router;
