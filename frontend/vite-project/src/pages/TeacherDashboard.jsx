import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SideBar from "../components/SideBar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import NotificationIcon from "../components/Notification.jsx";
import bgImage from "../assets/bg2.jpg";
import ClassInfoCard from "../components/ClassInfo.jsx";
import SclAttd from "../components/StdGraph.jsx";
import api from "../services/api";

function TeacherDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        const [classesResponse, postsResponse] = await Promise.all([
          api.get(`/teacher/${user.id}/dashboard`),
          api.get(`/posts/teacher/${user.id}`).catch(() => ({ data: [] })) // Handle posts gracefully if endpoint doesn't exist
        ]);
        
        setClasses(classesResponse.data || []);
        setPosts(postsResponse.data?.filter(post => post.status === 'pending') || []);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
        setClasses([]);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
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
            <h1 className="text-2xl font-semibold">Hi, {user?.name || 'Teacher'}!</h1>
            <p className="text-sm text-gray-700">
              Welcome back — manage your classes and students.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar />
            <NotificationIcon />
          </div>
        </div>

        {/* DASHBOARD GRID - Adaptive Layout */}
        {/* Case 1: Normal classes (≤3 classes) - Left: Classes + Graph (2 rows), Right: Posts (tall) */}
        {/* Case 2: Many classes (>3) - Top: All Classes (full width), Bottom: Graph | Posts (split) */}
        {classes.length <= 3 ? (
          <div className="grid grid-cols-12 gap-8">
            {/* LEFT COLUMN - 2 ROWS */}
            <div className="col-span-7 flex flex-col gap-8">
              {/* Row 1: Classes Assigned */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h3 className="text-white text-lg font-semibold mb-4">My Assigned Classes</h3>
                {classes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {classes.map((cls) => (
                      <ClassInfoCard key={cls._id || cls.name} classData={cls} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-300 text-sm">No classes assigned yet.</p>
                )}
              </div>

              {/* Row 2: School Attendance Graph */}
              {classes.length > 0 && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                  <h3 className="text-white text-lg font-semibold mb-4">School Attendance Overview</h3>
                  <SclAttd classes={classes} />
                </div>
              )}
            </div>

            {/* RIGHT COLUMN - STUDENT POSTS (tall, spans both rows) */}
            <div className="col-span-5">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-lg font-semibold">Student Posts</h3>
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    {posts.length} pending
                  </span>
                </div>
                
                {posts.length > 0 ? (
                  <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {posts.slice(0, 10).map((post) => (
                      <div key={post._id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white text-sm font-medium">
                            {post.sender?.name}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {new Date(post.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2 line-clamp-2">{post.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-400 text-xs capitalize">{post.type?.replace('_', ' ')}</span>
                          <button 
                            className="text-blue-400 text-xs hover:text-blue-300"
                            onClick={() => navigate('/teacher/activity')}
                          >
                            View →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No pending posts from students</p>
                )}
                
                <button 
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition duration-200"
                  onClick={() => navigate('/teacher/activity')}
                >
                  View All Posts
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* TOP ROW: All Classes (full width) */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-white text-lg font-semibold mb-4">My Assigned Classes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {classes.map((cls) => (
                  <ClassInfoCard key={cls._id || cls.name} classData={cls} />
                ))}
              </div>
            </div>

            {/* BOTTOM ROW: Graph and Posts (split) */}
            <div className="grid grid-cols-12 gap-8">
              {/* Left: School Attendance Graph */}
              <div className="col-span-5">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                  <h3 className="text-white text-lg font-semibold mb-4">School Attendance Overview</h3>
                  <SclAttd classes={classes} />
                </div>
              </div>

              {/* Right: Student Posts */}
              <div className="col-span-7">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-lg font-semibold">Student Posts</h3>
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      {posts.length} pending
                    </span>
                  </div>
                  
                  {posts.length > 0 ? (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                      {posts.slice(0, 10).map((post) => (
                        <div key={post._id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white text-sm font-medium">
                              {post.sender?.name}
                            </span>
                            <span className="text-gray-400 text-xs">
                              {new Date(post.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-2 line-clamp-2">{post.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-blue-400 text-xs capitalize">{post.type?.replace('_', ' ')}</span>
                            <button 
                              className="text-blue-400 text-xs hover:text-blue-300"
                              onClick={() => navigate('/teacher/activity')}
                            >
                              View →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No pending posts from students</p>
                  )}
                  
                  <button 
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition duration-200"
                    onClick={() => navigate('/teacher/activity')}
                  >
                    View All Posts
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default TeacherDashboard;
/*Assigned Classes 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classes.map((classObj) => (
                <div key={classObj._id}>
                  <ClassInfoCard 
                    attd={{ 
                      name: classObj.name, 
                      id: classObj._id,
                      students: classObj.students?.length || 0 
                    }} 
                    onClick={() => navigate(`/teacher/class/${classObj._id}`)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-4">*/