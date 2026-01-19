const Task = require("../models/task");

// Create task
exports.createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, dueDate } = req.body;
        const task = await Task.create({ title, description, assignedTo, dueDate });
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo");
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate("assignedTo");
        if(!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update task
exports.updateTask = async (req, res) => {
    try {
        const { title, description, assignedTo, status, dueDate } = req.body;
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({ message: "Task not found" });

        if(title) task.title = title;
        if(description) task.description = description;
        if(assignedTo) task.assignedTo = assignedTo;
        if(status) task.status = status;
        if(dueDate) task.dueDate = dueDate;

        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({ message: "Task not found" });

        await task.remove();
        res.json({ message: "Task removed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
