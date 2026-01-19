const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    createRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole
} = require("../controllers/roleController");

router.use(authMiddleware);

router.post("/", createRole);
router.get("/", getRoles);
router.get("/:id", getRoleById);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);

module.exports = router;
