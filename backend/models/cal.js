import mongoose from "mongoose";

const calSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  reason: { type: String }, 
  approved: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Calendar", calSchema);
