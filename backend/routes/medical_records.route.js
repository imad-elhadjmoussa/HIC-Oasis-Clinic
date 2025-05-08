
const express = require('express');
const router = express.Router();

const medicalRecordsController = require('../controllers/medical_records.controller.js');

router.get('/', medicalRecordsController.getMedicalsRecords);
router.get('/:id/summary', medicalRecordsController.getMedicalsRecordSummary);
router.get('/:id', medicalRecordsController.getMedicalRecord);
// router.get('/patient/:patientId', medicalRecordsController.getMedicalByPatientId);
router.post('/', medicalRecordsController.createMedicalRecord);
router.patch('/:id', medicalRecordsController.updateMedicalRecord);

module.exports = router;   