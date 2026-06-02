const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: String,
  dosage: String,
  frequency: String,
  duration: String,
});

const PrescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  diagnosis: {
    type: String,
    required: true,
  },
  medicines: [MedicineSchema],
  notes: {
    type: String,
    default: '',
  },
  followUpDate: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', PrescriptionSchema);