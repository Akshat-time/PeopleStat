import express from "express";
import {
  addEmployee,
  getEmployees,
  uploadBulkEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
} from "../controllers/employeeController.js";

const router = express.Router();

router.post("/add", addEmployee);
router.post("/bulk", uploadBulkEmployees);
router.get("/", getEmployees);
router.get("/stats", getEmployeeStats);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
