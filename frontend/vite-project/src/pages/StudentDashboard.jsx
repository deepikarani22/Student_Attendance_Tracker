import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SideBar from "../components/SideBar.jsx";
import OverallInfoCard from "../components/StdCard.jsx";
import AttdPrecentage from "../components/Percentage.jsx";
import WeeklyProgress from "../components/Weekly.jsx";
import DayWise from "../components/DayWaise.jsx";
import SubWise from "../components/SubWise.jsx";
import SearchBar from "../components/SearchBar.jsx";
import NotificationIcon from "../components/Notification.jsx";
import DashboardCalendar from '../components/Calendar/Calendar';
import bgImage from "../assets/bg2.jpg";
import api from "../services/api";

function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await api.get(`/student/${user.rollNo}/dashboard`);
        setAttendanceData(response.data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAttendanceData();
    }
  }, [user]);

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
            <h1 className="text-2xl font-semibold">Hi, {user.name}!</h1>
            <p className="text-sm text-gray-700">
              Welcome back — here's your summary.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar />
            <NotificationIcon />
          </div>
        </div>

        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4 flex flex-col gap-6">
            <div className="bg-gray-900 text-white p-5 rounded-2xl shadow-lg">
              <OverallInfoCard 
                attd={{ 
                  presentDays: attendanceData?.presentDays || 0, 
                  totalDays: attendanceData?.totalDays || 0 
                }} 
              />
            </div>
          </div>

          <div className="col-span-5">
            <WeeklyProgress attd={{ p: attendanceData?.percentage || 0 }} />
          </div>

          <div className="col-span-3">
            <AttdPrecentage attd={{ p: attendanceData?.percentage || 0 }} />
          </div>
        </div>

        {/* Calendar, Subject-wise, and Day-wise Cards - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* Calendar Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 flex flex-col min-h-[300px]">
            <DashboardCalendar studentId={user.id} />
          </div>

          {/* Subject-wise Attendance Card */}
          <div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 cursor-pointer hover:bg-white/20 transition duration-200 flex flex-col items-center justify-center min-h-[300px]"
            onClick={() => navigate('/student/sub-wise')}
          >
            <h3 className="text-white text-xl font-semibold mb-4 text-center">Subject-Wise Attendance</h3>
            <p className="text-gray-300 text-sm text-center mb-4">View your attendance by subject</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 mt-auto">
              View Details
            </button>
          </div>

          {/* Day-wise Attendance Card */}
          <div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 cursor-pointer hover:bg-white/20 transition duration-200 flex flex-col items-center justify-center min-h-[300px]"
            onClick={() => navigate('/student/day-wise')}
          >
            <h3 className="text-white text-xl font-semibold mb-4 text-center">Day-Wise Attendance</h3>
            <p className="text-gray-300 text-sm text-center mb-4">View your attendance by day</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 mt-auto">
              View Details
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;


/*import React, { useState } from 'react';
import OverallInfoCard from '../components/StdCard.jsx';
import AttdPrecentage from '../components/Percentage.jsx';
import WeeklyProgress from '../components/Weekly.jsx';
import DayWise from '../components/DayWaise.jsx';
import SubWise from '../components/SubWise.jsx';
import SideBar from '../components/SideBar.jsx';
import SearchBar from '../components/SearchBar.jsx';
<div className="min-h-screen bg-gradient-to-b from-gray-400 to-gray-200 to-gray-10">
<div className="min-h-screen bg-gradient-to-br from-gray-400 via-gray-300 to-gray-200">
function StudentDashboard() {
  return (
    <>
      <OverallInfoCard attd={{presentDays : 22, totalDays:35}}/>
      <AttdPrecentage attd={{p:95}}/>
      <WeeklyProgress attd={{p:77}}/>
      <DayWise attd={{p:77}}/>
      <SubWise attd={{p:77}}/>
      <SideBar/>
      <SearchBar/>
    </>
  );
}
export default StudentDashboard;*/