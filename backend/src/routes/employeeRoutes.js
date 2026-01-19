const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employeeController");

router.use(authMiddleware); // protect all routes

router.post("/", upload.single("resume"), createEmployee);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", upload.single("resume"), updateEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router;
