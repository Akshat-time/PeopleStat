const Role = require("../models/role");

// Create role
exports.createRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        const role = await Role.create({ name, description });
        res.status(201).json(role);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all roles
exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get role by ID
exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if(!role) return res.status(404).json({ message: "Role not found" });
        res.json(role);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update role
exports.updateRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        const role = await Role.findById(req.params.id);
        if(!role) return res.status(404).json({ message: "Role not found" });

        if(name) role.name = name;
        if(description) role.description = description;

        await role.save();
        res.json(role);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete role
exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if(!role) return res.status(404).json({ message: "Role not found" });

        await role.remove();
        res.json({ message: "Role removed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
