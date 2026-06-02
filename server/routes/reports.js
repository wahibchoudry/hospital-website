const express = require('express');
const router = express.Router();
const TestReport = require('../models/TestReport');
const Patient = require('../models/Patient');
const authMiddleware = require('../middleware/auth');

// GET /api/reports/patient/:patientId — get all reports for a patient
router.get('/patient/:patientId', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findOne({
      patientId: req.params.patientId.toUpperCase()
    });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const reports = await TestReport.find({ patient: patient._id })
      .sort({ reportDate: -1 });

    res.json({ patient, reports });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/reports — add new test report
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { patientId, clinicName, testName, result, normalRange, status, notes, reportDate } = req.body;

    const patient = await Patient.findOne({
      patientId: patientId.toUpperCase()
    });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const report = new TestReport({
      patient: patient._id,
      clinicName,
      testName,
      result,
      normalRange,
      status,
      notes,
      reportDate: reportDate || Date.now(),
    });

    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;