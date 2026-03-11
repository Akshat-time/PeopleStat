const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnalyticsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee' },
  date: { type: Date, default: Date.now },
  productivity: Number,
  fatigueScore: Number,
  softSkillScore: Number,
  hardSkillScore: Number,
  notes: String,
  meta: Schema.Types.Mixed
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
