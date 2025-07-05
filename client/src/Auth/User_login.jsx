import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function User_login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
    
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      // Add a small delay to ensure state is updated
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
      
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100 p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 relative">
              <svg viewBox="0 0 64 64" className="w-full h-full">
                <circle cx="32" cy="20" r="6" fill="#E11D48"/>
                <circle cx="20" cy="32" r="5" fill="#E11D48"/>
                <circle cx="44" cy="32" r="5" fill="#E11D48"/>
                <circle cx="32" cy="44" r="4" fill="#E11D48"/>
                <circle cx="18" cy="44" r="3" fill="#E11D48"/>
                <circle cx="46" cy="44" r="3" fill="#E11D48"/>
                <circle cx="32" cy="56" r="3" fill="#E11D48"/>
              </svg>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back !!</h1>
            <p className="text-gray-600">Please enter your credentials to log in</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors duration-200"
                placeholder="Email"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors duration-200"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-left">
              <Link 
                to="/forgot-password"
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Forget Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E11D48] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#fd3b65] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'SIGN IN'
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <span className="text-sm text-gray-600">Don't have an account? </span>
              <Link 
                to="/signup"
                className="text-sm text-black hover:underline font-medium"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#E11D48]  text-white flex-col items-center justify-center p-8 relative">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.3'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 relative">
              <svg viewBox="0 0 80 80" className="w-full h-full">
                <circle cx="40" cy="25" r="8" fill="white"/>
                <circle cx="25" cy="40" r="6" fill="white"/>
                <circle cx="55" cy="40" r="6" fill="white"/>
                <circle cx="40" cy="55" r="5" fill="white"/>
                <circle cx="22" cy="55" r="4" fill="white"/>
                <circle cx="58" cy="55" r="4" fill="white"/>
                <circle cx="40" cy="70" r="4" fill="white"/>
              </svg>
            </div>
          </div>

          {/* Brand Name */}
          <h1 className="text-4xl font-bold mb-2">ZIP Intern</h1>
          <p className="text-xl text-white-300 mb-12">MANAGEMENT SYSTEM</p>

          {/* Call to Action */}
          <p className="text-white mb-8">New to our platform? Sign up now.</p>
          <Link 
            to="/signup"
            className="inline-block border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-black transition-all duration-300 font-medium"
          >
            SIGN UP
          </Link>
        </div>
      </div>
    </div>
  );
}

