import asyncHandler from "express-async-handler"
import User from "../models/user.js"
import Class from "../models/class.js"
import Attendance  from "../models/attd.js"
import Calendar from "../models/cal.js"

//@desc get attd percentage and no. of classes attended
//@route GET /api/student/:rollNo/dashboard
//@access public
export const getAttendance = asyncHandler( async (req,res)=>{
    try {
  const { rollNo } = req.params;

  const student = await User.findOne({ rollNo, role: "student" });
  if (!student) return res.status(404).json({ message: "Student not found" });

  const studentId = student._id;

  const totalDays = await Attendance.countDocuments({ student: studentId });
  const presentDays = await Attendance.countDocuments({ student: studentId, status: "Present" }); // match enum in DB

  if (totalDays === 0) {
    return res.status(200).json({ percentage: 0, presentDays: 0, totalDays: 0, message: "No attendance records yet" });
  }

  const percentage = ((presentDays / totalDays) * 100).toFixed(2);

  res.status(200).json({ percentage, presentDays, totalDays });
} catch (error) {
  res.status(500).json({ message: error.message });
}
})

//@desc get attd sub-wise
//@route GET /api/student/:id/dashboard/sub-wise
//@access public
export const attdBySub = asyncHandler(async (req,res)=>{
    try {
    const { id } = req.params; // studentId
    const records = await Attendance.find({ student: id }).populate("class");

    let subjectStats = {};
    records.forEach(record => {
      const subject = record.subject;
      if (!subjectStats[subject]) {
        subjectStats[subject] = { present: 0, total: 0 };
      }
      subjectStats[subject].total++;
      if (record.status === "Present") {
        subjectStats[subject].present++;
      }
    });

    let result = {};
    for (let sub in subjectStats) {
      const { present, total } = subjectStats[sub];
      result[sub] = { 
        present, 
        total, 
        percentage: ((present / total) * 100).toFixed(2) 
      };
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

//@desc get attd day-wise
//@route GET /api/student/:id/dashboard/day-wise
//@access public
export const attdByDay = asyncHandler(async (req,res)=>{
    try {
    const { id } = req.params; // studentId
    const records = await Attendance.find({ student: id });

    let dayWise = records.map(r => ({
      date: r.date,
      subject: r.subject,
      status: r.status
    }));

    res.status(200).json(dayWise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

//@desc get classes accessible by teacher
//@route GET /api/teacher/:id/dashboard
export const classess = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await User.findOne({ _id: id, role: "teacher" }).populate(
      "classesAssigned"
    );

    if (!teacher)
      return res.status(404).json({ message: "Teacher not found" });

    res.status(200).json(teacher.classesAssigned);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//@desc mark attendance
//@route POST /api/teacher/:id/dashboard/:className
export const markAttd = asyncHandler(async (req, res) => {
  try {
    const { id, className } = req.params;
    const { studentId, subject, status } = req.body;

    if (!studentId || !subject || !status) {
      return res.status(400).json({ 
        success: false,
        message: "studentId, subject, and status are required" 
      });
    }

    // Validate status
    if (!["Present", "Absent"].includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: "Status must be 'Present' or 'Absent'" 
      });
    }

    const classObj = await Class.findOne({ name: className });
    if (!classObj) {
      return res.status(404).json({ 
        success: false,
        message: "Class not found" 
      });
    }

    // Verify student exists and belongs to class
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ 
        success: false,
        message: "Student not found" 
      });
    }

    // Check if attendance for today already exists
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await Attendance.findOne({
      student: studentId,
      class: classObj._id,
      subject: subject,
      date: { $gte: today, $lt: tomorrow }
    });

    let attendance;
    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      existingAttendance.markedBy = id;
      await existingAttendance.save();
      attendance = existingAttendance;
    } else {
      // Create new attendance
      attendance = new Attendance({
        student: studentId,
        class: classObj._id,
        subject,
        status,
        date: today,
        markedBy: id,
      });
      await attendance.save();
    }

    res.status(201).json({ 
      success: true,
      message: "Attendance marked successfully", 
      attendance: attendance 
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to mark attendance" 
    });
  }
});

//@desc get list of students in a class
//@route GET /api/teacher/:id/dashboard/:className/view
export const stdList = asyncHandler(async (req, res) => {
  try {
    const { className } = req.params;
    const classObj = await Class.findOne({ name: className }).populate("students");
    if (!classObj) return res.status(404).json({ message: "Class not found" });
    res.status(200).json(classObj.students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//@desc get student profile
//@route GET /api/teacher/:id/dashboard/:className/view/:id
//@access public
export const stdProfile = asyncHandler(async (req,res)=>{
    try {
    const { studentId } = req.params;
    const student = await User.findById(studentId).populate("class");
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

//@desc get student leave dates for calendar
//@route GET /api/student/:id/leaves
//@access public
export const getStudentLeaves = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // studentId
    const leaves = await Calendar.find({ student: id, approved: true })
      .select('date reason')
      .sort({ date: 1 });
    
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//@desc update attendance record
//@route PUT /api/attendance/:attendanceId
//@access public
export const updateAttendance = asyncHandler(async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { status, subject } = req.body;

    if (!status || !["Present", "Absent"].includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: "Valid status (Present or Absent) is required" 
      });
    }

    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return res.status(404).json({ 
        success: false,
        message: "Attendance record not found" 
      });
    }

    attendance.status = status;
    if (subject) {
      attendance.subject = subject;
    }

    await attendance.save();

    res.status(200).json({ 
      success: true,
      message: "Attendance updated successfully", 
      attendance: attendance 
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to update attendance" 
    });
  }
});



