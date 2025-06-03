// src/components/SideSlider.js (create this file)
import React from 'react';
import { X } from 'lucide-react';

const SideSlider = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
        onClick={onClose}
        style={{ opacity: isOpen ? 1 : 0 }}
        aria-hidden="true"
      ></div>

      {/* Slider Panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out w-full sm:w-2/3 md:w-1/2 lg:w-1/3 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="slider-title"
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
            <h2 id="slider-title" className="text-lg font-semibold text-gray-800">{title || 'Details'}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              aria-label="Close panel"
            >
              <X size={24} />
            </button>
          </div>
          <div className="overflow-y-auto flex-grow p-4 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideSlider;