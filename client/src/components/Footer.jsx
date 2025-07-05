import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-[linear-gradient(to_right,_rgb(20,42,66),_rgb(12,25,39),_hsl(210,100%,0.4%),_hsl(0,0%,0%),_hsl(0,0%,0%),_hsl(0,0%,0%),_hsl(0,0%,0%))] text-white py-10 pb-32 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-6">
          {/* Company Info */}
          <div className="text-center lg:pl-20 lg:text-left lg:col-span-3">
            <h2 className="text-3xl font-bold mb-4">
              Zimli<span className="text-red-500">Tech</span>
            </h2>
            <p className="text-gray-200 text-sm leading-relaxed mb-6 lg:mb-8 max-w-md mx-auto lg:mx-0">
              Providing cutting-edge AI, cloud, and software solutions tailored for businesses worldwide.
            </p>
          </div>

          {/* Services */}
          <div className="text-center lg:text-left lg:col-span-2">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-400 lg:text-muted mb-4 lg:mb-4">Services</h3>
            <ul className="space-y-2 lg:space-y-0 text-sm">
              <li><Link to="https://www.zimlitech.com/services/web-development" className="text-white lg:text-white hover:text-gray-500 transition-colors duration-200 ">Web Development</Link></li>
              <li><Link to="https://www.zimlitech.com/services/data-analytics" className="text-white lg:text-white hover:text-gray-500 transition-colors duration-200">Data Analytics</Link></li>
              <li><Link to="https://www.zimlitech.com/services/cloud-migration" className="text-white lg:text-white hover:text-gray-500 transition-colors duration-200">Cloud Migration</Link></li>
              <li><Link to="https://www.zimlitech.com/services/ui-ux-design" className="text-white lg:text-white hover:text-gray-500 transition-colors duration-200">UI/UX Design</Link></li>
              <li><Link to="https://www.zimlitech.com/services/seo-optimization" className="text-white lg:text-white hover:text-gray-500 transition-colors duration-200">SEO Optimization</Link></li>
              <li><Link to="https://www.zimlitech.com/services/cyber-security-audits" className="text-white lg:text-white hover:text-gray-500 transition-colors duration-200 ">Cyber Security Audits</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div className="text-center lg:text-left lg:col-span-2">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-400 lg:text-muted mb-4 lg:mb-4">Products</h3>
            <ul className="space-y-2 lg:space-y-0">
              <li><Link to="https://www.zimlitech.com/zimbiz-pos" className="text-white lg:text-white hover:text-gray-500 transition-colors duration-200 text-sm">ZimBiz POS System</Link></li>
              <li><Link to="https://www.zimlitech.com/gogo-maps" className="text-white lg:text-white hover:text-gray-500 transition-colors duration-200 text-sm">GoGo Maps</Link></li>
              <li><Link to="https://www.zimlitech.com/moola-app" className="text-white lg:text-white hover:text-gray-500 transition-colors duration-200 text-sm">Moola App</Link></li>
              <li><Link to="https://www.zimlitech.com/task-tracker" className="text-white lg:text-white hover:text-gray-500 transition-colors duration-200 text-sm">TaskTracker</Link></li>
              <li><Link to="https://www.zimlitech.com/training-resources" className="text-white lg:text-white hover:text-gray-500 transition-colors duration-200 text-sm">Training Resources</Link></li>
              <li><Link to="https://www.zimlitech.com/services/technical-support" className="text-white lg:text-white hover:text-gray-500 transition-colors duration-200 text-sm">Technical Support</Link></li>
            </ul>
          </div>

          {/* Industries */}
          <div className="text-center lg:text-left lg:col-span-2">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-400 lg:text-muted mb-4 lg:mb-4">Industries</h3>
            <ul className="space-y-2 lg:space-y-0">
              <li><Link to="https://www.zimlitech.com/insights/technology-trend" className="text-white lg:text-white hover:text-gray-500 transition-colors duration-200 text-sm">Technology Trends 2023</Link></li>
              <li><Link to="https://www.zimlitech.com/insights/ai-business-operations" className="text-white lg:text-white hover:text-gray-500 transition-colors duration-200 text-sm">AI in Business Operations</Link></li>
              <li><Link to="https://www.zimlitech.com/insights/future-web-development" className="text-white lg:text-white hover:text-gray-500 transition-colors duration-200 text-sm">Future of Web Development</Link></li>
            </ul>
          </div>

          {/* Insights */}
          <div className="text-center lg:text-left lg:col-span-2">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-400 lg:text-muted mb-4 lg:mb-4">Insights</h3>
            <ul className="space-y-2 lg:space-y-0">
              <li><Link to="https://www.zimlitech.com/insights/ecommerce-platform-migration" className="text-white lg:text-white hover:text-gray-500 transition-colors duration-200 text-sm">E-commerce Platform Migration</Link></li>
              <li><Link to="https://www.zimlitech.com/insights/healthcare-app-development" className="text-white lg:text-white hover:text-gray-500 transition-colors duration-200 text-sm">Healthcare App Development</Link></li>
              <li><Link to="https://www.zimlitech.com/insights/fintech-solutions" className="text-white lg:text-white hover:text-gray-500 transition-colors duration-200 text-sm">FinTech Security Solutions</Link></li>
            </ul>
          </div>

          {/* About Us */}
          <div className="text-center lg:text-left lg:col-span-1">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-400 lg:text-muted mb-4 lg:mb-4">About Us</h3>
            <ul className="space-y-2 lg:space-y-0">
              <li><Link to="#" className="text-white lg:text-white hover:text-gray-500 transition-colors duration-200 text-sm">Careers</Link></li>
              <li><Link to="https://www.zimlitech.com/#contact-form" className="text-white lg:text-white hover:text-gray-500 transition-colors duration-200 text-sm">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-700 my-8 lg:my-4 " />

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between lg:px-10 items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-white lg:text-white text-sm">
              © 2025 ZimliTech. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6 lg:space-x-8">
            <a 
              href="https://www.facebook.com/zimlitech/" 
              className="text-gray-300 lg:text-gray-500 hover:text-white transition-colors duration-200"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/zimlitechnologies/" 
              className="text-gray-300 lg:text-gray-500 hover:text-white transition-colors duration-200"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.875-.163-1.297-.49-.422-.327-.49-.807-.49-1.297s.068-.97.49-1.297c.422-.327.807-.49 1.297-.49s.875.163 1.297.49c.422.327.49.807.49 1.297s-.068.97-.49 1.297c-.422.327-.807.49-1.297.49z"/>
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/company/zimli-technologies/posts/?feedView=all" 
              className="text-gray-300 lg:text-gray-500 hover:text-white transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
