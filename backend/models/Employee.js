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
  
  // WDT & Workload Data
  workingHours: {
    customerInvoicing: { type: Number, default: 0 },
    invoicePosting: { type: Number, default: 0 },
    paymentProcessing: { type: Number, default: 0 },
    mdmSupport: { type: Number, default: 0 },
    recordToReport: { type: Number, default: 0 },
    treasury: { type: Number, default: 0 },
    taxation: { type: Number, default: 0 },
    meetings: { type: Number, default: 0 },
    training: { type: Number, default: 0 },
    others: { type: Number, default: 0 },
    standardWorkingHours: { type: Number, default: 160 },
    actualWorkingHours: { type: Number, default: 160 },
    overtimeHours: { type: Number, default: 0 },
    weekendWork: { type: String },
    multipleRoles: { type: String },
    deadlinePressure: { type: String }
  },

  // Metadata from Master
  employeeMaster: { type: Object },
  processCharacteristics: { type: Object },
  experienceCompensation: { type: Object },
  fitmentResponses: { type: Object },

  // AI Analytics
  fitmentScore: { type: Number, default: 0 },
  recommendedRole: { type: String, default: 'Pending Analysis', index: true },
  performanceScore: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now }
});

// Compound index for Analytics queries
EmployeeSchema.index({ department: 1, recommendedRole: 1 });

module.exports = mongoose.model('Employee', EmployeeSchema);
