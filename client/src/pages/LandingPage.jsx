import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Star, 
  Users, 
  TrendingUp, 
  Code, 
  Award,
  Github,
  ExternalLink,
  Calendar,
  MapPin,
  Mail,
  Phone,
  X,
  Briefcase,
  Clock
} from 'lucide-react';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaStar, FaTrophy, FaCode, FaLaptop, FaMobile, FaRobot, FaBug } from 'react-icons/fa';
import { landingService } from '../services/landingService';
import Footer from '../components/Footer';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [interns, setInterns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch categories and interns in parallel
        const [categoriesData, internsData] = await Promise.all([
          landingService.getCategoriesWithCounts(),
          landingService.getAllInterns()
        ]);
        
        setCategories(categoriesData);
        setInterns(internsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load interns data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
   

 

 

 

 

 

  }, []);

  // Fetch interns when category changes
  useEffect(() => {
    const fetchInternsByCategory = async () => {
      try {
        setLoading(true);
        const data = await landingService.getAllInterns(activeTab);
        setInterns(data);
      } catch (err) {
        setError('Failed to load interns for this category.');
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0) {
      fetchInternsByCategory();
    }
  }, [activeTab, categories.length]);

  // Removed automatic redirect - authenticated users can now view the landing page

  if (loading && interns.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      
      <Navbar />

      {/* Modern Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900 to-primary"></div>
        
        {/* Floating Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary to-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-red-800 to-black rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-black to-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Grid Pattern Overlay - Simplified */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8 animate-fade-in">
            <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></div>
            ✨ Next Generation Talent Platform
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="block text-white mb-2 animate-slide-up" style={{animationDelay: '0.2s'}}>
              Meet Our
            </span>
            <span className="block text-white animate-slide-up" style={{animationDelay: '0.4s'}}>
              <span className="bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent">
                Talented
              </span>{' '}
              <span className="bg-gradient-to-r from-primary via-red-400 to-white bg-clip-text text-transparent animate-gradient-x">
                Interns
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto text-white/90 leading-relaxed animate-fade-in" style={{animationDelay: '0.6s'}}>
            Discover the next generation of{' '}
            <span className="text-primary font-semibold animate-highlight">
              developers
            </span>
            ,{' '}
            <span className="text-red-300 font-semibold animate-highlight" style={{animationDelay: '0.1s'}}>
              designers
            </span>
            , and{' '}
            <span className="text-white font-semibold animate-highlight" style={{animationDelay: '0.2s'}}>
              innovators
            </span>
            {' '}shaping the future
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in" style={{animationDelay: '0.8s'}}>
            <button 
              onClick={() => document.getElementById('interns').scrollIntoView({ behavior: 'smooth' })}
              className="group relative px-6 py-3 bg-gradient-to-r from-primary to-red-600 rounded-xl font-semibold text-white text-base shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-2">
                View All Interns
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
            
            <Link
              to="/signup"
              className="group relative px-6 py-3 bg-transparent border border-white/40 rounded-xl font-semibold text-white text-base backdrop-blur-sm hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <span className="relative flex items-center gap-2">
                Join Our Program
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </span>
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fade-in" style={{animationDelay: '1s'}}>
            <div className="group">
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-black/30 transition-all duration-300 transform hover:scale-105">
                <div className="text-2xl sm:text-3xl font-bold mb-1 text-white">
                  {interns.length}
                </div>
                <div className="text-xs sm:text-sm text-white/70 font-medium">Active Interns</div>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-black/30 transition-all duration-300 transform hover:scale-105">
                <div className="text-2xl sm:text-3xl font-bold mb-1 text-white">
                  95%
                </div>
                <div className="text-xs sm:text-sm text-white/70 font-medium">Success Rate</div>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-black/30 transition-all duration-300 transform hover:scale-105">
                <div className="text-2xl sm:text-3xl font-bold mb-1 text-white">
                  50+
                </div>
                <div className="text-xs sm:text-sm text-white/70 font-medium">Projects Completed</div>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-black/30 transition-all duration-300 transform hover:scale-105">
                <div className="text-2xl sm:text-3xl font-bold mb-1 text-white">
                  15+
                </div>
                <div className="text-xs sm:text-sm text-white/70 font-medium">Technologies</div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-5 h-8 border border-white/40 rounded-full flex justify-center">
              <div className="w-1 h-2 bg-white/80 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white py-8 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeTab === category.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Interns Grid */}
      <section id="interns" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {interns.map(intern => (
              <InternCard 
                key={intern.id} 
                intern={intern}
              />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

// Intern Card Component
const InternCard = ({ intern }) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <div 
        className=" bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl"
        onClick={() => setShowPopup(true)}
      >
      {/* Header */}
      <div className="relative p-6 border-b border-gray-100">
        <div className="flex items-start gap-4">
          <img 
            src={intern.avatar} 
            alt={intern.name}
            className="w-16 h-16 rounded-full object-cover border-4 border-gray-100"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{intern.name}</h3>
            <p className="text-primary font-medium mb-2">{intern.role}</p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                {intern.location}
              </div>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-400" />
                {intern.progress}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="p-6 border-b border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-3">Progress</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Progress</span>
              <span className="font-medium">{intern.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                  className="bg-gradient-to-r from-primary to-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${intern.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

        {/* Skills Preview */}
        <div className="p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {intern.skills.slice(0, 4).map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
            {intern.skills.length > 4 && (
              <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-medium">
                +{intern.skills.length - 4} more
              </span>
            )}
          </div>
          <div className="mt-4 text-center">
            <span className="text-primary text-sm font-medium">Click for more details</span>
          </div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <InternPopup 
          intern={intern} 
          onClose={() => setShowPopup(false)} 
        />
      )}
    </>
  );
};

// Intern Popup Component
const InternPopup = ({ intern, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <img 
                src={intern.avatar} 
                alt={intern.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-gray-100"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{intern.name}</h2>
                <p className="text-primary font-semibold text-lg mb-2">{intern.role}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    {intern.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase size={16} />
                    {intern.experience}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400" />
                    {intern.progress}% Complete
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Bio */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
            <p className="text-gray-600 leading-relaxed">{intern.bio}</p>
          </div>

          {/* Contact & Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} />
                  <a href={`mailto:${intern.email}`} className="hover:text-primary">{intern.email}</a>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={16} />
                  <a href={`tel:${intern.phone}`} className="hover:text-primary">{intern.phone}</a>
                </div>
                {/* <div className="flex items-center gap-2 text-gray-600">
                  <Github size={16} />
                  <a href={intern.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    GitHub Profile
                  </a>
                </div> */}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Education</h3>
              <p className="text-gray-600">{intern.education}</p>
            </div>
          </div>

          {/* Progress */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Progress</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span className="font-medium">{intern.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary to-red-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${intern.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {intern.skills.map((skill, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

          {/* Achievements */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Achievements</h3>
            <div className="space-y-2">
              {intern.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Award size={16} className="text-yellow-500" />
                  <span className="text-gray-600">{achievement}</span>
                </div>
              ))}
            </div>
        </div>
        
          {/* Portfolio */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {intern.portfolio.map(project => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h5 className="font-semibold text-gray-900 mb-1">{project.title}</h5>
                <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                      className="flex-1 bg-primary text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <ExternalLink size={14} />
                    Live Demo
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-800 text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-1"
                  >
                    <Github size={14} />
                    Code
                  </a>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 