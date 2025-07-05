import React from 'react';

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-1 sm:p-2 md:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto mt-2 sm:mt-4 md:mt-0 relative animate-fade-in modal-content">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          <button
            className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 text-gray-400 hover:text-primary text-lg sm:text-xl md:text-2xl lg:text-3xl transition-colors z-10 bg-white rounded-full w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center shadow-sm"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
          {title && (
            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 md:mb-6 pr-6 sm:pr-8 md:pr-12 text-gray-800">
              {title}
            </h3>
          )}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal; 