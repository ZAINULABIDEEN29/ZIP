import React, { useRef } from 'react';

const AvatarUploader = ({ value, onChange, disabled }) => {
  const fileInput = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onChange && onChange(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <img
        src={value}
        alt="Avatar"
        className="w-20 h-20 rounded-full object-cover border-2 border-primary shadow"
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInput}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <button
        type="button"
        className="px-3 py-1 bg-primary text-white rounded-xl text-xs hover:scale-105 transition"
        onClick={() => fileInput.current && fileInput.current.click()}
        disabled={disabled}
      >
        {value ? 'Change Avatar' : 'Upload Avatar'}
      </button>
    </div>
  );
};

export default AvatarUploader; 