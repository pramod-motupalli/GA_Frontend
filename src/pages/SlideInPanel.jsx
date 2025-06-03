// ./components/SlideInPanel.js
import React from 'react';
import { X } from 'lucide-react';

const SlideInPanel = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[55] transition-opacity duration-300 ease-in-out"
        onClick={onClose}
        style={{ opacity: isOpen ? 1 : 0 }}
      ></div>

      {/* Panel */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-[60] transition-transform duration-300 ease-in-out flex flex-col
                    w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl`} // Responsive width
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            aria-label="Close panel"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          {children}
        </div>
      </div>
    </>
  );
};

export default SlideInPanel;