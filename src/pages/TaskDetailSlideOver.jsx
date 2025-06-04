import React from 'react';
import { X } from 'lucide-react';
import SpecificTaskDetailCard from './SpecificTaskDetailCard'; 

const TaskDetailSlideOver = ({ isOpen, onClose, data, title }) => {
  if (!isOpen) return null;

  return (
    <>
      
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Slide-over Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-3xl bg-white shadow-xl z-[70] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="slideover-title"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
            <h2 id="slideover-title" className="text-lg font-semibold text-gray-800">
              {title || 'Details'}
            </h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              aria-label="Close panel"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content Area - Renders the SpecificTaskDetailCard */}
          <div className="flex-grow p-4 sm:p-6 overflow-y-auto">
            {data ? (
              <SpecificTaskDetailCard data={data} />
            ) : (
              <p className="text-gray-500 text-center py-8">Loading details...</p>
            )}
          </div>

          <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDetailSlideOver;