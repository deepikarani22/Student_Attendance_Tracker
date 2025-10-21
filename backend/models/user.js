import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: { 
    type: String, 
    enum: ["student", "teacher", "admin"], 
    required: true 
  },
  rollNo: { 
    type: String, 
    unique: true, 
    sparse: true, 
    required: function() { return this.role === "student"; } 
  },
  class: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Class",
    required: function() { return this.role === "student"; } 
  },
  teacherId: { 
    type: String, 
    unique: true, 
    sparse: true,  
    required: function() { return this.role === "teacher"; } 
  },
  subjects: [{ 
    type: String 
  }],
  classesAssigned: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Class" 
  }],
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: [true,"Please enter the password"]
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);
