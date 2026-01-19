const Employee = require("../models/employee");

// Create employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const resume = req.file ? req.file.path : null;

    const employee = await Employee.create({
      name,
      email,
      role,
      resume,
    });

    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate("role");
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate("role");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const resume = req.file ? req.file.path : undefined;

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (name) employee.name = name;
    if (email) employee.email = email;
    if (role) employee.role = role;
    if (resume) employee.resume = resume;

    const updatedEmployee = await employee.save();
    res.status(200).json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await employee.deleteOne();
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
