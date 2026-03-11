const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  years: Number,
  description: String
});

const EmployeeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  department: { type: String, index: true },
  
  // Profile Data
  skills: [{ type: String }],
  experience: [ExperienceSchema],
  education: [{ type: String }],
  certifications: [{ type: String }],
  
  // AI Analytics
  fitmentScore: { type: Number, default: 0 },
  recommendedRole: { type: String, default: 'Pending Analysis', index: true },
  performanceScore: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now }
});

// Compound index for Analytics queries
EmployeeSchema.index({ department: 1, recommendedRole: 1 });

module.exports = mongoose.model('Employee', EmployeeSchema);
