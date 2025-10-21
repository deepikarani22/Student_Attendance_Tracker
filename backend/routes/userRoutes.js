import express from "express";
import { loginUser, getUserProfile, updateUserProfile } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);

// Protected routes
router.use(authenticateToken);
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);

export default router;