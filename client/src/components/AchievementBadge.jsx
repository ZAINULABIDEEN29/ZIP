import React from 'react';

const AchievementBadge = ({ label, icon: Icon, color = 'bg-primary/10 text-primary' }) => (
  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-2xl text-xs font-semibold ${color}`}>
    {Icon && <Icon size={16} className="inline" />}
    {label}
  </span>
);

export default AchievementBadge; 