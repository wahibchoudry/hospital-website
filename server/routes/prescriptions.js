const express = require('express');
const router = express.Router();
const Prescription = require('../models/prescription');
const Patient = require('../models/patient');
const authMiddleware = require('../middleware/auth');

// GET /api/prescriptions/patient/:cnicId — All prescriptions for a patient
router.get('/patient/:cnicId', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findOne({
      cnicId: req.params.cnicId,
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const prescriptions = await Prescription.find({ patient: patient._id })
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });

    res.json({ patient, prescriptions });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/prescriptions — Add new prescription
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { cnicId, diagnosis, medicines, notes, followUpDate } = req.body;

    const patient = await Patient.findOne({ cnicId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const prescription = new Prescription({
      patient: patient._id,
      doctor: req.doctor.id,
      diagnosis,
      medicines,
      notes,
      followUpDate: followUpDate || null,
    });

    await prescription.save();
    await prescription.populate('doctor', 'name specialization');

    res.status(201).json(prescription);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;