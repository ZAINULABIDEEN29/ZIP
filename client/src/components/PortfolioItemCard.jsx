import React from 'react';
import { ExternalLink, Github, Calendar, Tag, Trash2, User } from 'lucide-react';

const techColors = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-yellow-100 text-yellow-800',
  'bg-teal-100 text-teal-800',
  'bg-orange-100 text-orange-800',
  'bg-cyan-100 text-cyan-800',
  'bg-red-100 text-red-800',
];

// Accept githubProfileUrl as a prop, fallback to a default profile if not provided
// const DEFAULT_GITHUB_PROFILE = 'https://github.com/';

const PortfolioItemCard = ({ project, onDelete, githubProfileUrl }) => {
  return (
    <div className="relative bg-white border border-gray-200 rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl hover:border-primary transition-all duration-200 group">
      {/* TEST BUTTON FOR DEBUGGING */}

      {/* Floating Delete Button */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-3 right-3 z-10 bg-white border border-red-200 text-red-500 hover:bg-red-500 hover:text-white rounded-full p-2 shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-300"
          title="Delete Project"
        >
          <Trash2 size={18} />
        </button>
      )}
      <div className="relative">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-auto max-h-80 object-contain rounded-t-3xl border-b border-gray-100 group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-gradient-to-r from-primary to-blue-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md">
            {project.category}
          </span>
        </div>
      </div>
      <div className="p-5 sm:p-6 lg:p-8 flex flex-col h-full">
        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2 line-clamp-2">
          {project.title}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-3 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <span 
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1 ${techColors[index % techColors.length]}`}
            >
              <Tag size={13} />
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Calendar size={15} />
          {project.completedDate ? new Date(project.completedDate).toLocaleDateString() : 'Date not specified'}
        </div>
    
        {/* Responsive, modern action buttons */}
        <div className="flex  flex-row gap-2 mt-6">
          {/* <a
            href={githubProfileUrl || DEFAULT_GITHUB_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-r from-gray-800 to-gray-700 text-white px-4   py-2 rounded-full flex items-center justify-center gap-1 shadow-md hover:from-gray-900 hover:to-gray-800 hover:scale-105 transition-all duration-150 text-base font-semibold"
          >
            <User size={18} />
            GitHub Profile
          </a> */}
          <a
            href={project.liveUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 bg-red-700 text-white px-4 py-2 rounded-full flex items-center justify-center gap-2 shadow-md transition-all duration-150 text-base font-semibold ${project.liveUrl ? 'hover:bg-red-500 hover:scale-105' : 'opacity-50 pointer-events-none'}`}
            tabIndex={project.liveUrl ? 0 : -1}
            aria-disabled={!project.liveUrl}
          >
            <ExternalLink size={18} />
            Live Demo
          </a>
        </div>
      </div>
    </div>
  );
};

export default PortfolioItemCard; 