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

//@desc get classes accessible
//@route GET /api/teacher/:id/dashboard
//@access public
export const classess = asyncHandler(async (req,res)=>{
    try {
  const { teacherId } = req.params; // teacherId from the route

  // Find the teacher document first
  const teacher = await User.findOne({ teacherId, role: "teacher" }).populate("classesAssigned");
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });

  res.status(200).json(teacher.classesAssigned);
} catch (error) {
  res.status(500).json({ message: error.message });
}

})

//@desc post attendance
//@route POST /api/teacher/:id/dashboard/:className
//@access public
export const markAttd = asyncHandler(async (req,res)=>{
    try {
    const { id, className } = req.params; // teacherId, className
    const { studentId, subject, status } = req.body;

    if (!studentId || !subject || !status) {
      return res.status(400).json({ message: "studentId, subject and status are required" });
    }

    const classObj = await Class.findOne({ name: className });

    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }

    const newAttendance = new Attendance({
      student: studentId,
      class: classObj._id,
      subject,
      status
    });

    await newAttendance.save();

    res.status(201).json({ message: "Attendance marked", attendance: newAttendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
        /*const {status} = req.body
        if(!status || (status !== "present" && status !== "absent")){
            res.status(400)
            throw new Error("Status is mandatory!")
        }
            res.status(200).json({message : "Mark attendance"})*/
    })

//@desc get list of students
//@route GET /api/teacher/:id/dashboard/:className/view
//@access public
export const stdList = asyncHandler(async (req,res)=>{
    try {
    const { className } = req.params;
    const classObj = await Class.findOne({ name: className }).populate("students");
    res.status(200).json(classObj.students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

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
