const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    resume: String,  // uploaded file path
});

module.exports = mongoose.model("Employee", employeeSchema);
