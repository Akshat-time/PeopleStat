import mongoose from "mongoose";

const optimizationRunSchema = new mongoose.Schema({
  runId: { type: String, unique: true },
  initiatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  recommendations: { type: Array, default: [] },
  stats: {
    totalSavings: Number,
    totalEmployees: Number,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("OptimizationRun", optimizationRunSchema);