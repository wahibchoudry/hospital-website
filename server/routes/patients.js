router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('BODY:', req.body); // add this
    console.log('DECODED TOKEN:', req.doctor); // add this
const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const authMiddleware = require('../middleware/auth');

router.get('/search/:cnicId', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findOne({ cnicId: req.params.cnicId });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

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

router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('BODY:', JSON.stringify(req.body));
    const { cnicId, name, age, gender, phone, bloodGroup, address, allergies } = req.body;
    const existing = await Patient.findOne({ cnicId });
    if (existing) return res.status(400).json({ message: 'CNIC already registered' });
    const patient = new Patient({ cnicId, name, age, gender, phone, bloodGroup, address, allergies });
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    console.error('PATIENT ERROR:', err.message);
    res.status(500).json({ message: err.message, error: err.message });
  }
});

module.exports = router;
