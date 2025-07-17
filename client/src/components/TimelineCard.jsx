import React from 'react';
import { CheckCircle, Clock, Target, Calendar, Pencil, Trash2 } from 'lucide-react';
import ProgressBar from './ProgressBar';

const TimelineCard = ({ milestone, onUpdate, onDelete, disableActions }) => {
  const getStatusIcon = () => {
    switch (milestone.status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'in-progress':
        return <Clock className="text-blue-500" size={24} />;
      case 'upcoming':
        return <Target className="text-orange-500" size={24} />;
      default:
        return <Target className="text-gray-300" size={24} />;
    }
  };

  const getStatusColor = () => {
    switch (milestone.status) {
      case 'completed':
        return 'border-green-500';
      case 'in-progress':
        return 'border-blue-500';
      case 'upcoming':
        return 'border-orange-500';
      default:
        return 'border-gray-300';
    }
  };

  const getStatusText = () => {
    switch (milestone.status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'upcoming':
        return 'Upcoming';
      default:
        return 'Unknown';
    }
  };

  // Calculate progress based on status if progress field is 0 or undefined
  const getProgressValue = () => {
    if (milestone.progress && milestone.progress > 0) {
      return milestone.progress;
    }
    
    // Calculate progress based on status
    switch (milestone.status) {
      case 'completed':
        return 100;
      case 'in-progress':
        return 50; // Default to 50% for in-progress
      case 'upcoming':
        return 0;
      default:
        return 0;
    }
  };

  const progressValue = getProgressValue();

  return (
    <div className="flex items-start gap-4 lg:gap-6">
      <div className="flex flex-col items-center">
        {getStatusIcon()}
        <div className={`h-full w-px ${getStatusColor()} flex-1`} />
      </div>
      <div className="bg-white shadow-md rounded-2xl p-6 lg:p-8 flex-1 relative flex flex-col">
        <div className="flex justify-between items-start mb-3 lg:mb-4">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 text-lg lg:text-xl xl:text-2xl mb-2">{milestone.title}</h4>
            <p className="text-gray-600 text-sm lg:text-base xl:text-lg mb-3 lg:mb-4">{milestone.description}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs lg:text-sm font-medium ${
              milestone.status === 'completed' ? 'bg-green-100 text-green-700' :
              milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
              'bg-orange-100 text-orange-700'
            }`}>
              {getStatusText()}
            </span>
            <span className="text-xs lg:text-sm text-gray-500 flex items-center gap-1">
              <Calendar size={14} />
              {new Date(milestone.date).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="space-y-3 lg:space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm lg:text-base text-gray-600">Progress</span>
            <span className="text-sm lg:text-base font-medium text-primary">{progressValue}%</span>
          </div>
          <ProgressBar value={progressValue} />
          <span className="inline-block bg-primary/10 text-primary text-xs lg:text-sm px-3 py-1 rounded-xl font-medium">
            {milestone.category}
          </span>
        </div>
        <div className="mt-auto flex justify-end gap-3 pt-4">
          {onUpdate && (
            <button
              className="px-5 py-2 rounded-xl bg-green-600 text-white font-semibold shadow hover:bg-green-900 transition disabled:opacity-50"
              onClick={onUpdate}
              disabled={disableActions}
              title="Edit Milestone"
              aria-label="Edit Milestone"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              className="px-5 py-2 rounded-xl bg-red-600 text-white font-semibold shadow hover:bg-red-800 transition disabled:opacity-50"
              onClick={onDelete}
              disabled={disableActions}
              title="Delete Milestone"
              aria-label="Delete Milestone"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineCard; 