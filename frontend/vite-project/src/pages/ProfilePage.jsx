import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SideBar from "../components/SideBar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import NotificationIcon from "../components/Notification.jsx";
import api from "../services/api";

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setProfile(response.data.profile);
        setFormData({
          name: response.data.profile.name,
          email: response.data.profile.email
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSave = async () => {
    try {
      const response = await api.put('/profile', formData);
      setProfile(response.data.profile);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
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
            <h1 className="text-2xl font-semibold">{user.name}!</h1>
            <p className="text-sm text-gray-700">
              Manage your account information and settings.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar />
            <NotificationIcon />
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white text-xl font-semibold">Personal Information</h3>
            <button
              onClick={() => setEditing(!editing)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-300 text-lg">{profile?.name}</p>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Email</label>
                {editing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-300 text-lg">{profile?.email}</p>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Role</label>
                <p className="text-gray-300 text-lg capitalize">{profile?.role}</p>
              </div>
            </div>

            {/* Role-specific Info */}
            <div className="space-y-6">
              {profile?.role === 'student' && (
                <>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Roll Number</label>
                    <p className="text-gray-300 text-lg">{profile?.rollNo}</p>
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Class</label>
                    <p className="text-gray-300 text-lg">{profile?.class?.name || 'Not assigned'}</p>
                  </div>
                </>
              )}

              {profile?.role === 'teacher' && (
                <>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Teacher ID</label>
                    <p className="text-gray-300 text-lg">{profile?.teacherId}</p>
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Subjects</label>
                    <div className="flex flex-wrap gap-2">
                      {profile?.subjects?.map((subject, index) => (
                        <span key={index} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Assigned Classes</label>
                    <div className="flex flex-wrap gap-2">
                      {profile?.classesAssigned?.map((classObj, index) => (
                        <span key={index} className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                          {classObj.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {profile?.role === 'admin' && (
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Administrator Access</label>
                  <p className="text-gray-300 text-lg">Full system access and management capabilities</p>
                </div>
              )}
            </div>
          </div>

          {editing && (
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-200"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* STATISTICS */}
        {profile?.role === 'student' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <h3 className="text-white text-xl font-semibold mb-6">Academic Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-white text-3xl font-bold mb-2">--</div>
                <div className="text-gray-300 text-sm">Overall Attendance</div>
              </div>
              <div className="text-center">
                <div className="text-white text-3xl font-bold mb-2">--</div>
                <div className="text-gray-300 text-sm">Present Days</div>
              </div>
              <div className="text-center">
                <div className="text-white text-3xl font-bold mb-2">--</div>
                <div className="text-gray-300 text-sm">Total Classes</div>
              </div>
            </div>
          </div>
        )}

        {profile?.role === 'teacher' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <h3 className="text-white text-xl font-semibold mb-6">Teaching Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-white text-3xl font-bold mb-2">{profile?.classesAssigned?.length || 0}</div>
                <div className="text-gray-300 text-sm">Assigned Classes</div>
              </div>
              <div className="text-center">
                <div className="text-white text-3xl font-bold mb-2">{profile?.subjects?.length || 0}</div>
                <div className="text-gray-300 text-sm">Subjects Teaching</div>
              </div>
              <div className="text-center">
                <div className="text-white text-3xl font-bold mb-2">--</div>
                <div className="text-gray-300 text-sm">Total Students</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;


