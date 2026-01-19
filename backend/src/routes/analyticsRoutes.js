const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getTaskStats, getEmployeeTaskCount, getRoleDistribution } = require("../controllers/analyticsController");

router.use(authMiddleware);

router.get("/tasks", getTaskStats);
router.get("/employee-tasks", getEmployeeTaskCount);
router.get("/role-distribution", getRoleDistribution);

module.exports = router;
