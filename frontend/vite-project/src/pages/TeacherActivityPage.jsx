import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SideBar from "../components/SideBar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import NotificationIcon from "../components/Notification.jsx";
import api from "../services/api";

function TeacherActivityPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get(`/posts/teacher/${user.id}`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleReply = async (postId) => {
    if (!replyText.trim()) return;

    try {
      const response = await api.post(`/posts/reply/${postId}`, {
        reply: replyText
      });
      
      // Refetch posts to get updated data from server
      const postsResponse = await api.get(`/posts/teacher/${user.id}`);
      setPosts(postsResponse.data || []);
      
      setSelectedPost(null);
      setReplyText('');
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert(`Failed to send reply: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleStatusUpdate = async (postId, status) => {
    try {
      await api.put(`/posts/${postId}/status`, { status });
      
      // Update the posts list
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, status } : post
      ));
    } catch (error) {
      console.error('Error updating status:', error);
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
            <h1 className="text-2xl font-semibold">Teacher Activity</h1>
            <p className="text-sm text-gray-700">
              Manage student posts and communications.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar />
            <NotificationIcon />
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Posts</p>
                <p className="text-white text-2xl font-bold">{posts.length}</p>
              </div>
              <span className="text-white text-2xl">📝</span>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Pending</p>
                <p className="text-white text-2xl font-bold">
                  {posts.filter(post => post.status === 'pending').length}
                </p>
              </div>
              <span className="text-white text-2xl">⏳</span>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Replied</p>
                <p className="text-white text-2xl font-bold">
                  {posts.filter(post => post.status === 'replied' || post.status === 'resolved').length}
                </p>
              </div>
              <span className="text-white text-2xl">✅</span>
            </div>
          </div>
        </div>

        {/* POSTS LIST */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <h3 className="text-white text-lg font-semibold mb-4">Student Posts</h3>
          
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post._id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-white font-medium">{post.sender?.name}</span>
                      <span className="text-gray-400 text-sm ml-2">({post.sender?.rollNo})</span>
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
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        post.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        post.status === 'replied' ? 'bg-green-500/20 text-green-400' :
                        post.status === 'resolved' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-3">{post.message}</p>
                  
                  {post.reply && (
                    <div className="bg-green-500/10 border-l-4 border-green-500 p-3 rounded mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-green-400 font-medium">Your Reply</span>
                      </div>
                      <p className="text-gray-300">{post.reply}</p>
                    </div>
                  )}

                  {/* Reply Section */}
                  {post.status === 'pending' && (
                    <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={() => setSelectedPost(selectedPost === post._id ? null : post._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition duration-200"
                        >
                          {selectedPost === post._id ? 'Cancel' : 'Reply'}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(post._id, 'resolved')}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition duration-200"
                        >
                          Mark Resolved
                        </button>
                      </div>
                      
                      {selectedPost === post._id && (
                        <div className="space-y-3">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your reply..."
                            rows={3}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => handleReply(post._id)}
                            disabled={!replyText.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm transition duration-200"
                          >
                            Send Reply
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No posts from students yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default TeacherActivityPage;


