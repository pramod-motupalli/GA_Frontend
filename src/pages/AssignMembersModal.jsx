// AssignMembersModal.jsx
import React, { useState, useEffect } from 'react';
import { ChevronDown, CalendarDays, Plus } from 'lucide-react';

const AssignMembersModal = ({ isOpen, onClose, onSubmit, staffList = [] }) => {
  const initialAssignments = () => [
    { id: Date.now(), member: '', priority: '', dueDate: '' },
    { id: Date.now() + 1, member: '', priority: '', dueDate: '' },
  ];
  const [assignments, setAssignments] = useState(initialAssignments());

  useEffect(() => {
    if (isOpen) {
      setAssignments(initialAssignments());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddMember = () => {
    setAssignments([...assignments, { id: Date.now(), member: '', priority: '', dueDate: '' }]);
  };

  const handleChange = (index, field, value) => {
    const newAssignments = assignments.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setAssignments(newAssignments);
  };

  const handleCreateTask = () => {
    // Filter out any rows where a member hasn't been selected or a priority isn't set
    const validAssignments = assignments.filter(a => a.member && a.priority && a.dueDate);
    if (validAssignments.length === 0 && assignments.length > 0) {
        alert("Please select a member, priority, and due date for at least one assignment.");
        return;
    }
    if (validAssignments.length < assignments.length) {
        alert("Some assignments are incomplete and will not be submitted. Ensure member, priority, and due date are set for each.");
    }
    onSubmit(validAssignments);
  };

  const workPriorities = ["High", "Medium", "Low", "Critical", "Normal"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Assign members</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <div className="space-y-3 mb-6 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
          {assignments.map((assignment, index) => (
            <div key={assignment.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="relative">
                <select
                  value={assignment.member}
                  onChange={(e) => handleChange(index, 'member', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" disabled>Select Member</option> {/* Changed placeholder */}
                  {staffList.length === 0 && <option value="" disabled>No staff available</option>}
                  {staffList.map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={assignment.priority}
                  onChange={(e) => handleChange(index, 'priority', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" disabled>Work Priority</option>
                  {workPriorities.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <input
                  type="date" 
                  value={assignment.dueDate}
                  onChange={(e) => handleChange(index, 'dueDate', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  
                />
                <CalendarDays className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddMember}
          className="flex items-center justify-center text-blue-600 hover:text-blue-700 mb-6 border border-gray-300 hover:border-blue-400 rounded-md px-3 py-2 w-full text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add member
        </button>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            cancel
          </button>
          <button
            type="button"
            onClick={handleCreateTask}
            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignMembersModal;