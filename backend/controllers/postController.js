import asyncHandler from "express-async-handler";
import Post from "../models/post.js";
import User from "../models/user.js";

// @desc    Send post from student to teacher
// @route   POST /api/posts/student
// @access  Private (Student)
export const sendStudentPost = asyncHandler(async (req, res) => {
  try {
    const { receiverId, message, type } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !message) {
      return res.status(400).json({ message: "Receiver ID and message are required" });
    }

    // Verify receiver is a teacher
    const receiver = await User.findById(receiverId);
    if (!receiver || receiver.role !== "teacher") {
      return res.status(400).json({ message: "Invalid teacher ID" });
    }

    const post = await Post.create({
      sender: senderId,
      receiver: receiverId,
      message,
      type: type || "general"
    });

    const populatedPost = await Post.findById(post._id)
      .populate("sender", "name rollNo email")
      .populate("receiver", "name teacherId email");

    res.status(201).json({
      message: "Post sent successfully",
      post: populatedPost
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get posts sent by student
// @route   GET /api/posts/student/:id
// @access  Private (Student or Admin)
export const getStudentPosts = asyncHandler(async (req, res) => {
  try {
    const studentId = req.params.id;
    
    // Verify access (student can only see their own posts, admin can see any)
    if (req.user.role === "student" && req.user._id.toString() !== studentId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const posts = await Post.find({ sender: studentId })
      .populate("sender", "name rollNo email")
      .populate("receiver", "name teacherId email")
      .sort({ date: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get posts received by teacher
// @route   GET /api/posts/teacher/:id
// @access  Private (Teacher or Admin)
export const getTeacherPosts = asyncHandler(async (req, res) => {
  try {
    const teacherId = req.params.id;
    
    // Verify access (teacher can only see posts sent to them, admin can see any)
    if (req.user.role === "teacher" && req.user._id.toString() !== teacherId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const posts = await Post.find({ receiver: teacherId })
      .populate("sender", "name rollNo email")
      .populate("receiver", "name teacherId email")
      .sort({ date: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Reply to a post
// @route   POST /api/posts/reply/:postId
// @access  Private (Teacher or Admin)
export const replyToPost = asyncHandler(async (req, res) => {
  try {
    const { reply } = req.body;
    const postId = req.params.postId;

    if (!reply) {
      return res.status(400).json({ message: "Reply message is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Verify access (teacher can only reply to posts sent to them, admin can reply to any)
    if (req.user.role === "teacher" && post.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    post.reply = reply;
    post.status = "replied";
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("sender", "name rollNo email")
      .populate("receiver", "name teacherId email");

    res.status(200).json({
      message: "Reply sent successfully",
      post: populatedPost
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all posts (Admin only)
// @route   GET /api/posts/all
// @access  Private (Admin)
export const getAllPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("sender", "name rollNo email")
      .populate("receiver", "name teacherId email")
      .sort({ date: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update post status
// @route   PUT /api/posts/:id/status
// @access  Private (Teacher or Admin)
export const updatePostStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;
    const postId = req.params.id;

    if (!status || !["pending", "replied", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Verify access
    if (req.user.role === "teacher" && post.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    post.status = status;
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("sender", "name rollNo email")
      .populate("receiver", "name teacherId email");

    res.status(200).json({
      message: "Post status updated successfully",
      post: populatedPost
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

