import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SideBar from "../components/SideBar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import NotificationIcon from "../components/Notification.jsx";
import api from "../services/api";

function AdminUsers() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    rollNo: '',
    teacherId: '',
    subjects: []
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/admin/users/${editingUser._id}`, formData);
      } else {
        await api.post('/admin/users', formData);
      }
      fetchUsers();
      setShowForm(false);
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'student',
        rollNo: '',
        teacherId: '',
        subjects: []
      });
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (userToEdit) => {
    setEditingUser(userToEdit);
    setFormData({
      name: userToEdit.name,
      email: userToEdit.email,
      password: '',
      role: userToEdit.role,
      rollNo: userToEdit.rollNo || '',
      teacherId: userToEdit.teacherId || '',
      subjects: userToEdit.subjects || []
    });
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
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
            <h1 className="text-2xl font-semibold">User Management</h1>
            <p className="text-sm text-gray-700">
              Manage students, teachers, and administrators.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar />
            <NotificationIcon />
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : 'Add User'}
            </button>
          </div>
        </div>

        {/* USER FORM */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
            <h3 className="text-white text-lg font-semibold mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={!editingUser}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {formData.role === 'student' && (
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Roll Number</label>
                  <input
                    type="text"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {formData.role === 'teacher' && (
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Teacher ID</label>
                  <input
                    type="text"
                    value={formData.teacherId}
                    onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-200"
                >
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingUser(null);
                    setFormData({
                      name: '',
                      email: '',
                      password: '',
                      role: 'student',
                      rollNo: '',
                      teacherId: '',
                      subjects: []
                    });
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* USERS TABLE */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <h3 className="text-white text-lg font-semibold mb-4">All Users</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left text-gray-300 py-3">Name</th>
                  <th className="text-left text-gray-300 py-3">Email</th>
                  <th className="text-left text-gray-300 py-3">Role</th>
                  <th className="text-left text-gray-300 py-3">ID</th>
                  <th className="text-left text-gray-300 py-3">Class</th>
                  <th className="text-left text-gray-300 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem) => (
                  <tr key={userItem._id} className="border-b border-gray-700">
                    <td className="text-white py-3">{userItem.name}</td>
                    <td className="text-gray-300 py-3">{userItem.email}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        userItem.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                        userItem.role === 'teacher' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {userItem.role}
                      </span>
                    </td>
                    <td className="text-gray-300 py-3">
                      {userItem.rollNo || userItem.teacherId || 'N/A'}
                    </td>
                    <td className="text-gray-300 py-3">
                      {userItem.class?.name || 'N/A'}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(userItem)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(userItem._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition duration-200"
                        >
                          Delete
                        </button>
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

export default AdminUsers;


