import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ["leave_request", "complaint", "question", "general"], 
    default: "general" 
  },
  reply: { 
    type: String, 
    default: "" 
  },
  status: { 
    type: String, 
    enum: ["pending", "replied", "resolved"], 
    default: "pending" 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

export default mongoose.model("Post", postSchema);

