const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  cnicId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  phone: {
    type: String,
    default: '',
  },
  bloodGroup: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  allergies: {
    type: String,
    default: 'None',
  },
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);