const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;

    const existing = await Doctor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Doctor already registered with this email' });
    }

    const doctor = new Doctor({ name, email, password, specialization });
    await doctor.save();

    res.status(201).json({ message: 'Doctor registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await doctor.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: doctor._id, name: doctor.name, email: doctor.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/auth/patient-login
router.post('/patient-login', async (req, res) => {
  try {
    const { patientId, phone } = req.body;
    const Patient = require('../models/Patient');
    const patient = await Patient.findOne({ 
      patientId: patientId.toUpperCase() 
    });
    if (!patient) return res.status(400).json({ message: 'Patient ID not found' });
    if (patient.phone !== phone) return res.status(400).json({ message: 'Phone number incorrect' });
    const token = jwt.sign(
      { id: patient._id, patientId: patient.patientId, role: 'patient' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, patient: { id: patient._id, name: patient.name, patientId: patient.patientId } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/auth/clinic-login  
router.post('/clinic-login', async (req, res) => {
  try {
    const { clinicCode } = req.body;
    if (clinicCode !== process.env.CLINIC_CODE) {
      return res.status(400).json({ message: 'Invalid clinic code' });
    }
    const token = jwt.sign(
      { role: 'clinic', clinicCode },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, clinic: { name: 'Clinic Staff' } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;