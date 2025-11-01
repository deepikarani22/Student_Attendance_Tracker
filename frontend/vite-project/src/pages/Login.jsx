import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../services/api';

const Login = () => {
  const { setUser, setToken } = useAuth();
  const [formData, setFormData] = useState({
    role: 'student',
    email: '',
    password: '',
    rollNo: '',
    teacherId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  // Validate form data based on role
  if (!formData.role || !formData.password) {
    setError('Role and password are required');
    setLoading(false);
    return;
  }

  if (formData.role === 'admin' && !formData.email) {
    setError('Email is required for admin');
    setLoading(false);
    return;
  }

  if (formData.role === 'student' && !formData.email && !formData.rollNo) {
    setError('Email or roll number is required for students');
    setLoading(false);
    return;
  }

  if (formData.role === 'teacher' && !formData.email && !formData.teacherId) {
    setError('Email or teacher ID is required for teachers');
    setLoading(false);
    return;
  }

  try {
    console.log('🚀 Sending login request:', {
      role: formData.role,
      email: formData.email,
      password: '***',
      rollNo: formData.rollNo,
      teacherId: formData.teacherId
    });

    const response = await axios.post('/login', {
      role: formData.role,
      email: formData.email,
      password: formData.password,
      ...(formData.rollNo && { rollNo: formData.rollNo }),
      ...(formData.teacherId && { teacherId: formData.teacherId })
    });


    const { token, user } = response.data;

    if (!token || !user) {
      throw new Error('Invalid response from server');
    }

    user.role = user.role.toLowerCase();

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setToken(token);
    setUser(user);

    const redirectPath = {
      student: '/student/dashboard',
      teacher: '/teacher/dashboard',
      admin: '/admin/dashboard'
    }[user.role];

    if (!redirectPath) {
      console.error('Invalid user role:', user.role);
      setError('Invalid user role');
      return;
    }
    navigate(redirectPath, { replace: true });
    
  } catch (err) {
    console.error('Login error:', err);
    const errorMessage = err.response?.data?.message || err.message || 'Login failed';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-500 to-gray-200 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">VCE</h1>
          <p className="text-gray-200">Student Attendance Tracker</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Select Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {/* Email (optional for students/teachers, required for admin) */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Email {formData.role === 'admin' ? '*' : ''}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required={formData.role === 'admin'}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={formData.role === 'admin' ? 'Enter your email' : 'Email (optional)'}
            />
          </div>

          {/* Roll Number (for students) */}
          {formData.role === 'student' && (
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Roll Number
              </label>
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your roll number (optional)"
              />
            </div>
          )}

          {/* Teacher ID (for teachers) */}
          {formData.role === 'teacher' && (
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Teacher ID
              </label>
              <input
                type="text"
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your teacher ID (optional)"
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form> <br/>
        <div>
          <h5 className="text-white text-xs font-medium mb-2">Demo Accounts (for testing):</h5>
          <div className="text-gray-300 text-xs space-y-1">
            <h4><span className="font-semibold">Student:</span> alice@example.com / 12345 (Roll : S001)</h4>
            <h4><span className="font-semibold">Teacher:</span> smith@example.com / 12345 (T-ID : T001)</h4>
            <h4><span className="font-semibold">Admin:</span> admin@example.com / 12345</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;