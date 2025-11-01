import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SideBar from "../components/SideBar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import NotificationIcon from "../components/Notification.jsx";
import api from "../services/api";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data.stats);
        setRecentAttendance(response.data.recentAttendance);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-500 to-gray-200 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <div 
      className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 cursor-pointer hover:bg-white/20 transition duration-200 ${onClick ? 'hover:scale-105' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-sm">{title}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

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
            <h1 className="text-2xl font-semibold">Welcome, Admin!</h1>
            <p className="text-sm text-gray-700">
              Administrator Dashboard — Manage your school system.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar />
            <NotificationIcon />
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            icon={<span className="text-white text-xl">👥</span>}
            color="bg-blue-500"
            onClick={() => navigate('/admin/users')}
          />
          <StatCard
            title="Total Teachers"
            value={stats?.totalTeachers || 0}
            icon={<span className="text-white text-xl">👨‍🏫</span>}
            color="bg-green-500"
            onClick={() => navigate('/admin/users')}
          />
          <StatCard
            title="Total Classes"
            value={stats?.totalClasses || 0}
            icon={<span className="text-white text-xl">🏫</span>}
            color="bg-purple-500"
            onClick={() => navigate('/admin/classes')}
          />
          <StatCard
            title="Pending Posts"
            value={stats?.pendingPosts || 0}
            icon={<span className="text-white text-xl">📝</span>}
            color="bg-orange-500"
          />
        </div>

        {/* MANAGEMENT CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 cursor-pointer hover:bg-white/20 transition duration-200 hover:scale-105"
            onClick={() => navigate('/admin/users')}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">User Management</h3>
              <span className="text-white text-2xl">👤</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Manage students, teachers, and administrators. Add, edit, or remove users.
            </p>
            <div className="text-blue-400 text-sm font-medium">Manage Users →</div>
          </div>

          <div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 cursor-pointer hover:bg-white/20 transition duration-200 hover:scale-105"
            onClick={() => navigate('/admin/classes')}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">Class Management</h3>
              <span className="text-white text-2xl">🏫</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Create and manage classes. Assign teachers and students to classes.
            </p>
            <div className="text-blue-400 text-sm font-medium">Manage Classes →</div>
          </div>

          <div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 cursor-pointer hover:bg-white/20 transition duration-200 hover:scale-105"
            onClick={() => navigate('/admin/attendance')}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">Attendance Records</h3>
              <span className="text-white text-2xl">📊</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              View and manage all attendance records across the school.
            </p>
            <div className="text-blue-400 text-sm font-medium">View Records →</div>
          </div>
        </div>

        {/* RECENT ATTENDANCE */}
        {recentAttendance && recentAttendance.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Recent Attendance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left text-gray-300 py-2">Student</th>
                    <th className="text-left text-gray-300 py-2">Class</th>
                    <th className="text-left text-gray-300 py-2">Status</th>
                    <th className="text-left text-gray-300 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttendance.slice(0, 5).map((record, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="text-white py-2">{record.student?.name}</td>
                      <td className="text-gray-300 py-2">{record.class?.name}</td>
                      <td className={`py-2 ${
                        record.status === 'Present' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {record.status}
                      </td>
                      <td className="text-gray-300 py-2">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;


