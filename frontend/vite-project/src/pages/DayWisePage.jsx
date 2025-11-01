import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SideBar from "../components/SideBar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import NotificationIcon from "../components/Notification.jsx";
import api from "../services/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function DayWisePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dayWiseData, setDayWiseData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDayWiseData = async () => {
      try {
        const response = await api.get(`/student/${user.id}/dashboard/day-wise`);
        setDayWiseData(response.data);
      } catch (error) {
        console.error('Error fetching day-wise data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDayWiseData();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Process data for chart
  const chartData = dayWiseData.map(record => ({
    date: new Date(record.date).toLocaleDateString(),
    status: record.status === 'Present' ? 1 : 0,
    subject: record.subject
  }));

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
            <h1 className="text-2xl font-semibold">Day-Wise Attendance</h1>
            <p className="text-sm text-gray-700">
              Track your attendance pattern over time.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar />
            <NotificationIcon />
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
          <h3 className="text-white text-lg font-semibold mb-4">Attendance Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  domain={[0, 1]}
                  tickFormatter={(value) => value === 1 ? 'Present' : 'Absent'}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value, name) => [value === 1 ? 'Present' : 'Absent', 'Status']}
                />
                <Line 
                  type="monotone" 
                  dataKey="status" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ATTENDANCE TABLE */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <h3 className="text-white text-lg font-semibold mb-4">Attendance Records</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left text-gray-300 py-3">Date</th>
                  <th className="text-left text-gray-300 py-3">Subject</th>
                  <th className="text-left text-gray-300 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {dayWiseData.length > 0 ? (
                  dayWiseData.map((record, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="text-white py-3">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="text-gray-300 py-3">{record.subject}</td>
                      <td className={`py-3 ${
                        record.status === 'Present' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {record.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-gray-400 text-center py-8">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DayWisePage;


