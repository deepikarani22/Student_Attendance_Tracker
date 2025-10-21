import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/authMiddleware.js";

// @desc    Login user (student, teacher, or admin)
// @route   POST /api/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { role, email, password, rollNo, teacherId } = req.body;

    // Validate required fields
    if (!role || !password) {
      return res.status(400).json({ message: "Role and password are required." });
    }

    let user;

    // Find user based on role
    if (role === "student") {
      if (!rollNo && !email) {
        return res.status(400).json({ message: "Roll number or email is required for students." });
      }
      
      // Find by rollNo first, then by email if rollNo not provided
      if (rollNo) {
        user = await User.findOne({ role: "student", rollNo });
      } else if (email) {
        user = await User.findOne({ role: "student", email });
      }
    } else if (role === "teacher") {
      if (!teacherId && !email) {
        return res.status(400).json({ message: "Teacher ID or email is required for teachers." });
      }
      
      // Find by teacherId first, then by email if teacherId not provided
      if (teacherId) {
        user = await User.findOne({ role: "teacher", teacherId });
      } else if (email) {
        user = await User.findOne({ role: "teacher", email });
      }
    } else if (role === "admin") {
      if (!email) {
        return res.status(400).json({ message: "Email is required for admin." });
      }
      user = await User.findOne({ role: "admin", email });
    } else {
      return res.status(400).json({ message: "Invalid role. Must be 'student', 'teacher', or 'admin'." });
    }

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return success response
    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        rollNo: user.rollNo,
        teacherId: user.teacherId,
      },
    });
  } catch (err) {
    console.error("Error in loginUser:", err.message);
    res.status(500).json({ message: "Server error during login." });
  }
};

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.status(200).json({
      message: "User info fetched successfully",
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNo: user.rollNo,
        teacherId: user.teacherId,
        subjects: user.subjects,
        class: user.class,
        classesAssigned: user.classesAssigned
      },
    });
  } catch (err) {
    console.error("Error in getUserProfile:", err.message);
    res.status(500).json({ message: "Server error fetching profile." });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (email) user.email = email;
    
    await user.save();
    
    res.status(200).json({
      message: "Profile updated successfully",
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNo: user.rollNo,
        teacherId: user.teacherId
      }
    });
  } catch (err) {
    console.error("Error in updateUserProfile:", err.message);
    res.status(500).json({ message: "Server error updating profile." });
  }
};