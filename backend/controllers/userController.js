import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/authMiddleware.js";

/**
 * @desc    Login user (student, teacher, or admin)
 * @route   POST /api/login
 * @access  Public
 * @param   {Object} req.body - Login credentials
 * @param   {string} req.body.role - User role (student, teacher, admin)
 * @param   {string} req.body.password - User password
 * @param   {string} [req.body.email] - User email (required for admin, optional for others)
 * @param   {string} [req.body.rollNo] - Student roll number (optional for students)
 * @param   {string} [req.body.teacherId] - Teacher ID (optional for teachers)
 */
export const loginUser = async (req, res) => {
  try {
    const { role, email, password, rollNo, teacherId } = req.body;
    
    // Enhanced logging for debugging
    console.log("Login:", {
      role,
      email: email ? `${email.substring(0, 3)}***` : 'not provided',
      rollNo: rollNo || 'not provided',
      teacherId: teacherId || 'not provided',
    });

    // Validate required fields
    if (!role || !password) {
      console.log("Missing required fields: role or password");
      return res.status(400).json({ 
        message: "Role and password are required.",
        success: false 
      });
    }

    // Validate role
    const validRoles = ["student", "teacher", "admin"];
    if (!validRoles.includes(role)) {
      console.log(`Invalid role: ${role}`);
      return res.status(400).json({ 
        message: "Invalid role. Must be 'student', 'teacher', or 'admin'.",
        success: false 
      });
    }

    let user;
    let queryDescription = "";

    // Find user based on role with enhanced logic
    if (role === "student") {
      if (!rollNo && !email) {
        console.log("Student login missing both rollNo and email");
        return res.status(400).json({ 
          message: "Roll number or email is required for students.",
          success: false 
        });
      }
      
      // Try rollNo first, then email
      if (rollNo) {
        user = await User.findOne({ role: "student", rollNo });
        queryDescription = `student with rollNo: ${rollNo}`;
      } else {
        user = await User.findOne({ role: "student", email });
        queryDescription = `student with email: ${email}`;
      }
    } else if (role === "teacher") {
      if (!teacherId && !email) {
        console.log("Teacher login missing both teacherId and email");
        return res.status(400).json({ 
          message: "Teacher ID or email is required for teachers.",
          success: false 
        });
      }
      
      // Try teacherId first, then email
      if (teacherId) {
        user = await User.findOne({ role: "teacher", teacherId });
        queryDescription = `teacher with teacherId: ${teacherId}`;
      } else {
        user = await User.findOne({ role: "teacher", email });
        queryDescription = `teacher with email: ${email}`;
      }
    } else if (role === "admin") {
      if (!email) {
        console.log("Admin login missing email");
        return res.status(400).json({ 
          message: "Email is required for admin.",
          success: false 
        });
      }
      user = await User.findOne({ role: "admin", email });
      queryDescription = `admin with email: ${email}`;
    }

    // Check if user exists
    if (!user) {
      console.log(`User not found: ${queryDescription}`);
      return res.status(404).json({ 
        message: "User not found.",
        success: false 
      });
    }


    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`Invalid password for user: ${user.name}`);
      return res.status(401).json({ 
        message: "Invalid password.",
        success: false 
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return success response with enhanced user data
    res.status(200).json({
      message: "Login successful!",
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        rollNo: user.rollNo,
        teacherId: user.teacherId,
        subjects: user.subjects,
        class: user.class,
        classesAssigned: user.classesAssigned
      },
    });
  } catch (err) {
    console.error("Error in loginUser:", err.stack || err);
    res.status(500).json({ 
      message: "Server error during login.",
      success: false 
    });
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/profile
 * @access  Private
 * @param   {Object} req.user - Authenticated user from middleware
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        message: "User profile not found.",
        success: false 
      });
    }
    
    res.status(200).json({
      message: "User profile fetched successfully",
      success: true,
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
    res.status(500).json({ 
      message: "Server error fetching profile.",
      success: false 
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/profile
 * @access  Private
 * @param   {Object} req.user - Authenticated user from middleware
 * @param   {Object} req.body - Updated profile data
 * @param   {string} [req.body.name] - Updated name
 * @param   {string} [req.body.email] - Updated email
 */
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ 
        message: "User not found.",
        success: false 
      });
    }
    
    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    
    await user.save();
    
    res.status(200).json({
      message: "Profile updated successfully",
      success: true,
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
    res.status(500).json({ 
      message: "Server error updating profile.",
      success: false 
    });
  }
};

/**
 * @desc    Get all teachers list (read-only, safe endpoint)
 * @route   GET /api/users/teachers
 * @access  Public (safe - no passwords returned)
 */
export const getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" })
      .select("_id name teacherId email")
      .sort({ name: 1 });
    
    res.status(200).json(teachers);
  } catch (err) {
    console.error("Error in getTeachers:", err.message);
    res.status(500).json({ 
      message: "Server error fetching teachers.",
      success: false 
    });
  }
};