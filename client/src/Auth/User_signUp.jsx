import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, User, Mail, Phone } from 'lucide-react';
import {toast} from "react-hot-toast"

export default function User_signUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    
    try {
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      };

      await register(userData);
      navigate('/login'); // Redirect to login after successful registration
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex justify-center mb-6 lg:hidden">
            <div className="w-12 h-12 relative">
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
          <div className="text-center mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-sm sm:text-base text-gray-600">Join ZIP Intern Management System today</p>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Name Fields Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors duration-200 text-sm sm:text-base"
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors duration-200 text-sm sm:text-base"
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors duration-200 text-sm sm:text-base"
                placeholder="Email Address"
                required
              />
            </div>

            {/* Phone Field */}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors duration-200 text-sm sm:text-base"
                placeholder="Phone Number"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 sm:py-3 pr-12 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors duration-200 text-sm sm:text-base"
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

            {/* Confirm Password Field */}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 sm:py-3 pr-12 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors duration-200 text-sm sm:text-base"
                placeholder="Confirm Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-1 text-black bg-gray-100 border-gray-300 rounded focus:ring-black focus:ring-2"
                required
              />
              <label htmlFor="terms" className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                I agree to the{' '}
                <button type="button" className="text-black hover:underline font-medium">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-black hover:underline font-medium">
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E11D48] text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium hover:bg-[#ff3f68] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'CREATE ACCOUNT'
              )}
            </button>

            {/* Sign In Link */}
            <div className="text-center pt-2">
              <span className="text-xs sm:text-sm text-gray-600">Already have an account? </span>
              <Link 
                to="/login"
                className="text-xs sm:text-sm text-black hover:underline font-medium"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-900 via-primary to-pink-900 text-white flex-col items-center justify-center p-8 relative">
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
          <p className="text-xl text-white mb-12">MANAGEMENT SYSTEM</p>

          {/* Call to Action */}
          <p className="text-white mb-8">Already have an account? Sign in now.</p>
          <Link 
            to="/login"
            className="inline-block border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-black transition-all duration-300 font-medium"
          >
            SIGN IN
          </Link>
        </div>
      </div>
    </div>
  );
}