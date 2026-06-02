const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const authMiddleware = require('../middleware/auth');

// GET /api/patients/search/:patientId — Search patient by ID
router.get('/search/:patientId', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findOne({
      patientId: req.params.patientId.toUpperCase(),
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/patients — List all patients (with optional name search)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.query;
    const query = name ? { name: { $regex: name, $options: 'i' } } : {};
    const patients = await Patient.find(query).sort({ createdAt: -1 }).limit(50);
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/patients — Add new patient
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { patientId, name, age, gender, phone, bloodGroup, address, allergies } = req.body;

    const existing = await Patient.findOne({ patientId: patientId.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: 'Patient ID already exists' });
    }

    const patient = new Patient({ patientId, name, age, gender, phone, bloodGroup, address, allergies });
    await patient.save();

    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;