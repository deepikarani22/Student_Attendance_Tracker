import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SideBar from "../components/SideBar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import NotificationIcon from "../components/Notification.jsx";
import api from "../services/api";

function StudentActivityPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    receiverId: '',
    message: '',
    type: 'general'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, teachersResponse] = await Promise.all([
          api.get(`/posts/student/${user.id}`),
          api.get('/users/teachers').catch(() => {
            // Fallback if endpoint fails
            return { data: [] };
          })
        ]);
        
        setPosts(postsResponse.data || []);
        const teachersList = Array.isArray(teachersResponse.data) 
          ? teachersResponse.data
          : [];
        setTeachers(teachersList);
      } catch (error) {
        console.error('Error fetching data:', error);
        // If endpoint fails, try to fetch posts only
        try {
          const postsResponse = await api.get(`/posts/student/${user.id}`);
          setPosts(postsResponse.data || []);
        } catch (err) {
          console.error('Error fetching posts:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate teacher selection
    if (!formData.receiverId) {
      alert('Please select a teacher');
      return;
    }
    
    try {
      const response = await api.post('/posts/student', {
        receiverId: formData.receiverId,
        message: formData.message,
        type: formData.type
      });
      setPosts([response.data.post, ...posts]);
      setFormData({ receiverId: '', message: '', type: 'general' });
      setShowForm(false);
      alert('Post sent successfully!');
    } catch (error) {
      console.error('Error sending post:', error);
      alert(`Failed to send post: ${error.response?.data?.message || error.message}`);
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
            <h1 className="text-2xl font-semibold">Student Activity</h1>
            <p className="text-sm text-gray-700">
              Communicate with your teachers and view your posts.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar />
            <NotificationIcon />
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : 'New Post'}
            </button>
          </div>
        </div>

        {/* NEW POST FORM */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
            <h3 className="text-white text-lg font-semibold mb-4">Send Message to Teacher</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Select Teacher
                </label>
                <select
                  value={formData.receiverId}
                  onChange={(e) => setFormData({...formData, receiverId: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher._id} value={teacher._id} className="text-gray-900">
                      {teacher.name} ({teacher.teacherId || teacher.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Message Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="leave_request">Leave Request</option>
                  <option value="complaint">Complaint</option>
                  <option value="question">Question</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message here..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
                >
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* POSTS LIST */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <h3 className="text-white text-lg font-semibold mb-4">Your Posts</h3>
          
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post._id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-white font-medium">To: {post.receiver?.name}</span>
                      <span className="text-gray-400 text-sm ml-2">({post.receiver?.teacherId})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        post.type === 'leave_request' ? 'bg-orange-500/20 text-orange-400' :
                        post.type === 'complaint' ? 'bg-red-500/20 text-red-400' :
                        post.type === 'question' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {post.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-3">{post.message}</p>
                  
                  {/* Reply Status Badge - Always shown */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      post.status === 'replied' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      post.status === 'resolved' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {post.status === 'replied' ? '✓ Replied' : 
                       post.status === 'resolved' ? '✓ Resolved' : 
                       '⏳ Pending'}
                    </span>
                  </div>

                  {post.reply && (
                    <div className="bg-blue-500/10 border-l-4 border-blue-500 p-3 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-400 font-medium">Reply from {post.receiver?.name}</span>
                        <span className="text-gray-400 text-xs">
                          {post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <p className="text-gray-300">{post.reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No posts yet. Send your first message to a teacher!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentActivityPage;


