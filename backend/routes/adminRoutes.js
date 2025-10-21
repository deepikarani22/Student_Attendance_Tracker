import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";
import {
  getAdminStats,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
  getAllAttendance,
  updateAttendance,
  deleteAttendance
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Stats and overview
router.get("/stats", getAdminStats);

// User management
router.get("/users", getAllUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Class management
router.get("/classes", getAllClasses);
router.post("/classes", createClass);
router.put("/classes/:id", updateClass);
router.delete("/classes/:id", deleteClass);

// Attendance management
router.get("/attendance", getAllAttendance);
router.put("/attendance/:id", updateAttendance);
router.delete("/attendance/:id", deleteAttendance);

export default router;
