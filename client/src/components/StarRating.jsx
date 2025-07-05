import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ value = 0, onChange }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none"
          onClick={onChange ? () => onChange(star) : undefined}
        >
          <Star
            size={20}
            className={
              star <= value
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }
            strokeWidth={1.5}
            fill={star <= value ? 'currentColor' : 'none'}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating; 