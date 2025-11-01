import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SideBar from "../components/SideBar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import NotificationIcon from "../components/Notification.jsx";
import api from "../services/api";

function AdminClasses() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    studentIds: [],
    teacherIds: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classesResponse, usersResponse] = await Promise.all([
        api.get('/admin/classes'),
        api.get('/admin/users')
      ]);
      setClasses(classesResponse.data);
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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
      if (editingClass) {
        await api.put(`/admin/classes/${editingClass._id}`, formData);
      } else {
        await api.post('/admin/classes', formData);
      }
      fetchData();
      setShowForm(false);
      setEditingClass(null);
      setFormData({ name: '', studentIds: [], teacherIds: [] });
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const handleEdit = (classToEdit) => {
    setEditingClass(classToEdit);
    setFormData({
      name: classToEdit.name,
      studentIds: classToEdit.students?.map(s => s._id) || [],
      teacherIds: classToEdit.teachers?.map(t => t._id) || []
    });
    setShowForm(true);
  };

  const handleDelete = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await api.delete(`/admin/classes/${classId}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting class:', error);
      }
    }
  };

  const students = users.filter(u => u.role === 'student');
  const teachers = users.filter(u => u.role === 'teacher');

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
            <h1 className="text-2xl font-semibold">Class Management</h1>
            <p className="text-sm text-gray-700">
              Create and manage classes, assign teachers and students.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar />
            <NotificationIcon />
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : 'Add Class'}
            </button>
          </div>
        </div>

        {/* CLASS FORM */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
            <h3 className="text-white text-lg font-semibold mb-4">
              {editingClass ? 'Edit Class' : 'Add New Class'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Class Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Students</label>
                <div className="max-h-32 overflow-y-auto border border-white/20 rounded-lg p-2">
                  {students.map(student => (
                    <label key={student._id} className="flex items-center space-x-2 text-white text-sm">
                      <input
                        type="checkbox"
                        checked={formData.studentIds.includes(student._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              studentIds: [...formData.studentIds, student._id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              studentIds: formData.studentIds.filter(id => id !== student._id)
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span>{student.name} ({student.rollNo})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Teachers</label>
                <div className="max-h-32 overflow-y-auto border border-white/20 rounded-lg p-2">
                  {teachers.map(teacher => (
                    <label key={teacher._id} className="flex items-center space-x-2 text-white text-sm">
                      <input
                        type="checkbox"
                        checked={formData.teacherIds.includes(teacher._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              teacherIds: [...formData.teacherIds, teacher._id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              teacherIds: formData.teacherIds.filter(id => id !== teacher._id)
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span>{teacher.name} ({teacher.teacherId})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-200"
                >
                  {editingClass ? 'Update Class' : 'Add Class'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingClass(null);
                    setFormData({ name: '', studentIds: [], teacherIds: [] });
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CLASSES TABLE */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <h3 className="text-white text-lg font-semibold mb-4">All Classes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left text-gray-300 py-3">Class Name</th>
                  <th className="text-left text-gray-300 py-3">Students</th>
                  <th className="text-left text-gray-300 py-3">Teachers</th>
                  <th className="text-left text-gray-300 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classItem) => (
                  <tr key={classItem._id} className="border-b border-gray-700">
                    <td className="text-white py-3 font-medium">{classItem.name}</td>
                    <td className="text-gray-300 py-3">
                      <div className="space-y-1">
                        {classItem.students?.map((student, index) => (
                          <div key={index} className="text-xs">
                            {student.name} ({student.rollNo})
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="text-gray-300 py-3">
                      <div className="space-y-1">
                        {classItem.teachers?.map((teacher, index) => (
                          <div key={index} className="text-xs">
                            {teacher.name} ({teacher.teacherId})
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(classItem)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(classItem._id)}
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

export default AdminClasses;





