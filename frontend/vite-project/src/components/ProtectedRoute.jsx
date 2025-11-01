import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // 🔍 Debugging log — remove after confirming everything works
  console.log('🛡️ ProtectedRoute check:', {
    currentPath: location.pathname,
    user: user ? { role: user.role, email: user.email } : 'No user',
    allowedRoles,
  });

  if (!user) {
    console.warn('🚫 No user found, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // Normalize roles for comparison
  const userRole = user.role?.toLowerCase();
  const rolesAllowed = allowedRoles?.map((r) => r.toLowerCase());

  // 🔍 More debug info
  if (allowedRoles) {
    console.log(
      `👤 User role: ${userRole} | Allowed: ${rolesAllowed.join(', ')}`
    );
  }

  if (allowedRoles && !rolesAllowed.includes(userRole)) {
    console.warn(
      `⚠️ Unauthorized access — user role (${userRole}) not allowed on this route`
    );
    return <Navigate to="/login" replace />;
  }

  console.log('✅ Access granted to:', location.pathname);
  return children;
};

export default ProtectedRoute;



/*import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-500 to-gray-200 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
*/

