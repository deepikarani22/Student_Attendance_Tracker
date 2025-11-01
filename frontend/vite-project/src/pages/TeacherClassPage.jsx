import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const TeacherClassPage = () => {
  const { className } = useParams();
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(
          `/teacher/${user.id}/dashboard/${className}/view`
        );
        setStudents(data || []);
      } catch (error) {
        console.error("Error fetching students:", error.response?.data || error.message);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, [user, className]);

  const markAttendance = async (studentId, status) => {
    if (!user || !user.id) return;

    try {
      const response = await api.post(
        `/teacher/${user.id}/dashboard/${className}`,
        { studentId, subject: "General", status }
      );
      
      if (response.data.success) {
        alert(`Successfully marked ${status} for student.`);
        // Refresh student list
        const { data } = await api.get(
          `/teacher/${user.id}/dashboard/${className}/view`
        );
        setStudents(data || []);
      } else {
        throw new Error(response.data.message || 'Failed to mark attendance');
      }
    } catch (error) {
      console.error("Error marking attendance:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to mark attendance';
      alert(`Error: ${errorMessage}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-500 to-gray-200 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-500 to-gray-200 p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
        <h1 className="text-white text-3xl font-semibold mb-6">{className} - Attendance</h1>
        {students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-white/20 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-white/10">
                  <th className="p-4 border border-white/20 text-left text-white font-semibold">Name</th>
                  <th className="p-4 border border-white/20 text-left text-white font-semibold">Roll No</th>
                  <th className="p-4 border border-white/20 text-left text-white font-semibold">Mark Attendance</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id} className="border border-white/20 hover:bg-white/5 transition">
                    <td className="p-4 border border-white/20 text-white">{s.name}</td>
                    <td className="p-4 border border-white/20 text-white">{s.rollNo}</td>
                    <td className="p-4 border border-white/20">
                      <button
                        onClick={() => markAttendance(s._id, "Present")}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mr-2 transition duration-200"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => markAttendance(s._id, "Absent")}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
                      >
                        Absent
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-white text-lg">No students found in this class.</p>
        )}
      </div>
    </div>
  );
};

export default TeacherClassPage;
