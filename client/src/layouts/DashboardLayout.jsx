import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  User, 
  Target, 
  Code, 
  Briefcase, 
  MessageSquare, 
  Users, 
  Menu, 
  X,
  LogOut,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useIntern } from '../context/InternContext';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const { profile } = useIntern();

  // Use profile data from InternContext if available, otherwise fall back to user data from AuthContext
  const displayUser = profile || user;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Progress', href: '/progress', icon: Target },
    { name: 'Skills', href: '/skills', icon: Code },
    { name: 'Portfolio', href: '/portfolio', icon: Briefcase },
    { name: 'Daily Tasks', href: '/daily-tasks', icon: Calendar },
    { name: 'Feedback', href: '/feedback', icon: MessageSquare },
    { name: 'Social', href: '/social', icon: Users },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">ZIP Intern</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info */}
        {displayUser && (
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              {displayUser.avatar ? (
                <img 
                  src={displayUser.avatar} 
                  alt={displayUser.name || 'User'} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                  {displayUser.name ? displayUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{displayUser.name}</p>
                <p className="text-xs text-gray-500">{displayUser.email}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="mt-6 px-3">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-primary text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Auth Section */}
        <div className="absolute bottom-6 left-0 right-0 px-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">ZIP Intern</h1>
            <div className="w-8"></div> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 