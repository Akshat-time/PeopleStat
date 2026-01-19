const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    status: { type: String, enum: ["pending","in-progress","completed"], default: "pending" },
    dueDate: Date
});

module.exports = mongoose.model("Task", taskSchema);
