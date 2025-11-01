import express from "express";
import { loginUser, getUserProfile, updateUserProfile, getTeachers } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);

// Public route - get teachers list (safe, no passwords)
router.get("/users/teachers", getTeachers);

// Protected routes
router.use(authenticateToken);
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);

export default router;