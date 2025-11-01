import express from "express";
const router = express.Router();
import {
  getAttendance,
  attdBySub,
  attdByDay,
  classess,
  markAttd,
  stdList,
  getStudentLeaves,
  updateAttendance,
} from "../controllers/attdController.js";

// STUDENT ROUTES
router.get("/student/:rollNo/dashboard", getAttendance);
router.get("/student/:id/dashboard/sub-wise", attdBySub);
router.get("/student/:id/dashboard/day-wise", attdByDay);
router.get("/student/:id/leaves", getStudentLeaves);

// TEACHER ROUTES
router.get("/teacher/:id/dashboard", classess);
router.post("/teacher/:id/dashboard/:className", markAttd);
router.get("/teacher/:id/dashboard/:className/view", stdList);

// ATTENDANCE UPDATE ROUTE
router.put("/attendance/:attendanceId", updateAttendance);

export default router;


/*import express from "express"
const router = express.Router()
import {getAttendance, attdBySub, attdByDay, classess, markAttd, stdList, stdProfile } from "../controllers/attdController.js"

router.get("/student/:rollNo/dashboard", getAttendance);
router.get("/student/:id/dashboard/sub-wise", attdBySub);
router.get("/student/:id/dashboard/day-wise", attdByDay);

router.get("/teacher/:id/dashboard", classess);
router.post("/teacher/:id/dashboard/:className", markAttd);
router.get("/teacher/:id/dashboard/:className/view", stdList);
router.get("/teacher/:id/dashboard/:className/view/:studentId", stdProfile);

export default router;*/