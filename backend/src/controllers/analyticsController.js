const Task = require("../models/task");
const Employee = require("../models/employee");
const Role = require("../models/role");

// Example analytics endpoints
exports.getTaskStats = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments();
        const completedTasks = await Task.countDocuments({ status: "completed" });
        const pendingTasks = await Task.countDocuments({ status: "pending" });
        const inProgressTasks = await Task.countDocuments({ status: "in-progress" });

        res.json({ totalTasks, completedTasks, pendingTasks, inProgressTasks });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getEmployeeTaskCount = async (req, res) => {
    try {
        const data = await Task.aggregate([
            { $group: { _id: "$assignedTo", taskCount: { $sum: 1 } } }
        ]);

        // Populate employee names
        const results = await Promise.all(
            data.map(async d => {
                const emp = await Employee.findById(d._id);
                return { employee: emp?.name || "Deleted", taskCount: d.taskCount };
            })
        );

        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getRoleDistribution = async (req, res) => {
    try {
        const data = await Employee.aggregate([
            { $group: { _id: "$role", employeeCount: { $sum: 1 } } }
        ]);

        const results = await Promise.all(
            data.map(async d => {
                const role = await Role.findById(d._id);
                return { role: role?.name || "Deleted", employeeCount: d.employeeCount };
            })
        );

        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
