import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user, token } = useAuth();

  // Development mode: skip all validation
  // const DEV_MODE = false;



  // In development mode, if we have a token, allow access immediately
  // if (DEV_MODE && token) {
  //   console.log('🚀 Dev mode: Allowing access with token');
  //   return children;
  // }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // In development mode, if we have a token but no user, create a default user
  // if (DEV_MODE && token && !user && !loading) {
  //   console.log('🚀 Dev mode: Has token but no user, creating default user');
  //   // This will be handled by the AuthContext, just show loading briefly
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
  //       <div className="text-center">
  //         <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
  //         <p className="text-gray-600">Initializing...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute; 