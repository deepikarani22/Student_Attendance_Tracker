import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SideBar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getNavigationItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'student':
        return [
          { label: 'Dashboard', path: '/student/dashboard' },
          { label: 'Day-Wise', path: '/student/day-wise' },
          { label: 'Subject-Wise', path: '/student/sub-wise' },
          { label: 'Activity', path: '/student/activity' },
          { label: 'Profile', path: '/profile' }
        ];
      case 'teacher':
        return [
          { label: 'Dashboard', path: '/teacher/dashboard' },
          { label: 'Activity', path: '/teacher/activity' },
          { label: 'Profile', path: '/profile' }
        ];
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Users', path: '/admin/users' },
          { label: 'Classes', path: '/admin/classes' },
          { label: 'Attendance', path: '/admin/attendance' },
          { label: 'Profile', path: '/profile' }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const getPortalTitle = () => {
    if (!user) return 'Portal';
    
    switch (user.role) {
      case 'student':
        return 'Student Portal';
      case 'teacher':
        return 'Teacher Portal';
      case 'admin':
        return 'Admin Portal';
      default:
        return 'Portal';
    }
  };

  return (
    <div className="flex min-h-screen sticky top-6">
      <div className="flex flex-col justify-between min-h-screen bg-gray-900 text-gray-100 p-5 rounded-2xl shadow-lg">
  {/* Top section */}
  <div>
    <div className="mb-6">
      <div className="text-xl font-bold">VCE</div>
      <div className="text-xs text-gray-300 mt-1">{getPortalTitle()}</div>
    </div>

    <nav className="space-y-3">
      {navigationItems.map((item) => (
        <div
          key={item.path}
          className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
            location.pathname === item.path
              ? 'bg-white/10 text-white'
              : 'hover:bg-white/6 text-gray-300'
          }`}
          onClick={() => navigate(item.path)}
        >
          {item.label}
        </div>
      ))}
    </nav>
  </div>

  {/* Bottom section */}
  <div>
    <div
      className="hover:text-red-500 cursor-pointer text-gray-300 mb-4"
      onClick={onLogout}
    >
      Logout
    </div>
  </div>
</div>

      </div>
  );
}

export default SideBar;


/*import OverallInfoCard from './StdCard';

function SideBar() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-gray-900 text-white p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
            VCE
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="hover:text-gray-300 cursor-pointer">Dashboard</li>
            <li className="hover:text-gray-300 cursor-pointer">Projects</li>
            <li className="hover:text-gray-300 cursor-pointer">Analytics</li>
            <li className="hover:text-gray-300 cursor-pointer">Settings</li>
          </ul>
        </div>

      //<div className="flex-3 p-10">
        //<OverallInfoCard attd={{ presentDays: 22, totalDays: 35 }} />
      //</div>

        <div className="hover:text-red-500 cursor-pointer">Logout</div>

        <div className="text-gray-400 text-xs border-t border-gray-700 pt-3">
          © 2025 YourApp
        </div>
      </div>
    </div>
  );
}

export default SideBar;*/


/*function SideBar(){
return(
    <div className="sideBar">
        <div className="topBar">
          <ul className="listBar">
            <li className="dash">Dashboard</li>
            <li className="act">Activity</li>
            <li className="profile">Profile</li>
          </ul>
        </div>
        <div className="bottomBar">
            <ul className="listLog">
                <li className="logout">Logout</li>
            </ul>
        </div>
    </div>
);
}
export default SideBar;*/