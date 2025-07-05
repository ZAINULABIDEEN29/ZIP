import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { InternProvider } from './context/InternContext';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Progress from './pages/Progress';
import Skills from './pages/Skills';
import Portfolio from './pages/Portfolio';
import DailyTasks from './pages/DailyTasks';
import Feedback from './pages/Feedback';
import Social from './pages/Social';
import LandingPage from './pages/LandingPage';
import User_login from './Auth/User_login';
import User_signUp from './Auth/User_signUp';
import ForgotPassword from './Auth/ForgotPassword';
import ResetPassword from './Auth/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import ApproveIntern from './pages/ApproveIntern';
import ApproveSkill from './pages/ApproveSkill';
import ApproveProject from './pages/ApproveProject';


function App() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <AuthProvider>
      <InternProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Public Auth Routes */}
            <Route path="/login" element={<User_login />} />
            <Route path="/signup" element={<User_signUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Auth Routes with /auth prefix */}
            <Route path="/auth/login" element={<User_login />} />
            <Route path="/auth/signup" element={<User_signUp />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/progress" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Progress />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/skills" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Skills />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/portfolio" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Portfolio />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/daily-tasks" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DailyTasks />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/feedback" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Feedback />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/social" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Social />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/approve-intern/:token" element={<ApproveIntern />} />
            <Route path="/approve-skill/:token" element={<ApproveSkill />} />
            <Route path="/approve-project/:token" element={<ApproveProject />} />
            
            {/* Redirect to landing page for any other routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </InternProvider>
      </AuthProvider>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
