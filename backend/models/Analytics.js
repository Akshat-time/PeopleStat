const mongoose = require('mongoose');

const DepartmentMetricSchema = new mongoose.Schema({
  departmentName: String,
  headcount: Number,
  averageFitment: Number,
  averagePerformance: Number
});

const AnalyticsSchema = new mongoose.Schema({
  snapshotDate: { type: Date, default: Date.now },
  totalEmployees: { type: Number, required: true },
  companyAverageFitment: { type: Number, required: true },
  companyAveragePerformance: { type: Number, required: true },
  departmentMetrics: [DepartmentMetricSchema],
  topSkillGaps: [{
    skill: String,
    missingCount: Number
  }]
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
