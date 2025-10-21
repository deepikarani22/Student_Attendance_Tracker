import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import Class from "../models/class.js";
import Attendance from "../models/attd.js";
import Post from "../models/post.js";
import bcrypt from "bcryptjs";

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
export const getAdminStats = asyncHandler(async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalClasses = await Class.countDocuments();
    const totalAttendance = await Attendance.countDocuments();
    const pendingPosts = await Post.countDocuments({ status: "pending" });

    const recentAttendance = await Attendance.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('student', 'name rollNo')
      .populate('class', 'name');

    res.status(200).json({
      stats: {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalAttendance,
        pendingPosts
      },
      recentAttendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all users (students and teachers)
// @route   GET /api/admin/users
// @access  Private (Admin only)
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["student", "teacher"] } })
      .populate("class", "name")
      .select("-password");
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new user (student or teacher)
// @route   POST /api/admin/users
// @access  Private (Admin only)
export const createUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, role, rollNo, teacherId, subjects } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      subjects: subjects || []
    };

    if (role === "student" && rollNo) {
      userData.rollNo = rollNo;
    }

    if (role === "teacher" && teacherId) {
      userData.teacherId = teacherId;
    }

    const user = await User.create(userData);
    
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNo: user.rollNo,
        teacherId: user.teacherId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin only)
export const updateUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, role, rollNo, teacherId, subjects } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.subjects = subjects || user.subjects;

    if (role === "student" && rollNo) {
      user.rollNo = rollNo;
    }

    if (role === "teacher" && teacherId) {
      user.teacherId = teacherId;
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNo: user.rollNo,
        teacherId: user.teacherId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete related attendance records
    await Attendance.deleteMany({ student: user._id });
    
    // Delete related posts
    await Post.deleteMany({ 
      $or: [{ sender: user._id }, { receiver: user._id }] 
    });

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all classes
// @route   GET /api/admin/classes
// @access  Private (Admin only)
export const getAllClasses = asyncHandler(async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("students", "name rollNo email")
      .populate("teachers", "name teacherId email");
    
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new class
// @route   POST /api/admin/classes
// @access  Private (Admin only)
export const createClass = asyncHandler(async (req, res) => {
  try {
    const { name, studentIds, teacherIds } = req.body;

    const newClass = await Class.create({
      name,
      students: studentIds || [],
      teachers: teacherIds || []
    });

    // Update students with class assignment
    if (studentIds && studentIds.length > 0) {
      await User.updateMany(
        { _id: { $in: studentIds } },
        { class: newClass._id }
      );
    }

    // Update teachers with class assignment
    if (teacherIds && teacherIds.length > 0) {
      await User.updateMany(
        { _id: { $in: teacherIds } },
        { $addToSet: { classesAssigned: newClass._id } }
      );
    }

    const populatedClass = await Class.findById(newClass._id)
      .populate("students", "name rollNo email")
      .populate("teachers", "name teacherId email");

    res.status(201).json({
      message: "Class created successfully",
      class: populatedClass
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update class
// @route   PUT /api/admin/classes/:id
// @access  Private (Admin only)
export const updateClass = asyncHandler(async (req, res) => {
  try {
    const { name, studentIds, teacherIds } = req.body;
    
    const classObj = await Class.findById(req.params.id);
    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }

    classObj.name = name || classObj.name;
    classObj.students = studentIds || classObj.students;
    classObj.teachers = teacherIds || classObj.teachers;

    await classObj.save();

    const populatedClass = await Class.findById(classObj._id)
      .populate("students", "name rollNo email")
      .populate("teachers", "name teacherId email");

    res.status(200).json({
      message: "Class updated successfully",
      class: populatedClass
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete class
// @route   DELETE /api/admin/classes/:id
// @access  Private (Admin only)
export const deleteClass = asyncHandler(async (req, res) => {
  try {
    const classObj = await Class.findById(req.params.id);
    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Remove class from students
    await User.updateMany(
      { class: classObj._id },
      { $unset: { class: 1 } }
    );

    // Remove class from teachers' assigned classes
    await User.updateMany(
      { classesAssigned: classObj._id },
      { $pull: { classesAssigned: classObj._id } }
    );

    // Delete related attendance records
    await Attendance.deleteMany({ class: classObj._id });

    await Class.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all attendance records
// @route   GET /api/admin/attendance
// @access  Private (Admin only)
export const getAllAttendance = asyncHandler(async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("student", "name rollNo email")
      .populate("class", "name")
      .populate("markedBy", "name teacherId")
      .sort({ date: -1 });
    
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update attendance record
// @route   PUT /api/admin/attendance/:id
// @access  Private (Admin only)
export const updateAttendance = asyncHandler(async (req, res) => {
  try {
    const { status, subject, date } = req.body;
    
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    attendance.status = status || attendance.status;
    attendance.subject = subject || attendance.subject;
    attendance.date = date || attendance.date;

    await attendance.save();

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate("student", "name rollNo email")
      .populate("class", "name");

    res.status(200).json({
      message: "Attendance updated successfully",
      attendance: populatedAttendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete attendance record
// @route   DELETE /api/admin/attendance/:id
// @access  Private (Admin only)
export const deleteAttendance = asyncHandler(async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    await Attendance.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Attendance record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

