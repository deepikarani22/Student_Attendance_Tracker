import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// Import models
import User from "./models/user.js";
import Class from "./models/class.js";
import Attendance from "./models/attd.js";
import Cal from "./models/cal.js"; // leave calendar model

dotenv.config();

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    await User.deleteMany();
    await Class.deleteMany();
    await Attendance.deleteMany();
    await Cal.deleteMany();
    console.log("✅ Old data cleared");

    // Hash password
    const hashedPassword = await bcrypt.hash("12345", 12);

    // Create admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin"
    });

    const teachers = await User.insertMany([
      { name: "Mr. Smith", email: "smith@example.com", password: hashedPassword, role: "teacher", teacherId: "T001", subjects: ["Math"], classesAssigned: [] },
      { name: "Mrs. Johnson", email: "johnson@example.com", password: hashedPassword, role: "teacher", teacherId: "T002", subjects: ["Science"], classesAssigned: [] },
      { name: "Mr. Brown", email: "brown@example.com", password: hashedPassword, role: "teacher", teacherId: "T003", subjects: ["English"], classesAssigned: [] },
      { name: "Ms. Davis", email: "davis@example.com", password: hashedPassword, role: "teacher", teacherId: "T004", subjects: ["History"], classesAssigned: [] },
      { name: "Mr. Wilson", email: "wilson@example.com", password: hashedPassword, role: "teacher", teacherId: "T005", subjects: ["Geography"], classesAssigned: [] }
    ]);

    // Create classes first
    const class10A = await Class.create({
      name: "10A",
      teachers: [teachers[0]._id],
      students: []
    });

    const class10B = await Class.create({
      name: "10B",
      teachers: [teachers[1]._id],
      students: []
    });

    // Create students with class assignments
    const students = await User.insertMany([
      { name: "Alice", email: "alice@example.com", password: hashedPassword, role: "student", rollNo: "S001", class: class10A._id },
      { name: "Bob", email: "bob@example.com", password: hashedPassword, role: "student", rollNo: "S002", class: class10A._id },
      { name: "Charlie", email: "charlie@example.com", password: hashedPassword, role: "student", rollNo: "S003", class: class10A._id },
      { name: "Diana", email: "diana@example.com", password: hashedPassword, role: "student", rollNo: "S004", class: class10A._id },
      { name: "Ethan", email: "ethan@example.com", password: hashedPassword, role: "student", rollNo: "S005", class: class10A._id },
      { name: "Fiona", email: "fiona@example.com", password: hashedPassword, role: "student", rollNo: "S006", class: class10B._id },
      { name: "George", email: "george@example.com", password: hashedPassword, role: "student", rollNo: "S007", class: class10B._id },
      { name: "Hannah", email: "hannah@example.com", password: hashedPassword, role: "student", rollNo: "S008", class: class10B._id },
      { name: "Ian", email: "ian@example.com", password: hashedPassword, role: "student", rollNo: "S009", class: class10B._id },
      { name: "Jade", email: "jade@example.com", password: hashedPassword, role: "student", rollNo: "S010", class: class10B._id }
    ]);

    // Update classes with student references
    class10A.students = students.slice(0, 5).map(s => s._id);
    class10B.students = students.slice(5, 10).map(s => s._id);
    await class10A.save();
    await class10B.save();

    // Update teachers with class assignments
    teachers[0].classesAssigned.push(class10A._id);
    teachers[1].classesAssigned.push(class10B._id);
    await teachers[0].save();
    await teachers[1].save();

    const today = new Date();
    await Attendance.insertMany([
      { student: students[0]._id, class: class10A._id, date: today, status: "Present", subject: "Math", markedBy: teachers[0]._id },
      { student: students[1]._id, class: class10A._id, date: today, status: "Absent", subject: "Math", markedBy: teachers[0]._id },
      { student: students[2]._id, class: class10A._id, date: today, status: "Present", subject: "Math", markedBy: teachers[0]._id },
      { student: students[5]._id, class: class10B._id, date: today, status: "Present", subject: "Science", markedBy: teachers[1]._id },
      { student: students[6]._id, class: class10B._id, date: today, status: "Absent", subject: "Science", markedBy: teachers[1]._id }
    ]);

    await Cal.insertMany([
      { student: students[1]._id, date: new Date("2025-09-20"), reason: "Sick" },
      { student: students[6]._id, date: new Date("2025-09-22"), reason: "Family Event" }
    ]);

    console.log("🌱 Seed data inserted successfully!");
    console.log("📝 Login credentials:");
    console.log("Admin: admin@example.com / 12345");
    console.log("Teacher: smith@example.com / 12345 (T001)");
    console.log("Student: alice@example.com / 12345 (S001)");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    mongoose.connection.close();
  }
};

seedData();

