const Patient = require('../models/Patient');
const { OptimisticLockError } = require('sequelize');

exports.createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePatient = async (req, res) => {
  const { id } = req.params;
  const { version, ...data } = req.body;

  if (version === undefined) {
    return res.status(400).json({ error: 'Version is required for updates' });
  }

  try {
    const patient = await Patient.findByPk(id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    if (patient.version !== parseInt(version, 10)) {
      return res.status(409).json({
        error: 'Conflict: The record has been modified by another user. Please reload and try again.',
        currentVersion: patient.version
      });
    }

    // Apply updates
    Object.assign(patient, data);
    await patient.save();

    res.json(patient);
  } catch (error) {
    if (error instanceof OptimisticLockError) {
      return res.status(409).json({ error: 'Conflict: Data race detected. Please retry.' });
    }
    res.status(500).json({ error: error.message });
  }
};
