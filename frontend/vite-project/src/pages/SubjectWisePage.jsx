import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SideBar from "../components/SideBar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import NotificationIcon from "../components/Notification.jsx";
import api from "../services/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function SubjectWisePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [subjectData, setSubjectData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjectWiseData = async () => {
      try {
        const response = await api.get(`/student/${user.id}/dashboard/sub-wise`);
        setSubjectData(response.data);
      } catch (error) {
        console.error('Error fetching subject-wise data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSubjectWiseData();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Process data for charts
  const chartData = Object.entries(subjectData).map(([subject, data]) => ({
    subject,
    present: data.present,
    total: data.total,
    percentage: parseFloat(data.percentage)
  }));

  const pieData = chartData.map(item => ({
    name: item.subject,
    value: item.percentage
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

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
            <h1 className="text-2xl font-semibold">Subject-Wise Attendance</h1>
            <p className="text-sm text-gray-700">
              Track your attendance performance across different subjects.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar />
            <NotificationIcon />
          </div>
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Attendance by Subject</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="subject" 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                    formatter={(value, name) => [`${value}%`, 'Attendance']}
                  />
                  <Bar dataKey="percentage" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Subject Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SUBJECT DETAILS TABLE */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <h3 className="text-white text-lg font-semibold mb-4">Subject Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left text-gray-300 py-3">Subject</th>
                  <th className="text-left text-gray-300 py-3">Present</th>
                  <th className="text-left text-gray-300 py-3">Total Classes</th>
                  <th className="text-left text-gray-300 py-3">Percentage</th>
                  <th className="text-left text-gray-300 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {chartData.length > 0 ? (
                  chartData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="text-white py-3 font-medium">{item.subject}</td>
                      <td className="text-gray-300 py-3">{item.present}</td>
                      <td className="text-gray-300 py-3">{item.total}</td>
                      <td className="text-gray-300 py-3">{item.percentage.toFixed(1)}%</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.percentage >= 75 
                            ? 'bg-green-500/20 text-green-400' 
                            : item.percentage >= 50 
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {item.percentage >= 75 ? 'Good' : item.percentage >= 50 ? 'Average' : 'Poor'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-gray-400 text-center py-8">
                      No subject data found
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

export default SubjectWisePage;


