import React from 'react';
import { Star, Calendar, User } from 'lucide-react';
import StarRating from './StarRating';

const MentorFeedbackCard = ({ feedback }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 hover:shadow-xl transition-shadow">
      <div className="flex items-start gap-4 lg:gap-6 mb-4 lg:mb-6">
        <img 
          src={feedback.avatar} 
          alt={feedback.mentor}
          className="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-lg lg:text-xl xl:text-2xl mb-1">{feedback.mentor}</h3>
          <p className="text-gray-600 text-sm lg:text-base">{feedback.role}</p>
        </div>
      </div>
      
      <div className="mb-4 lg:mb-6">
        <div className="flex items-center gap-2 mb-2">
          <StarRating value={feedback.rating} size={20} />
          <span className="text-sm text-gray-600">{feedback.rating}/5</span>
        </div>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          {feedback.category}
        </span>
      </div>
      
      <p className="text-gray-700 text-sm lg:text-base xl:text-lg mb-4 lg:mb-6 leading-relaxed">
        {feedback.comment}
      </p>
      
      {feedback.suggestions && feedback.suggestions.length > 0 && (
        <div className="mb-4 lg:mb-6">
          <h4 className="font-medium text-gray-800 mb-2 text-sm lg:text-base">Suggestions:</h4>
          <ul className="space-y-1">
            {feedback.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm lg:text-base text-gray-600 flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Calendar size={16} />
        {new Date(feedback.date).toLocaleDateString()}
      </div>
    </div>
  );
};

export default MentorFeedbackCard; 