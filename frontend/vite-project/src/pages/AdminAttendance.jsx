import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SideBar from "../components/SideBar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import NotificationIcon from "../components/Notification.jsx";
import api from "../services/api";

function AdminAttendance() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    subject: '',
    date: ''
  });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await api.get('/admin/attendance');
      setAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEdit = (attendanceRecord) => {
    setEditingAttendance(attendanceRecord);
    setFormData({
      status: attendanceRecord.status,
      subject: attendanceRecord.subject,
      date: new Date(attendanceRecord.date).toISOString().split('T')[0]
    });
  };

  const handleSave = async () => {
    try {
      await api.put(`/admin/attendance/${editingAttendance._id}`, formData);
      fetchAttendance();
      setEditingAttendance(null);
      setFormData({ status: '', subject: '', date: '' });
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const handleDelete = async (attendanceId) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await api.delete(`/admin/attendance/${attendanceId}`);
        fetchAttendance();
      } catch (error) {
        console.error('Error deleting attendance:', error);
      }
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
    <div className="min-h-screen flex bg-gradient-to-br from-gray-600 via-gray-500 to-gray-200">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-gray-900 text-white p-5 flex flex-col justify-between min-h-screen">
        <SideBar user={user} onLogout={handleLogout} />
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 text-gray-900 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Attendance Management</h1>
            <p className="text-sm text-gray-700">
              View and manage all attendance records.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar />
            <NotificationIcon />
          </div>
        </div>

        {/* ATTENDANCE TABLE */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <h3 className="text-white text-lg font-semibold mb-4">All Attendance Records</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left text-gray-300 py-3">Student</th>
                  <th className="text-left text-gray-300 py-3">Class</th>
                  <th className="text-left text-gray-300 py-3">Subject</th>
                  <th className="text-left text-gray-300 py-3">Date</th>
                  <th className="text-left text-gray-300 py-3">Status</th>
                  <th className="text-left text-gray-300 py-3">Marked By</th>
                  <th className="text-left text-gray-300 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record._id} className="border-b border-gray-700">
                    <td className="text-white py-3">
                      {editingAttendance?._id === record._id ? (
                        <input
                          type="text"
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs"
                        />
                      ) : (
                        record.student?.name
                      )}
                    </td>
                    <td className="text-gray-300 py-3">{record.class?.name}</td>
                    <td className="text-gray-300 py-3">
                      {editingAttendance?._id === record._id ? (
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs"
                        />
                      ) : (
                        record.subject
                      )}
                    </td>
                    <td className="text-gray-300 py-3">
                      {editingAttendance?._id === record._id ? (
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs"
                        />
                      ) : (
                        new Date(record.date).toLocaleDateString()
                      )}
                    </td>
                    <td className="py-3">
                      {editingAttendance?._id === record._id ? (
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-gray-900 text-xs"
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          record.status === 'Present' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {record.status}
                        </span>
                      )}
                    </td>
                    <td className="text-gray-300 py-3">{record.markedBy?.name}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        {editingAttendance?._id === record._id ? (
                          <>
                            <button
                              onClick={handleSave}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition duration-200"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingAttendance(null)}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs transition duration-200"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(record)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(record._id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition duration-200"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminAttendance;


