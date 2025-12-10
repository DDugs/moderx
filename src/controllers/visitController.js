const Visit = require('../models/Visit');
const Patient = require('../models/Patient');

exports.addVisit = async (req, res) => {
  const { patientId } = req.body;
  try {
    // Verify patient exists
    const patient = await Patient.findByPk(patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const visit = await Visit.create(req.body);
    res.status(201).json(visit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
