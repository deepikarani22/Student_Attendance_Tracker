import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  subject: { type: String },
  date: { type: Date, required: true },
  status: { type: String, enum: ["Present", "Absent"], required: true },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

attendanceSchema.index({ student: 1, date: 1, subject: 1 }, { unique: true }); 

export default mongoose.model("Attendance", attendanceSchema);
