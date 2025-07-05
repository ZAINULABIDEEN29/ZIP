import React from 'react';

const levelStyles = {
  Beginner: 'bg-blue-100 text-blue-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-green-100 text-green-700',
};

const SkillLevelTag = ({ level = 'Beginner' }) => (
  <span
    className={`px-2 py-1 rounded-xl text-xs font-semibold ${levelStyles[level] || levelStyles.Beginner}`}
  >
    {level}
  </span>
);

export default SkillLevelTag; 