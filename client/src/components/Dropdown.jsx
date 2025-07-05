import React from 'react';

const Dropdown = ({ options = [], value, onChange }) => (
  <select
    className="px-3 py-2 rounded-xl border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary text-sm"
    value={value}
    onChange={e => onChange && onChange(e.target.value)}
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

export default Dropdown; 