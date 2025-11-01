import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherClassPage from "./pages/TeacherClassPage";
import AdminDashboard from './pages/AdminDashboard';
import DayWisePage from './pages/DayWisePage';
import SubjectWisePage from './pages/SubjectWisePage';
import StudentActivityPage from './pages/StudentActivityPage';
import TeacherActivityPage from './pages/TeacherActivityPage';
import ProfilePage from './pages/ProfilePage';
import AdminUsers from './pages/AdminUsers';
import AdminClasses from './pages/AdminClasses';
import AdminAttendance from './pages/AdminAttendance';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/student/day-wise" element={
            <ProtectedRoute allowedRoles={['student']}>
              <DayWisePage />
            </ProtectedRoute>
          } />
          <Route path="/student/sub-wise" element={
            <ProtectedRoute allowedRoles={['student']}>
              <SubjectWisePage />
            </ProtectedRoute>
          } />
          <Route path="/student/activity" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentActivityPage />
            </ProtectedRoute>
          } />
          
          <Route path="/teacher/dashboard" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } />
          <Route path="/teacher/class/:className" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherClassPage />
            </ProtectedRoute>
          } />
          <Route path="/teacher/activity" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherActivityPage />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/classes" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminClasses />
            </ProtectedRoute>
          } />
          <Route path="/admin/attendance" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAttendance />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
