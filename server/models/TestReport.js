const mongoose = require('mongoose');

const TestReportSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  clinicName: {
    type: String,
    default: 'Clinic',
  },
  testName: {
    type: String,
    required: true,
  },
  result: {
    type: String,
    required: true,
  },
  normalRange: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Normal', 'Abnormal', 'Critical'],
    default: 'Normal',
  },
  notes: {
    type: String,
    default: '',
  },
  reportDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('TestReport', TestReportSchema);