const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { isAdmin, isAuthorized } = require('../middleware/roleMiddleware');

// User Operations (Doctors / Admin)
router.get('/', isAuthorized, patientController.getPatients);
router.get('/:id', isAuthorized, patientController.getPatientById);

// Admin Operations
router.post('/', isAdmin, patientController.createPatient);
router.put('/:id', isAdmin, patientController.updatePatient);

module.exports = router;
