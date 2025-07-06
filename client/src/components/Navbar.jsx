import React, { useState, useEffect, useRef } from 'react';
import {Link} from 'react-router-dom'



const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const navbarRef = useRef(null);

  // Check for mobile/tablet
  const isMobileOrTablet = () => window.innerWidth < 992;

  // Function to hide all mega menus
  const hideAllMegaMenus = () => {
    setActiveMenu(null);
  };

  // Handle menu hover/click
  const handleMenuInteraction = (menuName) => {
    if (isMobileOrTablet()) return;

    if (activeMenu === menuName) {
      hideAllMegaMenus();
      setIsLocked(false);
    } else {
      hideAllMegaMenus();
      setActiveMenu(menuName);
      setIsLocked(true);
    }
  };

  // Handle menu hover
  const handleMenuHover = (menuName) => {
    if (isMobileOrTablet() || isLocked) return;
    setActiveMenu(menuName);
  };

  // Handle menu leave
  const handleMenuLeave = () => {
    if (isMobileOrTablet() || isLocked) return;
    hideAllMegaMenus();
  };

  // Handle navbar leave
  const handleNavbarLeave = () => {
    if (isMobileOrTablet() || isLocked) return;
    hideAllMegaMenus();
  };

  // Handle mobile dropdown toggle
  const handleMobileDropdown = (menuName) => {
    if (mobileDropdown === menuName) {
      setMobileDropdown(null);
    } else {
      setMobileDropdown(menuName);
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && activeMenu) {
        hideAllMegaMenus();
        setIsLocked(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [activeMenu]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (isMobileOrTablet()) {
        hideAllMegaMenus();
        setIsLocked(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeMenu && navbarRef.current && !navbarRef.current.contains(e.target) && !isLocked) {
        hideAllMegaMenus();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenu, isLocked]);

  return (
    <>
      {/* Main Navbar */}
      <div className="bg-black fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between py-4 lg:px-20" ref={navbarRef} onMouseLeave={handleNavbarLeave}>
            {/* Logo */}
            <Link to="https://www.zimlitech.com/" className="flex items-center ">
              <header className="flex items-center">
                <img 
                  src="/zimlitech_logo.png" 
                  alt="ZimliTech Logo" 
                  className="w-8 h-8 sm:w-10 mt-1 sm:h-10 mr-2"
                />
                <h1 className="text-white  font-bold  text-lg sm:text-xl lg:text-2xl">
                  Zimli<span className="text-red-500">Tech</span>
                </h1>
              </header>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-white border border-white/30 p-2 rounded hover:bg-white/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-between flex-1 ml-8">
              {/* Left side: Navigation Links */}
              <ul className="flex items-center mx-auto">
                {/* Services Dropdown */}
                <li className="relative mr-3">
                  <button
                    className="text-white px-4 py-2 text-md font-medium hover:text-red-500 transition-colors"
                    onMouseEnter={() => handleMenuHover('services')}
                    onClick={() => handleMenuInteraction('services')}
                  >
                    Services
                  </button>
                </li>

                {/* Products Dropdown */}
                <li className="relative mr-3">
                  <button
                    className="text-white px-4 py-2 text-md font-semibold hover:text-red-500 transition-colors"
                    onMouseEnter={() => handleMenuHover('products')}
                    onClick={() => handleMenuInteraction('products')}
                  >
                    Products
                  </button>
                </li>

                {/* Insights Dropdown */}
                <li className="relative mr-3">
                  <button
                    className="text-white px-4 py-2 text-md font-semibold hover:text-red-500 transition-colors"
                    onMouseEnter={() => handleMenuHover('insights')}
                    onClick={() => handleMenuInteraction('insights')}
                  >
                    Insights
                  </button>
                </li>

                <li className="mr-3">
                  <Link
                    to="https://www.zimlitech.com/team" 
                    className="text-white px-4 py-2 text-md font-semibold hover:text-red-500 transition-colors"
                    onMouseEnter={handleMenuLeave}
                  >
                    Team
                  </Link>
                </li>
                <li className="mr-3">
                  <Link
                    to="https://www.zimlitech.com/about" 
                    className="text-white px-4 py-2 text-md font-semibold hover:text-red-500 transition-colors"
                    onMouseEnter={handleMenuLeave}
                  >
                    About Us
                  </Link>
                </li>
              </ul>

              {/* Right side: Contact & Login */}
              <div className="flex flex-col lg:flex-row items-center">
                <Link to="https://www.zimlitech.com/#contact-form" className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors mb-2 lg:mb-0 lg:mr-3">
                  Contact Us
                </Link>
                <Link to="/login" className="border border-white text-white px-8 py-2 rounded-lg text-sm font-medium hover:bg-white hover:text-black transition-colors">
                  <i className="bi bi-person-fill mr-1"></i> Login
                </Link>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="lg:hidden absolute top-full left-0 w-full bg-black border-t border-gray-700">
                <div className="px-4 py-4">
                  <ul className="space-y-2">
                    {/* Services Dropdown */}
                    <li className="relative">
                      <button
                        className="text-white px-4 py-2 text-base font-medium hover:text-red-500 transition-colors w-full text-left flex justify-between items-center"
                        onClick={() => handleMobileDropdown('services')}
                      >
                        Services
                        <svg className={`w-4 h-4 transition-transform ${mobileDropdown === 'services' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {mobileDropdown === 'services' && (
                        <ul className="bg-black border-l-4 border-red-500 mt-1 py-2">
                          <li><p className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" >Software Development</p></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/services/web-development">Web Development</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/services/mobile-app-development">Mobile App Development</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/services/custom-software-solutions">Custom Software Solutions</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/services/api-development">API Development & Integration</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/services/saas-development">SaaS Development</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/services/data-analytics">Data Analytics</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/services/machine-learning">Machine Learning</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/services/ai-model-development">AI Model Development</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/services/predictive-analysis">Predictive Analysis</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/services/data-visualization">Data Visualization</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/services/ui-ux-design">UI/UX Design</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/services/cyber-security-audits">Cyber Security</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/services/it-consulting">IT Support</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/services/cloud-migration">Cloud Migration</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/services/devops-services">DevOps Services</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/services/cloud-security">Cloud Security</Link></li>
                        </ul>
                      )}
                    </li>

                    {/* Products Dropdown */}
                    <li className="relative">
                      <button
                        className="text-white px-4 py-2 text-base font-medium hover:text-red-500 transition-colors w-full text-left flex justify-between items-center"
                        onClick={() => handleMobileDropdown('products')}
                      >
                        Products
                        <svg className={`w-4 h-4 transition-transform ${mobileDropdown === 'products' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {mobileDropdown === 'products' && (
                        <ul className="bg-black border-l-4 border-red-500 mt-1 py-2">
                          <li><h6 className="px-4 py-2 text-red-500 font-semibold text-xs uppercase">Featured Products</h6></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/zimbiz-pos">ZimBiz POS System</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/gogo-maps">GoGo Maps</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/moola-app">Moola App</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/audio-watermark">Audio Watermark</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/mappit-app">Mappit App</Link></li>
                          <li><hr className="border-t border-white/10 my-2" /></li>
                          <li><h6 className="px-4 py-2 text-red-500 font-semibold text-xs uppercase">Enterprise Solutions</h6></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/zimli-erp">ZimliERP</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/datasync-platform">DataSync Platform</Link></li>
                          <li><hr className="border-t border-white/10 my-2" /></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="#">View All Products</Link></li>
                        </ul>
                      )}
                    </li>

                    {/* Insights Dropdown */}
                    <li className="relative">
                      <button
                        className="text-white px-4 py-2 text-base font-medium hover:text-red-500 transition-colors w-full text-left flex justify-between items-center"
                        onClick={() => handleMobileDropdown('insights')}
                      >
                        Insights
                        <svg className={`w-4 h-4 transition-transform ${mobileDropdown === 'insights' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {mobileDropdown === 'insights' && (
                        <ul className="bg-black border-l-4 border-red-500 mt-1 py-2">
                          <li><h6 className="px-4 py-2 text-red-500 font-semibold text-xs uppercase">Latest Articles</h6></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/insights/technology-trend">Technology Trends 2023</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/insights/ai-business-operations">AI in Business Operations</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/insights/future-web-development">The Future of Web Development</Link></li>
                          <li><hr className="border-t border-white/10 my-2" /></li>
                          <li><h6 className="px-4 py-2 text-red-500 font-semibold text-xs uppercase">Case Studies</h6></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/insights/healthcare-app-development">E-commerce Platform Migration</Link></li>
                          <li><Link className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" to="https://www.zimlitech.com/insights/healthcare-app-development">Healthcare App Development</Link></li>
                          <li><hr className="border-t border-white/10 my-2" /></li>
                          <li><h6 className="px-4 py-2 text-red-500 font-semibold text-xs uppercase">Videos & Webinars</h6></li>
                          <li><p className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" >AI Development Masterclass</p></li>
                          <li><p className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" >Cloud Security Summit</p></li>
                          <li><hr className="border-t border-white/10 my-2" /></li>
                          <li><p className="block px-4 py-2 text-white hover:bg-red-500 transition-colors" >View All Insights</p></li>
                        </ul>
                      )}
                    </li>

                    <li>
                      <Link to="https://www.zimlitech.com/team" className="text-white px-4 py-2 text-base font-medium hover:text-red-500 transition-colors block">Team</Link>
                    </li>
                    <li>
                      <Link to="https://www.zimlitech.com/about" className="text-white px-4 py-2 text-base font-medium hover:text-red-500 transition-colors block">About Us</Link>
                    </li>
                  </ul>

                  {/* Mobile Buttons */}
                  <div className="mt-4 space-y-2">
                    <Link to="/#contact-form" className="bg-red-500 text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition-colors block w-full text-center">
                      Contact Us
                    </Link>
                    <Link to="/login" className="border border-white text-white px-4 py-2 rounded text-sm font-medium hover:bg-white hover:text-black transition-colors block w-full text-center">
                      <i className="bi bi-person-fill mr-1"></i> Login
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Services Mega Menu */}
      <div 
        className={`fixed top-16 sm:top-20 lg:top-[69px] left-0 w-full bg-white border-t border-gray-200 z-40 shadow-lg transition-all duration-200 hidden lg:block ${
          activeMenu === 'services' ? 'lg:block opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
        }`}
        onMouseEnter={() => handleMenuHover('services')}
        onMouseLeave={handleMenuLeave}
      >
        <div className="container mx-auto px-4 lg:px-20 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Software Development */}
                <div>
                  <h5 className="text-black text-xl font-bold relative pb-2 mb-4 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-red-500">
                    Software Development
                  </h5>
                  <ul className="space-y-0 text-md font-normal">
                    <li><Link className="text-gray-700  hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/web-development">Web Development</Link></li>
                    <li><Link className="text-gray-700   hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/mobile-app-development">Mobile App Development</Link></li>
                    <li><Link className="text-gray-700   hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/saas-development">SaaS Development</Link></li>
                    <li><Link className="text-gray-700  hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/custom-software-solutions">Custom Software Solutions</Link></li>
                    <li><Link className="text-gray-700   hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/api-development">API Development & Integration</Link></li>
                  </ul>
                </div>

                {/* Data Science */}
                <div>
                  <h5 className="text-black text-xl font-bold relative pb-2 mb-4 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-red-500">
                    Data Science
                  </h5>
                  <ul className="space-y-0">
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/data-analytics">Data Analytics</Link></li>
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/machine-learning">Machine Learning</Link></li>
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/ai-model-development">AI Model Development</Link></li>
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/predictive-analysis">Predictive Analysis</Link></li>
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/data-visualization">Data Visualization</Link></li>
                  </ul>
                </div>

                {/* Cloud Computing */}
                <div>
                  <h5 className="text-black text-xl font-bold relative pb-2 mb-4 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-red-500">
                    Cloud Computing
                  </h5>
                  <ul className="space-y-0">
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/cloud-migration">Cloud Migration</Link></li>
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/devops-services">DevOps Services</Link></li>
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/cloud-security">Cloud Security</Link></li>
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/serverless-architecture">Serverless Architecture</Link></li>
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/managed-cloud-services">Managed Cloud Services</Link></li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                {/* Design Services */}
                <div>
                  <h5 className="text-black text-xl font-bold relative pb-2 mb-4 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-red-500">
                    Design Services
                  </h5>
                  <ul className="space-y-0">
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/ui-ux-design">UI/UX Design</Link></li>
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/branding-identity">Branding & Identity</Link></li>
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/wireframing-prototyping">Wireframing & Prototyping</Link></li>
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/design-system-development">Design System Development</Link></li>
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/mobile-webapp-design">Mobile & Web App Design</Link></li>
                  </ul>
                </div>

                {/* Digital Marketing */}
                <div>
                  <h5 className="text-black text-xl font-bold relative pb-2 mb-4 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-red-500">
                    Digital Marketing
                  </h5>
                  <ul className="space-y-0">
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/seo-optimization">SEO Optimization</Link></li>
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/social-media-marketing">Social Media Marketing</Link></li>
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/content-marketing">Content Marketing</Link></li>
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/ppc-ad-campaign">PPC & Ad Campaigns</Link></li>
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/email-marketing">Email Marketing</Link></li>
                  </ul>
                </div>

                {/* Security Services */}
                <div>
                  <h5 className="text-black text-xl font-bold relative pb-2 mb-4 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-red-500">
                    Security Services
                  </h5>
                  <ul className="space-y-0">
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/cyber-security-audits">Cyber Security Audits</Link></li>
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/penetration-testing">Penetration Testing</Link></li>
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/network-security">Network Security</Link></li>
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/data-privacy-compilance">Data Privacy & Compliance</Link></li>
                    <li><Link className="text-gray-700 text-md hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/threat-monitoring">Threat Monitoring</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4">
              {/* Custom Development Highlight */}
              <div className="bg-gray-50 p-3 rounded mb-4 border-l-4 border-red-500 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-2">
                  <svg className='text-white' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></svg>
                  </div>
                  <h6 className="font-bold mb-0">Custom Development</h6>
                </div>
                <p className="text-gray-600 mb-3 text-lg">Tailored software solutions built to address your unique business challenges and goals.</p>
                <div className="flex">
                  <Link to="#" className="border border-red-500 text-red-500 px-3 py-2 rounded text-sm hover:bg-red-500 hover:text-white transition-colors mr-2">
                    Learn More
                  </Link>
                  <Link to="/#contact-form" className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors">
                    Get Started
                  </Link>
                </div>
              </div>

              {/* IT Support */}
              <div className="bg-red-500 p-3 rounded text-white">
                <h5 className="text-white text-xl font-bold mb-2">IT Support & Administration</h5>
                <ul className="mb-3 space-y-1">
                  <li><Link className="text-white/75 block underline decoration-white  text-md hover:text-white transition-colors" to="https://www.zimlitech.com/services/server-administrator">Server Administration</Link></li>
                  <li><Link className="text-white/75 block underline decoration-white text-md hover:text-white transition-colors" to="https://www.zimlitech.com/services/it-consulting">IT Consulting</Link></li>
                  <li><Link className="text-white/75 block  underline decoration-white text-md hover:text-white transition-colors" to="https://www.zimlitech.com/services/technical-support">Technical Support</Link></li>
                  <li><Link className="text-white/75 block underline decoration-white text-md hover:text-white transition-colors mb-4" to="https://www.zimlitech.com/services/system-monitoring">System Monitoring</Link></li>
                </ul>
                <a href="/#contact-form" className="border border-white text-white px-4 py-2 lg:mt-6 rounded text-base hover:bg-white hover:text-black transition-colors">
                  Contact Our Team
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Mega Menu */}
      <div 
        className={`fixed top-16 sm:top-20 lg:top-[69px] left-0 w-full bg-white border-t border-gray-200 z-40 shadow-lg transition-all duration-200 hidden lg:block ${
          activeMenu === 'products' ? 'lg:block opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
        }`}
        onMouseEnter={() => handleMenuHover('products')}
        onMouseLeave={handleMenuLeave}
      >
        <div className="container mx-auto px-4 lg:px-20 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Featured Products */}
            <div>
              <h5 className="text-black text-xl font-bold relative pb-2 mb-4 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-red-500">
                Featured Products
              </h5>
              <ul className="space-y-0 text-md">
                <li><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/zimbiz-pos">ZimBiz POS System</Link></li>
                <li><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/gogo-maps">GoGo Maps</Link></li>
                <li><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/moola-app">Moola App</Link></li>
                <li><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/audio-watermark">Audio Watermark</Link></li>
                <li><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/mappit-app">Mappit App</Link></li>
              </ul>
            </div>

            {/* Enterprise Solutions */}
            <div>
              <h5 className="text-black text-xl font-bold relative pb-2 mb-4 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-red-500">
                Enterprise Solutions
              </h5>
              <ul className="space-y-0 text-md">
                <li><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/zimli-erp">ZimliERP</Link></li>
                <li><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/datasync-platform">DataSync Platform</Link></li>
                <li><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/cloud-guard">CloudGuard Security</Link></li>
                <li><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/hr-management">HR Management Suite</Link></li>
              </ul>
            </div>

            {/* Mobile Applications */}
            <div>
              <h5 className="text-black text-xl font-bold relative pb-2 mb-4 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-red-500">
                Mobile Applications
              </h5>
              <ul className="space-y-0 text-md">
                <li><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/task-tracker">TaskTracker</Link></li>
                <li><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/health-monitor">HealthMonitor</Link></li>
                <li><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/smart-shopper">SmartShopper</Link></li>
                <li><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/travel-companion">TravelCompanion</Link></li>
              </ul>
            </div>

            {/* Featured Product Highlight */}
            <div>
              <div className="bg-gray-50 p-3 rounded border-l-4 border-red-500 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-2">
                  <svg className='text-white' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
                  </div>
                  <h6 className="font-bold mb-0">Featured: ZimBiz POS</h6>
                </div>
                <p className="text-gray-600 mb-2 text-md">Complete point-of-sale solution with inventory management, analytics, and customer loyalty programs.</p>
                <Link to="https://www.zimlitech.com/zimbiz-pos" className="border w-fit text-center font-semibold inline-block border-red-500 text-red-500 px-3 py-2 rounded text-sm hover:bg-red-500 hover:text-white transition-colors">
                  Learn More about ZimBiz Pos-Our Point of Sale <br /> Solution
                </Link>
              </div>  
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            {/* Try Our Products */}
            <div className="md:col-span-2">
              <div className="bg-gray-50 p-3 rounded">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <h5 className="mb-2 text-xl font-bold">Try Our Products</h5>
                    <p className="text-gray-600 mb-2 text-md">Experience our innovative solutions with a free trial or personalized demo.</p>
                    <div className="flex">
                      <Link to="#" className="border border-red-500 text-red-500 px-6 py-3 rounded text-sm hover:bg-red-500 hover:text-white transition-colors mr-2">
                        Free Trials
                      </Link>
                      <Link to="https://www.zimlitech.com/#contact-form" className="bg-red-500 text-white px-6 py-3 rounded text-sm hover:bg-red-700 transition-colors">
                        Request Demo
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* For Developers */}
            <div>
              <h5 className="text-black text-xl font-bold relative pb-2 mb-4 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-red-500">
                For Developers <span><i className="fas fa-crown text-yellow-500"></i></span>
              </h5>
              <ul className="space-y-0 text-md">
                <li><p className="text-gray-700 py-1  mt-4">Developer Portal</p></li>
                <li><p className="text-gray-700 py-1 ">API Documentation</p></li>
                <li><p className="text-gray-700 py-1 ">SDK Downloads</p></li>
              </ul>
            </div>

            {/* Product Support */}
            <div>
              <h5 className="text-black text-xl font-bold relative pb-2 mb-4 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-red-500">
                Product Support
              </h5>
              <ul className="text-md">
                <li><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/knowledge-base">Knowledge Base</Link></li>
                <li><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/services/technical-support">Technical Support</Link></li>
                <li><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 block py-1" to="https://www.zimlitech.com/training-resources">Training Resources</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Mega Menu */}
      <div 
        className={`fixed top-16 sm:top-20 lg:top-[69px] left-0 w-full bg-white border-t border-gray-200 z-40 shadow-lg transition-all duration-200 hidden lg:block ${
          activeMenu === 'insights' ? 'lg:block opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
        }`}
        onMouseEnter={() => handleMenuHover('insights')}
        onMouseLeave={handleMenuLeave}
      >
        <div className="container mx-auto px-4 lg:px-20 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Articles */}
                <div className="mb-4">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <svg className='text-red-500' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18h-5"/><path d="M18 14h-8"/><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="10" y="6" rx="1"/></svg>
                    </div>
                    <h5 className="mb-0 text-xl font-bold">Articles</h5>
                  </div>
                  <ul className="mt-4 pl-1 space-y-2 text-md">
                    <li><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 flex items-center" to="https://www.zimlitech.com/insights/technology-trend">
                      <svg className="text-red-500 mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>Technology Trends 2023</span>
                    </Link></li>
                    <li><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 flex items-center" to="https://www.zimlitech.com/insights/ai-business-operations">
                      <svg className="text-red-500 mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>AI in Business Operations</span>
                    </Link></li>
                    <li><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 flex items-center" to="https://www.zimlitech.com/insights/future-web-development">
                      <svg className="text-red-500 mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>Future of Web Development</span>
                    </Link></li>
                  </ul>
                </div>

                {/* Case Studies */}
                <div className="mb-4">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <svg className='text-red-500' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12h.01"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M22 13a18.15 18.15 0 0 1-20 0"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
                    </div>
                    <h5 className="mb-0 text-xl font-bold"> Case Studies</h5>
                  </div>
                  <ul className="mt-4 pl-1 space-y-2 text-md">
                    <li ><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 flex items-center" to="https://www.zimlitech.com/insights/ecommerce-platform-migration">
                      <svg className="text-red-500 mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>E-commerce Platform Migration</span>
                    </Link></li>
                    <li><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 flex items-center" to="https://www.zimlitech.com/insights/healthcare-app-development">
                      <svg className="text-red-500 mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>Healthcare App Development</span>
                    </Link></li>
                    <li><Link className="text-gray-700 hover:text-red-500 transition-all duration-200 hover:translate-x-1 flex items-center" to="https://www.zimlitech.com/insights/fintech-solutions">
                      <svg className="text-red-500 mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>FinTech Security Solutions</span>
                    </Link></li>
                  </ul>
                </div>

                {/* Videos & Webinars */}
                <div className="mb-4">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <svg className='text-red-500' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <h5 className="mb-0 text-xl font-bold">Videos & Webinars</h5>
                      {/* <span><i className="fas fa-crown  text-yellow-500"></i></span> */}
                    </div>
                  </div>
                  <ul className="mt-4 pl-1 space-y-2 text-md">
                    <li><p className="text-gray-700 flex items-center">
                      <svg className="text-red-500 mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>AI Development Masterclass</span>
                    </p></li>
                    <li><p className="text-gray-700 flex items-center">
                      <svg className="text-red-500 mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>Cloud Security Summit</span>
                    </p></li>
                    <li><p className="text-gray-700 flex items-center">
                      <svg className="text-red-500 mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>UX Design Principles</span>
                    </p></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-4 lg:pl-4">
              <div className="bg-gray-50 p-4 rounded shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="w-11 h-11 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <svg className='text-white' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="13" x="6" y="4" rx="2"/><path d="m22 7-7.1 3.78c-.57.3-1.23.3-1.8 0L6 7"/><path d="M2 8v11c0 1.1.9 2 2 2h14"/></svg>
                  </div>
                  <div>
                    <h5 className="mb-1 text-xl font-bold">Newsletter</h5>
                    <p className="mb-0 text-gray-600 font-normal">Stay updated with our insights</p>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Link to="#" className="bg-red-500 text-white px-4 py-2 rounded text-center hover:bg-red-700 transition-colors">
                    Subscribe Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add spacing to avoid content being hidden under navbar */}
      <div className="pt-16 sm:pt-20 lg:pt-[69px]"></div>
    </>
  );
};

export default Navbar; 