import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { requireStudent, requireTeacher, requireAdmin, requireTeacherOrAdmin } from "../middleware/roleMiddleware.js";
import {
  sendStudentPost,
  getStudentPosts,
  getTeacherPosts,
  replyToPost,
  getAllPosts,
  updatePostStatus
} from "../controllers/postController.js";

const router = express.Router();

// All post routes require authentication
router.use(authenticateToken);

// Student routes
router.post("/student", requireStudent, sendStudentPost);
router.get("/student/:id", getStudentPosts);

// Teacher routes
router.get("/teacher/:id", getTeacherPosts);
router.post("/reply/:postId", requireTeacherOrAdmin, replyToPost);
router.put("/:id/status", requireTeacherOrAdmin, updatePostStatus);

// Admin routes
router.get("/all", requireAdmin, getAllPosts);

export default router;

