import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  userid: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, sparse: true },
  department: String,
  position: String,
  salary: Number,
  joiningDate: Date,
  experience: Number,
  softskills: String,
  performance: String,
  location: String,
  productivity: { type: Number, min: 0, max: 100 },
  utilization: { type: Number, min: 0, max: 100 },
  fitmentScore: { type: Number, min: 0, max: 10 },
  currentRole: String,
  recommendedRole: String,
  automationPotential: Number,
  fatigueScore: Number,
  skills: {
    soft: [String],
    hard: [String],
  },
  tags: [String],
  consolidatedCount: Number,
  nonConsolidatedCount: Number,
  processes: [{
    name: String,
    hours: Number,
    output: String,
    repetitiveScore: Number,
  }],
  documents: [{
    name: String,
    type: String,
    uploadDate: Date,
  }],
  productivityHistory: [{
    month: String,
    value: Number,
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Employee", employeeSchema);
