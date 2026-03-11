const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  timeLimitMinutes: { type: Number, default: 30 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
